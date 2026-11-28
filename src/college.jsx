import { challenges, challengeSources } from './challenge-data'
import React, { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  LockKeyhole,
  MessageSquare,
  Route,
  Search,
  Send,
  Upload,
} from 'lucide-react'
import { Empty, Header, IconTile, Select } from './ui'
import { assignments, courses, materials, notices } from './data'
import { downloadFile, saveFile } from './files'
import { materialCatalogue } from './store'
import { readGateStore } from './n5-gate-engine.js'
import {
  formatOfficeInspectionText,
  ingestOfficeFile,
  readOfficeIngestStore,
  recordOfficeInspection,
  writeOfficeIngestStore,
} from './office-ingest.js'
import {
  createIssueTicket,
  dismissAlertForStudent,
  readLecturerStore,
  replyToIssueTicket,
  togglePathwayStep,
  writeLecturerStore,
} from './lecturer-engine.js'
import { LecturerConsole } from './LecturerConsole.jsx'

const unique = (items, key) => [...new Set(items.map((item) => item[key]))].sort()
const date = () => new Date().toISOString()
const stamp = (value) =>
  value && new Date(value).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' })

function triggerTextDownload(filename, text) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

export function useFiles(update, notify) {
  return async (version, item) => {
    try {
      await downloadFile(version)
      if (item)
        update((s) => ({
          ...s,
          downloads: [
            ...s.downloads,
            {
              id: item.id,
              title: item.title,
              course: item.course,
              version: version.label,
              date: date(),
              student: 'Demo student',
            },
          ],
        }))
      notify('Download started.')
    } catch (error) {
      notify(error.message || 'Download unavailable.')
    }
  }
}

function MaterialCard({ item, state, update, download }) {
  const [attempt, setAttempt] = useState('')
  const memo = item.memoOnly ? item.versions.at(-1) : item.memo
  const receipt = state.paperAttempts[item.id]
  const completed = receipt || state.activity.includes(item.id)
  return (
    <article className="card material-card">
      <div className="row-card">
        <IconTile icon={FileText} color={item.type === 'Past paper' ? 'peach' : 'mint'} />
        <div>
          <small>
            {item.type} · {item.session}
          </small>
          <h3>{item.title}</h3>
          <p>{item.note || [item.topic, item.app].join(' / ')}</p>
        </div>
        {!item.memoOnly && (
          <button
            className="btn outline push-right"
            onClick={() => download(item.versions.at(-1), item)}
          >
            <Download size={17} /> Download
          </button>
        )}
      </div>
      <div className="material-meta">
        <span className="pill neutral">Latest · {item.versions.at(-1).label}</span>
        <span className="muted compact">Downloads can be reopened offline on this device.</span>
      </div>
      {item.versions.length > 1 && (!item.memoOnly || completed) && (
        <details>
          <summary>Version history ({item.versions.length})</summary>
          {[...item.versions].reverse().map((v) => (
            <div className="history-row" key={v.id}>
              <span>
                {v.label} · {v.file} {v.date ? ' · ' + stamp(v.date) : ''}
              </span>
              <button className="btn text-button" onClick={() => download(v, item)}>
                <Download size={16} /> Get version
              </button>
            </div>
          ))}
        </details>
      )}
      {memo && (
        <details>
          <summary>
            <LockKeyhole size={15} /> Official marking guideline
          </summary>
          {completed ? (
            <div className="memo">
              <p>Your attempt is recorded on this device.</p>
              {receipt && (
                <p className="prewrap compact">
                  {receipt.notes} · {stamp(receipt.date)}
                </p>
              )}
              <button className="btn outline" onClick={() => download(memo, item)}>
                <Download size={16} /> Download marking guideline
              </button>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                if (attempt.trim())
                  update((s) => ({
                    ...s,
                    paperAttempts: {
                      ...s.paperAttempts,
                      [item.id]: { notes: attempt.trim(), date: date() },
                    },
                  }))
              }}
            >
              <p className="muted compact">
                Complete the paper in your Office applications. Record what you attempted to unlock
                the official marking guideline.
              </p>
              <label className="field">
                <span>Sections attempted and working files saved</span>
                <textarea required value={attempt} onChange={(e) => setAttempt(e.target.value)} />
              </label>
              <button className="btn primary" disabled={!attempt.trim()}>
                Record attempt &amp; reveal memo
              </button>
            </form>
          )}
        </details>
      )}
    </article>
  )
}

export function Library({ state, update, course, setCourse, notify }) {
  const [filter, setFilter] = useState({ query: '', topic: '', app: '', type: '', session: '' })
  const scoped = materialCatalogue(materials, state.materials).filter((row) => row.course === course)
  const rows = scoped.filter((row) =>
    Object.entries(filter).every(([key, value]) =>
      !value
        ? true
        : key === 'query'
          ? [row.title, row.note, row.topic, row.app]
              .join(' ')
              .toLowerCase()
              .includes(value.toLowerCase().trim())
          : row[key] === value
    )
  )
  const download = useFiles(update, notify)
  const references = [
    ...new Set(challenges.filter((row) => row.course === course).flatMap((row) => row.sources)),
  ].map((id) => challengeSources[id])
  return (
    <>
      <Header
        eyebrow="COURSE RESOURCES"
        title="Study Library"
        description="Find past papers, worksheets and course material. Download resources before studying offline."
      />
      <div className="card filter-card">
        <label className="search">
          <Search size={18} />
          <input
            aria-label="Search study material"
            value={filter.query}
            onChange={(e) => setFilter({ ...filter, query: e.target.value })}
            placeholder="Search study material"
          />
        </label>
        <div className="filters">
          <Select
            label="Course"
            options={courses}
            value={course}
            onChange={(id) => {
              setCourse(id)
              setFilter({ query: '', topic: '', app: '', type: '', session: '' })
            }}
          />
          {[
            ['topic', 'Topic'],
            ['app', 'Application or skill'],
            ['type', 'Material type'],
            ['session', 'Exam session'],
          ].map(([key, label]) => (
            <Select
              key={key}
              label={label}
              options={unique(scoped, key)}
              value={filter[key]}
              all={
                'All ' +
                (key === 'app'
                  ? 'applications'
                  : key === 'type'
                    ? 'types'
                    : key === 'session'
                      ? 'sessions'
                      : key + 's')
              }
              onChange={(value) => setFilter({ ...filter, [key]: value })}
            />
          ))}
        </div>
      </div>
      <div className="section-head">
        <div>
          <h2>
            {rows.length} {rows.length === 1 ? 'resource' : 'resources'}
          </h2>
        </div>
      </div>
      <div className="stack">
        {rows.map((item) => (
          <MaterialCard
            key={item.id}
            item={item}
            state={state}
            update={update}
            download={download}
          />
        ))}
      </div>
      {!rows.length && scoped.length > 0 && (
        <Empty icon={BookOpen} title="No matching resources">
          <button
            className="btn outline"
            onClick={() => setFilter({ query: '', topic: '', app: '', type: '', session: '' })}
          >
            Clear filters
          </button>
        </Empty>
      )}
      {references.length > 0 && (
        <section>
          <div className="section-head">
            <div>
              <h2>Reading and practice references</h2>
              <p>Optional source links for this course. Drive may ask you to sign in.</p>
            </div>
          </div>
          <div className="lab-grid">
            {references.map((ref) => (
              <a
                className="card padded library-reference"
                key={ref.url}
                href={ref.url}
                target="_blank"
                rel="noreferrer"
              >
                <small>{ref.type}</small>
                <h3>{ref.title}</h3>
              </a>
            ))}
          </div>
        </section>
      )}
    </>
  )
}

export function Assignments({ course, state, update, notify }) {
  const [busy, setBusy] = useState(false)
  const [officeStore, setOfficeStore] = useState(() => readOfficeIngestStore())
  const download = useFiles(update, notify)
  const gateStore = useMemo(() => readGateStore(), [])
  const studentCode = gateStore?.session?.studentCode || 'local-learner'

  async function processOfficeUpload(file, id, contextTag) {
    const buffer = await file.arrayBuffer()
    const report = await ingestOfficeFile({
      fileName: file.name,
      buffer,
      byteSize: file.size,
      studentCode,
      course,
      contextTag,
      fileId: id,
    })
    const next = recordOfficeInspection(officeStore, report)
    setOfficeStore(next)
    writeOfficeIngestStore(next)
    return report
  }

  async function submit(e, assignment) {
    e.preventDefault()
    if (busy) return
    const form = e.currentTarget
    const fields = new FormData(form)
    const file = fields.get('file')
    if (!file?.size) {
      notify('Choose a file to upload.')
      return
    }
    const id = crypto.randomUUID()
    setBusy(true)
    try {
      await saveFile(id, file)
      const report = await processOfficeUpload(file, id, assignment.id)
      update((s) => ({
        ...s,
        submissions: [
          ...s.submissions,
          {
            id,
            assignment: assignment.id,
            title: assignment.title,
            course,
            file: file.name,
            note: fields.get('note'),
            date: date(),
            officeSummary: report?.summary || '',
          },
        ],
      }))
      form.reset()
      notify(
        report?.leakWarnings?.length
          ? `Submission saved · ${report.leakWarnings.length} Office check warning(s) flagged.`
          : 'Submission saved and MS Office structure verified.'
      )
    } catch {
      notify('This device could not store the file.')
    } finally {
      setBusy(false)
    }
  }

  async function inspectOnly(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const id = crypto.randomUUID()
      await saveFile(id, file)
      const report = await processOfficeUpload(file, id, 'office-self-check')
      notify(
        report?.leakWarnings?.length
          ? `Inspected ${file.name}: ${report.leakWarnings.length} leak warning(s) found.`
          : `Inspected ${file.name}: ${report.summary}`
      )
    } catch {
      notify('Could not inspect the selected Office file.')
    } finally {
      setBusy(false)
    }
  }

  const courseReports = [...(officeStore.reports || [])]
    .filter((r) => r.course === course)
    .reverse()
    .slice(0, 6)

  return (
    <>
      <Header
        eyebrow="COURSEWORK & MS OFFICE CONSUMPTION"
        title="Assignments"
        description="Attach your Microsoft Word (.docx), Excel (.xlsx), CSV, or OneNote export files. ComputeLab inspects formulas, references, styles, merge fields, and print setup automatically."
      />
      <div className="stack">
        <article className="card padded">
          <div className="row-card">
            <IconTile icon={FileSpreadsheet} color="mint" />
            <div>
              <small>CLIENT-SIDE OOXML INSPECTOR</small>
              <h2>Check an MS Office file before submission</h2>
              <p className="compact">
                Upload your `.xlsx`, `.docx`, `.csv`, or `.txt` practice file to verify live Excel formulas, `$` locks, Word Heading styles, Merge fields, and Print setup.
              </p>
            </div>
          </div>
          <label className="field" style={{ marginTop: 10 }}>
            <span>Inspect Office file (.xlsx, .docx, .csv, .txt)</span>
            <input
              type="file"
              accept=".xlsx,.xlsm,.docx,.csv,.txt,.md,.html"
              disabled={busy}
              onChange={inspectOnly}
            />
          </label>
        </article>

        {assignments
          .filter((row) => row.course === course)
          .map((row) => (
            <article className="card padded" key={row.id}>
              <IconTile icon={ClipboardList} color="blue" />
              <h2>{row.title}</h2>
              <p>{row.description}</p>
              <form onSubmit={(e) => submit(e, row)}>
                <label className="field">
                  <span>Working file (.xlsx, .docx, .pdf, .csv)</span>
                  <input required type="file" name="file" />
                </label>
                <label className="field">
                  <span>Submission note (optional)</span>
                  <textarea name="note" />
                </label>
                <button className="btn primary" disabled={busy}>
                  <Upload size={16} /> Save &amp; inspect submission
                </button>
              </form>
              {state.submissions
                .filter((v) => v.assignment === row.id)
                .slice()
                .reverse()
                .map((v) => (
                  <div className="history-row" key={v.id}>
                    <div>
                      <strong>{v.file}</strong>
                      <p className="compact muted">
                        Saved locally · {stamp(v.date)}
                        {v.officeSummary ? ` · ${v.officeSummary}` : ''}
                      </p>
                      {v.note && <p>{v.note}</p>}
                    </div>
                    <button className="btn text-button" onClick={() => download(v)}>
                      <Download size={17} /> Download
                    </button>
                  </div>
                ))}
            </article>
          ))}

        {courseReports.length > 0 && (
          <section className="card padded">
            <h2>Recent MS Office Inspections ({courseReports.length})</h2>
            <div className="stack" style={{ marginTop: 10 }}>
              {courseReports.map((r) => (
                <article className="card padded" key={r.id}>
                  <div className="row-card">
                    <div>
                      <small>
                        {r.kind.toUpperCase()} · {stamp(r.analyzedAt)}
                      </small>
                      <h3>{r.fileName}</h3>
                      <p className="compact">{r.summary}</p>
                    </div>
                    <button
                      className="btn outline push-right"
                      onClick={() =>
                        triggerTextDownload(`${r.fileName}-Inspection.txt`, formatOfficeInspectionText(r))
                      }
                    >
                      <FileText size={15} /> Report
                    </button>
                  </div>
                  {r.detectedSignals?.length > 0 && (
                    <p className="compact" style={{ marginTop: 6 }}>
                      <strong>Detected:</strong> {r.detectedSignals.join(' · ')}
                    </p>
                  )}
                  {r.rubricMatches?.length > 0 && (
                    <ul style={{ marginTop: 6 }}>
                      {r.rubricMatches.map((m, idx) => (
                        <li key={idx} className="success-text">
                          ✓ {m}
                        </li>
                      ))}
                    </ul>
                  )}
                  {r.leakWarnings?.length > 0 && (
                    <div className="stack" style={{ marginTop: 6 }}>
                      {r.leakWarnings.map((w, idx) => (
                        <div className="n5g-alert warn" key={idx}>
                          <AlertTriangle size={16} />
                          <div>
                            <strong>[{w.leak}]</strong> {w.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}

export function Feedback({ state, update, course, admin = false, notify }) {
  const [lecturerStore, setLecturerStore] = useState(() => readLecturerStore())
  const [issueType, setIssueType] = useState('assessment')
  const [priority, setPriority] = useState('normal')
  const [subject, setSubject] = useState('')
  const [details, setDetails] = useState('')
  const [followUpDrafts, setFollowUpDrafts] = useState({})

  const gateStore = useMemo(() => readGateStore(), [])
  const studentCode = gateStore?.session?.studentCode || 'local-learner'
  const studentName = gateStore?.session
    ? `${gateStore.session.firstName} ${gateStore.session.lastName}`
    : 'Local Learner'

  const items = state.feedback
    .filter((item) => (admin ? courses.some((c) => c.id === item.course) : item.course === course))
    .slice()
    .reverse()

  const activeAlerts = (lecturerStore.alerts || []).filter(
    (a) =>
      (a.targetStudentCode === 'ALL' || a.targetStudentCode === studentCode) &&
      !(a.dismissedBy || []).includes(studentCode)
  )
  const customPathway = lecturerStore.customPathways?.[studentCode] || null
  const gateDecision = lecturerStore.gateDecisions?.[studentCode] || null
  const myTickets = (lecturerStore.issues || []).filter((i) =>
    admin ? true : i.studentCode === studentCode || i.studentCode === 'local-learner'
  )

  function commitLecturer(next) {
    setLecturerStore(next)
    writeLecturerStore(next)
  }

  function submitTicket(e) {
    e.preventDefault()
    const res = createIssueTicket(lecturerStore, {
      studentCode,
      studentName,
      course,
      issueType,
      priority,
      subject,
      details,
      route: 'feedback',
    })
    if (!res.ok) {
      notify(res.error)
      return
    }
    commitLecturer(res.store)
    setSubject('')
    setDetails('')
    notify('Help request sent to the Lecturer Console on this device.')
  }

  function sendStudentReply(e, issueId) {
    e.preventDefault()
    const body = String(followUpDrafts[issueId] || '').trim()
    if (!body) return
    const res = replyToIssueTicket(lecturerStore, {
      issueId,
      authorRole: 'student',
      authorName: studentName,
      body,
    })
    if (res.ok) {
      commitLecturer(res.store)
      setFollowUpDrafts((p) => ({ ...p, [issueId]: '' }))
      notify('Follow-up saved.')
    }
  }

  function post(e) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const title = String(data.get('title')).trim()
    const body = String(data.get('body')).trim()
    if (!title || !body) return
    update((s) => ({
      ...s,
      feedback: [...s.feedback, { id: crypto.randomUUID(), title, body, course, date: date(), replies: [] }],
    }))
    e.currentTarget.reset()
    notify('Feedback saved on this device.')
  }

  function reply(e, id) {
    e.preventDefault()
    const body = String(new FormData(e.currentTarget).get('reply')).trim()
    if (!body) return
    update((s) => ({
      ...s,
      feedback: s.feedback.map((row) =>
        row.id === id ? { ...row, replies: [...row.replies, { id: crypto.randomUUID(), body, date: date() }] } : row
      ),
    }))
    e.currentTarget.reset()
    notify('Reply saved.')
  }

  return (
    <div className="stack">
      {!admin && (
        <>
          <Header
            eyebrow="STUDENT–LECTURER COMMUNICATION & HELP"
            title="Help, Issues & Lecturer Feedback"
            description="Report technical or assessment issues, view lecturer alerts and your custom remediation pathway, and exchange replies."
          />

          {activeAlerts.length > 0 && (
            <section className="card padded">
              <h2>
                <Bell size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Lecturer Alerts ({activeAlerts.length})
              </h2>
              <div className="stack" style={{ marginTop: 8 }}>
                {activeAlerts.map((a) => (
                  <div className="n5g-alert warn" key={a.id}>
                    <AlertTriangle size={17} />
                    <div style={{ flex: 1 }}>
                      <strong>
                        [{a.severity.toUpperCase()}] {a.title}
                      </strong>
                      <div className="compact">{a.message}</div>
                      <small className="muted">
                        From {a.createdBy} · {stamp(a.createdAt)}
                      </small>
                    </div>
                    <button
                      className="btn outline"
                      onClick={() => commitLecturer(dismissAlertForStudent(lecturerStore, a.id, studentCode))}
                    >
                      Dismiss
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {(customPathway || gateDecision) && (
            <section className="card padded">
              <h3>
                <Route size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Lecturer Remediation Pathway &amp; Gate Status ({studentCode})
              </h3>
              {gateDecision && (
                <p className="compact" style={{ marginTop: 6 }}>
                  <strong>Gate Status:</strong> {gateDecision.decision}
                  {gateDecision.note ? ` — ${gateDecision.note}` : ''}
                </p>
              )}
              {customPathway && (
                <div className="stack" style={{ marginTop: 8 }}>
                  <p className="compact">
                    <strong>Guidance ({customPathway.dueLabel}):</strong> {customPathway.note}
                  </p>
                  {customPathway.steps.map((step) => (
                    <label className="n5g-check-item" key={step.id}>
                      <input
                        type="checkbox"
                        checked={Boolean(step.completed)}
                        onChange={() => commitLecturer(togglePathwayStep(lecturerStore, studentCode, step.id))}
                      />
                      <div>
                        <strong>{step.title}</strong> ({step.routeLabel})
                        <small>{step.officeDrill}</small>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </section>
          )}

          <form className="card padded narrow" onSubmit={submitTicket}>
            <h2>Report an Issue / Request Lecturer Help</h2>
            <div className="filters">
              <label className="field">
                <span>Issue category</span>
                <select value={issueType} onChange={(e) => setIssueType(e.target.value)}>
                  <option value="assessment">Assessment / Gate Flow</option>
                  <option value="office_upload">MS Office Upload / Formula Check</option>
                  <option value="content">Concept / Remediation Help</option>
                  <option value="auth">Access / Roster / PIN</option>
                  <option value="sync">Save / Offline Storage</option>
                  <option value="ui">Screen / Mobile Display</option>
                </select>
              </label>
              <label className="field">
                <span>Urgency</span>
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High (Blocking Practice)</option>
                  <option value="blocker">Blocker (Exam / Gate Locked)</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span>Issue subject</span>
              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Excel workbook flagged missing $ lock"
              />
            </label>
            <label className="field">
              <span>What happened?</span>
              <textarea
                required
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Describe what you tried, what you expected, and which module/file you are working on..."
              />
            </label>
            <button className="btn primary">
              <Send size={16} /> Submit Help Ticket
            </button>
          </form>

          {myTickets.length > 0 && (
            <section className="card padded">
              <h2>My Help &amp; Issue Threads ({myTickets.length})</h2>
              <div className="stack" style={{ marginTop: 8 }}>
                {myTickets.map((t) => (
                  <article className="card padded" key={t.id}>
                    <div className="row-card">
                      <div>
                        <small>
                          [{t.issueType} · {t.priority}] · {stamp(t.createdAt)}
                        </small>
                        <h3>{t.subject}</h3>
                        <p className="prewrap">{t.details}</p>
                      </div>
                      <span className="pill neutral push-right">{t.status}</span>
                    </div>
                    {t.replies?.map((r) => (
                      <div className="memo" key={r.id} style={{ marginTop: 8 }}>
                        <small>
                          <strong>{r.authorName}</strong> ({r.authorRole}) · {stamp(r.date)}
                        </small>
                        <p className="prewrap">{r.body}</p>
                      </div>
                    ))}
                    {t.status !== 'resolved' && (
                      <form onSubmit={(e) => sendStudentReply(e, t.id)} style={{ marginTop: 8 }}>
                        <label className="field">
                          <span>Add follow-up note</span>
                          <input
                            value={followUpDrafts[t.id] || ''}
                            onChange={(e) => setFollowUpDrafts((p) => ({ ...p, [t.id]: e.target.value }))}
                            placeholder="Reply to your lecturer..."
                          />
                        </label>
                        <button className="btn outline" type="submit">
                          Send follow-up
                        </button>
                      </form>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          <form className="card padded narrow" onSubmit={post}>
            <h2>Quick course note or general feedback</h2>
            <label className="field">
              <span>Subject</span>
              <input required name="title" />
            </label>
            <label className="field">
              <span>Message</span>
              <textarea required name="body" />
            </label>
            <button className="btn outline">
              <Send size={16} /> Save local note
            </button>
          </form>
        </>
      )}

      {items.map((item) => (
        <article className="card padded" key={item.id}>
          <h3>{item.title}</h3>
          <p className="compact muted">
            {courses.find((c) => c.id === item.course)?.title} · {stamp(item.date)}
          </p>
          <p className="prewrap">{item.body}</p>
          {item.replies.map((r) => (
            <div className="memo" key={r.id}>
              <h4>Lecturer / Admin reply</h4>
              <p className="prewrap">{r.body}</p>
              <small>{stamp(r.date)}</small>
            </div>
          ))}
          {admin && (
            <form onSubmit={(e) => reply(e, item.id)}>
              <label className="field">
                <span>Reply to student</span>
                <textarea name="reply" required />
              </label>
              <button className="btn primary">Save reply</button>
            </form>
          )}
        </article>
      ))}
      {!items.length && !myTickets.length && <Empty icon={MessageSquare} title="No feedback yet" />}
    </div>
  )
}

async function deviceNotification(title, body) {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false
  const registration = await navigator.serviceWorker.getRegistration()
  if (Notification.permission !== 'granted' || !registration?.active) return false
  await registration.showNotification(title, { body, icon: '/icon-192.png' })
  return true
}

export function Notices({ state, notify }) {
  async function test() {
    try {
      if (!('Notification' in window)) {
        notify('Device notifications are unavailable in this browser.')
        return
      }
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        notify('Notifications need browser permission.')
        return
      }
      const shown = await deviceNotification('Sankofa ComputeLab', 'Device notification test.')
      notify(
        shown ? 'Test notification sent to this device.' : 'Notifications need an active service worker.'
      )
    } catch {
      notify('Device notifications are unavailable in this browser.')
    }
  }
  return (
    <>
      <Header
        eyebrow="COLLEGE INFORMATION"
        title="College Notices"
        description="See announcements saved on this device. Live push delivery requires a connected service."
      >
        <button className="btn outline" onClick={test}>
          <Bell size={17} /> Test device notifications
        </button>
      </Header>
      <div className="stack">
        {[...state.notices]
          .reverse()
          .concat(notices)
          .map((row) => (
            <article className="card row-card notice" key={row.id}>
              <IconTile icon={Bell} color="peach" />
              <div>
                <small>{row.date === 'Sample college notice' ? row.date : stamp(row.date)}</small>
                <h3>{row.title}</h3>
                <p className="prewrap">{row.body}</p>
              </div>
            </article>
          ))}
      </div>
    </>
  )
}

export function Admin({ state, update, notify, leave }) {
  return <LecturerConsole state={state} update={update} notify={notify} leave={leave} />
}

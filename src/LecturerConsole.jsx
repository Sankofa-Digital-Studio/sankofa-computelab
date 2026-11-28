import React, { useMemo, useState } from 'react'
import {
  AlertTriangle,
  Bell,
  BookOpenCheck,
  CheckCircle2,
  ClipboardList,
  Download,
  FileSpreadsheet,
  FileText,
  Lock,
  LogOut,
  MessageSquare,
  Plus,
  Route,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react'
import { Empty, Header, IconTile, Select } from './ui.jsx'
import { courses, materials } from './data.js'
import { downloadFile, saveFile } from './files.js'
import { materialCatalogue, score } from './store.js'
import { COMPLIANCE_MATRIX, LECTURER_SCRIPTS, LEAK_TO_PATHWAY_MAP } from './lecturer-data.js'
import {
  DEFAULT_LECTURER_PIN,
  assignCustomPathway,
  buildCohortDiagnostics,
  createIssueTicket,
  formatCohortReportCsv,
  formatCohortReportText,
  loadAllLocalStoresSnapshot,
  lockLecturerConsole,
  readLecturerStore,
  recordGateDecision,
  replyToIssueTicket,
  sendLecturerAlert,
  updateIssueStatus,
  verifyLecturerPin,
  writeLecturerStore,
} from './lecturer-engine.js'
import {
  formatOfficeInspectionText,
  ingestOfficeFile,
  readOfficeIngestStore,
  recordOfficeInspection,
  writeOfficeIngestStore,
} from './office-ingest.js'

const stamp = (value) =>
  value ? new Date(value).toLocaleString('en-ZA', { dateStyle: 'medium', timeStyle: 'short' }) : ''

function triggerDownload(filename, content, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

function priorityLabel(priority) {
  if (priority === 'integrity_hold') return 'Integrity Hold'
  if (priority === 'urgent') return 'Urgent'
  if (priority === 'watch') return 'Watch'
  if (priority === 'routine') return 'Stable'
  return 'Not Started'
}

function statusPillClass(priority) {
  if (priority === 'integrity_hold' || priority === 'urgent') return 'n5g-band-pill critical'
  if (priority === 'watch') return 'n5g-band-pill developing'
  if (priority === 'routine') return 'n5g-band-pill exam-ready'
  return 'pill neutral'
}

export function LecturerConsole({ state, update, notify, leave }) {
  const [lecturerStore, setLecturerStore] = useState(() => readLecturerStore())
  const [officeStore, setOfficeStore] = useState(() => readOfficeIngestStore())
  const [pinInput, setPinInput] = useState('')
  const [nameInput, setNameInput] = useState(lecturerStore.lecturerName || 'Lead Lecturer')
  const [authError, setAuthError] = useState('')
  const [tab, setTab] = useState('diagnostics')

  const [selectedCode, setSelectedCode] = useState('N5-101')
  const [selectedLeaks, setSelectedLeaks] = useState([])
  const [pathwayNote, setPathwayNote] = useState('')
  const [pathwayDue, setPathwayDue] = useState('Before next gate window')
  const [gateDecision, setGateDecision] = useState('released')
  const [moderationNote, setModerationNote] = useState('')

  const [issueFilter, setIssueFilter] = useState('all')
  const [replyDrafts, setReplyDrafts] = useState({})
  const [alertTarget, setAlertTarget] = useState('ALL')
  const [alertSeverity, setAlertSeverity] = useState('warning')
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  const [activeScriptId, setActiveScriptId] = useState(LECTURER_SCRIPTS[0].id)
  const [matrixStream, setMatrixStream] = useState('all')

  const [matCourse, setMatCourse] = useState('cpn6')
  const [matTarget, setMatTarget] = useState('')
  const [matBusy, setMatBusy] = useState(false)
  const [officeBusy, setOfficeBusy] = useState(false)

  const snapshot = useMemo(() => loadAllLocalStoresSnapshot(), [lecturerStore, officeStore, state])
  const diagnostics = useMemo(
    () =>
      buildCohortDiagnostics({
        gateStore: snapshot.gateStore,
        studyState: state,
        topicStores: snapshot.topicStores,
        officeStore,
        lecturerStore,
      }),
    [snapshot, state, officeStore, lecturerStore]
  )

  const selectedLearner =
    diagnostics.learners.find((l) => l.studentCode === selectedCode) || diagnostics.learners[0] || null

  const scoped = (rows) => rows.filter((row) => courses.some((c) => c.id === row.course))
  const allMaterials = scoped(materialCatalogue(materials, state.materials))
  const submissions = scoped(state.submissions || [])

  function commitLecturer(nextStore) {
    setLecturerStore(nextStore)
    writeLecturerStore(nextStore)
  }

  function handleUnlock(e) {
    e.preventDefault()
    const res = verifyLecturerPin(lecturerStore, pinInput, nameInput)
    if (!res.ok) {
      setAuthError(res.error)
      return
    }
    setAuthError('')
    setPinInput('')
    commitLecturer(res.store)
    notify?.(`Lecturer console unlocked (${res.store.lecturerName}).`)
  }

  function handleQuickDemoUnlock() {
    const res = verifyLecturerPin(lecturerStore, DEFAULT_LECTURER_PIN, nameInput || 'Lead Lecturer')
    if (res.ok) {
      setAuthError('')
      commitLecturer(res.store)
      notify?.('Lecturer console unlocked for pilot demonstration.')
    }
  }

  function handleLock() {
    commitLecturer(lockLecturerConsole(lecturerStore))
    notify?.('Lecturer console locked.')
  }

  function openLearnerPathway(learner) {
    setSelectedCode(learner.studentCode)
    setSelectedLeaks(learner.gate.topLeaks.length ? learner.gate.topLeaks : [])
    setPathwayNote(learner.customPathway?.note || '')
    setGateDecision(learner.gateDecision?.decision || 'released')
    setModerationNote(learner.gateDecision?.note || '')
    setTab('pathways')
  }

  function handleAssignPathway(e) {
    e.preventDefault()
    if (!selectedLearner) return
    const res = assignCustomPathway(lecturerStore, {
      studentCode: selectedLearner.studentCode,
      leaks: selectedLeaks,
      note: pathwayNote,
      dueLabel: pathwayDue,
    })
    if (!res.ok) {
      notify?.(res.error)
      return
    }
    commitLecturer(res.store)
    notify?.(`Custom pathway assigned to ${selectedLearner.studentCode}.`)
  }

  function handleSaveGateDecision(e) {
    e.preventDefault()
    if (!selectedLearner) return
    const res = recordGateDecision(lecturerStore, {
      studentCode: selectedLearner.studentCode,
      decision: gateDecision,
      note: moderationNote,
    })
    if (!res.ok) {
      notify?.(res.error)
      return
    }
    commitLecturer(res.store)
    notify?.(`Gate status updated for ${selectedLearner.studentCode}.`)
  }

  function handleReplyIssue(e, issueId) {
    e.preventDefault()
    const body = String(replyDrafts[issueId] || '').trim()
    if (!body) return
    const res = replyToIssueTicket(lecturerStore, {
      issueId,
      authorRole: 'lecturer',
      authorName: lecturerStore.lecturerName,
      body,
    })
    if (!res.ok) {
      notify?.(res.error)
      return
    }
    commitLecturer(res.store)
    setReplyDrafts((prev) => ({ ...prev, [issueId]: '' }))
    notify?.('Reply sent to student.')
  }

  function handleSendAlert(e) {
    e.preventDefault()
    const res = sendLecturerAlert(lecturerStore, {
      targetStudentCode: alertTarget,
      severity: alertSeverity,
      title: alertTitle,
      message: alertMessage,
    })
    if (!res.ok) {
      notify?.(res.error)
      return
    }
    commitLecturer(res.store)
    setAlertTitle('')
    setAlertMessage('')
    notify?.(`Alert published to ${alertTarget === 'ALL' ? 'all learners' : alertTarget}.`)
  }

  function handlePostNotice(e) {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const title = String(data.get('title') || '').trim()
    const body = String(data.get('body') || '').trim()
    if (!title || !body) return
    update((s) => ({
      ...s,
      notices: [...(s.notices || []), { id: crypto.randomUUID(), title, body, date: new Date().toISOString() }],
    }))
    form.reset()
    notify?.('College notice published on this device.')
  }

  async function handleInspectOfficeUpload(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setOfficeBusy(true)
    try {
      const buffer = await file.arrayBuffer()
      const fileId = `lec-office-${Date.now()}`
      await saveFile(fileId, file)
      const report = await ingestOfficeFile({
        fileName: file.name,
        buffer,
        byteSize: file.size,
        studentCode: selectedLearner?.studentCode || 'LECTURER-AUDIT',
        course: 'cpn5',
        contextTag: 'lecturer-inspector',
        fileId,
      })
      const next = recordOfficeInspection(officeStore, report)
      setOfficeStore(next)
      writeOfficeIngestStore(next)
      notify?.(`Inspected ${file.name}: ${report.leakWarnings.length} leak warning(s).`)
    } catch {
      notify?.('Could not inspect the selected Office file.')
    } finally {
      setOfficeBusy(false)
    }
  }

  async function handleUploadMaterial(e) {
    e.preventDefault()
    if (matBusy) return
    const form = e.currentTarget
    const data = new FormData(form)
    const file = data.get('file')
    const existing = allMaterials.find((row) => row.id === matTarget)
    const title = String(data.get('title') || '').trim()
    if (!file?.size || (!existing && !title)) {
      notify?.('Add a title and choose a file.')
      return
    }
    const id = crypto.randomUUID()
    const v = {
      id,
      file: file.name,
      date: new Date().toISOString(),
      label: 'v' + ((existing?.versions.length || 0) + 1),
    }
    setMatBusy(true)
    try {
      await saveFile(id, file)
      update((s) => {
        const original = materialCatalogue(materials, s.materials).find((row) => row.id === matTarget)
        if (original) {
          const replacement = {
            ...original,
            versions: [...original.versions, { ...v, label: 'v' + (original.versions.length + 1) }],
          }
          return { ...s, materials: materialCatalogue(s.materials, [replacement]) }
        }
        return {
          ...s,
          materials: [
            ...s.materials,
            {
              id,
              course: matCourse,
              title,
              topic: String(data.get('topic') || '').trim() || 'General',
              app: String(data.get('app') || '').trim() || 'General',
              session: String(data.get('session') || '').trim() || 'Coursework',
              type: data.get('type'),
              note: String(data.get('note') || '').trim(),
              versions: [v],
            },
          ],
        }
      })
      form.reset()
      setMatTarget('')
      notify?.(existing ? 'Replacement saved as a new version.' : 'Material saved on this device.')
    } catch {
      notify?.('This device could not store the file.')
    } finally {
      setMatBusy(false)
    }
  }

  if (!lecturerStore.unlocked) {
    return (
      <div className="stack">
        <Header
          eyebrow="LECTURER ACCESS GATE"
          title="Lecturer & Moderation Console"
          description="Authenticate with your pilot lecturer PIN to review cohort diagnostics, triage issues, prescribe custom pathways, inspect MS Office files, and manage gate releases."
        >
          <button className="btn outline" onClick={leave}>
            Back to student view
          </button>
        </Header>

        <section className="card padded narrow">
          <div className="eyebrow">
            <Lock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            TEACHER ACCESS PROTOCOL
          </div>
          <h2>Sign in to Lecturer Operations</h2>
          <p className="compact">
            Per the pilot marking SOP, moderation, custom pathways, and gate releases are restricted behind lecturer sign-in.
          </p>
          <form onSubmit={handleUnlock} className="stack" style={{ marginTop: 12 }}>
            <label className="field">
              <span>Lecturer display name</span>
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="e.g. Ms Khumalo"
                required
              />
            </label>
            <label className="field">
              <span>Lecturer access PIN</span>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={`Pilot PIN: ${DEFAULT_LECTURER_PIN}`}
                required
              />
            </label>
            {authError && (
              <p className="error-text" role="alert">
                {authError}
              </p>
            )}
            <div className="button-row">
              <button className="btn primary" type="submit">
                <ShieldCheck size={16} /> Unlock Lecturer Console
              </button>
              <button className="btn outline" type="button" onClick={handleQuickDemoUnlock}>
                Use Pilot PIN ({DEFAULT_LECTURER_PIN})
              </button>
            </div>
          </form>
        </section>
      </div>
    )
  }

  const filteredIssues = (lecturerStore.issues || []).filter((i) =>
    issueFilter === 'all' ? true : i.status === issueFilter
  )
  const activeScript =
    LECTURER_SCRIPTS.find((s) => s.id === activeScriptId) || LECTURER_SCRIPTS[0]
  const filteredMatrix = COMPLIANCE_MATRIX.filter((row) =>
    matrixStream === 'all' ? true : row.stream === matrixStream
  )

  return (
    <div className="stack">
      <Header
        eyebrow={`LECTURER CONSOLE · ${lecturerStore.lecturerName.toUpperCase()}`}
        title="Lecturer Operations & Diagnostics"
        description="Monitor cohort readiness, handle learner issues, assign custom remediation pathways, inspect MS Office submissions, and follow structured lesson scripts."
      >
        <div className="button-row">
          <button className="btn outline" onClick={handleLock}>
            <LogOut size={16} /> Lock Console
          </button>
          <button className="btn outline" onClick={leave}>
            Student View
          </button>
        </div>
      </Header>

      <div className="stat-grid">
        <div className="card stat">
          <small>Cohort Learners</small>
          <strong>{diagnostics.totals.learners}</strong>
        </div>
        <div className="card stat">
          <small>Gate Submitted / Avg</small>
          <strong>
            {diagnostics.totals.gateSubmitted}
            {diagnostics.totals.averageGatePercent !== null
              ? ` · ${diagnostics.totals.averageGatePercent}%`
              : ''}
          </strong>
        </div>
        <div className="card stat">
          <small>Urgent &amp; Holds</small>
          <strong>
            {diagnostics.totals.urgentLearners + diagnostics.totals.integrityHolds}
          </strong>
        </div>
        <div className="card stat">
          <small>Open Issues / Office</small>
          <strong>
            {diagnostics.totals.openIssues} · {diagnostics.totals.officeFilesConsumed} files
          </strong>
        </div>
      </div>

      <nav className="tabs" aria-label="Lecturer console areas">
        {[
          ['diagnostics', 'Diagnostics & Alerts'],
          ['pathways', 'Remediation & Pathways'],
          ['issues', `Issues & Comms (${diagnostics.totals.openIssues})`],
          ['office', `MS Office Inspector (${officeStore.reports.length})`],
          ['scripts', 'Lesson Scripts & SOP'],
          ['matrix', 'Compliance & Materials'],
        ].map(([id, label]) => (
          <button
            key={id}
            aria-current={tab === id ? 'page' : undefined}
            className={tab === id ? 'active' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* TAB 1: DIAGNOSTICS & ALERTS */}
      {tab === 'diagnostics' && (
        <div className="stack">
          <div className="card padded">
            <div className="section-head" style={{ marginTop: 0 }}>
              <div>
                <h2>Cohort Reporting &amp; Exports</h2>
                <p>Export diagnostic packets, leak frequencies, and gate decisions.</p>
              </div>
              <div className="button-row">
                <button
                  className="btn outline"
                  onClick={() => {
                    triggerDownload('ComputeLab-Cohort-Diagnostics.txt', formatCohortReportText(diagnostics))
                    notify?.('Cohort TXT report downloaded.')
                  }}
                >
                  <Download size={16} /> Export .txt
                </button>
                <button
                  className="btn outline"
                  onClick={() => {
                    triggerDownload(
                      'ComputeLab-Cohort-Diagnostics.csv',
                      formatCohortReportCsv(diagnostics),
                      'text/csv;charset=utf-8'
                    )
                    notify?.('Cohort CSV report downloaded.')
                  }}
                >
                  <FileSpreadsheet size={16} /> Export .csv
                </button>
                <button
                  className="btn outline"
                  onClick={() => {
                    triggerDownload(
                      'ComputeLab-Cohort-Diagnostics.json',
                      JSON.stringify(diagnostics, null, 2),
                      'application/json;charset=utf-8'
                    )
                    notify?.('Cohort JSON snapshot downloaded.')
                  }}
                >
                  <FileText size={16} /> Export .json
                </button>
              </div>
            </div>

            {diagnostics.leakFrequency.length > 0 && (
              <div className="learning-callout" style={{ marginTop: 10 }}>
                <strong>Dominant Cohort Leaks:</strong>{' '}
                {diagnostics.leakFrequency
                  .map(([leak, count]) => `${leak} (${count})`)
                  .join(' · ')}
              </div>
            )}
          </div>

          <div className="card padded">
            <h2>Priority Help &amp; Risk Alerts ({diagnostics.priorityAlerts.length})</h2>
            {diagnostics.priorityAlerts.length === 0 ? (
              <p className="compact">No urgent holds, critical learners, Office leaks, or open tickets on this device.</p>
            ) : (
              <div className="stack" style={{ marginTop: 10 }}>
                {diagnostics.priorityAlerts.map((alert) => (
                  <div className="n5g-alert warn" key={alert.id}>
                    <ShieldAlert size={18} />
                    <div style={{ flex: 1 }}>
                      <strong>{alert.title}</strong>
                      <div className="compact">{alert.detail}</div>
                    </div>
                    <button
                      className="btn outline"
                      onClick={() => {
                        const target = diagnostics.learners.find((l) => l.studentCode === alert.studentCode)
                        if (target) openLearnerPathway(target)
                      }}
                    >
                      Triage
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card padded">
            <h2>Cohort Diagnostic Roster</h2>
            <div className="stack" style={{ marginTop: 10 }}>
              {diagnostics.learners.map((l) => (
                <article className="card padded" key={l.studentCode}>
                  <div className="row-card">
                    <div>
                      <strong>
                        {l.name} ({l.studentCode})
                      </strong>
                      <p className="compact">
                        Gate 01:{' '}
                        {l.gate.submitted
                          ? `${l.gate.percent}% (${l.gate.readinessLabel}) · Overconfident: ${l.gate.overconfidentCount}`
                          : l.gate.readinessLabel}{' '}
                        · Topics T1–T5: {l.topicOverallPercent}% · Office files: {l.officeReports.length} (
                        {l.officeLeakCount} leak{l.officeLeakCount === 1 ? '' : 's'})
                      </p>
                      {l.gate.topLeaks.length > 0 && (
                        <p className="compact muted">Leaks: {l.gate.topLeaks.join(', ')}</p>
                      )}
                      {l.customPathway && (
                        <p className="compact">
                          <strong>Active Pathway:</strong> {l.customPathway.steps.filter((s) => s.completed).length}/
                          {l.customPathway.steps.length} done · {l.customPathway.note}
                        </p>
                      )}
                    </div>
                    <div className="button-row push-right">
                      <span className={statusPillClass(l.priority)}>{priorityLabel(l.priority)}</span>
                      <span className="pill neutral">{l.gateDecision.decision}</span>
                      <button className="btn primary" onClick={() => openLearnerPathway(l)}>
                        Manage
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REMEDIATION & CUSTOM PATHWAYS */}
      {tab === 'pathways' && (
        <div className="stack">
          <div className="card padded">
            <Select
              label="Select Learner"
              value={selectedLearner?.studentCode || ''}
              onChange={(code) => {
                const match = diagnostics.learners.find((l) => l.studentCode === code)
                if (match) openLearnerPathway(match)
              }}
              options={diagnostics.learners.map((l) => ({
                id: l.studentCode,
                title: `${l.studentCode} · ${l.name} (${priorityLabel(l.priority)})`,
              }))}
            />

            {selectedLearner && (
              <div className="stack" style={{ marginTop: 12 }}>
                <div className="n5g-packet-grid">
                  <div className="n5g-packet-item">
                    <small>Gate 01 Result</small>
                    <strong>
                      {selectedLearner.gate.submitted
                        ? `${selectedLearner.gate.score}/${selectedLearner.gate.total} (${selectedLearner.gate.percent}%)`
                        : selectedLearner.gate.readinessLabel}
                    </strong>
                  </div>
                  <div className="n5g-packet-item">
                    <small>Topics T1–T5 Completion</small>
                    <strong>
                      T1 {selectedLearner.topics.topic1.percent}% · T2 {selectedLearner.topics.topic2.percent}% · T3{' '}
                      {selectedLearner.topics.topic3.percent}% · T4 {selectedLearner.topics.topic4.percent}% · T5{' '}
                      {selectedLearner.topics.topic5.percent}%
                    </strong>
                  </div>
                  <div className="n5g-packet-item">
                    <small>Anomaly &amp; Reassessment</small>
                    <strong>
                      {selectedLearner.gate.integrityHold
                        ? 'Integrity Hold Flagged'
                        : selectedLearner.gate.reassessmentPassed
                          ? 'Reassessment Passed'
                          : 'Normal'}
                    </strong>
                  </div>
                  <div className="n5g-packet-item">
                    <small>Current Gate Decision</small>
                    <strong>{selectedLearner.gateDecision.decision}</strong>
                  </div>
                </div>

                <form className="card padded" onSubmit={handleAssignPathway}>
                  <h3>
                    <Route size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Prescribe Custom Remediation Pathway
                  </h3>
                  <p className="compact">
                    Select diagnosed or target leak areas to auto-map Topic Hub modules, drills, and MS Office practical tasks for{' '}
                    {selectedLearner.studentCode}.
                  </p>
                  <div className="filters" style={{ marginTop: 8 }}>
                    {Object.entries(LEAK_TO_PATHWAY_MAP).map(([leak, info]) => {
                      const checked = selectedLeaks.includes(leak)
                      return (
                        <label className="n5g-check-item" key={leak}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              setSelectedLeaks((prev) =>
                                checked ? prev.filter((x) => x !== leak) : [...prev, leak]
                              )
                            }
                          />
                          <span>
                            <strong>{leak}</strong> · {info.label}
                          </span>
                        </label>
                      )
                    })}
                  </div>
                  <label className="field">
                    <span>Lecturer pathway note</span>
                    <textarea
                      value={pathwayNote}
                      onChange={(e) => setPathwayNote(e.target.value)}
                      placeholder="Explain which modules and MS Office tasks to complete before the next gate..."
                    />
                  </label>
                  <label className="field">
                    <span>Target deadline / window</span>
                    <input value={pathwayDue} onChange={(e) => setPathwayDue(e.target.value)} />
                  </label>
                  <div className="button-row">
                    <button className="btn primary" type="submit">
                      <Sparkles size={16} /> Assign Custom Pathway
                    </button>
                    {selectedLearner.gate.topLeaks.length > 0 && (
                      <button
                        className="btn outline"
                        type="button"
                        onClick={() => setSelectedLeaks(selectedLearner.gate.topLeaks)}
                      >
                        Auto-fill from Gate Leaks ({selectedLearner.gate.topLeaks.join(', ')})
                      </button>
                    )}
                  </div>
                </form>

                <form className="card padded" onSubmit={handleSaveGateDecision}>
                  <h3>
                    <ShieldCheck size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Gate Release &amp; Moderation Control
                  </h3>
                  <div className="filters">
                    <label className="field">
                      <span>Gate status</span>
                      <select value={gateDecision} onChange={(e) => setGateDecision(e.target.value)}>
                        <option value="not_released">Not Released</option>
                        <option value="released">Released (Active)</option>
                        <option value="remediation_hold">Remediation Hold</option>
                        <option value="integrity_hold">Integrity Hold</option>
                        <option value="cleared_next_gate">Cleared for Next Gate</option>
                      </select>
                    </label>
                    <label className="field">
                      <span>Mandatory moderation / override note</span>
                      <input
                        value={moderationNote}
                        onChange={(e) => setModerationNote(e.target.value)}
                        placeholder="Required for holds or gate clearance..."
                      />
                    </label>
                  </div>
                  <button className="btn primary" type="submit">
                    Save Gate Decision &amp; Audit Entry
                  </button>
                </form>
              </div>
            )}
          </div>

          <div className="card padded">
            <h3>Lecturer Moderation &amp; Action Audit Log ({lecturerStore.auditLog.length})</h3>
            {lecturerStore.auditLog.length === 0 ? (
              <p className="compact">No moderation actions recorded yet.</p>
            ) : (
              <div className="stack" style={{ marginTop: 8 }}>
                {lecturerStore.auditLog.slice(0, 15).map((entry) => (
                  <div className="history-row" key={entry.id}>
                    <span>
                      <strong>{entry.action}</strong> · {entry.studentCode} · {entry.detail}
                    </span>
                    <small>
                      {entry.actor} · {stamp(entry.at)}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT ISSUES, COMMUNICATION & ALERTS */}
      {tab === 'issues' && (
        <div className="stack">
          <form className="card padded" onSubmit={handleSendAlert}>
            <h3>
              <Bell size={17} style={{ verticalAlign: 'middle', marginRight: 6 }} />
              Send Student / Cohort Alert
            </h3>
            <div className="filters">
              <label className="field">
                <span>Recipient</span>
                <select value={alertTarget} onChange={(e) => setAlertTarget(e.target.value)}>
                  <option value="ALL">All Cohort Learners</option>
                  {diagnostics.learners.map((l) => (
                    <option key={l.studentCode} value={l.studentCode}>
                      {l.studentCode} · {l.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Severity</span>
                <select value={alertSeverity} onChange={(e) => setAlertSeverity(e.target.value)}>
                  <option value="info">Info</option>
                  <option value="warning">Warning / Reminder</option>
                  <option value="urgent">Urgent Action Required</option>
                </select>
              </label>
            </div>
            <label className="field">
              <span>Alert title</span>
              <input
                required
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
                placeholder="e.g. Gate 02 submission checklist due Friday"
              />
            </label>
            <label className="field">
              <span>Alert message</span>
              <textarea
                required
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Clear action instructions for the learner(s)..."
              />
            </label>
            <button className="btn primary" type="submit">
              Publish Alert
            </button>
          </form>

          <div className="card padded">
            <div className="section-head" style={{ marginTop: 0 }}>
              <div>
                <h3>Student Help &amp; Issue Tickets</h3>
                <p>Structured issues reported by learners from #feedback or Workspace.</p>
              </div>
              <Select
                label="Filter status"
                value={issueFilter}
                onChange={setIssueFilter}
                options={[
                  { id: 'all', title: 'All tickets' },
                  { id: 'open', title: 'Open' },
                  { id: 'in_review', title: 'In Review' },
                  { id: 'resolved', title: 'Resolved' },
                ]}
              />
            </div>

            {filteredIssues.length === 0 ? (
              <Empty icon={MessageSquare} title="No matching issue tickets" />
            ) : (
              <div className="stack" style={{ marginTop: 10 }}>
                {filteredIssues.map((iss) => (
                  <article className="card padded" key={iss.id}>
                    <div className="row-card">
                      <div>
                        <small>
                          [{iss.issueType.toUpperCase()} · {iss.priority.toUpperCase()}] · {iss.studentName} (
                          {iss.studentCode}) · {stamp(iss.createdAt)}
                        </small>
                        <h4>{iss.subject}</h4>
                        <p className="prewrap">{iss.details}</p>
                      </div>
                      <div className="button-row push-right">
                        <span className="pill neutral">{iss.status}</span>
                        {iss.status !== 'resolved' && (
                          <button
                            className="btn outline"
                            onClick={() => {
                              commitLecturer(updateIssueStatus(lecturerStore, iss.id, 'resolved', 'Closed by lecturer'))
                              notify?.('Issue marked resolved.')
                            }}
                          >
                            <CheckCircle2 size={15} /> Resolve
                          </button>
                        )}
                      </div>
                    </div>

                    {iss.replies?.map((r) => (
                      <div className="memo" key={r.id} style={{ marginTop: 8 }}>
                        <small>
                          <strong>{r.authorName}</strong> ({r.authorRole}) · {stamp(r.date)}
                        </small>
                        <p className="prewrap">{r.body}</p>
                      </div>
                    ))}

                    <form onSubmit={(e) => handleReplyIssue(e, iss.id)} style={{ marginTop: 8 }}>
                      <label className="field">
                        <span>Lecturer reply</span>
                        <textarea
                          required
                          value={replyDrafts[iss.id] || ''}
                          onChange={(e) => setReplyDrafts((p) => ({ ...p, [iss.id]: e.target.value }))}
                        />
                      </label>
                      <button className="btn primary" type="submit">
                        Send Reply
                      </button>
                    </form>
                  </article>
                ))}
              </div>
            )}
          </div>

          <form className="card padded narrow" onSubmit={handlePostNotice}>
            <IconTile icon={Bell} color="peach" />
            <h3>Post College Notice</h3>
            <label className="field">
              <span>Title</span>
              <input required name="title" />
            </label>
            <label className="field">
              <span>Message</span>
              <textarea required name="body" />
            </label>
            <button className="btn primary">
              <Plus size={16} /> Post local notice
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: MS OFFICE INSPECTOR */}
      {tab === 'office' && (
        <div className="stack">
          <div className="card padded">
            <h2>MS Office Work Consumption &amp; Rubric Inspector</h2>
            <p>
              Inspect Excel formulas, absolute ($) locks, print scaling, Word Heading styles, tab stops, page breaks, and Mail Merge fields directly in the browser from `.xlsx`, `.docx`, `.csv`, and `.txt` files.
            </p>
            <label className="field" style={{ marginTop: 10 }}>
              <span>Inspect any local MS Office file (.xlsx, .docx, .csv, .txt)</span>
              <input
                type="file"
                accept=".xlsx,.xlsm,.docx,.csv,.txt,.md,.html"
                disabled={officeBusy}
                onChange={handleInspectOfficeUpload}
              />
            </label>
          </div>

          {officeStore.reports.length === 0 ? (
            <Empty icon={FileSpreadsheet} title="No Office files consumed yet">
              <p>Upload a .docx or .xlsx file above or via Assignments / N5 Gate / Topic Hubs.</p>
            </Empty>
          ) : (
            <div className="stack">
              {[...officeStore.reports].reverse().map((r) => (
                <article className="card padded" key={r.id}>
                  <div className="row-card">
                    <IconTile icon={FileSpreadsheet} color={r.leakWarnings?.length ? 'peach' : 'mint'} />
                    <div>
                      <small>
                        {r.studentCode} · {String(r.course || '').toUpperCase()} · {r.contextTag} ·{' '}
                        {stamp(r.analyzedAt)}
                      </small>
                      <h3>{r.fileName}</h3>
                      <p>{r.summary}</p>
                    </div>
                    <div className="button-row push-right">
                      {r.fileId && (
                        <button
                          className="btn outline"
                          onClick={() =>
                            downloadFile({ id: r.fileId, file: r.fileName }).catch(() =>
                              notify?.('Raw file unavailable on this device.')
                            )
                          }
                        >
                          <Download size={16} /> File
                        </button>
                      )}
                      <button
                        className="btn outline"
                        onClick={() =>
                          triggerDownload(`${r.fileName}-Inspection.txt`, formatOfficeInspectionText(r))
                        }
                      >
                        <FileText size={16} /> Report
                      </button>
                    </div>
                  </div>

                  {r.detectedSignals?.length > 0 && (
                    <p className="compact" style={{ marginTop: 8 }}>
                      <strong>Signals:</strong> {r.detectedSignals.join(' · ')}
                    </p>
                  )}

                  {r.formulas?.length > 0 && (
                    <details style={{ marginTop: 8 }}>
                      <summary>Extracted Excel Formulas ({r.formulas.length})</summary>
                      <ul>
                        {r.formulas.map((f, idx) => (
                          <li key={idx}>
                            <code>
                              {f.sheet}!{f.cell}: {f.formula}
                            </code>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}

                  {r.rubricMatches?.length > 0 && (
                    <ul style={{ marginTop: 8 }}>
                      {r.rubricMatches.map((m, i) => (
                        <li key={i} className="success-text">
                          ✓ {m}
                        </li>
                      ))}
                    </ul>
                  )}

                  {r.leakWarnings?.length > 0 && (
                    <div className="stack" style={{ marginTop: 8 }}>
                      {r.leakWarnings.map((w, i) => (
                        <div className="n5g-alert warn" key={i}>
                          <AlertTriangle size={16} />
                          <div>
                            <strong>
                              [{w.leak} · {w.severity}]
                            </strong>{' '}
                            {w.detail}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: LECTURER SCRIPTS & GUIDELINES */}
      {tab === 'scripts' && (
        <div className="learning-layout">
          <aside className="learning-stages">
            {LECTURER_SCRIPTS.map((s) => (
              <button
                key={s.id}
                className={s.id === activeScript.id ? 'active' : ''}
                onClick={() => setActiveScriptId(s.id)}
              >
                <small>{s.stream}</small>
                <strong>{s.title}</strong>
              </button>
            ))}
          </aside>

          <section className="learning-panel">
            <div className="section-head" style={{ marginTop: 0 }}>
              <div>
                <div className="eyebrow">
                  {activeScript.stream} · {activeScript.duration}
                </div>
                <h2>{activeScript.title}</h2>
              </div>
              <button
                className="btn outline"
                onClick={() => {
                  const content = [
                    activeScript.title,
                    `${activeScript.stream} · ${activeScript.duration}`,
                    '',
                    `PURPOSE: ${activeScript.purpose}`,
                    '',
                    ...activeScript.passes.map((p) => `${p.stage}\n${p.script}\n`),
                    `EXAM ANSWER FRAME:\n${activeScript.answerFrame}`,
                    '',
                    `RELEASE & MODERATION RULE:\n${activeScript.releaseRule}`,
                    '',
                    `CLOSING SCRIPT:\n${activeScript.closingScript}`,
                  ].join('\n')
                  triggerDownload(`${activeScript.id}-script.txt`, content)
                }}
              >
                <Download size={16} /> Export Script
              </button>
            </div>

            <p>{activeScript.purpose}</p>

            <div className="stack" style={{ marginTop: 12 }}>
              {activeScript.passes.map((p, idx) => (
                <div className="card padded" key={idx}>
                  <h3>{p.stage}</h3>
                  <p className="prewrap">{p.script}</p>
                </div>
              ))}
            </div>

            <div className="learning-callout" style={{ marginTop: 12 }}>
              <p>
                <strong>Required Answer Frame:</strong> {activeScript.answerFrame}
              </p>
              <p>
                <strong>Release &amp; Moderation Rule:</strong> {activeScript.releaseRule}
              </p>
              <p>
                <strong>Closing Script (Read Aloud):</strong> “{activeScript.closingScript}”
              </p>
            </div>
          </section>
        </div>
      )}

      {/* TAB 6: COMPLIANCE MATRIX & MATERIALS */}
      {tab === 'matrix' && (
        <div className="stack">
          <div className="card padded">
            <div className="section-head" style={{ marginTop: 0 }}>
              <div>
                <h2>
                  <BookOpenCheck size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                  Syllabus &amp; Quality Compliance Matrix
                </h2>
                <p>Alignment across DHET CPN5 Topics 1–5, Gate 01, CPN6, MS Office Ingestion, and Lecturer Ops.</p>
              </div>
              <Select
                label="Stream"
                value={matrixStream}
                onChange={setMatrixStream}
                options={[
                  { id: 'all', title: 'All streams' },
                  { id: 'CPN5', title: 'CPN5' },
                  { id: 'CPN6', title: 'CPN6' },
                  { id: 'Shared', title: 'Shared' },
                ]}
              />
            </div>

            <div className="stack" style={{ marginTop: 10 }}>
              {filteredMatrix.map((row) => (
                <article className="card padded" key={row.id}>
                  <div className="row-card">
                    <div>
                      <small>
                        {row.stream} · {row.coverageCount}
                      </small>
                      <h3>{row.area}</h3>
                    </div>
                    <span
                      className={
                        row.status === 'compliant'
                          ? 'n5g-band-pill exam-ready push-right'
                          : 'n5g-band-pill developing push-right'
                      }
                    >
                      {row.status === 'compliant' ? 'Compliant' : 'Partial / Bridged'}
                    </span>
                  </div>
                  <p className="compact" style={{ marginTop: 6 }}>
                    <strong>Syllabus:</strong> {row.syllabusRequirement}
                  </p>
                  <p className="compact">
                    <strong>Artifacts:</strong> <code>{row.appArtifacts}</code>
                  </p>
                  <p className="compact">
                    <strong>Quality Gate:</strong> {row.qualityGate}
                  </p>
                  <p className="compact muted">{row.gapNote}</p>
                </article>
              ))}
            </div>
          </div>

          <form className="card padded" onSubmit={handleUploadMaterial}>
            <h2>{matTarget ? 'Replace material' : 'Upload material'}</h2>
            <div className="filters">
              <Select
                label="Action"
                value={matTarget}
                onChange={setMatTarget}
                options={allMaterials.map((row) => ({ id: row.id, title: 'Replace · ' + row.title }))}
                all="Add new material"
              />
              {!matTarget && <Select label="Course" value={matCourse} onChange={setMatCourse} options={courses} />}
            </div>
            {!matTarget && (
              <>
                <label className="field">
                  <span>Title</span>
                  <input required name="title" />
                </label>
                <div className="filters">
                  {[
                    ['topic', 'Topic'],
                    ['app', 'Application or skill'],
                    ['session', 'Exam session'],
                  ].map(([id, label]) => (
                    <label className="field" key={id}>
                      <span>{label}</span>
                      <input name={id} />
                    </label>
                  ))}
                  <label className="field">
                    <span>Type</span>
                    <select name="type">
                      {[
                        'Study guide',
                        'Past paper',
                        'Practice pack',
                        'Assignment brief',
                        'Lesson notes',
                        'Marking reference',
                      ].map((v) => (
                        <option key={v}>{v}</option>
                      ))}
                    </select>
                  </label>
                </div>
                <label className="field">
                  <span>Description</span>
                  <input name="note" />
                </label>
              </>
            )}
            <label className="field">
              <span>File</span>
              <input required name="file" type="file" />
            </label>
            <button disabled={matBusy} className="btn primary">
              <Upload size={16} /> {matTarget ? 'Save new version' : 'Upload material'}
            </button>
          </form>

          <div className="card padded">
            <h3>Student File Submissions ({submissions.length})</h3>
            {submissions.length ? (
              [...submissions].reverse().map((row) => (
                <div className="history-row" key={row.id}>
                  <span>
                    <strong>{row.title}</strong> · {row.file} · {stamp(row.date)}
                  </span>
                  <button className="btn text-button" onClick={() => downloadFile(row)}>
                    <Download size={16} /> Download
                  </button>
                </div>
              ))
            ) : (
              <p className="compact">No local submissions yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

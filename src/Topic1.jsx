import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Layers3,
  Lightbulb,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserCheck,
} from 'lucide-react'
import { TOPIC1_MODULES, TOPIC1_TITLE } from './topic1-data.js'
import {
  computeTopic1Summary,
  evaluateQuickCheck,
  formatTopic1SummaryText,
  getOwnerTopic1Progress,
  getTopic1OwnerKey,
  initialModuleProgress,
  isTopic1ModuleComplete,
  readTopic1Store,
  writeTopic1Store,
} from './topic1-engine.js'
import { readGateStore } from './n5-gate-engine.js'
import { downloadFile, saveFiles } from './files.js'
import { Header } from './ui.jsx'

const CATEGORY_FILTERS = [
  {
    id: 'all',
    label: 'All',
    match: () => true,
  },
  {
    id: 'theory-os',
    label: 'Theory & OS',
    match: (mod) => mod.category === 'theory' || mod.category === 'files',
  },
  {
    id: 'word',
    label: 'Word & Mail Merge',
    match: (mod) => mod.category === 'word',
  },
  {
    id: 'excel',
    label: 'Spreadsheets',
    match: (mod) => mod.category === 'excel',
  },
  {
    id: 'integration',
    label: 'Integration & Consolidation',
    match: (mod) => mod.category === 'integration' || mod.category === 'consolidation',
  },
]

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

function getModuleStatus(mod, modProgress) {
  if (isTopic1ModuleComplete(mod, modProgress)) {
    return { key: 'done', label: 'Completed ✓' }
  }
  if (modProgress?.quickCheckResult?.passed) {
    return { key: 'passed', label: 'Check passed' }
  }
  return { key: 'idle', label: 'Not started' }
}

function getMissingRequirements(mod, modProgress) {
  const missing = []
  if (!modProgress?.quickCheckResult?.passed) {
    missing.push('pass the Quick Check (2/3 or 3/3)')
  }
  const checklist = Array.isArray(mod?.evidenceTask?.checklist) ? mod.evidenceTask.checklist : []
  const uncheckedCount = checklist.filter((item) => !modProgress?.checklist?.[item.id]).length
  if (uncheckedCount > 0) {
    missing.push(
      `tick ${uncheckedCount === checklist.length ? 'all ' : ''}${uncheckedCount} verification ${uncheckedCount === 1 ? 'checkbox' : 'checkboxes'}`
    )
  }
  const noteLen = String(modProgress?.evidenceNotes ?? '').trim().length
  if (noteLen < 10) {
    missing.push(`add evidence notes (${10 - noteLen} more char${10 - noteLen === 1 ? '' : 's'} needed)`)
  }
  return missing
}

export function Topic1({ notify, onNav }) {
  const [gateStore, setGateStore] = useState(() => readGateStore())
  const [topic1Store, setTopic1Store] = useState(() => readTopic1Store())
  const [activeFilter, setActiveFilter] = useState('all')
  const [activeModuleId, setActiveModuleId] = useState(() => TOPIC1_MODULES[0]?.id || '')
  const [fileBusy, setFileBusy] = useState(false)

  const storeRef = useRef(topic1Store)
  storeRef.current = topic1Store

  useEffect(() => {
    const syncGate = () => setGateStore(readGateStore())
    window.addEventListener('focus', syncGate)
    window.addEventListener('storage', syncGate)
    return () => {
      window.removeEventListener('focus', syncGate)
      window.removeEventListener('storage', syncGate)
    }
  }, [])

  const session = gateStore?.session || null
  const ownerKey = getTopic1OwnerKey(gateStore)
  const ownerLabel = session
    ? `${session.firstName} ${session.lastName} (${session.studentCode})`
    : 'Local Learner'

  const ownerProgress = useMemo(
    () => getOwnerTopic1Progress(topic1Store, ownerKey),
    [topic1Store, ownerKey]
  )

  const summary = useMemo(
    () => computeTopic1Summary(ownerProgress, TOPIC1_MODULES),
    [ownerProgress]
  )

  const filterCounts = useMemo(
    () =>
      CATEGORY_FILTERS.map((f) => ({
        ...f,
        count: TOPIC1_MODULES.filter(f.match).length,
      })),
    []
  )

  const filteredModules = useMemo(() => {
    const def = CATEGORY_FILTERS.find((f) => f.id === activeFilter) || CATEGORY_FILTERS[0]
    return TOPIC1_MODULES.filter(def.match)
  }, [activeFilter])

  const activeModule = useMemo(() => {
    return (
      filteredModules.find((m) => m.id === activeModuleId) ||
      filteredModules[0] ||
      TOPIC1_MODULES[0]
    )
  }, [filteredModules, activeModuleId])

  const modProgress = useMemo(() => {
    const raw = activeModule?.id ? ownerProgress.modules?.[activeModule.id] : null
    return {
      ...initialModuleProgress(),
      ...(raw || {}),
      quickCheckAnswers: raw?.quickCheckAnswers || {},
      checklist: raw?.checklist || {},
      evidenceFiles: Array.isArray(raw?.evidenceFiles) ? raw.evidenceFiles : [],
    }
  }, [ownerProgress, activeModule?.id])

  const activeGlobalIndex = TOPIC1_MODULES.findIndex((m) => m.id === activeModule?.id)
  const prevModule = activeGlobalIndex > 0 ? TOPIC1_MODULES[activeGlobalIndex - 1] : null
  const nextModule =
    activeGlobalIndex >= 0 && activeGlobalIndex < TOPIC1_MODULES.length - 1
      ? TOPIC1_MODULES[activeGlobalIndex + 1]
      : null

  function updateModuleProgress(moduleId, updater) {
    setTopic1Store((prev) => {
      const currentOwner = getOwnerTopic1Progress(prev, ownerKey)
      const currentMod = {
        ...initialModuleProgress(),
        ...(currentOwner.modules?.[moduleId] || {}),
      }
      const nextMod = typeof updater === 'function' ? updater(currentMod) : { ...currentMod, ...updater }
      const nextStore = {
        ...prev,
        version: 1,
        byOwner: {
          ...(prev?.byOwner || {}),
          [ownerKey]: {
            ...currentOwner,
            modules: {
              ...(currentOwner.modules || {}),
              [moduleId]: nextMod,
            },
          },
        },
      }
      storeRef.current = nextStore
      writeTopic1Store(nextStore)
      return nextStore
    })
  }

  function handleSelectFilter(filterId) {
    setActiveFilter(filterId)
    const def = CATEGORY_FILTERS.find((f) => f.id === filterId) || CATEGORY_FILTERS[0]
    const list = TOPIC1_MODULES.filter(def.match)
    if (list.length > 0 && !list.some((m) => m.id === activeModuleId)) {
      setActiveModuleId(list[0].id)
    }
  }

  function handleJumpToModule(targetMod) {
    if (!targetMod) return
    const currentDef = CATEGORY_FILTERS.find((f) => f.id === activeFilter) || CATEGORY_FILTERS[0]
    if (!currentDef.match(targetMod)) {
      setActiveFilter('all')
    }
    setActiveModuleId(targetMod.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleExportSummary() {
    const text = formatTopic1SummaryText(ownerLabel, ownerProgress, TOPIC1_MODULES)
    triggerTextDownload(`CPN5-Topic1-Summary-${ownerKey}.txt`, text)
    notify?.('Topic 1 summary (.txt) downloaded.')
  }

  function handleSelectQuickCheckOption(questionId, optionIndex) {
    if (!activeModule?.id) return
    updateModuleProgress(activeModule.id, (curr) => ({
      ...curr,
      quickCheckAnswers: {
        ...(curr.quickCheckAnswers || {}),
        [questionId]: optionIndex,
      },
      quickCheckResult: null,
      completedAt: null,
    }))
  }

  function handleCheckAnswers() {
    if (!activeModule?.id) return
    const result = evaluateQuickCheck(activeModule, modProgress.quickCheckAnswers)
    updateModuleProgress(activeModule.id, (curr) => ({
      ...curr,
      quickCheckResult: result,
      completedAt: result.passed ? curr.completedAt : null,
    }))
    if (result.passed) {
      notify?.(`Quick Check passed (${result.correct}/${result.total}). Complete your practical evidence below.`)
    } else {
      notify?.(`Quick Check scored ${result.correct}/${result.total}. Review the rationales and retry.`)
    }
  }

  function handleRetryQuickCheck() {
    if (!activeModule?.id) return
    updateModuleProgress(activeModule.id, (curr) => ({
      ...curr,
      quickCheckAnswers: {},
      quickCheckResult: null,
      completedAt: null,
    }))
  }

  function handleToggleCheckItem(checkId) {
    if (!activeModule?.id) return
    updateModuleProgress(activeModule.id, (curr) => {
      const nextChecklist = {
        ...(curr.checklist || {}),
        [checkId]: !curr.checklist?.[checkId],
      }
      return {
        ...curr,
        checklist: nextChecklist,
        completedAt: nextChecklist[checkId] ? curr.completedAt : null,
      }
    })
  }

  function handleUpdateNotes(value) {
    if (!activeModule?.id) return
    updateModuleProgress(activeModule.id, (curr) => ({
      ...curr,
      evidenceNotes: value,
      completedAt: String(value).trim().length >= 10 ? curr.completedAt : null,
    }))
  }

  async function handleAttachEvidenceFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !activeModule?.id) return
    setFileBusy(true)
    try {
      const fileId = `t1-${ownerKey}-${activeModule.id}-${Date.now()}`
      await saveFiles([{ id: fileId, blob: file }])
      updateModuleProgress(activeModule.id, (curr) => ({
        ...curr,
        evidenceFiles: [
          ...(Array.isArray(curr.evidenceFiles) ? curr.evidenceFiles : []),
          { id: fileId, file: file.name, size: file.size, savedAt: Date.now() },
        ],
      }))
      notify?.(`Saved "${file.name}" to your device evidence vault.`)
    } catch {
      notify?.('Could not save evidence file on this device. Keep your original file.')
    } finally {
      setFileBusy(false)
    }
  }

  function handleRemoveEvidenceFile(fileId) {
    if (!activeModule?.id) return
    updateModuleProgress(activeModule.id, (curr) => ({
      ...curr,
      evidenceFiles: (curr.evidenceFiles || []).filter((item) => item.id !== fileId),
    }))
  }

  function handleMarkComplete() {
    if (!activeModule?.id || !isTopic1ModuleComplete(activeModule, modProgress)) return
    updateModuleProgress(activeModule.id, (curr) => ({
      ...curr,
      completedAt: Date.now(),
    }))
    notify?.(`Section ${activeModule.sectionCode} marked complete!`)
  }

  if (!activeModule) return null

  const quickCheck = Array.isArray(activeModule.quickCheck) ? activeModule.quickCheck : []
  const qcAnswers = modProgress.quickCheckAnswers || {}
  const qcAnsweredCount = quickCheck.filter((q) => Number.isInteger(qcAnswers[q.id])).length
  const qcResult = modProgress.quickCheckResult
  const qcDetailsById = new Map((qcResult?.details || []).map((d) => [d.id, d]))

  const canMarkComplete = isTopic1ModuleComplete(activeModule, modProgress)
  const missingReqs = getMissingRequirements(activeModule, modProgress)
  const trimmedNotesLen = String(modProgress.evidenceNotes || '').trim().length
  const activeStatus = getModuleStatus(activeModule, modProgress)

  return (
    <div className="t1-shell">
      <Header
        eyebrow="CPN5 · TOPIC 1 WORKBENCH"
        title={TOPIC1_TITLE}
        description="Master Sections 1–8 concepts, avoid high-risk CBT traps, pass Quick Checks, and log practical evidence."
      >
        <button className="btn outline" type="button" onClick={handleExportSummary}>
          <Download size={16} /> Export Topic 1 Summary
        </button>
      </Header>

      {/* 1. Student Context Bar */}
      <section
        className={`t1-context-bar ${session ? 'signed-in' : ''}`}
        aria-label="Student session context"
      >
        <div className="t1-context-meta">
          <UserCheck size={19} />
          {session ? (
            <span>
              <strong>
                Signed in: {session.firstName} {session.lastName} ({session.studentCode})
              </strong>{' '}
              · Progress synced to your student record
            </span>
          ) : (
            <span>
              Practising locally · Sign in on N5 Gate 01 to bind progress to your student code
            </span>
          )}
        </div>
        {!session && (
          <a
            className="btn outline"
            href="#n5-gate"
            onClick={(e) => {
              e.preventDefault()
              onNav?.('n5-gate')
            }}
          >
            <ShieldCheck size={16} /> Sign in on N5 Gate 01
          </a>
        )}
      </section>

      {/* 2. Summary Progress Strip */}
      <section className="t1-summary" aria-label="Topic 1 completion summary">
        <div className="t1-summary-stats">
          <div className="t1-stat-box">
            <small>Wave 1 Progress</small>
            <strong>
              {summary.wave1Completed} / {summary.wave1Total} modules
            </strong>
          </div>
          <div className="t1-stat-box">
            <small>Total Topic 1</small>
            <strong>
              {summary.completedModules} / {summary.totalModules} completed
            </strong>
          </div>
        </div>

        <div className="t1-summary-bar-wrap">
          <div className="t1-summary-bar-head">
            <span>Overall Topic 1 mastery</span>
            <span>{summary.percent}%</span>
          </div>
          <div
            className="t1-progress-track"
            role="progressbar"
            aria-valuenow={summary.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Topic 1 completion percentage"
          >
            <div className="t1-progress-fill" style={{ width: `${summary.percent}%` }} />
          </div>
        </div>

        <div className="t1-summary-cta">
          <button className="btn primary" type="button" onClick={() => onNav?.('n5-gate')}>
            <ShieldCheck size={16} /> Open N5 Gate 01
          </button>
        </div>
      </section>

      {/* 3. Category Filter Pills */}
      <div className="t1-filter-row" role="tablist" aria-label="Filter Topic 1 modules by category">
        {filterCounts.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={activeFilter === f.id}
            className={`t1-filter-pill ${activeFilter === f.id ? 'active' : ''}`}
            onClick={() => handleSelectFilter(f.id)}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* 4. Two-Column Module Selector + Active Workbench */}
      <div className="t1-layout">
        <nav className="t1-module-list" aria-label="Topic 1 modules">
          {filteredModules.map((mod) => {
            const p = ownerProgress.modules?.[mod.id]
            const status = getModuleStatus(mod, p)
            const isSelected = mod.id === activeModule.id
            const isWave2 = mod.releaseScope === 'wave2'

            return (
              <button
                key={mod.id}
                type="button"
                className={`t1-module-btn ${isSelected ? 'active' : ''}`}
                aria-current={isSelected ? 'step' : undefined}
                onClick={() => setActiveModuleId(mod.id)}
              >
                <div className="t1-module-top">
                  <span className="t1-sec-code">Section {mod.sectionCode}</span>
                  <span className={`t1-wave-pill ${isWave2 ? 'wave2' : ''}`}>
                    {isWave2 ? 'Wave 2 Consolidation' : 'Wave 1'}
                  </span>
                </div>
                <span className="t1-module-title">{mod.title}</span>
                <span className={`t1-status ${status.key}`}>{status.label}</span>
              </button>
            )
          })}
        </nav>

        <article className="t1-panel" aria-labelledby="t1-active-heading">
          <div className="t1-panel-head">
            <div>
              <div className="t1-module-top">
                <span className="eyebrow" style={{ marginBottom: 0 }}>
                  SECTION {activeModule.sectionCode}
                </span>
                <span
                  className={`t1-wave-pill ${activeModule.releaseScope === 'wave2' ? 'wave2' : ''}`}
                >
                  {activeModule.releaseScope === 'wave2' ? 'Wave 2 Consolidation' : 'Wave 1'}
                </span>
              </div>
              <h2 id="t1-active-heading">{activeModule.title}</h2>
            </div>
            <span className={`pill neutral t1-status ${activeStatus.key}`}>
              {activeStatus.label}
            </span>
          </div>

          {/* Block 1 · Concept & CBT Tip */}
          <section className="t1-block" aria-labelledby="t1-b1-heading">
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id="t1-b1-heading">
                <BookOpenCheck size={15} /> Block 1 · Concept &amp; CBT Tip
              </span>
            </div>
            <p>{activeModule.concept?.summary}</p>
            {Array.isArray(activeModule.concept?.keyPoints) && (
              <ul className="t1-bullets">
                {activeModule.concept.keyPoints.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}
            {activeModule.cbtTip && (
              <div className="t1-trap-box" role="note">
                <AlertTriangle size={18} />
                <div>
                  <strong>CBT Exam Trap:</strong> {activeModule.cbtTip.replace(/^Exam trap:\s*/i, '')}
                </div>
              </div>
            )}
          </section>

          {/* Block 2 · High-Risk Contrasts */}
          <section className="t1-block" aria-labelledby="t1-b2-heading">
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id="t1-b2-heading">
                <Layers3 size={15} /> Block 2 · High-Risk Contrasts
              </span>
            </div>
            <div className="t1-table-wrap">
              <table className="t1-contrast-table">
                <thead>
                  <tr>
                    <th scope="col">Contrast</th>
                    <th scope="col">Exam Rule</th>
                  </tr>
                </thead>
                <tbody>
                  {(activeModule.triggerTable || []).map((row, idx) => (
                    <tr key={idx}>
                      <td>
                        <strong>{row.contrast}</strong>
                      </td>
                      <td>{row.rule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Block 3 · Guided Worked Example */}
          {activeModule.guidedPractice && (
            <section className="t1-block" aria-labelledby="t1-b3-heading">
              <div className="t1-block-head">
                <span className="t1-block-eyebrow" id="t1-b3-heading">
                  <Lightbulb size={15} /> Block 3 · Guided Worked Example
                </span>
              </div>
              <details className="t1-guided" open>
                <summary>{activeModule.guidedPractice.title}</summary>
                <div className="t1-guided-body">
                  <div className="t1-scenario">
                    <strong>Scenario:</strong> {activeModule.guidedPractice.scenario}
                  </div>
                  <ol className="t1-steps">
                    {(activeModule.guidedPractice.steps || []).map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                </div>
              </details>
            </section>
          )}

          {/* Block 4 · Quick Check */}
          <section className="t1-block" aria-labelledby="t1-b4-heading">
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id="t1-b4-heading">
                <ClipboardCheck size={15} /> Block 4 · Quick Check (2/3 or 3/3 to pass)
              </span>
              <span className="compact muted">
                {qcAnsweredCount}/{quickCheck.length} answered
              </span>
            </div>

            <div className="t1-qc-list">
              {quickCheck.map((q, qIdx) => {
                const chosen = qcAnswers[q.id]
                const detail = qcDetailsById.get(q.id)

                return (
                  <fieldset className="t1-qc-item" key={q.id}>
                    <legend>
                      {qIdx + 1}. {q.prompt}
                    </legend>
                    <div className="t1-qc-options">
                      {(q.options || []).map((opt, oIdx) => {
                        const isSelected = chosen === oIdx
                        const isCorrectOpt = qcResult && oIdx === q.correctIndex
                        const isWrongSelected = qcResult && isSelected && !detail?.correct
                        const optClass = [
                          't1-qc-option',
                          isSelected ? 'selected' : '',
                          isCorrectOpt ? 'correct' : '',
                          isWrongSelected ? 'wrong' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')

                        return (
                          <label className={optClass} key={oIdx}>
                            <input
                              type="radio"
                              name={`t1-qc-${activeModule.id}-${q.id}`}
                              checked={isSelected}
                              disabled={Boolean(qcResult)}
                              onChange={() => handleSelectQuickCheckOption(q.id, oIdx)}
                            />
                            <span>{opt}</span>
                          </label>
                        )
                      })}
                    </div>

                    {qcResult && detail && (
                      <div className="t1-qc-rationale">
                        <strong className={detail.correct ? 'success-text' : 'error-text'}>
                          {detail.correct ? 'Correct:' : 'Review:'}
                        </strong>{' '}
                        {detail.rationale || q.rationale}
                      </div>
                    )}
                  </fieldset>
                )
              })}
            </div>

            {qcResult && (
              <div className={`t1-qc-result ${qcResult.passed ? 'pass' : 'fail'}`} role="status">
                <span>
                  <strong>
                    Score: {qcResult.correct}/{qcResult.total} ({qcResult.percent}%)
                  </strong>{' '}
                  · {qcResult.passed ? 'Quick Check passed!' : 'Need at least 2/3 to pass.'}
                </span>
              </div>
            )}

            <div className="button-row">
              {!qcResult ? (
                <button
                  className="btn primary"
                  type="button"
                  disabled={qcAnsweredCount < quickCheck.length}
                  onClick={handleCheckAnswers}
                >
                  Check Answers
                </button>
              ) : (
                <button className="btn outline" type="button" onClick={handleRetryQuickCheck}>
                  <RotateCcw size={15} /> Retry Quick Check
                </button>
              )}
            </div>
          </section>

          {/* Block 5 · Practical Evidence Task */}
          <section className="t1-block" aria-labelledby="t1-b5-heading">
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id="t1-b5-heading">
                <CheckCircle2 size={15} /> Block 5 · Practical Evidence Task
              </span>
            </div>

            <p>{activeModule.evidenceTask?.prompt}</p>

            {Array.isArray(activeModule.evidenceTask?.deliverables) &&
              activeModule.evidenceTask.deliverables.length > 0 && (
                <div className="t1-tags" aria-label="Expected deliverables">
                  {activeModule.evidenceTask.deliverables.map((item, idx) => (
                    <span className="t1-tag" key={idx}>
                      {item}
                    </span>
                  ))}
                </div>
              )}

            <div className="n5g-checklist" role="group" aria-label="Practical verification checklist">
              {(activeModule.evidenceTask?.checklist || []).map((chk) => {
                const checked = Boolean(modProgress.checklist?.[chk.id])
                return (
                  <label className="n5g-check-item" key={chk.id}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleToggleCheckItem(chk.id)}
                    />
                    <span>{chk.label}</span>
                  </label>
                )
              })}
            </div>

            <label className="field" htmlFor={`t1-notes-${activeModule.id}`}>
              <span>
                Written method / evidence notes (min 10 characters · {trimmedNotesLen}/10+)
              </span>
              <textarea
                id={`t1-notes-${activeModule.id}`}
                value={modProgress.evidenceNotes || ''}
                onChange={(e) => handleUpdateNotes(e.target.value)}
                placeholder="Record the exact rule, file path, formula, or check you verified..."
              />
            </label>

            <label className="field" htmlFor={`t1-upload-${activeModule.id}`}>
              <span>Optional practical working file (saved in browser IndexedDB)</span>
              <input
                id={`t1-upload-${activeModule.id}`}
                type="file"
                disabled={fileBusy}
                onChange={handleAttachEvidenceFile}
              />
            </label>

            {modProgress.evidenceFiles?.length > 0 && (
              <div className="stack">
                {modProgress.evidenceFiles.map((fileItem) => (
                  <div className="row-card card" key={fileItem.id}>
                    <FileText size={17} />
                    <div>
                      <strong>{fileItem.file}</strong>
                      <small>Saved on this device</small>
                    </div>
                    <div className="button-row push-right">
                      <button
                        className="btn outline"
                        type="button"
                        onClick={() =>
                          downloadFile(fileItem).catch(() =>
                            notify?.('Evidence file is unavailable on this device.')
                          )
                        }
                      >
                        <Download size={15} /> Download
                      </button>
                      <button
                        className="btn outline"
                        type="button"
                        aria-label={`Remove ${fileItem.file}`}
                        onClick={() => handleRemoveEvidenceFile(fileItem.id)}
                      >
                        <Trash2 size={15} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className={`t1-hint ${canMarkComplete ? 'ready' : ''}`} role="status">
              {canMarkComplete
                ? modProgress.completedAt
                  ? 'All requirements verified and module marked complete.'
                  : 'Quick Check passed, all 3 checks ticked, and notes recorded. Ready to mark complete!'
                : `To complete Section ${activeModule.sectionCode}: ${missingReqs.join('; ')}.`}
            </div>

            <div className="button-row">
              <button
                className="btn primary"
                type="button"
                disabled={!canMarkComplete}
                onClick={handleMarkComplete}
              >
                <CheckCircle2 size={16} />{' '}
                {modProgress.completedAt && canMarkComplete
                  ? 'Module Completed ✓'
                  : 'Mark Module Complete'}
              </button>
            </div>
          </section>

          {/* Module Footer Navigation */}
          <div className="t1-panel-footer">
            {prevModule ? (
              <button
                className="btn outline"
                type="button"
                onClick={() => handleJumpToModule(prevModule)}
              >
                <ArrowLeft size={16} /> Section {prevModule.sectionCode}
              </button>
            ) : (
              <span />
            )}

            {nextModule ? (
              <button
                className="btn primary"
                type="button"
                onClick={() => handleJumpToModule(nextModule)}
              >
                Next: Section {nextModule.sectionCode} <ArrowRight size={16} />
              </button>
            ) : (
              <button
                className="btn primary"
                type="button"
                onClick={() => onNav?.('n5-gate')}
              >
                Proceed to N5 Gate 01 <ArrowRight size={16} />
              </button>
            )}
          </div>
        </article>
      </div>
    </div>
  )
}

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
import {
  computeTopicSummary,
  evaluateQuickCheck,
  formatTopicSummaryText,
  getOwnerTopicProgress,
  getTopicOwnerKey,
  initialModuleProgress,
  isTopicModuleComplete,
  readTopicStore,
  writeTopicStore,
} from './topic-engine.js'
import { readGateStore } from './n5-gate-engine.js'
import { downloadFile, saveFiles } from './files.js'
import { ingestOfficeFile, readOfficeIngestStore, recordOfficeInspection, writeOfficeIngestStore } from './office-ingest.js'
import { Header } from './ui.jsx'

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
  if (isTopicModuleComplete(mod, modProgress)) {
    return { key: 'done', label: 'Completed ✓' }
  }
  if (modProgress?.quickCheckResult?.passed) {
    return { key: 'passed', label: 'Check passed' }
  }
  return { key: 'idle', label: 'Not started' }
}

function getMissingRequirements(mod, modProgress) {
  const missing = []
  const totalQc = Array.isArray(mod?.quickCheck) ? mod.quickCheck.length : 0
  const passThreshold = totalQc > 0 ? Math.ceil((totalQc * 2) / 3) : 2
  if (!modProgress?.quickCheckResult?.passed) {
    missing.push(
      totalQc === 3
        ? 'pass the Quick Check (2/3 or 3/3)'
        : `pass the Quick Check (${passThreshold}/${totalQc}+)`
    )
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

/**
 * Shared Topic Workbench UI for N5 Topic 1 and Topic 2 modules.
 */
export function TopicHub({
  storageKey,
  eyebrow,
  title,
  description,
  summaryFilePrefix,
  summaryLabel,
  fileIdPrefix,
  modules = [],
  filters = [],
  consolidationLabel = '',
  notify,
  onNav,
}) {
  const safeFilters = useMemo(
    () =>
      Array.isArray(filters) && filters.length > 0
        ? filters
        : [{ id: 'all', label: 'All', match: () => true }],
    [filters]
  )

  const [gateStore, setGateStore] = useState(() => readGateStore())
  const [topicStore, setTopicStore] = useState(() => readTopicStore(storageKey))
  const [activeFilter, setActiveFilter] = useState(() => safeFilters[0]?.id || 'all')
  const [activeModuleId, setActiveModuleId] = useState(() => modules[0]?.id || '')
  const [fileBusy, setFileBusy] = useState(false)

  const storeRef = useRef(topicStore)
  storeRef.current = topicStore

  useEffect(() => {
    setTopicStore(readTopicStore(storageKey))
  }, [storageKey])

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
  const ownerKey = getTopicOwnerKey(gateStore)
  const ownerLabel = session
    ? `${session.firstName} ${session.lastName} (${session.studentCode})`
    : 'Local Learner'

  const ownerProgress = useMemo(
    () => getOwnerTopicProgress(topicStore, ownerKey),
    [topicStore, ownerKey]
  )

  const summary = useMemo(
    () => computeTopicSummary(ownerProgress, modules),
    [ownerProgress, modules]
  )

  const filterCounts = useMemo(
    () =>
      safeFilters.map((f) => ({
        ...f,
        count: modules.filter(f.match).length,
      })),
    [safeFilters, modules]
  )

  const filteredModules = useMemo(() => {
    const def = safeFilters.find((f) => f.id === activeFilter) || safeFilters[0]
    return modules.filter(def.match)
  }, [safeFilters, modules, activeFilter])

  const activeModule = useMemo(() => {
    return (
      filteredModules.find((m) => m.id === activeModuleId) ||
      filteredModules[0] ||
      modules[0]
    )
  }, [filteredModules, activeModuleId, modules])

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

  const activeGlobalIndex = modules.findIndex((m) => m.id === activeModule?.id)
  const prevModule = activeGlobalIndex > 0 ? modules[activeGlobalIndex - 1] : null
  const nextModule =
    activeGlobalIndex >= 0 && activeGlobalIndex < modules.length - 1
      ? modules[activeGlobalIndex + 1]
      : null

  function updateModuleProgress(moduleId, updater) {
    setTopicStore((prev) => {
      const currentOwner = getOwnerTopicProgress(prev, ownerKey)
      const currentMod = {
        ...initialModuleProgress(),
        ...(currentOwner.modules?.[moduleId] || {}),
      }
      const nextMod =
        typeof updater === 'function' ? updater(currentMod) : { ...currentMod, ...updater }
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
      writeTopicStore(storageKey, nextStore)
      return nextStore
    })
  }

  function handleSelectFilter(filterId) {
    setActiveFilter(filterId)
    const def = safeFilters.find((f) => f.id === filterId) || safeFilters[0]
    const list = modules.filter(def.match)
    if (list.length > 0 && !list.some((m) => m.id === activeModuleId)) {
      setActiveModuleId(list[0].id)
    }
  }

  function handleJumpToModule(targetMod) {
    if (!targetMod) return
    const currentDef = safeFilters.find((f) => f.id === activeFilter) || safeFilters[0]
    if (!currentDef.match(targetMod)) {
      setActiveFilter(safeFilters[0]?.id || 'all')
    }
    setActiveModuleId(targetMod.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleExportSummary() {
    const text = formatTopicSummaryText({
      title,
      ownerLabel,
      ownerProgress,
      modules,
      consolidationLabel,
    })
    triggerTextDownload(`${summaryFilePrefix}-Summary-${ownerKey}.txt`, text)
    notify?.(`${summaryLabel} summary (.txt) downloaded.`)
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
      const fileId = `${fileIdPrefix}-${ownerKey}-${activeModule.id}-${Date.now()}`
      await saveFiles([{ id: fileId, blob: file }])
      let officeReport = null
      try {
        const buffer = await file.arrayBuffer()
        officeReport = await ingestOfficeFile({
          fileName: file.name,
          buffer,
          byteSize: file.size,
          studentCode: ownerKey,
          course: 'cpn5',
          contextTag: `${fileIdPrefix}-${activeModule.id}`,
          fileId,
        })
        const nextOffice = recordOfficeInspection(readOfficeIngestStore(), officeReport)
        writeOfficeIngestStore(nextOffice)
      } catch {
        // Non-Office or unsupported binary file still remains attached cleanly.
      }
      updateModuleProgress(activeModule.id, (curr) => ({
        ...curr,
        evidenceFiles: [
          ...(Array.isArray(curr.evidenceFiles) ? curr.evidenceFiles : []),
          {
            id: fileId,
            file: file.name,
            size: file.size,
            savedAt: Date.now(),
            officeSummary: officeReport?.summary || '',
            officeWarnings: officeReport?.leakWarnings?.length || 0,
          },
        ],
      }))
      notify?.(
        officeReport?.leakWarnings?.length
          ? `Saved "${file.name}" · ${officeReport.leakWarnings.length} Office check warning(s) flagged.`
          : `Saved "${file.name}" to your device evidence vault.`
      )
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
    if (!activeModule?.id || !isTopicModuleComplete(activeModule, modProgress)) return
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
  const qcPassThreshold = quickCheck.length > 0 ? Math.ceil((quickCheck.length * 2) / 3) : 2
  const qcPassRuleLabel =
    quickCheck.length === 3
      ? '2/3 or 3/3 to pass'
      : `${qcPassThreshold}/${quickCheck.length}+ to pass`
  const qcResult = modProgress.quickCheckResult
  const qcDetailsById = new Map((qcResult?.details || []).map((d) => [d.id, d]))

  const canMarkComplete = isTopicModuleComplete(activeModule, modProgress)
  const missingReqs = getMissingRequirements(activeModule, modProgress)
  const trimmedNotesLen = String(modProgress.evidenceNotes || '').trim().length
  const checklistCount = Array.isArray(activeModule.evidenceTask?.checklist)
    ? activeModule.evidenceTask.checklist.length
    : 0
  const activeStatus = getModuleStatus(activeModule, modProgress)

  return (
    <div className="t1-shell">
      <Header eyebrow={eyebrow} title={title} description={description}>
        <button className="btn outline" type="button" onClick={handleExportSummary}>
          <Download size={16} /> Export {summaryLabel} Summary
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
      <section className="t1-summary" aria-label={`${summaryLabel} completion summary`}>
        <div className="t1-summary-stats">
          <div className="t1-stat-box">
            <small>Wave 1 Progress</small>
            <strong>
              {summary.wave1Completed} / {summary.wave1Total} modules
            </strong>
          </div>
          <div className="t1-stat-box">
            <small>Total {summaryLabel}</small>
            <strong>
              {summary.completedModules} / {summary.totalModules} completed
            </strong>
          </div>
        </div>

        <div className="t1-summary-bar-wrap">
          <div className="t1-summary-bar-head">
            <span>Overall {summaryLabel} mastery</span>
            <span>{summary.percent}%</span>
          </div>
          <div
            className="t1-progress-track"
            role="progressbar"
            aria-valuenow={summary.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${summaryLabel} completion percentage`}
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
      <div
        className="t1-filter-row"
        role="tablist"
        aria-label={`Filter ${summaryLabel} modules by category`}
      >
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
        <nav className="t1-module-list" aria-label={`${summaryLabel} modules`}>
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

        <article className="t1-panel" aria-labelledby={`${fileIdPrefix}-active-heading`}>
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
              <h2 id={`${fileIdPrefix}-active-heading`}>{activeModule.title}</h2>
            </div>
            <span className={`pill neutral t1-status ${activeStatus.key}`}>
              {activeStatus.label}
            </span>
          </div>

          {/* Block 1 · Concept & CBT Tip */}
          <section className="t1-block" aria-labelledby={`${fileIdPrefix}-b1-heading`}>
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id={`${fileIdPrefix}-b1-heading`}>
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
          <section className="t1-block" aria-labelledby={`${fileIdPrefix}-b2-heading`}>
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id={`${fileIdPrefix}-b2-heading`}>
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
            <section className="t1-block" aria-labelledby={`${fileIdPrefix}-b3-heading`}>
              <div className="t1-block-head">
                <span className="t1-block-eyebrow" id={`${fileIdPrefix}-b3-heading`}>
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
          <section className="t1-block" aria-labelledby={`${fileIdPrefix}-b4-heading`}>
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id={`${fileIdPrefix}-b4-heading`}>
                <ClipboardCheck size={15} /> Block 4 · Quick Check ({qcPassRuleLabel})
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
                              name={`${fileIdPrefix}-qc-${activeModule.id}-${q.id}`}
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
                  · {qcResult.passed ? 'Quick Check passed!' : `Need at least ${qcPassThreshold}/${qcResult.total} to pass.`}
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
          <section className="t1-block" aria-labelledby={`${fileIdPrefix}-b5-heading`}>
            <div className="t1-block-head">
              <span className="t1-block-eyebrow" id={`${fileIdPrefix}-b5-heading`}>
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

            <label className="field" htmlFor={`${fileIdPrefix}-notes-${activeModule.id}`}>
              <span>
                Written method / evidence notes (min 10 characters · {trimmedNotesLen}/10+)
              </span>
              <textarea
                id={`${fileIdPrefix}-notes-${activeModule.id}`}
                value={modProgress.evidenceNotes || ''}
                onChange={(e) => handleUpdateNotes(e.target.value)}
                placeholder="Record the exact rule, file path, formula, or check you verified..."
              />
            </label>

            <label className="field" htmlFor={`${fileIdPrefix}-upload-${activeModule.id}`}>
              <span>Optional practical working file (saved in browser IndexedDB)</span>
              <input
                id={`${fileIdPrefix}-upload-${activeModule.id}`}
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
                      <small>
                        Saved on this device
                        {fileItem.officeSummary ? ` · ${fileItem.officeSummary}` : ''}
                        {fileItem.officeWarnings > 0 ? ` · ${fileItem.officeWarnings} Office warning(s)` : ''}
                      </small>
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
                  : `Quick Check passed, all ${checklistCount} checks ticked, and notes recorded. Ready to mark complete!`
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

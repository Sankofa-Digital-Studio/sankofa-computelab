function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizeEvidenceFileName(entry) {
  if (typeof entry === 'string') {
    return entry.trim()
  }
  if (isPlainObject(entry)) {
    const raw = entry.name ?? entry.file ?? entry.filename ?? ''
    return typeof raw === 'string' ? raw.trim() : ''
  }
  return ''
}

/**
 * Create a clean empty Topic persistence store.
 */
export function createInitialTopicStore() {
  return {
    version: 1,
    byOwner: {},
  }
}

/**
 * Resolve the storage owner key from an active N5 Gate session, defaulting to 'local-learner'.
 */
export function getTopicOwnerKey(gateStore) {
  const code = typeof gateStore?.session?.studentCode === 'string'
    ? gateStore.session.studentCode.trim()
    : ''
  return code || 'local-learner'
}

/**
 * Read and normalize a Topic store from Web Storage without throwing on missing or corrupt JSON.
 */
export function readTopicStore(storageKey, storage = globalThis.localStorage) {
  const fallback = createInitialTopicStore()
  if (typeof storageKey !== 'string' || !storageKey.trim()) {
    return fallback
  }
  if (!storage || typeof storage.getItem !== 'function') {
    return fallback
  }
  try {
    const raw = storage.getItem(storageKey)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!isPlainObject(parsed)) {
      return fallback
    }
    return {
      version: 1,
      byOwner: isPlainObject(parsed.byOwner) ? parsed.byOwner : {},
    }
  } catch {
    return fallback
  }
}

/**
 * Persist a Topic store to Web Storage safely.
 */
export function writeTopicStore(storageKey, store, storage = globalThis.localStorage) {
  if (typeof storageKey !== 'string' || !storageKey.trim()) {
    return false
  }
  if (!storage || typeof storage.setItem !== 'function') {
    return false
  }
  try {
    const payload = isPlainObject(store) ? store : createInitialTopicStore()
    storage.setItem(storageKey, JSON.stringify(payload))
    return true
  } catch {
    return false
  }
}

/**
 * Return normalized Topic progress for a given owner key.
 */
export function getOwnerTopicProgress(store, ownerKey) {
  const resolvedKey = typeof ownerKey === 'string' && ownerKey.trim()
    ? ownerKey.trim()
    : 'local-learner'
  const rawOwner = isPlainObject(store?.byOwner?.[resolvedKey])
    ? store.byOwner[resolvedKey]
    : null
  if (!rawOwner) {
    return { modules: {} }
  }
  return {
    ...rawOwner,
    modules: isPlainObject(rawOwner.modules) ? rawOwner.modules : {},
  }
}

/**
 * Create a clean default progress record for a single Topic module.
 */
export function initialModuleProgress() {
  return {
    quickCheckAnswers: {},
    quickCheckResult: null,
    evidenceNotes: '',
    checklist: {},
    evidenceFiles: [],
    completedAt: null,
  }
}

/**
 * Score a module's quick-check answers and return per-question rationale and leak diagnostics.
 */
export function evaluateQuickCheck(moduleDef, answers) {
  const questions = Array.isArray(moduleDef?.quickCheck) ? moduleDef.quickCheck : []
  const answerMap = isPlainObject(answers) ? answers : {}

  let correct = 0
  const details = questions.map((question) => {
    const optionCount = Array.isArray(question?.options) ? question.options.length : 0
    const rawSelected = answerMap[question?.id]
    const selectedIndex =
      Number.isInteger(rawSelected) && rawSelected >= 0 && rawSelected < optionCount
        ? rawSelected
        : null
    const isCorrect = selectedIndex !== null && selectedIndex === question.correctIndex
    if (isCorrect) {
      correct += 1
    }
    return {
      id: question?.id || '',
      selectedIndex,
      correctIndex: question?.correctIndex ?? -1,
      correct: isCorrect,
      rationale: question?.rationale || '',
      leak: question?.leak || moduleDef?.leakCode || '',
    }
  })

  const total = questions.length
  const percent = total > 0 ? Math.round((correct / total) * 100) : 0
  const passThreshold = total > 0 ? Math.ceil((total * 2) / 3) : 0
  const passed = total > 0 && correct >= passThreshold

  return {
    correct,
    total,
    percent,
    passed,
    details,
  }
}

/**
 * Determine whether a Topic module is complete: quick check passed, all checklist boxes ticked, and >= 10 chars of evidence notes.
 */
export function isTopicModuleComplete(moduleDef, modProgress) {
  if (!isPlainObject(moduleDef) || !isPlainObject(modProgress)) {
    return false
  }
  if (!modProgress.quickCheckResult?.passed) {
    return false
  }

  const checklistItems = Array.isArray(moduleDef.evidenceTask?.checklist)
    ? moduleDef.evidenceTask.checklist
    : []
  if (checklistItems.length === 0) {
    return false
  }

  const checklistState = isPlainObject(modProgress.checklist) ? modProgress.checklist : {}
  const allChecked = checklistItems.every((item) => Boolean(item?.id && checklistState[item.id]))
  if (!allChecked) {
    return false
  }

  return String(modProgress.evidenceNotes ?? '').trim().length >= 10
}

/**
 * Aggregate overall and Wave 1 completion, quick checks passed, and evidence files across Topic modules.
 */
export function computeTopicSummary(ownerProgress, modules = []) {
  const moduleList = Array.isArray(modules) ? modules : []
  const progressModules = isPlainObject(ownerProgress?.modules) ? ownerProgress.modules : {}

  let wave1Total = 0
  let wave1Completed = 0
  let completedModules = 0
  let quickChecksPassed = 0
  let evidenceFilesCount = 0

  for (const mod of moduleList) {
    if (!mod?.id) continue
    const isWave1 = mod.releaseScope === 'wave1'
    if (isWave1) {
      wave1Total += 1
    }

    const modProgress = isPlainObject(progressModules[mod.id]) ? progressModules[mod.id] : null
    if (modProgress?.quickCheckResult?.passed) {
      quickChecksPassed += 1
    }

    if (Array.isArray(modProgress?.evidenceFiles)) {
      const validFiles = modProgress.evidenceFiles.map(normalizeEvidenceFileName).filter(Boolean)
      evidenceFilesCount += validFiles.length
    }

    if (isTopicModuleComplete(mod, modProgress)) {
      completedModules += 1
      if (isWave1) {
        wave1Completed += 1
      }
    }
  }

  const totalModules = moduleList.length
  const percent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0
  const readyForConsolidation = wave1Total > 0 && wave1Completed === wave1Total

  return {
    totalModules,
    wave1Total,
    wave1Completed,
    completedModules,
    percent,
    quickChecksPassed,
    evidenceFilesCount,
    readyForConsolidation,
  }
}

/**
 * Format a clean plain-text Topic work and evidence summary for learners or lecturers.
 */
export function formatTopicSummaryText({
  title = 'Topic Workbench',
  ownerLabel,
  ownerProgress,
  modules = [],
  consolidationLabel = '',
} = {}) {
  const resolvedTitle = typeof title === 'string' && title.trim()
    ? title.trim()
    : 'Topic Workbench'
  const label = typeof ownerLabel === 'string' && ownerLabel.trim()
    ? ownerLabel.trim()
    : 'Local Learner'
  const moduleList = Array.isArray(modules) ? modules : []
  const progressModules = isPlainObject(ownerProgress?.modules) ? ownerProgress.modules : {}
  const summary = computeTopicSummary(ownerProgress, moduleList)
  const readinessHeading = typeof consolidationLabel === 'string' && consolidationLabel.trim()
    ? `Consolidation Readiness (${consolidationLabel.trim()})`
    : 'Consolidation Readiness'

  const lines = [
    `SANKOFA COMPUTELAB · ${resolvedTitle.toUpperCase()}`,
    '====================================================================',
    `Learner: ${label}`,
    `Overall Completion: ${summary.completedModules}/${summary.totalModules} modules (${summary.percent}%)`,
    `Wave 1 Progress: ${summary.wave1Completed}/${summary.wave1Total} modules`,
    `Quick Checks Passed: ${summary.quickChecksPassed}/${summary.totalModules}`,
    `Evidence Files Attached: ${summary.evidenceFilesCount}`,
    `${readinessHeading}: ${summary.readyForConsolidation ? 'Ready' : 'In Progress'}`,
    '',
    'MODULE BREAKDOWN',
    '----------------',
  ]

  for (const mod of moduleList) {
    if (!mod?.id) continue
    const modProgress = isPlainObject(progressModules[mod.id]) ? progressModules[mod.id] : null
    const complete = isTopicModuleComplete(mod, modProgress)
    const qcResult = modProgress?.quickCheckResult
    const checklistItems = Array.isArray(mod.evidenceTask?.checklist) ? mod.evidenceTask.checklist : []
    const checklistState = isPlainObject(modProgress?.checklist) ? modProgress.checklist : {}
    const checkedCount = checklistItems.filter((item) => Boolean(item?.id && checklistState[item.id])).length
    const files = Array.isArray(modProgress?.evidenceFiles)
      ? modProgress.evidenceFiles.map(normalizeEvidenceFileName).filter(Boolean)
      : []
    const notes = String(modProgress?.evidenceNotes ?? '').trim()

    let status = 'Not Started'
    if (complete) {
      status = 'Complete'
    } else if (qcResult?.passed) {
      status = 'Quick Check Passed'
    } else if (qcResult || checkedCount > 0 || notes.length > 0 || files.length > 0) {
      status = 'In Progress'
    }

    const qcText = qcResult && Number.isFinite(qcResult.correct) && Number.isFinite(qcResult.total)
      ? `${qcResult.correct}/${qcResult.total} (${qcResult.passed ? 'Pass' : 'Review'})`
      : 'Not attempted'
    const filesText = files.length > 0 ? files.join(', ') : 'None'

    lines.push(
      `[Section ${mod.sectionCode} · ${mod.releaseScope}] ${mod.title} — ${status}`,
      `  Quick Check: ${qcText} | Checklist: ${checkedCount}/${checklistItems.length} | Files: ${filesText}`
    )
    if (notes) {
      lines.push(`  Evidence Notes: ${notes}`)
    }
  }

  return lines.join('\n')
}

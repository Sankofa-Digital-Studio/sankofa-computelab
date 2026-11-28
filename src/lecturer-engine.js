import { GATE_RUBRIC, LEAK_GUIDANCE, N5_ROSTER } from './n5-gate-data.js'
import { getAllRoster, readGateStore } from './n5-gate-engine.js'
import { computeTopicSummary, readTopicStore } from './topic-engine.js'
import { TOPIC1_MODULES } from './topic1-data.js'
import { TOPIC2_MODULES } from './topic2-data.js'
import { TOPIC3_MODULES } from './topic3-data.js'
import { TOPIC4_MODULES } from './topic4-data.js'
import { TOPIC5_MODULES } from './topic5-data.js'
import { marksPlan } from './learning-model.js'
import { LEAK_TO_PATHWAY_MAP } from './lecturer-data.js'
import { readOfficeIngestStore } from './office-ingest.js'

export const LECTURER_STORAGE_KEY = 'sankofa-lecturer-ops-v1'
export const DEFAULT_LECTURER_PIN = 'SANKOFA-2026'

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

export function createInitialLecturerStore() {
  return {
    version: 1,
    unlocked: false,
    lecturerName: 'Lead Lecturer',
    pinOverride: '',
    issues: [],
    customPathways: {},
    gateDecisions: {},
    alerts: [],
    auditLog: [],
  }
}

export function readLecturerStore(storage = globalThis.localStorage) {
  const fallback = createInitialLecturerStore()
  if (!storage || typeof storage.getItem !== 'function') return fallback
  try {
    const raw = storage.getItem(LECTURER_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!isPlainObject(parsed)) return fallback
    return {
      version: 1,
      unlocked: Boolean(parsed.unlocked),
      lecturerName: typeof parsed.lecturerName === 'string' && parsed.lecturerName.trim()
        ? parsed.lecturerName.trim()
        : 'Lead Lecturer',
      pinOverride: typeof parsed.pinOverride === 'string' ? parsed.pinOverride : '',
      issues: Array.isArray(parsed.issues) ? parsed.issues : [],
      customPathways: isPlainObject(parsed.customPathways) ? parsed.customPathways : {},
      gateDecisions: isPlainObject(parsed.gateDecisions) ? parsed.gateDecisions : {},
      alerts: Array.isArray(parsed.alerts) ? parsed.alerts : [],
      auditLog: Array.isArray(parsed.auditLog) ? parsed.auditLog : [],
    }
  } catch {
    return fallback
  }
}

export function writeLecturerStore(store, storage = globalThis.localStorage) {
  if (!storage || typeof storage.setItem !== 'function') return false
  try {
    storage.setItem(
      LECTURER_STORAGE_KEY,
      JSON.stringify(isPlainObject(store) ? store : createInitialLecturerStore())
    )
    return true
  } catch {
    return false
  }
}

export function verifyLecturerPin(store, candidatePin, lecturerName) {
  const expected = (store?.pinOverride || DEFAULT_LECTURER_PIN).trim().toUpperCase()
  const actual = String(candidatePin ?? '').trim().toUpperCase()
  if (!actual || actual !== expected) {
    return { ok: false, error: 'Invalid lecturer access PIN.' }
  }
  const cleanName = String(lecturerName ?? '').trim() || store?.lecturerName || 'Lead Lecturer'
  const entry = {
    id: `aud-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    actor: cleanName,
    action: 'lecturer_sign_in',
    studentCode: 'COHORT',
    detail: 'Lecturer console unlocked.',
  }
  return {
    ok: true,
    store: {
      ...(store || createInitialLecturerStore()),
      unlocked: true,
      lecturerName: cleanName,
      auditLog: [entry, ...(store?.auditLog || [])].slice(0, 100),
    },
  }
}

export function lockLecturerConsole(store) {
  return {
    ...(store || createInitialLecturerStore()),
    unlocked: false,
  }
}

export function setLecturerPinOverride(store, newPin) {
  const clean = String(newPin ?? '').trim()
  if (clean && clean.length < 4) {
    return { ok: false, error: 'Custom lecturer PIN must be at least 4 characters (or leave blank to restore default).' }
  }
  const base = store || createInitialLecturerStore()
  const now = new Date().toISOString()
  const auditEntry = {
    id: `aud-${Date.now().toString(36)}`,
    at: now,
    actor: base.lecturerName || 'Lead Lecturer',
    action: clean ? 'pin_updated' : 'pin_reset',
    studentCode: 'COHORT',
    detail: clean ? 'Updated private lecturer console PIN.' : 'Restored default pilot lecturer PIN.',
  }
  return {
    ok: true,
    store: {
      ...base,
      pinOverride: clean,
      auditLog: [auditEntry, ...(base.auditLog || [])].slice(0, 100),
    },
  }
}

export function createIssueTicket(
  store,
  {
    studentCode = 'local-learner',
    studentName = 'Local Learner',
    course = 'cpn5',
    issueType = 'assessment',
    priority = 'normal',
    subject = '',
    details = '',
    route = 'feedback',
  } = {}
) {
  const cleanSubject = String(subject ?? '').trim()
  const cleanDetails = String(details ?? '').trim()
  if (!cleanSubject || !cleanDetails) {
    return { ok: false, error: 'Provide both an issue subject and description.' }
  }
  const ticket = {
    id: `iss-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    studentCode: String(studentCode || 'local-learner').trim() || 'local-learner',
    studentName: String(studentName || 'Local Learner').trim() || 'Local Learner',
    course: course || 'cpn5',
    issueType: issueType || 'assessment',
    priority: ['low', 'normal', 'high', 'blocker'].includes(priority) ? priority : 'normal',
    subject: cleanSubject,
    details: cleanDetails,
    route: route || 'feedback',
    status: 'open',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    replies: [],
  }
  const base = store || createInitialLecturerStore()
  return {
    ok: true,
    ticket,
    store: {
      ...base,
      issues: [ticket, ...(base.issues || [])].slice(0, 200),
    },
  }
}

export function replyToIssueTicket(store, { issueId, authorRole = 'lecturer', authorName, body, nextStatus } = {}) {
  const cleanBody = String(body ?? '').trim()
  if (!issueId || !cleanBody) {
    return { ok: false, error: 'Reply message cannot be empty.' }
  }
  const base = store || createInitialLecturerStore()
  const now = new Date().toISOString()
  let found = false
  const issues = (base.issues || []).map((item) => {
    if (item.id !== issueId) return item
    found = true
    const resolvedStatus =
      nextStatus && ['open', 'in_review', 'resolved'].includes(nextStatus)
        ? nextStatus
        : authorRole === 'lecturer' && item.status === 'open'
          ? 'in_review'
          : item.status
    return {
      ...item,
      status: resolvedStatus,
      updatedAt: now,
      replies: [
        ...(item.replies || []),
        {
          id: `rep-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
          authorRole,
          authorName: authorName || (authorRole === 'lecturer' ? base.lecturerName || 'Lecturer' : item.studentName),
          body: cleanBody,
          date: now,
        },
      ],
    }
  })

  if (!found) {
    return { ok: false, error: 'Issue ticket not found.' }
  }
  return {
    ok: true,
    store: { ...base, issues },
  }
}

export function updateIssueStatus(store, issueId, status, note = '') {
  if (!['open', 'in_review', 'resolved'].includes(status)) {
    return store
  }
  const base = store || createInitialLecturerStore()
  const now = new Date().toISOString()
  const target = (base.issues || []).find((i) => i.id === issueId)
  const issues = (base.issues || []).map((item) =>
    item.id === issueId ? { ...item, status, updatedAt: now } : item
  )
  const auditEntry = target
    ? {
        id: `aud-${Date.now().toString(36)}`,
        at: now,
        actor: base.lecturerName || 'Lead Lecturer',
        action: `issue_${status}`,
        studentCode: target.studentCode,
        detail: `${target.subject}${note ? ` — ${note}` : ''}`,
      }
    : null
  return {
    ...base,
    issues,
    auditLog: auditEntry ? [auditEntry, ...(base.auditLog || [])].slice(0, 100) : base.auditLog,
  }
}

export function buildRecommendedPathwayForLeaks(leaks = [], customNote = '') {
  const uniqueLeaks = [...new Set((Array.isArray(leaks) ? leaks : []).filter(Boolean))]
  const steps = uniqueLeaks.map((leak, idx) => {
    const map = LEAK_TO_PATHWAY_MAP[leak] || {
      label: LEAK_GUIDANCE[leak]?.title || leak,
      topicRoute: 'learning',
      topicLabel: 'Mastery Pathway · Repair Studio',
      officeDrill: LEAK_GUIDANCE[leak]?.action || 'Complete targeted recovery drill and attach verification evidence.',
      gateFocus: 'Targeted Recovery',
    }
    return {
      id: `step-${idx + 1}-${leak}`,
      leak,
      title: map.label,
      route: map.topicRoute,
      routeLabel: map.topicLabel,
      officeDrill: map.officeDrill,
      gateFocus: map.gateFocus,
      completed: false,
    }
  })

  if (steps.length === 0) {
    steps.push({
      id: 'step-1-enrichment',
      leak: 'ENRICHMENT',
      title: 'Independent Extension & N6 Transfer Check',
      route: 'challenges',
      routeLabel: 'Challenge Lab · N5 Careers Clinic / N6 Bridge',
      officeDrill: 'Complete a timed practical challenge with changed-facts verification and upload .xlsx/.docx proof.',
      gateFocus: 'Enrichment & Transfer',
      completed: false,
    })
  }

  return {
    steps,
    note:
      String(customNote || '').trim() ||
      (uniqueLeaks.length
        ? `Target top leaks (${uniqueLeaks.join(', ')}) in sequence before requesting next gate release.`
        : 'Zero leaks detected. Proceed to timed Challenge Lab transfer verification.'),
  }
}

export function assignCustomPathway(store, { studentCode, leaks = [], note = '', dueLabel = '' } = {}) {
  if (!studentCode) return { ok: false, error: 'Select a student first.' }
  const base = store || createInitialLecturerStore()
  const built = buildRecommendedPathwayForLeaks(leaks, note)
  const now = new Date().toISOString()
  const pathway = {
    studentCode,
    assignedAt: now,
    assignedBy: base.lecturerName || 'Lead Lecturer',
    dueLabel: String(dueLabel || '').trim() || 'Before next gate window',
    note: built.note,
    leaks: [...new Set(leaks)],
    steps: built.steps,
  }
  const auditEntry = {
    id: `aud-${Date.now().toString(36)}`,
    at: now,
    actor: pathway.assignedBy,
    action: 'pathway_assigned',
    studentCode,
    detail: `Assigned ${pathway.steps.length} custom step(s) for ${pathway.leaks.join(', ') || 'enrichment'}.`,
  }
  return {
    ok: true,
    pathway,
    store: {
      ...base,
      customPathways: { ...(base.customPathways || {}), [studentCode]: pathway },
      auditLog: [auditEntry, ...(base.auditLog || [])].slice(0, 100),
    },
  }
}

export function togglePathwayStep(store, studentCode, stepId) {
  const base = store || createInitialLecturerStore()
  const current = base.customPathways?.[studentCode]
  if (!current) return base
  const updated = {
    ...current,
    steps: current.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s)),
  }
  return {
    ...base,
    customPathways: { ...(base.customPathways || {}), [studentCode]: updated },
  }
}

export function clearCustomPathway(store, studentCode) {
  const base = store || createInitialLecturerStore()
  if (!studentCode || !base.customPathways?.[studentCode]) return base
  const nextPathways = { ...(base.customPathways || {}) }
  delete nextPathways[studentCode]
  const auditEntry = {
    id: `aud-${Date.now().toString(36)}`,
    at: new Date().toISOString(),
    actor: base.lecturerName || 'Lead Lecturer',
    action: 'pathway_cleared',
    studentCode,
    detail: 'Cleared assigned custom pathway.',
  }
  return {
    ...base,
    customPathways: nextPathways,
    auditLog: [auditEntry, ...(base.auditLog || [])].slice(0, 100),
  }
}

export function recordGateDecision(store, { studentCode, decision, note = '' } = {}) {
  const valid = ['not_released', 'released', 'remediation_hold', 'integrity_hold', 'cleared_next_gate']
  if (!studentCode || !valid.includes(decision)) {
    return { ok: false, error: 'Invalid student or gate decision.' }
  }
  const cleanNote = String(note ?? '').trim()
  if ((decision === 'remediation_hold' || decision === 'integrity_hold' || decision === 'cleared_next_gate') && !cleanNote) {
    return { ok: false, error: 'Moderation note is required when placing a hold or clearing a gate.' }
  }
  const base = store || createInitialLecturerStore()
  const now = new Date().toISOString()
  const record = {
    decision,
    note: cleanNote,
    updatedAt: now,
    updatedBy: base.lecturerName || 'Lead Lecturer',
  }
  const auditEntry = {
    id: `aud-${Date.now().toString(36)}`,
    at: now,
    actor: record.updatedBy,
    action: `gate_${decision}`,
    studentCode,
    detail: cleanNote || `Status changed to ${decision}`,
  }
  return {
    ok: true,
    record,
    store: {
      ...base,
      gateDecisions: { ...(base.gateDecisions || {}), [studentCode]: record },
      auditLog: [auditEntry, ...(base.auditLog || [])].slice(0, 100),
    },
  }
}

export function sendLecturerAlert(store, { targetStudentCode = 'ALL', severity = 'warning', title = '', message = '' } = {}) {
  const cleanTitle = String(title ?? '').trim()
  const cleanMsg = String(message ?? '').trim()
  if (!cleanTitle || !cleanMsg) {
    return { ok: false, error: 'Alert title and message are required.' }
  }
  const base = store || createInitialLecturerStore()
  const alert = {
    id: `alt-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 5)}`,
    targetStudentCode: String(targetStudentCode || 'ALL').trim() || 'ALL',
    severity: ['info', 'warning', 'urgent'].includes(severity) ? severity : 'warning',
    title: cleanTitle,
    message: cleanMsg,
    createdAt: new Date().toISOString(),
    createdBy: base.lecturerName || 'Lead Lecturer',
    dismissedBy: [],
  }
  return {
    ok: true,
    alert,
    store: {
      ...base,
      alerts: [alert, ...(base.alerts || [])].slice(0, 100),
    },
  }
}

export function dismissAlertForStudent(store, alertId, studentCode = 'local-learner') {
  const base = store || createInitialLecturerStore()
  return {
    ...base,
    alerts: (base.alerts || []).map((a) =>
      a.id === alertId
        ? { ...a, dismissedBy: [...new Set([...(a.dismissedBy || []), studentCode])] }
        : a
    ),
  }
}

export function removeLecturerAlert(store, alertId) {
  const base = store || createInitialLecturerStore()
  return {
    ...base,
    alerts: (base.alerts || []).filter((a) => a.id !== alertId),
  }
}

/**
 * Compute per-student and cohort-wide diagnostics across Gate 01, Topic 1–5 Hubs, Mastery Pathway, Issues, and MS Office uploads.
 */
export function buildCohortDiagnostics({
  gateStore,
  studyState,
  topicStores = {},
  officeStore,
  lecturerStore,
} = {}) {
  const gate = gateStore || { recordsByStudent: {}, customRoster: [], session: null }
  const study = studyState || {}
  const office = officeStore || { reports: [] }
  const lecturer = lecturerStore || createInitialLecturerStore()

  const roster = getAllRoster(gate)
  const rosterCodes = new Set(roster.map((r) => r.studentCode))
  const extraCodeSet = new Set()
  const addExtraCode = (code) => {
    const clean = String(code || '').trim()
    if (!clean || clean === 'ALL' || clean === 'COHORT' || clean === 'LECTURER-AUDIT' || rosterCodes.has(clean)) {
      return
    }
    extraCodeSet.add(clean)
  }

  for (const c of Object.keys(gate.recordsByStudent || {})) addExtraCode(c)
  for (const storeObj of Object.values(topicStores || {})) {
    for (const [owner, prog] of Object.entries(storeObj?.byOwner || {})) {
      if (prog?.modules && Object.keys(prog.modules).length > 0) addExtraCode(owner)
    }
  }
  for (const r of office.reports || []) addExtraCode(r.studentCode)
  for (const i of lecturer.issues || []) addExtraCode(i.studentCode)
  for (const c of Object.keys(lecturer.customPathways || {})) addExtraCode(c)
  for (const c of Object.keys(lecturer.gateDecisions || {})) addExtraCode(c)

  const studentList = [
    ...roster.map((r) => ({
      studentCode: r.studentCode,
      name: `${r.firstName} ${r.lastName}`,
      isRostered: true,
    })),
    ...[...extraCodeSet].map((c) => ({
      studentCode: c,
      name: c === 'local-learner' ? 'Local Learner (Unclaimed)' : c,
      isRostered: false,
    })),
  ]

  const n5Marks = Array.isArray(study.learning?.cpn5?.marks) ? study.learning.cpn5.marks : ['', '', '']
  const n5MarksPlan = marksPlan(n5Marks)

  const topicDefs = [
    ['topic1', TOPIC1_MODULES, 'sankofa-n5-topic1-v1'],
    ['topic2', TOPIC2_MODULES, 'sankofa-n5-topic2-v1'],
    ['topic3', TOPIC3_MODULES, 'sankofa-n5-topic3-v1'],
    ['topic4', TOPIC4_MODULES, 'sankofa-n5-topic4-v1'],
    ['topic5', TOPIC5_MODULES, 'sankofa-n5-topic5-v1'],
  ]

  const learners = studentList.map((entry) => {
    const rec = gate.recordsByStudent?.[entry.studentCode] || null
    const submitted = Boolean(rec?.submittedAt && rec?.result)
    const answeredCount = rec?.answers ? Object.keys(rec.answers).length : 0
    const durationSec =
      rec?.startedAt && rec?.submittedAt ? Math.max(0, Math.round((rec.submittedAt - rec.startedAt) / 1000)) : null

    const suspiciouslyFast = Boolean(submitted && durationSec !== null && durationSec < 90)
    const lowAnswerCoverage = Boolean(submitted && answeredCount < 6)
    const integrityHold = suspiciouslyFast || lowAnswerCoverage

    const gatePercent = submitted ? rec.result.percent : null
    const readinessBand = submitted ? rec.result.readinessBand : rec?.startedAt ? 'in_progress' : 'not_started'
    const topLeaks = submitted ? rec.result.recommendedLeaks || [] : []
    const overconfidentCount = submitted ? rec.result.overconfidentCount || 0 : 0

    const topics = {}
    let totalTopicMods = 0
    let completedTopicMods = 0
    for (const [tKey, mods, storageKey] of topicDefs) {
      const storeObj = topicStores[tKey] || topicStores[storageKey] || { byOwner: {} }
      const ownerProg = storeObj?.byOwner?.[entry.studentCode] || { modules: {} }
      const summary = computeTopicSummary(ownerProg, mods)
      topics[tKey] = summary
      totalTopicMods += summary.totalModules
      completedTopicMods += summary.completedModules
    }
    const topicOverallPercent = totalTopicMods ? Math.round((completedTopicMods / totalTopicMods) * 100) : 0

    const studentOfficeReports = (office.reports || []).filter((r) => r.studentCode === entry.studentCode)
    const officeLeakCount = studentOfficeReports.reduce(
      (sum, r) => sum + (Array.isArray(r.leakWarnings) ? r.leakWarnings.length : 0),
      0
    )

    const openIssues = (lecturer.issues || []).filter(
      (i) => i.studentCode === entry.studentCode && i.status !== 'resolved'
    )

    let priority = 'not_started'
    if (integrityHold) priority = 'integrity_hold'
    else if (
      readinessBand === 'critical' ||
      (gatePercent !== null && gatePercent <= 40) ||
      openIssues.some((i) => i.priority === 'blocker' || i.priority === 'high')
    ) {
      priority = 'urgent'
    } else if (
      (gatePercent !== null && gatePercent < 65) ||
      topLeaks.length > 0 ||
      officeLeakCount > 0 ||
      openIssues.length > 0
    ) {
      priority = 'watch'
    } else if (submitted) {
      priority = 'routine'
    }

    const decision = lecturer.gateDecisions?.[entry.studentCode] || {
      decision: submitted && !integrityHold && topLeaks.length === 0 ? 'cleared_next_gate' : 'not_released',
      note: '',
    }

    const customPathway = lecturer.customPathways?.[entry.studentCode] || null

    return {
      studentCode: entry.studentCode,
      name: entry.name,
      isRostered: entry.isRostered,
      isActiveSession: gate.session?.studentCode === entry.studentCode,
      gate: {
        started: Boolean(rec?.startedAt),
        submitted,
        finalized: Boolean(rec?.finalSubmission),
        receiptId: rec?.finalSubmission?.referenceId || '',
        score: rec?.result?.score ?? null,
        total: rec?.result?.total ?? 100,
        percent: gatePercent,
        readinessBand,
        readinessLabel: rec?.result?.readinessLabel || (rec?.startedAt ? 'In progress' : 'Not started'),
        overconfidentCount,
        topLeaks,
        rubricScores: rec?.result?.rubricScores || null,
        durationSec,
        suspiciouslyFast,
        lowAnswerCoverage,
        integrityHold,
        reassessmentPassed: Boolean(rec?.reassessment?.result?.passed),
      },
      topics,
      topicOverallPercent,
      officeReports: studentOfficeReports,
      officeLeakCount,
      openIssuesCount: openIssues.length,
      priority,
      gateDecision: decision,
      customPathway,
    }
  })

  const priorityAlerts = []
  for (const l of learners) {
    if (l.gate.integrityHold) {
      priorityAlerts.push({
        id: `pa-int-${l.studentCode}`,
        priority: 'integrity_hold',
        studentCode: l.studentCode,
        title: `${l.name} (${l.studentCode}) — Integrity Hold Required`,
        detail: `${l.gate.suspiciouslyFast ? `Completed in ${l.gate.durationSec}s. ` : ''}${
          l.gate.lowAnswerCoverage ? 'Low question coverage. ' : ''
        }Review attempt before releasing next gate.`,
      })
    } else if (l.priority === 'urgent') {
      priorityAlerts.push({
        id: `pa-urg-${l.studentCode}`,
        priority: 'urgent',
        studentCode: l.studentCode,
        title: `${l.name} (${l.studentCode}) — Urgent Intervention`,
        detail: `Gate score ${l.gate.percent ?? 'n/a'}%. Top leaks: ${l.gate.topLeaks.join(', ') || 'pending'}.`,
      })
    }
    if (l.officeLeakCount > 0) {
      priorityAlerts.push({
        id: `pa-off-${l.studentCode}`,
        priority: 'watch',
        studentCode: l.studentCode,
        title: `${l.name} (${l.studentCode}) — MS Office Structural Leak(s)`,
        detail: `${l.officeLeakCount} leak warning(s) flagged inside uploaded Word/Excel files.`,
      })
    }
  }

  for (const iss of lecturer.issues || []) {
    if (iss.status !== 'resolved') {
      priorityAlerts.push({
        id: `pa-iss-${iss.id}`,
        priority: iss.priority === 'blocker' || iss.priority === 'high' ? 'urgent' : 'watch',
        studentCode: iss.studentCode,
        title: `Help Ticket [${iss.issueType}] · ${iss.subject}`,
        detail: `${iss.studentName} (${iss.studentCode}) · Status: ${iss.status}`,
      })
    }
  }

  const leakFrequency = {}
  for (const l of learners) {
    for (const leak of l.gate.topLeaks) {
      leakFrequency[leak] = (leakFrequency[leak] || 0) + 1
    }
  }

  const submittedLearners = learners.filter((l) => l.gate.submitted)
  const averageGatePercent = submittedLearners.length
    ? Math.round(submittedLearners.reduce((s, l) => s + (l.gate.percent || 0), 0) / submittedLearners.length)
    : null

  return {
    generatedAt: new Date().toISOString(),
    totals: {
      learners: learners.length,
      gateStarted: learners.filter((l) => l.gate.started).length,
      gateSubmitted: submittedLearners.length,
      gateFinalized: learners.filter((l) => l.gate.finalized).length,
      averageGatePercent,
      integrityHolds: learners.filter((l) => l.gate.integrityHold).length,
      urgentLearners: learners.filter((l) => l.priority === 'urgent').length,
      openIssues: (lecturer.issues || []).filter((i) => i.status !== 'resolved').length,
      officeFilesConsumed: (office.reports || []).length,
    },
    n5CourseworkEstimate: n5MarksPlan,
    leakFrequency: Object.entries(leakFrequency).sort((a, b) => b[1] - a[1]),
    priorityAlerts,
    learners,
  }
}

export function loadAllLocalStoresSnapshot() {
  return {
    gateStore: readGateStore(),
    topicStores: {
      topic1: readTopicStore('sankofa-n5-topic1-v1'),
      topic2: readTopicStore('sankofa-n5-topic2-v1'),
      topic3: readTopicStore('sankofa-n5-topic3-v1'),
      topic4: readTopicStore('sankofa-n5-topic4-v1'),
      topic5: readTopicStore('sankofa-n5-topic5-v1'),
    },
    officeStore: readOfficeIngestStore(),
    lecturerStore: readLecturerStore(),
  }
}

export function formatCohortReportText(diagnostics) {
  if (!diagnostics) return ''
  const t = diagnostics.totals
  const lines = [
    'SANKOFA COMPUTELAB · LECTURER COHORT DIAGNOSTIC REPORT',
    '====================================================================',
    `Generated: ${diagnostics.generatedAt}`,
    `Learners: ${t.learners} | Gate Submitted: ${t.gateSubmitted} | Finalized: ${t.gateFinalized}`,
    `Average Gate 01 Score: ${t.averageGatePercent !== null ? `${t.averageGatePercent}%` : 'N/A'}`,
    `Urgent Learners: ${t.urgentLearners} | Integrity Holds: ${t.integrityHolds} | Open Issues: ${t.openIssues}`,
    `MS Office Files Consumed: ${t.officeFilesConsumed}`,
    ...(diagnostics.n5CourseworkEstimate?.valid && diagnostics.n5CourseworkEstimate.secured > 0
      ? [
          `Local N5 Coursework Secured: ${diagnostics.n5CourseworkEstimate.secured.toFixed(1)}%${
            diagnostics.n5CourseworkEstimate.needed !== null
              ? ` (Exam mark needed for 40% pass: ${diagnostics.n5CourseworkEstimate.needed.toFixed(1)}%)`
              : ''
          }`,
        ]
      : []),
    '',
    'COHORT LEAK FREQUENCY:',
    ...(diagnostics.leakFrequency.length
      ? diagnostics.leakFrequency.map(([leak, count]) => `- ${leak}: ${count} learner(s)`)
      : ['- No Gate 01 leaks recorded yet']),
    '',
    'LEARNER DIAGNOSTIC BREAKDOWN:',
  ]

  for (const l of diagnostics.learners) {
    lines.push(
      `• ${l.studentCode} (${l.name}) | Priority: ${l.priority.toUpperCase()} | Gate: ${
        l.gate.submitted ? `${l.gate.percent}% (${l.gate.readinessLabel})` : l.gate.readinessLabel
      } | Topics T1–T5: ${l.topicOverallPercent}% | Office Leaks: ${l.officeLeakCount} | Decision: ${l.gateDecision.decision}`
    )
    if (l.gate.topLeaks.length) {
      lines.push(`  Top Leaks: ${l.gate.topLeaks.join(', ')}`)
    }
    if (l.customPathway) {
      lines.push(`  Custom Pathway: ${l.customPathway.note} (${l.customPathway.steps.length} steps)`)
    }
  }
  return lines.join('\n')
}

export function formatCohortReportCsv(diagnostics) {
  if (!diagnostics) return ''
  const esc = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`
  const header = [
    'StudentCode',
    'Name',
    'Priority',
    'GateStatus',
    'GatePercent',
    'OverconfidentErrors',
    'TopLeaks',
    'TopicsOverallPercent',
    'OfficeFiles',
    'OfficeLeaks',
    'OpenIssues',
    'GateDecision',
    'ReceiptId',
  ].join(',')

  const rows = diagnostics.learners.map((l) =>
    [
      l.studentCode,
      l.name,
      l.priority,
      l.gate.readinessLabel,
      l.gate.percent ?? '',
      l.gate.overconfidentCount,
      l.gate.topLeaks.join('; '),
      l.topicOverallPercent,
      l.officeReports.length,
      l.officeLeakCount,
      l.openIssuesCount,
      l.gateDecision.decision,
      l.gate.receiptId,
    ]
      .map(esc)
      .join(',')
  )
  return [header, ...rows].join('\n')
}

export { GATE_RUBRIC, LEAK_GUIDANCE, N5_ROSTER }

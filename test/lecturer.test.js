import test from 'node:test'
import assert from 'node:assert/strict'

import { COMPLIANCE_MATRIX, LECTURER_SCRIPTS } from '../src/lecturer-data.js'
import {
  DEFAULT_LECTURER_PIN,
  LECTURER_STORAGE_KEY,
  assignCustomPathway,
  buildCohortDiagnostics,
  clearCustomPathway,
  createInitialLecturerStore,
  createIssueTicket,
  dismissAlertForStudent,
  formatCohortReportCsv,
  formatCohortReportText,
  lockLecturerConsole,
  readLecturerStore,
  recordGateDecision,
  removeLecturerAlert,
  replyToIssueTicket,
  sendLecturerAlert,
  setLecturerPinOverride,
  togglePathwayStep,
  updateIssueStatus,
  verifyLecturerPin,
  writeLecturerStore,
} from '../src/lecturer-engine.js'

test('COMPLIANCE_MATRIX covers all 5 N5 topics, Gate 01, Gates 02-06, N6, MS Office, Lecturer Ops, and Security', () => {
  const ids = COMPLIANCE_MATRIX.map((r) => r.id)
  for (const expected of [
    'cpn5-topic-1',
    'cpn5-topic-2',
    'cpn5-topic-3',
    'cpn5-topic-4',
    'cpn5-topic-5',
    'cpn5-gate-01',
    'cpn5-gates-02-06',
    'cpn5-pathway-40',
    'cpn6-curriculum',
    'ms-office-ingest',
    'lecturer-ops',
    'sec-sync',
  ]) {
    assert.ok(ids.includes(expected), `Missing matrix row: ${expected}`)
  }
  assert.ok(LECTURER_SCRIPTS.length >= 8)
  for (const s of LECTURER_SCRIPTS) {
    assert.ok(s.passes.length >= 3)
    assert.ok(s.answerFrame.trim().length > 0)
    assert.ok(s.releaseRule.trim().length > 0)
  }
})

test('Lecturer PIN verification, storage persistence, and lock work safely', () => {
  const initial = createInitialLecturerStore()
  const bad = verifyLecturerPin(initial, 'WRONG-PIN', 'Ms Khumalo')
  assert.equal(bad.ok, false)

  const ok = verifyLecturerPin(initial, DEFAULT_LECTURER_PIN.toLowerCase(), 'Ms Khumalo')
  assert.equal(ok.ok, true)
  assert.equal(ok.store.unlocked, true)
  assert.equal(ok.store.lecturerName, 'Ms Khumalo')
  assert.equal(ok.store.auditLog.length, 1)

  const locked = lockLecturerConsole(ok.store)
  assert.equal(locked.unlocked, false)

  const map = new Map()
  const storage = { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k, v) }
  assert.equal(writeLecturerStore(ok.store, storage), true)
  assert.equal(readLecturerStore(storage).lecturerName, 'Ms Khumalo')
  assert.equal(LECTURER_STORAGE_KEY, 'sankofa-lecturer-ops-v1')
  assert.deepEqual(readLecturerStore({ getItem: () => '{broken' }), createInitialLecturerStore())
})

test('Issue triage, custom pathways, gate release holds, and alerts operate end-to-end', () => {
  let store = verifyLecturerPin(createInitialLecturerStore(), DEFAULT_LECTURER_PIN, 'Mr Mthembu').store

  const emptyIssue = createIssueTicket(store, { subject: '', details: '' })
  assert.equal(emptyIssue.ok, false)

  const created = createIssueTicket(store, {
    studentCode: 'N5-101',
    studentName: 'Lerato Mokoena',
    course: 'cpn5',
    issueType: 'office_upload',
    priority: 'high',
    subject: 'Excel formula flagged',
    details: 'Uploaded workbook says missing $ anchor.',
  })
  assert.equal(created.ok, true)
  store = created.store
  const issueId = created.ticket.id

  const replied = replyToIssueTicket(store, {
    issueId,
    authorRole: 'lecturer',
    body: 'Lock $F$1 before copying down C4:C20, then re-upload.',
  })
  assert.equal(replied.ok, true)
  store = replied.store
  assert.equal(store.issues[0].status, 'in_review')
  assert.equal(store.issues[0].replies.length, 1)

  store = updateIssueStatus(store, issueId, 'resolved', 'Learner re-uploaded fixed xlsx')
  assert.equal(store.issues[0].status, 'resolved')

  const pathwayRes = assignCustomPathway(store, {
    studentCode: 'N5-101',
    leaks: ['EXCEL_REFERENCING', 'WORD_LAYOUT'],
    note: 'Complete Topic 1 Section 6C before Gate 02.',
  })
  assert.equal(pathwayRes.ok, true)
  store = pathwayRes.store
  assert.equal(store.customPathways['N5-101'].steps.length, 2)

  store = togglePathwayStep(store, 'N5-101', store.customPathways['N5-101'].steps[0].id)
  assert.equal(store.customPathways['N5-101'].steps[0].completed, true)

  const missingNoteHold = recordGateDecision(store, {
    studentCode: 'N5-101',
    decision: 'remediation_hold',
    note: '',
  })
  assert.equal(missingNoteHold.ok, false)

  const holdOk = recordGateDecision(store, {
    studentCode: 'N5-101',
    decision: 'remediation_hold',
    note: 'Fix absolute referencing leak first.',
  })
  assert.equal(holdOk.ok, true)
  store = holdOk.store
  assert.equal(store.gateDecisions['N5-101'].decision, 'remediation_hold')

  const alertRes = sendLecturerAlert(store, {
    targetStudentCode: 'N5-101',
    severity: 'urgent',
    title: 'Recovery required before Friday lab',
    message: 'Complete your custom pathway steps.',
  })
  assert.equal(alertRes.ok, true)
  store = alertRes.store
  store = dismissAlertForStudent(store, alertRes.alert.id, 'N5-101')
  assert.ok(store.alerts[0].dismissedBy.includes('N5-101'))
})

test('buildCohortDiagnostics aggregates Gate anomalies, Topic progress, Office leaks, and exports CSV/TXT', () => {
  const lecturerStore = createInitialLecturerStore()
  const gateStore = {
    session: { studentCode: 'N5-101' },
    customRoster: [],
    recordsByStudent: {
      'N5-101': {
        startedAt: 1000,
        submittedAt: 31000, // 30s -> suspiciouslyFast
        answers: { q1: 0, q2: 1 }, // low coverage
        result: {
          score: 35,
          total: 100,
          percent: 35,
          readinessBand: 'critical',
          readinessLabel: 'Critical',
          overconfidentCount: 2,
          recommendedLeaks: ['EXCEL_REFERENCING', 'FILE_MGMT'],
        },
      },
      'N5-102': {
        startedAt: 1000,
        submittedAt: 901000, // 900s
        answers: Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`q${i}`, 0])),
        result: {
          score: 100,
          total: 100,
          percent: 100,
          readinessBand: 'exam_ready',
          readinessLabel: 'Exam-ready',
          overconfidentCount: 0,
          recommendedLeaks: [],
        },
        finalSubmission: { referenceId: 'N5G1-102-TEST' },
      },
    },
  }

  const officeStore = {
    reports: [
      {
        id: 'off-1',
        studentCode: 'N5-101',
        fileName: 'Bad.xlsx',
        leakWarnings: [{ leak: 'EXCEL_FUNCTIONS', severity: 'high', detail: 'No formulas.' }],
      },
    ],
  }

  const diag = buildCohortDiagnostics({ gateStore, studyState: {}, topicStores: {}, officeStore, lecturerStore })
  assert.equal(diag.totals.learners, 5)
  assert.equal(diag.totals.gateSubmitted, 2)
  assert.equal(diag.totals.integrityHolds, 1)
  assert.equal(diag.totals.officeFilesConsumed, 1)

  const n101 = diag.learners.find((l) => l.studentCode === 'N5-101')
  assert.equal(n101.priority, 'integrity_hold')
  assert.equal(n101.officeLeakCount, 1)

  const n102 = diag.learners.find((l) => l.studentCode === 'N5-102')
  assert.equal(n102.priority, 'routine')
  assert.equal(n102.gateDecision.decision, 'cleared_next_gate')

  const txt = formatCohortReportText(diag)
  assert.match(txt, /SANKOFA COMPUTELAB · LECTURER COHORT DIAGNOSTIC REPORT/)
  assert.match(txt, /N5-101/)
  const csv = formatCohortReportCsv(diag)
  assert.match(csv, /"N5-101","Lerato Mokoena","integrity_hold"/)
})

test('buildCohortDiagnostics tracks local-learner activity and supports PIN override, pathway clear, and alert removal', () => {
  let store = verifyLecturerPin(createInitialLecturerStore(), DEFAULT_LECTURER_PIN, 'Ms Khumalo').store

  const pinTooShort = setLecturerPinOverride(store, '12')
  assert.equal(pinTooShort.ok, false)

  const pinSet = setLecturerPinOverride(store, 'CAMPUS-99')
  assert.equal(pinSet.ok, true)
  store = lockLecturerConsole(pinSet.store)
  assert.equal(verifyLecturerPin(store, DEFAULT_LECTURER_PIN, 'Ms Khumalo').ok, false)
  const unlockedCustom = verifyLecturerPin(store, 'campus-99', 'Ms Khumalo')
  assert.equal(unlockedCustom.ok, true)
  store = unlockedCustom.store

  store = createIssueTicket(store, {
    studentCode: 'local-learner',
    studentName: 'Local Learner',
    issueType: 'office_upload',
    priority: 'high',
    subject: 'Word tab stop issue',
    details: 'Need help aligning dates.',
  }).store
  store = assignCustomPathway(store, { studentCode: 'local-learner', leaks: ['WORD_LAYOUT'] }).store
  store = sendLecturerAlert(store, {
    targetStudentCode: 'local-learner',
    severity: 'warning',
    title: 'Use Tab stops',
    message: 'Avoid spaces.',
  }).store

  const diag = buildCohortDiagnostics({
    gateStore: { recordsByStudent: {}, customRoster: [] },
    studyState: { learning: { cpn5: { marks: [70, 35, ''] } } },
    topicStores: {
      topic3: {
        byOwner: {
          'local-learner': {
            modules: {
              'topic3-section1': {
                quickCheckResult: { passed: true },
                checklist: { 't3-s1-chk1': true, 't3-s1-chk2': true, 't3-s1-chk3': true },
                evidenceNotes: 'Verified raw vs processed data.',
              },
            },
          },
        },
      },
    },
    officeStore: {
      reports: [
        {
          id: 'off-loc',
          studentCode: 'local-learner',
          fileName: 'Notice.docx',
          leakWarnings: [{ leak: 'WORD_LAYOUT', severity: 'high', detail: 'Space padding' }],
        },
      ],
    },
    lecturerStore: store,
  })

  const localLearner = diag.learners.find((l) => l.studentCode === 'local-learner')
  assert.ok(localLearner, 'local-learner must appear in diagnostics when active')
  assert.equal(localLearner.priority, 'urgent')
  assert.equal(localLearner.officeLeakCount, 1)
  assert.equal(localLearner.topics.topic3.completedModules, 1)
  assert.ok(diag.priorityAlerts.some((a) => a.id === 'pa-off-local-learner'))

  const reportTxt = formatCohortReportText(diag)
  assert.match(reportTxt, /Local N5 Coursework Secured:/)

  store = clearCustomPathway(store, 'local-learner')
  assert.equal(store.customPathways['local-learner'], undefined)
  store = removeLecturerAlert(store, store.alerts[0].id)
  assert.equal(store.alerts.length, 0)
})

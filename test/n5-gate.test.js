import test from 'node:test'
import assert from 'node:assert/strict'

import {
  GATE_DURATION_MINUTES,
  GATE_ID,
  GATE_QUESTIONS,
  GATE_RUBRIC,
  GATE_SUBTITLE,
  GATE_TITLE,
  LEAK_GUIDANCE,
  N5_ROSTER,
  PRACTICAL_PROOF_CHECKS,
  REASSESSMENT_BANK,
} from '../src/n5-gate-data.js'

import {
  GATE_STORAGE_KEY,
  acknowledgeDiagnostics,
  buildStudentCode,
  claimOrSignInStudent,
  completePassphraseSetup,
  createInitialGateStore,
  finalizeGateSubmission,
  formatSubmissionReceiptText,
  getActiveStudentRecord,
  getAllRoster,
  getGateStage,
  getOrCreateDeviceId,
  getRecoveryDrillsForLeaks,
  initialStudentRecord,
  isGateExpired,
  isRecoveryComplete,
  normalizeAllocatedNumber,
  readGateStore,
  recordGateAnswer,
  recordGateConfidence,
  scoreGateAttempt,
  selectReassessmentQuestions,
  signOutStudent,
  startLockedGate,
  submitLockedGate,
  submitReassessment,
  updateActiveStudentRecord,
  validatePassphrase,
  writeGateStore,
} from '../src/n5-gate-engine.js'

function createMemoryStorage() {
  const map = new Map()
  return {
    getItem(key) {
      return map.has(key) ? map.get(key) : null
    },
    setItem(key, value) {
      map.set(key, String(value))
    },
  }
}

test('Gate 01 metadata, roster, rubric, and questions meet exact N5 contract', () => {
  assert.equal(GATE_ID, 'n5-gate-01')
  assert.equal(GATE_TITLE, 'Gate 01 · Ribbon & Command Control')
  assert.equal(GATE_SUBTITLE, 'Computer Practice N5 · Priority Student Gate')
  assert.equal(GATE_DURATION_MINUTES, 50)
  assert.equal(N5_ROSTER.length, 5)
  assert.deepEqual(Object.keys(GATE_RUBRIC), [
    'ACCURACY',
    'MANIPULATION',
    'INSTRUCTION_CONTROL',
    'TIME_CONTROL',
    'VERIFICATION_DISCIPLINE',
  ])
  assert.deepEqual(Object.keys(PRACTICAL_PROOF_CHECKS), ['verb', 'original', 'reopen'])

  assert.equal(GATE_QUESTIONS.length, 12)
  const totalMarks = GATE_QUESTIONS.reduce((sum, q) => sum + q.marks, 0)
  assert.equal(totalMarks, 100)

  for (const question of GATE_QUESTIONS) {
    assert.equal(question.options.length, 4)
    assert.ok(Number.isInteger(question.correctIndex) && question.correctIndex >= 0 && question.correctIndex < 4)
    assert.ok(LEAK_GUIDANCE[question.leak], `Missing LEAK_GUIDANCE for ${question.leak}`)
    assert.ok(GATE_RUBRIC[question.rubricCategory], `Missing GATE_RUBRIC for ${question.rubricCategory}`)
    assert.ok(question.marks > 0)
  }

  assert.equal(REASSESSMENT_BANK.length, 8)
  for (const item of REASSESSMENT_BANK) {
    assert.equal(item.options.length, 4)
    assert.ok(Number.isInteger(item.correctIndex) && item.correctIndex >= 0 && item.correctIndex < 4)
    assert.ok(LEAK_GUIDANCE[item.leak], `Missing LEAK_GUIDANCE for ${item.leak}`)
  }
})

test('storage helpers handle corrupt storage and normalize allocated numbers', () => {
  assert.equal(normalizeAllocatedNumber('n5-101'), '101')
  assert.equal(normalizeAllocatedNumber(' 104 '), '104')
  assert.equal(buildStudentCode('n5-102'), 'N5-102')

  const corruptStorage = {
    getItem: () => '{broken-json',
    setItem: () => {},
  }
  const recovered = readGateStore(corruptStorage)
  assert.deepEqual(recovered, createInitialGateStore())

  const memStorage = createMemoryStorage()
  const initial = createInitialGateStore()
  const { store: withDevice, deviceId } = getOrCreateDeviceId(initial)
  assert.ok(deviceId)
  assert.equal(getOrCreateDeviceId(withDevice).deviceId, deviceId)
  assert.equal(writeGateStore(withDevice, memStorage), true)
  assert.ok(memStorage.getItem(GATE_STORAGE_KEY))
  assert.equal(readGateStore(memStorage).deviceId, deviceId)
})

test('auth claim, passphrase validation, sign-out, and re-sign-in preserve student progress', async () => {
  let store = createInitialGateStore()

  // Wrong surname rejected
  const badSurname = await claimOrSignInStudent(store, {
    allocatedNumber: 'N5-101',
    surname: 'Ndlovu',
    secret: 'N5-101',
  })
  assert.equal(badSurname.ok, false)

  // Wrong initial code rejected
  const badInitial = await claimOrSignInStudent(store, {
    allocatedNumber: '101',
    surname: 'Mokoena',
    secret: 'WRONG',
  })
  assert.equal(badInitial.ok, false)

  // Claiming N5-101 with surname Mokoena and initial code n5-101 triggers passphrase setup
  const claimed = await claimOrSignInStudent(store, {
    allocatedNumber: 'N5-101',
    surname: 'mokoena',
    secret: 'n5-101',
  })
  assert.equal(claimed.ok, true)
  assert.equal(claimed.needsPassphraseSetup, true)
  assert.equal(claimed.student.studentCode, 'N5-101')
  store = claimed.store

  // Weak passphrase checks
  assert.equal(validatePassphrase('short1').valid, false)
  assert.equal(validatePassphrase('onlyletters').valid, false)
  assert.equal(validatePassphrase('12345678').valid, false)

  const weakSetup = await completePassphraseSetup(store, {
    newPassphrase: 'weak',
    confirmPassphrase: 'weak',
  })
  assert.equal(weakSetup.ok, false)

  const mismatchSetup = await completePassphraseSetup(store, {
    newPassphrase: 'Sankofa2026',
    confirmPassphrase: 'Sankofa2025',
  })
  assert.equal(mismatchSetup.ok, false)

  // Strong passphrase succeeds and signs student in
  const goodSetup = await completePassphraseSetup(store, {
    newPassphrase: 'Sankofa2026',
    confirmPassphrase: 'Sankofa2026',
  })
  assert.equal(goodSetup.ok, true)
  assert.equal(goodSetup.session.studentCode, 'N5-101')
  store = goodSetup.store

  // Record progress for N5-101
  const t0 = 1_700_000_000_000
  store = updateActiveStudentRecord(store, (rec) => {
    const started = startLockedGate(rec, t0)
    return recordGateAnswer(started, GATE_QUESTIONS[0].id, GATE_QUESTIONS[0].correctIndex, t0 + 1000)
  })
  assert.equal(getActiveStudentRecord(store).answers[GATE_QUESTIONS[0].id], GATE_QUESTIONS[0].correctIndex)

  // Sign out preserves credentials and records
  store = signOutStudent(store)
  assert.equal(store.session, null)
  assert.equal(getActiveStudentRecord(store), null)
  assert.equal(getGateStage(store.session, null), 'auth')

  // Wrong passphrase fails on sign-in
  const wrongSignIn = await claimOrSignInStudent(store, {
    allocatedNumber: '101',
    surname: 'Mokoena',
    secret: 'WrongPass99',
  })
  assert.equal(wrongSignIn.ok, false)

  // Correct passphrase succeeds and preserves progress
  const rightSignIn = await claimOrSignInStudent(store, {
    allocatedNumber: '101',
    surname: 'Mokoena',
    secret: 'Sankofa2026',
  })
  assert.equal(rightSignIn.ok, true)
  assert.equal(rightSignIn.needsPassphraseSetup, false)
  store = rightSignIn.store
  const restored = getActiveStudentRecord(store)
  assert.equal(restored.answers[GATE_QUESTIONS[0].id], GATE_QUESTIONS[0].correctIndex)

  // Custom learner registration works seamlessly
  const customClaim = await claimOrSignInStudent(store, {
    allocatedNumber: '199',
    surname: 'Nkosi',
    firstName: 'Zanele',
    lastName: 'Nkosi',
  })
  assert.equal(customClaim.ok, true)
  assert.equal(customClaim.needsPassphraseSetup, true)
  assert.equal(getAllRoster(customClaim.store).length, 6)
})

test('locked timer does not reset on re-entry and blocks answers after expiry', () => {
  const t0 = 1_700_000_000_000
  let record = initialStudentRecord()
  record = startLockedGate(record, t0)
  const expectedEnd = t0 + GATE_DURATION_MINUTES * 60_000
  assert.equal(record.endTime, expectedEnd)

  // Calling startLockedGate again later must NOT reset endTime
  const reentered = startLockedGate(record, t0 + 600_000)
  assert.equal(reentered.startedAt, t0)
  assert.equal(reentered.endTime, expectedEnd)

  // Before expiry, answers and confidence are accepted
  assert.equal(isGateExpired(reentered, expectedEnd - 1), false)
  const answered = recordGateAnswer(reentered, GATE_QUESTIONS[0].id, 1, expectedEnd - 1000)
  const withConfidence = recordGateConfidence(answered, GATE_QUESTIONS[0].id, 'certain', expectedEnd - 500)
  assert.equal(withConfidence.answers[GATE_QUESTIONS[0].id], 1)
  assert.equal(withConfidence.confidence[GATE_QUESTIONS[0].id], 'certain')

  // At or after expiry, answers and confidence are blocked
  assert.equal(isGateExpired(withConfidence, expectedEnd), true)
  const blockedAnswer = recordGateAnswer(withConfidence, GATE_QUESTIONS[1].id, 0, expectedEnd)
  const blockedConfidence = recordGateConfidence(blockedAnswer, GATE_QUESTIONS[1].id, 'likely', expectedEnd + 5000)
  assert.equal(blockedConfidence.answers[GATE_QUESTIONS[1].id], undefined)
  assert.equal(blockedConfidence.confidence[GATE_QUESTIONS[1].id], undefined)
})

test('scoring calculates raw score, critical leak deductions (once per leak), overconfidence, and readiness band', () => {
  // 1. Perfect score
  const allCorrect = Object.fromEntries(GATE_QUESTIONS.map((q) => [q.id, q.correctIndex]))
  const perfect = scoreGateAttempt(allCorrect, {})
  assert.equal(perfect.rawScore, 100)
  assert.equal(perfect.deductionTotal, 0)
  assert.equal(perfect.score, 100)
  assert.equal(perfect.percent, 100)
  assert.equal(perfect.readinessBand, 'exam_ready')
  assert.equal(perfect.readinessLabel, 'Exam-ready')
  assert.deepEqual(perfect.recommendedLeaks, [])

  // 2. Miss both FILE_MGMT questions (q05 = 9 marks, q06 = 8 marks) with 1 marked 'certain'
  // Expect rawScore = 83, single -5 deduction for FILE_MGMT -> net 78 -> 'developing'
  const fileMissAnswers = { ...allCorrect }
  const q05 = GATE_QUESTIONS.find((q) => q.id === 'n5g1-q05')
  const q06 = GATE_QUESTIONS.find((q) => q.id === 'n5g1-q06')
  fileMissAnswers[q05.id] = (q05.correctIndex + 1) % 4
  fileMissAnswers[q06.id] = (q06.correctIndex + 1) % 4

  const fileLeakResult = scoreGateAttempt(fileMissAnswers, { [q05.id]: 'certain', [q06.id]: 'unsure' })
  assert.equal(fileLeakResult.rawScore, 83)
  assert.equal(fileLeakResult.deductionTotal, 5)
  assert.equal(fileLeakResult.score, 78)
  assert.equal(fileLeakResult.percent, 78)
  assert.equal(fileLeakResult.overconfidentCount, 1)
  assert.equal(fileLeakResult.readinessBand, 'developing')
  assert.deepEqual(fileLeakResult.recommendedLeaks, ['FILE_MGMT'])
  assert.equal(fileLeakResult.rubricScores.INSTRUCTION_CONTROL.missedCount, 1)
  assert.equal(fileLeakResult.rubricScores.VERIFICATION_DISCIPLINE.missedCount, 1)

  // 3. All wrong -> clamped to 0, 'critical'
  const allWrong = Object.fromEntries(GATE_QUESTIONS.map((q) => [q.id, (q.correctIndex + 1) % 4]))
  const zeroResult = scoreGateAttempt(allWrong, {})
  assert.equal(zeroResult.rawScore, 0)
  assert.equal(zeroResult.score, 0)
  assert.equal(zeroResult.readinessBand, 'critical')
})

test('full Gate workflow: diagnostics, recovery enforcement, reassessment, and tamper-evident receipt', async () => {
  const session = {
    studentCode: 'N5-102',
    allocatedNumber: '102',
    firstName: 'Thabo',
    lastName: 'Ndlovu',
    deviceId: 'device-test-01',
    signedInAt: 1_700_000_000_000,
  }

  let record = initialStudentRecord()
  assert.equal(getGateStage(session, record), 'briefing')

  const t0 = 1_700_000_001_000
  record = startLockedGate(record, t0)
  assert.equal(getGateStage(session, record), 'locked_exam')

  // Answer all correctly except EXCEL_REFERENCING (q07) and PRINT_OUTPUT (q04)
  for (const q of GATE_QUESTIONS) {
    const pick = q.leak === 'EXCEL_REFERENCING' || q.leak === 'PRINT_OUTPUT' ? (q.correctIndex + 1) % 4 : q.correctIndex
    record = recordGateAnswer(record, q.id, pick, t0 + 5000)
  }

  record = submitLockedGate(record, t0 + 120_000)
  assert.equal(getGateStage(session, record), 'diagnostics')
  assert.equal(record.reassessment.questionIds.length, 3)

  record = acknowledgeDiagnostics(record, t0 + 130_000)
  assert.equal(getGateStage(session, record), 'recovery')

  const drills = getRecoveryDrillsForLeaks(record.result.recommendedLeaks)
  assert.equal(drills.length, 2)
  assert.equal(isRecoveryComplete(record, drills), false)

  // 100%-score learners still get 1 consolidation drill
  assert.equal(getRecoveryDrillsForLeaks([]).length, 1)

  // Complete drills partially -> still incomplete
  for (const drill of drills) {
    record.recovery.drills[drill.id] = {
      answer: 'My verified explanation of the N5 command.',
      revealed: true,
      points: drill.answerPoints.map((_, idx) => idx),
      correction: 'I will check the exact ribbon tab and reopen the saved output.',
    }
  }
  assert.equal(isRecoveryComplete(record, drills), false)

  // Check only 2 of 3 practical proof checks -> still incomplete
  record.recovery.checks = { verb: true, original: true, reopen: false }
  record.recovery.proofSummary = 'Reopened Campus-Plan from destination folder.'
  assert.equal(isRecoveryComplete(record, drills), false)

  // Check all 3 practical proof checks but too-short summary -> still incomplete
  record.recovery.checks.reopen = true
  record.recovery.proofSummary = 'Done'
  assert.equal(isRecoveryComplete(record, drills), false)

  // Complete proof summary (>= 10 chars) -> transitions to reassessment
  record.recovery.proofSummary = 'Identified Save As verb, kept original untouched, reopened Campus-Plan from target folder.'
  record.recovery.evidenceFiles = [{ file: 'Campus-Plan.docx' }]
  assert.equal(isRecoveryComplete(record, drills), true)
  assert.equal(getGateStage(session, record), 'reassessment')

  // Cannot finalize before reassessment is submitted
  await assert.rejects(() => finalizeGateSubmission(session, record, t0 + 200_000))

  // Select and submit reassessment answers
  const reselected = selectReassessmentQuestions(record.result.recommendedLeaks)
  assert.equal(reselected.length, 3)
  const reAnswers = Object.fromEntries(reselected.map((q) => [q.id, q.correctIndex]))
  record = submitReassessment(record, reAnswers, t0 + 180_000)
  assert.equal(record.reassessment.result.correct, 3)
  assert.equal(record.reassessment.result.total, 3)
  assert.equal(record.reassessment.result.passed, true)

  // Finalize submission
  record = await finalizeGateSubmission(session, record, t0 + 200_000)
  assert.equal(getGateStage(session, record), 'submitted')
  assert.ok(record.finalSubmission.referenceId.startsWith('N5G1-102-'))
  assert.match(record.finalSubmission.digest, /^[0-9a-f]{64}$/)
  assert.deepEqual(record.finalSubmission.evidenceFiles, ['Campus-Plan.docx'])

  const receipt = formatSubmissionReceiptText(record.finalSubmission)
  assert.match(receipt, /Thabo Ndlovu \(N5-102\)/)
  assert.match(receipt, /Reassessment Score: 3\/3/)
  assert.match(receipt, /Campus-Plan\.docx/)
  assert.ok(!receipt.includes('Sankofa2026'))
})

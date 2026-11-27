import repairs from './remediation-data.json' with { type: 'json' }
import {
  GATE_DURATION_MINUTES,
  GATE_QUESTIONS,
  GATE_RUBRIC,
  LEAK_GUIDANCE,
  N5_ROSTER,
  PRACTICAL_PROOF_CHECKS,
  REASSESSMENT_BANK,
} from './n5-gate-data.js'

export const GATE_STORAGE_KEY = 'sankofa-n5-gate-v1'

const CRITICAL_LEAKS = new Set([
  'FILE_MGMT',
  'EXCEL_REFERENCING',
  'EXCEL_FUNCTIONS',
  'PRINT_OUTPUT',
  'INSTRUCTION_CONTROL',
  'TIME_DISCIPLINE',
])

const VALID_CONFIDENCE = new Set(['unsure', 'likely', 'certain'])
const PBKDF2_ITERATIONS = 10_000
const encoder = new TextEncoder()

function bytesToHex(bytes) {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

function hexToBytes(hex) {
  const clean = String(hex || '').replace(/[^0-9a-f]/gi, '')
  const out = new Uint8Array(Math.floor(clean.length / 2))
  for (let i = 0; i < out.length; i += 1) {
    out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  }
  return out
}

// Compact pure-JS SHA-256 fallback for environments without crypto.subtle (e.g. file:// origins)
const SHA256_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
])

function rotr(value, shift) {
  return (value >>> shift) | (value << (32 - shift))
}

function sha256FallbackBytes(inputBytes) {
  const bitLen = inputBytes.length * 8
  const paddedLen = Math.ceil((inputBytes.length + 9) / 64) * 64
  const padded = new Uint8Array(paddedLen)
  padded.set(inputBytes)
  padded[inputBytes.length] = 0x80
  const view = new DataView(padded.buffer)
  view.setUint32(paddedLen - 8, Math.floor(bitLen / 0x100000000), false)
  view.setUint32(paddedLen - 4, bitLen >>> 0, false)

  const h = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
  ])
  const w = new Uint32Array(64)

  for (let offset = 0; offset < paddedLen; offset += 64) {
    for (let i = 0; i < 16; i += 1) w[i] = view.getUint32(offset + i * 4, false)
    for (let i = 16; i < 64; i += 1) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3)
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10)
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0
    }
    let [a, b, c, d, e, f, g, hh] = h
    for (let i = 0; i < 64; i += 1) {
      const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25)
      const ch = (e & f) ^ (~e & g)
      const temp1 = (hh + S1 + ch + SHA256_K[i] + w[i]) >>> 0
      const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)
      const maj = (a & b) ^ (a & c) ^ (b & c)
      const temp2 = (S0 + maj) >>> 0
      hh = g
      g = f
      f = e
      e = (d + temp1) >>> 0
      d = c
      c = b
      b = a
      a = (temp1 + temp2) >>> 0
    }
    h[0] = (h[0] + a) >>> 0
    h[1] = (h[1] + b) >>> 0
    h[2] = (h[2] + c) >>> 0
    h[3] = (h[3] + d) >>> 0
    h[4] = (h[4] + e) >>> 0
    h[5] = (h[5] + f) >>> 0
    h[6] = (h[6] + g) >>> 0
    h[7] = (h[7] + hh) >>> 0
  }

  const out = new Uint8Array(32)
  const outView = new DataView(out.buffer)
  for (let i = 0; i < 8; i += 1) outView.setUint32(i * 4, h[i], false)
  return out
}

async function sha256Hex(text) {
  const bytes = encoder.encode(String(text ?? ''))
  if (globalThis.crypto?.subtle?.digest) {
    try {
      const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes)
      return bytesToHex(new Uint8Array(digest))
    } catch {
      // Fall through to pure-JS SHA-256
    }
  }
  return bytesToHex(sha256FallbackBytes(bytes))
}

function generateSaltBytes(length = 16) {
  const bytes = new Uint8Array(length)
  if (globalThis.crypto?.getRandomValues) {
    globalThis.crypto.getRandomValues(bytes)
    return bytes
  }
  for (let i = 0; i < length; i += 1) {
    bytes[i] = Math.floor(Math.random() * 256)
  }
  return bytes
}

function constantTimeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
    return false
  }
  let diff = 0
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}

/**
 * Create a clean empty store structure for N5 Gate 01 persistence.
 */
export function createInitialGateStore() {
  return {
    version: 1,
    deviceId: '',
    session: null,
    pendingAuth: null,
    credentialsByStudent: {},
    customRoster: [],
    recordsByStudent: {},
  }
}

/**
 * Read and normalize the Gate store from Web Storage without throwing on missing or corrupt data.
 */
export function readGateStore(storage = globalThis.localStorage) {
  const fallback = createInitialGateStore()
  if (!storage || typeof storage.getItem !== 'function') {
    return fallback
  }
  try {
    const raw = storage.getItem(GATE_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return fallback
    }
    return {
      version: 1,
      deviceId: typeof parsed.deviceId === 'string' ? parsed.deviceId : '',
      session: parsed.session && typeof parsed.session === 'object' ? parsed.session : null,
      pendingAuth: parsed.pendingAuth && typeof parsed.pendingAuth === 'object' ? parsed.pendingAuth : null,
      credentialsByStudent:
        parsed.credentialsByStudent && typeof parsed.credentialsByStudent === 'object'
          ? parsed.credentialsByStudent
          : {},
      customRoster: Array.isArray(parsed.customRoster) ? parsed.customRoster : [],
      recordsByStudent:
        parsed.recordsByStudent && typeof parsed.recordsByStudent === 'object' ? parsed.recordsByStudent : {},
    }
  } catch {
    return fallback
  }
}

/**
 * Persist the Gate store to Web Storage safely.
 */
export function writeGateStore(store, storage = globalThis.localStorage) {
  if (!storage || typeof storage.setItem !== 'function') {
    return false
  }
  try {
    storage.setItem(GATE_STORAGE_KEY, JSON.stringify(store))
    return true
  } catch {
    return false
  }
}

/**
 * Return the combined seeded N5 roster plus any custom registered students.
 */
export function getAllRoster(store) {
  return [...N5_ROSTER, ...(Array.isArray(store?.customRoster) ? store.customRoster : [])]
}

/**
 * Ensure the store holds a persistent local device identifier.
 */
export function getOrCreateDeviceId(store) {
  const baseStore = store && typeof store === 'object' ? store : createInitialGateStore()
  if (typeof baseStore.deviceId === 'string' && baseStore.deviceId.trim()) {
    return { store: baseStore, deviceId: baseStore.deviceId }
  }
  const deviceId =
    globalThis.crypto?.randomUUID?.() ||
    `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  return {
    store: { ...baseStore, deviceId },
    deviceId,
  }
}

/**
 * Hash a secret using PBKDF2 (10,000 iterations, SHA-256) or SHA-256 fallback if subtle crypto is absent.
 */
export async function hashSecret(secret, saltHex) {
  const saltBytes = saltHex ? hexToBytes(saltHex) : generateSaltBytes(16)
  const resolvedSalt = saltHex || bytesToHex(saltBytes)
  const secretBytes = encoder.encode(String(secret ?? ''))

  if (globalThis.crypto?.subtle?.importKey && globalThis.crypto?.subtle?.deriveBits) {
    try {
      const keyMaterial = await globalThis.crypto.subtle.importKey(
        'raw',
        secretBytes,
        'PBKDF2',
        false,
        ['deriveBits']
      )
      const derived = await globalThis.crypto.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: saltBytes,
          iterations: PBKDF2_ITERATIONS,
          hash: 'SHA-256',
        },
        keyMaterial,
        256
      )
      return { salt: resolvedSalt, hash: bytesToHex(new Uint8Array(derived)) }
    } catch {
      // Fall back to SHA-256 chaining
    }
  }

  let digest = sha256FallbackBytes(encoder.encode(`${resolvedSalt}:${String(secret ?? '')}`))
  for (let i = 0; i < 100; i += 1) {
    const next = new Uint8Array(digest.length + saltBytes.length)
    next.set(digest)
    next.set(saltBytes, digest.length)
    digest = sha256FallbackBytes(next)
  }
  return { salt: resolvedSalt, hash: bytesToHex(digest) }
}

/**
 * Verify a candidate secret against a stored salt and hex hash.
 */
export async function verifySecret(secret, salt, expectedHash) {
  if (!secret || !salt || !expectedHash) return false
  const { hash } = await hashSecret(secret, salt)
  return constantTimeEqual(hash, expectedHash)
}

/**
 * Validate passphrase strength (minimum 8 chars, at least 1 letter and 1 digit).
 */
export function validatePassphrase(passphrase) {
  if (typeof passphrase !== 'string' || passphrase.trim().length < 8) {
    return { valid: false, error: 'Passphrase must be at least 8 characters long.' }
  }
  if (!/[A-Za-z]/.test(passphrase) || !/\d/.test(passphrase)) {
    return { valid: false, error: 'Passphrase must include at least one letter and one number.' }
  }
  return { valid: true, error: '' }
}

/**
 * Normalize an allocated student number by trimming, uppercasing, and stripping a leading N5- prefix.
 */
export function normalizeAllocatedNumber(value) {
  return String(value ?? '')
    .trim()
    .toUpperCase()
    .replace(/^N5-/, '')
}

/**
 * Build canonical N5 student code from an allocated number.
 */
export function buildStudentCode(allocatedNumber) {
  const normalized = normalizeAllocatedNumber(allocatedNumber)
  return normalized ? `N5-${normalized}` : ''
}

/**
 * Claim a roster seat (first sign-in with initial code) or verify an existing passphrase credential.
 */
export async function claimOrSignInStudent(
  store,
  { allocatedNumber, surname, secret, firstName, lastName } = {}
) {
  const baseStore = store && typeof store === 'object' ? store : createInitialGateStore()
  const alloc = normalizeAllocatedNumber(allocatedNumber)
  if (!alloc) {
    return { ok: false, error: 'Enter your allocated number (e.g. 101 or N5-101).' }
  }

  const inputSurname = String(surname ?? lastName ?? '').trim()
  if (!inputSurname) {
    return { ok: false, error: 'Enter your surname to verify your roster record.' }
  }

  const roster = getAllRoster(baseStore)
  let student = roster.find((item) => normalizeAllocatedNumber(item.allocatedNumber) === alloc)
  let isNewCustom = false

  if (!student) {
    const cleanFirst = String(firstName ?? '').trim()
    const cleanLast = String(lastName ?? surname ?? '').trim()
    if (!cleanFirst || !cleanLast) {
      return {
        ok: false,
        error: 'Allocated number was not found on the seeded N5 roster. Provide first and last name to register.',
      }
    }
    if (cleanLast.toLowerCase() !== inputSurname.toLowerCase()) {
      return { ok: false, error: 'Surname does not match the provided last name.' }
    }
    const studentCode = buildStudentCode(alloc)
    student = {
      studentCode,
      allocatedNumber: alloc,
      firstName: cleanFirst,
      lastName: cleanLast,
      initialCode: studentCode,
    }
    isNewCustom = true
  } else if (student.lastName.trim().toLowerCase() !== inputSurname.toLowerCase()) {
    return { ok: false, error: 'Surname does not match our N5 roster record for that number.' }
  }

  const { store: storeWithDevice, deviceId } = getOrCreateDeviceId(baseStore)
  const credential = storeWithDevice.credentialsByStudent?.[student.studentCode]

  if (!credential) {
    if (!isNewCustom) {
      const providedCode = String(secret ?? '').trim().toUpperCase()
      if (!providedCode || providedCode !== student.initialCode.toUpperCase()) {
        return { ok: false, error: 'Initial access code does not match your N5 code.' }
      }
    }

    const pendingAuth = {
      studentCode: student.studentCode,
      allocatedNumber: student.allocatedNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      deviceId,
      createdAt: Date.now(),
    }
    const customRoster = isNewCustom
      ? [...(storeWithDevice.customRoster || []), student]
      : storeWithDevice.customRoster || []

    return {
      ok: true,
      needsPassphraseSetup: true,
      student,
      store: {
        ...storeWithDevice,
        customRoster,
        pendingAuth,
      },
    }
  }

  const verified = await verifySecret(String(secret ?? ''), credential.salt, credential.hash)
  if (!verified) {
    return { ok: false, error: 'Incorrect personal passphrase for this student record.' }
  }

  const session = {
    studentCode: student.studentCode,
    allocatedNumber: student.allocatedNumber,
    firstName: student.firstName,
    lastName: student.lastName,
    deviceId,
    signedInAt: Date.now(),
  }

  const existingRecord = storeWithDevice.recordsByStudent?.[student.studentCode]
  const recordsByStudent = existingRecord
    ? storeWithDevice.recordsByStudent
    : {
        ...(storeWithDevice.recordsByStudent || {}),
        [student.studentCode]: initialStudentRecord(),
      }

  return {
    ok: true,
    needsPassphraseSetup: false,
    student,
    session,
    store: {
      ...storeWithDevice,
      session,
      pendingAuth: null,
      recordsByStudent,
    },
  }
}

/**
 * Complete first-time personal passphrase setup and activate the signed-in student session.
 */
export async function completePassphraseSetup(store, { newPassphrase, confirmPassphrase } = {}) {
  const baseStore = store && typeof store === 'object' ? store : createInitialGateStore()
  const pending = baseStore.pendingAuth
  if (!pending?.studentCode) {
    return { ok: false, error: 'No pending student claim found. Verify your student number first.' }
  }

  const check = validatePassphrase(newPassphrase)
  if (!check.valid) {
    return { ok: false, error: check.error }
  }

  if (newPassphrase !== confirmPassphrase) {
    return { ok: false, error: 'Passphrases do not match.' }
  }

  const { store: storeWithDevice, deviceId } = getOrCreateDeviceId(baseStore)
  const { salt, hash } = await hashSecret(newPassphrase)

  const session = {
    studentCode: pending.studentCode,
    allocatedNumber: pending.allocatedNumber,
    firstName: pending.firstName,
    lastName: pending.lastName,
    deviceId,
    signedInAt: Date.now(),
  }

  const existingRecord = storeWithDevice.recordsByStudent?.[pending.studentCode]

  return {
    ok: true,
    session,
    store: {
      ...storeWithDevice,
      session,
      pendingAuth: null,
      credentialsByStudent: {
        ...(storeWithDevice.credentialsByStudent || {}),
        [pending.studentCode]: {
          salt,
          hash,
          updatedAt: Date.now(),
        },
      },
      recordsByStudent: {
        ...(storeWithDevice.recordsByStudent || {}),
        [pending.studentCode]: existingRecord || initialStudentRecord(),
      },
    },
  }
}

/**
 * Clear active session and pending auth while preserving credentials and student progress.
 */
export function signOutStudent(store) {
  const baseStore = store && typeof store === 'object' ? store : createInitialGateStore()
  return {
    ...baseStore,
    session: null,
    pendingAuth: null,
  }
}

/**
 * Create a clean student Gate record.
 */
export function initialStudentRecord() {
  return {
    startedAt: null,
    endTime: null,
    submittedAt: null,
    timedOut: false,
    diagnosticsAckedAt: null,
    answers: {},
    confidence: {},
    result: null,
    recovery: {
      drills: {},
      checks: {},
      proofSummary: '',
      evidenceFiles: [],
      confirmedAt: null,
    },
    reassessment: {
      questionIds: [],
      answers: {},
      result: null,
    },
    finalSubmission: null,
  }
}

/**
 * Retrieve the active signed-in student's Gate record, or null if signed out.
 */
export function getActiveStudentRecord(store) {
  const code = store?.session?.studentCode
  if (!code) return null
  return store.recordsByStudent?.[code] || initialStudentRecord()
}

/**
 * Apply an updater function to the active student's record immutably.
 */
export function updateActiveStudentRecord(store, updaterFn) {
  const code = store?.session?.studentCode
  if (!code) return store
  const current = getActiveStudentRecord(store)
  const next = typeof updaterFn === 'function' ? updaterFn(current) : { ...current, ...updaterFn }
  return {
    ...store,
    recordsByStudent: {
      ...(store.recordsByStudent || {}),
      [code]: next,
    },
  }
}

/**
 * Mark the post-gate diagnostics report as reviewed so the student proceeds into targeted recovery.
 */
export function acknowledgeDiagnostics(record, now = Date.now()) {
  if (!record) return record
  if (record.diagnosticsAckedAt) return record
  return {
    ...record,
    diagnosticsAckedAt: now,
  }
}

/**
 * Determine the student's current Gate workflow stage.
 */
export function getGateStage(session, record, _now = Date.now()) {
  if (!session) return 'auth'
  if (record?.finalSubmission) return 'submitted'
  if (record?.submittedAt) {
    const drills = getRecoveryDrillsForLeaks(record.result?.recommendedLeaks || [])
    if (isRecoveryComplete(record, drills)) return 'reassessment'
    if (record.diagnosticsAckedAt) return 'recovery'
    return 'diagnostics'
  }
  if (record?.startedAt) return 'locked_exam'
  return 'briefing'
}

/**
 * Start the 50-minute locked Gate attempt without ever resetting an existing timer.
 */
export function startLockedGate(record, now = Date.now()) {
  const current = record || initialStudentRecord()
  if (current.startedAt) return current
  return {
    ...current,
    startedAt: now,
    endTime: now + GATE_DURATION_MINUTES * 60_000,
  }
}

/**
 * Check whether an active Gate timer has reached or passed its deadline.
 */
export function isGateExpired(record, now = Date.now()) {
  return Boolean(record?.endTime && !record?.submittedAt && now >= record.endTime)
}

/**
 * Record a multiple-choice answer while the Gate attempt is active and unexpired.
 */
export function recordGateAnswer(record, questionId, optionIndex, now = Date.now()) {
  if (!record?.startedAt || record.submittedAt || isGateExpired(record, now)) {
    return record
  }
  if (!questionId || !Number.isInteger(optionIndex) || optionIndex < 0) {
    return record
  }
  return {
    ...record,
    answers: {
      ...(record.answers || {}),
      [questionId]: optionIndex,
    },
  }
}

/**
 * Record a confidence rating ('unsure' | 'likely' | 'certain') while the Gate attempt is active.
 */
export function recordGateConfidence(record, questionId, level, now = Date.now()) {
  if (!record?.startedAt || record.submittedAt || isGateExpired(record, now)) {
    return record
  }
  if (!questionId || !VALID_CONFIDENCE.has(level)) {
    return record
  }
  return {
    ...record,
    confidence: {
      ...(record.confidence || {}),
      [questionId]: level,
    },
  }
}

/**
 * Score a Gate attempt with rubric breakdowns, critical-leak deductions, and readiness banding.
 */
export function scoreGateAttempt(answers = {}, confidence = {}, questions = GATE_QUESTIONS) {
  const total = questions.reduce((sum, q) => sum + Number(q.marks || 0), 0)
  const rubricScores = Object.fromEntries(
    Object.values(GATE_RUBRIC).map((item) => [
      item.code,
      {
        code: item.code,
        title: item.title,
        detail: item.detail,
        earned: 0,
        possible: 0,
        percent: 0,
        missedCount: 0,
      },
    ])
  )

  const leakCounts = {}
  const seenCriticalLeaks = new Set()
  const deductions = []
  let rawScore = 0
  let overconfidentCount = 0

  for (const question of questions) {
    const marks = Number(question.marks || 0)
    const rubric = rubricScores[question.rubricCategory]
    if (rubric) {
      rubric.possible += marks
    }

    const isCorrect = answers?.[question.id] === question.correctIndex
    if (isCorrect) {
      rawScore += marks
      if (rubric) {
        rubric.earned += marks
      }
      continue
    }

    if (rubric) {
      rubric.missedCount += 1
    }
    leakCounts[question.leak] = (leakCounts[question.leak] || 0) + 1
    if (confidence?.[question.id] === 'certain') {
      overconfidentCount += 1
    }
    if (CRITICAL_LEAKS.has(question.leak) && !seenCriticalLeaks.has(question.leak)) {
      seenCriticalLeaks.add(question.leak)
      deductions.push({
        leak: question.leak,
        points: 5,
        title: LEAK_GUIDANCE[question.leak]?.title || question.leak,
      })
    }
  }

  for (const entry of Object.values(rubricScores)) {
    entry.percent = entry.possible > 0 ? Math.round((entry.earned / entry.possible) * 100) : 0
  }

  const deductionTotal = deductions.reduce((sum, d) => sum + d.points, 0)
  const score = Math.max(0, rawScore - deductionTotal)
  const percent = total > 0 ? Math.round((score / total) * 100) : 0

  let readinessBand = 'critical'
  let readinessLabel = 'Critical'
  if (percent >= 80) {
    readinessBand = 'exam_ready'
    readinessLabel = 'Exam-ready'
  } else if (percent >= 65) {
    readinessBand = 'developing'
    readinessLabel = 'Developing'
  } else if (percent >= 50) {
    readinessBand = 'unstable'
    readinessLabel = 'Unstable'
  }

  const recommendedLeaks = Object.entries(leakCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([leak]) => leak)

  return {
    score,
    rawScore,
    total,
    deductionTotal,
    deductions,
    percent,
    readinessBand,
    readinessLabel,
    rubricScores,
    leakCounts,
    recommendedLeaks,
    overconfidentCount,
  }
}

/**
 * Filter N5 remediation drills prioritized by detected leaks, or return 1 consolidation drill on 100%.
 */
export function getRecoveryDrillsForLeaks(recommendedLeaks = []) {
  const n5Drills = repairs.filter((item) => item.subjectCode === 'n5')
  const leaks = Array.isArray(recommendedLeaks) ? recommendedLeaks : []

  if (leaks.length === 0) {
    const consolidation = n5Drills.find((item) => item.id === 'n5-time') || n5Drills[0]
    return consolidation ? [consolidation] : []
  }

  const matching = n5Drills
    .filter((item) => leaks.includes(item.leak))
    .sort((a, b) => leaks.indexOf(a.leak) - leaks.indexOf(b.leak))

  if (matching.length > 0) {
    return matching.slice(0, 3)
  }

  const fallback = n5Drills.find((item) => item.id === 'n5-time') || n5Drills[0]
  return fallback ? [fallback] : []
}

/**
 * Select 3 fresh reassessment questions prioritizing the learner's recommended leaks.
 */
export function selectReassessmentQuestions(recommendedLeaks = []) {
  const leaks = Array.isArray(recommendedLeaks) ? recommendedLeaks : []
  const prioritized = []
  const remainder = []

  for (const question of REASSESSMENT_BANK) {
    if (leaks.includes(question.leak)) {
      prioritized.push(question)
    } else {
      remainder.push(question)
    }
  }

  prioritized.sort((a, b) => leaks.indexOf(a.leak) - leaks.indexOf(b.leak))
  return [...prioritized, ...remainder].slice(0, 3)
}

/**
 * Check whether all targeted drills, practical proof checkboxes, and the written proof summary are complete.
 */
export function isRecoveryComplete(record, drills = []) {
  const recovery = record?.recovery
  if (!recovery) return false

  const drillList = Array.isArray(drills) ? drills : []
  const drillsComplete = drillList.every((drill) => {
    const attempt = recovery.drills?.[drill.id]
    if (!attempt || attempt.revealed !== true) return false
    if (!String(attempt.answer || '').trim()) return false
    if (!String(attempt.correction || '').trim()) return false
    const points = Array.isArray(attempt.points) ? attempt.points : []
    return Array.isArray(drill.answerPoints) && drill.answerPoints.every((_, idx) => points.includes(idx))
  })

  if (!drillsComplete) return false

  const proofItems = Object.values(PRACTICAL_PROOF_CHECKS)
  const checksComplete = proofItems.every((item) => Boolean(recovery.checks?.[item.id]))
  if (!checksComplete) return false

  return String(recovery.proofSummary || '').trim().length >= 10
}

/**
 * Lock and score the Gate attempt and assign targeted reassessment questions.
 */
export function submitLockedGate(record, now = Date.now(), forceTimeout = false) {
  const current = record || initialStudentRecord()
  if (current.submittedAt) return current

  const result = scoreGateAttempt(current.answers, current.confidence, GATE_QUESTIONS)
  const selected = selectReassessmentQuestions(result.recommendedLeaks)
  const timedOut = Boolean(forceTimeout || isGateExpired(current, now))

  return {
    ...current,
    submittedAt: now,
    timedOut,
    result,
    reassessment: {
      ...(current.reassessment || {}),
      questionIds: selected.map((q) => q.id),
      answers: current.reassessment?.answers || {},
      result: null,
    },
  }
}

/**
 * Score the 3 selected reassessment verification questions.
 */
export function submitReassessment(record, answers = {}, now = Date.now()) {
  const current = record || initialStudentRecord()
  const existingIds = Array.isArray(current.reassessment?.questionIds)
    ? current.reassessment.questionIds
    : []
  const questionIds =
    existingIds.length > 0
      ? existingIds
      : selectReassessmentQuestions(current.result?.recommendedLeaks || []).map((q) => q.id)

  const bankById = new Map(REASSESSMENT_BANK.map((q) => [q.id, q]))
  const details = questionIds
    .map((id) => bankById.get(id))
    .filter(Boolean)
    .map((question) => {
      const selectedIndex = answers?.[question.id] ?? null
      return {
        id: question.id,
        prompt: question.prompt,
        selectedIndex,
        correctIndex: question.correctIndex,
        correct: selectedIndex === question.correctIndex,
        leak: question.leak,
        rationale: question.rationale,
      }
    })

  const correct = details.filter((d) => d.correct).length
  const total = details.length
  const passed = total > 0 && correct >= Math.ceil((total * 2) / 3)

  return {
    ...current,
    reassessment: {
      questionIds,
      answers: { ...answers },
      result: {
        correct,
        total,
        passed,
        details,
        completedAt: now,
      },
    },
  }
}

/**
 * Produce the tamper-evident final Gate submission receipt once gate, recovery, and reassessment are complete.
 */
export async function finalizeGateSubmission(session, record, now = Date.now()) {
  if (!session?.studentCode) {
    throw new Error('Cannot finalize submission without an active student session.')
  }
  const drills = getRecoveryDrillsForLeaks(record?.result?.recommendedLeaks || [])
  if (!record?.submittedAt || !isRecoveryComplete(record, drills) || !record?.reassessment?.result) {
    throw new Error('Cannot finalize Gate submission before gate attempt, recovery, and reassessment are complete.')
  }

  const evidenceFiles = (record.recovery.evidenceFiles || []).map((item) =>
    typeof item === 'string' ? item : item?.file || ''
  ).filter(Boolean)

  const payload = JSON.stringify({
    studentCode: session.studentCode,
    deviceId: session.deviceId || '',
    submittedAt: now,
    gateScore: record.result.score,
    gateTotal: record.result.total,
    reassessmentCorrect: record.reassessment.result.correct,
    reassessmentTotal: record.reassessment.result.total,
    leaksAddressed: record.result.recommendedLeaks,
    proofSummary: record.recovery.proofSummary,
    evidenceFiles,
  })

  const digest = await sha256Hex(payload)
  const suffix = digest.slice(0, 8).toUpperCase()
  const referenceId = `N5G1-${session.allocatedNumber || session.studentCode}-${suffix}`

  const finalSubmission = {
    referenceId,
    submittedAt: now,
    studentCode: session.studentCode,
    studentName: `${session.firstName} ${session.lastName}`,
    deviceId: session.deviceId || '',
    gateScore: record.result.score,
    gateTotal: record.result.total,
    gatePercent: record.result.percent,
    readinessLabel: record.result.readinessLabel,
    leaksAddressed: record.result.recommendedLeaks,
    reassessmentScore: `${record.reassessment.result.correct}/${record.reassessment.result.total}`,
    proofSummary: record.recovery.proofSummary,
    evidenceFiles,
    digest,
  }

  return {
    ...record,
    recovery: {
      ...record.recovery,
      confirmedAt: record.recovery.confirmedAt || now,
    },
    finalSubmission,
  }
}

/**
 * Format a plain-text lecturer submission receipt (never includes passphrases or secrets).
 */
export function formatSubmissionReceiptText(finalSubmission) {
  if (!finalSubmission) return ''
  const leaks =
    Array.isArray(finalSubmission.leaksAddressed) && finalSubmission.leaksAddressed.length > 0
      ? finalSubmission.leaksAddressed.join(', ')
      : 'None (100% accuracy)'
  const files =
    Array.isArray(finalSubmission.evidenceFiles) && finalSubmission.evidenceFiles.length > 0
      ? finalSubmission.evidenceFiles.join(', ')
      : 'None attached'
  const timestamp = new Date(finalSubmission.submittedAt).toISOString()

  return [
    'SANKOFA COMPUTELAB · N5 GATE 01 SUBMISSION RECEIPT',
    '================================================',
    `Reference ID: ${finalSubmission.referenceId}`,
    `Submitted At: ${timestamp}`,
    `Student: ${finalSubmission.studentName} (${finalSubmission.studentCode})`,
    `Device ID: ${finalSubmission.deviceId || 'local'}`,
    `Gate Score: ${finalSubmission.gateScore}/${finalSubmission.gateTotal} (${finalSubmission.gatePercent}%)`,
    `Readiness Band: ${finalSubmission.readinessLabel}`,
    `Leaks Addressed: ${leaks}`,
    `Reassessment Score: ${finalSubmission.reassessmentScore}`,
    `Proof Summary: ${finalSubmission.proofSummary}`,
    `Evidence Files: ${files}`,
    `Verification Digest (SHA-256): ${finalSubmission.digest}`,
  ].join('\n')
}

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileCheck2,
  FileText,
  KeyRound,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserCheck,
  UserPlus,
} from 'lucide-react'
import {
  GATE_DURATION_MINUTES,
  GATE_QUESTIONS,
  GATE_RUBRIC,
  GATE_SUBTITLE,
  GATE_TITLE,
  LEAK_GUIDANCE,
  N5_ROSTER,
  PRACTICAL_PROOF_CHECKS,
  REASSESSMENT_BANK,
} from './n5-gate-data.js'
import {
  acknowledgeDiagnostics,
  claimOrSignInStudent,
  completePassphraseSetup,
  finalizeGateSubmission,
  formatSubmissionReceiptText,
  getActiveStudentRecord,
  getAllRoster,
  getGateStage,
  getOrCreateDeviceId,
  getRecoveryDrillsForLeaks,
  isGateExpired,
  isRecoveryComplete,
  readGateStore,
  recordGateAnswer,
  recordGateConfidence,
  selectReassessmentQuestions,
  signOutStudent,
  startLockedGate,
  submitLockedGate,
  submitReassessment,
  updateActiveStudentRecord,
  writeGateStore,
} from './n5-gate-engine.js'
import { downloadFile, saveFiles } from './files.js'
import { Header } from './ui.jsx'

const STEPPER_ITEMS = [
  { key: 'gate', label: '1. Gate Attempt' },
  { key: 'diagnostics', label: '2. Leak Report' },
  { key: 'recovery', label: '3. Targeted Recovery' },
  { key: 'reassessment', label: '4. Reassessment' },
  { key: 'submitted', label: '5. Submitted' },
]

function createBlankRecord() {
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

function formatRemainingTime(ms) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function triggerTextDownload(filename, text, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([text], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
}

function getActiveStepperIndex(stage) {
  if (stage === 'briefing' || stage === 'locked_exam') return 0
  if (stage === 'diagnostics') return 1
  if (stage === 'recovery') return 2
  if (stage === 'reassessment') return 3
  if (stage === 'submitted') return 4
  return 0
}

export function N5Gate({ notify, onNav }) {
  const [store, setStore] = useState(() => {
    const loaded = readGateStore()
    const { store: initialized } = getOrCreateDeviceId(loaded)
    if (initialized !== loaded) {
      writeGateStore(initialized)
    }
    return initialized
  })

  const storeRef = useRef(store)
  storeRef.current = store

  function commitStore(updater) {
    setStore((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      storeRef.current = next
      writeGateStore(next)
      return next
    })
  }

  // Auth state
  const [authMode, setAuthMode] = useState('roster')
  const [allocatedNumber, setAllocatedNumber] = useState('')
  const [firstName, setFirstName] = useState('')
  const [surname, setSurname] = useState('')
  const [secret, setSecret] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [newPassphrase, setNewPassphrase] = useState('')
  const [confirmPassphrase, setConfirmPassphrase] = useState('')
  const [showNewPass, setShowNewPass] = useState(false)
  const [authError, setAuthError] = useState('')
  const [authBusy, setAuthBusy] = useState(false)

  // Exam & recovery UI state
  const [nowMs, setNowMs] = useState(() => Date.now())
  const [confirmEarlySubmit, setConfirmEarlySubmit] = useState(false)
  const [showRationale, setShowRationale] = useState(false)
  const [fileBusy, setFileBusy] = useState(false)
  const [finalBusy, setFinalBusy] = useState(false)
  const [confirmResetCycle, setConfirmResetCycle] = useState(false)

  const session = store.session
  const pendingAuth = store.pendingAuth
  const record = getActiveStudentRecord(store)
  const engineStage = getGateStage(session, record, nowMs)

  // Keep user on recovery until they click "Continue to Verification Reassessment"
  // so typing the 10th character of proofSummary doesn't unmount the editor mid-sentence.
  const stage =
    engineStage === 'reassessment' && !record?.recovery?.confirmedAt && !record?.reassessment?.result
      ? 'recovery'
      : engineStage

  const allRoster = useMemo(() => getAllRoster(store), [store])
  const drills = useMemo(
    () => getRecoveryDrillsForLeaks(record?.result?.recommendedLeaks || []),
    [record?.result?.recommendedLeaks]
  )

  const reassessmentQuestions = useMemo(() => {
    const ids = record?.reassessment?.questionIds || []
    if (ids.length > 0) {
      const byId = new Map(REASSESSMENT_BANK.map((q) => [q.id, q]))
      const resolved = ids.map((id) => byId.get(id)).filter(Boolean)
      if (resolved.length > 0) return resolved
    }
    return selectReassessmentQuestions(record?.result?.recommendedLeaks || [])
  }, [record?.reassessment?.questionIds, record?.result?.recommendedLeaks])

  // Live 50-minute countdown timer
  useEffect(() => {
    if (stage !== 'locked_exam' || !record?.endTime) return undefined
    setNowMs(Date.now())
    const timer = setInterval(() => {
      const current = Date.now()
      setNowMs(current)
      const latestRecord = getActiveStudentRecord(storeRef.current)
      if (latestRecord && isGateExpired(latestRecord, current)) {
        commitStore((prev) =>
          updateActiveStudentRecord(prev, (r) => submitLockedGate(r, current, true))
        )
        notify?.('Time expired (50:00). Your Gate 01 attempt has been locked and scored.')
      }
    }, 500)
    return () => clearInterval(timer)
  }, [stage, record?.endTime])

  function resetAuthFields() {
    setSecret('')
    setNewPassphrase('')
    setConfirmPassphrase('')
    setAuthError('')
  }

  function handleSelectRosterCandidate(student) {
    setAuthMode('roster')
    setAllocatedNumber(student.allocatedNumber)
    setSurname(student.lastName)
    const hasPassphrase = Boolean(store.credentialsByStudent?.[student.studentCode])
    setSecret(hasPassphrase ? '' : student.initialCode)
    setAuthError('')
  }

  async function handleClaimOrSignIn(e) {
    e.preventDefault()
    setAuthError('')
    setAuthBusy(true)
    try {
      const payload =
        authMode === 'new'
          ? {
              allocatedNumber,
              firstName,
              lastName: surname,
              surname,
              secret,
            }
          : {
              allocatedNumber,
              surname,
              secret,
            }
      const res = await claimOrSignInStudent(storeRef.current, payload)
      if (!res.ok) {
        setAuthError(res.error || 'Could not verify student access.')
        return
      }
      commitStore(res.store)
      if (res.needsPassphraseSetup) {
        setNewPassphrase('')
        setConfirmPassphrase('')
        notify?.('Identity verified. Create your private passphrase to lock your session.')
      } else {
        resetAuthFields()
        notify?.(`Signed in as ${res.student.firstName} ${res.student.lastName} (${res.student.studentCode}).`)
      }
    } finally {
      setAuthBusy(false)
    }
  }

  async function handlePassphraseSetup(e) {
    e.preventDefault()
    setAuthError('')
    setAuthBusy(true)
    try {
      const res = await completePassphraseSetup(storeRef.current, {
        newPassphrase,
        confirmPassphrase,
      })
      if (!res.ok) {
        setAuthError(res.error || 'Could not save passphrase.')
        return
      }
      commitStore(res.store)
      resetAuthFields()
      notify?.(`Private passphrase saved. Welcome, ${res.session.firstName}!`)
    } finally {
      setAuthBusy(false)
    }
  }

  function handleSignOut() {
    commitStore((prev) => signOutStudent(prev))
    resetAuthFields()
    setConfirmEarlySubmit(false)
    setConfirmResetCycle(false)
    notify?.('Session lock cleared. Your saved progress remains on this device.')
  }

  function handleStartLockedGate() {
    const now = Date.now()
    setNowMs(now)
    commitStore((prev) => updateActiveStudentRecord(prev, (r) => startLockedGate(r, now)))
    notify?.(`Gate 01 timer started (${GATE_DURATION_MINUTES} minutes).`)
  }

  function handleSelectGateAnswer(questionId, optionIndex) {
    const now = Date.now()
    setConfirmEarlySubmit(false)
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => recordGateAnswer(r, questionId, optionIndex, now))
    )
  }

  function handleSelectGateConfidence(questionId, level) {
    const now = Date.now()
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => recordGateConfidence(r, questionId, level, now))
    )
  }

  function handleSubmitLockedGate() {
    const currentRecord = getActiveStudentRecord(storeRef.current)
    const answeredCount = GATE_QUESTIONS.filter((q) =>
      Number.isInteger(currentRecord?.answers?.[q.id])
    ).length
    if (answeredCount < Math.ceil(GATE_QUESTIONS.length / 2)) {
      notify?.('Answer at least 6 of 12 questions before locking your Gate 01 attempt.')
      return
    }
    if (answeredCount < GATE_QUESTIONS.length && !confirmEarlySubmit) {
      setConfirmEarlySubmit(true)
      return
    }
    const now = Date.now()
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => submitLockedGate(r, now, false))
    )
    setConfirmEarlySubmit(false)
    notify?.('Gate 01 locked and scored. Review your rubric and leak report.')
  }

  function handleAcknowledgeDiagnostics() {
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => acknowledgeDiagnostics(r, Date.now()))
    )
  }

  function patchDrill(drillId, patch) {
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => {
        const currentDrills = r.recovery?.drills || {}
        return {
          ...r,
          recovery: {
            ...r.recovery,
            confirmedAt: null,
            drills: {
              ...currentDrills,
              [drillId]: {
                ...(currentDrills[drillId] || {}),
                ...patch,
              },
            },
          },
        }
      })
    )
  }

  function toggleProofCheck(checkId) {
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => {
        const checks = r.recovery?.checks || {}
        return {
          ...r,
          recovery: {
            ...r.recovery,
            confirmedAt: null,
            checks: {
              ...checks,
              [checkId]: !checks[checkId],
            },
          },
        }
      })
    )
  }

  function updateProofSummary(value) {
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => ({
        ...r,
        recovery: {
          ...r.recovery,
          confirmedAt: null,
          proofSummary: value,
        },
      }))
    )
  }

  async function handleAttachEvidenceFile(e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file || !session?.studentCode) return
    setFileBusy(true)
    try {
      const fileId = `n5g1-${session.studentCode}-${Date.now()}`
      await saveFiles([{ id: fileId, blob: file }])
      commitStore((prev) =>
        updateActiveStudentRecord(prev, (r) => ({
          ...r,
          recovery: {
            ...r.recovery,
            evidenceFiles: [
              ...(r.recovery?.evidenceFiles || []),
              { id: fileId, file: file.name, size: file.size, savedAt: Date.now() },
            ],
          },
        }))
      )
      notify?.(`Attached "${file.name}" to your device evidence vault.`)
    } catch {
      notify?.('Could not save evidence file on this device. Keep your original file.')
    } finally {
      setFileBusy(false)
    }
  }

  function handleRemoveEvidenceFile(fileId) {
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => ({
        ...r,
        recovery: {
          ...r.recovery,
          evidenceFiles: (r.recovery?.evidenceFiles || []).filter((item) => item.id !== fileId),
        },
      }))
    )
  }

  function handleContinueToReassessment() {
    if (!isRecoveryComplete(record, drills)) return
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => ({
        ...r,
        recovery: {
          ...r.recovery,
          confirmedAt: Date.now(),
        },
      }))
    )
    notify?.('Recovery verified. Complete the 3 fresh reassessment questions.')
  }

  function handleBackToRecovery() {
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => ({
        ...r,
        recovery: {
          ...r.recovery,
          confirmedAt: null,
        },
      }))
    )
  }

  function handleSelectReassessmentAnswer(questionId, optionIndex) {
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => ({
        ...r,
        reassessment: {
          ...(r.reassessment || {}),
          answers: {
            ...(r.reassessment?.answers || {}),
            [questionId]: optionIndex,
          },
        },
      }))
    )
  }

  function handleVerifyReassessment() {
    const answers = record?.reassessment?.answers || {}
    const allAnswered = reassessmentQuestions.every((q) => Number.isInteger(answers[q.id]))
    if (!allAnswered) {
      notify?.('Answer all 3 reassessment questions before verifying.')
      return
    }
    commitStore((prev) =>
      updateActiveStudentRecord(prev, (r) => submitReassessment(r, answers, Date.now()))
    )
    notify?.('Reassessment verified. Review your final packet and submit.')
  }

  async function handleFinalizeSubmission() {
    if (!session || !record) return
    setFinalBusy(true)
    try {
      const updatedRecord = await finalizeGateSubmission(session, record, Date.now())
      commitStore((prev) => updateActiveStudentRecord(prev, () => updatedRecord))
      notify?.('N5 Gate 01 submitted and sealed with a SHA-256 verification digest.')
    } catch (err) {
      notify?.(err?.message || 'Unable to finalize Gate 01 submission.')
    } finally {
      setFinalBusy(false)
    }
  }

  function handleDownloadReceipt() {
    if (!record?.finalSubmission) return
    const text = formatSubmissionReceiptText(record.finalSubmission)
    triggerTextDownload(`N5-Gate-01-Receipt-${record.finalSubmission.studentCode}.txt`, text)
    notify?.('Submission receipt (.txt) downloaded.')
  }

  function handleDownloadFullPacket() {
    if (!record?.finalSubmission || !session) return
    const packet = {
      gate: { title: GATE_TITLE, subtitle: GATE_SUBTITLE, durationMinutes: GATE_DURATION_MINUTES },
      student: {
        studentCode: session.studentCode,
        firstName: session.firstName,
        lastName: session.lastName,
        deviceId: session.deviceId,
      },
      gateResult: record.result,
      recovery: record.recovery,
      reassessment: record.reassessment,
      finalSubmission: record.finalSubmission,
    }
    triggerTextDownload(
      `N5-Gate-01-Packet-${record.finalSubmission.studentCode}.json`,
      JSON.stringify(packet, null, 2),
      'application/json;charset=utf-8'
    )
    notify?.('Full Gate 01 packet (.json) downloaded.')
  }

  function handleResetFreshCycle() {
    commitStore((prev) => updateActiveStudentRecord(prev, () => createBlankRecord()))
    setConfirmResetCycle(false)
    setConfirmEarlySubmit(false)
    setShowRationale(false)
    notify?.('Started a fresh N5 Gate 01 practice cycle.')
  }

  const activeStepIdx = getActiveStepperIndex(stage)
  const answeredCount = GATE_QUESTIONS.filter((q) => Number.isInteger(record?.answers?.[q.id])).length
  const remainingMs = record?.endTime ? Math.max(0, record.endTime - nowMs) : GATE_DURATION_MINUTES * 60_000
  const timerUrgent = remainingMs <= 5 * 60_000
  const recoveryReady = isRecoveryComplete(record, drills)

  return (
    <div className="n5g-shell">
      <Header
        eyebrow="N5 PRIORITY ASSESSMENT GATE"
        title={GATE_TITLE}
        description={`${GATE_SUBTITLE} · 6-stage cycle: Sign-in, 50-min Locked Gate, Leak Report, Targeted Recovery, Reassessment & Sealed Submission.`}
      >
        {onNav && (
          <button className="btn outline" type="button" onClick={() => onNav('overview')}>
            Back to Overview
          </button>
        )}
      </Header>

      {session && (
        <section className="n5g-identity-bar" aria-label="Active student session and Gate progress">
          <div className="n5g-identity-top">
            <div className="n5g-identity-meta">
              <span className="icon-tile mint">
                <UserCheck size={19} />
              </span>
              <div>
                <strong>
                  {session.firstName} {session.lastName} · {session.studentCode}
                </strong>
                <small>
                  Device Lock: {(session.deviceId || store.deviceId || 'local').slice(0, 12)}
                </small>
              </div>
            </div>
            <button className="btn outline" type="button" onClick={handleSignOut}>
              <LogOut size={16} /> Clear lock / Sign out
            </button>
          </div>

          <ol className="n5g-stepper" aria-label="Gate 01 workflow steps">
            {STEPPER_ITEMS.map((item, index) => {
              const isDone = stage === 'submitted' ? true : index < activeStepIdx
              const isActive = stage !== 'submitted' && index === activeStepIdx
              return (
                <li
                  key={item.key}
                  className={`n5g-step ${isDone ? 'done' : ''} ${isActive ? 'active' : ''}`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span className="n5g-step-num">{isDone ? '✓' : index + 1}</span>
                  <span className="n5g-step-label">{item.label}</span>
                </li>
              )
            })}
          </ol>
        </section>
      )}

      {/* STAGE 1: AUTH & DEVICE SESSION LOCK */}
      {stage === 'auth' && (
        <section className="n5g-panel n5g-auth-wrap" aria-labelledby="n5g-auth-heading">
          {pendingAuth ? (
            <form onSubmit={handlePassphraseSetup} noValidate>
              <div className="eyebrow">FIRST-TIME DEVICE LOCK SETUP</div>
              <h2 id="n5g-auth-heading">Create Your Private Passphrase</h2>
              <p>
                Claiming record for{' '}
                <strong>
                  {pendingAuth.firstName} {pendingAuth.lastName} ({pendingAuth.studentCode})
                </strong>
                . Set a personal passphrase (minimum 8 characters, including letters and numbers).
                Future sign-ins on this device will require this passphrase.
              </p>

              {authError && (
                <div className="n5g-alert error" role="alert">
                  <AlertTriangle size={17} />
                  <span>{authError}</span>
                </div>
              )}

              <div className="n5g-form-grid">
                <label className="field" htmlFor="n5g-new-passphrase">
                  <span>New private passphrase</span>
                  <div className="n5g-password-wrap">
                    <input
                      id="n5g-new-passphrase"
                      type={showNewPass ? 'text' : 'password'}
                      value={newPassphrase}
                      onChange={(e) => setNewPassphrase(e.target.value)}
                      placeholder="e.g. Sankofa2026"
                      autoComplete="new-password"
                      required
                    />
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={showNewPass ? 'Hide passphrase' : 'Show passphrase'}
                      aria-pressed={showNewPass}
                      onClick={() => setShowNewPass((v) => !v)}
                    >
                      {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>

                <label className="field" htmlFor="n5g-confirm-passphrase">
                  <span>Confirm passphrase</span>
                  <input
                    id="n5g-confirm-passphrase"
                    type={showNewPass ? 'text' : 'password'}
                    value={confirmPassphrase}
                    onChange={(e) => setConfirmPassphrase(e.target.value)}
                    placeholder="Re-enter passphrase"
                    autoComplete="new-password"
                    required
                  />
                </label>
              </div>

              <div className="button-row">
                <button className="btn primary" type="submit" disabled={authBusy}>
                  <KeyRound size={16} />
                  {authBusy ? 'Securing session...' : 'Save Passphrase & Lock Session'}
                </button>
                <button
                  className="btn outline"
                  type="button"
                  onClick={handleSignOut}
                  disabled={authBusy}
                >
                  Use a different student number
                </button>
              </div>
            </form>
          ) : (
            <div>
              <div className="eyebrow">STUDENT ACCESS &amp; SESSION LOCK</div>
              <h2 id="n5g-auth-heading">Sign in to N5 Gate 01</h2>
              <p>
                Verify your allocated number and surname to bind Gate 01 to your student record on
                this device.
              </p>

              <div className="segmented" role="tablist" aria-label="Student registration mode" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'roster'}
                  className={authMode === 'roster' ? 'active' : ''}
                  onClick={() => {
                    setAuthMode('roster')
                    setAuthError('')
                  }}
                >
                  <UserCheck size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  Rostered Student
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={authMode === 'new'}
                  className={authMode === 'new' ? 'active' : ''}
                  onClick={() => {
                    setAuthMode('new')
                    setAllocatedNumber('')
                    setFirstName('')
                    setSurname('')
                    setSecret('')
                    setAuthError('')
                  }}
                >
                  <UserPlus size={14} style={{ marginRight: 5, verticalAlign: 'middle' }} />
                  New Candidate
                </button>
              </div>

              {authMode === 'roster' && allRoster.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <small className="muted">Quick-select cohort student:</small>
                  <div className="n5g-roster-chips">
                    {allRoster.map((student) => {
                      const active =
                        allocatedNumber.trim().toUpperCase().replace(/^N5-/, '') ===
                        student.allocatedNumber
                      const claimed = Boolean(store.credentialsByStudent?.[student.studentCode])
                      return (
                        <button
                          key={student.studentCode}
                          type="button"
                          className={`n5g-chip ${active ? 'active' : ''}`}
                          onClick={() => handleSelectRosterCandidate(student)}
                        >
                          {student.studentCode} · {student.firstName} {student.lastName}
                          {claimed ? ' (Locked)' : ''}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {authError && (
                <div className="n5g-alert error" role="alert">
                  <AlertTriangle size={17} />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleClaimOrSignIn} noValidate style={{ marginTop: 8 }}>
                <div className="n5g-form-grid">
                  <label className="field" htmlFor="n5g-alloc-num">
                    <span>Allocated student number</span>
                    <input
                      id="n5g-alloc-num"
                      type="text"
                      value={allocatedNumber}
                      onChange={(e) => setAllocatedNumber(e.target.value)}
                      placeholder={authMode === 'roster' ? 'e.g. 101 or N5-101' : 'e.g. 106 or N5-106'}
                      required
                    />
                  </label>

                  {authMode === 'new' && (
                    <label className="field" htmlFor="n5g-first-name">
                      <span>First name</span>
                      <input
                        id="n5g-first-name"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="e.g. Zanele"
                        required
                      />
                    </label>
                  )}

                  <label className="field" htmlFor="n5g-surname">
                    <span>Surname</span>
                    <input
                      id="n5g-surname"
                      type="text"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="e.g. Mokoena"
                      required
                    />
                  </label>

                  {authMode === 'roster' && (
                    <label className="field" htmlFor="n5g-secret">
                      <span>Initial access code or personal passphrase</span>
                      <div className="n5g-password-wrap">
                        <input
                          id="n5g-secret"
                          type={showSecret ? 'text' : 'password'}
                          value={secret}
                          onChange={(e) => setSecret(e.target.value)}
                          placeholder="First visit: N5-101 · Returning: passphrase"
                          autoComplete="current-password"
                          required
                        />
                        <button
                          className="icon-button"
                          type="button"
                          aria-label={showSecret ? 'Hide access code' : 'Show access code'}
                          aria-pressed={showSecret}
                          onClick={() => setShowSecret((v) => !v)}
                        >
                          {showSecret ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </label>
                  )}
                </div>

                {authMode === 'new' && (
                  <p className="compact muted" style={{ marginBottom: 10 }}>
                    After verifying your candidate details, you will set your private passphrase on
                    the next screen.
                  </p>
                )}

                <div className="button-row" style={{ marginTop: 6 }}>
                  <button className="btn primary" type="submit" disabled={authBusy}>
                    <Lock size={16} />
                    {authBusy
                      ? 'Verifying...'
                      : authMode === 'new'
                        ? 'Register & Set Passphrase'
                        : 'Verify & Continue'}
                  </button>
                </div>
              </form>

              <details className="n5g-demo-details">
                <summary>Demo cohort credentials for testing</summary>
                <p className="compact muted" style={{ marginTop: 6 }}>
                  First-time claims use the student code (e.g. <code>N5-101</code>) as the initial
                  access code, then prompt for private passphrase creation.
                </p>
                <ul className="n5g-demo-list">
                  {N5_ROSTER.map((student) => (
                    <li key={student.studentCode}>
                      <span>
                        <strong>{student.studentCode}</strong> · {student.firstName}{' '}
                        {student.lastName} (Initial code: <code>{student.initialCode}</code>)
                      </span>
                      <button
                        className="btn outline"
                        type="button"
                        style={{ minHeight: 32, padding: '0 10px', fontSize: '.76rem' }}
                        onClick={() => handleSelectRosterCandidate(student)}
                      >
                        Fill
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
            </div>
          )}
        </section>
      )}

      {/* STAGE 2: BRIEFING & SEQUENCE LOCK */}
      {stage === 'briefing' && (
        <section className="n5g-panel" aria-labelledby="n5g-briefing-heading">
          <div className="eyebrow">STAGE 1 · GATE BRIEFING &amp; SEQUENCE LOCK</div>
          <h2 id="n5g-briefing-heading">Ready to start N5 Gate 01</h2>
          <p>
            Once you start, your <strong>{GATE_DURATION_MINUTES}-minute fixed clock</strong> begins
            immediately and cannot be paused or reset. Answer all 12 questions (100 marks total)
            before progressing to your leak profile, targeted recovery drills, and reassessment.
          </p>

          <div className="n5g-alert info" style={{ marginTop: 12 }}>
            <ShieldCheck size={18} />
            <div>
              <strong>Enforced Read → Plan → Execute → Verify rules</strong>
              <div className="compact">
                12 diagnostic &amp; practical control items · 100 total marks · Critical-leak
                deductions apply if core file, formula, or print checks are missed.
              </div>
            </div>
          </div>

          <h3 style={{ marginTop: 14 }}>5-Dimension Gate Rubric</h3>
          <div className="n5g-rubric-grid">
            {Object.values(GATE_RUBRIC).map((dim) => (
              <div className="n5g-rubric-card" key={dim.code}>
                <div className="n5g-rubric-head">
                  <strong>{dim.title}</strong>
                  <span className="pill neutral">{dim.code.replace(/_/g, ' ')}</span>
                </div>
                <p className="compact">{dim.detail}</p>
              </div>
            ))}
          </div>

          <div className="button-row" style={{ marginTop: 14 }}>
            <button className="btn primary" type="button" onClick={handleStartLockedGate}>
              <Lock size={16} /> Start Locked Gate 01 ({GATE_DURATION_MINUTES} min)
            </button>
          </div>
        </section>
      )}

      {/* STAGE 3: LOCKED TIMED GATE */}
      {stage === 'locked_exam' && (
        <section className="stack" aria-labelledby="n5g-exam-heading">
          <div className="n5g-timer-bar" role="status" aria-live="polite">
            <div className="n5g-timer-meta">
              <strong id="n5g-exam-heading">Locked Gate 01 in progress</strong> · {answeredCount} /{' '}
              {GATE_QUESTIONS.length} answered
            </div>
            <span className={`timer ${timerUrgent ? 'urgent' : ''}`}>
              <Clock size={16} /> {formatRemainingTime(remainingMs)}
            </span>
          </div>

          {GATE_QUESTIONS.map((q, index) => {
            const selected = record?.answers?.[q.id]
            const confidence = record?.confidence?.[q.id] || ''
            return (
              <article className="n5g-question-card" key={q.id}>
                <div className="n5g-question-head">
                  <span className="pill neutral">
                    Question {index + 1} of {GATE_QUESTIONS.length} · {q.marks} marks
                  </span>
                  <span className="compact muted">
                    {GATE_RUBRIC[q.rubricCategory]?.title || q.rubricCategory}
                  </span>
                </div>

                <fieldset>
                  <legend>
                    {index + 1}. {q.prompt}
                  </legend>
                  <div className="stack">
                    {q.options.map((opt, optIdx) => {
                      const isChecked = selected === optIdx
                      return (
                        <label
                          key={optIdx}
                          className={`n5g-option ${isChecked ? 'selected' : ''}`}
                        >
                          <input
                            type="radio"
                            name={q.id}
                            checked={isChecked}
                            onChange={() => handleSelectGateAnswer(q.id, optIdx)}
                          />
                          <span>{opt}</span>
                        </label>
                      )
                    })}
                  </div>
                </fieldset>

                <div className="n5g-confidence-row">
                  <span>Confidence (optional):</span>
                  <div className="segmented" role="group" aria-label={`Confidence for question ${index + 1}`}>
                    {[
                      ['unsure', 'Unsure'],
                      ['likely', 'Likely'],
                      ['certain', 'Certain'],
                    ].map(([val, label]) => (
                      <button
                        key={val}
                        type="button"
                        className={confidence === val ? 'active' : ''}
                        onClick={() => handleSelectGateConfidence(q.id, val)}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}

          {confirmEarlySubmit && answeredCount < GATE_QUESTIONS.length && (
            <div className="n5g-alert warn" role="alert">
              <AlertTriangle size={18} />
              <div>
                <strong>
                  {GATE_QUESTIONS.length - answeredCount} question(s) are still unanswered.
                </strong>{' '}
                Unanswered items score 0 marks and trigger leak remediation. Click{' '}
                <strong>Lock &amp; Submit Gate 01</strong> again to confirm locking now, or complete
                the remaining questions above.
              </div>
            </div>
          )}

          <div className="n5g-panel">
            <div className="button-row" style={{ justifyContent: 'space-between' }}>
              <span className="compact muted">
                {answeredCount === GATE_QUESTIONS.length
                  ? 'All 12 questions answered. Ready to lock and score.'
                  : `${answeredCount} of ${GATE_QUESTIONS.length} answered (minimum 6 required to submit early).`}
              </span>
              <button
                className="btn primary"
                type="button"
                disabled={answeredCount < Math.ceil(GATE_QUESTIONS.length / 2)}
                onClick={handleSubmitLockedGate}
              >
                <Lock size={16} />
                {confirmEarlySubmit ? 'Confirm Lock & Submit Gate 01' : 'Lock & Submit Gate 01'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* STAGE 4: RUBRIC & LEAK REPORT */}
      {stage === 'diagnostics' && record?.result && (
        <section className="n5g-panel stack" aria-labelledby="n5g-diag-heading">
          <div className="n5g-score-hero">
            <div>
              <div className="eyebrow" style={{ color: '#ffcb8d' }}>
                STAGE 2 · RUBRIC &amp; LEAK REPORT
              </div>
              <h2 id="n5g-diag-heading">
                {record.result.score}/{record.result.total} Net Marks ({record.result.percent}%)
              </h2>
              <p>
                Raw score: {record.result.rawScore}/{record.result.total}
                {record.result.deductionTotal > 0
                  ? ` · Critical-leak deductions: -${record.result.deductionTotal} marks`
                  : ' · No critical-leak deductions'}
                {record.timedOut ? ' · Auto-submitted at 50:00 timeout' : ''}
              </p>
            </div>
            <div>
              <span
                className={`n5g-band-pill ${String(record.result.readinessBand || 'critical').replace(/_/g, '-')}`}
              >
                Readiness: {record.result.readinessLabel}
              </span>
            </div>
          </div>

          {record.result.deductions?.length > 0 && (
            <div className="n5g-alert warn">
              <AlertTriangle size={18} />
              <div>
                <strong>Critical-Leak Deductions Triggered (-5 each):</strong>{' '}
                {record.result.deductions
                  .map((d) => `${d.title} (-${d.points})`)
                  .join(' · ')}
              </div>
            </div>
          )}

          {record.result.overconfidentCount > 0 && (
            <div className="n5g-alert error">
              <AlertTriangle size={18} />
              <div>
                <strong>
                  {record.result.overconfidentCount} confident error
                  {record.result.overconfidentCount > 1 ? 's' : ''} detected:
                </strong>{' '}
                You marked &ldquo;Certain&rdquo; on {record.result.overconfidentCount} missed
                question{record.result.overconfidentCount > 1 ? 's' : ''}. Slow down to verify
                before executing.
              </div>
            </div>
          )}

          <div>
            <h3>5-Dimension Rubric Breakdown</h3>
            <div className="n5g-rubric-grid">
              {Object.values(record.result.rubricScores || {}).map((item) => (
                <div className="n5g-rubric-card" key={item.code}>
                  <div className="n5g-rubric-head">
                    <strong>{item.title}</strong>
                    <span>
                      {item.earned}/{item.possible} ({item.percent}%)
                    </span>
                  </div>
                  <div className="n5g-rubric-bar" aria-hidden="true">
                    <div className="n5g-rubric-fill" style={{ width: `${item.percent}%` }} />
                  </div>
                  <small className="muted">
                    {item.missedCount === 0
                      ? 'All criteria met'
                      : `${item.missedCount} item(s) missed in this dimension`}
                  </small>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3>Ranked Leak Profile &amp; Immediate Actions</h3>
            {record.result.recommendedLeaks?.length > 0 ? (
              <div className="stack" style={{ marginTop: 8 }}>
                {record.result.recommendedLeaks.map((leak, idx) => {
                  const guidance = LEAK_GUIDANCE[leak]
                  const count = record.result.leakCounts?.[leak] || 0
                  return (
                    <div className="n5g-leak-card" key={leak}>
                      <div className="n5g-question-head">
                        <strong>
                          #{idx + 1} · {guidance?.title || leak}
                        </strong>
                        <span className="pill neutral">{count} missed</span>
                      </div>
                      <p className="compact">{guidance?.action}</p>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="n5g-alert info" style={{ marginTop: 8 }}>
                <CheckCircle2 size={18} />
                <span>
                  Zero skill leaks detected! Complete the consolidation time-discipline check in the
                  next stage to seal your verification packet.
                </span>
              </div>
            )}
          </div>

          <details
            className="n5g-demo-details"
            open={showRationale}
            onToggle={(e) => setShowRationale(e.currentTarget.open)}
          >
            <summary>Question-by-question rationale review (12 items)</summary>
            <div className="stack" style={{ marginTop: 10 }}>
              {GATE_QUESTIONS.map((q, idx) => {
                const chosen = record.answers?.[q.id]
                const isCorrect = chosen === q.correctIndex
                return (
                  <article className="n5g-question-card" key={q.id}>
                    <div className="n5g-question-head">
                      <strong>
                        {idx + 1}. {q.prompt}
                      </strong>
                      <span className={isCorrect ? 'success-text' : 'error-text'}>
                        {isCorrect ? 'Correct' : 'Missed'}
                      </span>
                    </div>
                    <p className="compact">
                      <strong>Your answer:</strong>{' '}
                      {Number.isInteger(chosen) ? q.options[chosen] : 'Unanswered'}
                      {record.confidence?.[q.id] ? ` (${record.confidence[q.id]})` : ''}
                    </p>
                    {!isCorrect && (
                      <p className="compact">
                        <strong>Correct answer:</strong> {q.options[q.correctIndex]}
                      </p>
                    )}
                    <p className="compact muted">{q.rationale}</p>
                  </article>
                )
              })}
            </div>
          </details>

          <div className="button-row">
            <button className="btn primary" type="button" onClick={handleAcknowledgeDiagnostics}>
              Begin Targeted Recovery <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 5: TARGETED RECOVERY & PRACTICAL VERIFICATION */}
      {stage === 'recovery' && (
        <section className="n5g-panel stack" aria-labelledby="n5g-recovery-heading">
          <div>
            <div className="eyebrow">STAGE 3 · TARGETED RECOVERY &amp; EVIDENCE</div>
            <h2 id="n5g-recovery-heading">Repair your diagnosed leaks</h2>
            <p>
              Complete each assigned drill (write your own answer, reveal criteria, check off all
              criteria, and write a changed-facts correction), then confirm the Week 1 Class 1
              practical verification checks below.
            </p>
          </div>

          {drills.map((drill, idx) => {
            const attempt = record?.recovery?.drills?.[drill.id] || {}
            const points = Array.isArray(attempt.points) ? attempt.points : []
            const drillDone =
              attempt.revealed === true &&
              Boolean(String(attempt.answer || '').trim()) &&
              Boolean(String(attempt.correction || '').trim()) &&
              drill.answerPoints.every((_, pIdx) => points.includes(pIdx))

            return (
              <article className="n5g-drill-card" key={drill.id}>
                <div className="n5g-question-head">
                  <div>
                    <small className="muted">
                      Drill {idx + 1} of {drills.length} · {LEAK_GUIDANCE[drill.leak]?.title || drill.leak}
                    </small>
                    <h3>{drill.topic}</h3>
                  </div>
                  <span className="pill neutral">{drillDone ? 'Completed ✓' : 'In progress'}</span>
                </div>

                <p>{drill.text}</p>

                <label className="field" htmlFor={`drill-answer-${drill.id}`}>
                  <span>1. Write your independent answer before revealing criteria</span>
                  <textarea
                    id={`drill-answer-${drill.id}`}
                    value={attempt.answer || ''}
                    onChange={(e) =>
                      patchDrill(drill.id, {
                        answer: e.target.value,
                        revealed: false,
                        points: [],
                        correction: '',
                      })
                    }
                    placeholder="Explain the exact rule, formula, or sequence in your own words..."
                  />
                </label>

                <div>
                  <button
                    className="btn outline"
                    type="button"
                    disabled={!String(attempt.answer || '').trim()}
                    onClick={() => patchDrill(drill.id, { revealed: true })}
                  >
                    Reveal Criteria &amp; Explanation
                  </button>
                </div>

                {attempt.revealed && (
                  <div className="learning-callout">
                    <p>
                      <strong>Expected reasoning:</strong> {drill.explanation}
                    </p>
                    <div className="n5g-checklist" role="group" aria-label={`Criteria for ${drill.topic}`}>
                      {drill.answerPoints.map((pt, pIdx) => {
                        const checked = points.includes(pIdx)
                        return (
                          <label className="n5g-check-item" key={pIdx}>
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => {
                                const nextPoints = checked
                                  ? points.filter((x) => x !== pIdx)
                                  : [...points, pIdx]
                                patchDrill(drill.id, { points: nextPoints })
                              }}
                            />
                            <span>{pt.label}</span>
                          </label>
                        )
                      })}
                    </div>

                    <label className="field" htmlFor={`drill-correction-${drill.id}`}>
                      <span>2. Changed-facts correction (apply the rule to a new scenario)</span>
                      <textarea
                        id={`drill-correction-${drill.id}`}
                        value={attempt.correction || ''}
                        onChange={(e) => patchDrill(drill.id, { correction: e.target.value })}
                        placeholder="State how your answer stays valid when the target cell, filename, or requirement changes..."
                      />
                    </label>
                  </div>
                )}
              </article>
            )
          })}

          <div className="n5g-drill-card">
            <div className="eyebrow">WEEK 1 CLASS 1 VERIFICATION CHECK</div>
            <h3>Practical File &amp; Output Proof</h3>
            <p className="compact">
              Confirm all three Week 1 control checks, enter your verification summary (at least 10
              characters), and optionally attach a working file to this device.
            </p>

            <div className="n5g-checklist">
              {Object.values(PRACTICAL_PROOF_CHECKS).map((item) => {
                const checked = Boolean(record?.recovery?.checks?.[item.id])
                return (
                  <label className="n5g-check-item" key={item.id}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleProofCheck(item.id)}
                    />
                    <div>
                      <strong>{item.label}</strong>
                      <small>{item.detail}</small>
                    </div>
                  </label>
                )
              })}
            </div>

            <label className="field" htmlFor="n5g-proof-summary">
              <span>Written verification summary (min 10 characters)</span>
              <textarea
                id="n5g-proof-summary"
                value={record?.recovery?.proofSummary || ''}
                onChange={(e) => updateProofSummary(e.target.value)}
                placeholder="Describe the command verb, target filename, and how you reopened/verified your file..."
              />
            </label>

            <label className="field" htmlFor="n5g-evidence-upload">
              <span>Optional practical working file (saved in browser IndexedDB)</span>
              <input
                id="n5g-evidence-upload"
                type="file"
                disabled={fileBusy}
                onChange={handleAttachEvidenceFile}
              />
            </label>

            {record?.recovery?.evidenceFiles?.length > 0 && (
              <div className="stack">
                {record.recovery.evidenceFiles.map((fileItem) => (
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
                        <Download size={14} /> Download
                      </button>
                      <button
                        className="btn outline"
                        type="button"
                        onClick={() => handleRemoveEvidenceFile(fileItem.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="button-row" style={{ justifyContent: 'space-between' }}>
            <span className="compact muted">
              {recoveryReady
                ? 'All drills and verification checks complete.'
                : 'Complete all drills, all 3 verification checkboxes, and a 10+ char proof summary to continue.'}
            </span>
            <button
              className="btn primary"
              type="button"
              disabled={!recoveryReady}
              onClick={handleContinueToReassessment}
            >
              Continue to Verification Reassessment <ArrowRight size={16} />
            </button>
          </div>
        </section>
      )}

      {/* STAGE 6: FRESH REASSESSMENT & FINAL SUBMISSION */}
      {stage === 'reassessment' && (
        <section className="n5g-panel stack" aria-labelledby="n5g-reassess-heading">
          <div className="n5g-question-head">
            <div>
              <div className="eyebrow">STAGE 4 · FRESH VERIFICATION REASSESSMENT</div>
              <h2 id="n5g-reassess-heading">Confirm transfer on 3 fresh questions</h2>
              <p>
                These 3 unseen checks target your weak areas. Answer all 3, verify your score, then
                submit your final Gate 01 packet.
              </p>
            </div>
            {!record?.reassessment?.result && (
              <button className="btn outline" type="button" onClick={handleBackToRecovery}>
                Edit Recovery &amp; Evidence
              </button>
            )}
          </div>

          {!record?.reassessment?.result ? (
            <>
              {reassessmentQuestions.map((q, index) => {
                const selected = record?.reassessment?.answers?.[q.id]
                return (
                  <article className="n5g-question-card" key={q.id}>
                    <div className="n5g-question-head">
                      <span className="pill neutral">
                        Fresh Check {index + 1} of {reassessmentQuestions.length}
                      </span>
                      <span className="compact muted">
                        {LEAK_GUIDANCE[q.leak]?.title || q.leak}
                      </span>
                    </div>
                    <fieldset>
                      <legend>
                        {index + 1}. {q.prompt}
                      </legend>
                      <div className="stack">
                        {q.options.map((opt, optIdx) => {
                          const isChecked = selected === optIdx
                          return (
                            <label
                              key={optIdx}
                              className={`n5g-option ${isChecked ? 'selected' : ''}`}
                            >
                              <input
                                type="radio"
                                name={`re-${q.id}`}
                                checked={isChecked}
                                onChange={() => handleSelectReassessmentAnswer(q.id, optIdx)}
                              />
                              <span>{opt}</span>
                            </label>
                          )
                        })}
                      </div>
                    </fieldset>
                  </article>
                )
              })}

              <div className="button-row">
                <button
                  className="btn primary"
                  type="button"
                  disabled={
                    !reassessmentQuestions.every((q) =>
                      Number.isInteger(record?.reassessment?.answers?.[q.id])
                    )
                  }
                  onClick={handleVerifyReassessment}
                >
                  <FileCheck2 size={16} /> Verify Reassessment
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                className={`n5g-alert ${record.reassessment.result.passed ? 'info' : 'warn'}`}
              >
                {record.reassessment.result.passed ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertTriangle size={18} />
                )}
                <div>
                  <strong>
                    Reassessment Result: {record.reassessment.result.correct}/
                    {record.reassessment.result.total} correct (
                    {record.reassessment.result.passed
                      ? 'Verification Passed'
                      : 'Review Recommended'}
                    )
                  </strong>
                  <div className="compact">
                    {record.reassessment.result.passed
                      ? 'Your targeted recovery transferred cleanly to unseen questions.'
                      : 'Review the explanations below before locking your final submission packet.'}
                  </div>
                </div>
              </div>

              <div className="stack">
                {record.reassessment.result.details.map((item, idx) => {
                  const sourceQ = reassessmentQuestions.find((q) => q.id === item.id)
                  return (
                    <article className="n5g-question-card" key={item.id}>
                      <div className="n5g-question-head">
                        <strong>
                          {idx + 1}. {item.prompt}
                        </strong>
                        <span className={item.correct ? 'success-text' : 'error-text'}>
                          {item.correct ? 'Correct' : 'Missed'}
                        </span>
                      </div>
                      {sourceQ && (
                        <p className="compact">
                          <strong>Your answer:</strong> {sourceQ.options[item.selectedIndex]}
                          {!item.correct && (
                            <>
                              {' '}
                              · <strong>Expected:</strong> {sourceQ.options[item.correctIndex]}
                            </>
                          )}
                        </p>
                      )}
                      <p className="compact muted">{item.rationale}</p>
                    </article>
                  )
                })}
              </div>

              <div className="n5g-drill-card" aria-label="Final Submission Packet Review">
                <div className="eyebrow">FINAL SUBMISSION PACKET REVIEW</div>
                <h3>Ready to seal N5 Gate 01</h3>
                <div className="n5g-packet-grid">
                  <div className="n5g-packet-item">
                    <small>Student Identity</small>
                    <strong>
                      {session.firstName} {session.lastName} ({session.studentCode})
                    </strong>
                  </div>
                  <div className="n5g-packet-item">
                    <small>Gate 01 Score &amp; Readiness</small>
                    <strong>
                      {record.result.score}/{record.result.total} ({record.result.percent}%) ·{' '}
                      {record.result.readinessLabel}
                    </strong>
                  </div>
                  <div className="n5g-packet-item">
                    <small>Leaks Addressed</small>
                    <strong>
                      {record.result.recommendedLeaks?.length
                        ? record.result.recommendedLeaks.join(', ')
                        : 'None (100% accuracy)'}
                    </strong>
                  </div>
                  <div className="n5g-packet-item">
                    <small>Reassessment &amp; Evidence Files</small>
                    <strong>
                      {record.reassessment.result.correct}/{record.reassessment.result.total} ·{' '}
                      {record.recovery?.evidenceFiles?.length
                        ? record.recovery.evidenceFiles.map((f) => f.file).join(', ')
                        : 'Summary check only'}
                    </strong>
                  </div>
                </div>
                <div className="n5g-packet-item">
                  <small>Recovery Verification Summary</small>
                  <p className="compact prewrap">{record.recovery?.proofSummary}</p>
                </div>

                <div className="button-row" style={{ marginTop: 6 }}>
                  <button
                    className="btn primary"
                    type="button"
                    disabled={finalBusy}
                    onClick={handleFinalizeSubmission}
                  >
                    <ShieldCheck size={17} />
                    {finalBusy ? 'Generating SHA-256 Receipt...' : 'Submit N5 Gate 01'}
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {/* STAGE 7: LOCKED SUBMISSION RECEIPT */}
      {stage === 'submitted' && record?.finalSubmission && (
        <section className="n5g-receipt-card" aria-labelledby="n5g-submitted-heading">
          <div className="n5g-question-head">
            <div>
              <div className="eyebrow">
                <Sparkles size={13} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                STAGE 5 · CONFIRMED SUBMISSION RECEIPT
              </div>
              <h2 id="n5g-submitted-heading">N5 Gate 01 Submitted &amp; Locked</h2>
              <p className="compact">
                Reference <strong>{record.finalSubmission.referenceId}</strong> ·{' '}
                {new Date(record.finalSubmission.submittedAt).toLocaleString()}
              </p>
            </div>
            <span className="n5g-band-pill exam-ready">
              <CheckCircle2 size={15} /> Sealed
            </span>
          </div>

          <div className="n5g-packet-grid">
            <div className="n5g-packet-item">
              <small>Learner</small>
              <strong>
                {record.finalSubmission.studentName} ({record.finalSubmission.studentCode})
              </strong>
            </div>
            <div className="n5g-packet-item">
              <small>Gate 01 Score</small>
              <strong>
                {record.finalSubmission.gateScore}/{record.finalSubmission.gateTotal} (
                {record.finalSubmission.gatePercent}%) · {record.finalSubmission.readinessLabel}
              </strong>
            </div>
            <div className="n5g-packet-item">
              <small>Verification Reassessment</small>
              <strong>{record.finalSubmission.reassessmentScore}</strong>
            </div>
            <div className="n5g-packet-item">
              <small>Leaks Addressed</small>
              <strong>
                {record.finalSubmission.leaksAddressed?.length
                  ? record.finalSubmission.leaksAddressed.join(', ')
                  : 'None (100% accuracy)'}
              </strong>
            </div>
          </div>

          <div className="n5g-packet-item">
            <small>Evidence Checklist &amp; Proof Summary</small>
            <p className="compact prewrap">{record.finalSubmission.proofSummary}</p>
            <p className="compact muted" style={{ marginTop: 6 }}>
              Attached files:{' '}
              {record.finalSubmission.evidenceFiles?.length
                ? record.finalSubmission.evidenceFiles.join(', ')
                : 'None attached'}
            </p>
          </div>

          <div>
            <small className="muted">Verification Digest (SHA-256)</small>
            <div className="n5g-digest">{record.finalSubmission.digest}</div>
          </div>

          <div className="button-row">
            <button className="btn primary" type="button" onClick={handleDownloadReceipt}>
              <Download size={16} /> Download Submission Receipt (.txt)
            </button>
            <button className="btn outline" type="button" onClick={handleDownloadFullPacket}>
              <FileText size={16} /> Download Full Gate Packet (.json)
            </button>
            <button className="btn outline" type="button" onClick={handleSignOut}>
              <LogOut size={16} /> Sign out / Switch learner
            </button>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: 12 }}>
            {!confirmResetCycle ? (
              <button
                className="btn text-button"
                type="button"
                onClick={() => setConfirmResetCycle(true)}
              >
                <RefreshCw size={14} /> Start fresh practice cycle
              </button>
            ) : (
              <div className="n5g-alert warn">
                <AlertTriangle size={17} />
                <div style={{ flex: 1 }}>
                  <strong>Start a fresh practice cycle?</strong>
                  <div className="compact">
                    Download your receipt first. Starting a fresh cycle clears this Gate 01 receipt
                    for {session.studentCode} on this device.
                  </div>
                  <div className="button-row" style={{ marginTop: 8 }}>
                    <button
                      className="btn primary"
                      type="button"
                      onClick={handleResetFreshCycle}
                    >
                      Confirm Fresh Cycle
                    </button>
                    <button
                      className="btn outline"
                      type="button"
                      onClick={() => setConfirmResetCycle(false)}
                    >
                      Keep Receipt
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

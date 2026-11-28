import test from 'node:test'
import assert from 'node:assert/strict'

import { TOPIC2_MODULES, TOPIC2_TITLE } from '../src/topic2-data.js'
import {
  TOPIC2_STORAGE_KEY,
  computeTopic2Summary,
  createInitialTopic2Store,
  evaluateQuickCheck,
  formatTopic2SummaryText,
  getOwnerTopic2Progress,
  getTopic2OwnerKey,
  initialModuleProgress,
  isTopic2ModuleComplete,
  readTopic2Store,
  writeTopic2Store,
} from '../src/topic2-engine.js'

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

function buildCompletedModuleProgress(moduleDef, files = ['topic2-proof.pdf']) {
  const answers = Object.fromEntries(
    moduleDef.quickCheck.map((q) => [q.id, q.correctIndex])
  )
  const checklist = Object.fromEntries(
    moduleDef.evidenceTask.checklist.map((item) => [item.id, true])
  )
  return {
    quickCheckAnswers: answers,
    quickCheckResult: evaluateQuickCheck(moduleDef, answers),
    evidenceNotes: 'Identified clue, named concept, and justified using textbook keywords.',
    checklist,
    evidenceFiles: files,
    completedAt: 1700000000000,
  }
}

test('TOPIC2_MODULES contains all 6 ordered modules (4 wave1 + 2 wave2) with 18 unique quickCheck questions', () => {
  assert.equal(TOPIC2_TITLE, 'CPN5 Topic 2 · Networking & Communication Skills')
  assert.equal(TOPIC2_MODULES.length, 6)

  const expectedOrder = [
    ['topic2-section1a', '1A', 'wave1', 'classification', 'THEORY_RECALL'],
    ['topic2-section1b', '1B', 'wave1', 'architecture', 'THEORY_RECALL'],
    ['topic2-section2a', '2A', 'wave1', 'digital-era', 'INSTRUCTION_CONTROL'],
    ['topic2-section2b', '2B', 'wave1', 'digital-era', 'INSTRUCTION_CONTROL'],
    ['topic2-section3', '3', 'wave2', 'consolidation', 'TIME_DISCIPLINE'],
    ['topic2-mastery', 'Mastery', 'wave2', 'consolidation', 'TIME_DISCIPLINE'],
  ]

  assert.deepEqual(
    TOPIC2_MODULES.map((m) => [m.id, m.sectionCode, m.releaseScope, m.category, m.leakCode]),
    expectedOrder
  )

  const wave1Modules = TOPIC2_MODULES.filter((m) => m.releaseScope === 'wave1')
  const wave2Modules = TOPIC2_MODULES.filter((m) => m.releaseScope === 'wave2')
  assert.equal(wave1Modules.length, 4)
  assert.equal(wave2Modules.length, 2)

  const moduleIds = new Set()
  const questionIds = new Set()

  for (const mod of TOPIC2_MODULES) {
    assert.ok(!moduleIds.has(mod.id), `Duplicate module id: ${mod.id}`)
    moduleIds.add(mod.id)

    assert.ok(typeof mod.title === 'string' && mod.title.trim().length > 0)
    assert.ok(typeof mod.nextAction === 'string' && mod.nextAction.trim().length > 0)
    assert.ok(typeof mod.cbtTip === 'string' && mod.cbtTip.trim().length > 0)

    assert.ok(typeof mod.concept?.summary === 'string' && mod.concept.summary.trim().length > 0)
    assert.equal(mod.concept?.keyPoints?.length, 4, `${mod.id} concept.keyPoints must have 4 items`)

    assert.equal(mod.triggerTable?.length, 4, `${mod.id} triggerTable must have 4 rows`)
    for (const row of mod.triggerTable) {
      assert.ok(typeof row.contrast === 'string' && row.contrast.trim().length > 0)
      assert.ok(typeof row.rule === 'string' && row.rule.trim().length > 0)
    }

    assert.ok(typeof mod.guidedPractice?.title === 'string' && mod.guidedPractice.title.trim().length > 0)
    assert.ok(typeof mod.guidedPractice?.scenario === 'string' && mod.guidedPractice.scenario.trim().length > 0)
    assert.equal(mod.guidedPractice?.steps?.length, 4, `${mod.id} guidedPractice steps must have 4 items`)

    assert.equal(mod.quickCheck.length, 3, `${mod.id} must have 3 quickCheck questions`)
    for (const q of mod.quickCheck) {
      assert.ok(typeof q.id === 'string' && q.id.trim().length > 0)
      assert.ok(!questionIds.has(q.id), `Duplicate quickCheck question id: ${q.id}`)
      questionIds.add(q.id)

      assert.ok(typeof q.prompt === 'string' && q.prompt.trim().length > 0)
      assert.ok(Array.isArray(q.options) && q.options.length === 4, `${q.id} must have 4 options`)
      for (const opt of q.options) {
        assert.ok(typeof opt === 'string' && opt.trim().length > 0)
      }
      assert.ok(
        Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3,
        `${q.id} invalid correctIndex`
      )
      assert.ok(typeof q.rationale === 'string' && q.rationale.trim().length > 0, `${q.id} missing rationale`)
      assert.ok(typeof q.leak === 'string' && q.leak.trim().length > 0, `${q.id} missing leak`)
    }

    assert.ok(typeof mod.evidenceTask?.prompt === 'string' && mod.evidenceTask.prompt.trim().length > 0)
    assert.ok(Array.isArray(mod.evidenceTask?.deliverables) && mod.evidenceTask.deliverables.length >= 1)
    assert.equal(mod.evidenceTask?.checklist?.length, 3, `${mod.id} checklist must have 3 items`)
    const checklistIds = new Set(mod.evidenceTask.checklist.map((item) => item.id))
    assert.equal(checklistIds.size, 3, `${mod.id} checklist ids must be unique`)
    for (const item of mod.evidenceTask.checklist) {
      assert.ok(typeof item.id === 'string' && item.id.trim().length > 0)
      assert.ok(typeof item.label === 'string' && item.label.trim().length > 0)
    }
  }

  assert.equal(questionIds.size, 18)
})

test('evaluateQuickCheck accurately scores 0/3, 1/3 (fail), 2/3 (pass), 3/3 (pass), and invalid inputs', () => {
  const mod = TOPIC2_MODULES[0]
  const [q1, q2, q3] = mod.quickCheck
  const wrongIndex = (idx) => (idx + 1) % 4

  const zeroResult = evaluateQuickCheck(mod, {
    [q1.id]: wrongIndex(q1.correctIndex),
    [q2.id]: wrongIndex(q2.correctIndex),
    [q3.id]: wrongIndex(q3.correctIndex),
  })
  assert.equal(zeroResult.correct, 0)
  assert.equal(zeroResult.total, 3)
  assert.equal(zeroResult.percent, 0)
  assert.equal(zeroResult.passed, false)

  const failOneOfThree = evaluateQuickCheck(mod, {
    [q1.id]: q1.correctIndex,
    [q2.id]: wrongIndex(q2.correctIndex),
    [q3.id]: -1,
  })
  assert.equal(failOneOfThree.correct, 1)
  assert.equal(failOneOfThree.total, 3)
  assert.equal(failOneOfThree.percent, 33)
  assert.equal(failOneOfThree.passed, false)
  assert.equal(failOneOfThree.details[2].selectedIndex, null)

  const passTwoOfThree = evaluateQuickCheck(mod, {
    [q1.id]: q1.correctIndex,
    [q2.id]: q2.correctIndex,
    [q3.id]: wrongIndex(q3.correctIndex),
  })
  assert.equal(passTwoOfThree.correct, 2)
  assert.equal(passTwoOfThree.total, 3)
  assert.equal(passTwoOfThree.percent, 67)
  assert.equal(passTwoOfThree.passed, true)

  const passFull = evaluateQuickCheck(mod, {
    [q1.id]: q1.correctIndex,
    [q2.id]: q2.correctIndex,
    [q3.id]: q3.correctIndex,
  })
  assert.equal(passFull.correct, 3)
  assert.equal(passFull.total, 3)
  assert.equal(passFull.percent, 100)
  assert.equal(passFull.passed, true)

  assert.deepEqual(evaluateQuickCheck(null, null), {
    correct: 0,
    total: 0,
    percent: 0,
    passed: false,
    details: [],
  })
})

test('isTopic2ModuleComplete enforces Quick Check pass, all 3 checklist boxes, and 10+ char evidence notes', () => {
  const mod = TOPIC2_MODULES[1]
  const base = buildCompletedModuleProgress(mod)
  assert.equal(isTopic2ModuleComplete(mod, base), true)

  assert.equal(
    isTopic2ModuleComplete(mod, { ...base, quickCheckResult: null }),
    false
  )
  assert.equal(
    isTopic2ModuleComplete(mod, {
      ...base,
      quickCheckResult: { ...base.quickCheckResult, passed: false },
    }),
    false
  )

  const missingCheck = {
    ...base.checklist,
    [mod.evidenceTask.checklist[2].id]: false,
  }
  assert.equal(
    isTopic2ModuleComplete(mod, { ...base, checklist: missingCheck }),
    false
  )

  assert.equal(
    isTopic2ModuleComplete(mod, { ...base, evidenceNotes: '   short99   ' }),
    false
  )
  assert.equal(
    isTopic2ModuleComplete(mod, { ...base, evidenceNotes: '  1234567890  ' }),
    true
  )
})

test('computeTopic2Summary and formatTopic2SummaryText aggregate Wave 1 (4/4) and total (6/6) completion accurately', () => {
  const emptySummary = computeTopic2Summary(undefined)
  assert.deepEqual(emptySummary, {
    totalModules: 6,
    wave1Total: 4,
    wave1Completed: 0,
    completedModules: 0,
    percent: 0,
    quickChecksPassed: 0,
    evidenceFilesCount: 0,
    readyForConsolidation: false,
  })

  const emptyReport = formatTopic2SummaryText('', undefined)
  assert.ok(emptyReport.includes(TOPIC2_TITLE.toUpperCase()))
  assert.ok(emptyReport.includes('Local Learner'))
  assert.ok(emptyReport.includes('0/6 modules (0%)'))
  assert.ok(emptyReport.includes('Wave 1 Progress: 0/4 modules'))

  // Complete all 4 Wave 1 modules
  const wave1Progress = {}
  for (const mod of TOPIC2_MODULES.filter((m) => m.releaseScope === 'wave1')) {
    wave1Progress[mod.id] = buildCompletedModuleProgress(mod, [`${mod.sectionCode}-evidence.pdf`])
  }

  const wave1Summary = computeTopic2Summary({ modules: wave1Progress })
  assert.deepEqual(wave1Summary, {
    totalModules: 6,
    wave1Total: 4,
    wave1Completed: 4,
    completedModules: 4,
    percent: 67,
    quickChecksPassed: 4,
    evidenceFilesCount: 4,
    readyForConsolidation: true,
  })

  const wave1Report = formatTopic2SummaryText('Thabo Ndlovu (N5-204)', { modules: wave1Progress })
  assert.ok(wave1Report.includes('Learner: Thabo Ndlovu (N5-204)'))
  assert.ok(wave1Report.includes('4/6 modules (67%)'))
  assert.ok(wave1Report.includes('Wave 1 Progress: 4/4 modules'))
  assert.ok(wave1Report.includes(': Ready'))
  assert.ok(wave1Report.includes('[Section 1A · wave1] Network Types and Coverage — Complete'))
  assert.ok(wave1Report.includes('[Section 3 · wave2] Topic 2 Consolidation & Revision Map — Not Started'))

  // Complete all 6 modules
  const allProgress = { ...wave1Progress }
  for (const mod of TOPIC2_MODULES.filter((m) => m.releaseScope === 'wave2')) {
    allProgress[mod.id] = buildCompletedModuleProgress(mod, [`${mod.sectionCode}-a.pdf`, `${mod.sectionCode}-b.pdf`])
  }

  const fullSummary = computeTopic2Summary({ modules: allProgress })
  assert.deepEqual(fullSummary, {
    totalModules: 6,
    wave1Total: 4,
    wave1Completed: 4,
    completedModules: 6,
    percent: 100,
    quickChecksPassed: 6,
    evidenceFilesCount: 8,
    readyForConsolidation: true,
  })

  const fullReport = formatTopic2SummaryText('Thabo Ndlovu (N5-204)', { modules: allProgress })
  assert.ok(fullReport.includes('6/6 modules (100%)'))
  assert.ok(fullReport.includes('[Section Mastery · wave2] Networking & Communication Mastery (150 Marks) — Complete'))
})

test('Topic 2 storage helpers handle corrupt JSON, missing storage, and owner progress gracefully', () => {
  assert.equal(TOPIC2_STORAGE_KEY, 'sankofa-n5-topic2-v1')
  assert.equal(getTopic2OwnerKey(null), 'local-learner')
  assert.equal(getTopic2OwnerKey({ session: {} }), 'local-learner')
  assert.equal(getTopic2OwnerKey({ session: { studentCode: ' N5-202 ' } }), 'N5-202')

  const failingStorage = {
    getItem: () => '{invalid-json',
    setItem: () => {
      throw new Error('QuotaExceededError')
    },
  }
  assert.deepEqual(readTopic2Store(failingStorage), createInitialTopic2Store())
  assert.equal(writeTopic2Store(createInitialTopic2Store(), failingStorage), false)

  const nonObjectStorage = {
    getItem: () => '"not-an-object"',
    setItem: () => {},
  }
  assert.deepEqual(readTopic2Store(nonObjectStorage), createInitialTopic2Store())
  assert.deepEqual(readTopic2Store(null), createInitialTopic2Store())
  assert.equal(writeTopic2Store({}, null), false)

  const mem = createMemoryStorage()
  const store = createInitialTopic2Store()
  const ownerKey = getTopic2OwnerKey({ session: { studentCode: 'N5-205' } })
  const mod = TOPIC2_MODULES[3]
  store.byOwner[ownerKey] = {
    modules: {
      [mod.id]: buildCompletedModuleProgress(mod),
    },
  }

  assert.equal(writeTopic2Store(store, mem), true)
  const loaded = readTopic2Store(mem)
  const ownerProgress = getOwnerTopic2Progress(loaded, ownerKey)
  assert.equal(isTopic2ModuleComplete(mod, ownerProgress.modules[mod.id]), true)
  assert.deepEqual(getOwnerTopic2Progress(loaded, 'N5-999'), { modules: {} })
  assert.deepEqual(initialModuleProgress(), {
    quickCheckAnswers: {},
    quickCheckResult: null,
    evidenceNotes: '',
    checklist: {},
    evidenceFiles: [],
    completedAt: null,
  })
})

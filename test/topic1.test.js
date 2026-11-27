import test from 'node:test'
import assert from 'node:assert/strict'

import { TOPIC1_MODULES, TOPIC1_TITLE } from '../src/topic1-data.js'
import {
  TOPIC1_STORAGE_KEY,
  computeTopic1Summary,
  createInitialTopic1Store,
  evaluateQuickCheck,
  formatTopic1SummaryText,
  getOwnerTopic1Progress,
  getTopic1OwnerKey,
  initialModuleProgress,
  isTopic1ModuleComplete,
  readTopic1Store,
  writeTopic1Store,
} from '../src/topic1-engine.js'

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

function buildCompletedModuleProgress(moduleDef, files = ['proof.pdf']) {
  const answers = Object.fromEntries(
    moduleDef.quickCheck.map((q) => [q.id, q.correctIndex])
  )
  const checklist = Object.fromEntries(
    moduleDef.evidenceTask.checklist.map((item) => [item.id, true])
  )
  return {
    quickCheckAnswers: answers,
    quickCheckResult: evaluateQuickCheck(moduleDef, answers),
    evidenceNotes: 'Verified output, path, and tool choice cleanly.',
    checklist,
    evidenceFiles: files,
    completedAt: 1700000000000,
  }
}

test('TOPIC1_MODULES contains all 13 ordered modules with valid metadata and 39 quickCheck questions', () => {
  assert.equal(TOPIC1_TITLE, 'CPN5 Topic 1 · Computing Concepts & Application Skills')
  assert.equal(TOPIC1_MODULES.length, 13)

  const expectedOrder = [
    ['topic1-section1', '1', 'wave1', 'theory', 'THEORY_RECALL'],
    ['topic1-section2', '2', 'wave1', 'theory', 'THEORY_RECALL'],
    ['topic1-section3', '3', 'wave1', 'files', 'FILE_MGMT'],
    ['topic1-section4a', '4A', 'wave1', 'word', 'WORD_LAYOUT'],
    ['topic1-section4b', '4B', 'wave1', 'word', 'WORD_LAYOUT'],
    ['topic1-section4c', '4C', 'wave1', 'word', 'WORD_LAYOUT'],
    ['topic1-section5', '5', 'wave1', 'word', 'MAIL_MERGE'],
    ['topic1-section6a', '6A', 'wave1', 'excel', 'EXCEL_FUNCTIONS'],
    ['topic1-section6b', '6B', 'wave1', 'excel', 'SORT_FILTER'],
    ['topic1-section6c', '6C', 'wave1', 'excel', 'EXCEL_REFERENCING'],
    ['topic1-section7a', '7A', 'wave1', 'integration', 'NOTEBOOK_WORKFLOW'],
    ['topic1-section7b', '7B', 'wave1', 'integration', 'INTEGRATION_CONTROL'],
    ['topic1-section8', '8', 'wave2', 'consolidation', 'INSTRUCTION_CONTROL'],
  ]

  assert.deepEqual(
    TOPIC1_MODULES.map((m) => [m.id, m.sectionCode, m.releaseScope, m.category, m.leakCode]),
    expectedOrder
  )

  const wave1Modules = TOPIC1_MODULES.filter((m) => m.releaseScope === 'wave1')
  const wave2Modules = TOPIC1_MODULES.filter((m) => m.releaseScope === 'wave2')
  assert.equal(wave1Modules.length, 12)
  assert.equal(wave2Modules.length, 1)
  assert.equal(wave2Modules[0].sectionCode, '8')

  const moduleIds = new Set()
  const questionIds = new Set()

  for (const mod of TOPIC1_MODULES) {
    assert.ok(!moduleIds.has(mod.id), `Duplicate module id: ${mod.id}`)
    moduleIds.add(mod.id)

    assert.ok(typeof mod.title === 'string' && mod.title.trim().length > 0)
    assert.ok(typeof mod.nextAction === 'string' && mod.nextAction.trim().length > 0)
    assert.ok(typeof mod.cbtTip === 'string' && mod.cbtTip.trim().length > 0)

    assert.ok(typeof mod.concept?.summary === 'string' && mod.concept.summary.trim().length > 0)
    assert.ok(Array.isArray(mod.concept?.keyPoints) && mod.concept.keyPoints.length >= 3)

    assert.ok(Array.isArray(mod.triggerTable) && mod.triggerTable.length >= 3, `${mod.id} triggerTable < 3`)
    for (const row of mod.triggerTable) {
      assert.ok(typeof row.contrast === 'string' && row.contrast.trim().length > 0)
      assert.ok(typeof row.rule === 'string' && row.rule.trim().length > 0)
    }

    assert.ok(typeof mod.guidedPractice?.title === 'string' && mod.guidedPractice.title.trim().length > 0)
    assert.ok(typeof mod.guidedPractice?.scenario === 'string' && mod.guidedPractice.scenario.trim().length > 0)
    assert.ok(
      Array.isArray(mod.guidedPractice?.steps) &&
      mod.guidedPractice.steps.length >= 3 &&
      mod.guidedPractice.steps.length <= 5,
      `${mod.id} guidedPractice steps must be 3-5`
    )

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

  assert.equal(questionIds.size, 39)
})

test('evaluateQuickCheck accurately scores 0/3, partial 1/3, passing 2/3, full 3/3, and invalid inputs', () => {
  const mod = TOPIC1_MODULES[0]
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
  assert.equal(zeroResult.details.length, 3)
  assert.equal(zeroResult.details[0].correct, false)

  const partialResult = evaluateQuickCheck(mod, {
    [q1.id]: q1.correctIndex,
    [q2.id]: wrongIndex(q2.correctIndex),
    [q3.id]: 99,
  })
  assert.equal(partialResult.correct, 1)
  assert.equal(partialResult.total, 3)
  assert.equal(partialResult.percent, 33)
  assert.equal(partialResult.passed, false)
  assert.equal(partialResult.details[0].correct, true)
  assert.equal(partialResult.details[2].selectedIndex, null)
  assert.equal(partialResult.details[2].correct, false)

  const passResult = evaluateQuickCheck(mod, {
    [q1.id]: q1.correctIndex,
    [q2.id]: q2.correctIndex,
    [q3.id]: wrongIndex(q3.correctIndex),
  })
  assert.equal(passResult.correct, 2)
  assert.equal(passResult.total, 3)
  assert.equal(passResult.percent, 67)
  assert.equal(passResult.passed, true)

  const fullResult = evaluateQuickCheck(mod, {
    [q1.id]: q1.correctIndex,
    [q2.id]: q2.correctIndex,
    [q3.id]: q3.correctIndex,
  })
  assert.equal(fullResult.correct, 3)
  assert.equal(fullResult.total, 3)
  assert.equal(fullResult.percent, 100)
  assert.equal(fullResult.passed, true)
  assert.equal(fullResult.details[0].rationale, q1.rationale)
  assert.equal(fullResult.details[0].leak, q1.leak)

  const emptyResult = evaluateQuickCheck(null, null)
  assert.deepEqual(emptyResult, {
    correct: 0,
    total: 0,
    percent: 0,
    passed: false,
    details: [],
  })
})

test('isTopic1ModuleComplete enforces quick-check pass, all 3 checklist boxes, and 10+ char evidence notes', () => {
  const mod = TOPIC1_MODULES[2]
  const base = buildCompletedModuleProgress(mod)
  assert.equal(isTopic1ModuleComplete(mod, base), true)

  // Missing or failed quick check
  assert.equal(
    isTopic1ModuleComplete(mod, { ...base, quickCheckResult: null }),
    false
  )
  assert.equal(
    isTopic1ModuleComplete(mod, {
      ...base,
      quickCheckResult: { ...base.quickCheckResult, passed: false },
    }),
    false
  )

  // Missing one checklist item
  const oneUnchecked = {
    ...base.checklist,
    [mod.evidenceTask.checklist[1].id]: false,
  }
  assert.equal(
    isTopic1ModuleComplete(mod, { ...base, checklist: oneUnchecked }),
    false
  )

  // Notes under 10 trimmed characters
  assert.equal(
    isTopic1ModuleComplete(mod, { ...base, evidenceNotes: '   123456789   ' }),
    false
  )
  assert.equal(
    isTopic1ModuleComplete(mod, { ...base, evidenceNotes: '  1234567890  ' }),
    true
  )
})

test('computeTopic1Summary and formatTopic1SummaryText aggregate Wave 1 completion and evidence files cleanly', () => {
  const emptySummary = computeTopic1Summary(undefined)
  assert.deepEqual(emptySummary, {
    totalModules: 13,
    wave1Total: 12,
    wave1Completed: 0,
    completedModules: 0,
    percent: 0,
    quickChecksPassed: 0,
    evidenceFilesCount: 0,
    readyForConsolidation: false,
  })

  const emptyReport = formatTopic1SummaryText('', undefined)
  assert.ok(emptyReport.includes(TOPIC1_TITLE.toUpperCase()))
  assert.ok(emptyReport.includes('Local Learner'))
  assert.ok(emptyReport.includes('0/13 modules (0%)'))
  assert.ok(emptyReport.includes('Wave 1 Progress: 0/12 modules'))
  assert.ok(emptyReport.includes('In Progress'))

  // Complete 2 Wave 1 modules + pass quick check only on a 3rd
  const partialModules = {
    [TOPIC1_MODULES[0].id]: buildCompletedModuleProgress(TOPIC1_MODULES[0], ['s1-ladder.docx']),
    [TOPIC1_MODULES[1].id]: buildCompletedModuleProgress(TOPIC1_MODULES[1], ['s2-table.docx', 's2-notes.txt']),
    [TOPIC1_MODULES[2].id]: {
      ...initialModuleProgress(),
      quickCheckResult: evaluateQuickCheck(TOPIC1_MODULES[2], {
        [TOPIC1_MODULES[2].quickCheck[0].id]: TOPIC1_MODULES[2].quickCheck[0].correctIndex,
        [TOPIC1_MODULES[2].quickCheck[1].id]: TOPIC1_MODULES[2].quickCheck[1].correctIndex,
      }),
      evidenceFiles: [{ name: 'folder-tree.png' }],
    },
  }

  const partialSummary = computeTopic1Summary({ modules: partialModules })
  assert.deepEqual(partialSummary, {
    totalModules: 13,
    wave1Total: 12,
    wave1Completed: 2,
    completedModules: 2,
    percent: 15,
    quickChecksPassed: 3,
    evidenceFilesCount: 4,
    readyForConsolidation: false,
  })

  // Complete all 12 Wave 1 modules -> readyForConsolidation becomes true
  const allWave1Modules = {}
  for (const mod of TOPIC1_MODULES.filter((m) => m.releaseScope === 'wave1')) {
    allWave1Modules[mod.id] = buildCompletedModuleProgress(mod, [`${mod.sectionCode}-proof.pdf`])
  }

  const readySummary = computeTopic1Summary({ modules: allWave1Modules })
  assert.equal(readySummary.wave1Total, 12)
  assert.equal(readySummary.wave1Completed, 12)
  assert.equal(readySummary.completedModules, 12)
  assert.equal(readySummary.percent, 92)
  assert.equal(readySummary.quickChecksPassed, 12)
  assert.equal(readySummary.evidenceFilesCount, 12)
  assert.equal(readySummary.readyForConsolidation, true)

  const report = formatTopic1SummaryText('Lerato Mokoena (N5-101)', { modules: allWave1Modules })
  assert.ok(report.includes('Learner: Lerato Mokoena (N5-101)'))
  assert.ok(report.includes('12/13 modules (92%)'))
  assert.ok(report.includes('Wave 1 Progress: 12/12 modules'))
  assert.ok(report.includes('Consolidation Readiness (Section 8): Ready'))
  assert.ok(report.includes('[Section 5 · wave1] Mail Merge and External Data Integration — Complete'))
  assert.ok(report.includes('[Section 8 · wave2] Topic 1 Consolidation and Exam Readiness — Not Started'))
})

test('storage helpers handle corrupt JSON, missing storage, and owner progress safely', () => {
  assert.equal(TOPIC1_STORAGE_KEY, 'sankofa-n5-topic1-v1')
  assert.equal(getTopic1OwnerKey(null), 'local-learner')
  assert.equal(getTopic1OwnerKey({ session: {} }), 'local-learner')
  assert.equal(getTopic1OwnerKey({ session: { studentCode: ' N5-101 ' } }), 'N5-101')

  const corruptStorage = {
    getItem: () => '{broken-json',
    setItem: () => {
      throw new Error('Quota exceeded')
    },
  }
  assert.deepEqual(readTopic1Store(corruptStorage), createInitialTopic1Store())
  assert.equal(writeTopic1Store(createInitialTopic1Store(), corruptStorage), false)

  const arrayStorage = {
    getItem: () => '["unexpected"]',
    setItem: () => {},
  }
  assert.deepEqual(readTopic1Store(arrayStorage), createInitialTopic1Store())
  assert.deepEqual(readTopic1Store(null), createInitialTopic1Store())
  assert.equal(writeTopic1Store({}, null), false)

  const mem = createMemoryStorage()
  const store = createInitialTopic1Store()
  const ownerKey = getTopic1OwnerKey({ session: { studentCode: 'N5-103' } })
  const mod = TOPIC1_MODULES[6]
  store.byOwner[ownerKey] = {
    modules: {
      [mod.id]: buildCompletedModuleProgress(mod),
    },
  }

  assert.equal(writeTopic1Store(store, mem), true)
  const loaded = readTopic1Store(mem)
  const ownerProgress = getOwnerTopic1Progress(loaded, ownerKey)
  assert.equal(isTopic1ModuleComplete(mod, ownerProgress.modules[mod.id]), true)
  assert.deepEqual(getOwnerTopic1Progress(loaded, 'N5-999'), { modules: {} })
  assert.deepEqual(initialModuleProgress(), {
    quickCheckAnswers: {},
    quickCheckResult: null,
    evidenceNotes: '',
    checklist: {},
    evidenceFiles: [],
    completedAt: null,
  })
})

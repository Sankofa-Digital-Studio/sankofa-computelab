import test from 'node:test'
import assert from 'node:assert/strict'

import { TOPIC3_MODULES, TOPIC3_TITLE } from '../src/topic3-data.js'
import {
  TOPIC3_STORAGE_KEY,
  computeTopic3Summary,
  createInitialTopic3Store,
  evaluateQuickCheck,
  formatTopic3SummaryText,
  getOwnerTopic3Progress,
  getTopic3OwnerKey,
  initialModuleProgress,
  isTopic3ModuleComplete,
  readTopic3Store,
  writeTopic3Store,
} from '../src/topic3-engine.js'

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

function buildCompletedModuleProgress(moduleDef, files = ['topic3-proof.xlsx']) {
  const answers = Object.fromEntries(moduleDef.quickCheck.map((q) => [q.id, q.correctIndex]))
  const checklist = Object.fromEntries(moduleDef.evidenceTask.checklist.map((item) => [item.id, true]))
  return {
    quickCheckAnswers: answers,
    quickCheckResult: evaluateQuickCheck(moduleDef, answers),
    evidenceNotes: 'Verified primary key, separated validation from verification, and checked totals.',
    checklist,
    evidenceFiles: files,
    completedAt: 1700000000000,
  }
}

test('TOPIC3_MODULES contains all 6 ordered modules (4 wave1 + 2 wave2) with 18 unique quickCheck questions', () => {
  assert.equal(TOPIC3_TITLE, 'CPN5 Topic 3 · Data, Information Management & Computational Thinking')
  assert.equal(TOPIC3_MODULES.length, 6)

  const expectedOrder = [
    ['topic3-section1', '1', 'wave1', 'data-lifecycle', 'THEORY_RECALL'],
    ['topic3-section2', '2', 'wave1', 'computational-thinking', 'INSTRUCTION_CONTROL'],
    ['topic3-section3', '3', 'wave1', 'database-structure', 'EXCEL_FUNCTIONS'],
    ['topic3-section4', '4', 'wave1', 'data-quality', 'VERIFICATION_DISCIPLINE'],
    ['topic3-consolidation', '5', 'wave2', 'consolidation', 'INTEGRATION_CONTROL'],
    ['topic3-mastery', 'Mastery', 'wave2', 'consolidation', 'TIME_DISCIPLINE'],
  ]

  assert.deepEqual(
    TOPIC3_MODULES.map((m) => [m.id, m.sectionCode, m.releaseScope, m.category, m.leakCode]),
    expectedOrder
  )

  const moduleIds = new Set()
  const questionIds = new Set()

  for (const mod of TOPIC3_MODULES) {
    assert.ok(!moduleIds.has(mod.id), `Duplicate module id: ${mod.id}`)
    moduleIds.add(mod.id)
    assert.equal(mod.concept?.keyPoints?.length, 4)
    assert.equal(mod.triggerTable?.length, 4)
    assert.equal(mod.guidedPractice?.steps?.length, 4)
    assert.equal(mod.quickCheck.length, 3)
    assert.equal(mod.evidenceTask?.checklist?.length, 3)

    for (const q of mod.quickCheck) {
      assert.ok(!questionIds.has(q.id), `Duplicate quickCheck question id: ${q.id}`)
      questionIds.add(q.id)
      assert.equal(q.options.length, 4)
      assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3)
      assert.ok(q.rationale.trim().length > 0)
      assert.ok(q.leak.trim().length > 0)
    }
  }

  assert.equal(questionIds.size, 18)
})

test('computeTopic3Summary and formatTopic3SummaryText aggregate Wave 1 (4/4) and total (6/6) completion accurately', () => {
  const emptySummary = computeTopic3Summary(undefined)
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

  const wave1Progress = {}
  for (const mod of TOPIC3_MODULES.filter((m) => m.releaseScope === 'wave1')) {
    wave1Progress[mod.id] = buildCompletedModuleProgress(mod, [`${mod.sectionCode}-proof.xlsx`])
  }

  const wave1Summary = computeTopic3Summary({ modules: wave1Progress })
  assert.equal(wave1Summary.wave1Completed, 4)
  assert.equal(wave1Summary.readyForConsolidation, true)
  assert.equal(wave1Summary.percent, 67)

  const report = formatTopic3SummaryText('Lerato Mokoena (N5-101)', { modules: wave1Progress })
  assert.ok(report.includes(TOPIC3_TITLE.toUpperCase()))
  assert.ok(report.includes('Lerato Mokoena (N5-101)'))
  assert.ok(report.includes('Wave 1 Progress: 4/4 modules'))
})

test('Topic 3 storage helpers handle corrupt JSON, missing storage, and owner progress safely', () => {
  assert.equal(TOPIC3_STORAGE_KEY, 'sankofa-n5-topic3-v1')
  assert.equal(getTopic3OwnerKey(null), 'local-learner')
  assert.equal(getTopic3OwnerKey({ session: { studentCode: ' N5-104 ' } }), 'N5-104')

  const failingStorage = {
    getItem: () => '{bad-json',
    setItem: () => {
      throw new Error('QuotaExceeded')
    },
  }
  assert.deepEqual(readTopic3Store(failingStorage), createInitialTopic3Store())
  assert.equal(writeTopic3Store(createInitialTopic3Store(), failingStorage), false)

  const mem = createMemoryStorage()
  const store = createInitialTopic3Store()
  const mod = TOPIC3_MODULES[2]
  store.byOwner['N5-104'] = { modules: { [mod.id]: buildCompletedModuleProgress(mod) } }
  assert.equal(writeTopic3Store(store, mem), true)
  const loaded = readTopic3Store(mem)
  const ownerProgress = getOwnerTopic3Progress(loaded, 'N5-104')
  assert.equal(isTopic3ModuleComplete(mod, ownerProgress.modules[mod.id]), true)
  assert.deepEqual(initialModuleProgress(), {
    quickCheckAnswers: {},
    quickCheckResult: null,
    evidenceNotes: '',
    checklist: {},
    evidenceFiles: [],
    completedAt: null,
  })
})

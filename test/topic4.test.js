import test from 'node:test'
import assert from 'node:assert/strict'

import { TOPIC4_MODULES, TOPIC4_TITLE } from '../src/topic4-data.js'
import {
  TOPIC4_STORAGE_KEY,
  computeTopic4Summary,
  createInitialTopic4Store,
  evaluateQuickCheck,
  formatTopic4SummaryText,
  getOwnerTopic4Progress,
  getTopic4OwnerKey,
  initialModuleProgress,
  isTopic4ModuleComplete,
  readTopic4Store,
  writeTopic4Store,
} from '../src/topic4-engine.js'

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

function buildCompletedModuleProgress(moduleDef, files = ['topic4-proof.pdf']) {
  const answers = Object.fromEntries(moduleDef.quickCheck.map((q) => [q.id, q.correctIndex]))
  const checklist = Object.fromEntries(moduleDef.evidenceTask.checklist.map((item) => [item.id, true]))
  return {
    quickCheckAnswers: answers,
    quickCheckResult: evaluateQuickCheck(moduleDef, answers),
    evidenceNotes: 'Identified clue, named Internet concept, and verified source criteria.',
    checklist,
    evidenceFiles: files,
    completedAt: 1700000000000,
  }
}

test('TOPIC4_MODULES contains all 10 ordered modules (8 wave1 + 2 wave2) with 30 unique quickCheck questions', () => {
  assert.equal(TOPIC4_TITLE, 'CPN5 Topic 4 · Internet & Communication Skills')
  assert.equal(TOPIC4_MODULES.length, 10)

  const expectedOrder = [
    ['topic4-section1a', '1A', 'wave1', 'apps', 'THEORY_RECALL'],
    ['topic4-section1b', '1B', 'wave1', 'apps', 'INSTRUCTION_CONTROL'],
    ['topic4-section1c', '1C', 'wave1', 'apps', 'THEORY_RECALL'],
    ['topic4-section2a', '2A', 'wave1', 'services', 'THEORY_RECALL'],
    ['topic4-section2b', '2B', 'wave1', 'services', 'INSTRUCTION_CONTROL'],
    ['topic4-section2c', '2C', 'wave1', 'services', 'INSTRUCTION_CONTROL'],
    ['topic4-section3a', '3A', 'wave1', 'search', 'VERIFICATION_DISCIPLINE'],
    ['topic4-section3b', '3B', 'wave1', 'search', 'VERIFICATION_DISCIPLINE'],
    ['topic4-section4', '4', 'wave2', 'consolidation', 'INSTRUCTION_CONTROL'],
    ['topic4-mastery', 'Mastery', 'wave2', 'consolidation', 'TIME_DISCIPLINE'],
  ]

  assert.deepEqual(
    TOPIC4_MODULES.map((m) => [m.id, m.sectionCode, m.releaseScope, m.category, m.leakCode]),
    expectedOrder
  )

  const moduleIds = new Set()
  const questionIds = new Set()

  for (const mod of TOPIC4_MODULES) {
    assert.ok(!moduleIds.has(mod.id), `Duplicate module id: ${mod.id}`)
    moduleIds.add(mod.id)
    assert.equal(mod.concept?.keyPoints?.length, 4)
    assert.equal(mod.triggerTable?.length, 4)
    assert.equal(mod.guidedPractice?.steps?.length, 4)
    assert.equal(mod.quickCheck.length, 3)
    assert.equal(mod.evidenceTask?.checklist?.length, 3)

    for (const q of mod.quickCheck) {
      assert.ok(!questionIds.has(q.id), `Duplicate question id: ${q.id}`)
      questionIds.add(q.id)
      assert.equal(q.options.length, 4)
      assert.ok(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex <= 3)
      assert.ok(q.rationale.trim().length > 0)
      assert.ok(q.leak.trim().length > 0)
    }
  }

  assert.equal(questionIds.size, 30)
})

test('evaluateQuickCheck, isTopic4ModuleComplete, and Topic 4 summary aggregation work accurately', () => {
  const mod = TOPIC4_MODULES[0]
  const [q1, q2, q3] = mod.quickCheck
  const wrong = (i) => (i + 1) % 4

  assert.equal(evaluateQuickCheck(mod, { [q1.id]: q1.correctIndex, [q2.id]: wrong(q2.correctIndex), [q3.id]: wrong(q3.correctIndex) }).passed, false)
  assert.equal(evaluateQuickCheck(mod, { [q1.id]: q1.correctIndex, [q2.id]: q2.correctIndex, [q3.id]: wrong(q3.correctIndex) }).passed, true)

  const complete = buildCompletedModuleProgress(mod)
  assert.equal(isTopic4ModuleComplete(mod, complete), true)
  assert.equal(isTopic4ModuleComplete(mod, { ...complete, evidenceNotes: 'short' }), false)

  const wave1Progress = {}
  for (const m of TOPIC4_MODULES.filter((x) => x.releaseScope === 'wave1')) {
    wave1Progress[m.id] = buildCompletedModuleProgress(m)
  }

  const wave1Summary = computeTopic4Summary({ modules: wave1Progress })
  assert.deepEqual(wave1Summary, {
    totalModules: 10,
    wave1Total: 8,
    wave1Completed: 8,
    completedModules: 8,
    percent: 80,
    quickChecksPassed: 8,
    evidenceFilesCount: 8,
    readyForConsolidation: true,
  })

  const report = formatTopic4SummaryText('Amina Patel (N5-103)', { modules: wave1Progress })
  assert.ok(report.includes(TOPIC4_TITLE.toUpperCase()))
  assert.ok(report.includes('Wave 1 Progress: 8/8 modules'))
  assert.ok(report.includes('8/10 modules (80%)'))
})

test('Topic 4 storage helpers handle corrupt JSON, missing storage, and owner progress safely', () => {
  assert.equal(TOPIC4_STORAGE_KEY, 'sankofa-n5-topic4-v1')
  assert.equal(getTopic4OwnerKey(null), 'local-learner')
  assert.equal(getTopic4OwnerKey({ session: { studentCode: 'N5-103' } }), 'N5-103')

  const badStorage = { getItem: () => '{bad', setItem: () => { throw new Error('full') } }
  assert.deepEqual(readTopic4Store(badStorage), createInitialTopic4Store())
  assert.equal(writeTopic4Store(createInitialTopic4Store(), badStorage), false)

  const mem = createMemoryStorage()
  const store = createInitialTopic4Store()
  const mod = TOPIC4_MODULES[2]
  store.byOwner['N5-103'] = { modules: { [mod.id]: buildCompletedModuleProgress(mod) } }
  assert.equal(writeTopic4Store(store, mem), true)
  const loaded = readTopic4Store(mem)
  assert.equal(isTopic4ModuleComplete(mod, getOwnerTopic4Progress(loaded, 'N5-103').modules[mod.id]), true)
  assert.deepEqual(initialModuleProgress().evidenceFiles, [])
})

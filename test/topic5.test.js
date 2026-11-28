import test from 'node:test'
import assert from 'node:assert/strict'

import { TOPIC5_MODULES, TOPIC5_TITLE } from '../src/topic5-data.js'
import {
  TOPIC5_STORAGE_KEY,
  computeTopic5Summary,
  createInitialTopic5Store,
  evaluateQuickCheck,
  formatTopic5SummaryText,
  getOwnerTopic5Progress,
  getTopic5OwnerKey,
  initialModuleProgress,
  isTopic5ModuleComplete,
  readTopic5Store,
  writeTopic5Store,
} from '../src/topic5-engine.js'

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

function buildCompletedModuleProgress(moduleDef, files = ['topic5-proof.pdf']) {
  const answers = Object.fromEntries(moduleDef.quickCheck.map((q) => [q.id, q.correctIndex]))
  const checklist = Object.fromEntries(moduleDef.evidenceTask.checklist.map((item) => [item.id, true]))
  return {
    quickCheckAnswers: answers,
    quickCheckResult: evaluateQuickCheck(moduleDef, answers),
    evidenceNotes: 'Identified digital action, threat or impact, and technical prevention control.',
    checklist,
    evidenceFiles: files,
    completedAt: 1700000000000,
  }
}

test('TOPIC5_MODULES contains all 7 ordered modules (6 wave1 + 1 wave2) with 21 unique quickCheck questions', () => {
  assert.equal(TOPIC5_TITLE, 'CPN5 Topic 5 · Digital Citizenship, Cybercrime & Ethics')
  assert.equal(TOPIC5_MODULES.length, 7)

  const expectedOrder = [
    ['topic5-emerging-tech', '1A', 'wave1', 'emerging', 'THEORY_EXPLANATION'],
    ['topic5-ict-impact', '1B', 'wave1', 'impact', 'COMMUNICATION_THEORY'],
    ['topic5-human-impact-discussion', '1B Ext', 'wave1', 'impact', 'COMMUNICATION_THEORY'],
    ['topic5-cybercriminal-methods', '2A', 'wave1', 'cybercrime', 'THEORY_EXPLANATION'],
    ['topic5-cybercrime-types', '2B', 'wave1', 'cybercrime', 'THEORY_EXPLANATION'],
    ['topic5-effects-prevention', '2C', 'wave1', 'cybercrime', 'COMMUNICATION_THEORY'],
    ['topic5-ethics-decisions', '3A', 'wave2', 'ethics', 'COMMUNICATION_THEORY'],
  ]

  assert.deepEqual(
    TOPIC5_MODULES.map((m) => [m.id, m.sectionCode, m.releaseScope, m.category, m.leakCode]),
    expectedOrder
  )

  const moduleIds = new Set()
  const questionIds = new Set()

  for (const mod of TOPIC5_MODULES) {
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

  assert.equal(questionIds.size, 21)
})

test('evaluateQuickCheck, isTopic5ModuleComplete, and Topic 5 summary aggregation work accurately', () => {
  const mod = TOPIC5_MODULES[0]
  const [q1, q2, q3] = mod.quickCheck
  const wrong = (i) => (i + 1) % 4

  assert.equal(evaluateQuickCheck(mod, { [q1.id]: q1.correctIndex, [q2.id]: wrong(q2.correctIndex), [q3.id]: wrong(q3.correctIndex) }).passed, false)
  assert.equal(evaluateQuickCheck(mod, { [q1.id]: q1.correctIndex, [q2.id]: q2.correctIndex, [q3.id]: wrong(q3.correctIndex) }).passed, true)

  const complete = buildCompletedModuleProgress(mod)
  assert.equal(isTopic5ModuleComplete(mod, complete), true)
  assert.equal(isTopic5ModuleComplete(mod, { ...complete, checklist: { [mod.evidenceTask.checklist[0].id]: true } }), false)

  const wave1Progress = {}
  for (const m of TOPIC5_MODULES.filter((x) => x.releaseScope === 'wave1')) {
    wave1Progress[m.id] = buildCompletedModuleProgress(m)
  }

  const wave1Summary = computeTopic5Summary({ modules: wave1Progress })
  assert.deepEqual(wave1Summary, {
    totalModules: 7,
    wave1Total: 6,
    wave1Completed: 6,
    completedModules: 6,
    percent: 86,
    quickChecksPassed: 6,
    evidenceFilesCount: 6,
    readyForConsolidation: true,
  })

  const report = formatTopic5SummaryText('Sipho Dlamini (N5-104)', { modules: wave1Progress })
  assert.ok(report.includes(TOPIC5_TITLE.toUpperCase()))
  assert.ok(report.includes('Wave 1 Progress: 6/6 modules'))
  assert.ok(report.includes('6/7 modules (86%)'))
})

test('Topic 5 storage helpers handle corrupt JSON, missing storage, and owner progress safely', () => {
  assert.equal(TOPIC5_STORAGE_KEY, 'sankofa-n5-topic5-v1')
  assert.equal(getTopic5OwnerKey(null), 'local-learner')
  assert.equal(getTopic5OwnerKey({ session: { studentCode: 'N5-104' } }), 'N5-104')

  const badStorage = { getItem: () => '{bad', setItem: () => { throw new Error('full') } }
  assert.deepEqual(readTopic5Store(badStorage), createInitialTopic5Store())
  assert.equal(writeTopic5Store(createInitialTopic5Store(), badStorage), false)

  const mem = createMemoryStorage()
  const store = createInitialTopic5Store()
  const mod = TOPIC5_MODULES[4]
  store.byOwner['N5-104'] = { modules: { [mod.id]: buildCompletedModuleProgress(mod) } }
  assert.equal(writeTopic5Store(store, mem), true)
  const loaded = readTopic5Store(mem)
  assert.equal(isTopic5ModuleComplete(mod, getOwnerTopic5Progress(loaded, 'N5-104').modules[mod.id]), true)
  assert.deepEqual(initialModuleProgress().checklist, {})
})

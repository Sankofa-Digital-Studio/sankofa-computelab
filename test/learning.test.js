import test from 'node:test'
import assert from 'node:assert/strict'
import {diagnostics, diagnosticResult, recommendedRepairs, marksPlan} from '../src/learning-model.js'

test('diagnoses are course-specific and prioritise repair for the missed skill', () => {
  const n5 = diagnostics.filter(question => question.course === 'cpn5')
  const n6 = diagnostics.filter(question => question.course === 'cpn6')
  const missed = n5.find(question => question.leak === 'EXCEL_REFERENCING')
  const answers = Object.fromEntries([...n5, ...n6].map(question => [question.id, question.correct]))
  answers[missed.id] = (missed.correct + 1) % missed.options.length
  const run = {answers, confidence: {[missed.id]: 'certain'}}
  const result = diagnosticResult('cpn5', run)
  assert.equal(result.total, 12)
  assert.equal(result.correct, 11)
  assert.equal(result.overconfident, 1)
  assert.deepEqual(result.weaknesses, [['EXCEL_REFERENCING', 1]])
  assert.equal(diagnosticResult('cpn6', run).correct, 12)
  const repairs = recommendedRepairs('cpn5', run)
  assert.equal(repairs[0].leak, 'EXCEL_REFERENCING')
  assert.ok(repairs.every(repair => repair.subjectCode === 'n5'))
})

test('marks planning distinguishes zero from pending and calculates the 40% boundary', () => {
  assert.deepEqual(marksPlan([50, 25, '']), {
    valid: true, secured: 25, remaining: 50, complete: false, needed: 30,
  })
  assert.deepEqual(marksPlan([50, 25, 30]), {
    valid: true, secured: 40, remaining: 0, complete: true, needed: null,
  })
  assert.deepEqual(marksPlan([0, 0, '']), {
    valid: true, secured: 0, remaining: 50, complete: false, needed: 80,
  })
  assert.equal(marksPlan([50, 51, 30]).valid, false)
})

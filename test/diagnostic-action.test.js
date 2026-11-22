import test from 'node:test'
import assert from 'node:assert/strict'
import { diagnosticAction } from '../src/diagnostic-action.js'

test('diagnostic action respects new, partial and submitted runs', () => {
  assert.equal(diagnosticAction(), 'Start diagnostic')
  assert.equal(diagnosticAction({ answers: {} }), 'Start diagnostic')
  assert.equal(diagnosticAction({ answers: { first: 0 } }), 'Resume diagnostic')
  assert.equal(diagnosticAction({ confidence: { first: 'certain' } }), 'Resume diagnostic')
  assert.equal(diagnosticAction({ submitted: true }), 'Review diagnostic feedback')
})

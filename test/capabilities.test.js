import test from 'node:test'
import assert from 'node:assert/strict'
import { capabilities } from '../src/capabilities.js'

test('each audited learner claim has a distinct destination and a scope explanation', () => {
  assert.deepEqual(capabilities.map(item => item.route).sort(), ['assignments', 'feedback', 'learning', 'notices', 'practice', 'progress'])
  for (const item of capabilities) {
    assert.ok(item.title.trim())
    assert.ok(item.detail.trim())
  }
})

import test from 'node:test'
import assert from 'node:assert/strict'
import { learningReview } from '../src/learning-review.js'

test('learner export omits reflections, free text, confidence and attachment data', () => {
  const review = learningReview('cpn5', {run:{submitted:true, confidence:{q:'PRIVATE'}}, proofs:{a:{completed:true,reflection:'PRIVATE',attachment:'PRIVATE'}}, repairs:{note:'PRIVATE'}})
  assert.match(review, /Completed practical proofs: 1/)
  assert.doesNotMatch(review, /PRIVATE/)
})

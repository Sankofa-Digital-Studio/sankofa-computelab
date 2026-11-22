export function learningReview(course, data) {
  const proofs = Object.values(data.proofs ?? {})
  const completed = proofs.filter(proof => proof?.completed).length
  return [
    'Sankofa ComputeLab learning review',
    'Course: ' + course.toUpperCase(),
    'Diagnostic submitted: ' + (data.run?.submitted ? 'yes' : 'no'),
    'Completed practical proofs: ' + completed,
    'Local self-recorded practice. Lecturer review pending.'
  ].join('\n')
}

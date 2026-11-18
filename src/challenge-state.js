export const blank = {notes:{}, marks:{}, evidence:[], deadline:null, phase:'work'}
export function challengePhase(attempt, now) {
  if (!attempt) return 'ready'
  if (attempt.phase !== 'work') return attempt.phase
  return attempt.deadline && now >= attempt.deadline ? 'expired' : 'work'
}
export function rubricKey(taskIndex, criterionIndex) {
  return taskIndex + ':' + criterionIndex
}
export function challengeScore(challenge, attempt) {
  return challenge.tasks.reduce((total, task, ti) => {
    return total + task.rubric.reduce((sum, [, limits], ri) => {
      const score = Number(attempt.marks[rubricKey(ti, ri)] || 0)
      return sum + (Number.isInteger(score) ? Math.max(0, Math.min(limits, score)) : 0)
    }, 0)
  }, 0)
}
export function reviewNotes(challenge, attempt) {
  return [
    'Sankofa ComputeLab · '+challenge.title,
    'Practice self-mark: '+challengeScore(challenge,attempt)+'/'+challenge.tasks.reduce((sum,t)=>sum+t.marks,0),
    'First point to improve: '+(attempt.error || '—'),
    'Next action: '+(attempt.fix || '—'),
    'Transfer answer: '+(attempt.transfer || '—'),
    'Evidence filenames: '+(attempt.evidence.map(file=>file.file).join(', ') || '—'),
    '',
    ...challenge.tasks.map((row,i)=>row.title+'\n'+(attempt.notes[i]||'—'))
  ].join('\n\n')
}

export function task(title, app, outcome, prompt, rubric, check) {
  return {title, app, outcome, prompt, marks:rubric.reduce((sum,[,marks])=>sum+marks,0), rubric, check}
}

export function diagnosticAction(run) {
  if (run?.submitted) return 'Review diagnostic feedback'
  if (Object.keys(run?.answers ?? {}).length || Object.keys(run?.confidence ?? {}).length) {
    return 'Resume diagnostic'
  }
  return 'Start diagnostic'
}

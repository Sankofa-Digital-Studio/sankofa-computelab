export const key = 'sankofa-study-v1'
export const initial = { attempts: [], bookmarks: [], mastered: [], activity: [], paperAttempts: {}, drafts: {}, downloads: [], materials: [], submissions: [], feedback: [], notices: [], mocks: [], lab: {}, run: null, n5Run: null }
export function load() {
  try { return {...initial, ...JSON.parse(localStorage.getItem(key) || '{}')} } catch { return initial }
}
export function score(rows) {
  const earned = rows.reduce((sum, row) => sum + row.earned, 0)
  const possible = rows.reduce((sum, row) => sum + row.possible, 0)
  return {earned, possible, percent: possible ? Math.round(earned / possible * 100) : 0}
}
export function latestByQuestion(rows) {
  return [...new Map(rows.map(row => [row.id, row])).values()]
}
export function groupBy(rows, select) {
  const groups = new Map()
  for (const row of rows) {
    const key = select(row)
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(row)
  }
  return [...groups]
}
export function bySkill(rows, level = 'app') {
  return groupBy(latestByQuestion(rows), row => level === 'skill' ? row.skill || row.app : row.app).map(([label, items]) => ({label, app: items[0].app, ...score(items), count: items.length})).sort((a, b) => a.percent - b.percent)
}
export function matches(question, filters) {
  return Object.entries(filters).every(([name, value]) => !value || (name === 'session' ? question.sessions.includes(value) : name === 'query' ? [question.title, question.prompt, question.topic, question.app, question.skill, question.id].some(text => text.toLowerCase().includes(value.toLowerCase().trim())) : question[name] === value))
}
export function materialCatalogue(base, local) {
  return [...new Map([...base, ...local].map(row => [row.id, row])).values()]
}
export function commitAttemptRows(state, rows, runId, date) {
  const key = runId && state.n5Run?.id === runId ? 'n5Run' : 'run'
  if (runId && (state[key]?.id !== runId || state[key].recorded)) return state
  return {
    ...state,
    attempts:[...state.attempts, ...rows.map(row => ({...row,date}))],
    [key]:runId ? {...state[key],finished:true,recorded:true} : state[key]
  }
}

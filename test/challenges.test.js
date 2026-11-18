import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { challenges, challengeMarks, challengeSources } from '../src/challenge-data.js'
import { blank, challengePhase, challengeScore, reviewNotes } from '../src/challenge-state.js'
import { courses } from '../src/data.js'

test('every published challenge has a course, references and transfer task',async()=>{
  assert.equal(new Set(challenges.map(c=>c.id)).size,challenges.length)
  for(const c of challenges){
    assert.ok(courses.some(row=>row.id===c.course))
    assert.ok(c.sources.every(id=>challengeSources[id]))
    assert.ok(c.tasks.every(row=>row.outcome&&row.rubric.length>0))
    assert.ok(c.transfer.prompt&&c.transfer.check)
    if(c.pack)await access(new URL('../public'+c.pack.path,import.meta.url))
  }
})
test('the 180-mark mock and synthetic workbook checks agree',async()=>{
  const mock=challenges[0]
  assert.equal(mock.minutes,180)
  assert.equal(challengeMarks(mock),180)
  assert.deepEqual(mock.sections.map(([,minutes])=>minutes),[60,20,50,50])
  assert.deepEqual(mock.sections.map(([, ,marks])=>marks),[mock.tasks.slice(0,5).reduce((sum,task)=>sum+task.marks,0),...mock.tasks.slice(5).map(task=>task.marks)])
  const input=JSON.parse(await readFile(new URL('../src/open-day-data.json',import.meta.url),'utf8'))
  const rates=new Map(input.rates.map(([code,,rate])=>[code,rate]))
  const demand={}
  let costs=0
  for (const [session,code,booked] of input.bookings) {
    costs+=booked*rates.get(code)
    demand[session]=(demand[session]||0)+booked
  }
  assert.deepEqual(Object.values(demand),[42,76,49])
  assert.equal(costs,3824)
  assert.equal((costs*1.08).toFixed(2),'4129.92')
  assert.equal((costs*1.12).toFixed(2),'4282.88')
  assert.equal(input.bookings.filter(([, ,n,cap])=>n>cap).length,1)
})
test('timed work expires at the deadline and reviewed marks are bounded',()=>{
  const attempt={...blank,deadline:1000,marks:{'0:0':999,'0:1':4,'0:2':-1},notes:{0:'My work'}}
  assert.equal(challengePhase(attempt,999),'work')
  assert.equal(challengePhase(attempt,1000),'expired')
  assert.equal(challengePhase({...attempt,phase:'review'},1000),'review')
  assert.equal(challengeScore(challenges.find(row=>row.id==='stock-triage'),attempt),12)
  assert.match(reviewNotes(challenges.find(row=>row.id==='stock-triage'),attempt),/12\/20/)
  assert.match(reviewNotes(challenges.find(row=>row.id==='stock-triage'),attempt),/My work/)
})

test('careers clinic matches its five-strand 50-mark blueprint',()=>{
  const n5=challenges.find(row=>row.id==='n5-careers-clinic')
  assert.equal(n5.minutes,90)
  assert.equal(challengeMarks(n5),50)
  assert.deepEqual(n5.tasks.map(task=>task.marks),[10,8,14,14,4])
  assert.equal(n5.sections.reduce((sum,[,minutes])=>sum+minutes,0),90)
})

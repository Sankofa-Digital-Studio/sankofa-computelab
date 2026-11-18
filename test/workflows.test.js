import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, access } from 'node:fs/promises'
import { bySkill, commitAttemptRows, initial, latestByQuestion, matches, materialCatalogue, score } from '../src/store.js'
import { materials, mockTemplates, quiz, courses } from '../src/data.js'

import { levelQuestions, levelFlashcards, n5Quiz } from '../src/level-practice.js'

const bank=JSON.parse(await readFile(new URL('../src/questions.json',import.meta.url),'utf8'))
test('verified bank retains unique task IDs and supports cross-filtering by session and skill',()=>{
  assert.equal(bank.length,20)
  assert.equal(new Set(bank.map(row=>row.id)).size,20)
  assert.equal(bank.filter(row=>matches(row,{app:'Excel',session:'May 2025'})).length,4)
  assert.deepEqual(bank.filter(row=>matches(row,{query:'absolute references',type:'Practical'})).map(row=>row.id),['E02'])
  assert.deepEqual(bank.filter(row=>matches(row,{app:'OneNote',session:'September 2020'})),[])
  for(const mock of mockTemplates) assert.ok(mock.ids.every(id=>[...bank,...levelQuestions].some(row=>row.id===id&&row.course===(mock.course||'cpn6'))))
  assert.ok(quiz.every(row=>row.options[row.answer]))
})
test('scoring records a run once and weak areas use latest marks',()=>{
  const active={...initial,run:{id:'run1'}}
  const rows=[{id:'a',app:'Excel',skill:'References',earned:5,possible:10},{id:'b',app:'Word',skill:'Formatting',earned:12,possible:12}]
  const finished=commitAttemptRows(active,rows,'run1','2026-11-17')
  assert.equal(finished.run.recorded,true)
  assert.equal(commitAttemptRows(finished,rows,'run1','2026-11-17'),finished)
  const revised=commitAttemptRows(finished,[{...rows[0],earned:9}],null,'2026-11-18')
  assert.equal(latestByQuestion(revised.attempts).length,2)
  assert.equal(score(latestByQuestion(revised.attempts)).percent,95)
  assert.deepEqual(bySkill(revised.attempts,'skill').map(row=>row.label),['References','Formatting'])
})
test('material replacement preserves official versions and all source files exist',async()=>{
  const original=materials[0]
  const replacement={...original,versions:[...original.versions,{id:'new'}]}
  const catalogue=materialCatalogue(materials,[replacement])
  assert.equal(catalogue.length,materials.length)
  assert.deepEqual(catalogue[0].versions.map(v=>v.id),[original.versions[0].id,'new'])
  for(const material of materials) for(const file of [...material.versions,...(material.memo?[material.memo]:[])]) await access('public'+file.path)
})

test('N5 and N6 practice use separate IDs and timed runs',()=>{
  assert.deepEqual(courses.map(course=>course.id).sort(),['cpn5','cpn6'])
  const ids=[...bank,...levelQuestions,...quiz,...n5Quiz].map(row=>row.id)
  assert.equal(new Set(ids).size,ids.length)
  assert.equal(levelQuestions.filter(row=>row.course==='cpn5').length,12)
  assert.ok(levelFlashcards.some(row=>row.course==='cpn5'))
  const active={...initial,run:{id:'N6'},n5Run:{id:'N5'}}
  const marked=commitAttemptRows(active,[{id:'N5-QZ0',course:'cpn5',earned:1,possible:1}],'N5','2026-11-17')
  assert.equal(marked.n5Run.recorded,true)
  assert.equal(marked.run,active.run)
  assert.equal(commitAttemptRows(marked,[],'N5','2026-11-17'),marked)
})

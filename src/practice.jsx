import { ChallengeProgress } from './challenge'
import React,{useEffect,useState} from 'react'
import { ArrowLeft, ArrowRight, Bookmark, Check, ChevronDown, CircleHelp, ClipboardList, Layers3, Lightbulb, LockKeyhole, Plus, RotateCcw, Search, Timer, Trash2 } from 'lucide-react'
import { appColors, appIcons, Empty, Header, IconTile, Select } from './ui'
import { quiz, flashcards, mockTemplates, sessions } from './data'
import { matches, score, bySkill, latestByQuestion } from './store'
import n6Questions from './questions.json'
import { levelQuestions, levelFlashcards, n5Quiz } from './level-practice'
const questions = [...n6Questions,...levelQuestions]
const quizItems = [...quiz,...n5Quiz]
const resetFilters = {query:'',topic:'',skill:'',type:'',session:''}

const tabs = [['questions','Question bank'],['flashcards','Flashcards'],['quiz','Timed quiz'],['mocks','Mock exams'],['saved','Bookmarks']]
const formats = [['guided','Guided'],['unguided','Unguided']]
const unique = (rows, key) => [...new Set(rows.map(row=>row[key]))].sort()

function QuestionCard({row,mode,bookmarked,toggleBookmark,commit,draft,saveDraft}) {
  const [open,setOpen] = useState(false)
  const [attempt,setAttempt] = useState(draft?.attempt||'')
  const revealed = Boolean(draft?.attempt)
  const [earned,setEarned] = useState('')
  const [reflection,setReflection] = useState('')
  const saved = Boolean(draft?.scored)
  return <article className="card question-card">
    <div className="question-top"><IconTile icon={appIcons[row.app]} color={appColors[row.app]}/><div className="question-title"><small>{row.id} · {row.app} · {row.type}</small><h3>{row.title}</h3><p>{row.topic} / {row.skill}</p></div><span className="pill neutral question-marks">{row.marks} marks</span><button className={'icon-button bookmark '+(bookmarked?'on':'')} aria-label={bookmarked?'Remove bookmark':'Bookmark question'} aria-pressed={bookmarked} onClick={()=>toggleBookmark(row.id)}><Bookmark size={19} fill={bookmarked?'currentColor':'none'}/></button><button className="icon-button" aria-expanded={open} aria-label={open?'Collapse question':'Open question'} onClick={()=>setOpen(!open)}><ChevronDown size={19} className={open?'turned':''}/></button></div>
    {open&&<div className="question-content">
      <p>{row.prompt}</p><p className="muted compact">Source alignment · {row.alignment}. Original practice activity.</p>
      {mode==='guided'&&<div className="guidance"><Lightbulb size={18}/><span>{row.hint}</span></div>}
      <form onSubmit={e=>{e.preventDefault();if(attempt.trim())saveDraft(row.id,{attempt:attempt.trim()})}}>
        <label className="field"><span>{row.type==='Practical'?'Working notes or evidence completed':'Your answer'}</span><textarea value={attempt} onChange={e=>setAttempt(e.target.value)} required disabled={revealed} placeholder="Record your attempt before opening the memo."/></label>
        {!revealed&&<button className="btn primary" disabled={!attempt.trim()}><LockKeyhole size={16}/> Submit attempt & reveal memo</button>}
      </form>
      {revealed&&<div className="memo"><h4>Practice memo</h4><p>{row.check}</p>{!saved?<form onSubmit={e=>{e.preventDefault();commit([{id:row.id,app:row.app,skill:row.skill,course:row.course,earned:Number(earned),possible:row.marks,response:attempt,note:reflection,kind:'Self-marked practice'}]);saveDraft(row.id,{attempt,scored:true})}}>
        <div className="score-fields"><label className="field"><span>Self-mark / {row.marks}</span><input type="number" min="0" max={row.marks} step="1" value={earned} onChange={e=>setEarned(e.target.value)} required/></label><label className="field"><span>What would you change? (optional)</span><input value={reflection} onChange={e=>setReflection(e.target.value)}/></label></div>
        <button className="btn primary">Save score</button>
      </form>:<div className="button-row"><span className="success"><Check size={16}/> Score saved</span><button className="btn outline" onClick={()=>{setAttempt('');setEarned('');setReflection('');saveDraft(row.id,null)}}><RotateCcw size={15}/> New attempt</button></div>}</div>}
    </div>}
  </article>
}

function Flashcards({state,update,course}) {
  const [app,setApp]=useState('')
  const [index,setIndex]=useState(0)
  const [flip,setFlip]=useState(false)
  const courseDeck=[...flashcards,...levelFlashcards].filter(row=>(row.course||'cpn6')===course)
  const deck=courseDeck.filter(row=>!app||row.app===app)
  const card=deck[index]
  const known=deck.filter(row=>state.mastered.includes(row.id)).length
  function advance(step){setIndex((index+step+deck.length)%deck.length);setFlip(false)}
  return <section className="narrow"><div className="filters"><Select label="Application" options={unique(courseDeck,'app')} value={app} all="All applications" onChange={value=>{setApp(value);setIndex(0);setFlip(false)}}/><span className="muted">{known} of {deck.length} known</span></div>
    <button className="flash card" onClick={()=>setFlip(!flip)}><IconTile icon={Layers3} color="purple"/><small>{card.app} · {flip?'Answer':'Question'}</small><strong>{flip?card.back:card.front}</strong><span>{flip?'Tap to see question':'Tap to reveal'}</span></button>
    <div className="flash-actions"><button className="btn outline" onClick={()=>advance(-1)} aria-label="Previous flashcard"><ArrowLeft size={18}/></button><span>{index+1} / {deck.length}</span><button className="btn outline" onClick={()=>advance(1)} aria-label="Next flashcard"><ArrowRight size={18}/></button></div>
    <button className="btn primary" onClick={()=>update(s=>({...s,mastered:s.mastered.includes(card.id)?s.mastered.filter(id=>id!==card.id):[...s.mastered,card.id]}))}><Check size={17}/> {state.mastered.includes(card.id)?'Mark for review':'Mark as known'}</button>
  </section>
}

const clock = seconds => Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')
function Run({run,update,commit}) {
  const [remaining,setRemaining]=useState(()=>Math.max(0,Math.ceil((run.deadline-Date.now())/1000)))
  const [marks,setMarks]=useState({})
  const items=run.ids.map(id=>[...quizItems,...questions].find(row=>row.id===id)).filter(Boolean)
  const expired=remaining===0
  const submitted=run.finished || expired
  const answered=items.filter(row=>String(run.answers[row.id]??'').trim()!=='').length
  function saveRun(patch){update(s=>s.run?.id===run.id?{...s,run:{...s.run,...patch}}:s)}
  useEffect(()=>{
    const tick=()=>setRemaining(Math.max(0,Math.ceil((run.deadline-Date.now())/1000)))
    tick()
    const interval=setInterval(tick,500)
    return ()=>clearInterval(interval)
  },[run.deadline])
  useEffect(()=>{
    if(!submitted||run.finished&&run.recorded||run.kind!=='quiz') return
    commit(items.map(row=>({id:row.id,app:row.app,skill:row.skill||row.title,course:run.course||'cpn6',earned:run.answers[row.id]===row.answer?1:0,possible:1,response:row.options[run.answers[row.id]]||'',kind:'Timed quiz'})),run.id)
  },[submitted,run.finished,run.recorded])
  const quizScore=run.kind==='quiz'&&items.filter(row=>run.answers[row.id]===row.answer).length
  return <section className="run">
    <div className="run-top card"><div><h2>{run.title}</h2><p>{answered} of {items.length} answered {submitted&&run.kind==='quiz'?' · Score '+quizScore+'/'+items.length:''}</p></div><span className={'timer '+(remaining<60?'urgent':'')}><Timer size={18}/> {submitted ? 'Finished' : clock(remaining)}</span></div>
    {items.map((row,i)=><article className="card run-question" key={row.id}><div className="eyebrow">{i+1} / {items.length} · {row.app} · {row.marks} {row.marks===1?'mark':'marks'}</div><h3>{row.title}</h3><p>{row.prompt}</p>
      {row.options?<fieldset disabled={submitted} className="options"><legend className="sr-only">Choose an answer</legend>{row.options.map((option,j)=><label key={option} className={submitted&&row.answer===j?'correct':''}><input type="radio" name={row.id} checked={run.answers[row.id]===j} onChange={()=>saveRun({answers:{...run.answers,[row.id]:j}})}/>{option}</label>)}</fieldset>:<label className="field"><span>Your answer or working notes</span><textarea disabled={submitted} value={run.answers[row.id]||''} onChange={e=>saveRun({answers:{...run.answers,[row.id]:e.target.value}})}/></label>}
      {submitted&&(row.options||String(run.answers[row.id]||'').trim())&&<div className="memo"><h4>{row.options?'Answer check':'Practice memo'}</h4><p>{row.check}</p>{!row.options&&!run.recorded&&<label className="field"><span>Self-mark / {row.marks}</span><input type="number" min="0" max={row.marks} step="1" value={marks[row.id]??''} onChange={e=>setMarks({...marks,[row.id]:e.target.value})}/></label>}</div>}
    </article>)}
    {!submitted&&<button className="btn primary" disabled={!answered} onClick={()=>saveRun({finished:true})}>Finish & submit</button>}
    {submitted&&run.kind==='mock'&&!run.recorded&&<button className="btn primary" disabled={items.some(row=>String(run.answers[row.id]||'').trim()&&(marks[row.id]===''||marks[row.id]===undefined||Number(marks[row.id])<0||Number(marks[row.id])>row.marks||!Number.isInteger(Number(marks[row.id]))))} onClick={()=>commit(items.map(row=>({id:row.id,app:row.app,skill:row.skill||row.title,course:run.course||'cpn6',earned:Number(marks[row.id]||0),possible:row.marks,response:run.answers[row.id]||'',kind:'Self-marked mock'})),run.id)}>Save mock scores</button>}
    {run.recorded&&<button className="btn outline" onClick={()=>update(s=>({...s,run:null}))}><ArrowLeft size={17}/> Back to practice</button>}
    {!submitted&&<button className="btn text-button" onClick={()=>{if(window.confirm('Discard this attempt?'))update(s=>({...s,run:null}))}}>Discard attempt</button>}
  </section>
}

function MockBuilder({state,update,start,bank,course}) {
  const [editing,setEditing]=useState(false)
  const [title,setTitle]=useState('')
  const [minutes,setMinutes]=useState(30)
  const [selected,setSelected]=useState([])
  return <><div className="section-head"><div><h2>Reusable mock exams</h2><p>Run a template again or build a mock around the sections you need.</p></div><button className="btn outline" onClick={()=>setEditing(!editing)}><Plus size={17}/> Build a mock</button></div>
    {editing&&<form className="card question-content builder" onSubmit={e=>{e.preventDefault();if(!title.trim()||!selected.length)return;update(s=>({...s,mocks:[...s.mocks,{id:crypto.randomUUID(),title:title.trim(),minutes:Number(minutes),course,ids:selected}]}));setEditing(false);setTitle('');setSelected([])}}>
      <div className="score-fields"><label className="field"><span>Mock name</span><input required value={title} onChange={e=>setTitle(e.target.value)}/></label><label className="field"><span>Minutes</span><input type="number" required min="1" max="240" value={minutes} onChange={e=>setMinutes(e.target.value)}/></label></div>
      <fieldset className="options mock-options"><legend>Select questions</legend>{bank.map(row=><label key={row.id}><input type="checkbox" checked={selected.includes(row.id)} onChange={()=>setSelected(selected.includes(row.id)?selected.filter(id=>id!==row.id):[...selected,row.id])}/>{row.id} · {row.title}</label>)}</fieldset><button className="btn primary" disabled={!selected.length}>Save mock template</button>
    </form>}
    <div className="stack">{[...mockTemplates,...state.mocks].filter(mock=>(mock.course||'cpn6')===course).map(mock=><article className="card row-card" key={mock.id}><IconTile icon={ClipboardList} color="blue"/><div><h3>{mock.title}</h3><p>{mock.minutes} min · {mock.ids.length} {mock.ids.length===1?'activity':'activities'}</p></div><button className="btn primary push-right" onClick={()=>start('mock',mock.title,mock.minutes,mock.ids)}>Start</button>{state.mocks.some(row=>row.id===mock.id)&&<button className="icon-button" title="Delete template" aria-label="Delete template" onClick={()=>update(s=>({...s,mocks:s.mocks.filter(row=>row.id!==mock.id)}))}><Trash2 size={17}/></button>}</article>)}</div>
  </>
}

export function Practice({state,update,tab,setTab,app,setApp,course,commit}) {
  const [mode,setMode]=useState('guided')
  const [filters,setFilters]=useState(resetFilters)
  const set = (name,value)=>setFilters(s=>({...s,[name]:value}))
  const bank=questions.filter(row=>row.course===course)
  const subset = bank.filter(row=>matches(row,{...filters,app}))
  const bookmarked = bank.filter(row=>state.bookmarks.includes(row.id))
  const activeQuiz=course==='cpn5'?n5Quiz:quiz
  const run=course==='cpn5'?state.n5Run:state.run
  const runUpdate=course==='cpn5' ? fn=>update(s=>{const next=fn({...s,run:s.n5Run});return {...s,n5Run:next.run}}) : update
  function saveDraft(id,draft){update(s=>({...s,drafts:{...s.drafts,[id]:draft}}))}
  function toggleBookmark(id){update(s=>({...s,bookmarks:s.bookmarks.includes(id)?s.bookmarks.filter(item=>item!==id):[...s.bookmarks,id]}))}
  function start(kind,title,minutes,ids){runUpdate(s=>({...s,run:{id:crypto.randomUUID(),kind,title,ids,course,answers:{},deadline:Date.now()+minutes*60_000}}))}
  const nextTab=id=>{setTab(id);setApp('');setFilters({query:'',topic:'',skill:'',type:'',session:''})}
  return <>
    <Header eyebrow="EXAM PREPARATION" title="Practice Hub" description="Work through exam-style questions, test recall and rehearse under time pressure."/>
    <nav className="tabs" aria-label="Practice tools">{tabs.map(([id,label])=><button key={id} aria-current={tab===id?'page':undefined} className={tab===id?'active':''} onClick={()=>nextTab(id)}>{label}</button>)}</nav>
    {(tab==='questions'||tab==='saved')&&<>
      {tab==='questions'&&<div className="card filter-card"><label className="search"><Search size={19}/><input aria-label="Search questions" placeholder="Search questions or skills" value={filters.query} onChange={e=>set('query',e.target.value)}/></label><div className="filters">
        <Select label="Application" value={app} onChange={setApp} options={unique(bank,'app')} all="All applications"/>
        <Select label="Topic" value={filters.topic} onChange={v=>set('topic',v)} options={unique(bank,'topic')} all="All topics"/>
        <Select label="Skill" value={filters.skill} onChange={v=>set('skill',v)} options={unique(bank,'skill')} all="All skills"/>
        <Select label="Question type" value={filters.type} onChange={v=>set('type',v)} options={unique(bank,'type')} all="All types"/>
        <Select label="Exam alignment" value={filters.session} onChange={v=>set('session',v)} options={sessions.filter(s=>bank.some(q=>q.sessions.includes(s)))} all="All sessions"/>
      </div></div>}
      <div className="section-head question-results"><div><h2>{tab==='saved'?'Bookmarked questions':subset.length+' '+(subset.length===1?'question':'questions')}</h2><p>{mode==='guided'?'Guided practice includes a hint before you submit.':'Unguided practice keeps hints hidden.'}</p></div><div className="segmented">{formats.map(([id,label])=><button key={id} aria-pressed={mode===id} className={mode===id?'active':''} onClick={()=>setMode(id)}>{label}</button>)}</div></div>
      <div className="stack">{(tab==='saved'?bookmarked:subset).map(row=><QuestionCard key={row.id} row={row} mode={mode} bookmarked={state.bookmarks.includes(row.id)} toggleBookmark={toggleBookmark} commit={commit} draft={state.drafts[row.id]} saveDraft={saveDraft}/>)}</div>
      {!(tab==='saved'?bookmarked:subset).length&&<Empty icon={tab==='saved'?Bookmark:Search} title={tab==='saved'?'No bookmarks yet':'No matching questions'}>{tab==='saved'?'Use the bookmark icon beside a question to save it for review.':<button className="btn outline" onClick={()=>nextTab('questions')}>Clear filters</button>}</Empty>}
    </>}
    {tab==='flashcards'&&<Flashcards state={state} update={update} course={course}/>}
    {(tab==='quiz'||tab==='mocks')&&run&&<Run key={run.id} run={run} update={runUpdate} commit={commit}/>}
    {tab==='quiz'&&!run&&<div className="card feature-card"><IconTile icon={Timer} color="mint"/><h2>{course==='cpn5'?'N5':'N6'} skills check</h2><p>Six questions covering theory and practical skills. Your answers are marked after submission or when time runs out.</p><div className="button-row"><span className="pill neutral">5 minutes</span><span className="pill neutral">6 questions</span></div><button className="btn primary" onClick={()=>start('quiz',course==='cpn5'?'N5 skills check':'N6 skills check',5,activeQuiz.map(row=>row.id))}>Start timed quiz <ArrowRight size={17}/></button></div>}
    {tab==='mocks'&&!run&&<MockBuilder state={state} update={update} start={start} bank={bank} course={course}/>}
  </>
}

export function Progress({state,course,openPractice,openChallenge}) {
  const [view,setView]=useState('weak')
  const [level,setLevel]=useState('app')
  const attempts=state.attempts.filter(row=>row.course===course)
  const latest=latestByQuestion(attempts)
  const rows=bySkill(attempts,level)
  const mistakes=latest.filter(row=>row.earned<row.possible)
  const totals=score(latest)
  const details=[...questions,...quizItems]
  return <><Header eyebrow="STUDENT WORKSPACE" title="My Progress" description="Review scores and mistakes, then practise the applications that need attention."/>
  <div className="stat-grid">{[['Attempts saved',attempts.length],['Latest weighted score',latest.length?totals.percent+'%':'—'],['Questions to review',mistakes.length]].map(([label,value])=><div key={label} className="card stat"><small>{label}</small><strong>{value}</strong></div>)}</div>
  <nav className="tabs" aria-label="Progress views">{[['weak','Weak areas'],['mistakes','Mistake review'],['history','Score history'],['lab','Challenges']].map(([id,label])=><button key={id} className={view===id?'active':''} aria-current={view===id?'page':undefined} onClick={()=>setView(id)}>{label}</button>)}</nav>
  {view==='lab'?<ChallengeProgress state={state} course={course} openChallenge={openChallenge}/>:!attempts.length?<Empty icon={CircleHelp} title="No scored attempts yet"><button className="btn primary" onClick={()=>openPractice('questions')}>Go to practice</button></Empty>:view==='weak'?<div className="stack"><div className="narrow"><Select label="Group scores by" value={level} onChange={setLevel} options={[{id:'app',title:'Application'},{id:'skill',title:'Skill'}]}/></div>{rows.map(row=><article className="card skill-card" key={row.label}><div className="section-head"><div><h3>{row.label}</h3><p>{row.count} marked · {row.earned}/{row.possible} marks</p></div><strong>{row.percent}%</strong></div><progress max="100" value={row.percent} aria-label={row.label+' score'}/><button className="btn text-button" onClick={()=>openPractice('questions',row.app)}>Practise {row.app} <ArrowRight size={16}/></button></article>)}</div>:<div className="stack">{(view==='mistakes'?mistakes:[...attempts].reverse()).map((row,i)=>{const question=details.find(item=>item.id===row.id);return <article className="card skill-card" key={row.id+i}><div className="section-head"><div><h3>{question?.title||row.id}</h3><p>{row.app} · {row.kind} · {new Date(row.date).toLocaleDateString('en-ZA')}</p></div><span className="pill neutral">{row.earned}/{row.possible}</span></div>{view==='mistakes'&&<><p><b>Your attempt</b> {row.response||'Unanswered'}</p><p><b>Check</b> {question?.check}</p>{row.note&&<p><b>Your review note</b> {row.note}</p>}<button className="btn text-button" onClick={()=>openPractice(question?.options?'quiz':'questions',row.app)}>Practise again <ArrowRight size={16}/></button></>}</article>})}{view==='mistakes'&&!mistakes.length&&<Empty title="No current mistakes to review"/>}</div>}
  </>
}

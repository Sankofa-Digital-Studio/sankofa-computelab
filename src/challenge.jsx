import React,{useEffect,useState} from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ClipboardCheck, Download, FileCheck2, FlaskConical, LockKeyhole, RotateCcw, Target, Timer, Upload } from 'lucide-react'
import { Empty, Header, IconTile, Select } from './ui'
import { challenges, challengeMarks, challengeSources, errorSteps } from './challenge-data'
import { blank, challengePhase, challengeScore, reviewNotes, rubricKey } from './challenge-state'
import { courses } from './data'
import { downloadFile, saveFiles } from './files'

const courseName=id=>courses.find(row=>row.id===id)?.short||id
const statusLabel={ready:'Ready to start',work:'In progress',expired:'Time ended',review:'Ready to mark',transfer:'Transfer ready',done:'Completed'}
const timeLabel=seconds=>Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')

export function ChallengeLab({state,course,selected,choose,update,notify}) {
  const [filter,setFilter]=useState('all')
  const visible=challenges.filter(c=>filter==='all'||c.course===filter)
  const challenge=challenges.find(c=>c.id===selected)
  if(challenge)return <ChallengeRun key={challenge.id} challenge={challenge} attempt={state.lab[challenge.id]} back={()=>choose('')} update={update} notify={notify}/>
  const featured=visible.find(row=>row.course===course)||visible[0]
  const finished=challenges.filter(c=>state.lab[c.id]?.phase==='done').length
  return <>
    <Header eyebrow="PRACTICAL EXAM PREPARATION" title="Challenge Lab" description="Work through a real scenario, check your evidence, then solve it again when the facts change."/>
    <section className="lab-hero">
      <div><div className="lab-kicker"><FlaskConical size={16}/> {courseName(featured.course)}</div><h2>{featured.title}</h2><p>{featured.pitch}</p><div className="button-row"><button className="btn accent" onClick={()=>choose(featured.id)}>{state.lab[featured.id]?'Continue challenge':'Explore challenge'} <ArrowRight size={17}/></button><span>{featured.minutes} min · {challengeMarks(featured)} marks</span></div></div>
      <ol className="lab-sequence"><li><Target size={20}/><span><b>Build</b><small>Produce an answer or working file</small></span></li><li><ClipboardCheck size={20}/><span><b>Check</b><small>Find where your reasoning broke</small></span></li><li><RotateCcw size={19}/><span><b>Transfer</b><small>Apply the skill to a new problem</small></span></li></ol>
    </section>
    <div className="lab-toolbar"><Select label="Filter challenges by course" value={filter} onChange={setFilter} options={[{id:'all',title:'All courses'},...courses.filter(c=>challenges.some(ch=>ch.course===c.id))]}/><span className="pill neutral">{finished} of {challenges.length} completed</span></div>
    <div className="lab-grid">{visible.map(row=>{
      const attempt=state.lab[row.id]
      const phase=challengePhase(attempt,Date.now())
      return <button className="card lab-card" key={row.id} onClick={()=>choose(row.id)}>
        <div className="lab-card-top"><IconTile icon={row.kind==='Full mock'?Timer:FileCheck2} color={row.kind==='Full mock'?'peach':'mint'}/><span>{courseName(row.course)} · {row.kind}</span><ArrowUpRight size={16}/></div>
        <h3>{row.title}</h3><p>{row.pitch}</p>
        <div className="lab-card-bottom"><span>{row.minutes} min · {challengeMarks(row)} marks</span><strong>{phase==='done'?challengeScore(row,attempt)+'/'+challengeMarks(row):statusLabel[phase]}</strong></div>
      </button>
    })}</div>
  </>
}

export function ChallengeProgress({state,course,openChallenge}) {
  const items=challenges.filter(row=>row.course===course && state.lab[row.id])
  if(!items.length)return <Empty icon={FlaskConical} title="No challenges started for this course"><button className="btn primary" onClick={()=>openChallenge('')}>Explore Challenge Lab</button></Empty>
  return <div className="stack">{items.map(row=>{
    const attempt=state.lab[row.id]
    const phase=challengePhase(attempt,Date.now())
    return <article className="card padded" key={row.id}><div className="lab-task-head"><h3>{row.title}</h3><span className="pill neutral">{statusLabel[phase]}</span></div>
      {(phase==='transfer'||phase==='done')&&<p>Self-mark · {challengeScore(row,attempt)}/{challengeMarks(row)} · {attempt.error}</p>}
      {attempt.fix&&<p className="prewrap">Next check · {attempt.fix}</p>}
      <button className="btn text-button" onClick={()=>openChallenge(row.id)}>Open challenge <ArrowRight size={16}/></button>
    </article>
  })}</div>
}

function ChallengeRun({challenge,attempt,back,update,notify}) {
  const [now,setNow]=useState(Date.now)
  const [busy,setBusy]=useState(false)
  const [savedPack,setSavedPack]=useState(false)
  const [confirmReset,setConfirmReset]=useState(false)
  const phase=challengePhase(attempt,now)
  const markTotal=challengeMarks(challenge)
  const points=attempt?challengeScore(challenge,attempt):0
  const remaining=attempt?.deadline?Math.max(0,Math.ceil((attempt.deadline-now)/1000)):0
  const canSubmit=attempt && (Object.values(attempt.notes).some(line=>line.trim()) || attempt.evidence.length)
  const completedTasks=attempt ? Object.values(attempt.notes).filter(line=>line.trim()).length : 0
  useEffect(()=>{
    if(phase!=='work'||!attempt?.deadline)return
    const timer=setInterval(()=>setNow(Date.now()),500)
    return ()=>clearInterval(timer)
  },[phase,attempt?.deadline])
  useEffect(()=>{
    if(!challenge.pack||!('caches' in window))return
    let active=true
    caches.open('sankofa-papers-v1').then(cache=>cache.match(challenge.pack.path)).then(file=>{if(active)setSavedPack(Boolean(file))}).catch(()=>{})
    return ()=>{active=false}
  },[challenge.pack])
  function edit(fn){update(s=>({...s,lab:{...s.lab,[challenge.id]:fn(s.lab[challenge.id])}}))}
  function start(timed){const time=Date.now();setNow(time);edit(()=>({...blank,deadline:timed?time+challenge.minutes*60_000:null}));window.scrollTo(0,0)}
  function work(patch){edit(current=>challengePhase(current,Date.now())==='work'?{...current,...patch}:current)}
  function submit(){
    if(!canSubmit&&phase!=='expired')return
    edit(current=>({...current,phase:'review',submittedAt:new Date().toISOString()}))
    window.scrollTo(0,0)
  }
  async function downloadPack(){
    try{const cached=await downloadFile(challenge.pack);setSavedPack(cached);notify(cached?'Exam kit downloaded and available offline in this browser.':'Exam kit downloaded. Keep the ZIP for offline use.')}
    catch(error){notify(error.message||'The exam kit could not be downloaded.')}
  }
  async function addFiles(e){
    const input=e.currentTarget
    const files=[...input.files].filter(file=>file.size>0)
    input.value=''
    if(!files.length||busy)return
    setBusy(true)
    try{
      const records=files.map(blob=>({id:crypto.randomUUID(),blob}))
      await saveFiles(records)
      const entries=records.map(({id,blob})=>({id,file:blob.name}))
      edit(current=>challengePhase(current,Date.now())==='work'?{...current,evidence:[...current.evidence,...entries]}:current)
      if(attempt.deadline&&Date.now()>=attempt.deadline)notify('Time ended before those files could be attached.')
      else notify(entries.length+' evidence file'+(entries.length===1?'':'s')+' saved on this device.')
    }catch{notify('The browser could not save the evidence files.')}
    finally{setBusy(false)}
  }
  async function getEvidence(file){
    try{await downloadFile(file)}catch{notify('Evidence is unavailable on this device.')}
  }
  function exportReview(){
    const href=URL.createObjectURL(new Blob([reviewNotes(challenge,attempt)],{type:'text/plain;charset=utf-8'}))
    const link=document.createElement('a')
    link.href=href
    link.download=challenge.id+'-review.txt'
    document.body.append(link)
    link.click()
    link.remove()
    setTimeout(()=>URL.revokeObjectURL(href),3000)
  }
  const inWork=phase==='work'||phase==='expired'
  const reviewed=phase==='transfer'||phase==='done'
  return <>
    <button className="btn text-button lab-back" onClick={back}><ArrowLeft size={17}/> All challenges</button>
    <Header eyebrow={courseName(challenge.course).toUpperCase()+' · '+challenge.kind.toUpperCase()} title={challenge.title} description={challenge.pitch}/>
    <div className="lab-run-grid">
      <section className="stack lab-main">
        {phase==='ready'&&<article className="card padded lab-brief"><h2>Your brief</h2><p>{challenge.scenario}</p>
          {challenge.sections&&<div className="lab-timing">{challenge.sections.map(([title,m,marks])=><div key={title}><strong>{title}</strong><span>{m} min · {marks} marks</span></div>)}</div>}
          {challenge.pack&&<p>Download and extract the kit before starting. Open the candidate brief for the starter files and required outputs.</p>}
          <div className="button-row"><button className="btn primary" onClick={()=>start(true)}><Timer size={17}/> Start {challenge.minutes}-minute {challenge.kind==='Full mock'?'mock':'challenge'}</button>{!challenge.sections&&<button className="btn outline" onClick={()=>start(false)}>Work untimed</button>}</div>
        </article>}
        {inWork&&<>
          <article className="card padded lab-brief"><h2>{phase==='expired'?'Time is up':'Your brief'}</h2><p>{phase==='expired'?'Submit the work already saved to open your review.':challenge.scenario}</p></article>
          {challenge.tasks.map((row,i)=><article className="card padded lab-task" key={row.title}><div className="lab-task-head"><h2>{row.title}</h2><span className="pill neutral">{row.marks} marks</span></div><p className="compact">{row.outcome}</p>{row.prompt.map(line=><p key={line}>{line}</p>)}<label className="field"><span>{row.app==='Theory'||row.app==='Business'?'Your response':'Working notes or output filenames'}</span><textarea aria-label={row.title+' response'} disabled={phase==='expired'} value={attempt.notes[i]||''} onChange={e=>work({notes:{...attempt.notes,[i]:e.target.value}})}/></label></article>)}
          <article className="card padded"><h2>Evidence files</h2><p>Attach editable work and print evidence if the challenge calls for it. Files stay in this browser.</p>
            {phase==='work'&&<label className="field"><span><Upload size={14}/> Attach working files</span><input type="file" multiple disabled={busy} onChange={addFiles}/></label>}
            {attempt.evidence.map(file=><div className="history-row" key={file.id}><span>{file.file}</span><button className="btn outline" onClick={()=>getEvidence(file)} aria-label={'Download '+file.file}><Download size={16}/></button></div>)}
          </article>
          <div className="button-row"><button className="btn primary" disabled={busy||(!canSubmit&&phase!=='expired')} onClick={submit}><LockKeyhole size={17}/> Submit work and open review</button></div>
        </>}
        {phase==='review'&&<>
          <article className="card padded lab-brief"><h2>Mark against the evidence</h2><p>Open your working files as you review. Add the marks you earned against each criterion. Blank criteria count as zero.</p></article>
          {challenge.tasks.map((row,i)=><article className="card padded lab-task" key={row.title}><div className="lab-task-head"><h2>{row.title}</h2><span className="pill neutral">{row.marks} marks</span></div>{attempt.notes[i]&&<details><summary>Your submitted response</summary><p className="prewrap">{attempt.notes[i]}</p></details>}<div className="memo"><h3>Practice marking guide</h3><p>{row.check}</p></div><div className="stack">{row.rubric.map(([label,limit],j)=><label className="lab-criterion" key={label}><span>{label} <small> / {limit}</small></span><input type="number" min="0" max={limit} step="1" aria-label={label+' marks'} value={attempt.marks[rubricKey(i,j)]??''} onChange={e=>{const value=e.target.value;edit(c=>({...c,marks:{...c.marks,[rubricKey(i,j)]:value===''?'':Math.max(0,Math.min(limit,Math.trunc(Number(value))))}}))}}/></label>)}</div></article>)}
          <form className="card padded lab-brief" onSubmit={e=>{e.preventDefault();if(attempt.error&&attempt.fix?.trim()){edit(c=>({...c,phase:'transfer'}));window.scrollTo(0,0)}}}>
            <h2>Choose one thing to fix</h2><Select label="First point where I lost marks" options={[...errorSteps,'No error spotted or a skill to stretch']} value={attempt.error||''} all="Choose a point" onChange={error=>edit(c=>({...c,error}))}/>
            <label className="field"><span>My correction or next check</span><textarea required value={attempt.fix||''} onChange={e=>edit(c=>({...c,fix:e.target.value}))}/></label>
            <button className="btn primary" disabled={!attempt.error||!attempt.fix?.trim()}>Save {points}/{markTotal} and open transfer task <ArrowRight size={17}/></button>
          </form>
        </>}
        {reviewed&&<article className="card padded lab-brief"><h2>Transfer challenge</h2><p>{challenge.transfer.prompt}</p><p className="compact">Your review target · {attempt.error}. {attempt.fix}</p>
          <form onSubmit={e=>{e.preventDefault();if(attempt.transfer?.trim())edit(c=>({...c,phase:'done',completedAt:new Date().toISOString()}))}}><label className="field"><span>Your revised answer and reasoning</span><textarea required disabled={phase==='done'} value={attempt.transfer||''} onChange={e=>edit(c=>({...c,transfer:e.target.value}))}/></label>
            {phase==='transfer'&&<button className="btn primary" disabled={!attempt.transfer?.trim()}>Submit transfer answer <ArrowRight size={17}/></button>}
          </form>
          {phase==='done'&&<><div className="memo"><h3>Transfer check</h3><p>{challenge.transfer.check}</p></div><div className="button-row"><button className="btn primary" onClick={exportReview}><Download size={16}/> Export review</button><button className="btn outline" onClick={()=>setConfirmReset(true)}><RotateCcw size={16}/> Repeat challenge</button></div>
            {confirmReset&&<div className="guidance reset-challenge"><span>A fresh attempt replaces this local review. Export it first if you want to keep a copy.</span><button className="btn outline" onClick={()=>setConfirmReset(false)}>Cancel</button><button className="btn primary" onClick={()=>{setConfirmReset(false);edit(()=>null)}}>Start fresh</button></div>}</>}
        </article>}
      </section>
      <aside className="lab-aside stack">
        <div className="card padded lab-run-status"><h2>{statusLabel[phase]}</h2>
          {phase==='work'&&attempt.deadline?<div className="timer" aria-label="Time remaining"><Timer size={18}/> {timeLabel(remaining)}</div>:<p>{challenge.minutes} suggested min · {markTotal} marks</p>}
          {inWork&&<p>{completedTasks} of {challenge.tasks.length} responses saved</p>}{(phase==='review'||reviewed)&&<p><strong>{points}/{markTotal}</strong> self-marked</p>}
        </div>
        {challenge.pack&&<div className="card padded"><h2>Offline exam kit</h2><p>{challenge.pack.description||'Candidate brief, Word starter and Excel starter with synthetic data.'}</p><button className="btn outline" onClick={downloadPack}><Download size={16}/> Download exam kit</button>{savedPack&&<p className="success compact"><Check size={14}/> Available offline in this browser</p>}</div>}
        {(challenge.evidence||(!inWork&&attempt?.evidence.length>0))&&<details className="card padded lab-sources"><summary>{challenge.evidence?'Evidence checklist':'Saved evidence'}</summary>{challenge.evidence&&<ul>{challenge.evidence.map(item=><li key={item}>{item}</li>)}</ul>}{!inWork&&attempt?.evidence.map(file=><button className="btn text-button" key={file.id} onClick={()=>getEvidence(file)}><Download size={15}/> {file.file}</button>)}</details>}
        <details className="card padded lab-sources"><summary>Curriculum and source notes</summary><p className="compact">Sankofa practice scenarios use original or synthetic data. Source links are for optional follow-up.</p><ul>{challenge.sources.map(id=>{const ref=challengeSources[id];return <li key={id}><a href={ref.url} target="_blank" rel="noreferrer">{ref.title} <ArrowUpRight size={13}/></a><small>{ref.type}</small></li>})}</ul></details>
      </aside>
    </div>
  </>
}

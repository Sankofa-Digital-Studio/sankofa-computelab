import { challenges, challengeSources } from './challenge-data'
import React,{useState} from 'react'
import { Bell, BookOpen, ClipboardList, Download, FileText, LockKeyhole, MessageSquare, Plus, Search, Send, Upload } from 'lucide-react'
import { Empty, Header, IconTile, Select } from './ui'
import { assignments, courses, materials, notices } from './data'
import { downloadFile, saveFile } from './files'
import { groupBy, materialCatalogue, score } from './store'

const unique=(items,key)=>[...new Set(items.map(item=>item[key]))].sort()
const date=()=>new Date().toISOString()
const stamp=value=>value&&new Date(value).toLocaleString('en-ZA',{dateStyle:'medium',timeStyle:'short'})
export function useFiles(update,notify){
  return async (version,item)=>{
    try {
      await downloadFile(version)
      if(item) update(s=>({...s,downloads:[...s.downloads,{id:item.id,title:item.title,course:item.course,version:version.label,date:date(),student:'Demo student'}]}))
      notify('Download started.')
    } catch(error){notify(error.message||'Download unavailable.')}
  }
}

function MaterialCard({item,state,update,download}) {
  const [attempt,setAttempt]=useState('')
  const memo=item.memoOnly ? item.versions.at(-1) : item.memo
  const receipt=state.paperAttempts[item.id]
  const completed=receipt||state.activity.includes(item.id)
  return <article className="card material-card">
    <div className="row-card"><IconTile icon={FileText} color={item.type==='Past paper'?'peach':'mint'}/><div><small>{item.type} · {item.session}</small><h3>{item.title}</h3><p>{item.note||[item.topic,item.app].join(' / ')}</p></div>{!item.memoOnly&&<button className="btn outline push-right" onClick={()=>download(item.versions.at(-1),item)}><Download size={17}/> Download</button>}</div>
    <div className="material-meta"><span className="pill neutral">Latest · {item.versions.at(-1).label}</span><span className="muted compact">Downloads can be reopened offline on this device.</span></div>
    {item.versions.length>1&&(!item.memoOnly||completed)&&<details><summary>Version history ({item.versions.length})</summary>{[...item.versions].reverse().map(v=><div className="history-row" key={v.id}><span>{v.label} · {v.file} {v.date?' · '+stamp(v.date):''}</span><button className="btn text-button" onClick={()=>download(v,item)}><Download size={16}/> Get version</button></div>)}</details>}
    {memo&&<details><summary><LockKeyhole size={15}/> Official marking guideline</summary>
      {completed?<div className="memo"><p>Your attempt is recorded on this device.</p>{receipt&&<p className="prewrap compact">{receipt.notes} · {stamp(receipt.date)}</p>}<button className="btn outline" onClick={()=>download(memo,item)}><Download size={16}/> Download marking guideline</button></div>:<form onSubmit={e=>{e.preventDefault();if(attempt.trim())update(s=>({...s,paperAttempts:{...s.paperAttempts,[item.id]:{notes:attempt.trim(),date:date()}}}))}}><p className="muted compact">Complete the paper in your Office applications. Record what you attempted to unlock the official marking guideline.</p><label className="field"><span>Sections attempted and working files saved</span><textarea required value={attempt} onChange={e=>setAttempt(e.target.value)}/></label><button className="btn primary" disabled={!attempt.trim()}>Record attempt & reveal memo</button></form>}
    </details>}
  </article>
}

export function Library({state,update,course,setCourse,notify}) {
  const [filter,setFilter]=useState({query:'',topic:'',app:'',type:'',session:''})
  const scoped=materialCatalogue(materials,state.materials).filter(row=>row.course===course)
  const rows=scoped.filter(row=>Object.entries(filter).every(([key,value])=>!value||(key==='query'?[row.title,row.note,row.topic,row.app].join(' ').toLowerCase().includes(value.toLowerCase().trim()):row[key]===value)))
  const download=useFiles(update,notify)
  const references=[...new Set(challenges.filter(row=>row.course===course).flatMap(row=>row.sources))].map(id=>challengeSources[id])
  return <><Header eyebrow="COURSE RESOURCES" title="Study Library" description="Find past papers, worksheets and course material. Download resources before studying offline."/>
    <div className="card filter-card"><label className="search"><Search size={18}/><input aria-label="Search study material" value={filter.query} onChange={e=>setFilter({...filter,query:e.target.value})} placeholder="Search study material"/></label><div className="filters"><Select label="Course" options={courses} value={course} onChange={id=>{setCourse(id);setFilter({query:'',topic:'',app:'',type:'',session:''})}}/>{[['topic','Topic'],['app','Application or skill'],['type','Material type'],['session','Exam session']].map(([key,label])=><Select key={key} label={label} options={unique(scoped,key)} value={filter[key]} all={'All '+(key==='app'?'applications':key==='type'?'types':(key==='session'?'sessions':key+'s'))} onChange={value=>setFilter({...filter,[key]:value})}/>)}</div></div>
    <div className="section-head"><div><h2>{rows.length} {rows.length===1?'resource':'resources'}</h2></div></div>
    <div className="stack">{rows.map(item=><MaterialCard key={item.id} item={item} state={state} update={update} download={download}/>)}</div>
    {!rows.length&&scoped.length>0&&<Empty icon={BookOpen} title="No matching resources"><button className="btn outline" onClick={()=>setFilter({query:'',topic:'',app:'',type:'',session:''})}>Clear filters</button></Empty>}
    {references.length>0&&<section><div className="section-head"><div><h2>Reading and practice references</h2><p>Optional source links for this course. Drive may ask you to sign in.</p></div></div><div className="lab-grid">{references.map(ref=><a className="card padded library-reference" key={ref.url} href={ref.url} target="_blank" rel="noreferrer"><small>{ref.type}</small><h3>{ref.title}</h3></a>)}</div></section>}
  </>
}

export function Assignments({course,state,update,notify}) {
  const [busy,setBusy]=useState(false)
  const download=useFiles(update,notify)
  async function submit(e,assignment){
    e.preventDefault()
    if(busy)return
    const form=e.currentTarget
    const fields=new FormData(form)
    const file=fields.get('file')
    if(!file?.size){notify('Choose a file to upload.');return}
    const id=crypto.randomUUID()
    setBusy(true)
    try {
      await saveFile(id,file)
      update(s=>({...s,submissions:[...s.submissions,{id,assignment:assignment.id,title:assignment.title,course,file:file.name,note:fields.get('note'),date:date()}]}))
      form.reset()
      notify('Submission saved to this device.')
    } catch {notify('This device could not store the file.')}
    finally {setBusy(false)}
  }
  return <><Header eyebrow="COURSEWORK" title="Assignments" description="Attach your editable work and keep a local submission receipt."/><div className="stack">{assignments.filter(row=>row.course===course).map(row=><article className="card padded" key={row.id}><IconTile icon={ClipboardList} color="blue"/><h2>{row.title}</h2><p>{row.description}</p><form onSubmit={e=>submit(e,row)}><label className="field"><span>Working file</span><input required type="file" name="file"/></label><label className="field"><span>Submission note (optional)</span><textarea name="note"/></label><button className="btn primary" disabled={busy}><Upload size={16}/> Save submission</button></form>{state.submissions.filter(v=>v.assignment===row.id).slice().reverse().map(v=><div className="history-row" key={v.id}><div><strong>{v.file}</strong><p className="compact muted">Saved locally · {stamp(v.date)}</p>{v.note&&<p>{v.note}</p>}</div><button className="btn text-button" onClick={()=>download(v)}><Download size={17}/> Download</button></div>)}</article>)}</div></>
}

export function Feedback({state,update,course,admin=false,notify}) {
  const items=state.feedback.filter(item=>admin?courses.some(c=>c.id===item.course):item.course===course).slice().reverse()
  function post(e) {
    e.preventDefault()
    const data=new FormData(e.currentTarget)
    const title=String(data.get('title')).trim()
    const body=String(data.get('body')).trim()
    if(!title||!body)return
    update(s=>({...s,feedback:[...s.feedback,{id:crypto.randomUUID(),title,body,course,date:date(),replies:[]}]}))
    e.currentTarget.reset()
    notify('Feedback saved on this device.')
  }
  function reply(e,id){
    e.preventDefault()
    const body=String(new FormData(e.currentTarget).get('reply')).trim()
    if(!body)return
    update(s=>({...s,feedback:s.feedback.map(row=>row.id===id?{...row,replies:[...row.replies,{id:crypto.randomUUID(),body,date:date()}]}:row)}))
    e.currentTarget.reset()
    notify('Reply saved.')
  }
  return <div className="stack">{!admin&&<><Header eyebrow="COURSE SUPPORT" title="Feedback" description="Ask a question or share feedback about your learning material. Messages and replies stay on this device in this version."/><form className="card padded narrow" onSubmit={post}><h2>New feedback</h2><label className="field"><span>Subject</span><input required name="title"/></label><label className="field"><span>Message</span><textarea required name="body"/></label><button className="btn primary"><Send size={16}/> Save feedback</button></form></>}{items.map(item=><article className="card padded" key={item.id}><h3>{item.title}</h3><p className="compact muted">{courses.find(c=>c.id===item.course)?.title} · {stamp(item.date)}</p><p className="prewrap">{item.body}</p>{item.replies.map(r=><div className="memo" key={r.id}><h4>Admin reply</h4><p className="prewrap">{r.body}</p><small>{stamp(r.date)}</small></div>)}{admin&&<form onSubmit={e=>reply(e,item.id)}><label className="field"><span>Reply to student</span><textarea name="reply" required/></label><button className="btn primary">Save reply</button></form>}</article>)}{!items.length&&<Empty icon={MessageSquare} title="No feedback yet"/>}</div>
}

async function deviceNotification(title,body) {
  if (!('Notification' in window) || !('serviceWorker' in navigator)) return false
  const registration=await navigator.serviceWorker.getRegistration()
  if(Notification.permission!=='granted'||!registration?.active) return false
  await registration.showNotification(title,{body,icon:'/icon-192.png'})
  return true
}
export function Notices({state,notify}){
  async function test(){
    try {
      if(!('Notification' in window)){notify('Device notifications are unavailable in this browser.');return}
      const permission=await Notification.requestPermission()
      if(permission!=='granted'){notify('Notifications need browser permission.');return}
      const shown=await deviceNotification('Sankofa ComputeLab','Device notification test.')
      notify(shown?'Test notification sent to this device.':'Notifications need an active service worker.')
    } catch {notify('Device notifications are unavailable in this browser.')}
  }
  return <><Header eyebrow="COLLEGE INFORMATION" title="College Notices" description="See announcements saved on this device. Live push delivery requires a connected service."><button className="btn outline" onClick={test}><Bell size={17}/> Test device notifications</button></Header><div className="stack">{[...state.notices].reverse().concat(notices).map(row=><article className="card row-card notice" key={row.id}><IconTile icon={Bell} color="peach"/><div><small>{row.date==='Sample college notice'?row.date:stamp(row.date)}</small><h3>{row.title}</h3><p className="prewrap">{row.body}</p></div></article>)}</div></>
}

export function Admin({state,update,notify,leave}){
  const [tab,setTab]=useState('materials')
  const [course,setCourse]=useState('cpn6')
  const [target,setTarget]=useState('')
  const [busy,setBusy]=useState(false)
  const download=useFiles(update,notify)
  const scoped = rows => rows.filter(row=>courses.some(course=>course.id===row.course))
  const all=scoped(materialCatalogue(materials,state.materials))
  const attempts=scoped(state.attempts)
  const downloads=scoped(state.downloads)
  const submissions=scoped(state.submissions)
  const computed=score(attempts)
  const byItem=groupBy(downloads,row=>row.id).map(([id,rows])=>({id,title:rows.at(-1).title,count:rows.length,last:rows.at(-1)})).sort((a,b)=>b.count-a.count)
  async function upload(e){
    e.preventDefault()
    if(busy)return
    const form=e.currentTarget
    const data=new FormData(form)
    const file=data.get('file')
    const existing=all.find(row=>row.id===target)
    const title=String(data.get('title')||'').trim()
    if(!file?.size||(!existing&&!title)){notify('Add a title and choose a file.');return}
    const id=crypto.randomUUID()
    const v={id,file:file.name,date:date(),label:'v'+((existing?.versions.length||0)+1)}
    setBusy(true)
    try {
      await saveFile(id,file)
      update(s=>{
        const original=materialCatalogue(materials,s.materials).find(row=>row.id===target)
        if(original){
          const replacement={...original,versions:[...original.versions,{...v,label:'v'+(original.versions.length+1)}]}
          return {...s,materials:materialCatalogue(s.materials,[replacement])}
        }
        return {...s,materials:[...s.materials,{id,course,title,topic:String(data.get('topic')).trim()||'General',app:String(data.get('app')).trim()||'General',session:String(data.get('session')).trim()||'Coursework',type:data.get('type'),note:String(data.get('note')).trim(),versions:[v]}]}
      })
      form.reset()
      setTarget('')
      notify(existing?'Replacement saved as a new version.':'Material saved on this device.')
    } catch {notify('This device could not store the file.')}
    finally {setBusy(false)}
  }
  function postNotice(e){
    e.preventDefault()
    const form=e.currentTarget
    const data=new FormData(form)
    const title=String(data.get('title')).trim()
    const body=String(data.get('body')).trim()
    if(!title||!body)return
    update(s=>({...s,notices:[...s.notices,{id:crypto.randomUUID(),title,body,date:date()}]}))
    form.reset()
    notify('Notice saved on this device.')
    deviceNotification(title,body).catch(()=>{})
  }
  return <><Header eyebrow="ADMIN DEMO" title="Admin Dashboard" description="Manage material, review local student activity and reply to feedback."><button className="btn outline" onClick={leave}>Back to student view</button></Header>
    <div className="stat-grid">{[['Materials',all.length],['Downloads',downloads.length],['Scored attempts',attempts.length],['Submissions',submissions.length]].map(([label,value])=><div key={label} className="card stat"><small>{label}</small><strong>{value}</strong></div>)}</div>
    <nav className="tabs" aria-label="Admin areas">{[['materials','Materials'],['analytics','Analytics'],['submissions','Submissions'],['feedback','Feedback'],['notices','Notices']].map(([id,label])=><button key={id} aria-current={tab===id?'page':undefined} className={tab===id?'active':''} onClick={()=>setTab(id)}>{label}</button>)}</nav>
    {tab==='materials'&&<div className="stack"><form className="card padded" onSubmit={upload}><h2>{target?'Replace material':'Upload material'}</h2><div className="filters"><Select label="Action" value={target} onChange={setTarget} options={all.map(row=>({id:row.id,title:'Replace · '+row.title}))} all="Add new material"/>{!target&&<Select label="Course" value={course} onChange={setCourse} options={courses}/>}</div>
    {!target&&<><label className="field"><span>Title</span><input required name="title"/></label><div className="filters">{[['topic','Topic'],['app','Application or skill'],['session','Exam session']].map(([id,label])=><label className="field" key={id}><span>{label}</span><input name={id}/></label>)}<label className="field"><span>Type</span><select name="type">{['Study guide','Past paper','Practice pack','Assignment brief','Lesson notes','Marking reference'].map(v=><option key={v}>{v}</option>)}</select></label></div><label className="field"><span>Description</span><input name="note"/></label></>}
    <label className="field"><span>File</span><input required name="file" type="file"/></label><button disabled={busy} className="btn primary"><Upload size={16}/> {target?'Save new version':'Upload material'}</button></form>
    <div className="card padded"><h2>Material catalogue</h2>{all.map(row=><div className="history-row" key={row.id}><div><strong>{row.title}</strong><p className="compact muted">{courses.find(c=>c.id===row.course)?.title} · {row.versions.length} {row.versions.length===1?'version':'versions'}</p></div><button className="btn outline" onClick={()=>{setTarget(row.id);window.scrollTo({top:0,behavior:'smooth'})}}>Replace</button></div>)}</div></div>}
    {tab==='analytics'&&<div className="stack"><div className="card padded"><h2>Download activity</h2>{byItem.length?byItem.map(row=><div className="history-row" key={row.id}><div><strong>{row.title}</strong><p>{row.last.student} · {stamp(row.last.date)}</p></div><span className="pill neutral">{row.count} downloads</span></div>):<p>Downloads from this device will appear here.</p>}</div><div className="card padded"><h2>Student progress</h2><p>Demo student · {attempts.length} scored attempts · {computed.possible?computed.percent+'% across attempts':'Awaiting scores'}</p>{courses.map(row=><div className="history-row" key={row.id}><strong>{row.title}</strong><span>{attempts.filter(a=>a.course===row.id).length} attempts</span></div>)}</div></div>}
    {tab==='submissions'&&<div className="stack">{submissions.length?[...submissions].reverse().map(row=><article className="card row-card" key={row.id}><IconTile icon={ClipboardList} color="blue"/><div><h3>{row.title}</h3><p>{row.file} · {stamp(row.date)}</p>{row.note&&<p>{row.note}</p>}</div><button className="btn outline push-right" onClick={()=>download(row)}><Download size={17}/> Download</button></article>):<Empty title="No local submissions yet"/>}</div>}
    {tab==='feedback'&&<Feedback state={state} update={update} notify={notify} admin/>}
    {tab==='notices'&&<div className="stack"><form className="card padded narrow" onSubmit={postNotice}><IconTile icon={Bell} color="peach"/><h2>New college notice</h2><label className="field"><span>Title</span><input required name="title"/></label><label className="field"><span>Message</span><textarea required name="body"/></label><button className="btn primary"><Plus size={16}/> Post local notice</button></form>{[...state.notices].reverse().map(row=><article className="card padded" key={row.id}><h3>{row.title}</h3><p className="prewrap">{row.body}</p></article>)}</div>}
  </>
}

import React,{useEffect,useRef,useState} from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Bell, BookOpen, ChartNoAxesColumnIncreasing, ChevronDown, ClipboardList, CloudOff, FlaskConical, LayoutDashboard, Monitor, Menu, MessageSquare, Settings2, Target, Wifi, X } from 'lucide-react'
import { Dashboard } from './ui'
import { Learning } from './learning'
import { ChallengeLab } from './challenge'
import { Practice, Progress } from './practice'
import { Admin, Assignments, Feedback, Library, Notices } from './college'
import { courses } from './data'
import { commitAttemptRows,key,load } from './store'
import questions from './questions.json'
import { levelQuestions } from './level-practice'
import './style.css'

const nav = [
  ['overview','Overview',LayoutDashboard],
  ['library','Study Library',BookOpen],
  ['practice','Practice Hub',Target],
  ['challenges','Challenge Lab',FlaskConical],
  ['learning','Mastery Pathway',BookOpen],
  ['progress','My Progress',ChartNoAxesColumnIncreasing],
  ['assignments','Assignments',ClipboardList],
  ['feedback','Feedback',MessageSquare],
  ['notices','College Notices',Bell]
]
const valid=new Set([...nav.map(row=>row[0]),'admin'])
const pageFromHash=()=>{const id=window.location.hash.slice(1).split('/')[0];return valid.has(id)?id:'overview'}
const chosenCourse=()=>{try{return courses.some(row=>row.id===localStorage.getItem('sankofa-course'))?localStorage.getItem('sankofa-course'):'cpn6'}catch{return 'cpn6'}}
function App(){
  const [page,setPage]=useState(pageFromHash)
  const [selectedChallenge,setSelectedChallenge]=useState(()=>window.location.hash.split('/')[1]||'')
  const [course,setCourse]=useState(chosenCourse)
  const [state,setState]=useState(load)
  const [tab,setTab]=useState('questions')
  const [app,setApp]=useState('')
  const [menu,setMenu]=useState(false)
  const [online,setOnline]=useState(navigator.onLine)
  const [toast,setToast]=useState('')
  const [install,setInstall]=useState(null)
  const toastTimer=useRef()
  const stateRef=useRef(state)
  useEffect(()=>{
    const move=()=>{setPage(pageFromHash());setSelectedChallenge(window.location.hash.split('/')[1]||'');setMenu(false);window.scrollTo(0,0)}
    const connection=()=>setOnline(navigator.onLine)
    const request=e=>{e.preventDefault();setInstall(e)}
    const installed=()=>setInstall(null)
    window.addEventListener('hashchange',move); window.addEventListener('online',connection); window.addEventListener('offline',connection);window.addEventListener('beforeinstallprompt',request);window.addEventListener('appinstalled',installed)
    return ()=>{window.removeEventListener('hashchange',move);window.removeEventListener('online',connection);window.removeEventListener('offline',connection);window.removeEventListener('beforeinstallprompt',request);window.removeEventListener('appinstalled',installed);clearTimeout(toastTimer.current)}
  },[])
  useEffect(()=>{document.title=(nav.find(item=>item[0]===page)?.[1]||'Admin Dashboard')+' · Sankofa ComputeLab'},[page])
  function notify(message){setToast(message);clearTimeout(toastTimer.current);toastTimer.current=setTimeout(()=>setToast(''),3600)}
  function update(fn){
    const current=stateRef.current
    const next=fn(current)
    if(current===next)return
    stateRef.current=next
    setState(next)
    try{localStorage.setItem(key,JSON.stringify(next))}catch{setTimeout(()=>notify('Browser storage is full or unavailable. Changes may be lost when you close the page.'),0)}
  }
  function chooseCourse(id){setCourse(id);setApp('');try{localStorage.setItem('sankofa-course',id)}catch{}}
  function go(id){setPage(id);setMenu(false);if(window.location.hash!=='#'+id)window.location.hash=id;window.scrollTo(0,0)}
  function chooseChallenge(id){setPage('challenges');setSelectedChallenge(id);window.location.hash='challenges'+(id?'/'+id:'');window.scrollTo(0,0)}
  function openPractice(id,application=''){setTab(id);setApp(application);go('practice')}
  function commit(rows,runId){
    update(s=>commitAttemptRows(s,rows,runId,new Date().toISOString()))
  }
  const shared={state,update,course,notify}
  const pages={
    overview:<Dashboard state={state} onNav={go} onPractice={openPractice} questions={[...questions,...levelQuestions]} course={course} setCourse={chooseCourse} courses={courses}/>,
    library:<Library key={course} {...shared} setCourse={chooseCourse}/>,
    practice:<Practice key={course} {...shared} tab={tab} setTab={setTab} app={app} setApp={setApp} commit={commit}/>,
    challenges:<ChallengeLab {...shared} selected={selectedChallenge} choose={chooseChallenge}/>,
    learning:<Learning key={course + selectedChallenge} initialTab={selectedChallenge === 'diagnose' ? 'diagnose' : 'path'} {...shared} onNav={go}/>,
    progress:<Progress {...shared} openPractice={openPractice} openChallenge={chooseChallenge}/>,
    assignments:<Assignments {...shared}/>,
    feedback:<Feedback {...shared}/>,
    notices:<Notices {...shared}/>,
    admin:<Admin {...shared} leave={()=>go('overview')}/>
  }
  return <div className="shell">
    <a className="skip" href="#main-content" onClick={e=>{e.preventDefault();document.getElementById('main-content').focus()}}>Skip to content</a>
    {menu&&<button className="overlay" aria-label="Close navigation" onClick={()=>setMenu(false)}/>}
    <aside className={'sidebar '+(menu?'visible':'')}>
      <a href="#overview" className="brand" onClick={()=>go('overview')}><span className="brand-mark"><Monitor size={21} strokeWidth={2}/></span><span>ComputeLab <small>Sankofa · Computer Practice</small></span></a>
      <button className="icon-button close-menu" aria-label="Close navigation" onClick={()=>setMenu(false)}><X size={21}/></button>
      <div className="nav-label">WORKSPACE</div>
      <nav aria-label="Main navigation">{nav.map(([id,label,Icon])=><a key={id} href={'#'+id} className={id===page?'active':''} aria-current={id===page?'page':undefined} onClick={()=>go(id)}><Icon size={18} strokeWidth={1.8}/><span>{label}</span></a>)}</nav>
      <div className="sidebar-footer">{install&&<button className="btn outline install" onClick={async()=>{await install.prompt();setInstall(null)}}>Install ComputeLab</button>}<a href="#admin" className={'admin-link '+(page==='admin'?'active':'')} aria-current={page==='admin'?'page':undefined} onClick={()=>go('admin')}><Settings2 size={18}/> Admin demo <ArrowUpRight size={15}/></a><p>Progress saved on this device</p></div>
    </aside>
    <div className="workspace">
      <header className="topbar">
        <div className="top-left"><button className="icon-button menu-button" aria-expanded={menu} aria-label="Open navigation" onClick={()=>setMenu(true)}><Menu size={23}/></button><span className="top-crumb">{nav.find(item=>item[0]===page)?.[1]||'Admin Dashboard'}</span><span className="mobile-brand">Sankofa ComputeLab</span></div>
        <div className="top-right"><span className={'status '+(!online?'offline':'')}>{online?<Wifi size={15}/>:<CloudOff size={15}/>} <span>{online?'Online':'Offline'}</span></span><a href="#notices" className="icon-button top-bell" aria-label="College notices" onClick={()=>go('notices')}><Bell size={19}/></a><label className="course-switch"><span className="avatar">{courses.find(row=>row.id===course)?.code}</span><select aria-label="Active course shortcut" value={course} onChange={e=>chooseCourse(e.target.value)}>{courses.map(row=><option key={row.id} value={row.id}>{row.title}</option>)}</select><ChevronDown size={14}/></label></div>
      </header>
      <main id="main-content" tabIndex={-1}>{pages[page]}</main>
    </div>
    <nav className="bottom-nav" aria-label="Quick navigation">{nav.filter(row=>row[0]!=='learning').slice(0,5).map(([id,label,Icon])=><a key={id} href={'#'+id} className={page===id?'active':''} aria-current={page===id?'page':undefined} onClick={()=>go(id)}><Icon size={19}/><span>{{overview:'Overview',library:'Library',practice:'Practice',challenges:'Lab',progress:'Progress'}[id]}</span></a>)}<button onClick={()=>setMenu(true)} aria-label="More pages"><Menu size={19}/><span>More</span></button></nav>
    {toast&&<div className="toast" role="status">{toast}</div>}
  </div>
}
if(import.meta.env.PROD&&'serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('/sw.js').catch(()=>{}))
createRoot(document.getElementById('root')).render(<App/>)

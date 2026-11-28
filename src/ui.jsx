import React from 'react'
import { diagnosticAction } from './diagnostic-action.js'
import { CapabilityDisclosure } from './CapabilityDisclosure.jsx'
import { capabilities } from './capabilities.js'
import { readGateStore } from './n5-gate-engine.js'
import { readLecturerStore } from './lecturer-engine.js'
import { Route, ArrowRight, ArrowUpRight, Bell, BookMarked, BookOpen, Bookmark, ChartNoAxesColumnIncreasing, ClipboardList, Database, FileText, Globe, GraduationCap, Layers3, LockKeyhole, Network, NotebookPen, ShieldCheck, Table2, Target, Timer, FileCheck2 } from 'lucide-react'

export const appIcons = {Theory:BookOpen, OneNote:NotebookPen, Word:FileText, Excel:Table2, Integrated:Layers3}
export const appColors = {Theory:'purple', OneNote:'pink', Word:'blue', Excel:'mint', Integrated:'peach'}
export function IconTile({icon: Icon, color='mint', className=''}) {
  return <span className={'icon-tile '+color+' '+className}><Icon size={21} strokeWidth={1.85}/></span>
}
export function Header({eyebrow,title,description,children}) {
  return <div className="page-head"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{children}</div>
}
export function Empty({icon:Icon=BookMarked,title,children}) {
  return <div className="empty"><Icon size={25}/><h3>{title}</h3>{children && <div>{children}</div>}</div>
}
export function Select({label,options,value,onChange,all}) {
  return <label className="field"><span>{label}</span><select value={value} onChange={e=>onChange(e.target.value)}>{all !== undefined && <option value="">{all}</option>}{options.map(option=>typeof option==='string' ? <option key={option}>{option}</option> : <option key={option.id} value={option.id}>{option.title}</option>)}</select></label>
}
export function Dashboard({state,onNav,onPractice,questions,course,setCourse,courses}) {
  const touched = new Set(state.attempts.filter(row=>questions.some(q=>q.id===row.id && q.course===course)).map(row=>row.id))
  const count = questions.filter(row=>row.course===course).length
  const percent = count ? Math.round(touched.size/count*100) : 0
  const savedCount=questions.filter(row=>row.course===course&&state.bookmarks.includes(row.id)).length
  const actions = [
    [Route,'mint','Mastery pathway','Follow your learning sequence, diagnose gaps and record corrections.',()=>onNav('learning')],
    [Target,'peach','Question bank','Work through exam-style tasks by topic, app or session.',()=>onPractice('questions')],
    [Layers3,'purple','Flashcards','Recall key terms and practical shortcuts.',()=>onPractice('flashcards')],
    [Timer,'mint','Timed quizzes','Check your recall under a time limit.',()=>onPractice('quiz')],
    [ClipboardList,'blue','Mock exams','Rehearse whole sections or create your own mock.',()=>onPractice('mocks')]
  ]
  const gateStore = readGateStore()
  const lecturerStore = readLecturerStore()
  const studentCode = gateStore?.session?.studentCode || 'local-learner'
  const activeAlerts = (lecturerStore.alerts || []).filter(
    a => (a.targetStudentCode === 'ALL' || a.targetStudentCode === studentCode) && !(a.dismissedBy || []).includes(studentCode)
  )
  const customPathway = lecturerStore.customPathways?.[studentCode] || null
  const gateDecision = lecturerStore.gateDecisions?.[studentCode] || null
  const toolActions = course === 'cpn5'
    ? [
        [ShieldCheck,'mint','N5 Gate 01','Locked 50-minute gate, leak profile, recovery drills & submission.',()=>onNav('n5-gate')],
        [Layers3,'blue','Topic 1 Hub','Sections 1–8 concepts, CBT traps, Quick Checks & practical evidence.',()=>onNav('topic-1')],
        [Network,'purple','Topic 2 Hub','Network types, architectures, Digital Era e-concepts & 150-mark mastery.',()=>onNav('topic-2')],
        [Database,'blue','Topic 3 Hub','Data vs Info, Computational Thinking, keys, queries & verification.',()=>onNav('topic-3')],
        [Globe,'mint','Topic 4 Hub','Internet apps, Web 1.0–4.0, service tech, static/dynamic sites & search evaluation.',()=>onNav('topic-4')],
        [LockKeyhole,'peach','Topic 5 Hub','Emerging tech, ICT impact, cybercrime methods, prevention & ICT ethics.',()=>onNav('topic-5')],
        ...actions
      ]
    : actions
  return <>
    <Header eyebrow="STUDENT WORKSPACE" title="Computer Practice workspace" description="Build practical computer skills for N5 and N6, then test them under exam conditions.">
      <Select label="Active course" value={course} onChange={setCourse} options={courses}/>
    </Header>
    <CapabilityDisclosure label="What this workspace supports" items={capabilities}/>
    {(activeAlerts.length > 0 || customPathway || gateDecision) && (
      <section className="card padded" style={{marginBottom:16}} aria-label="Lecturer pathway and alerts">
        <div className="eyebrow"><Bell size={13}/> LECTURER UPDATES · {studentCode}</div>
        {gateDecision && <p className="compact"><strong>Gate status:</strong> {gateDecision.decision}{gateDecision.note ? ` — ${gateDecision.note}` : ''}</p>}
        {activeAlerts.slice(0,2).map(a => <p className="compact" key={a.id}><strong>[{a.severity.toUpperCase()}] {a.title}:</strong> {a.message}</p>)}
        {customPathway && (
          <div style={{marginTop:6}}>
            <p className="compact"><strong>Assigned Custom Pathway ({customPathway.steps.filter(s=>s.completed).length}/{customPathway.steps.length} done):</strong> {customPathway.note}</p>
            <div className="button-row" style={{marginTop:6}}>
              {customPathway.steps.slice(0,3).map(step => (
                <button key={step.id} className="btn outline" onClick={()=>onNav(step.route)}>{step.title} <ArrowRight size={14}/></button>
              ))}
              <button className="btn text-button" onClick={()=>onNav('feedback')}>Open Help &amp; Pathway Details</button>
            </div>
          </div>
        )}
      </section>
    )}
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-kicker"><GraduationCap size={16}/> EXAM PREPARATION</div>
        <h2>{courses.find(c=>c.id===course)?.title}</h2>
        <p>Build your answer, check the evidence and apply the skill when the facts change.</p>
        <div className="hero-actions"><a className="btn accent" href="#learning/diagnose">{diagnosticAction(state.learning?.[course]?.run)} <ArrowRight size={17}/></a>{count>0&&<button className="btn hero-secondary" onClick={()=>onNav('library')}>Browse study materials <ArrowUpRight size={16}/></button>}</div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="orbit first"/><div className="orbit second"/><div className="art-grid"/><div className="art-book"><BookOpen size={82} strokeWidth={1.12}/></div><span className="art-chip chip-sheet"><Table2 size={26}/></span><span className="art-chip chip-quiz"><FileCheck2 size={25}/></span><span className="art-star star-one">✦</span><span className="art-star star-two">✧</span><span className="art-dot"/></div>
    </section>
    {course==='cpn5'&&<section className="card n5g-callout" aria-label="N5 Gate 01 readiness workflow">
      <div className="n5g-callout-copy">
        <div className="eyebrow"><ShieldCheck size={14}/> N5 READINESS GATE 01</div>
        <h3>Complete the full 6-stage N5 Gate 01 cycle</h3>
        <p>Sign in with your cohort number, complete the 50-minute locked gate, review your rubric &amp; leak profile, finish targeted drills and submit your verification packet.</p>
      </div>
      <div className="button-row">
        <a className="btn primary" href="#n5-gate" onClick={e=>{e.preventDefault();onNav('n5-gate')}}>Open N5 Gate 01 (Auth → Submission) <ArrowRight size={16}/></a>
        <a className="btn outline" href="#topic-1" onClick={e=>{e.preventDefault();onNav('topic-1')}}>Open Topic 1 Modules (Sections 1–8) <ArrowRight size={16}/></a>
        <a className="btn outline" href="#topic-2" onClick={e=>{e.preventDefault();onNav('topic-2')}}>Open Topic 2 Modules (Networks) <ArrowRight size={16}/></a>
        <a className="btn outline" href="#topic-3" onClick={e=>{e.preventDefault();onNav('topic-3')}}>Open Topic 3 (Data &amp; Thinking) <ArrowRight size={16}/></a>
        <a className="btn outline" href="#topic-4" onClick={e=>{e.preventDefault();onNav('topic-4')}}>Open Topic 4 (Internet) <ArrowRight size={16}/></a>
        <a className="btn outline" href="#topic-5" onClick={e=>{e.preventDefault();onNav('topic-5')}}>Open Topic 5 (Digital Citizenship) <ArrowRight size={16}/></a>
      </div>
    </section>}
    <div className="dashboard-body">
      <section>
        <div className="section-head"><div><h2>Practice tools</h2><p>Choose how you want to prepare.</p></div></div>
        <div className="tool-grid">{toolActions.map(([icon,color,title,description,action])=><button className="tool-card" onClick={action} key={title}><IconTile icon={icon} color={color}/><ArrowUpRight className="card-arrow" size={17}/><h3>{title}</h3><p>{description}</p></button>)}</div>
      </section>
      <section>
        <div className="section-head"><div><h2>Your progress</h2><p>Pick up where you left off.</p></div></div>
        <div className="card progress-card">
          {count>0 && <div className="coverage"><div className="ring" style={{'--progress':percent+'%'}}><span>{percent}%</span></div><div><h3>Practice coverage</h3><p>{touched.size} of {count} questions marked</p></div></div>}
          <button className="progress-action" onClick={()=>onNav('progress')}><ChartNoAxesColumnIncreasing size={19}/> Scores & weak areas <ArrowRight size={15}/></button>
          <button className="progress-action" onClick={()=>onPractice('saved')}><Bookmark size={18}/> Bookmarked questions <span className="pill neutral">{savedCount}</span></button>
        </div>
      </section>
    </div>
    {count>0 && <section className="applications"><div className="section-head"><div><h2>Practise by application</h2><p>Find questions for the skills you want to improve.</p></div></div><div className="app-grid">{Object.entries(appIcons).filter(([app])=>questions.some(row=>row.course===course&&row.app===app)).map(([app,icon])=><button className="app-card" onClick={()=>onPractice('questions',app)} key={app}><IconTile icon={icon} color={appColors[app]}/><span>{app}<small>{questions.filter(row=>row.course===course&&row.app===app).length} activities</small></span><ArrowRight size={15}/></button>)}</div></section>}
  </>
}

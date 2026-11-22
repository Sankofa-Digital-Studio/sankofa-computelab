import React from 'react'
import { diagnosticAction } from './diagnostic-action.js'
import { CapabilityDisclosure } from './CapabilityDisclosure.jsx'
import { capabilities } from './capabilities.js'
import { Route, ArrowRight, ArrowUpRight, BookMarked, BookOpen, Bookmark, ChartNoAxesColumnIncreasing, CircleHelp, ClipboardList, FileText, GraduationCap, Layers3, LayoutGrid, NotebookPen, Table2, Target, Timer, FileCheck2 } from 'lucide-react'

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
  return <>
    <Header eyebrow="STUDENT WORKSPACE" title="Computer Practice workspace" description="Build practical computer skills for N5 and N6, then test them under exam conditions.">
      <Select label="Active course" value={course} onChange={setCourse} options={courses}/>
    </Header>
    <CapabilityDisclosure label="What this workspace supports" items={capabilities}/>
    <section className="hero">
      <div className="hero-copy">
        <div className="hero-kicker"><GraduationCap size={16}/> EXAM PREPARATION</div>
        <h2>{courses.find(c=>c.id===course)?.title}</h2>
        <p>Build your answer, check the evidence and apply the skill when the facts change.</p>
        <div className="hero-actions"><a className="btn accent" href="#learning/diagnose">{diagnosticAction(state.learning?.[course]?.run)} <ArrowRight size={17}/></a>{count>0&&<button className="btn hero-secondary" onClick={()=>onNav('library')}>Browse study materials <ArrowUpRight size={16}/></button>}</div>
      </div>
      <div className="hero-art" aria-hidden="true"><div className="orbit first"/><div className="orbit second"/><div className="art-grid"/><div className="art-book"><BookOpen size={82} strokeWidth={1.12}/></div><span className="art-chip chip-sheet"><Table2 size={26}/></span><span className="art-chip chip-quiz"><FileCheck2 size={25}/></span><span className="art-star star-one">✦</span><span className="art-star star-two">✧</span><span className="art-dot"/></div>
    </section>
    <div className="dashboard-body">
      <section>
        <div className="section-head"><div><h2>Practice tools</h2><p>Choose how you want to prepare.</p></div></div>
        <div className="tool-grid">{actions.map(([icon,color,title,description,action])=><button className="tool-card" onClick={action} key={title}><IconTile icon={icon} color={color}/><ArrowUpRight className="card-arrow" size={17}/><h3>{title}</h3><p>{description}</p></button>)}</div>
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

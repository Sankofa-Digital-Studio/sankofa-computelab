import diagnostics from './diagnostic-data.json' with {type:'json'}
import repairs from './remediation-data.json' with {type:'json'}
export {diagnostics,repairs}
export const labels={RIBBON_NAV:'Command selection',MAIL_MERGE:'Mail merge',SORT_FILTER:'Sort and filter',PRINT_OUTPUT:'Output checks',EXCEL_REFERENCING:'References',EXCEL_FUNCTIONS:'Functions',WORD_LAYOUT:'Word layout',THEORY_RECALL:'Theory recall',FILE_MGMT:'File control',INSTRUCTION_CONTROL:'Instruction control',TIME_DISCIPLINE:'Time planning',NOTEBOOK_WORKFLOW:'Notebook organisation',INTEGRATION_CONTROL:'Integration',COMMUNICATION_THEORY:'Communication',CLOUD_COLLAB:'Cloud permissions',SCREENSHOT_EVIDENCE:'Evidence capture',THEORY_EXPLANATION:'Explanation quality'}
export function diagnosticResult(course,run){
 const rows=diagnostics.filter(q=>q.course===course)
 const missed=rows.filter(q=>run.answers?.[q.id]!==q.correct)
 const counts={};for(const q of missed) counts[q.leak]=(counts[q.leak]||0)+1
 return {correct:rows.length-missed.length,total:rows.length,missed,overconfident:missed.filter(q=>run.confidence?.[q.id]==='certain').length,weaknesses:Object.entries(counts).sort((a,b)=>b[1]-a[1])}
}
export function recommendedRepairs(course,run){
 const weak=diagnosticResult(course,run).weaknesses.map(([key])=>key)
 return repairs.filter(q=>'cp'+q.subjectCode===course).sort((a,b)=>{
  const rank=x=>weak.indexOf(x.leak)<0?999:weak.indexOf(x.leak)
  return rank(a)-rank(b)
 })
}
export function proofComplete(proof){return ['plan','evidence','correction'].every(k=>Boolean(proof?.[k]?.trim()))}
export function repairComplete(q,attempt){return Boolean(attempt?.revealed&&attempt.answer?.trim()&&attempt.correction?.trim()&&q.answerPoints.every((_,i)=>attempt.points?.includes(i)))}
// Local planning model from the repository, not an official eligibility decision.
export function marksPlan(values){
 const maximum=[100,50,100],weights=[20,30,50]
 const present=values.map(v=>v!==''&&v!==undefined&&v!==null)
 const valid=values.every((v,i)=>!present[i]||(Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=maximum[i]))
 if(!valid)return {valid:false}
 const secured=values.reduce((s,v,i)=>s+(present[i]?Number(v)/maximum[i]*weights[i]:0),0)
 const remaining=weights.reduce((s,w,i)=>s+(!present[i]?w:0),0)
 return {valid:true,secured,remaining,complete:present.every(Boolean),needed:!present[2]&&present[0]&&present[1]?Math.max(0,(40-secured)*2):null}
}

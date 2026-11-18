export const courses = [
  {id:'cpn6', title:'Computer Practice N6', short:'Computer Practice N6', code:'N6', summary:'Theory, OneNote, Word and Excel'},
  {id:'cpn5', title:'Computer Practice N5', short:'Computer Practice N5', code:'N5', summary:'Theory, file management, OneNote, Word and Excel'},
]
export const sessions = ['September 2020','November 2022','November 2023','November 2024','May 2025','November 2025']
export const version = (id, file, path) => ({id, file, path, label:'Original'})
export const mayMemo = version('may-memo','N6-May-2025-marking-guideline.pdf','/papers/n6-may-2025-marking-guideline.pdf')
export const materials = [
  {id:'may25', course:'cpn6', title:'May 2025 question paper', topic:'Full examination', app:'Integrated', type:'Past paper', session:'May 2025', note:'23 May 2025 · X-paper · 3 hours · 180 marks', versions:[version('may25-v1','N6-May-2025-question-paper.pdf','/papers/n6-may-2025-paper.pdf')], memo:mayMemo},
  {id:'nov24', course:'cpn6', title:'November 2024 question paper', topic:'Full examination', app:'Integrated', type:'Past paper', session:'November 2024', note:'Scanned question paper · Theory, OneNote, Word and Excel', versions:[version('nov24-v1','N6-November-2024-question-paper.pdf','/papers/n6-november-2024-paper.pdf')]},
  {id:'nov23',course:'cpn6',title:'November 2023 question paper',topic:'Full examination',app:'Integrated',type:'Past paper',session:'November 2023',note:'14 November 2023 · X-paper · 3 hours · 180 marks',versions:[version('nov23-v1','N6-November-2023-question-paper.pdf','/papers/n6-november-2023-paper.pdf')]},
  {id:'nov22',course:'cpn6',title:'November 2022 question paper',topic:'Full examination',app:'Integrated',type:'Past paper',session:'November 2022',note:'7 November 2022 · X-paper · 3 hours · 180 marks',versions:[version('nov22-v1','N6-November-2022-question-paper.pdf','/papers/n6-november-2022-paper.pdf')]},
  {id:'sep20',course:'cpn6',title:'September 2020 question paper',topic:'Full examination',app:'Integrated',type:'Past paper',session:'September 2020',note:'9 September 2020 · X-paper · Theory plus either Word or Excel',versions:[version('sep20-v1','N6-September-2020-question-paper.pdf','/papers/n6-september-2020-paper.pdf')]},
  {id:'nov25-memo',course:'cpn6',title:'November 2025 marking guideline',topic:'Full examination',app:'Integrated',type:'Marking reference',session:'November 2025',note:'14 November 2025 · Marking guideline only. Use with your own copy of the matching paper.',versions:[version('nov25-memo-v1','N6-November-2025-marking-guideline.pdf','/papers/n6-november-2025-marking-guideline.pdf')],memoOnly:true},
  {id:'n6-formula-guide',course:'cpn6',title:'Formula Logic Walkthrough',topic:'Formula logic',app:'Excel',type:'Study guide',session:'Mastery preparation',note:'Sankofa guide · Read the task, choose the formula and verify the result.',versions:[version('n6-formula-guide-v1','N6-Formula-Logic-Walkthrough.pdf','/papers/n6-formula-logic.pdf')]},
  {id:'n5-theory-guide',course:'cpn5',title:'Theory to practice field guide',topic:'Computing concepts',app:'Theory',type:'Study guide',session:'Sankofa rehearsal',note:'Information processing, command words, evidence and boundary checks.',versions:[version('n5-theory-guide-v1','N5-Theory-to-Practice.txt','/papers/n5-theory-field-guide.txt')]},
  {id:'n5-rehearsal-kit',course:'cpn5',title:'Careers clinic rehearsal kit',topic:'Integrated practical',app:'Integrated',type:'Practice pack',session:'Sankofa rehearsal',note:'Student brief and editable Office starters · 90 minutes · 50 practice marks',versions:[version('n5-rehearsal-kit-v1','Sankofa-N5-Careers-Clinic.zip','/packs/n5-careers-clinic.zip')]},
  {id:'n6-formula-kit',course:'cpn6',title:'Formula Logic Lab kit',topic:'Formula logic',app:'Excel',type:'Practice pack',session:'Mastery preparation',note:'Offline candidate brief and editable loan, savings and eligibility workbook.',versions:[version('n6-formula-kit-v1','Sankofa-N6-Formula-Logic-Lab.zip','/packs/n6-formula-lab.zip')]},
  {id:'practice', course:'cpn6', title:'N6 student question bank', topic:'All topics', app:'Integrated', type:'Practice pack', session:'Multi-session', note:'20 original exam-style activities · Editable Word file', versions:[version('practice-v1','N6-Student-Question-Bank.docx','/papers/n6-practice-bank.docx')]},
]
export const flashcards = [
  ['Theory','How do verification and validation differ?','Verification compares data to its source. Validation checks whether a value follows a rule.'],
  ['Theory','What does SaaS mean?','Software as a service. You access a hosted application, usually through a browser or app.'],
  ['Theory','How do FTP and VoIP differ?','FTP transfers files. VoIP transports voice over IP networks.'],
  ['OneNote','What is the OneNote hierarchy?','Notebook → section → page. Organise subjects into sections and tasks into pages.'],
  ['OneNote','How can you prove a notebook task is complete?','Keep the editable notebook and capture or print the required page and hierarchy evidence.'],
  ['Word','How can one page be landscape in a portrait document?','Use section breaks around that page, then apply landscape orientation to that section.'],
  ['Word','What are the parts of a mail merge?','A main document, a recipient data source, merge fields and the finished merged output.'],
  ['Excel','What does $H$2 do when a formula is copied?','It locks column H and row 2 so every copy references the same cell.'],
  ['Excel','Which function counts cells meeting a rule?','COUNTIF. For example, =COUNTIF(B2:B6,">=20").'],
  ['Excel','How can you test a lookup?','Try a known code, compare its result with the source table, and test how a missing code is handled.'],
  ['Integrated','Which files should you check before submission?','Open each editable file and each requested printout or export. Check filenames, layout and evidence.']
].map(([app, front, back], i) => ({id:'F'+i,app,front,back}))
export const quiz = [
  {app:'Theory',title:'Verification',prompt:'Which action verifies captured attendance?',options:['Check that attendance is under 60','Compare the entries to the original register','Round all values to the nearest five'],answer:1,check:'Verification checks a copied value against its source.'},
  {app:'Word',title:'Page orientation',prompt:'What lets page two use a different orientation?',options:['A section break','A tab stop','A table caption'],answer:0,check:'Orientation is set per section.'},
  {app:'Excel',title:'Fixed rates',prompt:'Which reference keeps both the H column and row 2 fixed?',options:['H2','H$2','$H$2'],answer:2,check:'The two dollar signs lock column and row.'},
  {app:'OneNote',title:'Notebook structure',prompt:'Which structure is correct?',options:['Page → section → notebook','Notebook → section → page','Section → notebook → page'],answer:1,check:'Notebooks hold sections, which hold pages.'},
  {app:'Excel',title:'Criteria functions',prompt:'Which function counts entries that are greater than or equal to 20?',options:['SUM','COUNTIF','LARGE'],answer:1,check:'COUNTIF counts cells that meet the criterion.'},
  {app:'Integrated',title:'Exam evidence',prompt:'Which submission best demonstrates editable workbook skills?',options:['Only a photo of the screen','A PDF with no working file','The editable workbook and requested output evidence'],answer:2,check:'The editable file lets the marker inspect formulas and structure.'}
].map((row,i)=>({...row,id:'QZ'+i,marks:1}))
export const mockTemplates = [
  {id:'mock-n5-bridge',course:'cpn5',title:'N5 independent skills rehearsal',minutes:35,ids:['CPN5-4','CPN5-7','CPN5-10','CPN5-12']},
  {id:'mock-warmup',title:'N6 practical warm-up',minutes:45,ids:['T05','N02','W01','E02']},
  {id:'mock-integrated',title:'Integrated examination simulation',minutes:75,ids:['I02']}
]
export const assignments = [
  {id:'as-cpn5',course:'cpn5',title:'Careers clinic practical evidence',description:'Use the Challenge Lab rehearsal. Attach your editable workbook, briefing or evidence pack for local review.'},
  {id:'as-cpn6',course:'cpn6',title:'Spreadsheet formulas and evidence',description:'Complete E02 and upload the editable workbook. Check the commission rate, totals and currency formatting.'},
]
export const notices = [{id:'welcome',title:'Welcome to Sankofa ComputeLab',body:'Choose Computer Practice N5 or N6, then start with the question bank or a Challenge Lab rehearsal.',date:'Sample college notice'}]

export const GATE_ID = 'n5-gate-01'
export const GATE_TITLE = 'Gate 01 · Ribbon & Command Control'
export const GATE_SUBTITLE = 'Computer Practice N5 · Priority Student Gate'
export const GATE_DURATION_MINUTES = 50

export const N5_ROSTER = [
  { studentCode: 'N5-101', allocatedNumber: '101', firstName: 'Lerato', lastName: 'Mokoena', initialCode: 'N5-101' },
  { studentCode: 'N5-102', allocatedNumber: '102', firstName: 'Thabo', lastName: 'Ndlovu', initialCode: 'N5-102' },
  { studentCode: 'N5-103', allocatedNumber: '103', firstName: 'Amina', lastName: 'Patel', initialCode: 'N5-103' },
  { studentCode: 'N5-104', allocatedNumber: '104', firstName: 'Sipho', lastName: 'Dlamini', initialCode: 'N5-104' },
  { studentCode: 'N5-105', allocatedNumber: '105', firstName: 'Kagiso', lastName: 'Molefe', initialCode: 'N5-105' },
]

export const GATE_RUBRIC = {
  ACCURACY: {
    code: 'ACCURACY',
    title: 'Formula & Function Accuracy',
    detail: 'Correct use of absolute cell referencing ($) and conditional Excel functions without cell drift or misapplied totals.',
  },
  MANIPULATION: {
    code: 'MANIPULATION',
    title: 'Ribbon & Document Manipulation',
    detail: 'Direct navigation to the right Word and Excel ribbon tabs, styles, mail merge sequence, and data sort/filter controls.',
  },
  INSTRUCTION_CONTROL: {
    code: 'INSTRUCTION_CONTROL',
    title: 'Instruction & File Control',
    detail: 'Identifying the exact command verb and output filename before acting, preserving originals, and isolating requested ranges.',
  },
  TIME_CONTROL: {
    code: 'TIME_CONTROL',
    title: 'Timed Gate Discipline',
    detail: 'Following the enforced Read -> Plan -> Execute -> Verify workflow within the 50-minute locked assessment window.',
  },
  VERIFICATION_DISCIPLINE: {
    code: 'VERIFICATION_DISCIPLINE',
    title: 'Output & Reopen Verification',
    detail: 'Checking Print Preview, Scale to Fit, destination paths, and reopening saved copies independently to confirm output.',
  },
}

export const LEAK_GUIDANCE = {
  RIBBON_NAV: {
    title: 'Ribbon Tab & Command Location',
    action: 'Map the requested command verb to its exact Word or Excel ribbon tab before clicking.',
  },
  MAIL_MERGE: {
    title: 'Mail Merge Sequence',
    action: 'Follow the 5-step Mailings tab flow: main document, select recipients, insert merge fields, preview results, finish & merge.',
  },
  SORT_FILTER: {
    title: 'Excel Sort & Filter Control',
    action: 'Open Data > Sort & Filter with a single cell inside the contiguous table so rows stay aligned.',
  },
  PRINT_OUTPUT: {
    title: 'Print Setup & Scale to Fit',
    action: 'Verify Page Layout > Scale to Fit and inspect Print Preview before locking or exporting.',
  },
  FILE_MGMT: {
    title: 'File Copy, Move & Naming',
    action: 'Distinguish Save As/Copy from Move, preserve the original template, and reopen the destination copy to verify.',
  },
  EXCEL_REFERENCING: {
    title: 'Absolute vs Relative References',
    action: 'Lock constant rate or lookup cells with $ (e.g. $F$1) before copying formulas down or across.',
  },
  EXCEL_FUNCTIONS: {
    title: 'Conditional & Counting Functions',
    action: 'Match the verb to the function: COUNTIF for criteria counts, COUNTA for non-empty cells, SUM for totals.',
  },
  WORD_LAYOUT: {
    title: 'Word Styles & Structural Layout',
    action: 'Apply built-in Heading styles instead of manual bold/size formatting so automatic TOC and navigation remain intact.',
  },
  INSTRUCTION_CONTROL: {
    title: 'Instruction Scope & Precision',
    action: 'Read command qualifiers carefully: stored ROUND vs display format, target range selection, and exact filename spelling.',
  },
  TIME_DISCIPLINE: {
    title: 'Read-Plan-Execute-Verify Routine',
    action: 'State the action, output filename, and verification check before typing so timed marks are never lost to panic.',
  },
}

export const GATE_QUESTIONS = [
  {
    id: 'n5g1-q01',
    prompt: 'In Microsoft Word, which ribbon tab must you open first to switch page orientation from Portrait to Landscape?',
    options: ['Insert', 'Layout', 'Review', 'View'],
    correctIndex: 1,
    leak: 'RIBBON_NAV',
    rationale: 'Page Setup controls—including Orientation, Margins, and Size—live on the Layout tab.',
    rubricCategory: 'MANIPULATION',
    marks: 9,
  },
  {
    id: 'n5g1-q02',
    prompt: 'Which sequence correctly completes a Word Mail Merge from the Mailings tab without skipping verification?',
    options: [
      'Start Mail Merge -> Select Recipients -> Insert Merge Field -> Preview Results -> Finish & Merge',
      'Insert Merge Field -> Finish & Merge -> Select Recipients -> Preview Results',
      'Design -> Themes -> Select Recipients -> Print Document',
      'Review -> Compare -> Insert Merge Field -> Save As PDF',
    ],
    correctIndex: 0,
    leak: 'MAIL_MERGE',
    rationale: 'You must prepare the main document, link the data source, place merge fields, preview records, and then finish the merge.',
    rubricCategory: 'MANIPULATION',
    marks: 8,
  },
  {
    id: 'n5g1-q03',
    prompt: 'In Excel, which ribbon tab holds the Sort and Filter commands used to reorder or filter a marks register?',
    options: ['Formulas', 'Data', 'Insert', 'View'],
    correctIndex: 1,
    leak: 'SORT_FILTER',
    rationale: 'The Data tab houses Sort & Filter tools; knowing its exact location saves time under exam conditions.',
    rubricCategory: 'MANIPULATION',
    marks: 8,
  },
  {
    id: 'n5g1-q04',
    prompt: 'An instruction requires an Excel worksheet to print exactly one page wide. Which command path and final check protect those marks?',
    options: [
      'Page Layout > Scale to Fit (Width: 1 page), then inspect Print Preview',
      'Home > Wrap Text, then close the workbook immediately',
      'Review > Protect Sheet, then export without previewing',
      'Data > Remove Duplicates, then print page 1 only',
    ],
    correctIndex: 0,
    leak: 'PRINT_OUTPUT',
    rationale: 'Scale to Fit sets page-width fitting and Print Preview confirms no columns spill onto an extra sheet.',
    rubricCategory: 'VERIFICATION_DISCIPLINE',
    marks: 8,
  },
  {
    id: 'n5g1-q05',
    prompt: 'The task states: "Make a copy of the blank template and save the copy as Campus-Plan." What should you do before editing?',
    options: [
      'Identify the verb (copy/save as) and target name (Campus-Plan), then save the copy separately so the original template stays untouched',
      'Edit the original template directly and rename it only if time remains at the end',
      'Delete the original template first so only one file exists on disk',
      'Print the blank template and type the filename on the printout',
    ],
    correctIndex: 0,
    leak: 'FILE_MGMT',
    rationale: 'Week 1 Gate discipline requires identifying the command verb and output filename first and working only on the renamed copy.',
    rubricCategory: 'INSTRUCTION_CONTROL',
    marks: 9,
  },
  {
    id: 'n5g1-q06',
    prompt: 'If an instruction tells you to "move" a file to the Submission folder, how do you verify completion independently?',
    options: [
      'Open the Submission folder to confirm the file opens there and check that it no longer remains in the source folder',
      'Confirm that identical copies appear in both the source and Submission folders',
      'Check only the Recycle Bin for the filename',
      'Assume the file moved because you dragged the window',
    ],
    correctIndex: 0,
    leak: 'FILE_MGMT',
    rationale: 'Move transfers the file out of the source folder into the destination folder, unlike Copy which leaves the original intact.',
    rubricCategory: 'VERIFICATION_DISCIPLINE',
    marks: 8,
  },
  {
    id: 'n5g1-q07',
    prompt: 'Cell F1 stores a fixed 15% VAT rate. Which formula in C4 safely keeps F1 locked when copied down from C4 to C20?',
    options: ['=B4*$F$1', '=B4*F1', '=SUM(B4:F1)', '=B4*F$20'],
    correctIndex: 0,
    leak: 'EXCEL_REFERENCING',
    rationale: 'An absolute reference ($F$1) locks both column and row so the VAT cell does not drift during copy-down.',
    rubricCategory: 'ACCURACY',
    marks: 9,
  },
  {
    id: 'n5g1-q08',
    prompt: 'A register in D2:D40 lists "Pass" or "Fail". Which Excel function counts only how many learners achieved "Pass"?',
    options: ['=COUNTIF(D2:D40,"Pass")', '=COUNTA(D2:D40)', '=SUM(D2:D40)', '=COUNT(D2:D40)'],
    correctIndex: 0,
    leak: 'EXCEL_FUNCTIONS',
    rationale: 'COUNTIF counts cells matching a specific criterion; COUNTA counts all non-empty cells and SUM/COUNT expect numbers.',
    rubricCategory: 'ACCURACY',
    marks: 9,
  },
  {
    id: 'n5g1-q09',
    prompt: 'Why must you apply built-in Heading styles instead of manually changing font size and bold on section titles in Word?',
    options: [
      'Heading styles encode document structure required by automatic Tables of Contents and the Navigation pane',
      'Manual bold automatically generates a Table of Contents',
      'Heading styles disable spell-checking on titles',
      'Manual formatting converts the document into an Excel sheet',
    ],
    correctIndex: 0,
    leak: 'WORD_LAYOUT',
    rationale: 'Automatic features like Table of Contents read Heading style hierarchy rather than manual appearance formatting.',
    rubricCategory: 'MANIPULATION',
    marks: 8,
  },
  {
    id: 'n5g1-q10',
    prompt: 'What is the practical difference between "round the result to 2 decimals" and "display the result to 2 decimals"?',
    options: [
      'Rounding (ROUND) alters the stored numeric value used in further calculations; display formatting changes appearance only',
      'Display formatting alters the stored numeric value while ROUND changes appearance only',
      'Both commands produce identical stored values in downstream formulas',
      'Decimals can only be changed on the Page Layout tab',
    ],
    correctIndex: 0,
    leak: 'INSTRUCTION_CONTROL',
    rationale: 'Confusing number display formatting with the ROUND function changes downstream totals and costs accuracy marks.',
    rubricCategory: 'INSTRUCTION_CONTROL',
    marks: 8,
  },
  {
    id: 'n5g1-q11',
    prompt: 'An instruction says: "Apply 1.5 line spacing to the body paragraphs only." Which control prevents losing marks?',
    options: [
      'Select only the body paragraphs before applying 1.5 line spacing, leaving headings and tables untouched',
      'Press Ctrl+A and change line spacing across the entire document',
      'Press Enter twice after every sentence in the body',
      'Insert a manual page break before each paragraph',
    ],
    correctIndex: 0,
    leak: 'INSTRUCTION_CONTROL',
    rationale: 'Scope qualifiers ("body paragraphs only") require isolating the exact selection before executing the ribbon command.',
    rubricCategory: 'INSTRUCTION_CONTROL',
    marks: 8,
  },
  {
    id: 'n5g1-q12',
    prompt: 'Which four-step discipline must guide every action during this 50-minute N5 Gate?',
    options: [
      'Read -> Plan -> Execute -> Verify',
      'Click -> Guess -> Print -> Close',
      'Format -> Copy -> Rename -> Hope',
      'Open -> Decorate -> Submit -> Preview',
    ],
    correctIndex: 0,
    leak: 'TIME_DISCIPLINE',
    rationale: 'Reading the verb, planning the output, executing cleanly, and reopening/previewing to verify stops panic errors.',
    rubricCategory: 'TIME_CONTROL',
    marks: 8,
  },
]

export const REASSESSMENT_BANK = [
  {
    id: 'n5g1-re-01',
    prompt: 'Instruction: "Copy Timetable into the Archive folder, rename the copy Week-Two, and show that the original still opens." Which verification proves success?',
    options: [
      'Both Archive/Week-Two and the original Timetable open cleanly with intact content',
      'Only Week-Two exists and the original Timetable has been deleted',
      'Week-Two was renamed inside the original folder without copying',
      'The Recycle Bin contains the original Timetable',
    ],
    correctIndex: 0,
    leak: 'FILE_MGMT',
    rationale: 'Copying preserves the original while creating the renamed file in the target folder; both must open cleanly.',
  },
  {
    id: 'n5g1-re-02',
    prompt: 'In Microsoft Word, which ribbon tab contains Header, Footer, and Page Number commands?',
    options: ['Insert', 'Layout', 'Mailings', 'Review'],
    correctIndex: 0,
    leak: 'RIBBON_NAV',
    rationale: 'Headers, footers, page numbers, and tables are inserted from the Insert tab.',
  },
  {
    id: 'n5g1-re-03',
    prompt: 'Before clicking "Finish & Merge" on the Mailings tab, which button checks that recipient fields populate properly on each letter?',
    options: ['Preview Results', 'Track Changes', 'Freeze Panes', 'Page Break Preview'],
    correctIndex: 0,
    leak: 'MAIL_MERGE',
    rationale: 'Preview Results reveals spacing, punctuation, or missing field errors before generating the merged output.',
  },
  {
    id: 'n5g1-re-04',
    prompt: 'Why should you avoid selecting only column B when sorting a 5-column student marks table in Excel?',
    options: [
      'Sorting a single isolated column detaches marks from the student names in adjacent columns',
      'Excel refuses to sort text unless columns are merged',
      'Sorting column B deletes all formulas in column A',
      'Data > Sort only works on charts',
    ],
    correctIndex: 0,
    leak: 'SORT_FILTER',
    rationale: 'Keeping the entire contiguous table selected (or one active cell inside it) keeps each row intact during sorting.',
  },
  {
    id: 'n5g1-re-05',
    prompt: 'A wide Excel schedule cuts off the Total column on page 2 when previewed. Which Page Layout adjustment fixes this cleanly?',
    options: [
      'Set Orientation to Landscape and Scale to Fit Width = 1 page, then re-check Print Preview',
      'Delete the Total column so remaining columns fit',
      'Change cell font colour to light grey',
      'Apply Wrap Text only to cell A1',
    ],
    correctIndex: 0,
    leak: 'PRINT_OUTPUT',
    rationale: 'Landscape orientation and Scale to Fit Width = 1 page keep all columns readable on a single page width.',
  },
  {
    id: 'n5g1-re-06',
    prompt: 'When copying a formula across columns B through F, you need row 2 to remain locked while the column updates. Which reference pattern is right?',
    options: ['B$2', '$B2', 'B2', '$B$20'],
    correctIndex: 0,
    leak: 'EXCEL_REFERENCING',
    rationale: 'Locking the row with $ before the row number (B$2) fixes row 2 while allowing the column letter to adjust across columns.',
  },
  {
    id: 'n5g1-re-07',
    prompt: 'Range A2:A25 contains student surnames with two blank rows. Which function counts every non-empty surname cell?',
    options: ['=COUNTA(A2:A25)', '=COUNT(A2:A25)', '=SUM(A2:A25)', '=COUNTBLANK(A2:A25)'],
    correctIndex: 0,
    leak: 'EXCEL_FUNCTIONS',
    rationale: 'COUNTA counts all non-empty cells including text, whereas COUNT counts numeric cells only.',
  },
  {
    id: 'n5g1-re-08',
    prompt: 'What is the safest way to start a new page before Section 2 in Word without leaving blank-line drift?',
    options: [
      'Insert a Page Break (Insert > Page Break or Ctrl+Enter) instead of pressing Enter repeatedly',
      'Press Enter 25 times until the cursor moves down',
      'Increase font size to 72pt on an empty line',
      'Drag the text inside a floating text box',
    ],
    correctIndex: 0,
    leak: 'WORD_LAYOUT',
    rationale: 'A Page Break keeps Section 2 anchored at the top of the next page even if earlier text is edited.',
  },
]

export const PRACTICAL_PROOF_CHECKS = {
  verb: {
    id: 'verb',
    label: 'Command verb & output filename identified',
    detail: 'Before editing, I identified the exact command verb (e.g. Save As / Copy) and target filename.',
  },
  original: {
    id: 'original',
    label: 'Original source preserved separately',
    detail: 'I kept the original template untouched and worked only on the renamed copy.',
  },
  reopen: {
    id: 'reopen',
    label: 'Saved copy reopened and verified',
    detail: 'I reopened the saved file from the destination folder to confirm contents, layout, or print setup.',
  },
}

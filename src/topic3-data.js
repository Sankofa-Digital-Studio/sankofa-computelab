export const TOPIC3_TITLE = 'CPN5 Topic 3 · Data, Information Management & Computational Thinking'

export const TOPIC3_MODULES = [
  {
    id: 'topic3-section1',
    sectionCode: '1',
    releaseScope: 'wave1',
    category: 'data-lifecycle',
    title: 'Data, Information, Knowledge & Decision Flow',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Trace raw values through processing and context before classifying them as Data, Information, or Knowledge.',
    concept: {
      summary:
        'Topic 3 examines how organisations capture raw data, check it for accuracy, process it into meaningful information, and apply knowledge to make defensible decisions across spreadsheets, documents, and databases.',
      keyPoints: [
        'Data consists of raw, unorganised facts, numbers, or characters (e.g. "42, 68, 75" or an unlabelled code "CPN5") before context or calculation is applied.',
        'Information is data that has been processed, organised, structured, or summarised to answer a question (e.g. "Class pass rate is 78% with 4 learners below 40%").',
        'Knowledge (and Decision/Insight) applies information plus rules or experience to act—such as scheduling targeted recovery drills for learners under the 40% threshold.',
        'Every data workflow depends on source traceability: keeping the raw input sheet separate from calculated summaries so totals can always be audited.',
      ],
    },
    cbtTip:
      'Exam trap: Never claim that "formatting text bold turns data into information"—processing must organise, calculate, filter, or add context so the output supports a real decision.',
    triggerTable: [
      {
        contrast: 'Data vs Information',
        rule: 'Data is raw and unorganised; Information is processed, structured, and meaningful in context.',
      },
      {
        contrast: 'Information vs Knowledge',
        rule: 'Information reports what happened (78% pass rate); Knowledge applies rules to decide what to do next (assign recovery).',
      },
      {
        contrast: 'Raw Source vs Processed Output',
        rule: 'Preserve raw records separately so errors in formulas or filters can be traced back to the original capture.',
      },
      {
        contrast: 'Summary Count vs Record List',
        rule: 'Use aggregate counts/totals for overview decisions and filtered record lists when specific individuals need follow-up.',
      },
    ],
    guidedPractice: {
      title: 'Campus Registration Data-to-Decision Audit',
      scenario:
        'An administration clerk captures daily workshop attendance ticks in an Excel sheet, calculates per-session percentages, flags sessions exceeding room capacity, and recommends adding a second Saturday slot.',
      steps: [
        'Classify the unlabelled attendance ticks and student codes as raw Data.',
        'Classify the per-session attendance totals and percentages as processed Information.',
        'Identify the decision to open a second Saturday workshop because demand exceeds capacity as Knowledge in action.',
        'Verify that the original raw registration log remains intact before publishing the summary report.',
      ],
    },
    quickCheck: [
      {
        id: 't3-s1-q1',
        prompt: 'A booking sheet contains raw entries: "12, 18, 25, 9". After computing total bookings (64) and comparing them against a 50-seat hall capacity, what have those figures become?',
        options: [
          'Unstructured binary',
          'Information that supports a capacity decision',
          'Volatile cache memory',
          'Hardware peripherals',
        ],
        correctIndex: 1,
        rationale: 'Computing totals and comparing them against room capacity gives raw figures structure, context, and decision value (Information).',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't3-s1-q2',
        prompt: 'Which action demonstrates Knowledge rather than Information alone in an N5 campus scenario?',
        options: [
          'Typing student surnames into column A',
          'Using the 40% threshold report to schedule targeted recovery sessions for specific at-risk learners',
          'Changing the font size of the table heading to 16pt',
          'Saving a blank workbook with a random filename',
        ],
        correctIndex: 1,
        rationale: 'Knowledge applies processed information and domain rules (the 40% threshold) to choose a justified action.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't3-s1-q3',
        prompt: 'Why should raw captured records stay separate from summary calculations when managing data?',
        options: [
          'So you can delete the raw data immediately',
          'So every calculated output remains auditable against the original source without overwriting evidence',
          'Because Excel forbids formulas on separate sheets',
          'To hide errors from the lecturer',
        ],
        correctIndex: 1,
        rationale: 'Preserving the raw source allows verification and prevents accidental loss of original evidence during sorting or editing.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Create a 4-stage Data-to-Decision flow table (Data -> Processing -> Information -> Knowledge/Action) grounded in a campus attendance or stock scenario.',
      deliverables: [
        '4-row Data-to-Decision transformation table',
        'One source-preservation rule explaining how raw records are protected',
      ],
      checklist: [
        { id: 't3-s1-chk1', label: 'Distinguished Data, Information, and Knowledge with concrete examples' },
        { id: 't3-s1-chk2', label: 'Named the exact processing step (e.g. SUM, COUNTIF, sort/filter) that created context' },
        { id: 't3-s1-chk3', label: 'Stated how the original source data stays untouched for verification' },
      ],
    },
  },
  {
    id: 'topic3-section2',
    sectionCode: '2',
    releaseScope: 'wave1',
    category: 'computational-thinking',
    title: 'Computational Thinking & Problem Solving',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Apply the four pillars—Decomposition, Pattern Recognition, Abstraction, and Algorithms—before touching Office tools.',
    concept: {
      summary:
        'Computational thinking is a structured method for breaking complex exam instructions and real-world data problems into clear, repeatable steps before executing commands in Word, Excel, or a database.',
      keyPoints: [
        'Decomposition splits a large multi-part paper or scenario into smaller, manageable subtasks (e.g. separate data cleaning, formula logic, chart output, and Word briefing).',
        'Pattern Recognition spots repeating structures, recurring errors, or shared rules—such as applying the same $F$1 rate lock across all rows or matching a standard mail-merge flow.',
        'Abstraction filters out irrelevant story details and keeps only the variables, constraints, and fields needed to solve the problem.',
        'Algorithmic Thinking writes an exact, ordered sequence of steps (Read -> Plan -> Execute -> Verify) including edge cases and verification checks.',
      ],
    },
    cbtTip:
      'Exam trap: Do not confuse Abstraction with Decomposition—Decomposition breaks a big task into smaller parts, while Abstraction strips away unnecessary noise to focus on essential inputs and rules.',
    triggerTable: [
      {
        contrast: 'Decomposition vs Abstraction',
        rule: 'Decomposition divides a big problem into smaller subtasks; Abstraction ignores irrelevant clutter to highlight essential variables and rules.',
      },
      {
        contrast: 'Pattern Recognition vs Hardcoding',
        rule: 'Pattern Recognition identifies a general formula or rule usable across rows; hardcoding types isolated manual numbers.',
      },
      {
        contrast: 'Algorithm vs Random Clicking',
        rule: 'An algorithm states an ordered, unambiguous sequence with decision branches and verification checks before clicking.',
      },
      {
        contrast: 'Input -> Process -> Output Plan',
        rule: 'List required inputs, transformation rules, and target deliverables before opening any Office application.',
      },
    ],
    guidedPractice: {
      title: 'Four-Pillar Breakdown of a Mail-Merge & Spreadsheet Task',
      scenario:
        'A task gives a messy 2-page campus story asking you to calculate a 15% levy on confirmed bookings, count how many exceed R500, and merge invitation letters for confirmed delegates only.',
      steps: [
        'Decomposition: Break the job into (1) clean/import data, (2) calculate levy & COUNTIF, (3) filter confirmed recipients, (4) run mail merge & verify output.',
        'Abstraction: Ignore decorative background story text and extract only the key fields (Delegate, Places, Rate, Status, 15% Levy, R500 threshold).',
        'Pattern Recognition: Notice every row uses the same levy rate cell ($H$2) and every letter follows the same 5-step Mailings workflow.',
        'Algorithm: Write the ordered sequence including the boundary check (>=500 vs >500) and final Print Preview check before finishing.',
      ],
    },
    quickCheck: [
      {
        id: 't3-s2-q1',
        prompt: 'A student reads a dense 300-word exam scenario and extracts only the rates, thresholds, and required output filenames while ignoring background narrative. Which computational thinking pillar is this?',
        options: [
          'Abstraction',
          'Defragmentation',
          'Mail merging',
          'Hardware overclocking',
        ],
        correctIndex: 0,
        rationale: 'Abstraction removes irrelevant surface details and retains only the essential data, constraints, and rules needed to solve the problem.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't3-s2-q2',
        prompt: 'Breaking a 180-mark integrated exam paper into Section A theory, Section B1 OneNote, B2 Word, and B3 Excel checklists before starting demonstrates which pillar?',
        options: [
          'Decomposition',
          'Overconfidence',
          'Approximate lookup',
          'Data duplication',
        ],
        correctIndex: 0,
        rationale: 'Decomposition splits a large complex task into smaller, independently verifiable sub-problems.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't3-s2-q3',
        prompt: 'Why is writing a brief ordered algorithm (Read -> Plan -> Execute -> Verify) faster overall than clicking immediately in Excel or Word?',
        options: [
          'It disables spellcheck automatically',
          'It prevents rework from missed constraints, broken ranges, and unanchored cell references',
          'It reduces file size by 90%',
          'It bypasses the need to save files',
        ],
        correctIndex: 1,
        rationale: 'Planning the exact sequence, references, and verification checks prevents cascading errors and wasted time under exam pressure.',
        leak: 'TIME_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Decompose one N5 practical prompt using all 4 computational thinking pillars (Decomposition, Pattern Recognition, Abstraction, Algorithm) in a structured note or table.',
      deliverables: [
        '4-pillar problem breakdown table',
        'Ordered 5-step execution and verification algorithm',
      ],
      checklist: [
        { id: 't3-s2-chk1', label: 'Split the task into clear subtasks (Decomposition)' },
        { id: 't3-s2-chk2', label: 'Isolated essential inputs/constraints while discarding noise (Abstraction)' },
        { id: 't3-s2-chk3', label: 'Included a repeatable rule (Pattern Recognition) and ordered verification steps (Algorithm)' },
      ],
    },
  },
  {
    id: 'topic3-section3',
    sectionCode: '3',
    releaseScope: 'wave1',
    category: 'database-structure',
    title: 'Structured Records, Keys, Sorting & Queries',
    leakCode: 'EXCEL_FUNCTIONS',
    nextAction: 'Enforce one-fact-per-field, unique primary keys, whole-table sorting, and exact criteria across spreadsheets and databases.',
    concept: {
      summary:
        'Whether working in structured Excel tables or legacy N5 Section D databases, sound data management depends on clean tables (records as rows, fields as columns), unique primary keys, accurate data types, and safe sorting/querying.',
      keyPoints: [
        'A Table organises Records (rows, e.g. one student or booking) and Fields (columns, e.g. StudentID, Surname, AmountDue, Status). Keep one atomic value per field.',
        'A Primary Key uniquely identifies every record (e.g. StudentCode N5-101) so duplicates or same-surname learners never collide.',
        'Data types control calculation and sorting: numbers stored as text fail SUM/AVERAGE and sort alphabetically ("100" before "20"); dates and currency must stay consistent.',
        'Queries and Filters extract records meeting exact criteria (e.g. Status = "Confirmed" AND Balance >= 300), while Reports format those results cleanly for printing.',
      ],
    },
    cbtTip:
      'Exam trap: Never select a single column to sort a multi-column table—that scrambles student names against the wrong marks. Keep one cell active inside the contiguous table or select every column.',
    triggerTable: [
      {
        contrast: 'Record vs Field vs Primary Key',
        rule: 'Record = one row/entity; Field = one column/attribute; Primary Key = unique non-null identifier for each row.',
      },
      {
        contrast: 'Single-Column Sort vs Whole-Table Sort',
        rule: 'Single-column sort detaches rows; whole-table sort keeps every record aligned across all fields.',
      },
      {
        contrast: 'Text-Formatted Number vs Numeric Field',
        rule: 'Text-stored numbers ("75") break SUM/sorting rules; convert to numeric values before calculating.',
      },
      {
        contrast: 'Query / Filter vs Report',
        rule: 'A Query or Filter extracts matching records; a Report formats selected records with headings and totals for output.',
      },
    ],
    guidedPractice: {
      title: 'Repairing and Querying a Booking Register',
      scenario:
        'A clinic booking table has columns ID, Delegate, Session, Places, Rate, Status. Rate "75" on row C03 was entered as text, and you must sort by Session then Delegate and filter Confirmed delegates with Places >= 3.',
      steps: [
        'Verify that ID (C01..C05) acts as a unique Primary Key with no duplicate or blank IDs.',
        'Convert Rate "75" from text to a true numeric currency value so Places * Rate calculates properly.',
        'Select the entire contiguous table (Data > Sort) and sort first by Session (A-Z), then Add Level by Delegate (A-Z).',
        'Apply Filter criteria: Status = "Confirmed" AND Places >= 3, then inspect one row against the original source to confirm alignment.',
      ],
    },
    quickCheck: [
      {
        id: 't3-s3-q1',
        prompt: 'Why is Surname alone a poor Primary Key for a college student database or workbook?',
        options: [
          'Two different students can share the same surname, causing collisions',
          'Surnames cannot be sorted alphabetically',
          'Primary keys must always be longer than 30 characters',
          'Excel deletes columns named Surname',
        ],
        correctIndex: 0,
        rationale: 'A Primary Key must uniquely identify every record; unique StudentCode/ID values prevent collisions when learners share names.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't3-s3-q2',
        prompt: 'A student highlights only column D (Marks) and clicks Sort Descending in a 5-column class table. What serious error occurs?',
        options: [
          'All formulas automatically convert to bold',
          'Marks reorder independently while names in columns A–C stay stationary, corrupting every learner record',
          'The workbook converts into a Word file',
          'Nothing happens unless column A is empty',
        ],
        correctIndex: 1,
        rationale: 'Sorting one isolated column breaks row integrity so marks no longer match the right learners.',
        leak: 'SORT_FILTER',
      },
      {
        id: 't3-s3-q3',
        prompt: 'What happens if an amount like "150" is stored as text inside a numeric cost column?',
        options: [
          'SUM and numeric comparisons may ignore it or misorder it alphabetically',
          'Excel automatically doubles its value',
          'It prints in landscape automatically',
          'It turns into a Primary Key',
        ],
        correctIndex: 0,
        rationale: 'Text-stored numbers distort SUM, AVERAGE, and numeric filters/sorts until converted to real numeric values.',
        leak: 'EXCEL_FUNCTIONS',
      },
    ],
    evidenceTask: {
      prompt: 'Audit a 5-record table by naming its Primary Key, correcting one data-type defect, defining a two-level sort, and writing one compound filter rule.',
      deliverables: [
        'Table schema (fields, types, Primary Key choice)',
        'Two-level sort specification and verification test check',
      ],
      checklist: [
        { id: 't3-s3-chk1', label: 'Selected a unique Primary Key and justified why non-unique fields fail' },
        { id: 't3-s3-chk2', label: 'Identified and fixed text-as-number or inconsistent field values' },
        { id: 't3-s3-chk3', label: 'Verified whole-table sorting and compound filter criteria against source rows' },
      ],
    },
  },
  {
    id: 'topic3-section4',
    sectionCode: '4',
    releaseScope: 'wave1',
    category: 'data-quality',
    title: 'Verification, Validation, Integrity & Data Privacy',
    leakCode: 'VERIFICATION_DISCIPLINE',
    nextAction: 'Separate source-checking (Verification) from rule-checking (Validation) and strip personal fields before sharing summaries.',
    concept: {
      summary:
        'Clean formulas cannot save dirty or leaked data. Topic 3 requires learners to catch input errors early using validation rules, verify outputs against original documents, resolve duplicates safely, and protect personal information.',
      keyPoints: [
        'Verification checks whether captured or copied data matches its original source (e.g. proofreading typed marks against the signed register or double-entry checks).',
        'Validation uses automated rules in software to check whether an entry is reasonable, allowed, or within range (e.g. marks between 0 and 100, or a dropdown list of valid Status values).',
        'Duplicate & Lookup Integrity: Never silently delete duplicate rows or suppress missing codes with blind IFERROR("", ...); flag conflicts, check timestamps/sources, and keep missing keys visible.',
        'Data Privacy & Minimisation: When sharing results with a group or class rep, remove ID numbers, phone numbers, and hidden sheets—share only aggregate counts or minimum needed fields.',
      ],
    },
    cbtTip:
      'Exam trap: Validation CANNOT prove a number matches the paper register—a valid mark of 58 instead of 85 passes a 0–100 validation rule! Only Verification against the source catches transcription errors.',
    triggerTable: [
      {
        contrast: 'Verification vs Validation',
        rule: 'Verification compares data to the original source; Validation checks whether data obeys format, type, list, or range rules.',
      },
      {
        contrast: 'Range Check vs Presence Check',
        rule: 'Range check enforces min/max bounds (0–100); Presence check ensures a mandatory field is not left blank.',
      },
      {
        contrast: 'Duplicate Resolution vs Blind Deletion',
        rule: 'Flag potential duplicates, compare identifiers and timestamps against sources, and document resolution before deleting.',
      },
      {
        contrast: 'Aggregate Summary vs Full Raw Export',
        rule: 'Share summary counts/totals publicly; restrict identifiable records to authorised staff and inspect hidden tabs/metadata.',
      },
    ],
    guidedPractice: {
      title: 'Resolving an Attendance & Privacy Dispute',
      scenario:
        'A merged attendance workbook has two duplicate student IDs, one blank programme code, a mark typed as 78 instead of 87, and a request to post pass counts to a student WhatsApp group.',
      steps: [
        'Explain why a 0–100 validation rule missed 78 vs 87, and apply Verification against the signed paper register.',
        'Add a Presence / List validation rule so blank or unapproved programme codes are flagged immediately.',
        'Compare the two duplicate IDs against branch/date sources before deciding whether they are separate enrolments or a true duplicate.',
        'Generate a pass/fail summary table without names, IDs, or phone numbers—and inspect for hidden sheets—before sharing.',
      ],
    },
    quickCheck: [
      {
        id: 't3-s4-q1',
        prompt: 'A clerk accidentally types 64 instead of 46 for an exam mark. An Excel rule allows values from 0 to 100. Why did Excel accept 64, and which check catches it?',
        options: [
          'Excel failed because 64 is text; formatting as currency catches it',
          '64 passed the 0–100 validation rule; only Verification against the original mark sheet catches the transcription error',
          'Validation automatically fixes transposed digits',
          'Deleting the column catches the error',
        ],
        correctIndex: 1,
        rationale: 'Validation only enforces rules (0–100); Verification compares the captured value to the physical/source record.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't3-s4-q2',
        prompt: 'Why should an exact lookup (like VLOOKUP(..., FALSE)) avoid hiding unknown codes behind an empty string ""?',
        options: [
          'Hiding missing codes masks data-integrity faults so invalid entries go uninvestigated',
          'Empty strings crash Microsoft Word',
          'Exact lookups only work with approximate TRUE mode',
          'Blank cells increase print contrast',
        ],
        correctIndex: 0,
        rationale: 'Visible exception labels (e.g. "Missing Code — Review") ensure missing or mistyped identifiers are caught and fixed.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't3-s4-q3',
        prompt: 'A class representative asks how many learners passed Test 1 so they can encourage the group. Which output respects data privacy best?',
        options: [
          'Forward the entire raw spreadsheet including ID numbers and phone numbers',
          'Share an aggregate pass count and percentage with all personal identifiers and hidden sheets removed',
          'Post screenshots of failing students with their surnames highlighted',
          'Upload the unencrypted password list to social media',
        ],
        correctIndex: 1,
        rationale: 'Data minimisation shares only the aggregate summary needed while protecting personal and sensitive learner data.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Document a 4-point Data Quality & Privacy checklist covering Verification, Validation, Duplicate/Lookup auditing, and Minimum-Data sharing.',
      deliverables: [
        'Comparison of one validation rule vs one verification check',
        '4-step duplicate resolution & privacy-check routine',
      ],
      checklist: [
        { id: 't3-s4-chk1', label: 'Clearly separated source Verification from software Validation' },
        { id: 't3-s4-chk2', label: 'Included a non-destructive duplicate and missing-code audit step' },
        { id: 't3-s4-chk3', label: 'Specified stripping personal identifiers and checking hidden sheets before sharing' },
      ],
    },
  },
  {
    id: 'topic3-consolidation',
    sectionCode: '5',
    releaseScope: 'wave2',
    category: 'consolidation',
    title: 'Topic 3 Consolidation & Error-Tracing Map',
    leakCode: 'INTEGRATION_CONTROL',
    nextAction: 'Trace errors across the full pipeline from capture and validation through sorting, querying, and final output.',
    concept: {
      summary:
        'Consolidation connects every Topic 3 concept into one end-to-end data pipeline: capture cleanly, validate rules, verify against source, compute with structured tables, and report safely without exposing raw personal data.',
      keyPoints: [
        'Five-Point Error Chain: (1) Question command, (2) Choice of source/inputs, (3) Rule/formula/key, (4) Execution/sort/filter, (5) Verification/privacy check.',
        'Cross-application consistency means totals in Excel, narrative counts in Word, and verification logs in OneNote must all match the same reviewed dataset.',
        'When facts change (e.g. threshold moves from 40% to 50% or a late registration arrives), update the controlled single source cell/table and regenerate outputs rather than editing outputs by hand.',
        'Always reopen exported PDFs, merged letters, or CSVs to confirm no hidden rows, #N/A leaks, or scrambled columns remain.',
      ],
    },
    cbtTip:
      'Exam trap: Changing a figure only in the Word report after fixing the Excel sheet creates a cross-application mismatch—always update the source model first and verify all linked outputs agree.',
    triggerTable: [
      {
        contrast: 'Root-Cause Fix vs Symptom Patch',
        rule: 'Fix the source data type, key, or formula reference rather than manually typing over a broken total.',
      },
      {
        contrast: 'Dynamic Threshold Cell vs Hardcoded Rule',
        rule: 'Store cut-offs (e.g. 40% or R350) in a control cell so policy updates flow cleanly through every summary.',
      },
      {
        contrast: 'Cross-App Reconciliation vs Isolated Checks',
        rule: 'Verify that Excel summary counts, Word narrative figures, and OneNote logs report the exact same numbers.',
      },
      {
        contrast: 'Traceable Audit Log vs Silent Overwrite',
        rule: 'Keep original files intact and record what defect was found, what changed, and how the fix was verified.',
      },
    ],
    guidedPractice: {
      title: 'Cross-Application Reconciliation Walkthrough',
      scenario:
        'After fixing a text-formatted fee and removing one confirmed duplicate in Excel, your Word memo still cites the old total and 25 instead of 24 learners.',
      steps: [
        'Trace the error chain to find which step changed (source clean-up updated Excel count from 25 to 24).',
        'Verify the updated Excel summary and COUNTIF/SUM totals against the clean record table.',
        'Update the Word briefing and re-run any filtered Mail Merge so both outputs match 24 learners.',
        'Record the before/after reconciliation note in OneNote or your verification summary and check Print Preview.',
      ],
    },
    quickCheck: [
      {
        id: 't3-s5-q1',
        prompt: 'You fix a duplicate row in your Excel bookings sheet, lowering the confirmed count from 18 to 17. What must you check before submitting?',
        options: [
          'Nothing—Word automatically rewrites typed paragraphs without checking',
          'Reconcile the Word briefing, filtered mail-merge output, and verification note so every deliverable reflects 17',
          'Delete the Excel workbook and submit Word alone',
          'Change the font to Calibri so the numbers look similar',
        ],
        correctIndex: 1,
        rationale: 'Integrated N5/N6 tasks require every linked artifact (Excel, Word, Mail Merge, OneNote) to report consistent, verified figures.',
        leak: 'INTEGRATION_CONTROL',
      },
      {
        id: 't3-s5-q2',
        prompt: 'Which practice makes a spreadsheet model resilient when management raises a pass threshold from 40% to 50%?',
        options: [
          'Hardcoding 40 inside twenty separate IF formulas',
          'Putting 40% in one labelled Control cell referenced with $ and updating only that cell',
          'Typing "Pass" manually into every cell',
          'Sorting only column B',
        ],
        correctIndex: 1,
        rationale: 'Separating assumptions into a single absolute-referenced control cell lets policy changes update all downstream results reliably.',
        leak: 'EXCEL_REFERENCING',
      },
      {
        id: 't3-s5-q3',
        prompt: 'What is the first step of the 5-point error-tracing chain when an output looks suspicious?',
        options: [
          'Re-read the exact question command and constraints before blaming the software',
          'Immediately delete all formulas',
          'Change the page margins',
          'Print five copies',
        ],
        correctIndex: 0,
        rationale: 'Most lost marks start with misreading the command verb, threshold, or target range; re-checking the command anchors the whole diagnosis.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Produce a 5-point error-tracing and cross-application reconciliation checklist for a combined Excel + Word + OneNote task.',
      deliverables: [
        '5-point error trace table (Command -> Inputs -> Method -> Execution -> Verification)',
        'Before/after reconciliation example showing changed facts',
      ],
      checklist: [
        { id: 't3-s5-chk1', label: 'Mapped all five error-tracing stages in sequence' },
        { id: 't3-s5-chk2', label: 'Explained how a changed control value propagates without manual overrides' },
        { id: 't3-s5-chk3', label: 'Included cross-document reconciliation between Excel, Word, and OneNote' },
      ],
    },
  },
  {
    id: 'topic3-mastery',
    sectionCode: 'Mastery',
    releaseScope: 'wave2',
    category: 'consolidation',
    title: 'Data & Computational Thinking Mastery (150 Marks)',
    leakCode: 'TIME_DISCIPLINE',
    nextAction: 'Execute full Topic 3 scenario analysis under timed exam discipline and link N5 habits directly to N6 data recovery.',
    concept: {
      summary:
        'Topic 3 Mastery tests whether you can diagnose messy datasets, justify verification vs validation controls, design structured records/queries, and bridge directly into N6 data-recovery and formula-auditing tasks.',
      keyPoints: [
        'Exam-ready answers combine the exact technical term (e.g. Primary Key, Validation, Abstraction) with the scenario clue and the operational consequence.',
        'Legacy N5 Database tasks (fields, records, primary keys, sorting, query criteria, reports) and modern N5 Integration tasks (Excel tables + Word mail merge + OneNote logs) share the exact same underlying data rules.',
        'N6 Transfer: N6 Branch Data Recovery and Formula Decision labs scale up these exact Topic 3 principles—unique keys, exact lookups with visible error flags, and reconciled management handovers.',
        'Timed discipline: Spend 2 minutes decomposing and reading constraints, 70% executing cleanly, and the final 20% verifying reopened outputs, print preview, and privacy.',
      ],
    },
    cbtTip:
      'Exam trap: Never answer a 6-mark data-dispute question with one vague sentence like "check the data"—state the verification check, the validation rule, the duplicate-resolution order, and the privacy safeguard.',
    triggerTable: [
      {
        contrast: 'N5 Legacy Database vs N5 Modern Table',
        rule: 'Both require atomic fields, unique Primary Keys, valid data types, whole-record sorting, and criteria filtering.',
      },
      {
        contrast: 'N5 Foundation vs N6 Transfer',
        rule: 'N5 builds clean keys, verification, and IF/COUNTIF rules; N6 adds exact lookups, composite keys, and auditable handovers.',
      },
      {
        contrast: 'Vague Check vs Auditable Control',
        rule: 'Always specify WHAT is checked, AGAINST WHAT source/rule, and HOW exceptions stay visible.',
      },
      {
        contrast: 'Rushed Submit vs 20% Verify Window',
        rule: 'Reserve final minutes to inspect reopened files, formula totals, print preview, and stripped metadata.',
      },
    ],
    guidedPractice: {
      title: '150-Mark Topic 3 Integrated Scenario Simulation',
      scenario:
        'A college merges two registration spreadsheets (36 and 41 rows), finds 5 duplicate student codes, 1 missing programme code, and must produce an accurate count for management without leaking student contact details.',
      steps: [
        'Decompose & Abstract: Separate (a) data-integrity diagnosis, (b) verification vs validation design, (c) safe duplicate/lookup handling, and (d) privacy-preserving output.',
        'Design the control: Set StudentCode as Primary Key (or composite key if multi-enrolment), add List validation on ProgrammeCode, and verify sample counts against raw sign-in sheets.',
        'Preserve evidence: Keep original files untouched, flag unresolved rows visibly, and reconcile the final count across Excel and Word.',
        'Time & Output check: Confirm the management summary omits phone/ID columns and renders cleanly in Print Preview.',
      ],
    },
    quickCheck: [
      {
        id: 't3-m-q1',
        prompt: 'In an N5-to-N6 bridge scenario, a learner encounters two rows with the same StudentID in two different campus branches. What is the safest first step?',
        options: [
          'Delete both rows immediately without checking',
          'Flag the conflict, verify dates/branch enrolments against source registers, and consider a composite key if both enrolments are valid',
          'Hide the rows using white font colour',
          'Change one StudentID randomly without recording it',
        ],
        correctIndex: 1,
        rationale: 'Preserving source evidence and checking whether parallel branch enrolments are valid prevents destroying real learner records.',
        leak: 'VERIFICATION_DISCIPLINE',
      },
      {
        id: 't3-m-q2',
        prompt: 'Which combination best shows mastery across Topic 3 before entering N6 practical labs?',
        options: [
          'Memorising acronyms without practical checks',
          'Decomposing instructions, keeping unique keys/numeric types clean, separating verification from validation, and reconciling final outputs',
          'Formatting every table with bright background fills only',
          'Skipping Print Preview to save 30 seconds',
        ],
        correctIndex: 1,
        rationale: 'Mastery integrates computational planning, structured data integrity, verification/validation controls, and output reconciliation.',
        leak: 'TIME_DISCIPLINE',
      },
      {
        id: 't3-m-q3',
        prompt: 'Why should an answer on a 6-mark data-quality scenario list distinct verification, validation, and privacy controls?',
        options: [
          'Each control protects a different failure point: source accuracy, input rules, and authorised sharing',
          'Markers award points only for repeating the same word three times',
          'Privacy controls automatically calculate Excel formulas',
          'Validation replaces the need for source documents',
        ],
        correctIndex: 0,
        rationale: 'Examiners allocate separate marks for source verification, software validation rules, and minimum-necessary data sharing.',
        leak: 'THEORY_EXPLANATION',
      },
    ],
    evidenceTask: {
      prompt: 'Complete a full Topic 3 Mastery dossier: problem decomposition, verification vs validation plan, structured table/query rules, and privacy-safe handover summary.',
      deliverables: [
        'Mastery scenario response covering all 4 computational thinking pillars and data-integrity checks',
        'Verification sign-off note linking Excel/Word outputs to source registers',
      ],
      checklist: [
        { id: 't3-m-chk1', label: 'Applied Decomposition, Abstraction, Pattern Recognition, and Algorithm steps' },
        { id: 't3-m-chk2', label: 'Included distinct Verification, Validation, Primary Key, and Privacy controls' },
        { id: 't3-m-chk3', label: 'Reconciled final counts and verified print/export readiness' },
      ],
    },
  },
]

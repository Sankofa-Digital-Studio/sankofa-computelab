export const TOPIC1_TITLE = 'CPN5 Topic 1 · Computing Concepts & Application Skills'

export const TOPIC1_MODULES = [
  {
    id: 'topic1-section1',
    sectionCode: '1',
    releaseScope: 'wave1',
    category: 'theory',
    title: 'Computing Concepts and ICT Foundations',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Map raw data, processed information, and the four Information Processing Cycle stages before drilling terminology.',
    concept: {
      summary:
        'Information and Communication Technology (ICT) combines hardware, software, networks, and procedures to turn raw data into useful information. In CPN5 Topic 1, learners must use exact terminology rather than vague everyday descriptions.',
      keyPoints: [
        'Data consists of raw, unorganised facts (e.g. 74, 58, 91); Information is data processed into meaningful context (e.g. class average 74.3%); Knowledge is applying that information to make decisions (e.g. scheduling support for learners below 50%).',
        'The Information Processing Cycle follows four core stages: Input -> Processing -> Output -> Storage (supported by communication across devices).',
        'Digital World & Digital Citizenship require safe, ethical, respectful, and lawful behaviour online, including protecting passwords, respecting copyright, and verifying sources.',
        'User Types reflect different computing needs: Home/Personal, Small Office/Home Office (SOHO), Mobile, Power, and Enterprise users.',
      ],
    },
    cbtTip:
      'Exam trap: Do not define Information as "typing into a computer"—always state that Information is processed, organised, meaningful data, and never swap Input with Storage.',
    triggerTable: [
      {
        contrast: 'Data vs Information vs Knowledge',
        rule: 'Data = raw unorganised facts; Information = processed data with meaning; Knowledge = insight/action taken from information.',
      },
      {
        contrast: 'Input vs Processing vs Output vs Storage',
        rule: 'Input captures raw data; Processing manipulates it; Output presents results; Storage keeps data/output for later retrieval.',
      },
      {
        contrast: 'Power User vs Mobile User vs Enterprise User',
        rule: 'Power user needs high-spec multimedia/CAD tools; Mobile user relies on portable battery-powered connectivity; Enterprise user works on large connected corporate systems.',
      },
      {
        contrast: 'Digital Access vs Digital Citizenship',
        rule: 'Digital access means having ICT tools/connectivity; Digital citizenship means using those tools ethically, safely, and responsibly.',
      },
    ],
    guidedPractice: {
      title: 'College Enrolment Data-to-Decision Ladder',
      scenario:
        'A TVET campus captures raw student test marks on a register, calculates pass rates in Excel, displays a summary report for lecturers, saves the workbook, and schedules revision clinics.',
      steps: [
        'Identify the raw facts (individual scores like 42, 68, 75) as Data and match the keyboard entry step to Input.',
        'Classify calculating the class average and pass percentage as Processing.',
        'Classify the printed or on-screen lecturer summary as Output and saving the file to the campus drive as Storage.',
        'Classify the lecturer deciding which learners attend extra classes as Knowledge, and assign the campus admin staff to the Enterprise or Office user category.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s1-q1',
        prompt: 'A lecturer inspects a list of unlabelled numbers: "48, 52, 81, 63". After calculating the class average (61%) to compile a term report, what has the raw list become?',
        options: [
          'Hardware',
          'Information',
          'Volatile memory',
          'Secondary storage',
        ],
        correctIndex: 1,
        rationale: 'Raw numbers are data; once calculated, organised, and given context (class average 61%), they become meaningful information.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't1-s1-q2',
        prompt: 'Which sequence lists the four core stages of the Information Processing Cycle in the correct operational order?',
        options: [
          'Output -> Input -> Storage -> Processing',
          'Storage -> Processing -> Input -> Output',
          'Input -> Processing -> Output -> Storage',
          'Processing -> Storage -> Output -> Input',
        ],
        correctIndex: 2,
        rationale: 'A computer accepts raw facts (Input), manipulates them (Processing), presents results (Output), and retains them for later use (Storage).',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't1-s1-q3',
        prompt: 'A graphic designer who renders high-resolution 3D models and edits multi-track video on a workstation with specialised hardware best fits which user type?',
        options: [
          'Power user',
          'Casual home user',
          'Walk-in kiosk user',
          'Offline archive clerk',
        ],
        correctIndex: 0,
        rationale: 'Power users require high-performance hardware and specialised software for demanding tasks such as CAD, 3D rendering, or video editing.',
        leak: 'THEORY_RECALL',
      },
    ],
    evidenceTask: {
      prompt: 'Build a concise Topic 1 Section 1 terminology ladder separating Data, Information, Knowledge, the 4 processing stages, and two user types with a campus example.',
      deliverables: [
        '12-term Section 1 concept ladder (Data, Information, Knowledge, Input, Processing, Output, Storage, ICT, Digital Citizenship, SOHO, Mobile, Power User)',
        'Three short scenario justifications linking terms to real N5 lab tasks',
      ],
      checklist: [
        { id: 's1-chk1', label: 'Distinguished Data, Information, and Knowledge using a concrete campus example' },
        { id: 's1-chk2', label: 'Mapped all four Information Processing Cycle stages in order (Input -> Processing -> Output -> Storage)' },
        { id: 's1-chk3', label: 'Included one Digital Citizenship rule and matched at least two user types' },
      ],
    },
  },
  {
    id: 'topic1-section2',
    sectionCode: '2',
    releaseScope: 'wave1',
    category: 'theory',
    title: 'Systems Technologies',
    leakCode: 'THEORY_RECALL',
    nextAction: 'Contrast volatile RAM against persistent storage and classify PC vs mobile hardware, software, and ports.',
    concept: {
      summary:
        'A computer system pairs physical hardware components with non-physical software instructions. Examiners test whether you can separate working memory from long-term storage and match ports or wireless links to real peripherals.',
      keyPoints: [
        'Personal Computers (desktops/laptops) are built for extended productivity, document production, and multi-window office tasks; Mobile Devices (smartphones/tablets) are compact, battery-powered, touch-first tools built for portability.',
        'Hardware includes physical parts you can touch (CPU, keyboard, monitor, SSD); Software includes programs and operating systems that tell hardware what to do.',
        'RAM (Primary Memory) is volatile—its contents vanish when power is lost; Secondary Storage (SSD, HDD, USB flash drive) is persistent/non-volatile and keeps files after shutdown.',
        'Wired ports (USB for peripherals/flash drives, HDMI/DisplayPort for video/audio, RJ-45 Ethernet for wired networks) differ from wireless standards (Wi-Fi for network/Internet access, Bluetooth for short-range peripherals).',
      ],
    },
    cbtTip:
      'Exam trap: Never confuse RAM with hard-drive/SSD storage—if unsaved work disappears during a power failure, RAM (volatile memory) was holding it, not the SSD.',
    triggerTable: [
      {
        contrast: 'Hardware vs Software',
        rule: 'Hardware = physical electronic/mechanical components; Software = non-physical instructions/programs (system or application).',
      },
      {
        contrast: 'RAM vs Secondary Storage (SSD/HDD)',
        rule: 'RAM is fast, temporary, and volatile (clears when power is off); Secondary storage is persistent/non-volatile for long-term saving.',
      },
      {
        contrast: 'Personal Computer vs Mobile Device',
        rule: 'PC prioritises full keyboard/screen ergonomics and heavy productivity; Mobile device prioritises battery life, portability, and touch/wireless use.',
      },
      {
        contrast: 'USB / HDMI / Ethernet vs Wi-Fi / Bluetooth',
        rule: 'USB connects peripherals/storage, HDMI carries digital video/audio, Ethernet cables connect LANs; Wi-Fi links wireless LANs while Bluetooth pairs close-range devices.',
      },
    ],
    guidedPractice: {
      title: 'Computer Lab Hardware & Memory Diagnostic',
      scenario:
        'A student loses an unsaved Word letter when a lab plug trips, then needs to connect a projector, plug in a flash drive, and pair wireless headphones to a tablet.',
      steps: [
        'Explain why the unsaved Word changes vanished: active edits were held in volatile RAM before being written to persistent secondary storage.',
        'Classify Microsoft Word as application software and Windows as system software running on the PC hardware.',
        'Select HDMI (or VGA/DisplayPort where fitted) to connect the external projector and USB to read the flash drive.',
        'Select Bluetooth to pair the wireless headphones to the tablet and Wi-Fi to reach the campus network without a cable.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s2-q1',
        prompt: 'A learner types for 20 minutes without saving, and the power fails. Why is the latest work lost when the computer restarts?',
        options: [
          'The CPU permanently deletes all Word documents on reboot',
          'Unsaved changes were stored in volatile RAM, which loses its contents without power',
          'Secondary storage erases files whenever a keyboard is unplugged',
          'The HDMI port cleared the hard drive cache',
        ],
        correctIndex: 1,
        rationale: 'RAM is volatile primary memory used for active programs and open unsaved work; contents only survive power loss once saved to non-volatile secondary storage.',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't1-s2-q2',
        prompt: 'Which pairing correctly classifies one example of hardware and one example of software?',
        options: [
          'Hardware: Microsoft Excel · Software: USB flash drive',
          'Hardware: Windows 11 · Software: Motherboard',
          'Hardware: Solid-State Drive (SSD) · Software: Word processor application',
          'Hardware: Mail Merge · Software: Ethernet cable',
        ],
        correctIndex: 2,
        rationale: 'An SSD is a physical storage device (hardware), whereas a word processor is a program of instructions (software).',
        leak: 'THEORY_RECALL',
      },
      {
        id: 't1-s2-q3',
        prompt: 'Which connection should you choose to send high-definition video and audio from a laptop to a classroom projector over a single cable?',
        options: [
          'Bluetooth',
          'HDMI port',
          'RJ-45 Ethernet port',
          'PS/2 mouse port',
        ],
        correctIndex: 1,
        rationale: 'HDMI carries both digital video and audio to monitors and projectors over one cable; Ethernet is for wired networking and Bluetooth is wireless.',
        leak: 'THEORY_RECALL',
      },
    ],
    evidenceTask: {
      prompt: 'Complete a Systems Role Table comparing PC vs mobile device, hardware vs software, RAM vs SSD, and wired ports vs wireless connections.',
      deliverables: [
        'Systems role contrast table with 4 rows',
        'Five clue-to-component justifications based on lab troubleshooting scenarios',
      ],
      checklist: [
        { id: 's2-chk1', label: 'Explained volatile RAM vs persistent secondary storage accurately' },
        { id: 's2-chk2', label: 'Classified at least three hardware devices and two software categories correctly' },
        { id: 's2-chk3', label: 'Matched USB, HDMI, Ethernet, Wi-Fi, and Bluetooth to exact usage clues' },
      ],
    },
  },
  {
    id: 'topic1-section3',
    sectionCode: '3',
    releaseScope: 'wave1',
    category: 'files',
    title: 'Operating System and File Management',
    leakCode: 'FILE_MGMT',
    nextAction: 'Execute the Documents\\CPN5 Topic 1 organise, rename, search, properties, and .zip compression drill without altering originals.',
    concept: {
      summary:
        'The Operating System (OS) manages hardware and software and gives users File Explorer (Win+E) to organise drives, folders, files, and shortcuts. Precision in paths, extensions, copy-vs-move, and archive compression protects easy marks.',
      keyPoints: [
        'File Explorer (shortcut Win+E) displays drives (e.g. C:\\), folder hierarchy, file names, file extensions (.docx, .xlsx, .pdf, .zip), sizes, and dates.',
        'A File holds stored data/work; a Folder is a container for files and subfolders; a Shortcut (.lnk) is only a pointer to an item—deleting a shortcut does not delete the original file.',
        'Copy (Ctrl+C -> Ctrl+V) creates a duplicate so the original stays in place; Move (Ctrl+X -> Ctrl+V) relocates the item and removes it from the source folder.',
        'Right-click -> Properties reveals exact location path, size on disk, and file type; File Explorer Search locates files by name or extension; Send to -> Compressed (zipped) folder creates a .zip package.',
      ],
    },
    cbtTip:
      'Exam trap: Always preserve original template files by copying or using Save As first, and never rename or erase the file extension (e.g. .docx or .xlsx) when renaming a file.',
    triggerTable: [
      {
        contrast: 'Copy (Ctrl+C) vs Move (Ctrl+X)',
        rule: 'Copy leaves the original file untouched in the source folder; Move transfers the file out of the source folder into the destination.',
      },
      {
        contrast: 'File vs Folder vs Shortcut',
        rule: 'A file stores content, a folder organises files, and a shortcut (.lnk) only points to the target without duplicating its data.',
      },
      {
        contrast: 'File Name vs File Extension',
        rule: 'The name identifies the document; the extension after the dot (.docx, .xlsx, .pdf, .zip) tells the OS which application opens it.',
      },
      {
        contrast: 'Delete to Recycle Bin vs Permanent Delete (Shift+Delete)',
        rule: 'Standard Delete moves local items to the Recycle Bin where they can be restored; Shift+Delete bypasses the Recycle Bin.',
      },
    ],
    guidedPractice: {
      title: 'Documents\\CPN5 Topic 1 Worked Folder Organisation',
      scenario:
        'Topic 1 files are scattered across Desktop and Downloads. You must build Documents\\CPN5 Topic 1, copy source files safely, rename cleanly, check Properties, search by extension, and create a .zip backup.',
      steps: [
        'Press Win+E to open File Explorer, navigate to Documents, and create a main folder named CPN5 Topic 1 with subfolders Working and Backup.',
        'Copy (Ctrl+C -> Ctrl+V) the scattered Topic 1 files into Working so originals remain safe, and rename them clearly while keeping extensions intact.',
        'Right-click one file and open Properties to verify its exact path, size, and extension, then run a File Explorer search (e.g. *.docx) inside Documents\\CPN5 Topic 1.',
        'Right-click the organised folder and compress it into a .zip archive inside Backup, then reopen the destination copy to confirm every file is readable.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s3-q1',
        prompt: 'An instruction says: "Copy the original template from 1_3 DATA FILES into Documents\\CPN5 Topic 1 and rename the copy." Which action protects the original file?',
        options: [
          'Use Cut (Ctrl+X) and Paste (Ctrl+V) so only one file exists',
          'Use Copy (Ctrl+C) and Paste (Ctrl+V), then rename only the pasted copy',
          'Delete the source folder before opening the file',
          'Create a desktop shortcut and rename the shortcut icon to .xlsx',
        ],
        correctIndex: 1,
        rationale: 'Copy + Paste creates an independent duplicate in the destination folder while leaving the original template intact.',
        leak: 'FILE_MGMT',
      },
      {
        id: 't1-s3-q2',
        prompt: 'Which keyboard shortcut opens Windows File Explorer directly, and which command creates a single .zip package of a completed folder?',
        options: [
          'Ctrl+E to open File Explorer; Format Disk to create a .zip package',
          'Win+E to open File Explorer; Send to > Compressed (zipped) folder (or Compress to ZIP file)',
          'Alt+F4 to open File Explorer; Print to PDF to create a .zip package',
          'Win+D to open File Explorer; Create Shortcut to make a .zip package',
        ],
        correctIndex: 1,
        rationale: 'Win+E opens File Explorer, and compressing a folder produces a portable .zip archive containing its structure and files.',
        leak: 'FILE_MGMT',
      },
      {
        id: 't1-s3-q3',
        prompt: 'A student deletes a desktop shortcut (.lnk) pointing to Documents\\CPN5 Topic 1\\Notes.docx. What happens to Notes.docx?',
        options: [
          'Notes.docx is permanently destroyed immediately',
          'Notes.docx remains intact inside Documents\\CPN5 Topic 1 because only the pointer was deleted',
          'Notes.docx automatically converts into a .zip file',
          'Notes.docx loses its .docx extension',
        ],
        correctIndex: 1,
        rationale: 'A shortcut is only a link to a file or folder; deleting the shortcut removes the link, not the underlying file.',
        leak: 'FILE_MGMT',
      },
    ],
    evidenceTask: {
      prompt: 'Execute the Documents\\CPN5 Topic 1 organisation drill and attach proof of folder tree, Properties inspection, and compressed .zip output.',
      deliverables: [
        'Screenshot of Documents\\CPN5 Topic 1 showing organised files and visible path bar',
        'Properties window screenshot or before/after file list with copy-vs-move note',
      ],
      checklist: [
        { id: 's3-chk1', label: 'Created Documents\\CPN5 Topic 1 and copied (did not overwrite) original data files' },
        { id: 's3-chk2', label: 'Verified file extensions and Properties (path/size) without stripping extensions' },
        { id: 's3-chk3', label: 'Created a .zip backup archive and confirmed the destination files reopen cleanly' },
      ],
    },
  },
  {
    id: 'topic1-section4a',
    sectionCode: '4A',
    releaseScope: 'wave1',
    category: 'word',
    title: 'Word Processing Foundations',
    leakCode: 'WORD_LAYOUT',
    nextAction: 'Classify business document types and build a clean document skeleton using built-in Heading styles instead of manual spacing.',
    concept: {
      summary:
        'A word processor is application software used to create, edit, format, save, print, and share text-based documents. Professional Word control begins by matching the right business document type and separating document structure from manual appearance.',
      keyPoints: [
        'Core business document types in N5: Business Letters (formal external communication), Reports (structured analysis/findings), Forms (structured data capture), Memos (short internal office communication), Agendas (planned topics before a meeting), and Minutes (official record of decisions and actions taken during a meeting).',
        'Document structure uses built-in Styles (Heading 1, Heading 2, Normal) and paragraph spacing so Word understands hierarchy for Navigation Pane and automatic Tables of Contents.',
        'Manual appearance hacks—such as pressing Enter repeatedly for blank gaps, pressing Spacebar to align columns, or making headings manually bold without Heading styles—break layout when text reflows.',
        'Word Wrap automatically moves text to the next line at the right margin; press Enter only at the end of a paragraph or heading.',
      ],
    },
    cbtTip:
      'Exam trap: Do not confuse an Agenda (plan sent before a meeting) with Minutes (official record written after/during a meeting), and never use repeated Enter keys or spaces for layout.',
    triggerTable: [
      {
        contrast: 'Agenda vs Minutes',
        rule: 'An Agenda lists items to be discussed before a meeting; Minutes record what was discussed and decided in the meeting.',
      },
      {
        contrast: 'Memo vs Business Letter',
        rule: 'A Memo is brief internal staff communication; a Business Letter is formal external correspondence with addresses and salutation.',
      },
      {
        contrast: 'Built-in Heading Styles vs Manual Bold/Size',
        rule: 'Heading Styles tag structural hierarchy (enabling TOC and Navigation Pane); manual bold/size only changes character appearance.',
      },
      {
        contrast: 'Word Wrap vs Hard Return (Enter)',
        rule: 'Let Word Wrap flow sentences within a paragraph automatically; use Enter only to start a new paragraph.',
      },
    ],
    guidedPractice: {
      title: 'Separating Structure from Appearance in a Meeting Pack',
      scenario:
        'You receive a rough plain-text campus committee file containing blank Enter lines, Spacebar-aligned headings, and unstyled sections that must become a structured Word report.',
      steps: [
        'Turn on Show/Hide Formatting Marks (Home > ¶) to expose stray spaces, tabs, and repeated empty paragraph marks.',
        'Remove extra blank Enter lines between sections and apply built-in Heading 1 and Heading 2 styles from the Home > Styles gallery.',
        'Classify the document correctly (e.g. Agenda before meeting vs Minutes after meeting) and ensure paragraphs flow naturally with Word Wrap.',
        'Open View > Navigation Pane to verify that every section heading appears cleanly in the structural outline.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s4a-q1',
        prompt: 'Which business document officially records the attendance, discussions, and decisions taken during a committee meeting?',
        options: [
          'Agenda',
          'Minutes',
          'Invoice form',
          'Mailing label',
        ],
        correctIndex: 1,
        rationale: 'Minutes record what happened and was decided during the meeting, whereas an Agenda lists planned items beforehand.',
        leak: 'WORD_LAYOUT',
      },
      {
        id: 't1-s4a-q2',
        prompt: 'Why should you apply built-in Heading 1 / Heading 2 styles instead of manually making heading text bold and larger?',
        options: [
          'Manual bold text cannot be printed in Landscape orientation',
          'Heading styles define document structure for Navigation Pane and automatic Tables of Contents',
          'Heading styles automatically compress the file into a .zip archive',
          'Manual bold text removes paragraph alignment options',
        ],
        correctIndex: 1,
        rationale: 'Built-in Heading styles separate structure from appearance, enabling consistent styling, Navigation Pane outline, and automatic TOC generation.',
        leak: 'WORD_LAYOUT',
      },
      {
        id: 't1-s4a-q3',
        prompt: 'Which tool on the Home tab reveals hidden spaces, tabs, and repeated Enter marks so you can clean manual layout errors?',
        options: [
          'Track Changes',
          'Show/Hide ¶ (Formatting Marks)',
          'Format Painter',
          'Drop Cap',
        ],
        correctIndex: 1,
        rationale: 'Show/Hide ¶ makes non-printing spaces, tabs, paragraph marks, and breaks visible for precise cleanup.',
        leak: 'WORD_LAYOUT',
      },
    ],
    evidenceTask: {
      prompt: 'Clean up a draft Word document by removing manual blank lines and applying built-in Heading styles and Normal paragraph structure.',
      deliverables: [
        'Structured Word document (.docx) using Heading 1/Heading 2 styles',
        'Short note classifying three business document types (Memo, Agenda, Minutes)',
      ],
      checklist: [
        { id: 's4a-chk1', label: 'Enabled Show/Hide ¶ and removed manual blank Enter lines or spacebar padding' },
        { id: 's4a-chk2', label: 'Applied built-in Heading styles rather than manual bold/size formatting' },
        { id: 's4a-chk3', label: 'Verified document outline in Navigation Pane and saved cleanly' },
      ],
    },
  },
  {
    id: 'topic1-section4b',
    sectionCode: '4B',
    releaseScope: 'wave1',
    category: 'word',
    title: 'Word Processing Formatting and Page Layout',
    leakCode: 'WORD_LAYOUT',
    nextAction: 'Separate character vs paragraph formatting, configure Layout > Page Setup, isolate Landscape pages with Section Breaks, and insert dynamic PAGE/NUMPAGES fields.',
    concept: {
      summary:
        'Accurate Word layout depends on using the right level of control: character formatting for selected text, paragraph formatting for whole blocks, Layout > Page Setup for page geometry, Section Breaks for mixed orientations/headers, and automatic fields for page numbers.',
      keyPoints: [
        'Text (Character) Formatting changes selected characters (Font, Font Size, Bold, Italic, Underline, Font Colour); Paragraph Formatting controls whole paragraphs (Left/Centre/Right/Justify alignment, Line Spacing, Space Before/After, Indentation).',
        'Lists: use Bullets for unordered items, Numbering for sequential steps, and Multilevel Lists for numbered sub-sections (1, 1.1, 1.2).',
        'Page Setup lives on the Layout tab: Orientation (Portrait vs Landscape), Margins (e.g. Narrow, Normal, Custom), and Size (A4 vs Letter).',
        'A Page Break (Ctrl+Enter) pushes content onto a new page within the same layout; a Section Break (Layout > Breaks > Next Page) starts a new section so you can switch orientation or unlink Headers/Footers (Link to Previous off).',
        'Headers and Footers repeat across pages; always insert automatic PAGE and NUMPAGES fields (Insert > Header & Footer / Page Number) rather than typing static numbers.',
      ],
    },
    cbtTip:
      'Exam trap: Pressing Enter repeatedly to reach page 2 fails when text changes, and changing one page to Landscape without a Section Break flips the entire document.',
    triggerTable: [
      {
        contrast: 'Text Formatting vs Paragraph Formatting',
        rule: 'Text formatting affects selected characters (font/bold/colour); Paragraph formatting affects whole paragraphs (alignment, spacing, indents).',
      },
      {
        contrast: 'Page Break vs Section Break',
        rule: 'Page Break forces a new page with identical setup; Section Break isolates sections so Orientation, Margins, or Headers/Footers can differ.',
      },
      {
        contrast: 'Bullets vs Numbered vs Multilevel List',
        rule: 'Bullets = unordered points; Numbering = ordered steps; Multilevel = nested hierarchy (e.g. 1.1, 1.2).',
      },
      {
        contrast: 'Automatic PAGE / NUMPAGES Fields vs Typed Page Number',
        rule: 'Dynamic PAGE and NUMPAGES fields update automatically when pages are added/removed; typed digits stay frozen and wrong.',
      },
    ],
    guidedPractice: {
      title: 'Mixed-Orientation Report with Dynamic Footer Fields',
      scenario:
        'A 3-page campus report needs A4 size, Portrait pages 1 and 3, a wide Landscape page 2 for a schedule, and a footer reading "Page X of Y".',
      steps: [
        'Open Layout > Size and set A4, then configure Margins and Paragraph spacing (Space After) on the body text.',
        'Insert Layout > Breaks > Next Page (Section Break) before and after page 2, then switch only Section 2 via Layout > Orientation > Landscape.',
        'Open the Footer (Insert > Footer), disable Link to Previous if section footers differ, and insert automatic Page X of Y using PAGE and NUMPAGES fields.',
        'Inspect Print Preview to verify page 2 is Landscape while pages 1 and 3 remain Portrait with consecutive dynamic numbering.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s4b-q1',
        prompt: 'You must make ONLY page 2 of a 4-page Word report Landscape while keeping pages 1, 3, and 4 Portrait. What must you insert before and after page 2?',
        options: [
          'Two Page Breaks (Ctrl+Enter)',
          'Two Section Breaks (Next Page)',
          'Two Text Boxes',
          'Two Manual Line Breaks (Shift+Enter)',
        ],
        correctIndex: 1,
        rationale: 'Page orientation belongs to a section; Next Page Section Breaks isolate page 2 so Landscape applies only to that section.',
        leak: 'WORD_LAYOUT',
      },
      {
        id: 't1-s4b-q2',
        prompt: 'Which ribbon tab in Microsoft Word contains Orientation, Margins, Size, and Breaks for Page Setup?',
        options: [
          'Insert',
          'Layout',
          'Review',
          'Mailings',
        ],
        correctIndex: 1,
        rationale: 'Page Setup controls—Margins, Orientation, Size, Columns, and Breaks—are located on the Layout tab.',
        leak: 'RIBBON_NAV',
      },
      {
        id: 't1-s4b-q3',
        prompt: 'In a Word footer, why should you insert PAGE and NUMPAGES fields instead of typing "Page 1 of 3" manually?',
        options: [
          'Typed numbers prevent the document from saving as .docx',
          'Automatic fields recalculate dynamically on every page and update when content changes',
          'Automatic fields convert paragraphs into multilevel lists',
          'Typed numbers force the printer into Landscape mode',
        ],
        correctIndex: 1,
        rationale: 'A manually typed page number repeats identically on every page in a shared footer; PAGE and NUMPAGES update dynamically per page.',
        leak: 'WORD_LAYOUT',
      },
    ],
    evidenceTask: {
      prompt: 'Apply Page Setup, a Next Page Section Break for one Landscape page, paragraph spacing, and a dynamic PAGE / NUMPAGES footer.',
      deliverables: [
        'Before/after layout proof showing mixed Portrait and Landscape pages',
        'Document exported or previewed with automatic "Page X of Y" footer fields',
      ],
      checklist: [
        { id: 's4b-chk1', label: 'Applied paragraph spacing and list formatting without manual blank lines' },
        { id: 's4b-chk2', label: 'Isolated a Landscape page using Section Breaks (Next Page) on the Layout tab' },
        { id: 's4b-chk3', label: 'Inserted dynamic PAGE and NUMPAGES fields in the Header or Footer' },
      ],
    },
  },
  {
    id: 'topic1-section4c',
    sectionCode: '4C',
    releaseScope: 'wave1',
    category: 'word',
    title: 'Word Objects and Professional Controls',
    leakCode: 'WORD_LAYOUT',
    nextAction: 'Insert and name Tables, Pictures, Shapes, Charts, SmartArt, and Text Boxes accurately with captions and wrap controls.',
    concept: {
      summary:
        'An inserted object is any non-body-text item placed into a Word document. N5 learners lose marks when they call every grid a "chart" or every visual a "picture"—exact Word object naming, captions, and text-wrapping controls are required.',
      keyPoints: [
        'A Table organises structured text or figures into horizontal Rows, vertical Columns, and individual Cells—never call a table a chart.',
        'Exact Inserted Object names on the Insert tab: Picture (photo/bitmap image), Shape (drawn geometric vector/callout/arrow), Chart (data graph linked to spreadsheet values), SmartArt (structured process/hierarchy diagram), and Text Box (movable framed text container).',
        'Use References > Insert Caption (or right-click object -> Insert Caption) to label tables and figures consistently (e.g. Table 1, Figure 1).',
        'Use Layout Options / Wrap Text (In Line with Text, Square, Tight, Top and Bottom) and Align controls to keep objects anchored cleanly without hiding body text.',
      ],
    },
    cbtTip:
      'Exam trap: Do not call a Table a "Chart", and do not call SmartArt or a Shape a "Picture"—each object has an exact Insert command and distinct purpose.',
    triggerTable: [
      {
        contrast: 'Table vs Chart',
        rule: 'A Table arranges data in rows, columns, and cells; a Chart visualises numeric series graphically (bar, column, pie, line).',
      },
      {
        contrast: 'Picture vs Shape vs SmartArt vs Text Box',
        rule: 'Picture = external image; Shape = drawn geometric/line object; SmartArt = prebuilt diagram (process/cycle/hierarchy); Text Box = movable text frame.',
      },
      {
        contrast: 'In Line with Text vs Square / Tight Wrap',
        rule: 'In Line moves with text as a character; Square/Tight lets text flow neatly around a positioned object.',
      },
      {
        contrast: 'Insert Caption vs Manual Typed Label',
        rule: 'References > Insert Caption binds numbering (Figure 1, Table 1) to the object and enables automatic Lists of Figures/Tables.',
      },
    ],
    guidedPractice: {
      title: 'Campus Equipment Summary with Table, SmartArt, and Captioned Picture',
      scenario:
        'Enhance a campus technology memo with a 3-column hardware table, a SmartArt process diagram for the Information Processing Cycle, and a positioned Picture with a caption.',
      steps: [
        'Insert a Table (Insert > Table) with clear column headers, shading, and borders, verifying rows, columns, and cells are cleanly aligned.',
        'Insert a SmartArt Process diagram (Insert > SmartArt) for Input -> Processing -> Output -> Storage rather than drawing separate boxes manually.',
        'Insert a Picture (Insert > Pictures), set Wrap Text to Square, align it cleanly to the right margin, and resize from a corner handle to preserve aspect ratio.',
        'Add captions via References > Insert Caption (Table 1 and Figure 1) and verify no text overlaps in Print Preview.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s4c-q1',
        prompt: 'An examiner asks you to organise staff names, extensions, and office numbers into rows, columns, and cells. Which Word feature must you insert?',
        options: [
          'Chart',
          'Table',
          'SmartArt',
          'WordArt',
        ],
        correctIndex: 1,
        rationale: 'A Table consists of rows, columns, and cells for structured comparison; a Chart is a numeric graph.',
        leak: 'WORD_LAYOUT',
      },
      {
        id: 't1-s4c-q2',
        prompt: 'Which Word object is specifically designed to display an editable process flow or organisational hierarchy diagram?',
        options: [
          'SmartArt',
          'Picture',
          'Bookmark',
          'Drop Cap',
        ],
        correctIndex: 0,
        rationale: 'SmartArt provides structured diagram layouts (List, Process, Cycle, Hierarchy) unlike static Pictures.',
        leak: 'WORD_LAYOUT',
      },
      {
        id: 't1-s4c-q3',
        prompt: 'After inserting a Picture into a Word report, text collides awkwardly or jumps to the next page. Which control lets body text flow neatly around the image borders?',
        options: [
          'Wrap Text (e.g. Square or Tight) on Picture Format / Layout Options',
          'Track Changes on the Review tab',
          'Clear All Formatting on the Home tab',
          'Freeze Panes on the View tab',
        ],
        correctIndex: 0,
        rationale: 'Wrap Text controls (Square, Tight, Top and Bottom, In Line with Text) govern how body text flows around a positioned object.',
        leak: 'WORD_LAYOUT',
      },
    ],
    evidenceTask: {
      prompt: 'Create a one-page Word handout containing a formatted Table, one SmartArt or Shape object, and a captioned Picture with Square wrap.',
      deliverables: [
        'Word document (.docx) showing Table, SmartArt/Shape, and captioned Picture',
        'Object-naming verification note identifying each object by its exact Word name',
      ],
      checklist: [
        { id: 's4c-chk1', label: 'Inserted a Table with rows, columns, and cells (not a Chart or tab-spaced text)' },
        { id: 's4c-chk2', label: 'Used exact object names (Picture, Shape, Chart, SmartArt, Text Box) and added a Caption' },
        { id: 's4c-chk3', label: 'Applied Wrap Text positioning and resized without distorting aspect ratio' },
      ],
    },
  },
  {
    id: 'topic1-section5',
    sectionCode: '5',
    releaseScope: 'wave1',
    category: 'word',
    title: 'Mail Merge and External Data Integration',
    leakCode: 'MAIL_MERGE',
    nextAction: 'Follow the 5-step Mailings tab flow linking a fixed Word main document to an Excel worksheet data source.',
    concept: {
      summary:
        'Mail Merge produces personalised letters, labels, envelopes, or emails by combining one fixed Word Main Document with a structured External Data Source such as an Excel worksheet.',
      keyPoints: [
        'Main Document: the fixed Word layout and standard text shared across every recipient.',
        'External Data Source (e.g. Excel worksheet): row 1 holds clean Field Names (column headers); each Column is one Field (e.g. FirstName, Course, Venue) and each Row is one Record (one recipient).',
        'Merge Fields (e.g. <<FirstName>>) act as placeholders inside the Main Document where Word pulls each record’s data.',
        'Mandatory 5-step Mailings tab sequence: 1. Start Mail Merge -> 2. Select Recipients -> 3. Insert Merge Field -> 4. Preview Results -> 5. Finish & Merge.',
      ],
    },
    cbtTip:
      'Exam trap: Never type <<FirstName>> manually with keyboard angle brackets—always use Mailings > Insert Merge Field, and never skip Preview Results before Finish & Merge.',
    triggerTable: [
      {
        contrast: 'Main Document vs Data Source',
        rule: 'Main Document = fixed Word letter/label layout; Data Source = external list (Excel/Access/table) supplying variable recipient details.',
      },
      {
        contrast: 'Column vs Row in Excel Data Source',
        rule: 'Each Column is a Field (attribute like Surname or Fee); each Row is a Record (one complete person/entry).',
      },
      {
        contrast: 'Typed <<Field>> vs Insert Merge Field',
        rule: 'Typed chevrons are plain dead text; Insert Merge Field creates a live link to the data source column.',
      },
      {
        contrast: 'Preview Results vs Finish & Merge',
        rule: 'Preview Results checks spacing/punctuation on sample records in the main doc; Finish & Merge generates the final merged output document.',
      },
    ],
    guidedPractice: {
      title: 'Support-Session Invitation Mail Merge',
      scenario:
        'You must send personalised Computer Practice support-session letters to learners listed in an Excel workbook containing Title, FirstName, Surname, Room, and Date columns.',
      steps: [
        'Inspect the Excel worksheet first to confirm row 1 has clean column headers (fields) and each row below represents one student (record), then save and close Excel.',
        'In Word, write the standard letter (leaving gaps for personalised fields), then click Mailings > Start Mail Merge > Letters.',
        'Click Mailings > Select Recipients > Use an Existing List to link the Excel sheet, then place cursors and click Insert Merge Field for <<Title>>, <<FirstName>>, <<Surname>>, <<Room>>, and <<Date>>.',
        'Click Preview Results and step through records to check spaces/punctuation, then run Finish & Merge > Edit Individual Documents (All) and save both the main document and merged output.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s5-q1',
        prompt: 'Which sequence on the Word Mailings tab completes a Mail Merge correctly without skipping verification?',
        options: [
          'Insert Merge Field -> Start Mail Merge -> Finish & Merge -> Select Recipients',
          'Start Mail Merge -> Select Recipients -> Insert Merge Field -> Preview Results -> Finish & Merge',
          'Select Recipients -> Preview Results -> Design Themes -> Save As PDF',
          'Finish & Merge -> Insert Merge Field -> Select Recipients -> Start Mail Merge',
        ],
        correctIndex: 1,
        rationale: 'You set the document type (Start Mail Merge), connect the list (Select Recipients), place fields (Insert Merge Field), inspect records (Preview Results), and generate output (Finish & Merge).',
        leak: 'MAIL_MERGE',
      },
      {
        id: 't1-s5-q2',
        prompt: 'When an Excel worksheet serves as a Mail Merge external data source, what does one column represent and what does one row represent?',
        options: [
          'Column = record; Row = field',
          'Column = main document; Row = merged PDF',
          'Column = field; Row = record',
          'Column = workbook; Row = merge preview',
        ],
        correctIndex: 2,
        rationale: 'In a structured tabular data source, each column header defines a field (e.g. Surname) and each data row stores one recipient record.',
        leak: 'MAIL_MERGE',
      },
      {
        id: 't1-s5-q3',
        prompt: 'A student types <<Surname>> using the keyboard instead of using Insert Merge Field. What happens during Preview Results?',
        options: [
          'Word automatically replaces it with every student surname',
          'It prints literally as "<<Surname>>" on every letter because it is plain text, not a merge field',
          'Excel deletes the Surname column',
          'Word converts the letter into mailing labels',
        ],
        correctIndex: 1,
        rationale: 'Only fields inserted via Mailings > Insert Merge Field bind dynamically to the recipient list; typed angle brackets stay static text.',
        leak: 'MAIL_MERGE',
      },
    ],
    evidenceTask: {
      prompt: 'Link a Word support-session letter to an Excel recipient sheet, preview records for spacing accuracy, and save both the main template and merged output.',
      deliverables: [
        'Excel recipient source file (with clear field headers)',
        'Word main document showing merge fields and final merged output document',
      ],
      checklist: [
        { id: 's5-chk1', label: 'Verified Excel data source has clean field columns and record rows before linking' },
        { id: 's5-chk2', label: 'Followed Start Mail Merge -> Select Recipients -> Insert Merge Field sequence' },
        { id: 's5-chk3', label: 'Ran Preview Results to check spaces/punctuation before Finish & Merge' },
      ],
    },
  },
  {
    id: 'topic1-section6a',
    sectionCode: '6A',
    releaseScope: 'wave1',
    category: 'excel',
    title: 'Spreadsheet Foundations',
    leakCode: 'EXCEL_FUNCTIONS',
    nextAction: 'Master workbook vs worksheet language, cell syntax (B4), Name Box vs Formula Bar, and the MTBS Stationery Cost Register layout.',
    concept: {
      summary:
        'A spreadsheet organises data in rows and columns to calculate, analyse, and present results. Learners lose marks when they rush into formulas without knowing exact Excel vocabulary: workbook, worksheet, cell, range, Name Box, and Formula Bar.',
      keyPoints: [
        'A Workbook is the entire Excel file (.xlsx); a Worksheet is one individual grid tab inside that workbook (e.g. Sheet1 renamed to Stationery_Costs).',
        'Rows run horizontally (1, 2, 3...); Columns run vertically (A, B, C...); a Cell is their intersection; a Range is a rectangular block of cells written with a colon (e.g. B4:B9).',
        'Cell address syntax always puts the Column letter first, then the Row number (e.g. B4 = Column B, Row 4—never 4B).',
        'The Name Box (top-left) displays the active cell address (or lets you jump to a cell); the Formula Bar displays the true stored number, text, or = formula inside the selected cell.',
      ],
    },
    cbtTip:
      'Exam trap: Never write row before column (4B is invalid—write B4), and always inspect the Formula Bar rather than trusting only what looks displayed on screen.',
    triggerTable: [
      {
        contrast: 'Workbook vs Worksheet',
        rule: 'Workbook = the whole .xlsx file; Worksheet = a single tabbed grid page inside the workbook.',
      },
      {
        contrast: 'Cell vs Range',
        rule: 'A single cell is addressed as B4; a contiguous block of cells is a range written with a colon such as B4:D10.',
      },
      {
        contrast: 'Name Box vs Formula Bar',
        rule: 'Name Box shows/navigates the active cell reference (e.g. C5); Formula Bar shows the actual stored formula or raw value.',
      },
      {
        contrast: 'Row vs Column',
        rule: 'Rows run horizontally and are numbered (1, 2, 3); Columns run vertically and are lettered (A, B, C).',
      },
    ],
    guidedPractice: {
      title: 'MTBS Stationery Cost Register Setup',
      scenario:
        'Build the MTBS Stationery Cost Register in a blank Excel workbook, rename the sheet, inspect Name Box and Formula Bar behaviour, and enter structured item quantities and unit prices.',
      steps: [
        'Open a blank Excel workbook and rename Sheet1 (right-click tab -> Rename) to Stationery_Register.',
        'Click cell B4, confirm "B4" appears in the Name Box, and enter column headings across row 3 (Item, Quantity, Unit Price, Line Total).',
        'Enter 5 stationery items with quantities in B4:B8 and unit prices in C4:C8, checking the Formula Bar to confirm raw numbers are stored cleanly without text symbols like "R" typed manually.',
        'Enter =B4*C4 in D4, press Enter, and compare the displayed result in D4 against the underlying formula shown in the Formula Bar.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s6a-q1',
        prompt: 'Which cell reference correctly identifies the intersection of Column D and Row 12 in an Excel worksheet?',
        options: [
          '12D',
          'D:12',
          'D12',
          'SheetD12',
        ],
        correctIndex: 2,
        rationale: 'Excel cell addresses always place the column letter first followed by the row number (D12).',
        leak: 'EXCEL_FUNCTIONS',
      },
      {
        id: 't1-s6a-q2',
        prompt: 'When cell D4 displays R 450.00, where must you look to confirm whether D4 holds a typed number or an actual formula such as =B4*C4?',
        options: [
          'The Status Bar zoom slider',
          'The Formula Bar',
          'The Quick Access Print button',
          'The Page Orientation menu',
        ],
        correctIndex: 1,
        rationale: 'The cell itself displays the formatted result, while the Formula Bar reveals the underlying formula or raw stored value.',
        leak: 'EXCEL_FUNCTIONS',
      },
      {
        id: 't1-s6a-q3',
        prompt: 'What is the difference between a Workbook and a Worksheet in Microsoft Excel?',
        options: [
          'A Workbook is one cell; a Worksheet is a single row',
          'A Workbook is the entire .xlsx file; a Worksheet is an individual tab/page inside that workbook',
          'A Worksheet saves data permanently; a Workbook is volatile memory',
          'There is no difference; both terms mean a Word table',
        ],
        correctIndex: 1,
        rationale: 'An Excel workbook (.xlsx) is the container file that holds one or more tabbed worksheets.',
        leak: 'EXCEL_FUNCTIONS',
      },
    ],
    evidenceTask: {
      prompt: 'Create the MTBS Stationery Cost Register workbook, rename the worksheet tab, and capture proof showing both values and Formula Bar / Formula View.',
      deliverables: [
        'MTBS Stationery Cost Register (.xlsx) with renamed worksheet tab',
        'Screenshot or proof showing Formula Bar / Show Formulas view',
      ],
      checklist: [
        { id: 's6a-chk1', label: 'Renamed Sheet1 meaningfully and kept one workbook file (.xlsx)' },
        { id: 's6a-chk2', label: 'Used valid column-then-row cell syntax (e.g. B4:C8) and clean numeric entries' },
        { id: 's6a-chk3', label: 'Verified stored formula in the Formula Bar and saved the workbook' },
      ],
    },
  },
  {
    id: 'topic1-section6b',
    sectionCode: '6B',
    releaseScope: 'wave1',
    category: 'excel',
    title: 'Spreadsheet Editing and Formatting',
    leakCode: 'SORT_FILTER',
    nextAction: 'Apply clean currency/border formatting, sort/filter on the Data tab without breaking rows, freeze headers, and check Page Break Preview.',
    concept: {
      summary:
        'Section 6B separates Editing (changing content or structure), Formatting (improving readability without altering values), and Data Handling (reordering or isolating records safely). Careful page setup ensures wide registers print cleanly.',
      keyPoints: [
        'Editing changes actual data or structure (inserting/deleting rows or columns, editing cell values); Formatting changes appearance only (Currency format, Wrap Text, Borders, Fill, Alignment).',
        'Sort & Filter live on the Data tab. Always select ONE cell inside a contiguous table (or the entire table) before sorting—sorting a single highlighted column scrambles rows and corrupts records!',
        'Freeze Panes (View > Freeze Panes) keeps header rows or label columns visible on screen while scrolling through large tables.',
        'Page Break Preview (View > Page Break Preview) lets you inspect and adjust exact page boundaries; check Print Preview before using Fit to Page so text never shrinks unreadably or violates an instruction forbidding Fit to Page.',
      ],
    },
    cbtTip:
      'Exam trap: Never highlight just one column and click Sort—that breaks row integrity! Also check instructions carefully: when told to use Page Break Preview rather than Fit to Page, adjust breaks/margins/orientation directly.',
    triggerTable: [
      {
        contrast: 'Editing vs Formatting',
        rule: 'Editing changes stored values, formulas, rows, or columns; Formatting changes only how cells look (Currency, borders, bold, wrap text).',
      },
      {
        contrast: 'Sort (Single Cell in Table) vs Sort (One Isolated Column)',
        rule: 'Selecting one cell inside a contiguous table keeps full rows locked together; sorting one selected column decouples data across rows.',
      },
      {
        contrast: 'Freeze Panes vs Print Titles',
        rule: 'Freeze Panes keeps headers visible while scrolling on screen; Print Titles repeats header rows on printed pages.',
      },
      {
        contrast: 'Page Break Preview vs Fit to Page',
        rule: 'Page Break Preview lets you drag/control exact page splits; Fit to Page scales the sheet proportionally and may be disallowed when manual layout is specified.',
      },
    ],
    guidedPractice: {
      title: 'Cleaning, Sorting, and Print-Checking the MTBS Register',
      scenario:
        'A 25-row stationery register has clipped headings, unsorted item names, raw decimal prices, and columns spilling onto page 2 when printed.',
      steps: [
        'Format currency columns as Currency/Accounting (2 decimals), apply Wrap Text and column auto-fit so no ### or clipped headers remain, and add clean borders.',
        'Click a single cell inside the Item column, open Data > Sort & Filter, sort A to Z, and confirm each item’s quantity and price moved with its row.',
        'Apply View > Freeze Panes > Freeze Top Row (or below header row) so headings remain visible while scrolling, and test Data > Filter on one category.',
        'Switch to View > Page Break Preview, adjust orientation/margins or drag the blue page break line as instructed, then verify in File > Print Preview.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s6b-q1',
        prompt: 'You want to sort an Excel marks register from highest to lowest Total while keeping every learner’s name aligned with their own marks. What is the safest selection before clicking Data > Sort?',
        options: [
          'Highlight only the Total column and choose "Continue with the current selection"',
          'Click one single cell inside the contiguous register table (or select the entire table including headers)',
          'Merge all cells in the Total column first',
          'Use Home > Wrap Text before sorting only column A',
        ],
        correctIndex: 1,
        rationale: 'Clicking one cell inside a contiguous table allows Excel to expand across all columns so entire rows sort together.',
        leak: 'SORT_FILTER',
      },
      {
        id: 't1-s6b-q2',
        prompt: 'Which Excel view keeps column headings locked at the top of the screen while you scroll down a long register?',
        options: [
          'View > Freeze Panes',
          'Data > Remove Duplicates',
          'Page Layout > Print Area',
          'Insert > Header & Footer',
        ],
        correctIndex: 0,
        rationale: 'Freeze Panes locks specified top rows or left columns on screen during scrolling.',
        leak: 'RIBBON_NAV',
      },
      {
        id: 't1-s6b-q3',
        prompt: 'An exam instruction says: "Do not use Fit to Page; adjust column widths and Page Break Preview so all columns appear on one page wide, then verify." What should you do?',
        options: [
          'Enable Scale to Fit: 1 page wide and skip Print Preview',
          'Switch to View > Page Break Preview, tune column widths/margins/orientation or page breaks, and inspect Print Preview',
          'Delete the last two columns so they fit',
          'Convert the workbook into a Word SmartArt object',
        ],
        correctIndex: 1,
        rationale: 'Following instruction qualifiers requires using Page Break Preview and layout adjustments instead of Fit to Page, then verifying in Print Preview.',
        leak: 'PRINT_OUTPUT',
      },
    ],
    evidenceTask: {
      prompt: 'Format, sort/filter safely on the Data tab, freeze headers, and prepare a clean Print Preview / Page Break Preview on your Excel register.',
      deliverables: [
        'Formatted and sorted Excel workbook (.xlsx)',
        'Screenshot or PDF export showing clean single-page-wide print layout with visible headers',
      ],
      checklist: [
        { id: 's6b-chk1', label: 'Formatted currency, borders, and column widths with zero ### truncation' },
        { id: 's6b-chk2', label: 'Sorted/filtered on Data tab while preserving full-row alignment' },
        { id: 's6b-chk3', label: 'Applied Freeze Panes and verified layout in Page Break Preview + Print Preview' },
      ],
    },
  },
  {
    id: 'topic1-section6c',
    sectionCode: '6C',
    releaseScope: 'wave1',
    category: 'excel',
    title: 'Spreadsheet Formulas and Functions',
    leakCode: 'EXCEL_REFERENCING',
    nextAction: 'Lock constant cells with $F$1, select exact functions (SUM, AVERAGE, COUNT, COUNTA, COUNTIF), and use ROUND when stored values must change.',
    concept: {
      summary:
        'Excel formula marks depend on choosing the exact function for the verb, locking constant cells with absolute references before copying down, and distinguishing stored rounding from visual decimal formatting.',
      keyPoints: [
        'Relative references (B4) shift automatically when copied down or across; Absolute references ($F$1) lock both column and row so every copied formula points to the same constant cell (e.g. VAT rate or discount %).',
        'Core N5 functions: =SUM(range) totals numbers; =AVERAGE(range) computes mean; =COUNT(range) counts only cells containing numbers; =COUNTA(range) counts all non-empty cells (text + numbers); =COUNTIF(range, criteria) counts cells meeting a condition (e.g. =COUNTIF(C4:C20, ">=50")).',
        'ROUND(formula, 2) changes the actual stored value in the cell to 2 decimal places; Decrease Decimal / Currency formatting only hides extra decimals visually while keeping unrounded digits in memory.',
        'Use Ctrl+` (Show Formulas) to audit every formula before printing or exporting formula evidence.',
      ],
    },
    cbtTip:
      'Exam trap: Copying =B4*F1 without $ signs turns F1 into F2, F3, F4 (zeroes/errors!). And never confuse COUNT (numbers only) with COUNTA (any non-blank cell).',
    triggerTable: [
      {
        contrast: 'Relative (F1) vs Absolute ($F$1)',
        rule: 'Relative shifts when copied down/across; Absolute ($F$1) locks a fixed rate/lookup cell across every copied row.',
      },
      {
        contrast: 'COUNT vs COUNTA vs COUNTIF',
        rule: 'COUNT counts numeric cells only; COUNTA counts all non-empty cells (including text); COUNTIF counts cells matching criteria.',
      },
      {
        contrast: 'SUM vs AVERAGE',
        rule: 'SUM adds all numeric values in the range; AVERAGE divides the sum by the count of numeric entries.',
      },
      {
        contrast: 'ROUND Function vs Decrease Decimal Button',
        rule: 'ROUND changes the underlying stored number; Decrease Decimal only alters display appearance and can cause downstream total mismatches.',
      },
    ],
    guidedPractice: {
      title: 'Formula & Function Audit on the MTBS Register',
      scenario:
        'Cell F1 holds a 15% VAT rate. You must compute VAT per row using an absolute reference, round line totals to 2 decimals with ROUND, and summarise totals and counts.',
      steps: [
        'In E4, write =ROUND(D4*$F$1, 2) so F1 remains locked when copied down to E8 and stored values are rounded to 2 decimal places.',
        'At the bottom of the register, calculate Grand Total with =SUM(...) and Mean Line Cost with =AVERAGE(...).',
        'Use =COUNTA(A4:A8) to count item names, =COUNT(B4:B8) to count numeric quantities, and =COUNTIF(D4:D8, ">500") to count high-value lines.',
        'Press Ctrl+` (Formulas > Show Formulas) to audit all formulas, verify no #REF! or drifted F2/F3 references exist, then toggle back and save.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s6c-q1',
        prompt: 'Cell F1 stores a 15% VAT rate. You enter a formula in E4 and copy it down to E10. Which formula prevents cell F1 from shifting to F2, F3, F4?',
        options: [
          '=D4*F1',
          '=D4*$F$1',
          '=$D$4*F1',
          '=SUM(D4:F1)',
        ],
        correctIndex: 1,
        rationale: 'Locking $F$1 makes the VAT rate an absolute reference while D4 remains relative and updates to D5..D10 per row.',
        leak: 'EXCEL_REFERENCING',
      },
      {
        id: 't1-s6c-q2',
        prompt: 'Which Excel function counts how many learners scored 50 or higher in range C4:C30?',
        options: [
          '=COUNT(C4:C30)',
          '=COUNTA(C4:C30, ">=50")',
          '=COUNTIF(C4:C30, ">=50")',
          '=SUM(C4:C30, ">=50")',
        ],
        correctIndex: 2,
        rationale: 'COUNTIF(range, criteria) counts only the cells in the specified range that satisfy the given condition.',
        leak: 'EXCEL_FUNCTIONS',
      },
      {
        id: 't1-s6c-q3',
        prompt: 'An instruction says: "Round the stored VAT amount to 2 decimal places so subsequent totals add the exact 2-decimal values." What should you use?',
        options: [
          'Home > Decrease Decimal twice',
          'Wrap the calculation in =ROUND(..., 2)',
          'Apply Currency formatting only',
          'Widen the column by 2 characters',
        ],
        correctIndex: 1,
        rationale: 'Decrease Decimal and Currency change only display; =ROUND(..., 2) changes the stored value used in later additions.',
        leak: 'INSTRUCTION_CONTROL',
      },
    ],
    evidenceTask: {
      prompt: 'Add absolute-reference calculations, SUM/AVERAGE/COUNT/COUNTA/COUNTIF summary rows, and ROUND to your Excel workbook, then capture Formula View proof.',
      deliverables: [
        'Completed formula workbook (.xlsx)',
        'Formula View screenshot (Ctrl+`) plus brief written justification of each function choice',
      ],
      checklist: [
        { id: 's6c-chk1', label: 'Used absolute reference ($F$1) for the constant rate before copying down' },
        { id: 's6c-chk2', label: 'Applied SUM, AVERAGE, COUNT, COUNTA, and COUNTIF accurately without range errors' },
        { id: 's6c-chk3', label: 'Applied ROUND where stored rounding was required and audited Formula View' },
      ],
    },
  },
  {
    id: 'topic1-section7a',
    sectionCode: '7A',
    releaseScope: 'wave1',
    category: 'integration',
    title: 'Notebook / OneNote File Workflow',
    leakCode: 'NOTEBOOK_WORKFLOW',
    nextAction: 'Build the 8-folder Topic 1 Evidence Tree and structure a Notebook -> Section -> Page hierarchy with issue tags.',
    concept: {
      summary:
        'Section 7A trains structured digital evidence management using OneNote/Notebook alongside Windows File Explorer. Freezing during multi-file tasks usually happens because the folder tree and notebook hierarchy are not built first.',
      keyPoints: [
        'Electronic Notebook hierarchy flows top-down: Notebook (Topic 1 Portfolio) -> Sections (e.g. Theory, File Mgmt, Word, Excel, Reflection) -> Pages (individual dated tasks and screenshots).',
        'Use Notebook Tags (To Do, Important, Question) to flag unresolved issues, missing screenshots, or formulas still needing verification.',
        'Build the exact 8-folder Topic 1 Evidence Tree under Documents\\CPN5_Topic1_Evidence_<StudentName> before generating exports: 01_Original_Copies, 02_File_Management_Evidence, 03_Word_PDF_Exports, 04_Excel_PDF_Exports, 05_Notebook_Screenshots, 06_Shortcuts, 07_Recycle_Bin_Evidence, 08_Final_Submission.',
        'Every filename and screenshot must be clear enough for a lecturer to identify the task and folder path immediately.',
      ],
    },
    cbtTip:
      'Exam trap: Never dump screenshots, PDFs, and raw files into one unnamed folder—create the 8-folder evidence tree first so every output has an exact home.',
    triggerTable: [
      {
        contrast: 'Notebook vs Section vs Page',
        rule: 'Notebook = overall subject binder; Section = major topic tab; Page = single task record, note, or embedded proof.',
      },
      {
        contrast: '01_Original_Copies vs 08_Final_Submission',
        rule: '01_Original_Copies safeguards untouched starter files; 08_Final_Submission holds the verified final deliverables and .zip pack.',
      },
      {
        contrast: 'Tagged Unresolved Issue vs Silent Skip',
        rule: 'Tagging a page (To Do / Question) creates a visible verification trail so nothing is forgotten before submission.',
      },
      {
        contrast: '03_Word_PDF_Exports vs 04_Excel_PDF_Exports',
        rule: 'Keep Word PDF proofs and Excel PDF proofs in their dedicated folders for rapid lecturer marking.',
      },
    ],
    guidedPractice: {
      title: 'Setting Up the Topic 1 Evidence Folder Tree & OneNote Binder',
      scenario:
        'You are preparing the Stage 1 foundation for the 100-mark Topic 1 Integration Pack in Documents.',
      steps: [
        'Create Documents\\CPN5_Topic1_Evidence_<StudentName> and inside it create all 8 numbered subfolders from 01_Original_Copies through 08_Final_Submission.',
        'Copy original starter files into 01_Original_Copies so source templates remain protected.',
        'Create a Notebook titled CPN5 Topic 1 Evidence with Sections for File Management, Word & Mail Merge, Spreadsheets, and Readiness Audit, plus individual task Pages.',
        'Add a Tag (To Do or Question) on any incomplete section page and capture a screenshot of the folder tree into 05_Notebook_Screenshots.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s7a-q1',
        prompt: 'Which hierarchy accurately represents the structural levels of an electronic notebook such as Microsoft OneNote?',
        options: [
          'Page -> Workbook -> Cell',
          'Notebook -> Section -> Page',
          'Folder -> Extension -> Shortcut',
          'Slide -> Header -> Footer',
        ],
        correctIndex: 1,
        rationale: 'OneNote organises content from broadest to most specific as Notebook -> Section -> Page.',
        leak: 'NOTEBOOK_WORKFLOW',
      },
      {
        id: 't1-s7a-q2',
        prompt: 'Inside the Topic 1 Evidence Folder Tree, where must untouched starter source files be placed before you begin editing working copies?',
        options: [
          '07_Recycle_Bin_Evidence',
          '01_Original_Copies',
          '06_Shortcuts',
          '08_Final_Submission',
        ],
        correctIndex: 1,
        rationale: '01_Original_Copies preserves untouched source files so originals are never overwritten during editing.',
        leak: 'NOTEBOOK_WORKFLOW',
      },
      {
        id: 't1-s7a-q3',
        prompt: 'What is the purpose of applying a OneNote Tag (such as To Do or Question) to an evidence page during practical work?',
        options: [
          'It automatically converts the page into an Excel chart',
          'It marks unresolved items or pending checks so you can locate and resolve them before final submission',
          'It compresses the notebook into a .zip archive',
          'It permanently deletes linked files from File Explorer',
        ],
        correctIndex: 1,
        rationale: 'Tags highlight pending verification tasks or unresolved questions so learners do not overlook incomplete evidence.',
        leak: 'NOTEBOOK_WORKFLOW',
      },
    ],
    evidenceTask: {
      prompt: 'Create the 8-folder Topic 1 Evidence Tree and matching Notebook -> Section -> Page structure with at least one tagged verification item.',
      deliverables: [
        'Screenshot of Documents\\CPN5_Topic1_Evidence_<StudentName> showing folders 01 through 08',
        'Notebook screenshot showing Sections, Pages, and an active Tag',
      ],
      checklist: [
        { id: 's7a-chk1', label: 'Created all 8 numbered subfolders (01_Original_Copies through 08_Final_Submission)' },
        { id: 's7a-chk2', label: 'Structured Notebook -> Section -> Page hierarchy clearly' },
        { id: 's7a-chk3', label: 'Applied at least one Notebook tag to track an unresolved check or deliverable' },
      ],
    },
  },
  {
    id: 'topic1-section7b',
    sectionCode: '7B',
    releaseScope: 'wave1',
    category: 'integration',
    title: 'Notebook Worked Integration',
    leakCode: 'INTEGRATION_CONTROL',
    nextAction: 'Execute the end-to-end integration order: Word/Excel PDF exports, contextual screenshots, Notebook hyperlinks, and final .zip submission pack.',
    concept: {
      summary:
        'Section 7B models the complete order of work across File Explorer, Word, Excel, and OneNote/Notebook so you know what to do first, second, and third without freezing during a multi-application integration task.',
      keyPoints: [
        'Follow a fixed order of work: 1. Prepare folder tree & copy originals -> 2. Complete & save Word/Excel working files -> 3. Export clean PDFs into 03_Word_PDF_Exports and 04_Excel_PDF_Exports -> 4. Capture contextual screenshots -> 5. Link evidence in Notebook pages via Hyperlinks -> 6. Package and verify final .zip in 08_Final_Submission.',
        'Screenshots must show context: full window/path bar, sorted column, search term, Formula View, or Properties dialog—cropped snippets with no path lose marks.',
        'Insert Hyperlinks on Notebook pages pointing to your exported PDFs or folders, then click each link to test that it opens the correct target.',
        'Place final verified deliverables and the compressed .zip submission pack inside 08_Final_Submission and reopen the archive to confirm nothing is empty or corrupt.',
      ],
    },
    cbtTip:
      'Exam trap: Cropping out the File Explorer address bar or forgetting to test Notebook hyperlinks and reopen the final .zip pack costs easy integration marks.',
    triggerTable: [
      {
        contrast: 'Working .docx/.xlsx vs Exported .pdf',
        rule: 'Keep editable .docx/.xlsx files for formulas/fields, and export locked .pdf proofs to 03_Word_PDF_Exports and 04_Excel_PDF_Exports.',
      },
      {
        contrast: 'Contextual Screenshot vs Cropped Fragment',
        rule: 'Contextual screenshots display the file path, Properties title, search bar, or Formula View; fragments omit proof of location.',
      },
      {
        contrast: 'Tested Hyperlink vs Unchecked Paste',
        rule: 'Always click inserted Notebook hyperlinks after creating them to verify the path resolves to the intended file.',
      },
      {
        contrast: 'Verified .zip in 08_Final_Submission vs Raw Loose Files',
        rule: 'Compress the final evidence folder into 08_Final_Submission and reopen the .zip to confirm every subfolder is populated.',
      },
    ],
    guidedPractice: {
      title: 'Full Topic 1 Evidence Pack Integration Run',
      scenario:
        'Combine your Section 3–6 outputs into one verified Topic 1 Evidence Pack ready for lecturer marking.',
      steps: [
        'Export your formatted Word document to 03_Word_PDF_Exports and your Excel register (values + formula view) to 04_Excel_PDF_Exports.',
        'Capture contextual screenshots of File Explorer search/Properties (02_File_Management_Evidence), shortcuts (06_Shortcuts), Recycle Bin proof (07_Recycle_Bin_Evidence), and Notebook pages (05_Notebook_Screenshots).',
        'Insert hyperlinks inside your Notebook summary page pointing to the Word PDF and Excel PDF exports, and click each link to verify it opens cleanly.',
        'Compress the submission pack into 08_Final_Submission as a .zip file, then open the .zip archive to verify all folders and files are present.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s7b-q1',
        prompt: 'What is the correct operational order when producing a multi-app Topic 1 Evidence Pack?',
        options: [
          'Compress an empty .zip first -> take screenshots -> edit Word/Excel -> create folders last',
          'Build folder tree & copy originals -> finish Word/Excel edits -> export PDFs -> capture contextual screenshots -> hyperlink in Notebook -> create & verify .zip in 08_Final_Submission',
          'Delete original files -> export PDFs -> skip Notebook hyperlinks -> submit temporary shortcuts only',
          'Paste raw screenshots into Excel -> rename .xlsx to .zip -> submit without opening',
        ],
        correctIndex: 1,
        rationale: 'Organising the tree and protecting originals first prevents lost work, while exporting, hyperlinking, and verifying the .zip last ensures complete proof.',
        leak: 'INTEGRATION_CONTROL',
      },
      {
        id: 't1-s7b-q2',
        prompt: 'Why must a File Management screenshot in 02_File_Management_Evidence include the File Explorer address bar and full file list rather than just two icons?',
        options: [
          'Because cropped icons automatically turn into .pdf files',
          'Because the address bar proves exact folder path, filenames, and extensions in context',
          'Because Windows rejects screenshots larger than 100 pixels',
          'Because Excel formulas require the address bar to calculate SUM',
        ],
        correctIndex: 1,
        rationale: 'Markers award proof marks only when they can confirm the exact path, filenames, extensions, or Properties dialog shown.',
        leak: 'INTEGRATION_CONTROL',
      },
      {
        id: 't1-s7b-q3',
        prompt: 'After compressing your Topic 1 evidence folder into a .zip file inside 08_Final_Submission, what final verification step protects against broken submissions?',
        options: [
          'Delete the entire Documents folder immediately',
          'Reopen the .zip archive to confirm all subfolders, PDFs, screenshots, and working files are inside and readable',
          'Rename the .zip extension to .docx',
          'Clear the Recycle Bin before checking the archive',
        ],
        correctIndex: 1,
        rationale: 'Reopening the final .zip archive independently verifies that compression completed properly and no files were missed.',
        leak: 'FILE_MGMT',
      },
    ],
    evidenceTask: {
      prompt: 'Complete the integrated Topic 1 Evidence Pack with PDF exports, contextual screenshots, tested Notebook hyperlinks, and a verified .zip pack in 08_Final_Submission.',
      deliverables: [
        'Word & Excel PDF exports in folders 03 and 04 plus contextual screenshots in 02 and 05',
        'Final .zip archive inside 08_Final_Submission with tested Notebook hyperlinks',
      ],
      checklist: [
        { id: 's7b-chk1', label: 'Exported Word and Excel outputs to PDF into 03_Word_PDF_Exports and 04_Excel_PDF_Exports' },
        { id: 's7b-chk2', label: 'Inserted and tested Notebook hyperlinks to exported evidence files' },
        { id: 's7b-chk3', label: 'Created and reopened the final .zip submission pack in 08_Final_Submission' },
      ],
    },
  },
  {
    id: 'topic1-section8',
    sectionCode: '8',
    releaseScope: 'wave2',
    category: 'consolidation',
    title: 'Topic 1 Consolidation and Exam Readiness',
    leakCode: 'INSTRUCTION_CONTROL',
    nextAction: 'Synthesise the full Topic 1 chain, eliminate high-risk contrasts, and complete the 300-mark Readiness Checklist (Theory 100 + Practical 200).',
    concept: {
      summary:
        'Section 8 connects Sections 1 through 7 into one exam-ready Topic 1 mental map. Learners often freeze not from lack of ability, but because an exam task is unnamed—first name the task, select the right tool, execute calmly, and verify.',
      keyPoints: [
        'Whole Topic 1 learning chain: ICT Concepts -> Systems Technologies -> File Management -> Word Processing -> Mail Merge -> Spreadsheets -> Electronic Notebooks -> Integrated Evidence Pack.',
        'High-risk exam contrasts to master: Data vs Information, RAM vs Secondary Storage, Copy vs Move, Table vs Chart, Page Break vs Section Break, Relative vs Absolute ($F$1), COUNT vs COUNTA vs COUNTIF, and stored ROUND vs visual decimal display.',
        '300-mark Topic 1 Mastery structure: Theory 100 marks (terminology, systems, concepts, tool choices) + Practical 200 marks (file control, Word layout/objects, Mail Merge, Excel formulas/sort/print, Notebook evidence pack).',
        'Exam discipline loop: Read command words carefully -> Plan tool & exact filename -> Execute step by step -> Verify Print Preview, Formula View, paths, and reopened output.',
      ],
    },
    cbtTip:
      'Exam trap: Skipping command-word analysis causes wrong tool choices (e.g. Fit to Page when forbidden, or moving instead of copying). Name the task before your first click.',
    triggerTable: [
      {
        contrast: 'Theory (100 Marks) vs Practical (200 Marks)',
        rule: 'Theory tests exact definitions, contrasts, and tool justification; Practical tests accurate execution, formulas, layout, naming, and verification.',
      },
      {
        contrast: 'Command Verb Audit vs Blind Clicking',
        rule: 'Circle action verbs (define, copy, sort, merge, export, round) and exact filenames before touching mouse or keyboard.',
      },
      {
        contrast: 'High-Risk Word/File Traps',
        rule: 'Preserve originals on Copy/Save As; use Section Breaks for mixed orientation; never call a Table a Chart.',
      },
      {
        contrast: 'High-Risk Excel Traps',
        rule: 'Sort full tables from one interior cell; lock constant cells with $F$1; use ROUND when stored values must change.',
      },
    ],
    guidedPractice: {
      title: '300-Mark Topic 1 Mock Readiness Audit',
      scenario:
        'Before sitting the 300-mark Topic 1 Mastery Assessment (Theory 100 + Practical 200), audit your Section 1–7 readiness and close any remaining leaks.',
      steps: [
        'Trace the full Topic 1 chain out loud: ICT Concepts -> Systems -> File Mgmt -> Word -> Mail Merge -> Spreadsheets -> Notebooks -> Evidence Pack.',
        'Test yourself on the 6 high-risk contrasts (Data/Info, RAM/Storage, Copy/Move, Page/Section Break, Relative/Absolute, ROUND/Display Format) without looking at notes.',
        'Verify your practical discipline: exact filenames, non-destructive copying, Mail Merge 5-step flow, Data > Sort on contiguous tables, and Ctrl+` formula checks.',
        'Record your weakest section in a Revision Map with one concrete recovery action before opening the 300-mark assessment.',
      ],
    },
    quickCheck: [
      {
        id: 't1-s8-q1',
        prompt: 'Which sequence shows the complete Topic 1 learning and workflow chain from foundational theory to final submission?',
        options: [
          'Spreadsheets -> Systems -> Word -> ICT Concepts -> Mail Merge -> File Mgmt -> Evidence Pack',
          'ICT Concepts -> Systems -> File Mgmt -> Word -> Mail Merge -> Spreadsheets -> Notebooks -> Evidence Pack',
          'Notebooks -> Mail Merge -> ICT Concepts -> File Mgmt -> Systems -> Word',
          'Evidence Pack -> Word -> Spreadsheets -> Systems -> ICT Concepts',
        ],
        correctIndex: 1,
        rationale: 'Topic 1 progresses systematically from ICT concepts and systems, through file management, Word and Mail Merge, spreadsheets, and notebooks, into an integrated evidence pack.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't1-s8-q2',
        prompt: 'How are the 300 marks of the Topic 1 Ultimate Mastery Assessment structured?',
        options: [
          'Theory 200 marks + Practical 100 marks',
          'Theory 100 marks + Practical 200 marks',
          'Theory 50 marks + Practical 250 marks',
          'Practical 300 marks only with no theory',
        ],
        correctIndex: 1,
        rationale: 'The 300-mark Topic 1 Mastery framework allocates 100 marks to Theory/Understanding and 200 marks to Practical execution.',
        leak: 'INSTRUCTION_CONTROL',
      },
      {
        id: 't1-s8-q3',
        prompt: 'During a practical exam, you realise you are unsure how to start a complex instruction. Which first step prevents freezing and mark loss?',
        options: [
          'Click random ribbon tabs quickly until something looks familiar',
          'Circle the command verb and exact filename, name the required tool, then follow Read -> Plan -> Execute -> Verify',
          'Delete the starter files and restart the computer',
          'Use Fit to Page and Save As without reading the rest of the question',
        ],
        correctIndex: 1,
        rationale: 'Naming the task, command verb, and target filename first restores calm step-by-step execution and protects instruction-control marks.',
        leak: 'TIME_DISCIPLINE',
      },
    ],
    evidenceTask: {
      prompt: 'Complete a Topic 1 Revision Map covering the whole chain, high-risk contrasts, and your 300-mark readiness self-audit.',
      deliverables: [
        'Topic 1 Revision Map & weakness-recovery plan',
        'Signed-off 300-mark readiness checklist (Theory 100 + Practical 200)',
      ],
      checklist: [
        { id: 's8-chk1', label: 'Mapped all 8 stages of the Topic 1 chain from ICT Concepts to Evidence Pack' },
        { id: 's8-chk2', label: 'Reviewed all high-risk contrasts (RAM/Storage, Copy/Move, Section Break, $F$1, ROUND)' },
        { id: 's8-chk3', label: 'Identified top personal leak area and scheduled one targeted recovery drill' },
      ],
    },
  },
]

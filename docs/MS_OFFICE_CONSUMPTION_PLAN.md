# MS Office Consumption & Integration Plan

Sankofa ComputeLab trains Computer Practice N5 and N6 learners who do most of their real practical work in **Microsoft Word, Microsoft Excel, and Microsoft OneNote** (Office 2013/2016/2019/365). Rather than treating Office files as opaque blobs, ComputeLab consumes Office deliverables in three progressive phases.

## Phase 1: Client-Side OOXML & Text Consumption (Implemented Now in `src/office-ingest.js`)

Because `.docx` and `.xlsx` files are OpenXML ZIP packages, ComputeLab parses them directly in the browser (offline-capable, zero external server required) whenever a learner attaches work in **Assignments (`#assignments`)**, **N5 Gate 01 Recovery (`#n5-gate`)**, **Topic 1–5 Hubs (`#topic-1`..`#topic-5`)**, or the **Lecturer Console MS Office Inspector (`#admin`)**:

- **Excel (`.xlsx` / `.xlsm`)**:
  - Reads `xl/workbook.xml`, `xl/sharedStrings.xml`, and every `xl/worksheets/sheet*.xml`.
  - Extracts worksheet names, populated cell counts, live `<f>` formulas, Excel function families (`SUM`, `AVERAGE`, `COUNTIF`, `COUNTA`, `IF`, `ROUND`, `VLOOKUP`/`XLOOKUP`, `PMT`, `FV`), and locked `$` absolute/mixed references.
  - Inspects `AutoFilter`, `DataValidations`, `ConditionalFormatting`, and `<pageSetup>` (`orientation="landscape"`, `fitToWidth="1"`).
  - Auto-flags common N5/N6 leaks: hardcoded numeric sheets with zero formulas (`EXCEL_FUNCTIONS`), missing `$` anchors across repeated formulas (`EXCEL_REFERENCING`), and missing print fit setup (`PRINT_OUTPUT`).
- **Word (`.docx`)**:
  - Reads `word/document.xml` and `word/header*.xml` / `word/footer*.xml`.
  - Extracts word count, paragraph count, applied built-in styles (`Heading1`, `Heading2`, `Title`), structured tables (`<w:tbl>`), tab stops, explicit page breaks, margins/landscape sections, automatic `PAGE`/`NUMPAGES` fields, and `MERGEFIELD` placeholders.
  - Auto-flags layout anti-patterns: missing built-in Heading styles (`WORD_LAYOUT`), spacebar alignment padding (`4+` consecutive spaces), and repeated empty paragraphs instead of Page Breaks.
- **CSV / Text / OneNote Exports (`.csv`, `.txt`, `.html`)**:
  - Parses delimiters, header alignment, ragged row counts, and OneNote section/page/tag keywords.
- **Renamed-File & Format Guard**:
  - Detects `.png`/`.txt` files merely renamed to `.docx`/`.xlsx` (rejects invalid OOXML ZIP headers with a `FILE_MGMT` warning) and flags legacy binary `.doc`/`.xls` files with guidance to Save As `.docx`/`.xlsx`.

## Phase 2: Office Add-in Taskpane & OneDrive/SharePoint Sync (Pilot Expansion)

1. **Office.js Taskpane Add-in (Word & Excel)**:
   - Lightweight React taskpane pointing to ComputeLab (`#n5-gate` / `#assignments`) using `Office.context.document.getFileAsync(Office.FileType.Compressed)` so learners submit the active `.docx`/`.xlsx` workbook directly from inside Word or Excel without manual file browsing.
2. **OneDrive / Microsoft Graph Picker**:
   - Campus Microsoft 365 accounts connect via OAuth2 PKCE (`Files.Read` scope) to pull working files from a designated `Sankofa-Practice/` folder directly into the ComputeLab submission pipeline.
3. **OneNote Evidence Ingestion**:
   - Exported OneNote `.mht`/`.pdf` or Microsoft Graph OneNote API (`notebooks -> sections -> pages`) verifies required hierarchy (`Notebook -> Section -> Page -> Subpage`) and tagged unresolved items automatically.

## Phase 3: Server-Side Automated Rubric Grading & Cohort Persistence

1. **Supabase / Object Storage + Edge Function Grader**:
   - Upload raw `.docx`/`.xlsx` artifacts to private cohort storage buckets with SHA-256 checksums matching Gate receipts (`N5G1-...`).
   - Run deterministic Python (`openpyxl`, `python-docx`) or Node rubric evaluators against expected cell formulas, exact cell values under changed-fact inputs, Word style trees, and merged letter counts.
2. **Lecturer Moderation & Return Loop**:
   - Lecturer reviews auto-parsed rubric signals in the Console, records moderation notes/overrides, and pushes targeted leak feedback + custom pathways directly to the student's workspace.

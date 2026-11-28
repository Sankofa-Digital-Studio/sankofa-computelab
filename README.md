# Sankofa ComputeLab

Mobile-first Vite + React PWA for Computer Practice N5 and N6.

## Capabilities and readiness

| Capability | Repository baseline |
| --- | --- |
| N5 and N6 practice | Level-specific study content and formative exercises. Coverage varies by topic. |
| Automated marking | The built-in timed quiz is automatically marked. Practical activities and mock exams use self-marking. |
| Practical evidence and progress | The current browser profile stores progress and evidence. Cross-device or shared lecturer access requires backend integration. |
| Lecturer controls | Demo administration and learner records share a browser profile. Cohort permissions and secure answer release are pilot requirements. |
| Offline study | Cache the study shell with one online visit and download selected resources in advance. |
| Notifications | Local notification testing is supported. Live push delivery requires integration. |

The 2027 pilot targets one existing N5 gate with a diagnostic, targeted practice, lecturer review, and fresh reassessment. See the [production backlog](https://github.com/orgs/Sankofa-Digital-Studio/projects/5) for planned work.

## Contributing and reporting

See [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md).

## Development

```sh
npm ci
npm run dev
npm test
npm run build
npm exec vite preview
```

The production build generates a versioned service worker. Open the production site online once to cache the study shell. Use Download in Study Library to save files for offline access. Office tasks are completed in the corresponding Office applications. The built-in timed quiz is automatically marked. Practical activities and mock exams use student self-marking against practice checks.

## Content

The original 20 N6 tasks come from the supplied CP N6 Student Question Bank. The focused update adds 12 original N5 bank items, four N6 formula drills and level-specific quiz and flashcard content. Session tags describe skill alignment. The official September 2020, November 2022, November 2023, November 2024 and May 2025 papers are separate downloads. The May 2025 paper and marking guideline carry 23 May 2025 on their covers despite the June labels in the supplied filenames. The November 2025 marking guideline is a standalone reference for students with the matching paper. The confidential lecturer memorandum is excluded.

## Demo data and integration

Local storage retains progress, bookmarks, notices, feedback threads and metadata. IndexedDB retains files uploaded for assignments and material versions. The app caches downloaded source files on demand. Admin demo actions, student submissions and analytics operate on the same browser profile. The memo reveal controls guide the practice workflow and do not enforce access security. The service worker handles notification events and supports a local test. Sending live push messages, shared file storage, school-wide analytics and role-based accounts require backend integration.

## Challenge Lab

Nine original scenarios cover Computer Practice N5 and N6. The N5 careers clinic applies the supplied preparation pack’s 50-mark blueprint using a fresh scenario. The N6 formula and data-recovery labs adapt selected competencies from the Sankofa 300-mark mastery draft. The Lab saves in-progress answers and practical evidence locally, shows rubric criteria after submission, and asks for one correction and a transfer response before completing a challenge. The Campus Open Day mock follows the section and timing pattern of the May 2025 paper, with original tasks and synthetic starter data. Run `python scripts/make-exam-kit.py` with openpyxl and python-docx installed to regenerate the N6 Open Day ZIP. Run `python scripts/make-level-kits.py` to regenerate the N5 Careers Clinic and N6 Formula Logic kits. Optional third-party references link to their source. Challenge scores are self-marked formative practice.

## Source review

The N5 theory first pass supports the field guide and short drills. The assignment bundle is labelled Assignment 1 externally while its student paper and README say Assignment 2. The rehearsal uses its independent verification and mail merge teaching patterns without relying on its numbering. The Test 1 pack informs the five-strand N5 rehearsal; its candidate variants, addenda, memos and lecturer documents are excluded. The N6 Formula Logic PDF is available as a study guide. The longer 300-mark mastery draft includes embedded data tables and calls for additional working files and templates. The two N6 mastery labs use new inputs and do not represent the complete assessment.
## 1.1.0-rc.1 classroom preview

The overview now explains six learner-facing capabilities and opens the active course diagnostic at the appropriate step. Draft answers and diagnostic feedback are stored in the current browser profile. See [the claims register](CLAIMS.md) for evidence and approval ownership.

This release candidate is for local formative practice. Production cohort access, shared records, moderated marking, recovery drills and end-to-end classroom acceptance are tracked in the [P0 project](https://github.com/orgs/Sankofa-Digital-Studio/projects/5).

The [N5 lecturer guide](N5-LECTURER-GATE.md) covers the first pathway gate. Exported learning reviews include course, diagnostic submission status and completed proof count. Free-text reflections, attachments and confidence ratings stay outside this export.

## N5 Gate 01 (Student Auth to Submission)

The `#n5-gate` workspace implements one focused N5 gate—**Gate 01 · Ribbon & Command Control**—across the complete student lifecycle:

1. **Student Auth & Device Lock**: Claim a rostered N5 seat (`N5-101`–`N5-105`) or register a candidate number, set a personal passphrase (PBKDF2/SHA-256 salted hash via WebCrypto), and lock the local session.
2. **Gate Briefing & Locked 50-Minute Timer**: Start the 12-question (100-mark) Gate 01 attempt with a persistent deadline that survives page refreshes and auto-submits on expiry.
3. **Rubric Scoring & Leak Profile**: Computes net marks after critical-leak deductions, 5-dimension rubric percentages, overconfidence errors, and a ranked leak profile. Learners who score **100%** (zero skill leaks) skip targeted recovery and reassessment and proceed straight to final submission.
4. **Targeted Recovery & Practical Proof** *(when leaks are detected)*: Surfaces leak-matched drills (`src/remediation-data.json`), the Week 1 Class 1 verification checklist, a written proof summary, and optional working-file attachment in IndexedDB.
5. **Fresh Reassessment & Sealed Submission**: Verifies transfer on 3 unseen questions (for leak recovery paths) and seals a timestamped submission receipt (`N5G1-...`) with a SHA-256 digest and downloadable `.txt` / `.json` handoff files.

All Gate 01 auth credentials, attempts, and receipts are stored locally in the browser (`localStorage` + `IndexedDB`) for offline-capable student use and receipt handoff; multi-device cohort sync requires a backend integration.

## Topic 1 Hub (`#topic-1`)

The `#topic-1` workspace provides structured N5 Topic 1 learning and practical evidence modules across all 13 sections (`1`, `2`, `3`, `4A`, `4B`, `4C`, `5`, `6A`, `6B`, `6C`, `7A`, `7B` Wave 1 + `8` Consolidation):

- **5-Block Lesson Flow**: Concept & CBT Exam Trap tip, High-Risk Contrasts table, Guided Worked Example, interactive 3-item Quick Check (39 total questions with rationale review), and Practical Evidence Task with IndexedDB file attachments.
- **Student Session Sync & Export**: Scopes progress to the active N5 Gate student session (or `local-learner`) and exports a plain-text Topic 1 evidence summary.

## Topic 2 Hub (`#topic-2`)

The `#topic-2` workspace shares the reusable `TopicHub` + `topic-engine.js` architecture across all 6 N5 Networking & Communication modules (`1A` Network Types & Coverage, `1B` Architectures & Components, `2A` Networks & the Digital Era, `2B` Reasons for Using Networks, `3` Consolidation Revision Map, and `Mastery` 150-Mark Readiness):

- **5-Block Lesson Flow**: Concept & CBT Exam Trap tip, High-Risk Contrasts table (LAN/MAN/WAN, Switch/Router, Client-Server/P2P, Resource Sharing/Centralisation), Guided Worked Example, interactive 3-item Quick Check (18 total questions with rationale review), and Practical Evidence Task with IndexedDB file attachments.
- **Student Session Sync & Export**: Scopes progress to the active N5 Gate student session (or `local-learner`) and exports a plain-text Topic 2 evidence summary.

## Topic 4 Hub (`#topic-4`) & Topic 5 Hub (`#topic-5`)

- **Topic 4 (`#topic-4`)**: 10 modules covering Internet applications & plug-ins (`1A`), Web 1.0–4.0 (`1B`), social platforms & multimedia (`1C`), Internet service technologies (`2A`), static vs dynamic sites (`2B`), location/mobile/e-commerce (`2C`), source reliability (`3A`), Boolean/phrase search queries & website evaluation (`3B`), consolidation (`4`), and 150-mark mastery (`Mastery`) with 30 interactive Quick Check questions.
- **Topic 5 (`#topic-5`)**: 7 modules covering emerging technology (`1A`), ICT human impact (`1B`), balanced impact debates (`1B Ext`), cybercriminal methods (`2A`), cybercrime types (`2B`), effects & technical prevention controls (`2C`), and ICT ethics (`3A`) with 21 interactive Quick Check questions.

## Topic 3 Hub (`#topic-3`), Lecturer Console (`#admin`), & MS Office Consumption

- **Topic 3 (`#topic-3`)**: Closes the DHET N5 Topic 3 syllabus gap across 6 modules (Data/Information/Knowledge, Computational Thinking 4 pillars, Structured Tables/Keys/Queries, Verification vs Validation & Privacy, Consolidation, and 150-Mark Mastery) with 18 interactive Quick Checks.
- **MS Office Consumption (`src/office-ingest.js`)**: Client-side OOXML ZIP parser that reads uploaded `.xlsx`, `.docx`, `.csv`, and `.txt` files directly in the browser to extract Excel formulas, `$` references, AutoFilter/DataValidation, Print Setup, Word Heading styles, Tab stops, Page breaks, and Mail Merge fields while flagging structural leaks. See [docs/MS_OFFICE_CONSUMPTION_PLAN.md](docs/MS_OFFICE_CONSUMPTION_PLAN.md).
- **Lecturer Console (`#admin`) & Student–Lecturer Communication (`#feedback`)**: PIN-gated lecturer workspace (`SANKOFA-2026` pilot demo PIN) providing Cohort Diagnostics & CSV/TXT/JSON Reports, Integrity & Urgent Alerts, Custom Remediation Pathways, Gate Release/Hold Audit Logging, Student Help Ticket Triage, MS Office File Inspection, 9 Teaching Scripts/SOPs, and a live Compliance & Quality Matrix ([docs/COMPLIANCE_QUALITY_MATRIX.md](docs/COMPLIANCE_QUALITY_MATRIX.md)).
- **Deployment Email Hook**: Run `npm run deploy:notify` after `vercel deploy --prod --yes` to email deployment summaries to `thosontula@gmail.com` and `ntulathoso@gmail.com` via `gmail`.

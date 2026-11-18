# Sankofa ComputeLab

Mobile-first Vite + React PWA for Computer Practice N5 and N6.

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

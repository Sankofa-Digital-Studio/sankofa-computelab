# Contributing to Sankofa ComputeLab

ComputeLab supports formative Computer Practice N5 and N6. Start with a repository issue and describe the student or lecturer outcome, the smallest useful change, and how a reviewer can verify it.

## Local verification

1. Install dependencies with `npm ci`.
2. Start the app with `npm run dev`.
3. Run `npm test` and `npm run build`.
4. For offline or service-worker changes, run `npm exec vite preview` against the production build.
5. For learner-facing changes, test keyboard access and the affected journey on Android Chrome and iPhone Safari. Record the devices or browser versions used, expected result, and observed result.

## Curriculum and assessment changes

Identify the subject, level, skill, source and reuse permission. Distinguish formative rehearsal from formal assessment. For rubric changes, provide synthetic examples of correct paraphrases, partial credit, and convincing wrong answers. Ask a lecturer to review marking and progression evidence. Keep confidential answer material and student records out of commits, screenshots, logs, issues, and pull requests.

Open a focused pull request against `main` and link its issue. Use the [code of conduct](CODE_OF_CONDUCT.md) and [security policy](SECURITY.md).

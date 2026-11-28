# Sankofa ComputeLab Workspace Rules

## Assessment & Gate Logic
- **Zero-Leak / 100% Bypass**: Never force learners who score 100% with zero diagnosed skill leaks into mandatory targeted recovery drills or weak-area reassessment. Short-circuit cleanly from diagnostics to final submission packet review, while keeping recovery + reassessment enforced whenever leaks exist.
- **No Unreleased Leaks**: Never expose answer rationales or marking criteria before submission or explicit student reveal actions.

## Architecture & Reuse
- **Shared Modules Over Duplication**: Build new CPN5/CPN6 topic hubs on `src/topic-engine.js` and `src/TopicHub.jsx` rather than duplicating engine or React workbench code.
- **Preserve Existing Contracts**: Keep `src/capabilities.js` audited routes and `src/n5-gate-engine.js` storage schemas backward-compatible so existing `node --test` suites remain green.

## Build, Git & Deployment Hygiene
- Never stage or commit local `.bundle` archives, `.env.local`, `dist/`, or `node_modules/`.
- Always run `npm test && npm run build` after the final code/doc edit before pushing to `origin main` and running `vercel deploy --prod --yes`.

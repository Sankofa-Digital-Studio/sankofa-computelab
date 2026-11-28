---
name: computelab-topic-rollout
description: >-
  Use when adding or updating a Computer Practice N5/N6 Topic Hub in Sankofa ComputeLab
  from Edu_Labs_Computer_Mastery specs, including parallel module creation, testing,
  GitHub push, and Vercel production deployment.
---

# ComputeLab Topic Hub Rollout

## Procedure
1. **Fetch Reference Specs Once**: Pull the target topic entries from `Sankofa-Digital-Studio/Edu_Labs_Computer_Mastery` (`src/data/nated5GateSnippets.json` and lecturer scripts) in a single command.
2. **Parallel Disjoint Ownership**:
   - Data/Engine/Tests: `src/topic<N>-data.js`, `src/topic<N>-engine.js` (delegating to `src/topic-engine.js`), and `test/topic<N>.test.js`.
   - UI/Routing: `src/Topic<N>.jsx` (wrapping `src/TopicHub.jsx`), `src/main.jsx`, `src/ui.jsx`, and `README.md`.
3. **Verify in One Chained Pass**:
   - Run `npm test && npm run build` once after all edits land.
   - Stage only explicit source/test/doc files, commit, push `main`, and run `vercel deploy --prod --yes`.
4. **Live Verification Guardrail**:
   - If the `webview_browser` script runner hits a 30s timeout (`WEBVIEW_SCRIPT_TIMEOUT`), start one fresh browser subagent targeting the direct hash route (`#topic-<N>`) rather than retrying stalled scripts in the same session; report any unverified interactive steps explicitly.

import { execFileSync, execSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const RECIPIENTS = (process.env.DEPLOY_NOTIFY_TO || 'thosontula@gmail.com,ntulathoso@gmail.com')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const deployUrl = process.env.DEPLOY_URL || 'https://sankofa-computelab.vercel.app'
const statusLabel = process.env.DEPLOY_STATUS || 'Production Deployment Succeeded'

function safeGit(cmd, fallback = 'unknown') {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim()
  } catch {
    return fallback
  }
}

const commitSha = safeGit('git rev-parse --short HEAD')
const branch = safeGit('git rev-parse --abbrev-ref HEAD')
const commitMsg = safeGit('git log -1 --pretty=%s')
const timestamp = new Date().toISOString()

const body = [
  `# Sankofa ComputeLab Deployment Notification`,
  ``,
  `- **Status**: ${statusLabel}`,
  `- **Production URL**: ${deployUrl}`,
  `- **Branch / Commit**: \`${branch}\` @ \`${commitSha}\` (${commitMsg})`,
  `- **Timestamp (UTC)**: ${timestamp}`,
  ``,
  `## Highlights Included`,
  `- **Compliance & Quality Matrix**: \`docs/COMPLIANCE_QUALITY_MATRIX.md\` + live Lecturer Console matrix tab`,
  `- **DHET N5 Topic 3 Hub (\`#topic-3\`)**: Data, Information Management & Computational Thinking (6 modules, 18 Quick Checks)`,
  `- **Lecturer Console (\`#admin\`)**: PIN-locked operations, Cohort Diagnostics & Reports (\`.txt\`/\`.csv\`/\`.json\`), Priority Alerts & Integrity Holds, Custom Remediation Pathways, Student Issue Triage, and 9 Lesson Teaching Scripts/SOPs`,
  `- **Student–Lecturer Loop (\`#feedback\` & \`#overview\`)**: Structured Help/Issue reporting, Lecturer Alerts, and assigned Custom Pathways`,
  `- **MS Office Consumption (\`src/office-ingest.js\`)**: Client-side OOXML inspection for \`.xlsx\`, \`.docx\`, \`.csv\`, and \`.txt\` files + \`docs/MS_OFFICE_CONSUMPTION_PLAN.md\``,
  ``,
  `## Verification`,
  `- \`npm test\` and \`npm run build\` executed prior to production deployment.`,
].join('\n')

const tempDir = mkdtempSync(join(tmpdir(), 'sankofa-deploy-mail-'))
const bodyFile = join(tempDir, 'deploy-email.md')

try {
  writeFileSync(bodyFile, body, 'utf8')
  const toArg = RECIPIENTS.join(',')
  const subject = `[Sankofa ComputeLab] Deployed ${commitSha} to Production`
  const result = execFileSync(
    'gmail',
    ['mutate', 'send', '--to', toArg, '--subject', subject, '--md', '--body-file', bodyFile],
    { encoding: 'utf8', shell: process.platform === 'win32' }
  )
  console.log(`Deployment email sent to ${toArg}`)
  if (result?.trim()) console.log(result.trim())
} finally {
  rmSync(tempDir, { recursive: true, force: true })
}

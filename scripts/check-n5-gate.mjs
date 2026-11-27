import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { preview } from 'vite'

const require = createRequire(import.meta.url)
let chromium
try {
  ;({ chromium } = require(process.env.COMPUTELAB_PLAYWRIGHT || 'playwright'))
} catch {
  console.log('SKIP: playwright not installed in environment; set COMPUTELAB_PLAYWRIGHT if located elsewhere.')
  process.exit(0)
}

const server = await preview({ preview: { host: '127.0.0.1', port: 0 } })
let browser
try {
  try {
    browser = await chromium.launch({ channel: 'chromium' })
  } catch {
    browser = await chromium.launch({ channel: 'msedge' })
  }

  const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
  const pageErrors = []
  page.on('pageerror', (err) => pageErrors.push(err.message))

  await page.addInitScript(() => {
    localStorage.setItem('sankofa-course', 'cpn5')
  })

  const baseUrl = 'http://127.0.0.1:' + server.httpServer.address().port
  await page.goto(baseUrl)

  // 1. Navigate from N5 Overview CTA to #n5-gate
  await page.getByRole('link', { name: /Open N5 Gate 01/i }).click()
  await page.waitForURL('**/#n5-gate')
  assert.match(await page.locator('h1').innerText(), /Gate 01/)

  // 2. Auth: claim N5-101 and create private passphrase
  await page.getByRole('button', { name: /N5-101 · Lerato Mokoena/i }).click()
  await page.getByRole('button', { name: /Verify & Continue/i }).click()
  await page.getByLabel('New private passphrase').fill('Sankofa2026')
  await page.getByLabel('Confirm passphrase').fill('Sankofa2026')
  await page.getByRole('button', { name: /Save Passphrase & Lock Session/i }).click()

  // 3. Briefing -> Start Locked Gate
  await page.getByRole('heading', { name: /Ready to start N5 Gate 01/i }).waitFor()
  await page.getByRole('button', { name: /Start Locked Gate 01/i }).click()

  // 4. Locked Gate: answer all 12 questions (miss Q1 intentionally to trigger leak recovery)
  await page.getByText(/Locked Gate 01 in progress/i).waitFor()
  const cards = page.locator('article.n5g-question-card')
  const count = await cards.count()
  assert.equal(count, 12)
  for (let i = 0; i < count; i += 1) {
    const optionIndex = i === 0 ? 0 : 0 // Q1 correctIndex is 1, others mostly 0
    await cards.nth(i).locator('input[type="radio"]').nth(optionIndex).check()
  }
  await page.getByRole('button', { name: /Lock & Submit Gate 01/i }).click()

  // 5. Diagnostics -> Begin Targeted Recovery
  await page.getByRole('heading', { name: /Net Marks/i }).waitFor()
  await page.getByRole('button', { name: /Begin Targeted Recovery/i }).click()

  // 6. Recovery: complete assigned drills + Week 1 Class 1 verification checks
  await page.getByRole('heading', { name: /Repair your diagnosed leaks/i }).waitFor()
  const drillCards = page.locator('.n5g-drill-card')
  const drillCount = await drillCards.count()
  assert.ok(drillCount >= 2, 'Expected at least 1 remediation drill card plus verification card')

  // All drill cards except the last one (which is Practical File & Output Proof)
  for (let i = 0; i < drillCount - 1; i += 1) {
    const card = drillCards.nth(i)
    await card.locator('textarea').first().fill('Use the Layout tab and exact command path before executing.')
    await card.getByRole('button', { name: /Reveal Criteria/i }).click()
    const checkboxes = card.locator('.n5g-checklist input[type="checkbox"]')
    const cbCount = await checkboxes.count()
    for (let c = 0; c < cbCount; c += 1) {
      await checkboxes.nth(c).check()
    }
    await card.locator('textarea').nth(1).fill('When target folder or orientation changes, verify command verb and Print Preview.')
  }

  const proofCard = drillCards.last()
  const proofBoxes = proofCard.locator('.n5g-checklist input[type="checkbox"]')
  for (let c = 0; c < (await proofBoxes.count()); c += 1) {
    await proofBoxes.nth(c).check()
  }
  await page
    .getByLabel(/Written verification summary/i)
    .fill('Identified Save As verb, saved Campus-Plan copy separately, reopened to verify output.')
  await page.getByRole('button', { name: /Continue to Verification Reassessment/i }).click()

  // 7. Reassessment -> Verify -> Final Submission
  await page.getByRole('heading', { name: /Confirm transfer on 3 fresh questions/i }).waitFor()
  const reCards = page.locator('article.n5g-question-card')
  assert.equal(await reCards.count(), 3)
  for (let i = 0; i < 3; i += 1) {
    await reCards.nth(i).locator('input[type="radio"]').first().check()
  }
  await page.getByRole('button', { name: /Verify Reassessment/i }).click()
  await page.getByRole('heading', { name: /Ready to seal N5 Gate 01/i }).waitFor()
  await page.getByRole('button', { name: /Submit N5 Gate 01/i }).click()

  // 8. Submitted Receipt + 390px mobile overflow check
  await page.getByRole('heading', { name: /N5 Gate 01 Submitted & Locked/i }).waitFor()
  const receiptText = await page.locator('.n5g-receipt-card').innerText()
  assert.match(receiptText, /N5G1-101-[A-F0-9]{8}/)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
  assert.equal(overflow, false, 'Expected zero horizontal overflow at 390px viewport')

  // 9. Clear lock / Sign out -> Re-sign in with personal passphrase -> resumes Submitted state
  await page.getByRole('button', { name: /Clear lock \/ Sign out/i }).click()
  await page.getByRole('heading', { name: /Sign in to N5 Gate 01/i }).waitFor()
  await page.getByLabel(/Allocated student number/i).fill('101')
  await page.getByLabel(/Surname/i).fill('Mokoena')
  await page.getByLabel(/Initial access code or personal passphrase/i).fill('Sankofa2026')
  await page.getByRole('button', { name: /Verify & Continue/i }).click()
  await page.getByRole('heading', { name: /N5 Gate 01 Submitted & Locked/i }).waitFor()

  assert.deepEqual(pageErrors, [], 'Expected zero uncaught page errors')
  console.log('PASS: Full N5 Gate 01 Auth -> Submission -> Re-auth cycle verified at 390x844')
} finally {
  await browser?.close()
  await server.close()
}

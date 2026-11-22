import assert from 'node:assert/strict'
import {createRequire} from 'node:module'
import {preview} from 'vite'

const require = createRequire(import.meta.url)
const {chromium} = require(process.env.COMPUTELAB_PLAYWRIGHT || 'playwright')
const server = await preview({preview:{host:'127.0.0.1', port:0}})
let browser
try {
  try { browser = await chromium.launch({channel:'chromium'}) }
  catch { browser = await chromium.launch({channel:'msedge'}) }
  const cases = [
    [{}, 'Start diagnostic'],
    [{answers:{one:0}}, 'Resume diagnostic'],
    [{submitted:true,answers:{}}, 'Review diagnostic feedback']
  ]
  for (const [run, label] of cases) {
    const page = await browser.newPage({viewport:{width:390,height:844}})
    await page.addInitScript(run => {
      localStorage.setItem('sankofa-course','cpn5')
      localStorage.setItem('sankofa-study-v1',JSON.stringify({learning:{cpn5:{run}}}))
    },run)
    await page.goto('http://127.0.0.1:' + server.httpServer.address().port)
    await page.getByRole('link',{name:label}).click()
    await page.waitForURL('**/#learning/diagnose')
    assert.equal(await page.locator('h1').innerText(),'Mastery pathway')
    console.log('PASS', label)
    await page.close()
  }
} finally {
  await browser?.close()
  await server.close()
}

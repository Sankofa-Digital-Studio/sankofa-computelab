import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { deflateRawSync } from 'node:zlib'

import {
  OFFICE_INGEST_STORAGE_KEY,
  createInitialOfficeIngestStore,
  formatOfficeInspectionText,
  ingestOfficeFile,
  readOfficeIngestStore,
  readZipEntries,
  recordOfficeInspection,
  writeOfficeIngestStore,
} from '../src/office-ingest.js'

/**
 * Build a minimal valid ZIP archive in memory (stored or deflate-compressed) for testing OOXML ingestion.
 */
function buildTestZip(fileMap, useDeflate = true) {
  const encoder = new TextEncoder()
  const localParts = []
  const centralParts = []
  let offset = 0

  for (const [name, content] of Object.entries(fileMap)) {
    const nameBytes = encoder.encode(name)
    const rawBytes = typeof content === 'string' ? encoder.encode(content) : content
    const compressed = useDeflate ? new Uint8Array(deflateRawSync(rawBytes)) : rawBytes
    const method = useDeflate ? 8 : 0

    const local = new Uint8Array(30 + nameBytes.length + compressed.length)
    const lv = new DataView(local.buffer)
    lv.setUint32(0, 0x04034b50, true)
    lv.setUint16(4, 20, true)
    lv.setUint16(8, method, true)
    lv.setUint32(18, compressed.length, true)
    lv.setUint32(22, rawBytes.length, true)
    lv.setUint16(26, nameBytes.length, true)
    local.set(nameBytes, 30)
    local.set(compressed, 30 + nameBytes.length)
    localParts.push(local)

    const central = new Uint8Array(46 + nameBytes.length)
    const cv = new DataView(central.buffer)
    cv.setUint32(0, 0x02014b50, true)
    cv.setUint16(4, 20, true)
    cv.setUint16(6, 20, true)
    cv.setUint16(10, method, true)
    cv.setUint32(20, compressed.length, true)
    cv.setUint32(24, rawBytes.length, true)
    cv.setUint16(28, nameBytes.length, true)
    cv.setUint32(42, offset, true)
    central.set(nameBytes, 46)
    centralParts.push(central)

    offset += local.length
  }

  const centralSize = centralParts.reduce((s, b) => s + b.length, 0)
  const eocd = new Uint8Array(22)
  const ev = new DataView(eocd.buffer)
  ev.setUint32(0, 0x06054b50, true)
  ev.setUint16(8, Object.keys(fileMap).length, true)
  ev.setUint16(10, Object.keys(fileMap).length, true)
  ev.setUint32(12, centralSize, true)
  ev.setUint32(16, offset, true)

  const total = offset + centralSize + eocd.length
  const out = new Uint8Array(total)
  let pos = 0
  for (const part of [...localParts, ...centralParts, eocd]) {
    out.set(part, pos)
    pos += part.length
  }
  return out.buffer
}

test('ingestOfficeFile parses real Excel (.xlsx) formulas, absolute references, and pageSetup', async () => {
  const xlsxBuffer = buildTestZip({
    'xl/workbook.xml':
      '<workbook><sheets><sheet name="Bookings" sheetId="1"/><sheet name="Control" sheetId="2"/></sheets></workbook>',
    'xl/sharedStrings.xml': '<sst><si><t>Pass</t></si><si><t>Levy</t></si></sst>',
    'xl/worksheets/sheet1.xml': [
      '<worksheet>',
      '<sheetProperties><pageSetUpPr fitToPage="1"/></sheetProperties>',
      '<sheetData>',
      '<row r="1"><c r="A1" t="s"><v>0</v></c></row>',
      '<row r="2"><c r="B2"><v>100</v></c><c r="C2"><f>B2*$H$2</f><v>115</v></c></row>',
      '<row r="3"><c r="C3"><f>COUNTIF(A1:A10,"Pass")</f><v>1</v></c></row>',
      '</sheetData>',
      '<autoFilter ref="A1:C3"/>',
      '<pageSetup orientation="landscape" fitToWidth="1"/>',
      '</worksheet>',
    ].join(''),
    'xl/worksheets/sheet2.xml': '<worksheet><sheetData><row r="1"><c r="H2"><v>0.15</v></c></row></sheetData></worksheet>',
  })

  const report = await ingestOfficeFile({
    fileName: 'CLINIC05_Bookings.xlsx',
    buffer: xlsxBuffer,
    studentCode: 'N5-101',
    course: 'cpn5',
    contextTag: 'n5-gate',
  })

  assert.equal(report.kind, 'xlsx')
  assert.equal(report.metrics.sheetCount, 2)
  assert.deepEqual(report.metrics.sheets, ['Bookings', 'Control'])
  assert.equal(report.metrics.formulaCount, 2)
  assert.equal(report.metrics.absoluteRefCount, 1)
  assert.ok(report.metrics.functionsUsed.includes('COUNTIF'))
  assert.equal(report.metrics.hasAutoFilter, true)
  assert.equal(report.metrics.landscapeSheets, 1)
  assert.equal(report.metrics.fitToWidthSheets, 1)
  assert.equal(report.leakWarnings.length, 0)

  const text = formatOfficeInspectionText(report)
  assert.match(text, /COUNTIF/)
  assert.match(text, /\$H\$2/)
})

test('ingestOfficeFile flags hardcoded numeric spreadsheets and Word layout leaks', async () => {
  const hardcodedXlsx = buildTestZip({
    'xl/workbook.xml': '<workbook><sheets><sheet name="Sheet1" sheetId="1"/></sheets></workbook>',
    'xl/worksheets/sheet1.xml':
      '<worksheet><sheetData><row r="1"><c r="A1"><v>10</v></c><c r="B1"><v>20</v></c><c r="C1"><v>30</v></c><c r="D1"><v>60</v></c></row></sheetData></worksheet>',
  })

  const xlReport = await ingestOfficeFile({ fileName: 'Hardcoded.xlsx', buffer: hardcodedXlsx })
  assert.ok(xlReport.leakWarnings.some((w) => w.leak === 'EXCEL_FUNCTIONS'))

  const badDocx = buildTestZip({
    'word/document.xml': [
      '<w:document><w:body>',
      '<w:p><w:r><w:t>Date      26 August</w:t></w:r></w:p>',
      '<w:p></w:p><w:p></w:p><w:p></w:p>',
      '<w:p><w:r><w:t>This document has plenty of body words without any heading styles applied at all so layout detection checks whether structural styles are missing across more than fifty words in total for testing word layout compliance accurately and cleanly.</w:t></w:r></w:p>',
      '</w:body></w:document>',
    ].join(''),
  })

  const docReport = await ingestOfficeFile({ fileName: 'BadLayout.docx', buffer: badDocx })
  assert.equal(docReport.kind, 'docx')
  assert.ok(docReport.leakWarnings.some((w) => w.leak === 'WORD_LAYOUT' && w.severity === 'high'))
  assert.ok(docReport.leakWarnings.some((w) => w.detail.includes('consecutive blank paragraphs')))
})

test('ingestOfficeFile inspects Word styles, tables, headers/footers, and Mail Merge fields', async () => {
  const goodDocx = buildTestZip({
    'word/document.xml': [
      '<w:document><w:body>',
      '<w:p><w:pPr><w:pStyle w:val="Heading1"/></w:pPr><w:r><w:t>Campus Open Day Invite</w:t></w:r></w:p>',
      '<w:p><w:r><w:t>Dear </w:t></w:r><w:fldSimple w:instr=" MERGEFIELD Delegate "/><w:r><w:t>, your session is </w:t></w:r><w:r><w:instrText> MERGEFIELD Session </w:instrText></w:r></w:p>',
      '<w:tbl><w:tr><w:tc><w:p><w:r><w:t>09:00</w:t></w:r></w:p></w:tc></w:tr></w:tbl>',
      '<w:p><w:r><w:br w:type="page"/></w:r></w:p>',
      '<w:sectPr><w:pgSz w:orient="landscape"/><w:pgMar w:top="1134"/></w:sectPr>',
      '</w:body></w:document>',
    ].join(''),
    'word/footer1.xml':
      '<w:ftr><w:p><w:r><w:instrText> PAGE </w:instrText></w:r><w:r><w:instrText> NUMPAGES </w:instrText></w:r></w:p></w:ftr>',
  })

  const report = await ingestOfficeFile({ fileName: 'Invite_Master.docx', buffer: goodDocx })
  assert.equal(report.kind, 'docx')
  assert.deepEqual(report.metrics.headingStyles, ['Heading1'])
  assert.deepEqual(report.metrics.mergeFields, ['Delegate', 'Session'])
  assert.equal(report.metrics.tableCount, 1)
  assert.equal(report.metrics.pageBreakCount, 1)
  assert.equal(report.metrics.hasPageField, true)
  assert.equal(report.metrics.hasNumPagesField, true)
  assert.equal(report.leakWarnings.length, 0)
})

test('ingestOfficeFile handles real shipped Sankofa starter pack Office files inside public/packs', async () => {
  const packBuffer = await readFile(new URL('../public/packs/n5-careers-clinic.zip', import.meta.url))
  const packEntries = await readZipEntries(packBuffer)
  assert.ok(packEntries.has('Briefing_Starter.docx'))
  assert.ok(packEntries.has('Clinic_Bookings_Approved.xlsx'))

  const docxReport = await ingestOfficeFile({
    fileName: 'Briefing_Starter.docx',
    buffer: packEntries.get('Briefing_Starter.docx').buffer,
  })
  assert.equal(docxReport.kind, 'docx')
  assert.ok(docxReport.metrics.wordCount > 10)

  const xlsxReport = await ingestOfficeFile({
    fileName: 'Clinic_Bookings_Approved.xlsx',
    buffer: packEntries.get('Clinic_Bookings_Approved.xlsx').buffer,
  })
  assert.equal(xlsxReport.kind, 'xlsx')
  assert.deepEqual(xlsxReport.metrics.sheets, ['Bookings', 'Control'])
})

test('ingestOfficeFile handles CSV, renamed/corrupt Office files, and storage persistence', async () => {
  const csvBytes = new TextEncoder().encode('ID,Name,Marks\n101,Lerato,88\n102,Thabo')
  const csvReport = await ingestOfficeFile({ fileName: 'marks.csv', buffer: csvBytes.buffer })
  assert.equal(csvReport.kind, 'csv')
  assert.equal(csvReport.metrics.raggedRows, 1)

  const fakeXlsx = new TextEncoder().encode('not actually an xlsx zip')
  const corruptReport = await ingestOfficeFile({ fileName: 'fake.xlsx', buffer: fakeXlsx.buffer })
  assert.ok(corruptReport.leakWarnings.some((w) => w.leak === 'FILE_MGMT'))

  const store = recordOfficeInspection(createInitialOfficeIngestStore(), csvReport)
  assert.equal(store.reports.length, 1)

  const map = new Map()
  const storage = { getItem: (k) => map.get(k) ?? null, setItem: (k, v) => map.set(k, v) }
  assert.equal(writeOfficeIngestStore(store, storage), true)
  assert.equal(readOfficeIngestStore(storage).reports.length, 1)
  assert.equal(OFFICE_INGEST_STORAGE_KEY, 'sankofa-office-ingest-v1')
  assert.deepEqual(readOfficeIngestStore({ getItem: () => '{bad' }), createInitialOfficeIngestStore())
})

test('ingestOfficeFile handles self-closing Excel cells, rId sheet rels, split Word merge fields, and quoted CSVs', async () => {
  const desktopXlsx = buildTestZip({
    'xl/workbook.xml':
      '<workbook><sheets><sheet name="Summary" sheetId="2" r:id="rId1"/><sheet name="Data" sheetId="1" r:id="rId2"/></sheets></workbook>',
    'xl/_rels/workbook.xml.rels':
      '<Relationships><Relationship Id="rId1" Target="worksheets/sheet2.xml"/><Relationship Id="rId2" Target="worksheets/sheet1.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml':
      '<worksheet><sheetData><row r="1"><c r="A1" s="1"/><c r="B1"><f>SUM(B2:B5)</f><v>40</v></c></row></sheetData></worksheet>',
    'xl/worksheets/sheet2.xml':
      '<worksheet><sheetData><row r="1"><c r="A1"><v>10</v></c></row></sheetData></worksheet>',
  })

  const xlReport = await ingestOfficeFile({ fileName: 'Reordered.xlsx', buffer: desktopXlsx })
  assert.equal(xlReport.formulas.length, 1)
  assert.deepEqual(xlReport.formulas[0], {
    sheet: 'Data',
    cell: 'B1',
    formula: '=SUM(B2:B5)',
  })

  const desktopDocx = buildTestZip({
    'word/document.xml': [
      '<w:document><w:body>',
      '<w:p w14:paraId="1"/>',
      '<w:p><w:r><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:instrText xml:space="preserve"> MERGEFIELD </w:instrText></w:r><w:r><w:instrText>Delegate_Name</w:instrText></w:r><w:r><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:t>«Delegate_Name»</w:t></w:r><w:r><w:fldChar w:fldCharType="end"/></w:r></w:p>',
      '</w:body></w:document>',
    ].join(''),
  })

  const docReport = await ingestOfficeFile({ fileName: 'SplitMerge.docx', buffer: desktopDocx })
  assert.deepEqual(docReport.metrics.mergeFields, ['Delegate_Name'])
  assert.ok(docReport.metrics.wordCount >= 1)

  const quotedCsv = new TextEncoder().encode('Student,Mark,Grade\n"Mokoena, Lerato",88,Pass\n"Ntuli, ""Sam""",92,Pass')
  const csvReport = await ingestOfficeFile({ fileName: 'quoted.csv', buffer: new DataView(quotedCsv.buffer) })
  assert.equal(csvReport.metrics.raggedRows, 0)
  assert.equal(csvReport.metrics.rowCount, 2)
})

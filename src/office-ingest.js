export const OFFICE_INGEST_STORAGE_KEY = 'sankofa-office-ingest-v1'

const textDecoder = new TextDecoder('utf-8')

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function readUint16LE(bytes, offset) {
  return bytes[offset] | (bytes[offset + 1] << 8)
}

function readUint32LE(bytes, offset) {
  return (
    (bytes[offset] |
      (bytes[offset + 1] << 8) |
      (bytes[offset + 2] << 16) |
      (bytes[offset + 3] << 24)) >>>
    0
  )
}

function decodeXmlEntities(text) {
  return String(text ?? '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&')
}

function getAttr(attrString, name) {
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const match = new RegExp(`(?:^|\\s)${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, 'i').exec(attrString || '')
  return match ? decodeXmlEntities(match[1] ?? match[2] ?? '') : ''
}

async function inflateRawBytes(compressedBytes) {
  if (typeof DecompressionStream !== 'function') {
    throw new Error('Deflate decompression is not supported in this browser runtime.')
  }
  const stream = new Blob([compressedBytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'))
  const buffer = await new Response(stream).arrayBuffer()
  return new Uint8Array(buffer)
}

/**
 * Parse a standard ZIP archive (used by .xlsx, .docx, and Sankofa starter kits) into a map of path -> Uint8Array.
 */
export async function readZipEntries(input) {
  const bytes =
    input instanceof Uint8Array
      ? input
      : input instanceof ArrayBuffer
        ? new Uint8Array(input)
        : ArrayBuffer.isView(input)
          ? new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
          : null

  if (!bytes || bytes.length < 22) {
    throw new Error('File is not a valid ZIP/Office OOXML archive.')
  }

  let eocdOffset = -1
  const minOffset = Math.max(0, bytes.length - 65557)
  for (let i = bytes.length - 22; i >= minOffset; i -= 1) {
    if (
      bytes[i] === 0x50 &&
      bytes[i + 1] === 0x4b &&
      bytes[i + 2] === 0x05 &&
      bytes[i + 3] === 0x06
    ) {
      eocdOffset = i
      break
    }
  }

  if (eocdOffset === -1) {
    throw new Error('ZIP End-of-Central-Directory record was not found.')
  }

  const totalEntries = readUint16LE(bytes, eocdOffset + 10)
  const centralDirOffset = readUint32LE(bytes, eocdOffset + 16)
  const entries = new Map()

  let cursor = centralDirOffset
  for (let idx = 0; idx < totalEntries; idx += 1) {
    if (
      cursor + 46 > bytes.length ||
      bytes[cursor] !== 0x50 ||
      bytes[cursor + 1] !== 0x4b ||
      bytes[cursor + 2] !== 0x01 ||
      bytes[cursor + 3] !== 0x02
    ) {
      break
    }

    const method = readUint16LE(bytes, cursor + 10)
    const compressedSize = readUint32LE(bytes, cursor + 20)
    const fileNameLength = readUint16LE(bytes, cursor + 28)
    const extraLength = readUint16LE(bytes, cursor + 30)
    const commentLength = readUint16LE(bytes, cursor + 32)
    const localHeaderOffset = readUint32LE(bytes, cursor + 42)
    const fileName = textDecoder.decode(bytes.subarray(cursor + 46, cursor + 46 + fileNameLength))

    cursor += 46 + fileNameLength + extraLength + commentLength

    if (fileName.endsWith('/')) continue
    if (
      localHeaderOffset + 30 > bytes.length ||
      bytes[localHeaderOffset] !== 0x50 ||
      bytes[localHeaderOffset + 1] !== 0x4b ||
      bytes[localHeaderOffset + 2] !== 0x03 ||
      bytes[localHeaderOffset + 3] !== 0x04
    ) {
      continue
    }

    const localNameLen = readUint16LE(bytes, localHeaderOffset + 26)
    const localExtraLen = readUint16LE(bytes, localHeaderOffset + 28)
    const dataStart = localHeaderOffset + 30 + localNameLen + localExtraLen
    const dataEnd = dataStart + compressedSize
    if (dataEnd > bytes.length) continue

    const slice = bytes.subarray(dataStart, dataEnd)
    if (method === 0) {
      entries.set(fileName, new Uint8Array(slice))
    } else if (method === 8) {
      entries.set(fileName, await inflateRawBytes(slice))
    }
  }

  return entries
}

function readZipText(entries, path) {
  const data = entries.get(path)
  return data ? textDecoder.decode(data) : ''
}

function extractSharedStrings(xml) {
  if (!xml) return []
  const strings = []
  const siMatches = xml.matchAll(/<si\b[^>]*>([\s\S]*?)<\/si>/g)
  for (const match of siMatches) {
    const parts = []
    for (const tMatch of match[1].matchAll(/<t\b[^>]*>([\s\S]*?)<\/t>/g)) {
      parts.push(decodeXmlEntities(tMatch[1]))
    }
    strings.push(parts.join(''))
  }
  return strings
}

function analyzeXlsxEntries(entries, fileName, byteSize) {
  const workbookXml = readZipText(entries, 'xl/workbook.xml')
  const sharedStrings = extractSharedStrings(readZipText(entries, 'xl/sharedStrings.xml'))

  const sheets = []
  for (const m of workbookXml.matchAll(/<sheet\b([^>]*)\/?>/g)) {
    const name = getAttr(m[1], 'name')
    if (name) sheets.push(name)
  }

  const sheetPaths = [...entries.keys()]
    .filter((p) => /^xl\/worksheets\/sheet\d+\.xml$/i.test(p))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  let populatedCells = 0
  let numericCells = 0
  let textCells = 0
  let formulaCount = 0
  let absoluteRefCount = 0
  let hasAutoFilter = false
  let hasDataValidation = false
  let hasConditionalFormatting = false
  let landscapeSheets = 0
  let fitToWidthSheets = 0

  const formulas = []
  const functionsUsed = new Set()
  const previewRows = []

  for (let idx = 0; idx < sheetPaths.length; idx += 1) {
    const sheetPath = sheetPaths[idx]
    const sheetLabel = sheets[idx] || sheetPath.split('/').pop()
    const xml = readZipText(entries, sheetPath)

    if (/<autoFilter\b/i.test(xml)) hasAutoFilter = true
    if (/<dataValidations\b/i.test(xml)) hasDataValidation = true
    if (/<conditionalFormatting\b/i.test(xml)) hasConditionalFormatting = true

    const pageSetupMatch = /<pageSetup\b([^>]*)\/?>/i.exec(xml)
    const fitToPage = /<pageSetUpPr\b[^>]*fitToPage="1"/i.test(xml)
    if (pageSetupMatch) {
      const orient = getAttr(pageSetupMatch[1], 'orientation').toLowerCase()
      const fitW = getAttr(pageSetupMatch[1], 'fitToWidth')
      if (orient === 'landscape') landscapeSheets += 1
      if (fitW === '1' || (fitToPage && fitW !== '0')) fitToWidthSheets += 1
    } else if (fitToPage) {
      fitToWidthSheets += 1
    }

    const rowPreviewCells = []
    for (const cellMatch of xml.matchAll(/<c\b([^>]*)>([\s\S]*?)<\/c>/g)) {
      const attrs = cellMatch[1]
      const inner = cellMatch[2]
      const ref = getAttr(attrs, 'r')
      const type = getAttr(attrs, 't')

      const fMatch = /<f\b[^>]*>([\s\S]*?)<\/f>/.exec(inner)
      const vMatch = /<v\b[^>]*>([\s\S]*?)<\/v>/.exec(inner)
      const inlineT = /<is>[\s\S]*?<t\b[^>]*>([\s\S]*?)<\/t>[\s\S]*?<\/is>/.exec(inner)

      let displayVal = ''
      if (fMatch) {
        const rawFormula = decodeXmlEntities(fMatch[1]).trim()
        const normalized = rawFormula.startsWith('=') ? rawFormula : `=${rawFormula}`
        formulaCount += 1
        if (formulas.length < 25) {
          formulas.push({ sheet: sheetLabel, cell: ref || '?', formula: normalized })
        }
        for (const fnMatch of rawFormula.toUpperCase().matchAll(/\b([A-Z][A-Z0-9_.]*)\s*\(/g)) {
          functionsUsed.add(fnMatch[1])
        }
        const absMatches = rawFormula.match(/\$[A-Z]+\$\d+|\$[A-Z]+\d+|[A-Z]+\$\d+/g)
        if (absMatches) absoluteRefCount += absMatches.length
        displayVal = normalized
      }

      if (vMatch) {
        const rawVal = decodeXmlEntities(vMatch[1])
        if (type === 's') {
          const resolved = sharedStrings[Number(rawVal)] ?? rawVal
          textCells += 1
          if (!displayVal) displayVal = resolved
        } else if (type === 'str' || type === 'b' || type === 'e') {
          textCells += 1
          if (!displayVal) displayVal = rawVal
        } else {
          numericCells += 1
          if (!displayVal) displayVal = rawVal
        }
      } else if (inlineT) {
        textCells += 1
        if (!displayVal) displayVal = decodeXmlEntities(inlineT[1])
      }

      if (fMatch || vMatch || inlineT) {
        populatedCells += 1
        if (rowPreviewCells.length < 8 && displayVal) {
          rowPreviewCells.push(`${ref}: ${displayVal}`)
        }
      }
    }

    if (rowPreviewCells.length > 0 && previewRows.length < 6) {
      previewRows.push(`[${sheetLabel}] ${rowPreviewCells.join(' | ')}`)
    }
  }

  const leakWarnings = []
  const rubricMatches = []

  if (formulaCount > 0) {
    rubricMatches.push(`MANIPULATION: ${formulaCount} live formula(s) detected (${[...functionsUsed].join(', ') || 'arithmetic'}).`)
  } else if (numericCells >= 4) {
    leakWarnings.push({
      leak: 'EXCEL_FUNCTIONS',
      severity: 'high',
      detail: 'Numeric values were detected without any live Excel formulas (<f>). Ensure totals/criteria use formulas rather than hardcoded numbers.',
    })
  }

  if (absoluteRefCount > 0) {
    rubricMatches.push(`ACCURACY: ${absoluteRefCount} locked ($) reference token(s) detected across formulas.`)
  } else if (formulaCount >= 3) {
    leakWarnings.push({
      leak: 'EXCEL_REFERENCING',
      severity: 'medium',
      detail: 'Multiple formulas found with 0 absolute ($) cell references. Verify whether fixed rates/thresholds should be anchored with $.',
    })
  }

  if (fitToWidthSheets > 0 || landscapeSheets > 0) {
    rubricMatches.push(
      `PRINT_OUTPUT: Print setup inspected (${landscapeSheets} landscape, ${fitToWidthSheets} fit-to-1-page-wide).`
    )
  } else if (populatedCells > 0) {
    leakWarnings.push({
      leak: 'PRINT_OUTPUT',
      severity: 'low',
      detail: 'No explicit Fit-to-Width or Landscape pageSetup found; confirm Print Preview before final PDF/printout.',
    })
  }

  if (hasAutoFilter) rubricMatches.push('SORT_FILTER: AutoFilter range detected in worksheet.')
  if (hasDataValidation) rubricMatches.push('VERIFICATION_DISCIPLINE: Data Validation rule(s) detected.')
  if (hasConditionalFormatting) rubricMatches.push('MANIPULATION: Conditional formatting rules present.')

  return {
    kind: 'xlsx',
    fileName,
    byteSize,
    summary: `Excel workbook · ${sheets.length || sheetPaths.length} sheet(s) · ${populatedCells} cells · ${formulaCount} formula(s)`,
    metrics: {
      sheetCount: sheets.length || sheetPaths.length,
      sheets,
      populatedCells,
      numericCells,
      textCells,
      formulaCount,
      absoluteRefCount,
      functionsUsed: [...functionsUsed],
      hasAutoFilter,
      hasDataValidation,
      hasConditionalFormatting,
      landscapeSheets,
      fitToWidthSheets,
    },
    formulas,
    detectedSignals: [
      `Sheets: ${sheets.join(', ') || 'Sheet1'}`,
      `Functions: ${[...functionsUsed].join(', ') || 'None'}`,
      `Formulas: ${formulaCount} | Absolute refs ($): ${absoluteRefCount}`,
    ],
    rubricMatches,
    leakWarnings,
    previewLines: previewRows,
  }
}

function analyzeDocxEntries(entries, fileName, byteSize) {
  const docXml = readZipText(entries, 'word/document.xml')
  const headerPaths = [...entries.keys()].filter((p) => /^word\/header\d+\.xml$/i.test(p))
  const footerPaths = [...entries.keys()].filter((p) => /^word\/footer\d+\.xml$/i.test(p))
  const extraXml = [...headerPaths, ...footerPaths].map((p) => readZipText(entries, p)).join('\n')
  const allXml = `${docXml}\n${extraXml}`

  const paragraphs = [...docXml.matchAll(/<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g)]
  let wordCount = 0
  let emptyParagraphs = 0
  let maxConsecutiveEmpty = 0
  let currentEmptyRun = 0
  let spacePaddingLines = 0
  const headingStyles = new Set()
  const previewLines = []

  for (const pMatch of paragraphs) {
    const pInner = pMatch[1]
    const styleMatch = /<w:pStyle\b([^>]*)\/?>/i.exec(pInner)
    if (styleMatch) {
      const styleVal = getAttr(styleMatch[1], 'w:val') || getAttr(styleMatch[1], 'val')
      if (/^(Heading|Title|Subtitle)/i.test(styleVal)) {
        headingStyles.add(styleVal)
      }
    }

    const textParts = []
    for (const tMatch of pInner.matchAll(/<w:t\b[^>]*>([\s\S]*?)<\/w:t>/g)) {
      textParts.push(decodeXmlEntities(tMatch[1]))
    }
    const line = textParts.join('')
    const trimmed = line.trim()

    if (!trimmed) {
      emptyParagraphs += 1
      currentEmptyRun += 1
      if (currentEmptyRun > maxConsecutiveEmpty) maxConsecutiveEmpty = currentEmptyRun
    } else {
      currentEmptyRun = 0
      const words = trimmed.split(/\s+/).filter(Boolean)
      wordCount += words.length
      if (/[ ]{4,}/.test(line)) {
        spacePaddingLines += 1
      }
      if (previewLines.length < 6) {
        previewLines.push(trimmed.slice(0, 140))
      }
    }
  }

  const tableCount = (docXml.match(/<w:tbl\b/g) || []).length
  const tabCount = (docXml.match(/<w:tab\b|<w:tabs\b/g) || []).length
  const pageBreakCount = (docXml.match(/<w:br\b[^>]*w:type="page"/gi) || []).length
  const landscapeSections = (docXml.match(/<w:pgSz\b[^>]*w:orient="landscape"/gi) || []).length
  const hasMargins = /<w:pgMar\b/i.test(docXml)

  const instrTexts = []
  for (const m of allXml.matchAll(/<w:instrText\b[^>]*>([\s\S]*?)<\/w:instrText>|<w:fldSimple\b([^>]*)>/g)) {
    if (m[1] !== undefined) {
      instrTexts.push(decodeXmlEntities(m[1]).trim())
    } else if (m[2] !== undefined) {
      const instr = getAttr(m[2], 'w:instr') || getAttr(m[2], 'instr')
      if (instr) instrTexts.push(instr.trim())
    }
  }

  const mergeFields = []
  let hasPageField = false
  let hasNumPagesField = false
  let hasTocField = false

  for (const instr of instrTexts) {
    const upper = instr.toUpperCase()
    if (/\bPAGE\b/.test(upper)) hasPageField = true
    if (/\bNUMPAGES\b/.test(upper)) hasNumPagesField = true
    if (/\bTOC\b/.test(upper)) hasTocField = true
    const mergeMatch = /MERGEFIELD\s+("?)([^\s"\\]+)\1/i.exec(instr)
    if (mergeMatch && !mergeFields.includes(mergeMatch[2])) {
      mergeFields.push(mergeMatch[2])
    }
  }

  const leakWarnings = []
  const rubricMatches = []

  if (headingStyles.size > 0) {
    rubricMatches.push(`WORD_LAYOUT: Built-in styles applied (${[...headingStyles].join(', ')}).`)
  } else if (wordCount >= 50) {
    leakWarnings.push({
      leak: 'WORD_LAYOUT',
      severity: 'medium',
      detail: 'No built-in Heading or Title styles detected; ensure headings use Heading styles instead of manual bold/size formatting.',
    })
  }

  if (spacePaddingLines > 0) {
    leakWarnings.push({
      leak: 'WORD_LAYOUT',
      severity: 'high',
      detail: `Detected ${spacePaddingLines} line(s) with 4+ consecutive spaces. Use Tab stops or Tables instead of spacebar alignment.`,
    })
  }

  if (maxConsecutiveEmpty >= 3) {
    leakWarnings.push({
      leak: 'WORD_LAYOUT',
      severity: 'medium',
      detail: `Detected ${maxConsecutiveEmpty} consecutive blank paragraphs. Use Page Breaks (Ctrl+Enter) instead of pressing Enter repeatedly.`,
    })
  }

  if (mergeFields.length > 0) {
    rubricMatches.push(`MAIL_MERGE: ${mergeFields.length} merge field(s) detected (${mergeFields.join(', ')}).`)
  }
  if (tableCount > 0) rubricMatches.push(`MANIPULATION: ${tableCount} structured Word table(s) detected.`)
  if (tabCount > 0) rubricMatches.push(`WORD_LAYOUT: Tab stop / tab character controls detected (${tabCount}).`)
  if (pageBreakCount > 0) rubricMatches.push(`WORD_LAYOUT: ${pageBreakCount} explicit page break(s) detected.`)
  if (headerPaths.length > 0 || footerPaths.length > 0) {
    rubricMatches.push(
      `PRINT_OUTPUT: ${headerPaths.length} header(s), ${footerPaths.length} footer(s)${hasPageField ? ', automatic PAGE field' : ''}${hasNumPagesField ? ' + NUMPAGES' : ''}.`
    )
  }

  return {
    kind: 'docx',
    fileName,
    byteSize,
    summary: `Word document · ${wordCount} words · ${paragraphs.length} paragraphs · ${tableCount} table(s)`,
    metrics: {
      wordCount,
      paragraphCount: paragraphs.length,
      emptyParagraphs,
      maxConsecutiveEmpty,
      spacePaddingLines,
      headingStyles: [...headingStyles],
      tableCount,
      tabCount,
      pageBreakCount,
      landscapeSections,
      hasMargins,
      headerCount: headerPaths.length,
      footerCount: footerPaths.length,
      hasPageField,
      hasNumPagesField,
      hasTocField,
      mergeFields,
    },
    formulas: [],
    detectedSignals: [
      `Styles: ${[...headingStyles].join(', ') || 'Normal only'}`,
      `Tables: ${tableCount} | Page breaks: ${pageBreakCount} | Landscape sections: ${landscapeSections}`,
      `Merge fields: ${mergeFields.join(', ') || 'None'}`,
    ],
    rubricMatches,
    leakWarnings,
    previewLines,
  }
}

function analyzeCsvText(text, fileName, byteSize) {
  const lines = String(text ?? '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0)

  const first = lines[0] || ''
  const delimiter = first.includes(';') && !first.includes(',') ? ';' : first.includes('\t') ? '\t' : ','
  const rows = lines.map((line) => line.split(delimiter).map((cell) => cell.trim()))
  const headers = rows[0] || []
  const dataRows = rows.slice(1)
  const raggedRows = dataRows.filter((r) => r.length !== headers.length).length

  const leakWarnings = []
  if (raggedRows > 0) {
    leakWarnings.push({
      leak: 'VERIFICATION_DISCIPLINE',
      severity: 'medium',
      detail: `${raggedRows} row(s) do not match header column count (${headers.length}). Check delimiter or unquoted commas.`,
    })
  }

  return {
    kind: 'csv',
    fileName,
    byteSize,
    summary: `CSV table · ${headers.length} column(s) · ${dataRows.length} data row(s)`,
    metrics: {
      delimiter: delimiter === '\t' ? 'TAB' : delimiter,
      columnCount: headers.length,
      rowCount: dataRows.length,
      headers,
      raggedRows,
    },
    formulas: [],
    detectedSignals: [
      `Headers: ${headers.join(', ') || 'None'}`,
      `Rows: ${dataRows.length} | Delimiter: ${delimiter === '\t' ? 'TAB' : delimiter}`,
    ],
    rubricMatches: dataRows.length > 0 ? [`DATA_INTEGRITY: Parsed ${dataRows.length} structured CSV row(s).`] : [],
    leakWarnings,
    previewLines: lines.slice(0, 6).map((l) => l.slice(0, 140)),
  }
}

function analyzePlainTextOrHtml(text, fileName, byteSize) {
  const clean = String(text ?? '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = clean ? clean.split(' ').length : 0
  const rawLines = String(text ?? '')
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)

  const oneNoteMarkers = ['notebook', 'section', 'subpage', 'tag', 'onenote'].filter((kw) =>
    clean.toLowerCase().includes(kw)
  )

  return {
    kind: 'text',
    fileName,
    byteSize,
    summary: `Text/Export evidence · ${words} word(s) · ${rawLines.length} line(s)`,
    metrics: {
      wordCount: words,
      lineCount: rawLines.length,
      oneNoteMarkers,
    },
    formulas: [],
    detectedSignals: [
      `Words: ${words} | Lines: ${rawLines.length}`,
      ...(oneNoteMarkers.length ? [`OneNote/Structure markers: ${oneNoteMarkers.join(', ')}`] : []),
    ],
    rubricMatches:
      words >= 15
        ? ['EVIDENCE_CAPTURE: Structured text/export evidence parsed cleanly.']
        : [],
    leakWarnings:
      words < 10
        ? [
            {
              leak: 'SCREENSHOT_EVIDENCE',
              severity: 'low',
              detail: 'Attached text file has fewer than 10 words; confirm full reasoning/output was exported.',
            },
          ]
        : [],
    previewLines: rawLines.slice(0, 6).map((l) => l.slice(0, 140)),
  }
}

/**
 * Consume an uploaded Microsoft Office or evidence file (.xlsx, .docx, .csv, .txt, .html, .pdf metadata)
 * and return a structured inspection report with extracted formulas, layout cues, and leak warnings.
 */
export async function ingestOfficeFile({
  fileName = 'unnamed',
  buffer,
  byteSize,
  studentCode = 'local-learner',
  course = 'cpn5',
  contextTag = 'assignments',
  fileId = '',
} = {}) {
  const safeName = String(fileName || 'unnamed').trim()
  const ext = safeName.includes('.') ? safeName.split('.').pop().toLowerCase() : ''
  const size = Number.isFinite(byteSize) ? byteSize : buffer?.byteLength ?? 0
  const baseReport = {
    id: `off-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    fileId,
    studentCode: String(studentCode || 'local-learner').trim() || 'local-learner',
    course: course || 'cpn5',
    contextTag: contextTag || 'assignments',
    analyzedAt: new Date().toISOString(),
  }

  if (ext === 'xlsx' || ext === 'xlsm') {
    try {
      const entries = await readZipEntries(buffer)
      return { ...baseReport, ...analyzeXlsxEntries(entries, safeName, size) }
    } catch (err) {
      return {
        ...baseReport,
        kind: 'xlsx',
        fileName: safeName,
        byteSize: size,
        summary: 'Excel file stored (could not inspect OOXML structure)',
        metrics: {},
        formulas: [],
        detectedSignals: [],
        rubricMatches: [],
        leakWarnings: [
          {
            leak: 'FILE_MGMT',
            severity: 'high',
            detail: `Could not parse as valid .xlsx OOXML archive (${err?.message || 'corrupt or renamed file'}). Verify Save As > Excel Workbook (.xlsx).`,
          },
        ],
        previewLines: [],
      }
    }
  }

  if (ext === 'docx') {
    try {
      const entries = await readZipEntries(buffer)
      return { ...baseReport, ...analyzeDocxEntries(entries, safeName, size) }
    } catch (err) {
      return {
        ...baseReport,
        kind: 'docx',
        fileName: safeName,
        byteSize: size,
        summary: 'Word file stored (could not inspect OOXML structure)',
        metrics: {},
        formulas: [],
        detectedSignals: [],
        rubricMatches: [],
        leakWarnings: [
          {
            leak: 'FILE_MGMT',
            severity: 'high',
            detail: `Could not parse as valid .docx OOXML archive (${err?.message || 'corrupt or renamed file'}). Verify Save As > Word Document (.docx).`,
          },
        ],
        previewLines: [],
      }
    }
  }

  if (ext === 'csv') {
    const rawText = buffer ? textDecoder.decode(new Uint8Array(buffer)) : ''
    return { ...baseReport, ...analyzeCsvText(rawText, safeName, size) }
  }

  if (ext === 'txt' || ext === 'md' || ext === 'html' || ext === 'htm') {
    const rawText = buffer ? textDecoder.decode(new Uint8Array(buffer)) : ''
    return { ...baseReport, ...analyzePlainTextOrHtml(rawText, safeName, size) }
  }

  const isLegacyOffice = ext === 'doc' || ext === 'xls'
  return {
    ...baseReport,
    kind: ext || 'binary',
    fileName: safeName,
    byteSize: size,
    summary: `${ext ? ext.toUpperCase() : 'Binary'} attachment recorded (${Math.max(1, Math.round(size / 1024))} KB)`,
    metrics: { extension: ext },
    formulas: [],
    detectedSignals: [`File format: .${ext || 'unknown'}`],
    rubricMatches: ext === 'pdf' ? ['PRINT_OUTPUT: PDF print/export evidence attached.'] : [],
    leakWarnings: isLegacyOffice
      ? [
          {
            leak: 'FILE_MGMT',
            severity: 'medium',
            detail: `Legacy .${ext} binary format cannot be auto-inspected in browser. Re-save as .${ext}x in Microsoft Office for full formula/layout verification.`,
          },
        ]
      : [],
    previewLines: [],
  }
}

export function createInitialOfficeIngestStore() {
  return {
    version: 1,
    reports: [],
  }
}

export function readOfficeIngestStore(storage = globalThis.localStorage) {
  const fallback = createInitialOfficeIngestStore()
  if (!storage || typeof storage.getItem !== 'function') return fallback
  try {
    const raw = storage.getItem(OFFICE_INGEST_STORAGE_KEY)
    if (!raw) return fallback
    const parsed = JSON.parse(raw)
    if (!isPlainObject(parsed)) return fallback
    return {
      version: 1,
      reports: Array.isArray(parsed.reports) ? parsed.reports : [],
    }
  } catch {
    return fallback
  }
}

export function writeOfficeIngestStore(store, storage = globalThis.localStorage) {
  if (!storage || typeof storage.setItem !== 'function') return false
  try {
    storage.setItem(
      OFFICE_INGEST_STORAGE_KEY,
      JSON.stringify(isPlainObject(store) ? store : createInitialOfficeIngestStore())
    )
    return true
  } catch {
    return false
  }
}

export function recordOfficeInspection(store, report) {
  const base = isPlainObject(store) && Array.isArray(store.reports) ? store : createInitialOfficeIngestStore()
  if (!isPlainObject(report) || !report.fileName) return base
  return {
    version: 1,
    reports: [...base.reports, report].slice(-100),
  }
}

export function formatOfficeInspectionText(report) {
  if (!report) return ''
  const lines = [
    `SANKOFA COMPUTELAB · MS OFFICE INSPECTION REPORT`,
    `File: ${report.fileName} (${report.kind?.toUpperCase()})`,
    `Learner: ${report.studentCode} · Course: ${String(report.course || '').toUpperCase()}`,
    `Summary: ${report.summary}`,
    '',
    'DETECTED SIGNALS:',
    ...(report.detectedSignals?.length ? report.detectedSignals.map((s) => `- ${s}`) : ['- None']),
    '',
    'RUBRIC MATCHES:',
    ...(report.rubricMatches?.length ? report.rubricMatches.map((m) => `+ ${m}`) : ['+ None recorded']),
    '',
    'LEAK WARNINGS:',
    ...(report.leakWarnings?.length
      ? report.leakWarnings.map((w) => `! [${w.leak} · ${w.severity}] ${w.detail}`)
      : ['None — no structural Office leaks flagged']),
  ]
  if (report.formulas?.length) {
    lines.push('', 'EXTRACTED EXCEL FORMULAS:')
    for (const f of report.formulas.slice(0, 15)) {
      lines.push(`- ${f.sheet}!${f.cell}: ${f.formula}`)
    }
  }
  return lines.join('\n')
}

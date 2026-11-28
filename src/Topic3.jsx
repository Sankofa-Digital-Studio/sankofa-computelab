import React from 'react'
import { TopicHub } from './TopicHub.jsx'
import { TOPIC3_MODULES, TOPIC3_TITLE } from './topic3-data.js'
import { TOPIC3_STORAGE_KEY } from './topic3-engine.js'

const TOPIC3_FILTERS = [
  { id: 'all', label: 'All Modules', match: () => true },
  { id: 'wave1', label: 'Wave 1 Core', match: (m) => m.releaseScope === 'wave1' },
  { id: 'wave2', label: 'Wave 2 Mastery', match: (m) => m.releaseScope === 'wave2' },
]

export function Topic3({ notify, onNav }) {
  return (
    <TopicHub
      storageKey={TOPIC3_STORAGE_KEY}
      eyebrow="COMPUTER PRACTICE N5 · TOPIC 3 HUB"
      title={TOPIC3_TITLE}
      description="Master Data vs Information, Computational Thinking, structured tables & keys, Verification vs Validation, and privacy-safe reporting across N5 and N6."
      summaryFilePrefix="N5-Topic3"
      summaryLabel="Topic 3"
      fileIdPrefix="topic3"
      modules={TOPIC3_MODULES}
      filters={TOPIC3_FILTERS}
      consolidationLabel="Section 5 & Mastery"
      notify={notify}
      onNav={onNav}
    />
  )
}

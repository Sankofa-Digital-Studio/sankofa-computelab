import React from 'react'
import { TopicHub } from './TopicHub.jsx'
import { TOPIC1_MODULES, TOPIC1_TITLE } from './topic1-data.js'
import { TOPIC1_STORAGE_KEY } from './topic1-engine.js'

const TOPIC1_FILTERS = [
  {
    id: 'all',
    label: 'All',
    match: () => true,
  },
  {
    id: 'theory-os',
    label: 'Theory & OS',
    match: (mod) => mod.category === 'theory' || mod.category === 'files',
  },
  {
    id: 'word',
    label: 'Word & Mail Merge',
    match: (mod) => mod.category === 'word',
  },
  {
    id: 'excel',
    label: 'Spreadsheets',
    match: (mod) => mod.category === 'excel',
  },
  {
    id: 'integration',
    label: 'Integration & Consolidation',
    match: (mod) => mod.category === 'integration' || mod.category === 'consolidation',
  },
]

/**
 * Topic 1 Workbench wrapper around the shared TopicHub UI.
 */
export function Topic1({ notify, onNav }) {
  return (
    <TopicHub
      storageKey={TOPIC1_STORAGE_KEY}
      eyebrow="CPN5 · TOPIC 1 WORKBENCH"
      title={TOPIC1_TITLE}
      description="Master Sections 1–8 concepts, avoid high-risk CBT traps, pass Quick Checks, and log practical evidence."
      summaryFilePrefix="CPN5-Topic1"
      summaryLabel="Topic 1"
      fileIdPrefix="t1"
      modules={TOPIC1_MODULES}
      filters={TOPIC1_FILTERS}
      consolidationLabel="Section 8"
      notify={notify}
      onNav={onNav}
    />
  )
}

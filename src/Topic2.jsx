import React from 'react'
import { TopicHub } from './TopicHub.jsx'
import { TOPIC2_MODULES, TOPIC2_TITLE } from './topic2-data.js'
import { TOPIC2_STORAGE_KEY } from './topic2-engine.js'

const TOPIC2_FILTERS = [
  {
    id: 'all',
    label: 'All',
    match: () => true,
  },
  {
    id: 'types-architectures',
    label: 'Types & Architectures',
    match: (mod) => mod.category === 'classification' || mod.category === 'architecture',
  },
  {
    id: 'digital-era',
    label: 'Digital Era & Uses',
    match: (mod) => mod.category === 'digital-era',
  },
  {
    id: 'consolidation',
    label: 'Consolidation & Mastery',
    match: (mod) => mod.category === 'consolidation',
  },
]

/**
 * Topic 2 Workbench wrapper around the shared TopicHub UI.
 */
export function Topic2({ notify, onNav }) {
  return (
    <TopicHub
      storageKey={TOPIC2_STORAGE_KEY}
      eyebrow="CPN5 · TOPIC 2 WORKBENCH"
      title={TOPIC2_TITLE}
      description="Classify LAN/MAN/WAN networks, distinguish architectures and components, master Digital Era e-concepts, and log practical evidence."
      summaryFilePrefix="CPN5-Topic2"
      summaryLabel="Topic 2"
      fileIdPrefix="t2"
      modules={TOPIC2_MODULES}
      filters={TOPIC2_FILTERS}
      consolidationLabel="Section 3 & Mastery"
      notify={notify}
      onNav={onNav}
    />
  )
}

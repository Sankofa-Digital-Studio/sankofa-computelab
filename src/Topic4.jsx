import React from 'react'
import { TopicHub } from './TopicHub.jsx'
import { TOPIC4_MODULES, TOPIC4_TITLE } from './topic4-data.js'
import { TOPIC4_STORAGE_KEY } from './topic4-engine.js'

const TOPIC4_FILTERS = [
  {
    id: 'all',
    label: 'All',
    match: () => true,
  },
  {
    id: 'apps',
    label: 'Apps & Web Evolution',
    match: (mod) => mod.category === 'apps',
  },
  {
    id: 'services',
    label: 'Services & E-Commerce',
    match: (mod) => mod.category === 'services',
  },
  {
    id: 'search',
    label: 'Search & Evaluation',
    match: (mod) => mod.category === 'search',
  },
  {
    id: 'consolidation',
    label: 'Consolidation & Mastery',
    match: (mod) => mod.category === 'consolidation',
  },
]

/**
 * Topic 4 Workbench wrapper around the shared TopicHub UI.
 */
export function Topic4({ notify, onNav }) {
  return (
    <TopicHub
      storageKey={TOPIC4_STORAGE_KEY}
      eyebrow="CPN5 · TOPIC 4 WORKBENCH"
      title={TOPIC4_TITLE}
      description="Master Internet applications and plug-ins, Web 1.0–4.0, service technologies, static/dynamic websites, Boolean queries, and source evaluation."
      summaryFilePrefix="CPN5-Topic4"
      summaryLabel="Topic 4"
      fileIdPrefix="t4"
      modules={TOPIC4_MODULES}
      filters={TOPIC4_FILTERS}
      consolidationLabel="Section 4 & Mastery"
      notify={notify}
      onNav={onNav}
    />
  )
}

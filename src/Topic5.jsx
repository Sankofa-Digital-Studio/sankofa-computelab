import React from 'react'
import { TopicHub } from './TopicHub.jsx'
import { TOPIC5_MODULES, TOPIC5_TITLE } from './topic5-data.js'
import { TOPIC5_STORAGE_KEY } from './topic5-engine.js'

const TOPIC5_FILTERS = [
  {
    id: 'all',
    label: 'All',
    match: () => true,
  },
  {
    id: 'emerging-impact',
    label: 'Emerging Tech & Impact',
    match: (mod) => mod.category === 'emerging' || mod.category === 'impact',
  },
  {
    id: 'cybercrime',
    label: 'Cybercrime & Prevention',
    match: (mod) => mod.category === 'cybercrime',
  },
  {
    id: 'ethics',
    label: 'ICT Ethics',
    match: (mod) => mod.category === 'ethics',
  },
]

/**
 * Topic 5 Workbench wrapper around the shared TopicHub UI.
 */
export function Topic5({ notify, onNav }) {
  return (
    <TopicHub
      storageKey={TOPIC5_STORAGE_KEY}
      eyebrow="CPN5 · TOPIC 5 WORKBENCH"
      title={TOPIC5_TITLE}
      description="Evaluate emerging technology and ICT human impact, decode cybercriminal methods and crime types, prescribe technical prevention, and apply ICT ethics."
      summaryFilePrefix="CPN5-Topic5"
      summaryLabel="Topic 5"
      fileIdPrefix="t5"
      modules={TOPIC5_MODULES}
      filters={TOPIC5_FILTERS}
      consolidationLabel="Section 3A Ethics"
      notify={notify}
      onNav={onNav}
    />
  )
}

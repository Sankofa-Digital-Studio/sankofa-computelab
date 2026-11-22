import React from 'react'

export function CapabilityDisclosure({ label, items }) {
  return (
    <details className="capability-disclosure">
      <summary>{label}</summary>
      <dl>
        {items.map(({ title, detail, route }) => (
          <div key={route}>
            <dt><a href={'#' + route}>{title}</a></dt>
            <dd>{detail}</dd>
          </div>
        ))}
      </dl>
    </details>
  )
}

import { useState } from 'react'
import { pageContent } from './pageContent'

function SectionPage({ path }) {
  const [query, setQuery] = useState('')
  const content = pageContent[path] || ['My Entries', 'Review vouchers and saved business entries.', ['Entry', 'Type', 'Date', 'Amount', 'Status']]

  return (
    <div className="section-page">
      <div className="section-heading"><div><h1>{content[0]}</h1><p>{content[1]}</p></div><button className="primary-action" type="button">＋ Create New</button></div>
      <section className="workspace-card">
        <div className="workspace-toolbar"><strong>{content[0]} Overview</strong><label className="search-box">⌕<input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /></label><button className="outline-action" type="button">⇩ Export</button></div>
        <div className="workspace-table"><div className="workspace-row workspace-header">{content[2].map((heading) => <b key={heading}>{heading}</b>)}</div><div className="workspace-empty"><span className="empty-icon">□</span><strong>No {content[0].toLowerCase()} found</strong><span>Your records will appear here once you add them.</span><button className="primary-action" type="button">＋ Create New</button></div></div>
      </section>
    </div>
  )
}

export default SectionPage
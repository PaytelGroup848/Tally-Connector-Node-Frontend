import { useState } from 'react'

const pages = {
  '/tracking-report': ['Tracking Report', ['Users', 'Email', 'Mobile'], [['', '', '+ 917011022899']]],
  '/my-stock-items': ['My Stock Items', ['Name', 'Date', 'Status', 'Action'], []],
  '/my-ledgers': ['My Ledgers', ['Name', 'Date', 'Status', 'Action'], []],
  '/my-invoices': ['My Invoices', ['IRN/ACK No ↑', 'Name', 'Date', 'Invoice No', 'Amount', 'Sync Status', 'eInvoices Status', 'Download'], []],
  '/my-eway-bill': ['My eWay Bills', ['eWayBillNo', 'Name', 'Date', 'Invoice No', 'Valid till', 'Amount', 'Sync Status', 'eWay Status', 'Download'], []],
  '/my-quotations': ['My Quotations', ['Name', 'Date', 'Quotation', 'Amount', 'Action'], []],
}

function MyEntryListPage({ path }) {
  const [query, setQuery] = useState('')
  const [title, columns, rows] = pages[path] || pages['/tracking-report']
  const invoiceTabs = title === 'My Invoices' || title === 'My eWay Bills'
  const isTracking = title === 'Tracking Report'
  const hasStatusFilters = !isTracking && title !== 'My Quotations'
  const columnsClass = columns.length === 3 ? 'grid-cols-3' : columns.length === 4 ? 'grid-cols-4' : columns.length === 5 ? 'grid-cols-5' : columns.length === 8 ? 'grid-cols-8' : 'grid-cols-9'
  return <div className={`page-surface ${isTracking ? 'tracking-page' : 'entry-page'}`}>
    <div className="page-toolbar"><span className="text-2xl">←</span><h1 className="text-base font-semibold">{title}</h1><div className="page-tabs ml-auto">{hasStatusFilters && <>{(invoiceTabs ? ['All', 'Generated', 'Cancelled', 'Rejected'] : ['All', 'Pending', 'Completed', 'More⌄']).map((tab) => <button key={tab}>{tab}</button>)}</>}</div>{!isTracking && <div className="rounded-md border border-slate-300 px-3 py-2 text-xs">‹　▣　01/04/2026 - 31/03/2027　›</div>}</div>
    <section className="page-card p-5"><div className="mb-3 flex flex-wrap items-center gap-4"><input className="h-9 w-[min(100%,200px)] rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-green-500" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /><span className="text-xs">Rows per page: 10　⌄</span>{(title === 'My Stock Items' || title === 'My Ledgers') && <button className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white" type="button">⊕　Add New</button>}</div><div className={`grid min-w-[640px] ${columnsClass} border-y border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold`}>{columns.map((column) => <b key={column}>{column}</b>)}</div>{rows.length ? rows.map((row) => <div className={`grid min-w-[640px] ${columnsClass} px-4 py-3 text-xs`} key={row.join('-')}>{row.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>) : <div className="min-w-[640px] py-3 text-center text-xs text-slate-500">No data available</div>}<footer className="flex justify-between pt-2 text-xs"><span>{rows.length ? '1-1 of 1' : '1-0 of 0'}</span><span className="text-slate-300">‹　<b className="rounded bg-sky-600 px-3 py-2 text-white">1</b>　›</span></footer></section>
  </div>
}

export default MyEntryListPage

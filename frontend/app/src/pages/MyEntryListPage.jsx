import { useState } from 'react'
import DateRangePicker from '../components/DateRangePicker'

const pages = {
  '/tracking-report': ['Tracking Report', ['Users', 'Email', 'Mobile'], [['', '', '+ 917011022899']]],
  '/my-stock-items': ['My Stock Items', ['Name', 'Date', 'Status', 'Action'], []],
  '/my-ledgers': ['My Ledgers', ['Name', 'Date', 'Status', 'Action'], []],
  '/my-parties': ['My Parties', ['Name', 'Date', 'Status', 'Action'], []],
  '/my-invoices': ['My Invoices', ['IRN/ACK No ↑', 'Name', 'Date', 'Invoice No', 'Amount', 'Sync Status', 'eInvoices Status', 'Download'], []],
  '/my-eway-bill': ['My eWay Bills', ['eWayBillNo', 'Name', 'Date', 'Invoice No', 'Valid till', 'Amount', 'Sync Status', 'eWay Status', 'Download'], []],
  '/my-quotations': ['My Quotations', ['Name', 'Date', 'Quotation', 'Amount', 'Action'], []],
}

function MyEntryListPage({ path }) {
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState('2026-04-01')
  const [endDate, setEndDate] = useState('2027-03-31')
  const [title, columns, rows] = pages[path] || pages['/tracking-report']
  const invoiceTabs = title === 'My Invoices' || title === 'My eWay Bills'
  const isTracking = title === 'Tracking Report'
  const hasStatusFilters = !isTracking && title !== 'My Quotations'
  const columnsClass = columns.length === 3 ? 'grid-cols-3' : columns.length === 4 ? 'grid-cols-4' : columns.length === 5 ? 'grid-cols-5' : columns.length === 8 ? 'grid-cols-8' : 'grid-cols-9'

  const handleAddNew = () => {
    const routeMap = {
      '/my-stock-items': '/my-stock-items/add-new',
      '/my-ledgers': '/my-ledgers/add-new',
      '/my-parties': '/my-parties/add-new',
      '/my-invoices': '/my-invoices/add-new',
      '/my-eway-bill': '/my-eway-bill/add-new',
    }

    const nextRoute = routeMap[path] || '/items/add-new'
    window.history.pushState({}, '', nextRoute)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return <div className={`page-surface ${isTracking ? 'tracking-page' : 'entry-page'}`}>
    <div className="page-toolbar flex flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
      <button type="button" className="text-2xl leading-none text-slate-700" aria-label="Back">←</button>
      <h1 className="text-[18px] font-semibold text-slate-900">{title}</h1>
      <div className="page-tabs ml-auto flex flex-wrap items-center gap-2">
        {hasStatusFilters && <>{(invoiceTabs ? ['All', 'Generated', 'Cancelled', 'Rejected'] : ['All', 'Pending', 'Completed', 'More⌄']).map((tab, index) => <button key={tab} className={`rounded-md border px-3 py-1.5 text-[11px] font-medium ${index === 0 ? 'border-slate-300 bg-white text-slate-900 shadow-sm' : 'border-slate-200 bg-slate-100 text-slate-600'}`}>{tab}</button>)}</>}
      </div>
      {!isTracking && <DateRangePicker startDate={startDate} endDate={endDate} onChange={(nextStart, nextEnd) => { setStartDate(nextStart || startDate); setEndDate(nextEnd || endDate) }} compact />}
    </div>
    <section className="page-card p-5">
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <input className="h-9 w-[min(100%,220px)] rounded-lg border border-slate-300 bg-white px-3 text-xs outline-none focus:border-green-500" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
        <span className="text-xs text-slate-700">Rows per page: 10　⌄</span>
        {(title === 'My Stock Items' || title === 'My Ledgers' || title === 'My Parties') && <button className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white" type="button" onClick={handleAddNew}>⊕　Add New</button>}
      </div>
      <div className={`grid min-w-[640px] ${columnsClass} border-y border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold`}>
        {columns.map((column) => <b key={column}>{column}</b>)}
      </div>
      {rows.length ? rows.map((row) => <div className={`grid min-w-[640px] ${columnsClass} px-4 py-3 text-xs`} key={row.join('-')}>{row.map((value, index) => <span key={`${value}-${index}`}>{value}</span>)}</div>) : <div className="min-w-[640px] py-3 text-center text-xs text-slate-500">No data available</div>}
      <footer className="flex justify-between pt-2 text-xs text-slate-600"><span>{rows.length ? '1-1 of 1' : '1-0 of 0'}</span><span className="text-slate-300">‹　<b className="rounded bg-sky-600 px-3 py-2 text-white">1</b>　›</span></footer>
    </section>
  </div>
}

export default MyEntryListPage

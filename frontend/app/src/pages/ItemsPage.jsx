import { useState } from 'react'

function ItemsPage() {
  const [query, setQuery] = useState('')
  const columns = ['Item Name ↑', 'HSN Code', 'Closing Stock', 'Avg Pur Rate', 'Amount']
  return <div className="page-surface"><div className="page-toolbar"><span className="text-2xl">←</span><h1 className="text-base font-semibold">Items</h1><div className="page-tabs ml-auto">{['All Stocks', 'In Stock', 'More⌄', 'Summary', 'Group', 'Godown', 'Category'].map((item) => <button key={item}>{item}</button>)}</div><div className="rounded-md border border-slate-300 px-3 py-2 text-xs">‹　▣　01/04/2026 - 31/03/2027　›</div></div><section className="page-card p-5"><div className="mb-3 flex flex-wrap items-center gap-4"><input className="h-9 w-[min(100%,200px)] rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-green-500" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /><span className="text-xs">Rows per page: 10　⌄</span><button className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white" type="button">⊕　Add New</button><button className="rounded-lg border border-slate-300 px-4 py-2 text-xs" type="button">▣　View PDF</button></div><div className="grid min-w-[640px] grid-cols-5 border-y border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold">{columns.map((column) => <b key={column}>{column}</b>)}</div><div className="min-w-[640px] py-3 text-center text-xs text-slate-500">No data available</div><footer className="flex justify-between pt-2 text-xs"><span>1-0 of 0</span><span className="text-slate-300">‹　›</span></footer></section></div>
}

export default ItemsPage

function PurchasePage() {
  return (
    <div className="report-page min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="report-summary flex min-h-[64px] flex-wrap items-center gap-4 border-b border-slate-200 bg-white px-4 py-2.5 lg:flex-nowrap">
        <span className="back-arrow text-3xl font-light leading-none text-slate-900" aria-hidden="true">←</span>
        <div className="min-w-[130px] text-[11px] leading-4">
          <b className="block font-medium">Total Purchase:</b>
          <strong className="block text-sm">₹ 0.00</strong>
        </div>
        <div className="report-filters flex flex-wrap items-center gap-1 rounded-lg bg-slate-100 p-0.5 text-xs font-medium">
          <button type="button" className="filter-active rounded-md border border-slate-900 bg-white px-3 py-2">Gross</button>
          <button type="button" className="rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700">Net</button>
          <button type="button" className="rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700">Month</button>
          <button type="button" className="rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700">Bill</button>
          <button type="button" className="rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700">Ledger</button>
          <button type="button" className="rounded-md border border-transparent bg-transparent px-3 py-2 text-slate-700">More⌄</button>
        </div>
        <div className="date-filter ml-auto flex min-h-8 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-xs font-medium whitespace-nowrap">
          <span aria-hidden="true">‹</span>
          <span aria-hidden="true">▣</span>
          <span>01/04/2026 - 31/03/2027</span>
          <span aria-hidden="true">›</span>
        </div>
      </div>

      <section className="report-card mx-5 mt-2.5 overflow-hidden rounded-lg border border-white bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="report-toolbar flex flex-wrap items-center gap-4 px-5 py-3">
          <label className="report-search flex h-9 w-[200px] items-center gap-2 rounded-md border border-slate-300 px-3 text-slate-400">
            <span>⌕</span>
            <input className="w-full bg-transparent text-xs outline-none" placeholder="Search" />
          </label>
          <span className="text-xs text-slate-700">Rows per page:　10　⌄</span>
          <button type="button" className="pdf-button ml-auto rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
            ▣　View PDF
          </button>
        </div>

        <div className="report-table overflow-x-auto px-5">
          <div className="report-header grid min-w-[520px] grid-cols-[1fr_140px] bg-[#edf2f6] px-4 py-2.5 text-xs text-slate-700">
            <b>Month ↓</b>
            <b className="text-right">Amount</b>
          </div>
          <div className="report-empty flex min-h-[140px] min-w-[520px] items-center justify-center border-t border-slate-100 px-4 py-3 text-xs text-slate-500">
            No data available
          </div>
        </div>

        <footer className="report-footer flex justify-between px-5 py-4 text-xs text-slate-700">
          <span>1-0 of 0</span>
          <span>‹　<b>1</b>　›</span>
        </footer>
      </section>
    </div>
  )
}

export default PurchasePage
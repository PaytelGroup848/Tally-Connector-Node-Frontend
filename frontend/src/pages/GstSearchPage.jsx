function GstSearchPage() {
  return <div className="page-surface gst-page">
    <h1 className="flex h-9 items-center border-b border-slate-200 bg-white px-4 text-base font-semibold">Search GSTIN</h1>
    <section className="mx-5 mt-2 flex min-h-[77px] flex-wrap items-center justify-between gap-5 rounded-lg border-0 bg-white px-5 py-3 shadow-none">
      <div><h2 className="text-sm font-semibold">Find Reputed Businesses</h2><p className="mt-1 text-xs text-slate-500">Verify GST Number and get business details instantly</p></div>
      <label className="flex w-[min(100%,300px)] flex-wrap justify-end"><span className="flex h-9 w-full"><input className="min-w-0 flex-1 rounded-l-md border border-slate-300 px-3 text-xs outline-none focus:border-slate-400 focus:ring-0" placeholder="Enter GST Number / Party Name" /><button className="w-[72px] rounded-r-md bg-[#92908f] text-xs font-semibold text-white" type="button">Search</button></span><small className="mt-1 text-xs text-slate-500">Format: 22AAAAA0000A1Z5 (15 Digits)</small></label>
    </section>
    <h2 className="mx-5 mt-2 text-sm font-semibold">Past Searches</h2>
    <section className="mx-5 mt-2 min-h-[164px] overflow-hidden rounded-lg border-0 bg-white p-5 shadow-none">
      <div className="mb-3 text-xs text-slate-700">Rows per page: 10　⌄</div>
      <div className="grid grid-cols-3 border-y border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold"><b>Ledger Name</b><b className="text-center">GSTIN</b><b className="text-right">Date</b></div>
      <div className="py-3 text-center text-xs text-slate-500">No data available</div>
      <footer className="flex justify-between pt-2 text-xs"><span>1-0 of 0</span><span className="text-slate-300">‹　›</span></footer>
    </section>
  </div>
}

export default GstSearchPage

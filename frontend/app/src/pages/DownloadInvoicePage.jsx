function DownloadInvoicePage() {
  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef1f1] p-4 md:p-5">
      <div className="rounded-[10px] border border-slate-200 bg-[#f4f4f4] p-4 shadow-sm md:p-5">
        <div className="mb-5 flex items-center justify-between gap-3">
          <button type="button" aria-label="Go back" className="flex items-center gap-3 text-[22px] font-medium text-slate-800 hover:text-slate-900">
            <span>←</span>
            <span className="text-[22px] font-bold">Download Livekeeping Invoice</span>
          </button>
        </div>

        <div className="rounded-[10px] border border-slate-200 bg-[#eff1f3] p-0">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 text-[14px] text-slate-700">
            <span>Rows per page: 10</span>
            <span className="text-slate-500">▾</span>
          </div>

          <div className="overflow-hidden">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-[#e5e8eb] text-[14px] font-semibold text-slate-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-[14px] text-slate-500">
                    No data available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 text-[14px] text-slate-600">
            <span>1-0 of 0</span>
            <div className="flex items-center gap-2">
              <button type="button" aria-label="Previous" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-100">‹</button>
              <button type="button" aria-label="Next" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-600 hover:bg-slate-100">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DownloadInvoicePage

export default function DayBookPagination({
  totalItems,
  recordStart,
  recordEnd,
  page,
  setPage,
  pageItems,
  isLoading,
  totalPages,
}) {
  return (
    <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 px-6 py-4">
      <span className="text-xs text-slate-600">
        {totalItems > 0
          ? `${recordStart}-${recordEnd} of ${totalItems}`
          : 'NA-NA of NA'}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={isLoading || page <= 1}
          onClick={() =>
            setPage((currentPage) => Math.max(1, currentPage - 1))
          }
          className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {pageItems.map((pageNumber, index) =>
          pageNumber === '...' ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-sm text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              disabled={isLoading}
              onClick={() => setPage(pageNumber)}
              className={
                pageNumber === page
                  ? 'h-9 w-9 rounded-md border border-emerald-600 bg-emerald-600 text-sm font-semibold text-white'
                  : 'h-9 w-9 rounded-md border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50'
              }
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={isLoading || page >= totalPages}
          onClick={() =>
            setPage((currentPage) => Math.min(totalPages, currentPage + 1))
          }
          className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </footer>
  )
}

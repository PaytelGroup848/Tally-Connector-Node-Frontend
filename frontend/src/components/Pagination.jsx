function getPageItems(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
  if (page >= totalPages - 3) {
    return [
      1,
      "...",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [1, "...", page - 1, page, page + 1, "...", totalPages];
}

export default function Pagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  isLoading = false,
  onPageChange,
}) {
  const safeTotalPages = Math.max(1, Number(totalPages) || 1);
  const pageItems = getPageItems(page, safeTotalPages);
  const recordStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0;
  const recordEnd =
    totalItems > 0 ? Math.min(page * pageSize, totalItems) : 0;

  return (
    <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 px-6 py-4">
      <span className="text-xs text-slate-600">
        {totalItems > 0
          ? `${recordStart}-${recordEnd} of ${totalItems}`
          : `Page ${page} of ${safeTotalPages}`}
      </span>

      <nav aria-label="Pagination" className="flex items-center gap-2">
        <button
          type="button"
          disabled={isLoading || page <= 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
          className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {pageItems.map((pageNumber, index) =>
          pageNumber === "..." ? (
            <span
              key={`ellipsis-${index}`}
              aria-hidden="true"
              className="px-1 text-sm text-slate-400"
            >
              ...
            </span>
          ) : (
            <button
              key={pageNumber}
              type="button"
              aria-current={pageNumber === page ? "page" : undefined}
              disabled={isLoading}
              onClick={() => onPageChange(pageNumber)}
              className={
                pageNumber === page
                  ? "h-9 w-9 rounded-md border border-emerald-600 bg-emerald-600 text-sm font-semibold text-white disabled:opacity-60"
                  : "h-9 w-9 rounded-md border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              {pageNumber}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={isLoading || page >= safeTotalPages}
          onClick={() =>
            onPageChange(Math.min(safeTotalPages, page + 1))
          }
          className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </nav>
    </footer>
  );
}

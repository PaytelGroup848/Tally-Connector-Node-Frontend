export default function PartiesPagination({
  pageItems,
  currentPage,
  totalPages,
  loading,
  onPageChange,
}) {
  return (
    <div className="flex min-h-[50px] items-center justify-center border-t border-slate-100 bg-[#f5f8fa] px-3 py-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {pageItems.map((item, index) =>
          item === "..." ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-8 min-w-8 items-center justify-center px-1 text-xs text-slate-500"
            >
              ...
            </span>
          ) : (
            <button
              key={item}
              type="button"
              disabled={totalPages <= 1 || loading}
              onClick={() => onPageChange(item)}
              className={`flex h-8 min-w-9 items-center justify-center rounded-md border px-2 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${
                currentPage === item
                  ? "border-emerald-600 bg-emerald-600 text-white"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ),
        )}
      </div>
    </div>
  );
}

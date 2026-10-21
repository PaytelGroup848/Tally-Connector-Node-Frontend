export default function EntryListPagination({
  itemCount,
  currentPage,
  setCurrentPage,
}) {
  return (
    <footer
      className="
        flex
        items-center
        justify-between
        pt-4
        text-xs
        text-slate-600
      "
    >
      <span>
        {itemCount
          ? `${itemCount} item${itemCount > 1 ? "s" : ""}`
          : "1-0 of 0"}
      </span>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() =>
            setCurrentPage((page) => Math.max(1, page - 1))
          }
          disabled={currentPage === 1}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded
            border
            border-slate-200
            bg-white
            text-lg
            text-slate-600
            transition
            hover:bg-slate-50
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
          aria-label="Previous page"
        >
          ‹
        </button>

        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          className="
            flex
            h-8
            min-w-8
            items-center
            justify-center
            rounded
            bg-sky-600
            px-3
            py-1.5
            font-semibold
            text-white
          "
        >
          {currentPage}
        </button>

        <button
          type="button"
          onClick={() => setCurrentPage((page) => page + 1)}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded
            border
            border-slate-200
            bg-white
            text-lg
            text-slate-600
            transition
            hover:bg-slate-50
          "
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </footer>
  );
}

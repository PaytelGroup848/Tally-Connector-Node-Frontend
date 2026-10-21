function getColumnsClass(columnCount) {
  if (columnCount === 3) return "grid-cols-3";
  if (columnCount === 4) return "grid-cols-4";
  if (columnCount === 5) return "grid-cols-5";
  if (columnCount === 8) return "grid-cols-8";
  return "grid-cols-9";
}

export default function EntryListTable({ columns, rows }) {
  const columnsClass = getColumnsClass(columns.length);

  return (
    <>
      <div
        className={`
          grid
          min-w-[640px]
          ${columnsClass}
          border-y
          border-slate-200
          bg-slate-100
          px-4
          py-2
          text-xs
          font-semibold
          text-slate-800
        `}
      >
        {columns.map((column) => (
          <b key={column}>{column}</b>
        ))}
      </div>

      {rows.length ? (
        rows.map((row, rowIndex) => (
          <div
            className={`
              grid
              min-w-[640px]
              ${columnsClass}
              border-b
              border-slate-100
              px-4
              py-3
              text-xs
              text-slate-700
              transition
              hover:bg-slate-50
            `}
            key={`${row.join("-")}-${rowIndex}`}
          >
            {row.map((value, index) => (
              <span key={`${value}-${index}`}>{value}</span>
            ))}
          </div>
        ))
      ) : (
        <div
          className="
            min-w-[640px]
            border-b
            border-slate-100
            py-8
            text-center
            text-xs
            text-slate-500
          "
        >
          No data available
        </div>
      )}
    </>
  );
}

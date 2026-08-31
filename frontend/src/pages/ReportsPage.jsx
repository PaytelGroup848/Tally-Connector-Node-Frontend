import { useState } from 'react'

const initialGroups = [
  {
    title: 'Accounting Reports',
    items: [
      'Day Book',
      'Expenses',
      'Inactive Customers',
      'Inactive Items',
      'Ledger Report',
    ],
  },
  {
    title: 'My Entries',
    items: [
      'My Vouchers',
      'My Quotations',
      'My eWay Bills',
    ],
  },
]

const salesReports = [
  'By Month',
  'By Bills',
  'By Ledger',
  'By Stock Item',
  'By Voucher Type',
  'By Ledger Group',
  'By Stock Group',
  'By Stock Category',
]

const stockReports = [
  'In Stock',
  'Not In Stock',
  'Negative Stock',
]

// ============================================================
// REPORT GROUP
// ============================================================

function ReportGroup({
  title,
  items,
  favorites,
  onToggleFavorite,
  search,
}) {
  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(search.toLowerCase())
  )

  if (filteredItems.length === 0) {
    return null
  }

  return (
    <section className="report-group mb-6">
      <h2 className="mb-2 flex items-center text-[15px] font-semibold text-slate-800">
        <span className="mr-2 text-[14px] text-slate-500">
          ▧
        </span>

        {title}
      </h2>

      <div className="flex flex-col">
        {filteredItems.map((item) => {
          const isFavorite = favorites.includes(item)

          return (
            <div
              key={item}
              className="
                flex
                min-h-[34px]
                items-center
                border-b
                border-slate-100
                px-2
                hover:bg-slate-50
              "
            >
              {/* FAVORITE BUTTON */}

              <button
                type="button"
                onClick={() =>
                  onToggleFavorite(item)
                }
                className="
                  mr-2
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  text-[16px]
                  transition
                  hover:scale-110
                "
                title={
                  isFavorite
                    ? 'Remove from favorites'
                    : 'Add to favorites'
                }
                aria-label={
                  isFavorite
                    ? `Remove ${item} from favorites`
                    : `Add ${item} to favorites`
                }
              >
                <span
                  className={
                    isFavorite
                      ? 'text-yellow-500'
                      : 'text-slate-300'
                  }
                >
                  {isFavorite ? '★' : '☆'}
                </span>
              </button>

              {/* REPORT */}

              <a
                href="#report"
                className="
                  flex-1
                  text-[13px]
                  text-slate-700
                  hover:text-blue-600
                "
              >
                {item}
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ============================================================
// REPORTS PAGE
// ============================================================

function ReportsPage() {
  const [favorites, setFavorites] = useState([
    'My Vouchers',
    'Ledger Report',
    'Balance Sheet',
    'Day Book',
  ])

  const [search, setSearch] = useState('')

  // ==========================================================
  // TOGGLE FAVORITE
  // ==========================================================

  const toggleFavorite = (reportName) => {
    setFavorites((currentFavorites) => {
      if (currentFavorites.includes(reportName)) {
        return currentFavorites.filter(
          (item) => item !== reportName
        )
      }

      return [
        ...currentFavorites,
        reportName,
      ]
    })
  }

  return (
    <div className="min-h-screen bg-[#eef3f8] px-4 py-4 text-slate-900">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md bg-white px-5 py-4 shadow-sm">

        <h1 className="text-[20px] font-semibold text-slate-900">
          Reports
        </h1>

        {/* SEARCH */}

        <label className="
          flex
          h-[36px]
          w-[240px]
          items-center
          gap-2
          rounded-md
          border
          border-slate-300
          bg-white
          px-3
          text-slate-400
        ">
          <span className="text-[15px]">
            ⌕
          </span>

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search"
            className="
              w-full
              bg-transparent
              text-[13px]
              text-slate-700
              outline-none
              placeholder:text-slate-400
            "
          />
        </label>

      </header>

      {/* ====================================================== */}
      {/* MAIN COLUMNS */}
      {/* ====================================================== */}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* ==================================================== */}
        {/* LEFT COLUMN */}
        {/* ==================================================== */}

        <div>

          {/* FAVORITES */}

          {favorites
            .filter((item) =>
              item
                .toLowerCase()
                .includes(search.toLowerCase())
            )
            .length > 0 && (
            <section className="mb-6 rounded-md bg-white p-4 shadow-sm">

              <h2 className="mb-2 flex items-center text-[15px] font-semibold text-slate-800">
                <span className="mr-2 text-yellow-500">
                  ★
                </span>

                Favorites
              </h2>

              <div className="flex flex-col">

                {favorites
                  .filter((item) =>
                    item
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  )
                  .map((item) => (
                    <div
                      key={item}
                      className="
                        flex
                        min-h-[34px]
                        items-center
                        border-b
                        border-slate-100
                        px-2
                        hover:bg-slate-50
                      "
                    >

                      {/* REMOVE FROM FAVORITES */}

                      <button
                        type="button"
                        onClick={() =>
                          toggleFavorite(item)
                        }
                        className="
                          mr-2
                          flex
                          h-6
                          w-6
                          items-center
                          justify-center
                          text-yellow-500
                          transition
                          hover:scale-110
                        "
                        title="Remove from favorites"
                        aria-label={`Remove ${item} from favorites`}
                      >
                        ★
                      </button>

                      <a
                        href="#report"
                        className="
                          flex-1
                          text-[13px]
                          text-slate-700
                          hover:text-blue-600
                        "
                      >
                        {item}
                      </a>

                    </div>
                  ))}

              </div>
            </section>
          )}

          {/* ACCOUNTING REPORTS */}

          <section className="rounded-md bg-white p-4 shadow-sm">

            <ReportGroup
              title="Accounting Reports"
              items={initialGroups[0].items}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              search={search}
            />

            {/* MY ENTRIES */}

            <ReportGroup
              title="My Entries"
              items={initialGroups[1].items}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              search={search}
            />

          </section>

        </div>

        {/* ==================================================== */}
        {/* RIGHT COLUMN */}
        {/* ==================================================== */}

        <div className="rounded-md bg-white p-4 shadow-sm">

          {/* SALES OVERVIEW */}

          <ReportGroup
            title="Sales Overview"
            items={salesReports}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            search={search}
          />

          {/* STOCK REPORTS */}

          <ReportGroup
            title="Stock Reports"
            items={stockReports}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            search={search}
          />

        </div>

      </div>

    </div>
  )
}

export default ReportsPage  
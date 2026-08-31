import { useMemo, useState } from 'react'

function InactiveStocksPage() {
  const [search, setSearch] = useState('')
  const [selectedDays, setSelectedDays] = useState('30 Days')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMore, setShowMore] = useState(false)

  const items = [
    {
      name: 'PVC 1" 25MM (2 W.T) DELUXE IVORY GOLD',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'Promotional Discount',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'Primeseal',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'Paint Primer',
      lastSaleDate: '',
      quantity: '-175 litres',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC3/4"20*1.5MPCVPIPE MARUTHI GOLD',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC 3/4" 19MM (2 W.T) DELIVORY GOLD',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC 3/4" 19MM (1.5WT) SPLIVORY PIPE',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC 3/4" 19MM (1.2 W.T) SUP IVORY GOLD',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC 1" 25MM (2 W.T) DELIVORY GOLD',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC 1" 25MM (1.2 WT) SUP IVORY GOLD',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },

    // Additional sample items for pagination
    {
      name: 'PVC 1/2" PIPE',
      lastSaleDate: '12 Jan 2024',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC ELBOW 1"',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC TEE 1"',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'UPVC PIPE 2"',
      lastSaleDate: '20 Nov 2023',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC SOCKET',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'WATER TAP',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC COUPLER',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC REDUCER',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC NIPPLE',
      lastSaleDate: '18 Sep 2023',
      quantity: '-',
      amount: '₹ 0.00',
    },
    {
      name: 'PVC UNION',
      lastSaleDate: '',
      quantity: '-',
      amount: '₹ 0.00',
    },
  ]

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase()),
    )
  }, [search])

  /*
   * Screenshot shows:
   * Total Items = 453
   *
   * The sample array above is only used to build the UI.
   * The real 453 items can later come from Tally/API.
   */
  const totalItems = 453

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / rowsPerPage),
  )

  const safePage = Math.min(currentPage, totalPages)

  const startIndex = (safePage - 1) * rowsPerPage

  /*
   * Show local sample rows for the visible page.
   * Real data can replace this later.
   */
  const visibleItems = filteredItems.slice(
    startIndex % Math.max(filteredItems.length, 1),
    (startIndex % Math.max(filteredItems.length, 1)) + rowsPerPage,
  )

  const displayStart =
    filteredItems.length === 0
      ? 0
      : startIndex + 1

  const displayEnd =
    filteredItems.length === 0
      ? 0
      : Math.min(
          startIndex + rowsPerPage,
          totalItems,
        )

  const goToPage = (page) => {
    const nextPage = Math.max(
      1,
      Math.min(page, totalPages),
    )

    setCurrentPage(nextPage)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setCurrentPage(1)
  }

  const handleRowsChange = (event) => {
    setRowsPerPage(Number(event.target.value))
    setCurrentPage(1)
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <div className="border-b border-slate-200 bg-white">

        <div className="flex min-h-[80px] items-center justify-between px-4 py-3">

          {/* LEFT */}
          <div className="flex items-start gap-4">

            <button
              type="button"
              aria-label="Go back"
              onClick={() => window.history.back()}
              className="mt-0 text-[29px] font-light leading-none text-slate-900"
            >
              ←
            </button>

            <div>
              <h1 className="text-[17px] font-semibold leading-5 text-slate-900">
                Inactive Items:
              </h1>

              <div className="mt-2 text-[13px] leading-5 text-slate-900">
                <div>
                  Items:
                  <strong className="font-semibold">
                    453
                  </strong>
                </div>

                <div>
                  of Total Items:
                  <strong className="font-semibold">
                    100 %
                  </strong>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-0">

            <div className="flex items-center overflow-hidden rounded-md bg-slate-100">

              {/* 30 DAYS */}
              <button
                type="button"
                onClick={() => setSelectedDays('30 Days')}
                className={`h-9 px-4 text-[12px] ${
                  selectedDays === '30 Days'
                    ? 'rounded-md border border-slate-900 bg-white font-medium text-slate-900'
                    : 'text-slate-800'
                }`}
              >
                30 Days
              </button>

              {/* 60 DAYS */}
              <button
                type="button"
                onClick={() => setSelectedDays('60 Days')}
                className={`h-9 px-4 text-[12px] ${
                  selectedDays === '60 Days'
                    ? 'rounded-md border border-slate-900 bg-white font-medium text-slate-900'
                    : 'text-slate-800'
                }`}
              >
                60 Days
              </button>

              {/* 90 DAYS */}
              <button
                type="button"
                onClick={() => setSelectedDays('90 Days')}
                className={`h-9 px-4 text-[12px] ${
                  selectedDays === '90 Days'
                    ? 'rounded-md border border-slate-900 bg-white font-medium text-slate-900'
                    : 'text-slate-800'
                }`}
              >
                90 Days
              </button>

              {/* MORE */}
              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setShowMore((current) => !current)
                  }
                  className={`flex h-9 items-center gap-1 px-4 text-[12px] ${
                    showMore
                      ? 'bg-white font-medium'
                      : 'text-slate-800'
                  }`}
                >
                  More
                  <span className="text-[14px]">
                    ⌄
                  </span>
                </button>

                {showMore && (
                  <div className="absolute right-0 top-[42px] z-30 w-32 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">

                    {[
                      '120 Days',
                      '180 Days',
                      '365 Days',
                    ].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => {
                          setSelectedDays(days)
                          setShowMore(false)
                        }}
                        className="block w-full px-3 py-2 text-left text-xs text-slate-700 hover:bg-slate-100"
                      >
                        {days}
                      </button>
                    ))}

                  </div>
                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section className="mx-2 mt-2 overflow-hidden rounded-lg border border-white bg-white">

        {/* TOOLBAR */}
        <div className="flex min-h-[66px] items-center justify-between px-5 py-3">

          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <label className="flex h-8 w-[200px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3">

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-slate-400"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                />
                <path d="m20 20-3.5-3.5" />
              </svg>

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search"
                className="w-full bg-transparent text-[12px] text-slate-700 outline-none placeholder:text-slate-400"
              />

            </label>

            {/* ROWS PER PAGE */}
            <div className="flex items-center gap-2 text-[12px] text-slate-700">

              <span>
                Rows per page:
              </span>

              <select
                value={rowsPerPage}
                onChange={handleRowsChange}
                className="border-0 bg-transparent text-[12px] font-medium outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>

              <span className="text-[10px]">
                ▾
              </span>

            </div>

          </div>

          {/* VIEW PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-[12px] font-medium text-slate-800 hover:bg-slate-50"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#d72828] text-[7px] font-bold text-white">
              PDF
            </span>

            View PDF
          </button>

        </div>

        {/* ===================================================
            TABLE
        =================================================== */}
        <div className="mx-5 overflow-x-auto">

          {/* HEADER */}
          <div className="grid min-w-[900px] grid-cols-[2.25fr_1fr_1fr_1fr] border-y border-slate-300 bg-[#edf2f6] px-4 py-2.5 text-[12px] font-semibold text-slate-800">

            <div>
              Item Name
            </div>

            <div>
              Last Sale Date
            </div>

            <div>
              Quantity
            </div>

            <div>
              Amount
            </div>

          </div>

          {/* ROWS */}
          <div className="min-w-[900px]">

            {visibleItems.length > 0 ? (
              visibleItems.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="grid min-h-[34px] grid-cols-[2.25fr_1fr_1fr_1fr] items-center border-b border-slate-200 bg-[#fbfbfb] px-4 text-[11px] text-slate-800"
                >

                  {/* ITEM NAME */}
                  <div>
                    <button
                      type="button"
                      className="text-left text-[#0068c9] hover:underline"
                      onClick={() =>
                        console.log(
                          'Item:',
                          item.name,
                        )
                      }
                    >
                      {item.name}
                    </button>
                  </div>

                  {/* LAST SALE DATE */}
                  <div>
                    {item.lastSaleDate}
                  </div>

                  {/* QUANTITY */}
                  <div>
                    {item.quantity}
                  </div>

                  {/* AMOUNT */}
                  <div>
                    {item.amount}
                  </div>

                </div>
              ))
            ) : (
              <div className="flex min-h-[160px] items-center justify-center text-sm text-slate-500">
                No inactive items found.
              </div>
            )}

          </div>

        </div>

        {/* ===================================================
            FOOTER
        =================================================== */}
        <div className="flex min-h-[52px] items-center justify-between px-5 text-[12px] text-slate-800">

          {/* COUNT */}
          <span>
            {filteredItems.length === 0
              ? '0-0 of 0'
              : `${displayStart}-${displayEnd} of ${totalItems}`}
          </span>

          {/* PAGINATION */}
          <div className="flex items-center gap-1">

            {/* PREVIOUS */}
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => goToPage(safePage - 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border ${
                safePage === 1
                  ? 'border-slate-100 text-slate-300'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ‹
            </button>

            {/* PAGE 1 */}
            <button
              type="button"
              onClick={() => goToPage(1)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-[12px] ${
                safePage === 1
                  ? 'bg-[#1688bd] text-white'
                  : 'border border-slate-200 bg-white text-slate-700'
              }`}
            >
              1
            </button>

            {/* PAGE 2 */}
            {totalPages >= 2 && (
              <button
                type="button"
                onClick={() => goToPage(2)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[12px] ${
                  safePage === 2
                    ? 'bg-[#1688bd] text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                2
              </button>
            )}

            {/* PAGE 3 */}
            {totalPages >= 3 && (
              <button
                type="button"
                onClick={() => goToPage(3)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[12px] ${
                  safePage === 3
                    ? 'bg-[#1688bd] text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                3
              </button>
            )}

            {/* PAGE 4 */}
            {totalPages >= 4 && (
              <button
                type="button"
                onClick={() => goToPage(4)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[12px] ${
                  safePage === 4
                    ? 'bg-[#1688bd] text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                4
              </button>
            )}

            {/* DOTS */}
            {totalPages > 5 && (
              <span className="flex h-8 w-8 items-center justify-center text-slate-500">
                ...
              </span>
            )}

            {/* LAST PAGE */}
            {totalPages > 5 && (
              <button
                type="button"
                onClick={() => goToPage(totalPages)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[12px] ${
                  safePage === totalPages
                    ? 'bg-[#1688bd] text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                {totalPages}
              </button>
            )}

            {/* NEXT */}
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() => goToPage(safePage + 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border text-[16px] ${
                safePage === totalPages
                  ? 'border-slate-100 text-slate-300'
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              ›
            </button>

          </div>
        </div>

      </section>
    </div>
  )
}

export default InactiveStocksPage
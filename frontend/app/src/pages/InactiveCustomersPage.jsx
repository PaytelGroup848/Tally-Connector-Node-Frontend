import { useMemo, useState } from 'react'

function InactiveCustomersPage() {
  const [search, setSearch] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('All Groups')
  const [selectedDays, setSelectedDays] = useState('30 Days')
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)
  const [showMore, setShowMore] = useState(false)

  const customers = [
    {
      name: '3SIGMA ASSOCIATES',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'A AND D ENTERPRICES',
      lastSalesDate: '29 Dec 2023',
      group: 'All Groups',
    },
    {
      name: 'A G ISPATS',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'A K MOHAIDEEN ABDULLAH',
      lastSalesDate: '08 May 2023',
      group: 'All Groups',
    },
    {
      name: 'A R Lashings',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'A R TRADERS',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'A UNI OR USHAKUMARI',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'A-One Hardware Stores',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'A.M. Daniel Enterprises',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'A.MAHESH',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'AARON TRADERS',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'ABHISHEK ENTERPRISES',
      lastSalesDate: '14 Feb 2023',
      group: 'All Groups',
    },
    {
      name: 'ABC DISTRIBUTORS',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'ABC HARDWARE',
      lastSalesDate: '22 Jan 2023',
      group: 'All Groups',
    },
    {
      name: 'ACME TRADERS',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'ADARSH ENTERPRISES',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'AJAY ASSOCIATES',
      lastSalesDate: '05 Dec 2022',
      group: 'All Groups',
    },
    {
      name: 'ALPHA SERVICES',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'AMIT TRADERS',
      lastSalesDate: '',
      group: 'All Groups',
    },
    {
      name: 'ANAND STORES',
      lastSalesDate: '10 Oct 2022',
      group: 'All Groups',
    },
  ]

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch = customer.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesGroup =
        selectedGroup === 'All Groups' ||
        customer.group === selectedGroup

      return matchesSearch && matchesGroup
    })
  }, [search, selectedGroup])

  const totalCustomers = filteredCustomers.length
  const totalPages = Math.max(
    1,
    Math.ceil(totalCustomers / rowsPerPage),
  )

  const safePage = Math.min(currentPage, totalPages)

  const startIndex = (safePage - 1) * rowsPerPage
  const endIndex = Math.min(
    startIndex + rowsPerPage,
    totalCustomers,
  )

  const visibleCustomers = filteredCustomers.slice(
    startIndex,
    endIndex,
  )

  const goToPage = (page) => {
    const nextPage = Math.max(
      1,
      Math.min(page, totalPages),
    )

    setCurrentPage(nextPage)
  }

  const handleRowsChange = (event) => {
    const value = Number(event.target.value)

    setRowsPerPage(value)
    setCurrentPage(1)
  }

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setCurrentPage(1)
  }

  const handleGroupChange = (event) => {
    setSelectedGroup(event.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}
      <div className="border-b border-slate-200 bg-white">

        <div className="flex min-h-[82px] items-center justify-between gap-4 px-4 py-3">

          {/* LEFT SIDE */}
          <div className="flex items-start gap-4">

            <button
              type="button"
              aria-label="Go back"
              onClick={() => window.history.back()}
              className="mt-1 text-[29px] font-light leading-none text-slate-800 transition hover:text-black"
            >
              ←
            </button>

            <div>
              <h1 className="text-[17px] font-semibold leading-5 text-slate-900">
                Inactive Customers:
              </h1>

              <div className="mt-2 text-[13px] leading-5 text-slate-900">
                <div>
                  Customers:
                  <strong className="font-semibold">
                    772
                  </strong>
                </div>

                <div>
                  of Total Customers:
                  <strong className="font-semibold">
                    100 %
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-2">

            {/* GROUP */}
            <select
              value={selectedGroup}
              onChange={handleGroupChange}
              className="h-9 min-w-[138px] rounded-md border border-slate-300 bg-white px-3 text-[12px] text-slate-800 outline-none focus:border-slate-500"
            >
              <option>All Groups</option>
              <option>Retail Customers</option>
              <option>Wholesale Customers</option>
              <option>Other Customers</option>
            </select>

            {/* DAYS */}
            <div className="flex items-center overflow-hidden rounded-md border border-slate-300 bg-slate-100">

              {['30 Days', '60 Days', '90 Days'].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setSelectedDays(days)}
                  className={`h-9 px-4 text-[12px] ${
                    selectedDays === days
                      ? 'bg-white font-medium text-slate-900 shadow-sm'
                      : 'bg-transparent text-slate-800'
                  }`}
                >
                  {days}
                </button>
              ))}

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
                      : 'bg-transparent'
                  }`}
                >
                  More
                  <span className="text-[14px]">
                    ⌄
                  </span>
                </button>

                {showMore && (
                  <div className="absolute right-0 top-[42px] z-30 w-32 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg">
                    {['120 Days', '180 Days', '365 Days'].map(
                      (days) => (
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
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CARD
      ===================================================== */}
      <section className="mx-5 mt-2.5 overflow-hidden rounded-lg border border-white bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">

        {/* ===================================================
            TOOLBAR
        =================================================== */}
        <div className="flex min-h-[67px] items-center justify-between gap-3 px-5 py-3">

          {/* SEARCH + ROWS */}
          <div className="flex items-center gap-4">

            {/* SEARCH */}
            <label className="flex h-8 w-[200px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400">

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
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

            {/* ROWS */}
            <div className="flex items-center gap-2 text-[12px] text-slate-700">
              <span>Rows per page:</span>

              <select
                value={rowsPerPage}
                onChange={handleRowsChange}
                className="border-0 bg-transparent pr-5 text-[12px] font-medium text-slate-700 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={30}>30</option>
              </select>
            </div>

          </div>

          {/* PDF BUTTON */}
          <button
            type="button"
            onClick={() => window.print()}
            className="flex h-9 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-[12px] font-medium text-slate-800 transition hover:bg-slate-50"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[#d72626] text-[8px] font-bold text-white">
              PDF
            </span>

            View PDF
          </button>

        </div>

        {/* ===================================================
            TABLE
        =================================================== */}
        <div className="mx-5 overflow-x-auto">

          {/* TABLE HEADER */}
          <div className="grid min-w-[700px] grid-cols-[1.45fr_1fr] border-y border-slate-300 bg-[#edf2f6] px-4 py-2.5 text-[12px] font-semibold text-slate-800">

            <div>
              Name
            </div>

            <div>
              Last Sales Date
            </div>

          </div>

          {/* TABLE ROWS */}
          <div className="min-w-[700px]">

            {visibleCustomers.length > 0 ? (
              visibleCustomers.map((customer, index) => (
                <div
                  key={`${customer.name}-${index}`}
                  className="grid grid-cols-[1.45fr_1fr] min-h-[34px] items-center border-b border-slate-200 bg-[#fbfbfb] px-4 text-[11px] text-slate-800 even:bg-white"
                >
                  <div>
                    <button
                      type="button"
                      className="text-left text-[#0068c9] hover:underline"
                      onClick={() =>
                        console.log(
                          'Customer:',
                          customer.name,
                        )
                      }
                    >
                      {customer.name}
                    </button>
                  </div>

                  <div>
                    {customer.lastSalesDate}
                  </div>
                </div>
              ))
            ) : (
              <div className="flex min-h-[160px] items-center justify-center text-sm text-slate-500">
                No inactive customers found.
              </div>
            )}

          </div>
        </div>

        {/* ===================================================
            FOOTER / PAGINATION
        =================================================== */}
        <div className="flex min-h-[52px] items-center justify-between px-5 text-[12px] text-slate-700">

          {/* COUNT */}
          <span>
            {totalCustomers === 0
              ? '0-0 of 0'
              : `${startIndex + 1}-${endIndex} of 772`}
          </span>

          {/* PAGINATION */}
          <div className="flex items-center gap-1">

            {/* PREVIOUS */}
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => goToPage(safePage - 1)}
              className={`flex h-8 w-8 items-center justify-center rounded-md border text-[16px] ${
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
                  ? 'bg-[#1d8bc3] text-white'
                  : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
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
                    ? 'bg-[#1d8bc3] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
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
                    ? 'bg-[#1d8bc3] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
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
                    ? 'bg-[#1d8bc3] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
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

            {/* LAST */}
            {totalPages > 5 && (
              <button
                type="button"
                onClick={() => goToPage(totalPages)}
                className={`flex h-8 w-8 items-center justify-center rounded-md border text-[12px] ${
                  safePage === totalPages
                    ? 'bg-[#1d8bc3] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
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

export default InactiveCustomersPage
import { useState } from 'react'
import DateRangePicker from '../components/DateRangePicker'

const pages = {
  '/tracking-report': [
    'Tracking Report',
    ['Users', 'Email', 'Mobile'],
    [['', '', '+ 917011022899']],
  ],

  '/my-stock-items': [
    'My Stock Items',
    ['Name', 'Date', 'Status', 'Action'],
    [],
  ],

  '/my-ledgers': [
    'My Ledgers',
    ['Name', 'Date', 'Status', 'Action'],
    [],
  ],

  '/my-parties': [
    'My Parties',
    ['Name', 'Date', 'Status', 'Action'],
    [],
  ],

  '/my-invoices': [
    'My Invoices',
    [
      'IRN/ACK No ↑',
      'Name',
      'Date',
      'Invoice No',
      'Amount',
      'Sync Status',
      'eInvoices Status',
      'Download',
    ],
    [],
  ],

  '/my-eway-bill': [
    'My eWay Bills',
    [
      'eWayBillNo',
      'Name',
      'Date',
      'Invoice No',
      'Valid till',
      'Amount',
      'Sync Status',
      'eWay Status',
      'Download',
    ],
    [],
  ],

  '/my-quotations': [
    'My Quotations',
    ['Name', 'Date', 'Quotation', 'Amount', 'Action'],
    [],
  ],
}

function MyEntryListPage({ path }) {
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] =
    useState('2026-04-01')
  const [endDate, setEndDate] =
    useState('2027-03-31')

  const [selectedTab, setSelectedTab] =
    useState('All')

  const [currentPage, setCurrentPage] =
    useState(1)

  const [showMore, setShowMore] =
    useState(false)

  const [title, columns, rows] =
    pages[path] || pages['/tracking-report']

  const invoiceTabs =
    title === 'My Invoices' ||
    title === 'My eWay Bills'

  const isTracking =
    title === 'Tracking Report'

  const hasStatusFilters =
    !isTracking &&
    title !== 'My Quotations'

  const columnsClass =
    columns.length === 3
      ? 'grid-cols-3'
      : columns.length === 4
      ? 'grid-cols-4'
      : columns.length === 5
      ? 'grid-cols-5'
      : columns.length === 8
      ? 'grid-cols-8'
      : 'grid-cols-9'

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    window.history.back()
  }

  // ==========================================================
  // ADD NEW
  // ==========================================================

  const handleAddNew = () => {
    const routeMap = {
      '/my-stock-items':
        '/my-stock-items/add-new',

      '/my-ledgers':
        '/my-ledgers/add-new',

      '/my-parties':
        '/my-parties/add-new',

      '/my-invoices':
        '/my-invoices/add-new',

      '/my-eway-bill':
        '/my-eway-bill/add-new',

      '/my-quotations':
        '/my-quotations/add-new',
    }

    const nextRoute =
      routeMap[path] || '/items/add-new'

    window.history.pushState(
      {},
      '',
      nextRoute
    )

    window.dispatchEvent(
      new PopStateEvent('popstate')
    )
  }

  // ==========================================================
  // STATUS TABS
  // ==========================================================

  const handleTabClick = (tab) => {
    setSelectedTab(tab)
    setCurrentPage(1)
  }

  // ==========================================================
  // MORE
  // ==========================================================

  const handleMoreClick = () => {
    setShowMore((current) => !current)
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const handlePrevious = () => {
    setCurrentPage((page) =>
      Math.max(1, page - 1)
    )
  }

  const handleNext = () => {
    setCurrentPage((page) =>
      page + 1
    )
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredRows = rows.filter((row) =>
    row.join(' ')
      .toLowerCase()
      .includes(query.toLowerCase())
  )

  // ==========================================================
  // TABS
  // ==========================================================

  const tabs = invoiceTabs
    ? [
        'All',
        'Generated',
        'Cancelled',
        'Rejected',
      ]
    : [
        'All',
        'Pending',
        'Completed',
      ]

  return (
    <div
      className={`page-surface ${
        isTracking
          ? 'tracking-page'
          : 'entry-page'
      }`}
    >

      {/* ==================================================== */}
      {/* TOOLBAR */}
      {/* ==================================================== */}

      <div
        className="
          page-toolbar
          flex
          flex-wrap
          items-center
          gap-3
          border-b
          border-slate-200
          bg-white
          px-4
          py-3
        "
      >

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={handleBack}
          className="
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded
            text-2xl
            leading-none
            text-slate-700
            transition
            hover:bg-slate-100
            hover:text-black
          "
          aria-label="Back"
          title="Back"
        >
          ←
        </button>

        {/* TITLE */}

        <h1 className="text-[18px] font-semibold text-slate-900">
          {title}
        </h1>

        {/* STATUS TABS */}

        <div className="page-tabs ml-auto flex flex-wrap items-center gap-2">

          {hasStatusFilters &&
            tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() =>
                  handleTabClick(tab)
                }
                className={`
                  rounded-md
                  border
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  transition
                  ${
                    selectedTab === tab
                      ? 'border-slate-300 bg-white text-slate-900 shadow-sm'
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                {tab}
              </button>
            ))}

          {/* MORE */}

          {hasStatusFilters && !invoiceTabs && (
            <div className="relative">

              <button
                type="button"
                onClick={handleMoreClick}
                className={`
                  flex
                  items-center
                  gap-1
                  rounded-md
                  border
                  px-3
                  py-1.5
                  text-[11px]
                  font-medium
                  transition
                  ${
                    showMore
                      ? 'border-slate-300 bg-white text-slate-900 shadow-sm'
                      : 'border-slate-200 bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }
                `}
              >
                More
                <span className="text-[10px]">
                  ⌄
                </span>
              </button>

              {showMore && (
                <div
                  className="
                    absolute
                    right-0
                    top-[38px]
                    z-20
                    min-w-[130px]
                    overflow-hidden
                    rounded-md
                    border
                    border-slate-200
                    bg-white
                    shadow-lg
                  "
                >
                  {[
                    'Overdue',
                    'Archived',
                  ].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setSelectedTab(item)
                        setShowMore(false)
                        setCurrentPage(1)
                      }}
                      className="
                        block
                        w-full
                        px-3
                        py-2
                        text-left
                        text-[11px]
                        text-slate-700
                        hover:bg-slate-50
                      "
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}

            </div>
          )}

        </div>

        {/* DATE RANGE */}

        {!isTracking && (
          <DateRangePicker
            startDate={startDate}
            endDate={endDate}
            onChange={(
              nextStart,
              nextEnd
            ) => {
              setStartDate(
                nextStart || startDate
              )

              setEndDate(
                nextEnd || endDate
              )
            }}
            compact
          />
        )}

      </div>

      {/* ==================================================== */}
      {/* MAIN CARD */}
      {/* ==================================================== */}

      <section className="page-card p-5">

        {/* ================================================== */}
        {/* SEARCH + ACTION */}
        {/* ================================================== */}

        <div className="mb-3 flex flex-wrap items-center gap-4">

          {/* SEARCH */}

          <input
            className="
              h-9
              w-[min(100%,220px)]
              rounded-lg
              border
              border-slate-300
              bg-white
              px-3
              text-xs
              outline-none
              focus:border-green-500
            "
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search"
          />

          {/* ROWS */}

          <button
            type="button"
            className="
              text-xs
              text-slate-700
              hover:text-black
            "
            onClick={() =>
              console.log('Rows per page clicked')
            }
          >
            Rows per page: 10　⌄
          </button>

          {/* ADD NEW */}

          {(
            title === 'My Stock Items' ||
            title === 'My Ledgers' ||
            title === 'My Parties' ||
            title === 'My Invoices' ||
            title === 'My eWay Bills' ||
            title === 'My Quotations'
          ) && (
            <button
              className="
                ml-auto
                rounded-lg
                bg-slate-900
                px-4
                py-2
                text-xs
                font-semibold
                text-white
                transition
                hover:bg-slate-700
                active:scale-[0.98]
              "
              type="button"
              onClick={handleAddNew}
            >
              ⊕　Add New
            </button>
          )}

        </div>

        {/* ================================================== */}
        {/* TABLE HEADER */}
        {/* ================================================== */}

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
            <b key={column}>
              {column}
            </b>
          ))}
        </div>

        {/* ================================================== */}
        {/* TABLE BODY */}
        {/* ================================================== */}

        {filteredRows.length ? (

          filteredRows.map((row, rowIndex) => (

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
              key={`${row.join('-')}-${rowIndex}`}
            >

              {row.map(
                (value, index) => (
                  <span
                    key={`${value}-${index}`}
                  >
                    {value}
                  </span>
                )
              )}

            </div>

          ))

        ) : (

          <div className="
            min-w-[640px]
            border-b
            border-slate-100
            py-8
            text-center
            text-xs
            text-slate-500
          ">
            No data available
          </div>

        )}

        {/* ================================================== */}
        {/* FOOTER */}
        {/* ================================================== */}

        <footer className="
          flex
          items-center
          justify-between
          pt-4
          text-xs
          text-slate-600
        ">

          {/* COUNT */}

          <span>
            {filteredRows.length
              ? `${filteredRows.length} item${
                  filteredRows.length > 1
                    ? 's'
                    : ''
                }`
              : '1-0 of 0'}
          </span>

          {/* PAGINATION */}

          <div className="flex items-center gap-1">

            {/* PREVIOUS */}

            <button
              type="button"
              onClick={handlePrevious}
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

            {/* CURRENT PAGE */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(1)
              }
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

            {/* NEXT */}

            <button
              type="button"
              onClick={handleNext}
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

      </section>

    </div>
  )
}

export default MyEntryListPage
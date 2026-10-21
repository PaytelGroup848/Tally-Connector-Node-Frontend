import { useCallback, useState } from 'react'
import DayBookFilters from './dayBook/DayBookFilters'
import DayBookPagination from './dayBook/DayBookPagination'
import DayBookPopup from './dayBook/DayBookPopup'
import DayBookTable from './dayBook/DayBookTable'
import useDayBookData from './dayBook/useDayBookData'
import { formatLabel } from './dayBook/utils'

function DayBookPage({ companyId }) {
  const [selectedPopup, setSelectedPopup] = useState(null)
  const closePopup = useCallback(() => setSelectedPopup(null), [])
  const {
    rows,
    query,
    setQuery,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    isLoading,
    errorMessage,
    fields,
    pageItems,
    recordStart,
    recordEnd,
  } = useDayBookData(companyId)

  const openPopup = (field, value) => {
    setSelectedPopup({
      field,
      label: formatLabel(field),
      value,
    })
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">
      <div className="flex min-h-[64px] items-center justify-between border-b border-slate-200 bg-white px-5">
        <div>
          <span className="block text-xs text-slate-500">Reports</span>
          <h1 className="text-xl font-bold text-slate-900">Day Book</h1>
        </div>
        <span className="text-xs text-slate-500">
          {totalItems > 0 ? `${totalItems} records` : 'NA records'}
        </span>
      </div>

      <section className="mx-5 mt-3 overflow-hidden rounded-lg bg-white shadow-sm">
        <DayBookFilters
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          query={query}
          setQuery={setQuery}
          pageSize={pageSize}
          setPageSize={setPageSize}
        />

        {errorMessage && (
          <div className="mx-5 mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <DayBookTable
          fields={fields}
          rows={rows}
          isLoading={isLoading}
          onOpenPopup={openPopup}
        />

        <DayBookPagination
          totalItems={totalItems}
          recordStart={recordStart}
          recordEnd={recordEnd}
          page={page}
          setPage={setPage}
          pageItems={pageItems}
          isLoading={isLoading}
          totalPages={totalPages}
        />
      </section>

      <DayBookPopup popup={selectedPopup} onClose={closePopup} />
    </div>
  )
}

export default DayBookPage
  
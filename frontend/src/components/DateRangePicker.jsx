import { useMemo } from 'react'

function formatDateValue(dateString) {
  if (!dateString) return ''

  const value = String(dateString).trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value

  const match = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/)
  if (match) {
    const [, year, month, day] = match
    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  const normalized = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return normalized.toISOString().slice(0, 10)
}

function DateRangePicker({
  startDate,
  endDate,
  onChange,
  className = '',
  compact = false,
}) {
  const startValue = useMemo(() => formatDateValue(startDate), [startDate])
  const endValue = useMemo(() => formatDateValue(endDate), [endDate])

  const handleStartChange = (event) => {
    const nextStart = event.target.value
    onChange?.(nextStart, endValue)
  }

  const handleEndChange = (event) => {
    const nextEnd = event.target.value
    onChange?.(startValue, nextEnd)
  }

  return (
    <div className={`flex items-center gap-2 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 shadow-sm ${className}`}>
      <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100" aria-label="Previous date range">
        ‹
      </button>

      <div className={`flex items-center gap-2 ${compact ? 'text-[10px]' : 'text-xs'}`}>
        <input
          type="date"
          value={startValue}
          onChange={handleStartChange}
          className="h-8 rounded border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-green-500"
          aria-label="Start date"
        />
        <span className="text-slate-500">to</span>
        <input
          type="date"
          value={endValue}
          onChange={handleEndChange}
          className="h-8 rounded border border-slate-300 bg-white px-2 text-[11px] text-slate-700 outline-none focus:border-green-500"
          aria-label="End date"
        />
      </div>

      <button type="button" className="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100" aria-label="Next date range">
        ›
      </button>
    </div>
  )
}

export default DateRangePicker

import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Panel from './Panel'
import { formatAmount } from './utils'

const SalesReceiptsPanel = ({ chartData, totalSales, totalReceipts }) => {
  const chartScrollRef = useRef(null)
  const chartTrackRef = useRef(null)
  const chartDragRef = useRef(null)
  const [chartScrollbar, setChartScrollbar] = useState({ left: 0, width: 100 })

  const updateChartScrollbar = () => {
    const chartScroll = chartScrollRef.current
    if (!chartScroll) return

    const maxScroll = chartScroll.scrollWidth - chartScroll.clientWidth
    if (maxScroll <= 0) {
      setChartScrollbar({ left: 0, width: 100 })
      return
    }

    const width = Math.max((chartScroll.clientWidth / chartScroll.scrollWidth) * 100, 12)
    setChartScrollbar({
      left: (chartScroll.scrollLeft / maxScroll) * (100 - width),
      width,
    })
  }

  const handleTrackClick = (event) => {
    const chartScroll = chartScrollRef.current
    const chartTrack = chartTrackRef.current
    if (!chartScroll || !chartTrack || event.target !== chartTrack) return

    const bounds = chartTrack.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    chartScroll.scrollTo({
      left: ratio * (chartScroll.scrollWidth - chartScroll.clientWidth),
      behavior: 'smooth',
    })
  }

  const handleThumbPointerDown = (event) => {
    event.preventDefault()
    chartDragRef.current = {
      startX: event.clientX,
      startScrollLeft: chartScrollRef.current?.scrollLeft || 0,
    }
  }

  const scrollChart = (direction) => {
    const chartScroll = chartScrollRef.current
    if (!chartScroll) return

    chartScroll.scrollBy({
      left: direction * Math.max(chartScroll.clientWidth * 0.8, 180),
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = chartDragRef.current
      const chartScroll = chartScrollRef.current
      const chartTrack = chartTrackRef.current
      if (!drag || !chartScroll || !chartTrack) return

      const maxScroll = chartScroll.scrollWidth - chartScroll.clientWidth
      const thumbWidth = (chartScrollbar.width / 100) * chartTrack.clientWidth
      const trackWidth = Math.max(chartTrack.clientWidth - thumbWidth, 1)
      chartScroll.scrollLeft = drag.startScrollLeft
        + ((event.clientX - drag.startX) / trackWidth) * maxScroll
    }

    const stopDragging = () => {
      chartDragRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
    }
  }, [chartScrollbar.width])

  useEffect(() => {
    const chartScroll = chartScrollRef.current
    if (!chartScroll) return undefined

    updateChartScrollbar()
    chartScroll.addEventListener('scroll', updateChartScrollbar)
    window.addEventListener('resize', updateChartScrollbar)
    return () => {
      chartScroll.removeEventListener('scroll', updateChartScrollbar)
      window.removeEventListener('resize', updateChartScrollbar)
    }
  }, [chartData.length])

  const chartMax = Math.max(
    ...chartData.flatMap((item) => [item.sales, item.receipt]),
    1,
  )
  const chartAxisLabels = [1, 0.8, 0.6, 0.4, 0.2, 0].map((ratio) => {
    const value = chartMax * ratio
    return value >= 1000
      ? formatAmount(value, '\u20B9 0')
      : new Intl.NumberFormat('en-IN').format(Math.round(value))
  })

  return (
    <Panel title="Sales & Receipts">
      <div className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 text-[11px] text-app-text-secondary">
            <span className="h-2.5 w-2.5 rounded-full bg-app-primary" />
            Sales
          </span>
          <span className="inline-flex items-center gap-2 text-[11px] text-app-text-secondary">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-200" />
            Receipts
          </span>
        </div>

        <div className="grid grid-cols-[42px_minmax(0,1fr)] gap-2">
          <div className="flex h-[268px] flex-col justify-between pb-10 text-[10px] text-slate-400">
            {chartAxisLabels.map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
          </div>

          <div
            ref={chartScrollRef}
            className="dashboard-chart-scroll min-w-0 overflow-x-scroll overflow-y-hidden pb-2 touch-pan-x"
          >
            <div
              className="relative h-[268px] min-w-full"
              style={{ minWidth: `${Math.max(chartData.length * 72, 420)}px` }}
            >
              <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#edf2f7_0,#edf2f7_1px,transparent_1px,transparent_20%)]" />
              <div className="relative flex h-full items-end gap-2 pb-12">
                {chartData.map((item) => (
                  <div
                    key={item.day}
                    className="relative flex h-full min-w-[50px] flex-1 items-end justify-center gap-1"
                  >
                    <div
                      className="w-2.5 rounded-t-sm bg-app-primary"
                      style={{ height: `${Math.max((item.sales / chartMax) * 200, item.sales ? 4 : 0)}px` }}
                    />
                    <div
                      className="w-2.5 rounded-t-sm bg-emerald-200"
                      style={{ height: `${Math.max((item.receipt / chartMax) * 200, item.receipt ? 4 : 0)}px` }}
                    />
                    <span className="absolute -bottom-4 left-1/2 w-[54px] -translate-x-1/2 truncate text-center text-[9px] text-slate-400">
                      {item.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            aria-label="Scroll chart left"
            title="Scroll chart left"
            onClick={() => scrollChart(-1)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition hover:bg-slate-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={chartTrackRef}
            onClick={handleTrackClick}
            className="relative h-1 flex-1 cursor-pointer rounded-full bg-slate-100"
            role="scrollbar"
            aria-label="Chart horizontal scroll"
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow={Math.round(chartScrollbar.left)}
          >
            <div
              onPointerDown={handleThumbPointerDown}
              className="absolute top-0 h-full cursor-grab rounded-full bg-slate-400 active:cursor-grabbing"
              style={{ left: `${chartScrollbar.left}%`, width: `${chartScrollbar.width}%` }}
            />
          </div>

          <button
            type="button"
            aria-label="Scroll chart right"
            title="Scroll chart right"
            onClick={() => scrollChart(1)}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500 shadow-sm transition hover:bg-slate-200"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 rounded-lg bg-slate-50">
          <div className="border-r border-app-border-light p-3">
            <p className="text-[10px] font-semibold uppercase text-app-text-secondary">Total Sales</p>
            <p className="mt-1 text-base font-bold text-app-text">{totalSales}</p>
          </div>
          <div className="p-3">
            <p className="text-[10px] font-semibold uppercase text-app-text-secondary">Total Receipts</p>
            <p className="mt-1 text-base font-bold text-app-text">{totalReceipts}</p>
          </div>
        </div>
      </div>
    </Panel>
  )
}

export default SalesReceiptsPanel

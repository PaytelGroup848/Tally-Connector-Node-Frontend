import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const HorizontalScrollTable = ({ children, className = '' }) => {
  const scrollRef = useRef(null)
  const trackRef = useRef(null)
  const dragRef = useRef(null)
  const [scrollbar, setScrollbar] = useState({ left: 0, width: 100 })

  const updateScrollbar = () => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return

    const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth
    if (maxScroll <= 0) {
      setScrollbar({ left: 0, width: 100 })
      return
    }

    const width = Math.max((scrollElement.clientWidth / scrollElement.scrollWidth) * 100, 18)
    setScrollbar({
      left: (scrollElement.scrollLeft / maxScroll) * (100 - width),
      width,
    })
  }

  const scrollBy = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction * Math.max(scrollRef.current.clientWidth * 0.8, 180),
      behavior: 'smooth',
    })
  }

  const handleTrackClick = (event) => {
    const scrollElement = scrollRef.current
    const track = trackRef.current
    if (!scrollElement || !track || event.target !== track) return

    const bounds = track.getBoundingClientRect()
    const ratio = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    scrollElement.scrollTo({
      left: ratio * (scrollElement.scrollWidth - scrollElement.clientWidth),
      behavior: 'smooth',
    })
  }

  const handleThumbPointerDown = (event) => {
    event.preventDefault()
    dragRef.current = {
      startX: event.clientX,
      startScrollLeft: scrollRef.current?.scrollLeft || 0,
    }
  }

  useEffect(() => {
    const handlePointerMove = (event) => {
      const drag = dragRef.current
      const scrollElement = scrollRef.current
      const track = trackRef.current
      if (!drag || !scrollElement || !track) return

      const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth
      const thumbWidth = (scrollbar.width / 100) * track.clientWidth
      const trackWidth = Math.max(track.clientWidth - thumbWidth, 1)
      scrollElement.scrollLeft = drag.startScrollLeft + ((event.clientX - drag.startX) / trackWidth) * maxScroll
    }

    const stopDragging = () => {
      dragRef.current = null
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', stopDragging)
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', stopDragging)
    }
  }, [scrollbar.width])

  useEffect(() => {
    const scrollElement = scrollRef.current
    if (!scrollElement) return undefined

    updateScrollbar()
    scrollElement.addEventListener('scroll', updateScrollbar)
    window.addEventListener('resize', updateScrollbar)
    return () => {
      scrollElement.removeEventListener('scroll', updateScrollbar)
      window.removeEventListener('resize', updateScrollbar)
    }
  }, [])

  return (
    <>
      <div ref={scrollRef} className={`dashboard-table-scroll min-h-[280px] overflow-x-auto ${className}`}>
        {children}
      </div>
      <div className="flex items-center gap-2 px-4 pb-4 pt-3 sm:px-5">
        <button
          type="button"
          aria-label="Scroll table left"
          title="Scroll table left"
          onClick={() => scrollBy(-1)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-400 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-slate-200/80"
          role="scrollbar"
          aria-label="Table horizontal scroll"
          aria-valuemin="0"
          aria-valuemax="100"
          aria-valuenow={Math.round(scrollbar.left)}
        >
          <div
            onPointerDown={handleThumbPointerDown}
            className="absolute top-0 h-full cursor-grab rounded-full bg-[#8fa5c4] active:cursor-grabbing"
            style={{ left: `${scrollbar.left}%`, width: `${scrollbar.width}%` }}
          />
        </div>
        <button
          type="button"
          aria-label="Scroll table right"
          title="Scroll table right"
          onClick={() => scrollBy(1)}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-50 text-slate-400 shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100 hover:text-slate-600"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </>
  )
}

export default HorizontalScrollTable

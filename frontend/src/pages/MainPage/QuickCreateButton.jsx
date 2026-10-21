import { useEffect, useRef, useState } from 'react'

const quickCreateGroups = [
  {
    title: 'Sales',
    items: [
      ['Sales Invoice', '/create-voucher/SalesInvoice'],
      ['Sales Order', '/create-voucher/SalesOrder'],
      ['Credit Note', '/create-voucher/CreditNote'],
      ['Quotation', '/create-voucher/Quotation'],
      ['Receipt', '/create-voucher/Receipt'],
      ['Delivery Note', '/create-voucher/DeliveryNote'],
    ],
  },
  {
    title: 'Purchase',
    items: [
      ['Purchase Invoice', '/create-voucher/PurchaseInvoice'],
      ['Purchase Order', '/create-voucher/PurchaseOrder'],
      ['Debit Note', '/create-voucher/DebitNote'],
      ['Payment', '/create-voucher/Payment'],
      ['Journal', '/create-voucher/Journal'],
      ['Contra', '/create-voucher/Contra'],
      ['Receipt Note', '/create-voucher/ReceiptNote'],
    ],
  },
  {
    title: 'Inventory',
    items: [
      ['Physical Stock', '/create-voucher/PhysicalStock'],
      ['Stock Journal', '/create-voucher/StockJournal'],
    ],
  },
]

function QuickCreateButton({ navigateTo }) {
  const buttonRef = useRef(null)
  const dragRef = useRef({
    dragging: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
    hasMoved: false,
  })
  const [isOpen, setIsOpen] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState(() => ({
    x: typeof window === 'undefined' ? 0 : Math.max(8, window.innerWidth - 78),
    y: typeof window === 'undefined' ? 0 : Math.max(8, window.innerHeight - 78),
  }))

  const handlePointerDown = (event) => {
    const button = buttonRef.current
    if (!button) return

    const rect = button.getBoundingClientRect()
    dragRef.current = {
      dragging: true,
      startX: event.clientX,
      startY: event.clientY,
      startLeft: rect.left,
      startTop: rect.top,
      hasMoved: false,
    }
    setIsDragging(true)

    try {
      button.setPointerCapture(event.pointerId)
    } catch {
      // Ignore pointer capture errors.
    }

    event.preventDefault()
  }

  const handlePointerMove = (event) => {
    const drag = dragRef.current
    if (!drag.dragging) return

    const button = buttonRef.current
    if (!button) return

    const deltaX = event.clientX - drag.startX
    const deltaY = event.clientY - drag.startY
    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      drag.hasMoved = true
    }

    const maxX = Math.max(8, window.innerWidth - button.offsetWidth - 8)
    const maxY = Math.max(8, window.innerHeight - button.offsetHeight - 8)
    setPosition({
      x: Math.min(Math.max(8, drag.startLeft + deltaX), maxX),
      y: Math.min(Math.max(8, drag.startTop + deltaY), maxY),
    })
  }

  const stopDragging = () => {
    dragRef.current.dragging = false
    setIsDragging(false)
  }

  useEffect(() => {
    const handleResize = () => {
      const button = buttonRef.current
      if (!button) return

      const maxX = Math.max(8, window.innerWidth - button.offsetWidth - 8)
      const maxY = Math.max(8, window.innerHeight - button.offsetHeight - 8)
      setPosition((current) => ({
        x: Math.min(Math.max(8, current.x), maxX),
        y: Math.min(Math.max(8, current.y), maxY),
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleClick = () => {
    if (dragRef.current.hasMoved) {
      dragRef.current.hasMoved = false
      return
    }

    setIsOpen((open) => !open)
  }

  return (
    <div
      className="fixed z-[9999] flex flex-col items-end"
      style={{ left: `${position.x}px`, top: `${position.y}px` }}
    >
      {isOpen && (
        <div className="fixed bottom-24 right-5 z-[10000] w-[min(280px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-app-border bg-white shadow-[0_18px_42px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between bg-emerald-700 px-3 py-2 text-white">
            <span className="text-xs font-semibold">Quick Create</span>
            <button
              type="button"
              aria-label="Close quick create"
              onClick={() => setIsOpen(false)}
              className="ml-auto text-lg leading-none text-white/80 hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto bg-slate-50 p-2">
            {quickCreateGroups.map((group) => (
              <div
                key={group.title}
                className="mb-2 overflow-hidden rounded-lg border border-app-border bg-white last:mb-0"
              >
                <div className="bg-slate-50 px-3 py-2 text-xs font-semibold text-app-text">
                  {group.title}
                </div>
                <div className="p-1.5">
                  {group.items.map(([label, targetPath]) => (
                    <button
                      key={`${group.title}-${label}`}
                      type="button"
                      onClick={() => {
                        setIsOpen(false)
                        navigateTo(targetPath)
                      }}
                      className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left text-xs text-app-text-secondary transition hover:bg-slate-50 hover:text-app-text"
                    >
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-app-primary">
                        •
                      </span>
                      <span className="flex-1">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        ref={buttonRef}
        type="button"
        aria-label="Quick create"
        aria-expanded={isOpen}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onClick={handleClick}
        style={{
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-emerald-300/[0.18] bg-emerald-700 text-white shadow-[0_12px_32px_rgba(0,0,0,0.28)] backdrop-blur-[20px] backdrop-saturate-[150%] transition-shadow hover:shadow-[0_16px_36px_rgba(0,0,0,0.32)]"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full pb-1.5 text-4xl font-light leading-none">
          +
        </span>
      </button>
    </div>
  )
}

export default QuickCreateButton

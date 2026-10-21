import { useEffect, useState } from 'react'
import Panel from './Panel'

const ReceivablesPanel = ({ totalOutstanding, agingData, customerCounts }) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let animationFrame
    const startTime = performance.now()
    const duration = 1000

    const animate = (currentTime) => {
      const nextProgress = Math.min((currentTime - startTime) / duration, 1)
      setProgress(Math.round(nextProgress * 100))
      if (nextProgress < 1) animationFrame = requestAnimationFrame(animate)
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <Panel
      title="Receivables"
    
    >
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[155px_1fr]">
          <div>
            <p className="text-xs font-semibold text-app-text-secondary">Total Outstanding</p>
            <p className="mt-1 text-xl font-bold text-app-text">{totalOutstanding}</p>

            <div className="mt-6 flex justify-center">
              <div
                className="relative grid h-40 w-40 place-items-center rounded-full"
                style={{
                  background: `conic-gradient(#10a66f ${progress}%, #e5edf3 ${progress}% 100%)`,
                }}
              >
                <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center">
                  <div>
                    <div className="text-sm font-bold text-app-text">{totalOutstanding}</div>
                    <div className="mt-1 text-[10px] text-slate-500">Total Outstanding</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {agingData.map(([label, amount, percentage, dot]) => (
              <div key={label} className="flex items-center gap-2 border-b border-app-border-light pb-3">
                <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
                <span className="flex-1 text-[11px] text-app-text-secondary">{label}</span>
                <span className="text-[11px] font-semibold text-app-text">{amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 border-t border-app-border-light pt-4 text-center">
          {customerCounts.map(([label, value], index) => (
            <div key={label} className={`px-2 ${index > 0 ? 'border-l border-app-border-light' : ''}`}>
              <p className="text-[10px] font-semibold text-app-text-secondary">{label}</p>
              <p className={`mt-1 text-lg font-bold ${label === 'Overdue Customers' ? 'text-red-500' : 'text-app-text'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

export default ReceivablesPanel

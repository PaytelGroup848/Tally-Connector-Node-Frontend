const plans = [
  {
    name: 'Growth',
    accent: 'bg-white border-slate-200 text-slate-800',
    featureBox: 'bg-[#ecf2eb] text-slate-700',
    highlight: false,
    price: ['₹ 3,000', '₹ 7,200'],
    featureLabel: 'Read-Only Access',
    list: ['Access Data on Mobile & Web', 'Share Ledgers on WhatsApp', 'Track Outstanding Payments', 'Automated Payment Reminders', 'Auto Sync Companies', '20+ Business Reports', 'Accounting Data Backup'],
    footer: 'Give Access Admin User Only',
    footerTag: 'FREE',
  },
  {
    name: 'Pro',
    accent: 'bg-[#eaf5ea] border-[#5bbd69] text-slate-800 ring-1 ring-[#5bbd69]',
    featureBox: 'bg-[#dff2e0] text-slate-700',
    highlight: true,
    price: ['₹ 5,000', '₹ 11,250'],
    featureLabel: 'Create & Manage Entries',
    list: ['Everything in Growth +', 'Create / Edit Vouchers on Mobile & Web', 'Create Custom PDF Templates'],
    footer: 'Give Access Admin User + 1 Free User',
    footerTag: 'FREE',
  },
  {
    name: 'Pro Plus',
    accent: 'bg-white border-slate-200 text-slate-800',
    featureBox: 'bg-[#ecf2eb] text-slate-700',
    highlight: false,
    price: ['₹ 7,000', '₹ 15,750'],
    featureLabel: 'E-Way & E-Invoices',
    list: ['Everything in Pro +', 'Generate One-Click E-Way & E-Invoice', 'Stay GST Compliant'],
    footer: 'Give Access Admin User + 1 Free User',
    footerTag: 'FREE',
  },
]

function PlanModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#f4f4f4]/80 p-4">
      <div className="relative w-full max-w-[1180px] rounded-[18px] bg-transparent px-2 py-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-2xl font-light text-slate-500 shadow-sm ring-1 ring-slate-200 transition hover:text-slate-800"
          aria-label="Close pricing modal"
        >
          ×
        </button>

        <div className="mb-8 pt-6 text-center">
          <div className="flex items-start justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
            >
              Close
            </button>
          </div>
          <h2 className="text-[54px] font-black leading-none tracking-[-0.06em] text-slate-900">Pricing</h2>
          <div className="mx-auto mt-4 h-[3px] w-[120px] bg-[#62b96c]" />
          <p className="mt-4 text-base text-slate-600">Choose a plan for 1 user. Both 1-Year &amp; 3-Years pricing</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3 lg:items-start">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-[18px] border bg-white p-4 pb-5 shadow-[0_4px_18px_rgba(15,23,42,0.04)] ${plan.accent} ${plan.highlight ? 'scale-[1.02]' : ''}`}
            >
              {plan.highlight && (
                <div className="absolute left-1/2 top-[-18px] -translate-x-1/2 rounded-full border border-[#5bbd69] bg-[#f9d85a] px-4 py-2 text-[11px] font-black uppercase tracking-[0.12em] text-slate-800 shadow-sm">
                  ★ RECOMMENDED
                </div>
              )}

              <div className="rounded-[14px] border border-slate-200 bg-[#f2f5f1] p-4">
                <h3 className="text-[20px] font-black uppercase tracking-wide text-slate-800">{plan.name}</h3>
                <div className={`mt-4 rounded-[10px] px-3 py-3 text-center text-sm font-semibold ${plan.featureBox}`}>
                  {plan.featureLabel}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className={`rounded-[12px] p-3 text-center ${plan.highlight ? 'bg-[#6ac270] text-white shadow-sm' : 'bg-[#f3f5f3] text-slate-800'} ${plan.highlight ? 'ring-1 ring-[#4cab57]' : ''}`}>
                    <div className="text-[11px] font-bold uppercase tracking-wide">1 Year</div>
                    <div className="mt-2 text-[18px] font-black">{plan.price[0]}</div>
                  </div>
                  <div className={`relative rounded-[12px] p-3 text-center ${plan.highlight ? 'bg-[#6ac270] text-white shadow-sm' : 'bg-[#f3f5f3] text-slate-800'} ${plan.highlight ? 'ring-1 ring-[#4cab57]' : ''}`}>
                    <div className="absolute right-2 top-2 rounded-full bg-[#f4d758] px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wide text-slate-800">25% OFF</div>
                    <div className="text-[11px] font-bold uppercase tracking-wide">3 Years</div>
                    <div className="mt-2 text-[18px] font-black">{plan.price[1]}</div>
                  </div>
                </div>

                <ul className="mt-5 space-y-3 text-left text-[14px] text-slate-700">
                  {plan.list.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#dfeee0] text-[11px] font-black text-[#1ea44a]">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className={`mt-5 flex items-center justify-between rounded-[10px] border px-3 py-2 text-sm font-semibold ${plan.highlight ? 'border-[#66c06d] bg-[#ecf9ed] text-slate-700' : 'border-slate-200 bg-[#f1f5f3] text-slate-700'}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-base">👤</span>
                    <span>{plan.footer}</span>
                  </div>
                  <span className="rounded-[6px] bg-[#f4d758] px-2 py-1 text-[10px] font-black uppercase tracking-wide text-slate-800">{plan.footerTag}</span>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className={`mt-5 w-full rounded-[10px] border px-4 py-3 text-[18px] font-black uppercase tracking-wide transition ${plan.highlight ? 'border-[#5ab961] bg-[#6ac270] text-white hover:bg-[#57b761]' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'}`}
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PlanModal
import { useState } from 'react'

const topTabs = ['Invoice', 'Outstanding', 'Ledger Report', 'Stock Summary Report']
const subTabs = ['Details', 'Voucher Number', 'Invoice Template', 'Invoice Declaration', 'Invoice Header', 'Logo']
const outstandingSubTabs = ['Details', 'Column To share']
const checks = ['Consignee Address', 'Show Stock Discount', 'Ledger Description', 'Godown Name', 'item Description', 'E-way Bill', 'Narration', 'Batches', 'Bank Account', 'Show Stock Expiry', 'Invoice Share GST %']
const voucherTypes = ['Sales', 'Sales Order', 'Purchase', 'Purchase Order', 'Credit Note', 'Receipt', 'Payment', 'Journal', 'Debit Note', 'Quotation', 'Contra', 'Delivery Note']
const defaultHeaders = {
  'Sales': 'TAX SALES',
  'Sales Order': 'SALES ORDER',
  'Purchase': 'PURCHASE',
  'Purchase Order': 'PURCHASE ORDER',
  'Credit Note': 'CREDIT NOTE',
  'Receipt': 'RECEIPT VOUCHER',
  'Payment': 'PAYMENT VOUCHER',
  'Journal': 'JOURNAL VOUCHER',
  'Debit Note': 'DEBIT NOTE',
  'Quotation': 'QUOTATION',
  'Contra': 'CONTRA VOUCHER',
  'Delivery Note': 'DELIVERY NOTE',
}
const defaultDeclaration = 'We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.'

function ConfigSection({ title }) {
  return (
    <div className="p-4">
      <h2 className="text-base font-semibold">{title}</h2>
      <p className="mt-2 text-xs text-slate-500">Configure {title.toLowerCase()} preferences here.</p>
      <button type="button" className="mt-4 rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white">Add Setting</button>
    </div>
  )
}

function Toggle({ active, onClick, label }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={`relative inline-flex h-[22px] w-[42px] flex-shrink-0 items-center rounded-full border transition-colors ${
        active ? 'border-green-500 bg-green-500' : 'border-slate-300 bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-[16px] w-[16px] transform rounded-full bg-white shadow transition-transform ${
          active ? 'translate-x-[22px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  )
}

function Radio({ active, onClick, children }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className="mr-4 inline-flex items-center gap-1.5 text-xs font-normal text-slate-700"
    >
      <span
        className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border ${
          active ? 'border-green-600' : 'border-slate-400'
        }`}
      >
        {active && <span className="h-1.5 w-1.5 rounded-full bg-green-600" />}
      </span>
      {children}
    </button>
  )
}

function UploadIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 16V4" />
      <path d="M6 10l6-6 6 6" />
      <path d="M4 20h16" />
    </svg>
  )
}

function Dropzone({ title, file, onSelect }) {
  return (
    <div>
      <h3 className="mb-3 text-center text-sm font-semibold text-slate-900">{title}</h3>
      <label className="flex h-[190px] cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed border-green-500 text-slate-700">
        <UploadIcon />
        <span className="text-sm font-semibold text-slate-900">
          {file ? file.name : `Upload ${title}`}
        </span>
        <span className="rounded bg-[#2f7bf5] px-4 py-1.5 text-xs font-semibold text-white">
          Browse File
        </span>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => onSelect(event.target.files?.[0] ?? null)}
        />
      </label>
    </div>
  )
}

function ConfigurationsPage() {
  const [tab, setTab] = useState('Invoice')
  const [subTab, setSubTab] = useState('Details')
  const [outstandingSubTab, setOutstandingSubTab] = useState('Column To share')
  const [checked, setChecked] = useState(new Set(['Show Stock Discount', 'Godown Name', 'item Description', 'E-way Bill']))
  const [toggles, setToggles] = useState({ taxes: false, eway: true, roundOff: true, optional: false })
  const [dispatch, setDispatch] = useState('Default')
  const [format, setFormat] = useState('Regular')
  const [saved, setSaved] = useState(false)

  const [viewOutstandingBy, setViewOutstandingBy] = useState('Due Date')
  const [billWiseOutstanding, setBillWiseOutstanding] = useState(true)
  const [bankAccountChecked, setBankAccountChecked] = useState(false)
  const [selectedBank, setSelectedBank] = useState('')
  const [outstandingAdjustment, setOutstandingAdjustment] = useState(true)

  const [columnToggles, setColumnToggles] = useState({
    date: true,
    refOn: true,
    pendingAmount: true,
    overdueByDays: true,
    dueOn: true,
  })
  const toggleColumn = (name) => setColumnToggles((current) => ({ ...current, [name]: !current[name] }))

  const [reportFormat, setReportFormat] = useState('Detailed')
  const [ledgerToggles, setLedgerToggles] = useState({
    showNarration: false,
    openingBalance: true,
    balance: true,
    billWiseDetails: false,
  })
  const toggleLedger = (name) => setLedgerToggles((current) => ({ ...current, [name]: !current[name] }))

  const [stockToggles, setStockToggles] = useState({
    showHsnCode: false,
    showRate: false,
  })
  const toggleStock = (name) => setStockToggles((current) => ({ ...current, [name]: !current[name] }))

  const [voucherNumbers, setVoucherNumbers] = useState(() => {
    const initial = {}
    voucherTypes.forEach((type) => {
      initial[type] = { checked: true, prefix: '', number: '123', suffix: '' }
    })
    return initial
  })
  const toggleVoucherChecked = (type) =>
    setVoucherNumbers((current) => ({ ...current, [type]: { ...current[type], checked: !current[type].checked } }))
  const updateVoucherField = (type, field, value) =>
    setVoucherNumbers((current) => ({ ...current, [type]: { ...current[type], [field]: value } }))

  const [invoiceTemplate, setInvoiceTemplate] = useState('Default')

  const [customizedDeclaration, setCustomizedDeclaration] = useState(false)
  const [declarationText, setDeclarationText] = useState(defaultDeclaration)

  const [customizedHeader, setCustomizedHeader] = useState(false)
  const [headers, setHeaders] = useState(defaultHeaders)
  const updateHeader = (type, value) => setHeaders((current) => ({ ...current, [type]: value }))

  const [companyLogo, setCompanyLogo] = useState(null)
  const [signature, setSignature] = useState(null)

  const toggleCheck = (name) => setChecked((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next })
  const toggleSetting = (name) => setToggles((current) => ({ ...current, [name]: !current[name] }))

  return (
    <div className="page-surface min-h-screen bg-[#eaf0f5]">

      {/* TOOLBAR */}
      <div className="page-toolbar flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
        <span className="text-2xl leading-none text-slate-900">←</span>
        <h1 className="text-base font-semibold text-slate-900">Configurations</h1>
      </div>

      <section className="page-card mx-4 mt-4 rounded-lg bg-white p-5 shadow-sm">
        {/* TOP TABS */}
        <nav className="page-tabs flex gap-8 border-b border-slate-200 text-sm text-slate-700">
          {topTabs.map((item) => (
            <button
              key={item}
              onClick={() => { setTab(item); setSaved(false) }}
              className={`relative pb-3 ${tab === item ? 'font-semibold text-green-700' : 'text-slate-700'}`}
            >
              {item}
              {tab === item && (
                <span className="absolute bottom-0 left-0 h-[2px] w-full bg-green-600" />
              )}
            </button>
          ))}
        </nav>

        {tab === 'Invoice' && (
          <>
            <nav className="page-tabs mt-3 flex gap-8 border-b border-slate-200 text-sm text-slate-700">
              {subTabs.map((item) => (
                <button
                  key={item}
                  onClick={() => setSubTab(item)}
                  className={subTab === item ? 'pb-3 font-semibold text-green-700' : 'pb-3'}
                >
                  {item}
                </button>
              ))}
            </nav>

            {subTab === 'Details' ? (
              <>
                <div className="grid grid-cols-1 gap-5 border-x border-slate-200 px-4 pt-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[checks.slice(0, 3), checks.slice(3, 6), checks.slice(6, 9), checks.slice(9)].map((group, index) => (
                    <div key={index}>
                      <h2 className="mb-3 text-sm font-semibold">{index === 0 ? 'Details' : '\u00a0'}</h2>
                      {group.map((name) => (
                        <label className="mb-3 flex items-center gap-2 text-xs" key={name}>
                          <input className="h-4 w-4 accent-green-500" type="checkbox" checked={checked.has(name)} onChange={() => toggleCheck(name)} />
                          {name}
                        </label>
                      ))}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-5 border-x border-slate-200 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[['Multiple Taxes', 'taxes'], ['Eway Bill / E-Invoice', 'eway'], ['Auto Round Off', 'roundOff'], ['Optional Voucher', 'optional']].map(([label, key]) => (
                    <label className="flex flex-col gap-2 text-sm font-semibold" key={key}>
                      {label}
                      <span className="mt-2 block">
                        <Toggle label={`Toggle ${label}`} active={toggles[key]} onClick={() => toggleSetting(key)} />
                      </span>
                    </label>
                  ))}

                  <label className="text-sm font-semibold">
                    Eway Bill Dispatch Address
                    <span className="mt-2 block">
                      <Radio active={dispatch === 'Default'} onClick={() => setDispatch('Default')}>Default</Radio>
                      <Radio active={dispatch === 'Dispatch From'} onClick={() => setDispatch('Dispatch From')}>Dispatch From</Radio>
                    </span>
                  </label>

                  <label className="text-sm font-semibold">
                    Eway Bill / E-Invoice Format
                    <span className="mt-2 block">
                      <Radio active={format === 'Regular'} onClick={() => setFormat('Regular')}>Regular</Radio>
                      <Radio active={format === 'Detailed'} onClick={() => setFormat('Detailed')}>Detailed</Radio>
                    </span>
                  </label>
                </div>

                <h2 className="border-x border-t border-slate-200 px-4 pt-3 text-lg font-semibold">Quotation PDF</h2>
              </>
            ) : subTab === 'Voucher Number' ? (
              <div className="border-x border-b border-slate-200 px-4 pb-4 pt-3">

                <div className="max-h-[280px] overflow-y-auto rounded-md border border-slate-200">
                  <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr] bg-[#eef1f4] px-3 py-2.5 text-[12px] font-semibold text-slate-800">
                    <span />
                    <span>Prefix</span>
                    <span>Number</span>
                    <span>Suffix</span>
                  </div>

                  {voucherTypes.map((type) => {
                    const row = voucherNumbers[type]
                    return (
                      <div
                        key={type}
                        className="grid grid-cols-[1.4fr_1fr_1fr_1fr] items-center gap-2 border-t border-slate-100 px-3 py-2"
                      >
                        <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                          <input
                            type="checkbox"
                            checked={row.checked}
                            onChange={() => toggleVoucherChecked(type)}
                            className="h-4 w-4 accent-green-500"
                          />
                          {type}
                        </label>

                        <input
                          value={row.prefix}
                          onChange={(event) => updateVoucherField(type, 'prefix', event.target.value)}
                          placeholder="Prefix"
                          className="h-8 w-full rounded border border-slate-200 bg-slate-100 px-2 text-[12px] text-slate-600 outline-none focus:border-green-500"
                        />

                        <input
                          value={row.number}
                          onChange={(event) => updateVoucherField(type, 'number', event.target.value)}
                          className="h-8 w-full rounded border border-slate-200 bg-slate-100 px-2 text-[12px] text-slate-600 outline-none focus:border-green-500"
                        />

                        <input
                          value={row.suffix}
                          onChange={(event) => updateVoucherField(type, 'suffix', event.target.value)}
                          placeholder="Suffix"
                          className="h-8 w-full rounded border border-slate-200 bg-slate-100 px-2 text-[12px] text-slate-600 outline-none focus:border-green-500"
                        />
                      </div>
                    )
                  })}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

              </div>
            ) : subTab === 'Invoice Template' ? (
              <div className="border-x border-b border-slate-200 px-4 py-4">

                <div className="flex flex-wrap gap-10">
                  {['Default', 'Three Inch Thermal Printer', 'Two Inch Thermal Printer'].map((option) => (
                    <Radio
                      key={option}
                      active={invoiceTemplate === option}
                      onClick={() => setInvoiceTemplate(option)}
                    >
                      {option}
                    </Radio>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

              </div>
            ) : subTab === 'Invoice Declaration' ? (
              <div className="border-x border-b border-slate-200 px-4 py-4">

                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <input
                    type="checkbox"
                    checked={customizedDeclaration}
                    onChange={() => setCustomizedDeclaration((v) => !v)}
                    className="h-4 w-4 accent-green-500"
                  />
                  Customized Declaration
                </label>

                <textarea
                  value={declarationText}
                  onChange={(event) => setDeclarationText(event.target.value)}
                  disabled={!customizedDeclaration}
                  rows={3}
                  className="w-full resize-none rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-[13px] text-slate-700 outline-none focus:border-green-500 disabled:cursor-not-allowed"
                />

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

              </div>
            ) : subTab === 'Invoice Header' ? (
              <div className="border-x border-b border-slate-200 px-4 py-4">

                <label className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <input
                    type="checkbox"
                    checked={customizedHeader}
                    onChange={() => setCustomizedHeader((v) => !v)}
                    className="h-4 w-4 accent-green-500"
                  />
                  Customized Invoice Header
                </label>

                <div className="grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-3">
                  {voucherTypes.map((type) => (
                    <div key={type}>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-900">
                        {type} Header
                      </label>
                      <input
                        value={headers[type]}
                        onChange={(event) => updateHeader(type, event.target.value)}
                        disabled={!customizedHeader}
                        className="h-9 w-full rounded-md border border-slate-200 bg-slate-100 px-3 text-[13px] font-medium uppercase text-slate-700 outline-none focus:border-green-500 disabled:cursor-not-allowed"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

              </div>
            ) : subTab === 'Logo' ? (
              <div className="border-x border-b border-slate-200 px-4 py-4">

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  <Dropzone title="Company Logo" file={companyLogo} onSelect={setCompanyLogo} />
                  <Dropzone title="Signature" file={signature} onSelect={setSignature} />
                </div>

                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

              </div>
            ) : (
              <ConfigSection title={subTab} />
            )}
          </>
        )}

        {tab === 'Outstanding' && (
          <>
            {/* OUTSTANDING SUB TABS */}
            <nav className="mt-3 grid grid-cols-2 border border-slate-200 bg-[#eef1f4] text-sm">
              {outstandingSubTabs.map((item) => (
                <button
                  key={item}
                  onClick={() => setOutstandingSubTab(item)}
                  className={`py-3 text-center ${
                    outstandingSubTab === item
                      ? 'font-semibold text-green-700 underline decoration-2 underline-offset-[10px]'
                      : 'text-slate-700'
                  }`}
                >
                  {item}
                </button>
              ))}
            </nav>

            {outstandingSubTab === 'Details' ? (
              <div className="rounded-b-md border-x border-b border-slate-200 px-6 py-6">

                <div className="grid grid-cols-1 gap-x-16 gap-y-6 sm:grid-cols-2">

                  {/* VIEW OUTSTANDING BY */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-900">
                      View Outstanding By
                    </label>
                    <select
                      value={viewOutstandingBy}
                      onChange={(event) => setViewOutstandingBy(event.target.value)}
                      className="h-9 w-full max-w-xs rounded-md border border-slate-300 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-green-500 sm:w-64"
                    >
                      <option value="Due Date">Due Date</option>
                      <option value="Voucher Date">Voucher Date</option>
                      <option value="Bill Date">Bill Date</option>
                    </select>
                  </div>

                  {/* BANK ACCOUNT */}
                  <div>
                    <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                      <input
                        type="checkbox"
                        checked={bankAccountChecked}
                        onChange={() => setBankAccountChecked((v) => !v)}
                        className="h-4 w-4 accent-green-500"
                      />
                      BankAccount
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(event) => setSelectedBank(event.target.value)}
                      disabled={!bankAccountChecked}
                      className="h-9 w-full max-w-xs rounded-md border border-slate-300 bg-slate-100 px-3 text-[13px] text-slate-400 outline-none focus:border-green-500 disabled:cursor-not-allowed sm:w-64"
                    >
                      <option value="">Please Select Bank</option>
                      <option value="HDFC Bank">HDFC Bank</option>
                      <option value="ICICI Bank">ICICI Bank</option>
                      <option value="SBI">SBI</option>
                    </select>
                  </div>

                  {/* BILL WISE OUTSTANDING */}
                  <div className="flex items-center justify-between sm:max-w-xs">
                    <span className="text-sm font-semibold text-slate-900">Bill Wise Outstanding</span>
                    <Toggle
                      label="Toggle Bill Wise Outstanding"
                      active={billWiseOutstanding}
                      onClick={() => setBillWiseOutstanding((v) => !v)}
                    />
                  </div>

                  {/* OUTSTANDING ADJUSTMENT */}
                  <div className="flex items-center justify-between sm:max-w-xs">
                    <span className="text-sm font-semibold text-slate-900">Outstanding Adjustment</span>
                    <Toggle
                      label="Toggle Outstanding Adjustment"
                      active={outstandingAdjustment}
                      onClick={() => setOutstandingAdjustment((v) => !v)}
                    />
                  </div>

                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

              </div>
            ) : (
              <div className="rounded-b-md border-x border-b border-slate-200 px-6 py-6">

                <div className="grid grid-cols-1 gap-x-16 gap-y-5 sm:grid-cols-3">

                  <div className="flex items-center justify-between sm:max-w-[200px]">
                    <span className="text-sm font-semibold text-slate-900">Date</span>
                    <Toggle label="Toggle Date" active={columnToggles.date} onClick={() => toggleColumn('date')} />
                  </div>

                  <div className="flex items-center justify-between sm:max-w-[200px]">
                    <span className="text-sm font-semibold text-slate-900">Pending Amount</span>
                    <Toggle label="Toggle Pending Amount" active={columnToggles.pendingAmount} onClick={() => toggleColumn('pendingAmount')} />
                  </div>

                  <div className="flex items-center justify-between sm:max-w-[200px]">
                    <span className="text-sm font-semibold text-slate-900">Due on</span>
                    <Toggle label="Toggle Due on" active={columnToggles.dueOn} onClick={() => toggleColumn('dueOn')} />
                  </div>

                  <div className="flex items-center justify-between sm:max-w-[200px]">
                    <span className="text-sm font-semibold text-slate-900">Ref On</span>
                    <Toggle label="Toggle Ref On" active={columnToggles.refOn} onClick={() => toggleColumn('refOn')} />
                  </div>

                  <div className="flex items-center justify-between sm:max-w-[200px]">
                    <span className="text-sm font-semibold text-slate-900">Overdue By Days</span>
                    <Toggle label="Toggle Overdue By Days" active={columnToggles.overdueByDays} onClick={() => toggleColumn('overdueByDays')} />
                  </div>

                </div>

                <div className="mt-8 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setSaved(true)}
                    className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
                  >
                    {saved ? 'Saved' : 'Save'}
                  </button>
                </div>

              </div>
            )}
          </>
        )}

        {tab === 'Ledger Report' && (
          <div className="rounded-b-md border-x border-b border-slate-200 px-6 py-6">

            <div className="grid grid-cols-1 gap-x-16 gap-y-6 sm:grid-cols-3">

              {/* FORMAT OF REPORT */}
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-900">Format of Report</span>
                <span className="block">
                  <Radio active={reportFormat === 'Detailed'} onClick={() => setReportFormat('Detailed')}>Detailed</Radio>
                  <Radio active={reportFormat === 'Condensed'} onClick={() => setReportFormat('Condensed')}>Condensed</Radio>
                </span>
              </div>

              {/* SHOW NARRATION */}
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-900">Show Narration</span>
                <Toggle label="Toggle Show Narration" active={ledgerToggles.showNarration} onClick={() => toggleLedger('showNarration')} />
              </div>

              <div />

              {/* OPENING BALANCE */}
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-900">Opening Balance</span>
                <Toggle label="Toggle Opening Balance" active={ledgerToggles.openingBalance} onClick={() => toggleLedger('openingBalance')} />
              </div>

              {/* BALANCE */}
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-900">Balance</span>
                <Toggle label="Toggle Balance" active={ledgerToggles.balance} onClick={() => toggleLedger('balance')} />
              </div>

              {/* BILL-WISE DETAILS */}
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-900">Bill-wise Details</span>
                <Toggle label="Toggle Bill-wise Details" active={ledgerToggles.billWiseDetails} onClick={() => toggleLedger('billWiseDetails')} />
              </div>

            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>

          </div>
        )}

        {tab === 'Stock Summary Report' && (
          <div className="rounded-b-md border-x border-b border-slate-200 px-6 py-6">

            <h2 className="text-base font-semibold text-slate-900">Stock Summary Report</h2>

            <div className="mt-3 flex flex-wrap items-center gap-8">

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">Show HSN Code</span>
                <Toggle label="Toggle Show HSN Code" active={stockToggles.showHsnCode} onClick={() => toggleStock('showHsnCode')} />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-900">Show Rate</span>
                <Toggle label="Toggle Show Rate" active={stockToggles.showRate} onClick={() => toggleStock('showRate')} />
              </div>

            </div>

            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setSaved(true)}
                className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white transition hover:bg-black"
              >
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>

          </div>
        )}

        {tab !== 'Invoice' && tab !== 'Outstanding' && tab !== 'Ledger Report' && tab !== 'Stock Summary Report' && (
          <>
            <ConfigSection title={tab} />
            <div className="flex justify-center border-x border-b border-slate-200 px-4 py-4">
              <button className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white" onClick={() => setSaved(true)}>
                {saved ? 'Saved' : 'Save'}
              </button>
            </div>
          </>
        )}

        {tab === 'Invoice' && subTab === 'Details' && (
          <div className="flex justify-center border-x border-b border-slate-200 px-4 py-4">
            <button className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white" onClick={() => setSaved(true)}>
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        )}

      </section>
    </div>
  )
}

export default ConfigurationsPage
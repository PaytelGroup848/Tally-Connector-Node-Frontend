import { useState } from 'react'

const topTabs = ['Invoice', 'Outstanding', 'Ledger Report', 'Stock Summary Report']
const subTabs = ['Details', 'Voucher Number', 'Invoice Template', 'Invoice Declaration', 'Invoice Header', 'Logo']
const checks = ['Consignee Address', 'Show Stock Discount', 'Ledger Description', 'Godown Name', 'item Description', 'E-way Bill', 'Narration', 'Batches', 'Bank Account', 'Show Stock Expiry', 'Invoice Share GST %']

function ConfigSection({ title }) {
  return <div className="p-4"><h2 className="text-base font-semibold">{title}</h2><p className="mt-2 text-xs text-slate-500">Configure {title.toLowerCase()} preferences here.</p><button type="button" className="mt-4 rounded bg-slate-900 px-4 py-2 text-xs font-semibold text-white">Add Setting</button></div>
}

function Toggle({ active, onClick, label }) {
  return <button type="button" aria-label={label} aria-pressed={active} onClick={onClick} className={`toggle-control ${active ? 'is-on' : ''}`}><span className="toggle-thumb" /></button>
}

function Radio({ active, onClick, children }) {
  return <button type="button" aria-pressed={active} onClick={onClick} className={`radio-control ${active ? 'is-selected' : ''}`}><span className="radio-dot" />{children}</button>
}

function ConfigurationsPage() {
  const [tab, setTab] = useState('Invoice')
  const [subTab, setSubTab] = useState('Details')
  const [checked, setChecked] = useState(new Set(['Show Stock Discount', 'Godown Name', 'item Description', 'E-way Bill']))
  const [toggles, setToggles] = useState({ taxes: false, eway: true, roundOff: true, optional: false })
  const [dispatch, setDispatch] = useState('Default')
  const [format, setFormat] = useState('Regular')
  const [saved, setSaved] = useState(false)
  const toggleCheck = (name) => setChecked((current) => { const next = new Set(current); if (next.has(name)) next.delete(name); else next.add(name); return next })
  const toggleSetting = (name) => setToggles((current) => ({ ...current, [name]: !current[name] }))
  return <div className="page-surface">
    <div className="page-toolbar"><span className="text-2xl">←</span><h1 className="text-base font-semibold">Configurations</h1></div>
    <section className="page-card p-5">
      <nav className="page-tabs">{topTabs.map((item) => <button className={tab === item ? 'font-semibold text-green-700' : ''} onClick={() => { setTab(item); setSaved(false) }} key={item}>{item}</button>)}</nav>
      {tab === 'Invoice' ? <><nav className="page-tabs mt-3">{subTabs.map((item) => <button className={subTab === item ? 'font-semibold text-green-700' : ''} onClick={() => setSubTab(item)} key={item}>{item}</button>)}</nav>{subTab === 'Details' ? <>
        <div className="grid grid-cols-1 gap-5 border-x border-slate-200 px-4 pt-3 sm:grid-cols-2 lg:grid-cols-4">{[checks.slice(0, 3), checks.slice(3, 6), checks.slice(6, 9), checks.slice(9)].map((group, index) => <div key={index}><h2 className="mb-3 text-sm font-semibold">{index === 0 ? 'Details' : '\u00a0'}</h2>{group.map((name) => <label className="mb-3 flex items-center gap-2 text-xs" key={name}><input className="h-4 w-4 accent-green-500" type="checkbox" checked={checked.has(name)} onChange={() => toggleCheck(name)} />{name}</label>)}</div>)}</div>
        <div className="grid grid-cols-1 gap-5 border-x border-slate-200 px-4 pb-4 sm:grid-cols-2 lg:grid-cols-4">{[['Multiple Taxes', 'taxes'], ['Eway Bill / E-Invoice', 'eway'], ['Auto Round Off', 'roundOff'], ['Optional Voucher', 'optional']].map(([label, key]) => <label className="flex flex-col gap-2 text-sm font-semibold" key={key}>{label}<Toggle label={`Toggle ${label}`} active={toggles[key]} onClick={() => toggleSetting(key)} /></label>)}<label className="text-sm font-semibold">Eway Bill Dispatch Address<span className="mt-2 block"><Radio active={dispatch === 'Default'} onClick={() => setDispatch('Default')}>Default</Radio><Radio active={dispatch === 'Dispatch From'} onClick={() => setDispatch('Dispatch From')}>Dispatch From</Radio></span></label><label className="text-sm font-semibold">Eway Bill / E-Invoice Format<span className="mt-2 block"><Radio active={format === 'Regular'} onClick={() => setFormat('Regular')}>Regular</Radio><Radio active={format === 'Detailed'} onClick={() => setFormat('Detailed')}>Detailed</Radio></span></label></div>
        <h2 className="border-x border-t border-slate-200 px-4 pt-3 text-lg font-semibold">Quotation PDF</h2>
      </> : <ConfigSection title={subTab} />}</> : <ConfigSection title={tab} />}
      <div className="flex justify-center border-x border-b border-slate-200 px-4 py-4"><button className="rounded bg-slate-900 px-8 py-2 text-sm font-semibold text-white" onClick={() => setSaved(true)}>{saved ? 'Saved' : 'Save'}</button></div>
    </section>
  </div>
}

export default ConfigurationsPage

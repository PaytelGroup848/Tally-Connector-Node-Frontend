import { useState } from 'react'
import { ChevronDown, Menu, Search, Smartphone, User, X } from 'lucide-react'

const profileItems = ['Profile', 'All User', 'Download Invoice', 'Logout']

function ConnectorStatusButton({ rows = [], lastSyncMeta = null, connectorStatusError = '', isConnectorStatusLoading = false }) {
  const [open, setOpen] = useState(false)
  const syncMeta = Array.isArray(lastSyncMeta) ? lastSyncMeta[0] : lastSyncMeta
  const lastSyncValue = syncMeta?.completedAt || syncMeta?.lastSync || syncMeta?.lastSyncedAt || syncMeta?.updatedAt || syncMeta?.timestamp || null
  const lastSyncLabel = (() => {
    if (!lastSyncValue) return 'No sync yet'
    const date = new Date(lastSyncValue)
    if (Number.isNaN(date.getTime())) return String(lastSyncValue)
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  })()

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
      >
        <span className={`h-2.5 w-2.5 rounded-full ${rows.some((row) => ['online', 'active', 'connected'].includes(String(row?.status || '').toLowerCase())) ? 'bg-emerald-500' : 'bg-red-500'}`} />
        <span className="flex flex-col items-start leading-none">
          <span>Status</span>
          <span className="mt-0.5 text-[9px] font-normal text-slate-500">Last sync: {lastSyncLabel}</span>
        </span>
        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">{rows.length || 0}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[420px] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">Connector Status</p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Live</span>
          </div>

          {lastSyncMeta && (
            <div className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Type</span>
                <span className="mt-1 block font-medium text-slate-800">{lastSyncMeta.type || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Status</span>
                <span className="mt-1 block font-medium text-slate-800">{lastSyncMeta.status || 'N/A'}</span>
              </div>
              <div className="col-span-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Last Sync</span>
                <span className="mt-1 block font-medium text-slate-800">{lastSyncLabel}</span>
              </div>
            </div>
          )}

          <div className="max-h-[320px] overflow-y-auto">
            {isConnectorStatusLoading ? (
              <div className="px-3 py-4 text-sm text-slate-500">Loading connector status...</div>
            ) : connectorStatusError ? (
              <div className="px-3 py-4 text-sm text-red-600">{connectorStatusError}</div>
            ) : rows.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500">No connector status available.</div>
            ) : (
              rows.map((connector, index) => {
                const deviceName = connector?.deviceName || connector?.name || connector?.connectorName || `Connector ${index + 1}`
                const status = connector?.status || 'UNKNOWN'
                const lastHeartbeatValue = connector?.lastHeartbeatAt || connector?.lastHeartbeat || connector?.heartbeatAt || null
                const formattedLastHeartbeat = (() => {
                  if (!lastHeartbeatValue) return 'N/A'
                  const date = new Date(lastHeartbeatValue)
                  if (Number.isNaN(date.getTime())) return String(lastHeartbeatValue)
                  return new Intl.DateTimeFormat('en-IN', {
                    timeZone: 'Asia/Kolkata',
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                  }).format(date)
                })()

                return (
                  <div key={`${connector?.deviceId || deviceName}-${index}`} className="border-b border-slate-100 px-3 py-2 last:border-b-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{deviceName}</p>
          
                      </div>
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        ['online', 'active', 'connected'].includes(String(status).toLowerCase())
                          ? 'bg-emerald-100 text-emerald-700'
                          : ['offline', 'inactive', 'disconnected'].includes(String(status).toLowerCase())
                            ? 'bg-red-100 text-red-700'
                            : 'bg-amber-100 text-amber-700'
                      }`}>
                        {status}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>
                
                        <span className="mt-1 block">{connector?.tallyConnected === true ? 'Connected' : connector?.tallyConnected === false ? 'Disconnected' : 'N/A'}</span>
                      </div>
                     
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-600">Last Updated:</span> {formattedLastHeartbeat}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AppHeader({ sidebarCollapsed, setSidebarCollapsed, setShowEway, onOpenEway, showProfileMenu, setShowProfileMenu, showCompanyMenu, setShowCompanyMenu, onProfileClick, onAllUsersClick, onMobileVersionClick, selectedCompany, companyOptions, onAddCompany, onSelectCompany, onCompanyClick, onLogout, connectorStatusRows = [], lastSyncMeta = null, connectorStatusError = '', isConnectorStatusLoading = false }) {
  return <>
    <header className="app-header relative z-20 flex h-auto flex-wrap items-center border-b border-slate-200 bg-white md:h-[60px] md:flex-nowrap">
      <button type="button" aria-label="Menu" aria-expanded={!sidebarCollapsed} onClick={() => setSidebarCollapsed((current) => !current)} className="header-menu flex h-[60px] w-[58px] shrink-0 items-center justify-center border-0 border-r border-slate-200 bg-white text-slate-800"><Menu className="h-4 w-4" /></button>
      <div className="relative flex h-[60px] min-w-[160px] flex-1 items-center border-r border-slate-200 px-3 md:w-[clamp(180px,26vw,355px)] md:min-w-[180px] md:flex-none md:px-4" role="button" tabIndex={0} aria-expanded={showCompanyMenu} onClick={() => { setShowCompanyMenu((current) => !current); setShowProfileMenu(false) }}>
        <div className="min-w-0"><strong className="block truncate text-[13px] font-semibold">{selectedCompany?.name || 'NA'}</strong><span className="block text-[11px] text-slate-500">{selectedCompany?.meta || ''}</span></div><ChevronDown className="ml-2 h-4 w-4 text-slate-500" />
        {showCompanyMenu && <div className="absolute left-2 top-[60px] z-30 w-80 rounded border border-slate-200 bg-white p-3 text-xs shadow-lg" onClick={(event) => event.stopPropagation()}><b className="mb-3 block text-slate-500">My Companies</b>{companyOptions?.map((company) => <button type="button" key={company.id || company.name} onClick={() => { onCompanyClick?.(company); if (!onCompanyClick) onSelectCompany?.(company) }} className="flex w-full items-start justify-between border-b border-slate-100 pb-3 text-left last:border-b-0 last:pb-0"><span><strong className="block">{company.name || 'NA'}</strong><small className="text-slate-500">{company.meta || ''}</small></span></button>)}</div>}
      </div>
      <label className="header-search mx-auto my-2 flex h-9 w-full max-w-[320px] items-center rounded-lg border border-slate-300 px-3 text-slate-400 md:my-0 md:w-[clamp(180px,28vw,320px)]"><Search className="mr-2 h-4 w-4" /><input type="text" placeholder="Search vouchers, ledgers, items" className="w-full bg-transparent text-[11px] text-slate-800 outline-none placeholder:text-slate-400" /></label>
      <div className="ml-0 flex h-[60px] w-full shrink-0 items-stretch justify-end gap-2 md:ml-3 md:w-auto"><button type="button" onClick={() => (onOpenEway ? onOpenEway() : setShowEway(true))} className="flex w-[82px] items-center justify-center gap-2 border-0 border-r border-slate-200 bg-white text-[11px]"><span className="grid h-[18px] w-[18px] place-items-center rounded-full border border-red-400 text-red-500">!</span><span className="text-left leading-[13px]">Link<br />eInvoice</span></button><button type="button" onClick={onMobileVersionClick ?? (() => window.open('/mobile-version', '_blank', 'noopener,noreferrer'))} className="flex w-[106px] items-center justify-center gap-2 border-0 border-r border-slate-200 bg-white text-[11px]"><Smartphone className="h-4 w-4 text-slate-600" /><span className="text-left leading-[13px]">Mobile<br />Version</span></button><div className="flex items-center"><ConnectorStatusButton rows={connectorStatusRows} lastSyncMeta={lastSyncMeta} connectorStatusError={connectorStatusError} isConnectorStatusLoading={isConnectorStatusLoading} /></div><div className="relative"><button type="button" aria-label="Open profile menu" aria-expanded={showProfileMenu} onClick={() => setShowProfileMenu((current) => !current)} className="flex h-[60px] min-w-[75px] items-center justify-center gap-2 border-0 bg-white px-3 text-lg"><span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100"><User className="h-4 w-4 text-slate-600" /></span><ChevronDown className="h-4 w-4 text-slate-600" /></button>{showProfileMenu && <div className="absolute right-2 top-[60px] z-30 w-44 rounded border border-slate-200 bg-white p-1 shadow-lg" role="menu">{profileItems.map((label) => <button type="button" role="menuitem" key={label} onClick={() => { setShowProfileMenu(false); if (label === 'Profile') onProfileClick?.(); if (label === 'All User') onAllUsersClick?.(); if (label === 'Download Invoice') { window.history.pushState({}, '', '/download-invoice'); window.dispatchEvent(new PopStateEvent('popstate')); } if (label === 'Logout') onLogout?.(); }} className="block w-full rounded px-3 py-2 text-left text-xs hover:bg-slate-100">{label}</button>)}</div>}</div></div>
    </header>
    {showCompanyMenu && <button className="fixed inset-0 z-10 cursor-default bg-transparent" type="button" aria-label="Close company menu" onClick={() => setShowCompanyMenu(false)} />}
  </>
}

export default AppHeader

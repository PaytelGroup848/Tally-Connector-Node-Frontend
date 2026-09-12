
import { useState } from 'react'
import { ChevronDown, Menu, Search, Smartphone, User } from 'lucide-react'

const profileItems = ['Profile', 'All User', 'Download Invoice', 'Logout']

function ConnectorStatusButton({
  rows = [],
  lastSyncMeta = null,
  connectorStatusError = '',
  isConnectorStatusLoading = false,
}) {
  const [open, setOpen] = useState(false)

  const syncMeta = Array.isArray(lastSyncMeta) ? lastSyncMeta[0] : lastSyncMeta
  const lastSyncValue =
    syncMeta?.completedAt ||
    syncMeta?.lastSync ||
    syncMeta?.lastSyncedAt ||
    syncMeta?.updatedAt ||
    syncMeta?.timestamp ||
    null

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
        className="
          flex max-w-full items-center gap-2
          rounded-full border border-slate-200 bg-white
          px-3 py-1.5 text-[11px] font-semibold
          text-slate-700 shadow-sm transition
          hover:border-slate-300 hover:text-slate-900
        "
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${rows.some((row) => ['online', 'active', 'connected'].includes(String(row?.status || '').toLowerCase())) ? 'bg-emerald-500' : 'bg-red-500'}`}
        />

        <span className="flex min-w-0 flex-col items-start leading-none">
          <span className="truncate">Status</span>
          <span className="mt-0.5 text-[9px] font-normal text-slate-500">
            Last sync: {lastSyncLabel}
          </span>
        </span>

        <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-700">
          {rows.length || 0}
        </span>
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-50 mt-2 w-[calc(100vw-1rem)] max-w-[420px] -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl md:left-auto md:right-0 md:w-[420px] md:translate-x-0">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              Connector Status
            </p>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              Live
            </span>
          </div>

          {lastSyncMeta && (
            <div className="grid grid-cols-1 gap-2 border-b border-slate-200 bg-white px-3 py-2 text-[11px] text-slate-600 sm:grid-cols-2">
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Type
                </span>
                <span className="mt-1 block font-medium text-slate-800">
                  {lastSyncMeta.type || 'N/A'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </span>
                <span className="mt-1 block font-medium text-slate-800">
                  {lastSyncMeta.status || 'N/A'}
                </span>
              </div>

              <div className="col-span-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                  Last Sync
                </span>
                <span className="mt-1 block font-medium text-slate-800">
                  {lastSyncLabel}
                </span>
              </div>
            </div>
          )}

          <div className="max-h-[60vh] overflow-y-auto md:max-h-[320px]">
            {isConnectorStatusLoading ? (
              <div className="px-3 py-4 text-sm text-slate-500">
                Loading connector status...
              </div>
            ) : connectorStatusError ? (
              <div className="px-3 py-4 text-sm text-red-600">{connectorStatusError}</div>
            ) : rows.length === 0 ? (
              <div className="px-3 py-4 text-sm text-slate-500">
                No connector status available.
              </div>
            ) : (
              rows.map((connector, index) => {
                const deviceName =
                  connector?.deviceName ||
                  connector?.name ||
                  connector?.connectorName ||
                  `Connector ${index + 1}`

                const status = connector?.status || 'UNKNOWN'
                const lastHeartbeatValue =
                  connector?.lastHeartbeatAt ||
                  connector?.lastHeartbeat ||
                  connector?.heartbeatAt ||
                  null

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
                  <div
                    key={`${connector?.deviceId || deviceName}-${index}`}
                    className="border-b border-slate-100 px-3 py-2 last:border-b-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{deviceName}</p>
                      </div>

                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          ['online', 'active', 'connected'].includes(String(status).toLowerCase())
                            ? 'bg-emerald-100 text-emerald-700'
                            : ['offline', 'inactive', 'disconnected'].includes(String(status).toLowerCase())
                              ? 'bg-red-100 text-red-700'
                              : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                      <div>
                        <span className="mt-1 block">
                          {connector?.tallyConnected === true
                            ? 'Connected'
                            : connector?.tallyConnected === false
                              ? 'Disconnected'
                              : 'N/A'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-500">
                      <span className="font-medium text-slate-600">Last Updated:</span>
                      {' '}
                      {formattedLastHeartbeat}
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

function AppHeader({
  sidebarCollapsed,
  setSidebarCollapsed,
  setShowEway,
  onOpenEway,
  showProfileMenu,
  setShowProfileMenu,
  showCompanyMenu,
  setShowCompanyMenu,
  onProfileClick,
  onAllUsersClick,
  onMobileVersionClick,
  selectedCompany,
  companyOptions,
  onSelectCompany,
  onCompanyClick,
  onLogout,
  connectorStatusRows = [],
  lastSyncMeta = null,
  connectorStatusError = '',
  isConnectorStatusLoading = false,
}) {
  return (
    <>
      <header className="relative z-30 w-full border-b border-slate-300 bg-white shadow-[0_1px_3px_rgba(15,23,42,0.05)]">
        <div className="flex min-h-[60px] w-full items-stretch">

          {/* MENU */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={!sidebarCollapsed}
            onClick={() =>
              setSidebarCollapsed((current) => !current)
            }
            className="
              flex h-[60px] w-[58px] shrink-0 items-center justify-center
              border-0 border-r border-slate-300
              bg-white text-slate-700
              transition hover:bg-slate-50 hover:text-slate-900
            "
          >
            <Menu className="h-4 w-4" />
          </button>

          {/* COMPANY */}
          <div
            className="
              relative flex h-[60px] w-[clamp(190px,24vw,330px)]
              min-w-[190px] shrink-0 items-center gap-2
              border-r border-slate-300 bg-white px-4
              transition hover:bg-slate-50
            "
            role="button"
            tabIndex={0}
            aria-expanded={showCompanyMenu}
            onClick={() => {
              setShowCompanyMenu((current) => !current)
              setShowProfileMenu(false)
            }}
          >
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-[13px] font-semibold text-slate-900">
                {selectedCompany?.name || 'NA'}
              </strong>

              <span className="block truncate text-[10px] text-slate-500">
                {selectedCompany?.meta || ''}
              </span>
            </div>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                showCompanyMenu ? 'rotate-180' : ''
              }`}
            />

            {/* COMPANY DROPDOWN */}
            {showCompanyMenu && (
              <div
                className="
                  absolute left-0 top-[61px] z-50 w-[280px]
                  overflow-hidden rounded-lg
                  border border-slate-200 bg-white
                  shadow-[0_10px_30px_rgba(15,23,42,0.12)]
                "
                onClick={(event) =>
                  event.stopPropagation()
                }
              >
                <div className="border-b border-slate-200 bg-slate-50 px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    My Companies
                  </span>
                </div>

                <div className="max-h-[320px] overflow-y-auto p-1">
                  {companyOptions?.map((company) => (
                    <button
                      type="button"
                      key={company.id || company.name}
                      onClick={() => {
                        onCompanyClick?.(company)

                        if (!onCompanyClick) {
                          onSelectCompany?.(company)
                        }

                        setShowCompanyMenu(false)
                      }}
                      className="
                        flex w-full items-start gap-3 rounded-md
                        border-b border-transparent
                        px-3 py-2.5 text-left
                        transition
                        hover:border-slate-100
                        hover:bg-slate-50
                      "
                    >
                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-xs font-semibold text-slate-800">
                          {company.name || 'NA'}
                        </strong>

                        <small className="mt-0.5 block truncate text-[10px] text-slate-500">
                          {company.meta || ''}
                        </small>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SEARCH */}
          <label
            className="
              mx-4 my-auto flex h-9 min-w-[180px]
              max-w-[360px] flex-1 items-center gap-2
              rounded-md border border-slate-300
              bg-white px-3 text-slate-400
              transition
              focus-within:border-green-600
              focus-within:ring-2
              focus-within:ring-green-100
            "
          >
            <Search className="h-4 w-4 shrink-0" />

            <input
              type="text"
              placeholder="Search vouchers, ledgers, items"
              className="
                w-full min-w-0 bg-transparent
                text-[11px] text-slate-800
                outline-none
                placeholder:text-slate-400
              "
            />
          </label>

          {/* RIGHT ACTIONS */}
          <div
            className="
              ml-auto flex h-[60px] shrink-0 items-stretch
              border-l border-slate-300
            "
          >
            {/* LINK E-INVOICE */}
            <button
              type="button"
              onClick={() =>
                onOpenEway
                  ? onOpenEway()
                  : setShowEway(true)
              }
              className="
                flex h-[60px] w-[92px] items-center
                justify-center gap-2
                border-0 border-r border-slate-300
                bg-white text-[10px] text-slate-600
                transition hover:bg-slate-50
              "
            >
              <span
                className="
                  grid h-[19px] w-[19px] place-items-center
                  rounded-full border border-red-400
                  text-[11px] font-bold text-red-500
                "
              >
                !
              </span>

              <span className="text-left leading-[13px]">
                Link
                <br />
                eInvoice
              </span>
            </button>

            {/* MOBILE VERSION */}
            <button
              type="button"
              onClick={
                onMobileVersionClick ??
                (() =>
                  window.open(
                    '/mobile-version',
                    '_blank',
                    'noopener,noreferrer',
                  ))
              }
              className="
                flex h-[60px] w-[100px] items-center
                justify-center gap-2
                border-0 border-r border-slate-300
                bg-white text-[10px] text-slate-600
                transition hover:bg-slate-50
              "
            >
              <Smartphone className="h-4 w-4 text-slate-600" />

              <span className="text-left leading-[13px]">
                Mobile
                <br />
                Version
              </span>
            </button>

            {/* CONNECTOR STATUS */}
            <div
              className="
                flex h-[60px] min-w-[125px]
                items-center justify-center
                border-r border-slate-300
                bg-white px-2
              "
            >
              <ConnectorStatusButton
                rows={connectorStatusRows}
                lastSyncMeta={lastSyncMeta}
                connectorStatusError={
                  connectorStatusError
                }
                isConnectorStatusLoading={
                  isConnectorStatusLoading
                }
              />
            </div>

            {/* PROFILE */}
            <div className="relative flex h-[60px] min-w-[76px] items-center justify-center">
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                onClick={() => {
                  setShowProfileMenu(
                    (current) => !current,
                  )
                  setShowCompanyMenu(false)
                }}
                className="
                  flex h-[60px] w-full items-center
                  justify-center gap-2
                  border-0 bg-white
                  transition hover:bg-slate-50
                "
              >
                <span
                  className="
                    grid h-8 w-8 place-items-center
                    rounded-full border border-slate-200
                    bg-slate-50
                  "
                >
                  <User className="h-4 w-4 text-slate-600" />
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    showProfileMenu
                      ? 'rotate-180'
                      : ''
                  }`}
                />
              </button>

              {showProfileMenu && (
                <div
                  className="
                    absolute right-0 top-[61px] z-50
                    w-48 rounded-lg
                    border border-slate-200
                    bg-white p-1
                    shadow-[0_10px_30px_rgba(15,23,42,0.12)]
                  "
                  role="menu"
                >
                  {profileItems.map((label) => (
                    <button
                      type="button"
                      role="menuitem"
                      key={label}
                      onClick={() => {
                        setShowProfileMenu(false)

                        if (label === 'Profile') {
                          onProfileClick?.()
                        }

                        if (label === 'All User') {
                          onAllUsersClick?.()
                        }

                        if (
                          label ===
                          'Download Invoice'
                        ) {
                          window.history.pushState(
                            {},
                            '',
                            '/download-invoice',
                          )
                        }

                        if (label === 'Logout') {
                          onLogout?.()
                        }
                      }}
                      className="
                        block w-full rounded-md
                        px-3 py-2.5 text-left text-xs
                        text-slate-700
                        transition
                        hover:bg-slate-50
                        hover:text-slate-900
                      "
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        <div className="hidden border-t border-slate-200 px-3 py-2 max-[1023px]:block">
          <label
            className="
              flex h-9 w-full items-center gap-2
              rounded-md border border-slate-300
              bg-white px-3 text-slate-400
              focus-within:border-green-600
              focus-within:ring-2
              focus-within:ring-green-100
            "
          >
            <Search className="h-4 w-4 shrink-0" />

            <input
              type="text"
              placeholder="Search vouchers, ledgers, items"
              className="
                w-full bg-transparent
                text-[11px] text-slate-800
                outline-none
                placeholder:text-slate-400
              "
            />
          </label>
        </div>
      </header>

      {/* OUTSIDE CLICK */}
      {showCompanyMenu && (
        <button
          className="fixed inset-0 z-20 cursor-default bg-transparent"
          type="button"
          aria-label="Close company menu"
          onClick={() => setShowCompanyMenu(false)}
        />
      )}
    </>
  )
}

export default AppHeader

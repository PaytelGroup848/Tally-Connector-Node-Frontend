import { useState } from 'react'
import {
  ChevronDown,
  Menu,
  Search,
  Smartphone,
  User,
} from 'lucide-react'

const profileItems = [
  'Profile',
  'All User',
  'Download Invoice',
  'Logout',
]

function ConnectorStatusButton({
  rows = [],
  lastSyncMeta = null,
  connectorStatusError = '',
  isConnectorStatusLoading = false,
}) {
  const [open, setOpen] = useState(false)

  const syncMeta = Array.isArray(lastSyncMeta)
    ? lastSyncMeta[0]
    : lastSyncMeta

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

  const isOnline = rows.some((row) =>
    ['online', 'active', 'connected'].includes(
      String(row?.status || '').toLowerCase(),
    ),
  )

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="
          flex max-w-full items-center gap-2
          rounded-xl border border-app-border
          bg-white px-3 py-2
          text-[11px] font-semibold text-app-text
          shadow-sm transition
          hover:border-slate-300
        "
      >
        <span
          className={`h-2.5 w-2.5 rounded-full ${
            isOnline ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />

        <span className="flex min-w-0 flex-col items-start leading-none">
          <span className="truncate">Connector Status</span>
          <span className="mt-1 text-[9px] font-normal text-slate-500">
            Last sync: {lastSyncLabel}
          </span>
        </span>

        <span
          className="
            rounded-full bg-slate-100
            px-1.5 py-0.5 text-[10px]
            font-semibold text-slate-700
          "
        >
          {rows.length || 0}
        </span>
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-full z-50 mt-2
            w-[min(420px,calc(100vw-1rem))]
            overflow-hidden rounded-xl
            border border-app-border bg-white
            shadow-[0_18px_42px_rgba(15,23,42,0.14)]
          "
        >
          <div
            className="
              flex items-center justify-between
              border-b border-app-border
              bg-slate-50 px-4 py-3
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-app-text-secondary">
              Connector Status
            </p>

            <span
              className="
                rounded-full bg-emerald-50 px-2.5 py-1
                text-[10px] font-bold text-emerald-700
              "
            >
              Live
            </span>
          </div>

          {lastSyncMeta && (
            <div
              className="
                grid grid-cols-1 gap-3
                border-b border-app-border
                bg-white px-4 py-3
                text-[11px] text-app-text-secondary
                sm:grid-cols-2
              "
            >
              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Type
                </span>
                <span className="mt-1 block font-medium text-app-text">
                  {syncMeta?.type || 'N/A'}
                </span>
              </div>

              <div>
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </span>
                <span className="mt-1 block font-medium text-app-text">
                  {syncMeta?.status || 'N/A'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="block text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                  Last Sync
                </span>
                <span className="mt-1 block font-medium text-app-text">
                  {lastSyncLabel}
                </span>
              </div>
            </div>
          )}

          <div className="max-h-[320px] overflow-y-auto">
            {isConnectorStatusLoading ? (
              <div className="px-4 py-5 text-sm text-slate-500">
                Loading connector status...
              </div>
            ) : connectorStatusError ? (
              <div className="px-4 py-5 text-sm text-red-600">
                {connectorStatusError}
              </div>
            ) : rows.length === 0 ? (
              <div className="px-4 py-5 text-sm text-slate-500">
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

                  if (Number.isNaN(date.getTime())) {
                    return String(lastHeartbeatValue)
                  }

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

                const statusKey = String(status).toLowerCase()

                const statusClass =
                  ['online', 'active', 'connected'].includes(statusKey)
                    ? 'bg-emerald-50 text-emerald-700'
                    : ['offline', 'inactive', 'disconnected'].includes(statusKey)
                      ? 'bg-red-50 text-red-700'
                      : 'bg-amber-50 text-amber-700'

                return (
                  <div
                    key={`${deviceName}-${index}`}
                    className="
                      border-b border-app-border-light
                      px-4 py-4 last:border-b-0
                    "
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-app-text">
                          {deviceName}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          Tally connection
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClass}`}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <p className="text-[10px] text-slate-400">
                          Connection
                        </p>

                        <p className="mt-1 font-medium text-app-text">
                          {connector?.tallyConnected === true
                            ? 'Connected'
                            : connector?.tallyConnected === false
                              ? 'Disconnected'
                              : 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-400">
                          Last Updated
                        </p>

                        <p className="mt-1 font-medium text-app-text">
                          {formattedLastHeartbeat}
                        </p>
                      </div>
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
      <header className="app-header w-full">
        <div className="flex min-h-16 w-full items-stretch">
          {/* MENU */}
          <button
            type="button"
            aria-label="Menu"
            aria-expanded={!sidebarCollapsed}
            onClick={() => setSidebarCollapsed((current) => !current)}
            className="
              flex h-16 w-[60px] shrink-0
              items-center justify-center
              border-0 border-r border-app-border
              bg-white text-app-text-secondary
              transition hover:bg-slate-50 hover:text-app-text
            "
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* COMPANY */}
          <div
            className="
              relative flex h-16
              w-[clamp(210px,24vw,320px)]
              min-w-[190px] shrink-0
              items-center gap-3
              border-r border-app-border
              bg-white px-4
            "
            role="button"
            tabIndex={0}
            aria-expanded={showCompanyMenu}
            onClick={() => {
              setShowCompanyMenu((current) => !current)
              setShowProfileMenu(false)
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                setShowCompanyMenu((current) => !current)
                setShowProfileMenu(false)
              }
            }}
          >
            <div
              className="
                grid h-8 w-8 shrink-0
                place-items-center rounded-lg
                bg-slate-50 text-app-text
              "
            >
              <span className="text-sm font-bold">▦</span>
            </div>

            <div className="min-w-0 flex-1">
              <strong className="block truncate text-[12px] font-semibold text-app-text">
                {selectedCompany?.name || 'NA'}
              </strong>

              <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                {selectedCompany?.meta || ''}
              </span>
            </div>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${
                showCompanyMenu ? 'rotate-180' : ''
              }`}
            />

            {showCompanyMenu && (
              <div
                className="
                  absolute left-0 top-[65px] z-50
                  w-[300px] overflow-hidden
                  rounded-xl border border-app-border
                  bg-white shadow-[0_18px_42px_rgba(15,23,42,0.14)]
                "
                onClick={(event) => event.stopPropagation()}
              >
                <div className="border-b border-app-border bg-slate-50 px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    My Companies
                  </span>
                </div>

                <div className="max-h-[320px] overflow-y-auto p-1.5">
                  {companyOptions?.map((company) => (
                    <button
                      type="button"
                      key={company.id || company._id || company.name}
                      onClick={() => {
                        onCompanyClick?.(company)

                        if (!onCompanyClick) {
                          onSelectCompany?.(company)
                        }

                        setShowCompanyMenu(false)
                      }}
                      className="
                        flex w-full items-center gap-3
                        rounded-lg px-3 py-3
                        text-left transition
                        hover:bg-slate-50
                      "
                    >
                      <span
                        className="
                          grid h-8 w-8 shrink-0
                          place-items-center rounded-lg
                          bg-emerald-50 text-app-primary
                        "
                      >
                        ▦
                      </span>

                      <div className="min-w-0 flex-1">
                        <strong className="block truncate text-xs font-semibold text-app-text">
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
              mx-4 my-auto flex h-10 min-w-[180px]
              max-w-[430px] flex-1 items-center gap-2
              rounded-lg border border-app-border
              bg-slate-50/50 px-3 text-slate-400
              transition
              focus-within:border-app-primary
              focus-within:bg-white
              focus-within:ring-2 focus-within:ring-emerald-100
            "
          >
            <Search className="h-4 w-4 shrink-0" />

            <input
              type="text"
              placeholder="Search vouchers, ledgers, items..."
              className="
                w-full min-w-0 bg-transparent
                text-[12px] text-app-text
                outline-none
                placeholder:text-slate-400
              "
            />
          </label>

          {/* RIGHT ACTIONS */}
          <div className="ml-auto flex h-16 shrink-0 items-stretch">
            {/* LINK E-INVOICE */}
            <button
              type="button"
              onClick={() =>
                onOpenEway ? onOpenEway() : setShowEway?.(true)
              }
              className="
                hidden h-16 w-[92px]
                items-center justify-center gap-2
                border-0 border-l border-r border-app-border
                bg-white text-[10px] text-app-text-secondary
                transition hover:bg-slate-50
                md:flex
              "
            >
              <span
                className="
                  grid h-5 w-5 place-items-center
                  rounded-full border border-red-400
                  text-[10px] font-bold text-red-500
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
                hidden h-16 w-[100px]
                items-center justify-center gap-2
                border-0 border-r border-app-border
                bg-white text-[10px] text-app-text-secondary
                transition hover:bg-slate-50
                lg:flex
              "
            >
              <Smartphone className="h-4 w-4" />

              <span className="text-left leading-[13px]">
                Mobile
                <br />
                Version
              </span>
            </button>

            {/* CONNECTOR STATUS */}
            <div
              className="
                hidden h-16 min-w-[170px]
                items-center justify-center
                border-r border-app-border
                bg-white px-2
                lg:flex
              "
            >
              <ConnectorStatusButton
                rows={connectorStatusRows}
                lastSyncMeta={lastSyncMeta}
                connectorStatusError={connectorStatusError}
                isConnectorStatusLoading={isConnectorStatusLoading}
              />
            </div>

            {/* PROFILE */}
            <div className="relative flex h-16 min-w-[104px] items-center">
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                onClick={() => {
                  setShowProfileMenu((current) => !current)
                  setShowCompanyMenu(false)
                }}
                className="
                  flex h-16 w-full items-center
                  justify-center gap-2
                  border-0 bg-white px-3
                  transition hover:bg-slate-50
                "
              >
                <span
                  className="
                    grid h-9 w-9 place-items-center
                    rounded-full border border-app-border
                    bg-slate-50
                  "
                >
                  <User className="h-4 w-4 text-app-text-secondary" />
                </span>

                <span className="hidden text-[12px] font-semibold text-app-text sm:block">
                  Admin
                </span>

                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition-transform ${
                    showProfileMenu ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {showProfileMenu && (
                <div
                  className="
                    absolute right-0 top-[65px] z-50 w-52
                    rounded-xl border border-app-border
                    bg-white p-1.5
                    shadow-[0_18px_42px_rgba(15,23,42,0.14)]
                  "
                  role="menu"
                >
                  {profileItems.map((label) => (
                    <button
                      key={label}
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        setShowProfileMenu(false)

                        if (label === 'Profile') {
                          onProfileClick?.()
                        }

                        if (label === 'All User') {
                          onAllUsersClick?.()
                        }

                        if (label === 'Download Invoice') {
                          window.history.pushState(
                            {},
                            '',
                            '/download-invoice',
                          )
                          window.dispatchEvent(new PopStateEvent('popstate'))
                        }

                        if (label === 'Logout') {
                          onLogout?.()
                        }
                      }}
                      className="
                        block w-full rounded-lg
                        px-3 py-2.5 text-left
                        text-xs text-app-text-secondary
                        transition
                        hover:bg-slate-50 hover:text-app-text
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
        <div className="border-t border-app-border-light px-3 py-2 lg:hidden">
          <label
            className="
              flex h-10 w-full items-center gap-2
              rounded-lg border border-app-border
              bg-slate-50/50 px-3 text-slate-400
              focus-within:border-app-primary
              focus-within:bg-white
              focus-within:ring-2 focus-within:ring-emerald-100
            "
          >
            <Search className="h-4 w-4 shrink-0" />

            <input
              type="text"
              placeholder="Search vouchers, ledgers, items..."
              className="
                w-full bg-transparent
                text-[12px] text-app-text
                outline-none
                placeholder:text-slate-400
              "
            />
          </label>
        </div>
      </header>

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

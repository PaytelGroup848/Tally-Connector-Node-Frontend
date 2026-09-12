
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

/* ============================================================
   CONNECTOR STATUS
============================================================ */

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

  const formatDateTime = (value) => {
    if (!value) return 'N/A'

    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return String(value)
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
  }

  const lastSyncLabel = lastSyncValue
    ? formatDateTime(lastSyncValue)
    : 'No sync yet'

  const isOnline = rows.some((row) =>
    ['online', 'active', 'connected'].includes(
      String(row?.status || '').toLowerCase(),
    ),
  )

  return (
    <div className="relative flex items-center">
      <button
        type="button"
        aria-label="Open connector status"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="
          flex h-10 min-w-0 max-w-full
          items-center gap-2
          rounded-lg
          border border-app-border
          bg-white
          px-2.5
          shadow-sm
          transition
          hover:border-slate-300
        "
      >
        <span
          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
            isOnline ? 'bg-emerald-500' : 'bg-red-500'
          }`}
        />

        <span className="flex min-w-0 flex-1 flex-col items-start justify-center leading-none">
          <span className="truncate text-[10px] font-semibold text-app-text">
            Connector Status
          </span>

          <span className="mt-1 max-w-[105px] truncate text-[8px] font-normal text-slate-500">
            Last sync: {lastSyncLabel}
          </span>
        </span>

        <span
          className="
            flex h-5 min-w-5
            shrink-0
            items-center justify-center
            rounded-full
            bg-slate-100
            px-1.5
            text-[9px]
            font-semibold
            text-slate-700
          "
        >
          {rows.length || 0}
        </span>

        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-slate-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute right-0 top-full z-[200]
            mt-2
            w-[min(420px,calc(100vw-16px))]
            overflow-hidden
            rounded-xl
            border border-app-border
            bg-white
            shadow-[0_18px_42px_rgba(15,23,42,0.14)]
          "
        >
          <div
            className="
              flex h-12
              items-center
              justify-between
              border-b border-app-border
              bg-slate-50
              px-4
            "
          >
            <p className="text-[10px] font-semibold uppercase tracking-wide text-app-text-secondary">
              Connector Status
            </p>

            <span
              className="
                rounded-full
                bg-emerald-50
                px-2.5 py-1
                text-[10px]
                font-bold
                text-emerald-700
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
                px-4 py-3
                sm:grid-cols-2
              "
            >
              <div>
                <span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Type
                </span>

                <span className="mt-1 block text-[11px] font-medium text-app-text">
                  {syncMeta?.type || 'N/A'}
                </span>
              </div>

              <div>
                <span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Status
                </span>

                <span className="mt-1 block text-[11px] font-medium text-app-text">
                  {syncMeta?.status || 'N/A'}
                </span>
              </div>

              <div className="sm:col-span-2">
                <span className="block text-[9px] font-semibold uppercase tracking-wide text-slate-400">
                  Last Sync
                </span>

                <span className="mt-1 block text-[11px] font-medium text-app-text">
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

                const heartbeat =
                  connector?.lastHeartbeatAt ||
                  connector?.lastHeartbeat ||
                  connector?.heartbeatAt ||
                  null

                const statusKey = String(status).toLowerCase()

                const statusClass = [
                  'online',
                  'active',
                  'connected',
                ].includes(statusKey)
                  ? 'bg-emerald-50 text-emerald-700'
                  : [
                        'offline',
                        'inactive',
                        'disconnected',
                      ].includes(statusKey)
                    ? 'bg-red-50 text-red-700'
                    : 'bg-amber-50 text-amber-700'

                return (
                  <div
                    key={`${deviceName}-${index}`}
                    className="
                      border-b border-app-border-light
                      px-4 py-4
                      last:border-b-0
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
                        className={`
                          shrink-0
                          rounded-full
                          px-2.5 py-1
                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide
                          ${statusClass}
                        `}
                      >
                        {status}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[9px] text-slate-400">
                          Connection
                        </p>

                        <p className="mt-1 text-[11px] font-medium text-app-text">
                          {connector?.tallyConnected === true
                            ? 'Connected'
                            : connector?.tallyConnected === false
                              ? 'Disconnected'
                              : 'N/A'}
                        </p>
                      </div>

                      <div>
                        <p className="text-[9px] text-slate-400">
                          Last Updated
                        </p>

                        <p className="mt-1 truncate text-[11px] font-medium text-app-text">
                          {formatDateTime(heartbeat)}
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

/* ============================================================
   APP HEADER
============================================================ */

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
  companyOptions = [],
  onSelectCompany,
  onCompanyClick,
  onLogout,
  connectorStatusRows = [],
  lastSyncMeta = null,
  connectorStatusError = '',
  isConnectorStatusLoading = false,
}) {
  const toggleCompanyMenu = () => {
    setShowCompanyMenu((current) => !current)
    setShowProfileMenu(false)
  }

  const toggleProfileMenu = () => {
    setShowProfileMenu((current) => !current)
    setShowCompanyMenu(false)
  }

  const handleCompanySelect = (company) => {
    if (onCompanyClick) {
      onCompanyClick(company)
    } else {
      onSelectCompany?.(company)
    }

    setShowCompanyMenu(false)
  }

  const handleProfileAction = (label) => {
    setShowProfileMenu(false)

    if (label === 'Profile') {
      onProfileClick?.()
      return
    }

    if (label === 'All User') {
      onAllUsersClick?.()
      return
    }

    if (label === 'Download Invoice') {
      window.history.pushState(
        {},
        '',
        '/download-invoice',
      )

      window.dispatchEvent(new PopStateEvent('popstate'))
      return
    }

    if (label === 'Logout') {
      onLogout?.()
    }
  }

  return (
    <>
      <header className="app-header relative w-full">
        {/* ====================================================
            TOP ROW
        ===================================================== */}
        <div
          className="
            flex h-16 min-h-16
            w-full min-w-0
            items-stretch
            overflow-visible
            bg-white
          "
        >
          {/* ==================================================
              MENU
          =================================================== */}
          <div className="flex h-16 w-14 shrink-0 items-center justify-center border-r border-app-border">
            <button
              type="button"
              aria-label="Toggle sidebar"
              aria-expanded={!sidebarCollapsed}
              onClick={() =>
                setSidebarCollapsed(
                  (current) => !current,
                )
              }
              className="
                flex h-10 w-10
                items-center justify-center
                rounded-lg
                bg-white
                text-app-text-secondary
                transition
                hover:bg-slate-50
                hover:text-app-text
              "
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* ==================================================
              COMPANY
          =================================================== */}
          <div
            className="
              relative
              flex h-16
              w-[230px]
              min-w-[180px]
              shrink-0
              items-center
              border-r border-app-border
            "
          >
            <button
              type="button"
              aria-label="Select company"
              aria-expanded={showCompanyMenu}
              onClick={toggleCompanyMenu}
              className="
                flex h-full w-full
                items-center
                gap-3
                px-3.5
                text-left
                outline-none
              "
            >
              {/* COMPANY ICON */}
              <span
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-slate-50
                  text-app-text
                "
              >
                <span className="text-sm font-bold">
                  ▦
                </span>
              </span>

              {/* COMPANY TEXT */}
              <span className="min-w-0 flex-1">
                <strong
                  className="
                    block truncate
                    text-[12px]
                    font-semibold
                    leading-4
                    text-app-text
                  "
                >
                  {selectedCompany?.name || 'NA'}
                </strong>

                <span
                  className="
                    mt-0.5 block truncate
                    text-[10px]
                    leading-3
                    text-slate-500
                  "
                >
                  {selectedCompany?.meta || ''}
                </span>
              </span>

              <ChevronDown
                className={`
                  h-4 w-4
                  shrink-0
                  text-slate-500
                  transition-transform
                  ${
                    showCompanyMenu
                      ? 'rotate-180'
                      : ''
                  }
                `}
              />
            </button>

            {/* COMPANY DROPDOWN */}
            {showCompanyMenu && (
              <div
                className="
                  absolute
                  left-2
                  top-[62px]
                  z-[200]
                  w-[300px]
                  overflow-hidden
                  rounded-xl
                  border border-app-border
                  bg-white
                  shadow-[0_18px_42px_rgba(15,23,42,0.14)]
                "
              >
                <div className="border-b border-app-border bg-slate-50 px-4 py-3">
                  <p className="m-0 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    My Companies
                  </p>
                </div>

                <div className="max-h-[320px] overflow-y-auto p-1.5">
                  {companyOptions.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-slate-500">
                      No companies available.
                    </div>
                  ) : (
                    companyOptions.map((company) => {
                      const key =
                        company?.id ||
                        company?._id ||
                        company?.name

                      const isSelected =
                        company?.id ===
                          selectedCompany?.id ||
                        company?._id ===
                          selectedCompany?._id

                      return (
                        <button
                          type="button"
                          key={key}
                          onClick={() =>
                            handleCompanySelect(company)
                          }
                          className="
                            flex w-full
                            items-center
                            gap-3
                            rounded-lg
                            px-3 py-3
                            text-left
                            transition
                            hover:bg-slate-50
                          "
                        >
                          <span
                            className="
                              flex h-8 w-8
                              shrink-0
                              items-center
                              justify-center
                              rounded-lg
                              bg-emerald-50
                              text-app-primary
                            "
                          >
                            ▦
                          </span>

                          <span className="min-w-0 flex-1">
                            <strong className="block truncate text-xs font-semibold text-app-text">
                              {company?.name || 'NA'}
                            </strong>

                            <small className="mt-0.5 block truncate text-[10px] text-slate-500">
                              {company?.meta || ''}
                            </small>
                          </span>

                          {isSelected && (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-app-primary" />
                          )}
                        </button>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ==================================================
              DESKTOP SEARCH
          =================================================== */}
          <div className="hidden min-w-0 flex-1 items-center lg:flex">
            <label
              className="
                mx-4
                flex h-10
                min-w-0
                max-w-[460px]
                flex-1
                items-center
                gap-2
                rounded-lg
                border border-app-border
                bg-slate-50/50
                px-3
                text-slate-400
                transition
                focus-within:border-app-primary
                focus-within:bg-white
                focus-within:ring-2
                focus-within:ring-emerald-100
              "
            >
              <Search className="h-4 w-4 shrink-0" />

              <input
                type="text"
                placeholder="Search vouchers, ledgers, items..."
                className="
                  w-full min-w-0
                  bg-transparent
                  text-[12px]
                  text-app-text
                  outline-none
                  placeholder:text-slate-400
                "
              />
            </label>
          </div>

          {/* ==================================================
              RIGHT ACTIONS
          =================================================== */}
          <div
            className="
              ml-auto
              flex h-16
              shrink-0
              items-stretch
            "
          >
            {/* LINK E-INVOICE */}
            <button
              type="button"
              onClick={() =>
                onOpenEway
                  ? onOpenEway()
                  : setShowEway?.(true)
              }
              className="
                hidden h-16 w-[78px]
                shrink-0
                items-center
                justify-center
                gap-1.5
                border-r border-app-border
                bg-white
                text-[9px]
                leading-3
                text-app-text-secondary
                transition
                hover:bg-slate-50
                md:flex
              "
            >
              <span
                className="
                  flex h-5 w-5
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border border-red-400
                  text-[10px]
                  font-bold
                  text-red-500
                "
              >
                !
              </span>

              <span>
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
                hidden h-16 w-[82px]
                shrink-0
                items-center
                justify-center
                gap-1.5
                border-r border-app-border
                bg-white
                text-[9px]
                leading-3
                text-app-text-secondary
                transition
                hover:bg-slate-50
                lg:flex
              "
            >
              <Smartphone className="h-4 w-4 shrink-0" />

              <span>
                Mobile
                <br />
                Version
              </span>
            </button>

            {/* CONNECTOR */}
            <div
              className="
                hidden h-16
                w-[180px]
                shrink-0
                items-center
                justify-center
                border-r border-app-border
                bg-white
                px-2
                lg:flex
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
            <div
              className="
                relative
                flex h-16
                w-[92px]
                shrink-0
              "
            >
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                onClick={toggleProfileMenu}
                className="
                  flex h-16
                  w-full
                  items-center
                  justify-center
                  gap-2
                  bg-white
                  px-2
                  transition
                  hover:bg-slate-50
                "
              >
                <span
                  className="
                    flex h-9 w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border border-app-border
                    bg-slate-50
                  "
                >
                  <User className="h-4 w-4 text-app-text-secondary" />
                </span>

                <span className="hidden text-[11px] font-semibold text-app-text xl:block">
                  Admin
                </span>

                <ChevronDown
                  className={`
                    h-4 w-4
                    shrink-0
                    text-slate-500
                    transition-transform
                    ${
                      showProfileMenu
                        ? 'rotate-180'
                        : ''
                    }
                  `}
                />
              </button>

              {/* PROFILE DROPDOWN */}
              {showProfileMenu && (
                <div
                  className="
                    absolute
                    right-0
                    top-[62px]
                    z-[200]
                    w-52
                    overflow-hidden
                    rounded-xl
                    border border-app-border
                    bg-white
                    p-1.5
                    shadow-[0_18px_42px_rgba(15,23,42,0.14)]
                  "
                >
                  {profileItems.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() =>
                        handleProfileAction(label)
                      }
                      className="
                        block
                        w-full
                        rounded-lg
                        px-3 py-2.5
                        text-left
                        text-xs
                        text-app-text-secondary
                        transition
                        hover:bg-slate-50
                        hover:text-app-text
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

        {/* ====================================================
            MOBILE SEARCH
        ===================================================== */}
        <div
          className="
            border-t
            border-app-border-light
            bg-white
            px-3
            py-2
            lg:hidden
          "
        >
          <label
            className="
              flex h-10
              w-full
              items-center
              gap-2
              rounded-lg
              border border-app-border
              bg-slate-50/50
              px-3
              text-slate-400
              transition
              focus-within:border-app-primary
              focus-within:bg-white
              focus-within:ring-2
              focus-within:ring-emerald-100
            "
          >
            <Search className="h-4 w-4 shrink-0" />

            <input
              type="text"
              placeholder="Search vouchers, ledgers, items..."
              className="
                w-full min-w-0
                bg-transparent
                text-[12px]
                text-app-text
                outline-none
                placeholder:text-slate-400
              "
            />
          </label>
        </div>
      </header>

      {/* ======================================================
          OUTSIDE CLICK
      ======================================================= */}
      {showCompanyMenu && (
        <button
          type="button"
          aria-label="Close company menu"
          onClick={() => setShowCompanyMenu(false)}
          className="
            fixed
            inset-0
            z-[100]
            cursor-default
            bg-transparent
          "
        />
      )}
    </>
  )
}

export default AppHeader

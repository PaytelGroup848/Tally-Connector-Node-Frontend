import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Menu,
  Search,
  Smartphone,
  User,
} from "lucide-react";

const profileItems = [
  "Profile",
  "All User",
  // "Download Invoice",
  "Logout",
];

/* ============================================================
   CONNECTOR STATUS
============================================================ */

function ConnectorStatusButton({
  rows = [],
  lastSyncMeta = null,
  connectorStatusError = "",
  isConnectorStatusLoading = false,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleRouteChange = () => {
      setOpen(false);
    };

    const handleOutsideClick = (event) => {
      if (!open) return;

      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      window.removeEventListener(
        "popstate",
        handleRouteChange,
      );

      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [open]);

  const syncMeta = Array.isArray(lastSyncMeta)
    ? lastSyncMeta[0]
    : lastSyncMeta;

  const lastSyncValue =
    syncMeta?.completedAt ||
    syncMeta?.lastSync ||
    syncMeta?.lastSyncedAt ||
    syncMeta?.updatedAt ||
    syncMeta?.timestamp ||
    null;

  const formatDateTime = (value) => {
    if (!value) return "N/A";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return String(value);
    }

    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const lastSyncLabel = lastSyncValue
    ? formatDateTime(lastSyncValue)
    : "No sync yet";

  /* ============================================================
     STATUS HELPERS
  ============================================================ */

  const getStatusType = (status) => {
    const statusKey = String(status || "").toLowerCase();

    if (
      ["online", "active", "connected"].includes(
        statusKey,
      )
    ) {
      return "online";
    }

    if (
      ["offline", "inactive", "disconnected"].includes(
        statusKey,
      )
    ) {
      return "offline";
    }

    return "unknown";
  };

  const getStatusDotClass = (statusType) => {
    if (statusType === "online") {
      return `
        bg-emerald-400
        shadow-[0_0_8px_rgba(52,211,153,0.65)]
      `;
    }

    if (statusType === "offline") {
      return `
        bg-red-500
        shadow-[0_0_8px_rgba(248,113,113,0.55)]
      `;
    }

    return `
      bg-red-500
      shadow-[0_0_8px_rgba(248,113,113,0.55)]
    `;
  };

  const getStatusBadgeClass = (statusType) => {
    if (statusType === "online") {
      return `
        border
        border-emerald-300/[0.12]
        bg-emerald-300/[0.10]
        text-emerald-200
      `;
    }

    if (statusType === "offline") {
      return `
        border
        border-red-300/[0.12]
        bg-red-300/[0.08]
        text-red-200
      `;
    }

    return `
      border
      border-red-300/[0.12]
      bg-red-300/[0.08]
      text-red-700
    `;
  };

  const getConnectionTextClass = (tallyConnected) => {
    if (tallyConnected === true) {
      return "text-emerald-300";
    }

    if (tallyConnected === false) {
      return "text-red-300";
    }

    return "text-red-300";
  };

  const overallStatusType =
    rows.length > 0
      ? getStatusType(
        rows.find((row) =>
          ["online", "active", "connected"].includes(
            String(row?.status || "").toLowerCase(),
          ),
        )?.status || rows[0]?.status,
      )
      : "unknown";

  return (
    <div
      ref={menuRef}
      className="
        connector-status
        relative
        flex
        w-full
        min-w-0
        items-center
        justify-center
      "
    >
      {/* ========================================================
          CONNECTOR BUTTON
      ======================================================== */}

      <button
        type="button"
        aria-label="Open connector status"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="
          group

          flex
          h-11
          w-full
          min-w-0
          max-w-full

          items-center
          gap-2

          rounded-xl

          border
          border-black/[0.10]

          bg-white/[0.055]

          px-3

          text-black

          shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]

          backdrop-blur-md

          transition-all
          duration-200

          hover:border-white/[0.16]
          hover:bg-white/[0.08]

          active:bg-white/[0.10]
        "
      >
        <span
          className={`
            h-2.5
            w-2.5
            shrink-0
            rounded-full
            ${getStatusDotClass(overallStatusType)}
          `}
        />

        <span
          className="
            flex
            min-w-0
            flex-1
            flex-col
            items-start
            justify-center
            leading-none
          "
        >
          <span
            className="
              truncate
              text-[10px]
              font-semibold
              text-black
            "
          >
            Connector Status
          </span>

          <span
            className="
              mt-0.5
              truncate
              whitespace-nowrap
              text-[8px]
              text-black
            "
          >
            Last Sync History
          </span>
        </span>

        {/* <span
          className="
            flex
            h-5
            min-w-5
            shrink-0
            items-center
            justify-center

            rounded-full

            border
            border-white/[0.07]

            bg-white/[0.07]

            px-1.5
          
            text-[9px]
            font-semibold
            text-white/[0.72]
          "
        >
          {rows.length || 0}
        </span> */}

        <ChevronDown
          className={`
            h-3.5
            w-3.5
            shrink-0

            text-black

            transition-transform
            duration-200

            ${open ? "rotate-180" : ""}
          `}
        />
      </button>

      {/* ========================================================
          CONNECTOR DROPDOWN
      ======================================================== */}

      {open && (
        <div
          className="
            connector-status-menu

            absolute
            right-0
            top-full
            z-[1100]

            mt-2

            w-[min(420px,calc(100vw-16px))]

            overflow-hidden

            rounded-xl

            border
            border-black/[0.10]

            bg-white

            text-black

            shadow-[0_18px_42px_rgba(0,0,0,0.35)]

            backdrop-blur-[24px]
            backdrop-saturate-[150%]
          "
        >
          {/* Background glows */}
          <div
            className="
              pointer-events-none
              absolute
              inset-0
              overflow-hidden
            "
          >
            <div
              className="
                absolute
                -right-16
                -top-16

                h-40
                w-40

                rounded-full

                bg-emerald-400/[0.06]

                blur-[50px]
              "
            />

            <div
              className="
                absolute
                -bottom-20
                -left-16

                h-40
                w-40

                rounded-full

                bg-cyan-400/[0.025]

                blur-[55px]
              "
            />
          </div>

          <div className="relative z-10">
            {/* HEADER */}
            <div
              className="
                flex
                min-h-14
                items-center
                justify-between
                text-black
                border-b
                border-black/[0.07]
                bg-white
                px-4
                py-2.5
              "
            >
              <div className="flex flex-col">
                <p
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-gray-900
                  "
                >
                  Connector Status
                </p>
              </div>

              <span
                className={`
                  rounded-full
                  px-2.5
                  py-1

                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-wide

                  ${getStatusBadgeClass(
                  overallStatusType,
                )}
                `}
              >
                {overallStatusType}
              </span>
            </div>

            {/* LAST SYNC */}
            <div
              className="
                flex
                items-center
                justify-center

                border-b
                border-gray-100

                bg-black/[0.02]

                px-4
                py-2.5
              "
            >
              <span
                className="
                  whitespace-nowrap

                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wide

                  text-gray-500
                "
              >
                Last Sync History
              </span>
            </div>

            {/* LAST SYNC META */}
            {lastSyncMeta && (
              <div
                className="
                  grid
                  grid-cols-1
                  gap-3

                  border-b
                  border-gray-100

                  px-4
                  py-3

                  sm:grid-cols-2
                "
              >
                <div>
                  <span
                    className="
                      block
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                  >
                    Type
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[11px]
                      font-medium
                      text-gray-800
                    "
                  >
                    {syncMeta?.type || "N/A"}
                  </span>
                </div>

                <div>
                  <span
                    className="
                      block
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                  >
                    Status
                  </span>

                  <span
                    className={`
                      mt-1
                      inline-flex
                      rounded-full
                      px-2
                      py-0.5

                      text-[10px]
                      font-semibold
                      uppercase

                      ${getStatusBadgeClass(
                      getStatusType(
                        syncMeta?.status,
                      ),
                    )}
                    `}
                  >
                    {syncMeta?.status || "N/A"}
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <span
                    className="
                      block
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wide
                      text-gray-400
                    "
                  >
                    Last Sync At
                  </span>

                  <span
                    className="
                      mt-1
                      block
                      text-[11px]
                      font-medium
                      text-gray-800
                    "
                  >
                    {lastSyncLabel}
                  </span>
                </div>
              </div>
            )}

            {/* CONNECTOR LIST */}
            <div
              className="
    glass-scrollbar
    max-h-[320px]
    overflow-y-auto
  "
            >
              {isConnectorStatusLoading ? (
                <div className="px-4 py-5 text-sm text-gray-500">
                  Loading connector status...
                </div>
              ) : connectorStatusError ? (
                <div className="px-4 py-5 text-sm text-red-300">
                  {connectorStatusError}
                </div>
              ) : rows.length === 0 ? (
                <div className="px-4 py-5 text-sm text-gray-500">
                  No connector status available.
                </div>
              ) : (
                rows.map((connector, index) => {
                  const deviceName =
                    connector?.deviceName ||
                    connector?.name ||
                    connector?.connectorName ||
                    `Connector ${index + 1}`;

                  const status =
                    connector?.status || "UNKNOWN";

                  const statusType =
                    getStatusType(status);

                  const statusDotClass =
                    getStatusDotClass(statusType);

                  const statusBadgeClass =
                    getStatusBadgeClass(statusType);

                  const heartbeat =
                    connector?.lastHeartbeatAt ||
                    connector?.lastHeartbeat ||
                    connector?.heartbeatAt ||
                    null;

                  const connectionClass =
                    getConnectionTextClass(
                      connector?.tallyConnected,
                    );

                  return (
                    <div
                      key={`${deviceName}-${index}`}
                      className="
                        border-b
                        border-gray-100

                        px-4
                        py-4

                        last:border-b-0
                      "
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <span
                            className={`
                              h-2.5
                              w-2.5
                              shrink-0
                              rounded-full
                              ${statusDotClass}
                            `}
                          />

                          <div className="min-w-0">
                            <p
                              className="
                                truncate
                                text-xs
                                font-semibold
                                text-gray-900
                              "
                            >
                              {deviceName}
                            </p>

                            <p
                              className="
                                mt-1
                                text-[10px]
                                font-bold
                                text-gray-500
                              "
                            >
                              Tally connection
                            </p>
                          </div>
                        </div>

                        <span
                          className={`
                            shrink-0
                            rounded-full

                            px-2.5
                            py-1

                            text-[10px]
                            font-semibold
                            uppercase
                            tracking-wide

                            ${statusBadgeClass}
                          `}
                        >
                          {status}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[9px] font-medium text-gray-400">
                            Connection
                          </p>

                          <p
                            className={`
                              mt-1
                              text-[11px]
                              font-semibold
                              ${connectionClass}
                            `}
                          >
                            {connector?.tallyConnected ===
                              true
                              ? "Connected"
                              : connector?.tallyConnected ===
                                false
                                ? "Disconnected"
                                : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-medium text-gray-400">
                            Last Updated
                          </p>

                          <p
                            className="
                              mt-1
                              truncate
                              text-[11px]
                              font-medium
                              text-gray-700
                            "
                          >
                            {formatDateTime(heartbeat)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
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
  onNavigate,
  onMobileVersionClick,
  selectedCompany,
  companyOptions = [],
  onSelectCompany,
  onLogout,
  connectorStatusRows = [],
  lastSyncMeta = null,
  connectorStatusError = "",
  isConnectorStatusLoading = false,
}) {
  const headerRef = useRef(null);

  const getCompanyId = (company) =>
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id ||
    null;

  /* ============================================================
     COMPANY LIST
  ============================================================ */

  const companies = Array.isArray(companyOptions)
    ? companyOptions.filter((company) => {
      const name = String(
        company?.name ||
        company?.companyName ||
        "",
      )
        .trim()
        .toLowerCase();

      if (!name) return false;

      const dummyNames = [
        "dummy",
        "dummy company",
        "unnamed company",
        "test",
        "test company",
        "na",
        "n/a",
      ];

      return !dummyNames.includes(name);
    })
    : [];

  /* ============================================================
     EFFECTS
  ============================================================ */

  useEffect(() => {
    const handleRouteClose = () => {
      setShowCompanyMenu(false);
      setShowProfileMenu(false);
    };

    const handleOutsideClick = (event) => {
      if (headerRef.current?.contains(event.target)) {
        return;
      }

      setShowCompanyMenu(false);
      setShowProfileMenu(false);
    };

    window.addEventListener(
      "popstate",
      handleRouteClose,
    );

    document.addEventListener(
      "mousedown",
      handleOutsideClick,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        handleRouteClose,
      );

      document.removeEventListener(
        "mousedown",
        handleOutsideClick,
      );
    };
  }, [
    setShowCompanyMenu,
    setShowProfileMenu,
  ]);

  /* ============================================================
     DROPDOWN TOGGLES
  ============================================================ */

  const toggleCompanyMenu = () => {
    if (!selectedCompany) return;

    setShowCompanyMenu((current) => !current);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((current) => !current);
    setShowCompanyMenu(false);
  };

  const closeAllDropdowns = () => {
    setShowCompanyMenu(false);
    setShowProfileMenu(false);
  };

  /* ============================================================
     COMPANY SELECTION
  ============================================================ */

  const handleCompanySelect = (company) => {
    if (!company) return;

    onSelectCompany?.(company);

    onNavigate?.("/dashboard");

    closeAllDropdowns();
  };

  /* ============================================================
     PROFILE ACTIONS
  ============================================================ */

  const handleProfileAction = (label) => {
    closeAllDropdowns();

    if (label === "Profile") {
      onNavigate?.("/profile");
      onProfileClick?.();
      return;
    }

    if (label === "All User") {
      onNavigate?.("/all-users");
      onAllUsersClick?.();
      return;
    }

    if (label === "Download Invoice") {
      onNavigate?.("/download-invoice");
      return;
    }

    if (label === "Logout") {
      onLogout?.();
    }
  };

  return (
    <>
      <header
        ref={headerRef}
        className="
          app-header
          relative
          z-[1000]

          w-full

          overflow-visible

          border-b
          border-gray-200

          bg-white

          text-gray-900

          shadow-sm
        "
      >
        {/* ====================================================
            TOP ROW
        ===================================================== */}

        <div
          className="
    relative
    z-50

    flex
    h-16
    min-h-16
    w-full
    min-w-0
    items-stretch
    overflow-visible
    bg-transparent
    px-0
    sm:px-2
  "
        >
          {/* ==================================================
              MENU
          =================================================== */}

          <div
            className="
              flex
              h-16
              w-12
              shrink-0

              items-center
              justify-center

              border-r
              border-black/[0.06]

              bg-black/[0.02]

              sm:w-14
            "
          >
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
                flex
                h-10
                w-10

                items-center
                justify-center

                rounded-xl

                border
                border-black/[0.08]

                bg-black/[0.04]

                text-emerald-700

                shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]

                transition-all

                active:scale-95

                hover:border-black/[0.15]
                hover:bg-black/[0.05]
                hover:text-gray-900
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

              flex
              h-16
              min-w-0
              flex-1
              shrink

              items-center

              border-r
              border-black/[0.06]

              bg-black/[0.02]

              sm:w-[230px]
              sm:min-w-[180px]
              sm:flex-none
            "
          >
            <button
              type="button"
              aria-label={
                selectedCompany
                  ? "Select company"
                  : "No company selected"
              }
              aria-expanded={
                selectedCompany
                  ? showCompanyMenu
                  : false
              }
              onClick={toggleCompanyMenu}
              disabled={!selectedCompany}
              className={`
                flex
                h-full
                w-full

                items-center
                gap-2

                px-2

                text-left

                outline-none

                transition-all

                sm:gap-3
                sm:px-5

                ${selectedCompany
                  ? `
                      cursor-pointer
                      hover:bg-black/[0.03]
                    `
                  : `
                      cursor-not-allowed
                      bg-black/[0.04]
                    `
                }
              `}
            >
              {/* COMPANY TEXT */}
              <span className="min-w-0 flex-1">
                <strong
                  className="
                    block
                    truncate

                    text-[12px]
                    font-semibold
                    leading-4

                    text-gray-900
                  "
                >
                  {selectedCompany?.name ||
                    selectedCompany?.companyName ||
                    "No company selected"}
                </strong>

                <span
                  className="
                    mt-0.5
                    block
                    truncate

                    text-[10px]
                    leading-3

                    text-gray-500
                  "
                >
                  {selectedCompany?.meta ||
                    selectedCompany?.city ||
                    ""}
                </span>
              </span>

              {/* COMPANY ARROW */}
              {selectedCompany && (
                <ChevronDown
                  className={`
                    h-4
                    w-4
                    shrink-0

                    text-gray-500

                    transition-transform

                    ${showCompanyMenu
                      ? "rotate-180"
                      : ""
                    }
                  `}
                />
              )}
            </button>

            {/* ==================================================
                COMPANY DROPDOWN
            =================================================== */}

            {showCompanyMenu &&
              selectedCompany && (
                <div
                  className="
                    absolute
                    left-2
                    top-[62px]
                    z-[1100]

                    w-[min(300px,calc(100vw-16px))]

                    overflow-hidden

                    rounded-xl

                    border
                    border-gray-200

                    bg-white

                    text-gray-900

                    shadow-lg
                  "
                >
                  <div className="relative z-10">
                    {/* DROPDOWN HEADER */}
                    <div
                      className="
                        border-b
                        border-black/[0.06]

                        bg-black/[0.02]

                        px-4
                        py-3
                      "
                    >
                      <p
                        className="
                          m-0

                          text-[10px]
                          font-semibold
                          uppercase
                          tracking-wide

                          text-emerald-700
                        "
                      >
                        My Companies
                      </p>
                    </div>

                    {/* COMPANY LIST */}
                    {companies.length > 0 ? (
                      <div
                        className="
                        glass-scrollbar
                         max-h-[320px]
                         overflow-y-auto
                        p-1.5"

                      >
                        {companies.map(
                          (company, index) => {
                            const companyId =
                              getCompanyId(
                                company,
                              );

                            const key =
                              companyId ||
                              company?.name ||
                              company?.companyName ||
                              `company-${index}`;

                            const selectedCompanyId =
                              getCompanyId(
                                selectedCompany,
                              );

                            const isSelected =
                              companyId &&
                              selectedCompanyId &&
                              String(companyId) ===
                              String(
                                selectedCompanyId,
                              );

                            const companyName =
                              company?.name ||
                              company?.companyName ||
                              "";

                            const companyMeta =
                              company?.meta ||
                              company?.city ||
                              company?.address ||
                              "";

                            return (
                              <button
                                type="button"
                                key={key}
                                onClick={() =>
                                  handleCompanySelect(
                                    company,
                                  )
                                }
                                className={`
                                  flex
                                  w-full

                                  items-center
                                  gap-3

                                  rounded-lg

                                  px-3
                                  py-3

                                  text-left

                                  transition-all

                                  ${isSelected
                                    ? `
                                        bg-emerald-300/[0.08]

                                        shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]
                                      `
                                    : `
                                        hover:bg-black/[0.03]
                                      `
                                  }
                                `}
                              >
                                {/* COMPANY ICON */}
                                <span
                                  className={`
                                    flex
                                    h-9
                                    w-9
                                    shrink-0

                                    items-center
                                    justify-center

                                    rounded-lg

                                    text-xs
                                    font-bold

                                    ${isSelected
                                      ? `
                                          border
                                          border-emerald-300/[0.12]

                                          bg-emerald-300/[0.10]

                                          text-emerald-800
                                        `
                                      : `
                                          border
                                          border-black/[0.06]

                                          bg-black/[0.04]

                                          text-gray-500
                                        `
                                    }
                                  `}
                                >
                                  {companyName
                                    .trim()
                                    .charAt(0)
                                    .toUpperCase()}
                                </span>

                                {/* COMPANY DETAILS */}
                                <span className="min-w-0 flex-1">
                                  <span
                                    className={`
                                      block
                                      truncate

                                      text-xs
                                      font-semibold

                                      ${isSelected
                                        ? "text-emerald-800"
                                        : "text-gray-800"
                                      }
                                    `}
                                  >
                                    {companyName}
                                  </span>

                                  {companyMeta && (
                                    <span
                                      className="
                                        mt-0.5
                                        block
                                        truncate

                                        text-[10px]

                                        text-gray-500
                                      "
                                    >
                                      {companyMeta}
                                    </span>
                                  )}
                                </span>

                                {/* SELECTED CHECK */}
                                {isSelected && (
                                  <span
                                    className="
                                      flex
                                      h-5
                                      w-5
                                      shrink-0

                                      items-center
                                      justify-center

                                      rounded-full

                                      bg-emerald-400

                                      text-[10px]
                                      font-bold
                                      text-[#06251d]

                                      shadow-[0_0_12px_rgba(52,211,153,0.25)]
                                    "
                                  >
                                    ✓
                                  </span>
                                )}
                              </button>
                            );
                          },
                        )}
                      </div>
                    ) : (
                      <div className="px-4 py-6 text-center">
                        <p className="text-sm font-medium text-gray-600">
                          No companies available
                        </p>

                        <p className="mt-1 text-[11px] text-gray-400">
                          No companies were found for
                          your account.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>

          {/* ==================================================
              RIGHT ACTIONS
          =================================================== */}

          <div
            className="
              ml-auto

              flex
              h-16

              shrink-0

              items-stretch
            "
          >
            {/* ==================================================
                MOBILE VERSION
            =================================================== */}

            <button
              type="button"
              onClick={
                onMobileVersionClick ??
                (() =>
                  window.open(
                    "/mobile-version",
                    "_blank",
                    "noopener,noreferrer",
                  ))
              }
              className="
                hidden

                h-16
                w-[82px]
                shrink-0

                items-center
                justify-center
                gap-1.5

                border-r
                border-black/[0.06]

                bg-black/[0.02]

                text-[9px]
                leading-3
                text-gray-500

                transition-all

                hover:bg-black/[0.04]
                hover:text-gray-900

                lg:flex
              "
            >
              <Smartphone
                className="
                  h-4
                  w-4
                  shrink-0

                  text-emerald-700
                "
              />

              <span>
                Mobile
                <br />
                Version
              </span>
            </button>

            {/* ==================================================
                CONNECTOR
            =================================================== */}

            <div
              className="
                hidden

                h-16
                w-[180px]
                shrink-0

                items-center
                justify-center

                border-r
                border-black/[0.06]

                bg-black/[0.02]

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

            {/* ==================================================
                PROFILE
            =================================================== */}

            <div
              className="
                relative

                flex
                h-16
                w-14
                shrink-0

                sm:w-[92px]
              "
            >
              <button
                type="button"
                aria-label="Open profile menu"
                aria-expanded={showProfileMenu}
                onClick={toggleProfileMenu}
                className="
                  flex
                  h-16
                  w-full

                  items-center
                  justify-center

                  gap-1

                  bg-black/[0.02]

                  px-1

                  transition-all

                  active:bg-black/[0.05]

                  hover:bg-black/[0.03]

                  sm:gap-2
                  sm:px-2
                "
              >
                <span
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0

                    items-center
                    justify-center

                    rounded-full

                    border
                    border-black/[0.08]

                    bg-black/[0.04]

                    shadow-[inset_0_1px_0_rgba(0,0,0,0.05)]
                  "
                >
                  <User
                    className="
                      h-4
                      w-4
                      text-emerald-700
                    "
                  />
                </span>

                <ChevronDown
                  className={`
                    hidden

                    h-4
                    w-4
                    shrink-0

                    text-gray-500

                    transition-transform

                    sm:block

                    ${showProfileMenu
                      ? "rotate-180"
                      : ""
                    }
                  `}
                />
              </button>

              {/* ==================================================
                  PROFILE DROPDOWN
              =================================================== */}

              {showProfileMenu && (
                <div
                  className="
                    absolute

                    right-0
                    top-[62px]
                    z-[11000]

                    w-52
                    max-w-[calc(100vw-16px)]

                    overflow-hidden

                    rounded-xl

                    border
                    border-gray-200

                    bg-white

                    p-1.5

                    text-gray-900

                    shadow-lg
                  "
                >
                  <div className="relative z-10">
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

                          px-3
                          py-3

                          text-left
                          text-xs

                          text-gray-600

                          transition-all

                          active:bg-black/[0.06]

                          hover:bg-black/[0.04]
                          hover:text-gray-900
                        "
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ====================================================
            MOBILE ACTIONS
        ===================================================== */}

        <div
          className="
            relative
            z-10

            flex
            min-h-16
            w-full

            border-t
            border-gray-200

            bg-white

            lg:hidden
          "
        >
          {/* ==================================================
              MOBILE CONNECTOR
          =================================================== */}

          <div
            className="
              relative
              z-10

              flex
              min-w-0
              flex-1

              items-center
              justify-center

              bg-transparent

              px-3
              py-2
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
        </div>
      </header>
    </>
  );
}

export default AppHeader;
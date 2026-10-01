import { X, Phone } from "lucide-react";
import logo from "../assets/Control-Books-Dashboard.png";
import smallLogo from "../assets/logo.png";
import { navItems, submenuItems } from "../routes/navigation";

function Arrow() {
  return (
    <span
      className="
        ml-auto
        flex
        h-5
        w-4
        shrink-0
        items-center
        justify-center
        text-base
        leading-none
        text-slate-400
      "
      aria-hidden="true"
    >
      ›
    </span>
  );
}

function Sidebar({
  collapsed,
  isCompact,
  setSidebarCollapsed,
  currentPath,
  showDashboard,
  expandedNav,
  setExpandedNav,
  onDashboard,
  onQuotation,
  onNavigate,
  allowedModules,
}) {
  const entryPath = currentPath.toLowerCase();

  // ============================================================
  // MODULE ACCESS
  // ============================================================

  const isSubItemAllowed = (parentPath, itemPath) => {
    if (!Array.isArray(allowedModules)) {
      return true;
    }

    if (allowedModules.includes(parentPath)) {
      return true;
    }

    return allowedModules.includes(itemPath);
  };

  // ============================================================
  // VISIBLE NAV ITEMS
  // ============================================================

  const visibleNavItems = navItems.filter(([, label, , , path]) => {
    if (!Array.isArray(allowedModules)) {
      return true;
    }

    const subItems = submenuItems[label];

    if (!subItems) {
      return allowedModules.includes(path);
    }

    return (
      allowedModules.includes(path) ||
      subItems.some(([, itemPath]) => isSubItemAllowed(path, itemPath))
    );
  });

  // ============================================================
  // ACTIVE SUBMENU
  // ============================================================

  const isSubmenuActive = (itemPath) => entryPath === itemPath.toLowerCase();

  // ============================================================
  // SPECIAL ROUTES
  // ============================================================

  const isCollectPaymentsRoute = (label) =>
    label === "Collect Payments" &&
    ["/receivables", "/receivablesnew"].includes(entryPath);

  const isCashBankRoute = (label) =>
    label === "Cash & Bank" &&
    (entryPath.startsWith("/cash/") ||
      entryPath.startsWith("/bank/") ||
      entryPath === "/cash-bank/cash" ||
      entryPath === "/cash-bank/bank");

  // ============================================================
  // NAV EXPANDED
  // ============================================================

  const isNavExpanded = (label, path) =>
    expandedNav[label] ??
    (currentPath.startsWith(`/${path}`) ||
      submenuItems[label]?.some(([, itemPath]) => isSubmenuActive(itemPath)));

  // ============================================================
  // MOBILE
  // ============================================================

  const closeOnMobile = () => {
    if (isCompact) {
      setSidebarCollapsed(true);
    }
  };

  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleNavClick = (event, targetPath) => {
    if (!targetPath) {
      return;
    }

    event.preventDefault();

    onNavigate(targetPath);
    closeOnMobile();
  };

  // ============================================================
  // SINGLE SUBMENU OPEN
  // ============================================================

  const handleExpandableClick = (event, label, path) => {
    event.preventDefault();

    setExpandedNav((current) => {
      const isCurrentlyOpen = current[label] ?? isNavExpanded(label, path);

      // Close the clicked submenu
      if (isCurrentlyOpen) {
        return {};
      }

      // Close every other submenu
      // and open only the clicked submenu
      return {
        [label]: true,
      };
    });
  };

  return (
    <aside
      className={`
        app-sidebar

        fixed
        left-0
        top-0
        z-40

        flex
        h-screen
        shrink-0
        flex-col

        overflow-hidden

        border-r
        border-slate-200

        bg-[#0A1128]
        text-slate-900

        ${
          isCompact
            ? `
                ${collapsed ? "-translate-x-full" : "translate-x-0"}

                w-[228px]
              `
            : collapsed
              ? "w-[68px]"
              : "w-[228px]"
        }
      `}
      data-collapsed={collapsed}
    >
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Main background */}

        <div
          className="
            absolute
            inset-0
            bg-[#0A1128]
          "
        />

        {/* Top left */}

        <div
          className="
            absolute
            -left-24
            -top-24

            h-64
            w-64

            rounded-full

            bg-[#0A1128]

            blur-[72px]
          "
        />

        {/* Top right */}

        <div
          className="
            absolute
            -right-24
            top-20

            h-56
            w-56

            rounded-full

            bg-blue-400/[0.025]

            blur-[80px]
          "
        />

        {/* Bottom left */}

        <div
          className="
            absolute
            -bottom-24
            -left-20

            h-72
            w-72

            rounded-full

            bg-blue-300/[0.035]

            blur-[80px]
          "
        />

        {/* Bottom right */}

        <div
          className="
            absolute
            -bottom-20
            -right-28

            h-64
            w-64

            rounded-full

            bg-[#0A1128]

            blur-[80px]
          "
        />

        {/* Diagonal reflection */}

        <div
          className="
            absolute
            -left-[32%]
            top-0

            h-full
            w-[52%]

            rotate-[14deg]

            blur-[10px]
          "
        />
      </div>

      {/* =====================================================
          MOBILE CLOSE BUTTON
      ====================================================== */}

      {isCompact && !collapsed && (
        <div
          className="
            relative
            z-10

            flex
            h-10
            min-h-10
            shrink-0
            items-center
            justify-end

            bg-[#0A1128]

            px-3
          "
        >
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarCollapsed(true)}
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center

              rounded-lg

              border
              border-slate-200

              bg-[#0A1128]

              text-slate-300

              outline-none

              hover:border-slate-300
              hover:bg-[#101A36]
              hover:text-white
            "
          >
            <X className="h-4 w-4 shrink-0" />
          </button>
        </div>
      )}

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div
        className={`
          relative
          z-10

          flex
          h-[68px]
          min-h-[68px]
          w-full
          shrink-0

          items-center
          justify-center

          bg-[#0A1128]

          ${collapsed ? "" : "px-4"}
        `}
      >
        <button
          type="button"
          onClick={(event) => {
            onDashboard(event);
            closeOnMobile();
          }}
          aria-label="Go to dashboard"
          className="
            flex
            h-full
            shrink-0
            items-center
            justify-center

            border-0
            bg-transparent
            p-0

            outline-none
          "
        >
          <img
            src={collapsed ? smallLogo : logo}
            alt="CtrlBooks logo"
            className={`
              block
              shrink-0
              object-contain

              ${collapsed ? "h-10 w-10" : "ml-4 h-[85%] w-[85%]"}
            `}
          />
        </button>
      </div>

      {/* =====================================================
          NAVIGATION
      ====================================================== */}

      <nav
        className="
          relative
          z-10

          min-h-0
          flex-1

          overflow-y-auto
          overflow-x-hidden

     

          [scrollbar-width:thin]
          [scrollbar-color:#26385E_transparent]
          [scrollbar-gutter:stable]
        "
      >
        {visibleNavItems.map(
          ([IconComponent, label, expandable, badge, path]) => {
            const targetPath =
              label === "Dashboard" ? "/dashboard" : `/${path}`;

            const hasSubmenu =
              Array.isArray(submenuItems[label]) &&
              submenuItems[label].length > 0;

            const active =
              (label === "Dashboard" && showDashboard) ||
              isCollectPaymentsRoute(label) ||
              isCashBankRoute(label) ||
              currentPath.startsWith(`/${path}`) ||
              submenuItems[label]?.some(([, itemPath]) =>
                isSubmenuActive(itemPath),
              );

            const submenuOpen = hasSubmenu && isNavExpanded(label, path);

            return (
              <div
                key={label}
                className="
                  mb-1
                  w-full
                  shrink-0
                "
              >
                {/* =================================================
                    MAIN NAV ITEM
                ================================================== */}

                <a
                  href={expandable ? undefined : targetPath}
                  onClick={(event) => {
                    if (expandable) {
                      handleExpandableClick(event, label, path);

                      return;
                    }

                    if (label === "Dashboard") {
                      onDashboard(event);
                      closeOnMobile();
                      return;
                    }

                    handleNavClick(event, targetPath);
                  }}
                  style={{
                    boxSizing: "border-box",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    height: "42px",
                    minHeight: "42px",
                    maxHeight: "42px",
                    margin: 0,
                    paddingLeft: "12px",
                    paddingRight: "12px",
                    gap: "12px",
                    border: "0",
                    borderWidth: "0",
                    borderStyle: "none",
                    borderRadius: "8px",
                    lineHeight: "normal",
                    fontSize: "14px",
                    fontWeight: 500,
                    textDecoration: "none",
                    transform: "none",
                    flexShrink: 0,
                  }}
                  className={`
                    sidebar-link
                    group
                    overflow-hidden
                    outline-none
                    no-underline
                    transition-none

                    ${
                      active
                        ? "text-emerald-400"
                        : "text-white hover:text-emerald-400"
                    }
                  `}
                >
                  {/* ===========================================
                      ACTIVE BACKGROUND
                  ============================================ */}

                  {/* ===========================================
                      ACTIVE INDICATOR
                  ============================================ */}

                  {/* ===========================================
                      ICON
                  ============================================ */}

                  <span
                    className={`
                      relative
                      z-10

                      flex
                      h-5
                      w-5
                      shrink-0

                      items-center
                      justify-center

                      ${
                        active
                          ? "text-emerald-400"
                          : "text-slate-400 group-hover:text-emerald-400"
                      }
                    `}
                  >
                    <IconComponent
                      className="
                        h-4
                        w-4
                        shrink-0
                      "
                      strokeWidth={2}
                    />
                  </span>

                  {/* ===========================================
                      LABEL
                  ============================================ */}

                  {!collapsed && (
                    <>
                      <span
                        className={`
                          relative
                          z-10

                          min-w-0
                          flex-1

                          overflow-hidden
                          truncate

                          text-[14px]
                          font-medium
                          leading-5

                          ${
                            active
                              ? "text-emerald-400"
                              : "text-white group-hover:text-emerald-400"
                          }
                        `}
                      >
                        {label}
                      </span>

                      {/* ========================================
                          BADGE
                      ========================================= */}

                      {badge && (
                        <span
                          className="
                            relative
                            z-10

                            flex
                            h-[20px]
                            min-w-[20px]
                            shrink-0

                            items-center
                            justify-center

                            rounded-full

                            border
                            border-emerald-400

                            bg-[#0A1128]

                            px-1.5

                            text-[9px]
                            font-semibold
                            leading-none

                            text-emerald-400
                          "
                        >
                          {badge}
                        </span>
                      )}

                      {/* ========================================
                          ARROW
                      ========================================= */}

                      {expandable && (
                        <span
                          className={`
                            relative
                            z-10

                            flex
                            h-5
                            w-4
                            shrink-0

                            items-center
                            justify-center

                            ${submenuOpen ? "rotate-90" : "rotate-0"}
                          `}
                        >
                          <Arrow />
                        </span>
                      )}
                    </>
                  )}
                </a>

                {/* =================================================
                    SUBMENU
                ================================================== */}

                {!collapsed && hasSubmenu && submenuOpen && (
                  <div
                    className="
                        relative
                        z-10

                        ml-[21%]
                        pl-3
                        py-1

                        w-auto

                        box-border
                      "
                  >
                    {submenuItems[label]
                      .filter(([, itemPath]) =>
                        isSubItemAllowed(path, itemPath),
                      )
                      .map(([item, itemPath]) => {
                        const subActive = isSubmenuActive(itemPath);

                        return (
                          <a
                            key={item}
                            href={itemPath}
                            onClick={(event) => {
                              if (itemPath === "/create-voucher/Quotation") {
                                onQuotation(event);
                                closeOnMobile();
                                return;
                              }

                              handleNavClick(event, itemPath);
                            }}
                            style={{
                              boxSizing: "border-box",
                              display: "block",
                              position: "relative",
                              width: "100%",
                              height: "38px",
                              minHeight: "38px",
                              maxHeight: "38px",
                              margin: 0,
                              paddingTop: "8px",
                              paddingBottom: "8px",
                              paddingLeft: "12px",
                              paddingRight: "12px",
                              border: "0",
                              borderWidth: "0",
                              borderStyle: "none",
                              borderRadius: "6px",
                              lineHeight: "22px",
                              fontSize: "14px",
                              fontWeight: 500,
                              textDecoration: "none",
                              transform: "none",
                            }}
                            className={`
                                  overflow-hidden

                                  outline-none
                                  no-underline
                                  transition-none

                                  ${
                                    subActive
                                      ? "text-emerald-400"
                                      : "text-white hover:text-emerald-400"
                                  }
                                `}
                          >
                            {/* Submenu active background */}

                            {subActive && (
                              <span
                                className="
                                      pointer-events-none

                                      absolute
                                      inset-0
                                      z-0

                                      rounded-md

                                      bg-[#101A36]
                                    "
                              />
                            )}

                            {/* Submenu text */}

                            <span
                              className="
                                    relative
                                    z-10

                                    block
                                    truncate

                                    font-medium
                                  "
                            >
                              {item}
                            </span>
                          </a>
                        );
                      })}
                  </div>
                )}
              </div>
            );
          },
        )}
      </nav>

      {/* =====================================================
          NEED HELP
      ====================================================== */}

      {!collapsed && (
        <div
          className="
            relative
            z-10

            mx-3
            mb-4

            flex
            min-h-[52px]
            shrink-0
            items-center
            gap-3

            rounded-xl

         

            bg-[#10a66f]

            px-3
            py-2.5
          "
        >
          {/* Phone */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0

              items-center
              justify-center

              rounded-lg

              text-white
            "
          >
            <Phone size={17} strokeWidth={2} />
          </div>

          {/* Help text */}

          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
            "
          >
            <p
              className="
                m-0

                text-[13px]
                font-medium
                leading-4

                text-white
              "
            >
              Need help?
            </p>

            <a
              href="tel:+919311472357"
              className="
                mt-0.5

                block
                truncate

                text-[13px]
                font-bold
                leading-4

                text-white
                no-underline

                hover:text-white
              "
            >
              +91 9311472357
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;

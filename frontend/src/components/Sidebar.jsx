<<<<<<< HEAD
import { X } from "lucide-react";
import logo from "../assets/logo.png";
import { navItems, submenuItems } from "../routes/navigation";
import { Phone } from "lucide-react";
=======
import { X, Phone } from "lucide-react";
import logo from "../assets/Control-Books-Dashboard.png";
import smallLogo from "../assets/logo.png";
import { navItems, submenuItems } from "../routes/navigation";

>>>>>>> e3c8a52 (Initial commit)
function Arrow() {
  return (
    <span
      className="ml-auto text-base leading-none text-white/60"
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
}) {
  const entryPath = currentPath.toLowerCase();

<<<<<<< HEAD
  const isSubmenuActive = (itemPath) => entryPath === itemPath.toLowerCase();
=======
  const isSubmenuActive = (itemPath) =>
    entryPath === itemPath.toLowerCase();
>>>>>>> e3c8a52 (Initial commit)

  const isCollectPaymentsRoute = (label) =>
    label === "Collect Payments" &&
    ["/receivables", "/receivablesnew"].includes(entryPath);

  const isCashBankRoute = (label) =>
    label === "Cash & Bank" &&
<<<<<<< HEAD
    (entryPath.startsWith("/cash/") ||
      entryPath.startsWith("/bank/") ||
      entryPath === "/cash-bank/cash" ||
      entryPath === "/cash-bank/bank");

  const isNavExpanded = (label, path) =>
    expandedNav[label] ??
    (currentPath.startsWith(`/${path}`) ||
      submenuItems[label]?.some(([, itemPath]) => isSubmenuActive(itemPath)));
=======
    (
      entryPath.startsWith("/cash/") ||
      entryPath.startsWith("/bank/") ||
      entryPath === "/cash-bank/cash" ||
      entryPath === "/cash-bank/bank"
    );

  const isNavExpanded = (label, path) =>
    expandedNav[label] ??
    (
      currentPath.startsWith(`/${path}`) ||
      submenuItems[label]?.some(([, itemPath]) =>
        isSubmenuActive(itemPath)
      )
    );
>>>>>>> e3c8a52 (Initial commit)

  const closeOnMobile = () => {
    if (isCompact) {
      setSidebarCollapsed(true);
    }
  };

  const handleNavClick = (event, targetPath) => {
    if (!targetPath) return;
<<<<<<< HEAD
    event.preventDefault();
    onNavigate(targetPath);
=======

    event.preventDefault();

    onNavigate(targetPath);

>>>>>>> e3c8a52 (Initial commit)
    closeOnMobile();
  };

  return (
    <aside
      className={`
        app-sidebar fixed left-0 top-0 z-40
        flex h-screen shrink-0 flex-col
        overflow-hidden text-white
        transition-all duration-200
<<<<<<< HEAD
        ${
          isCompact
            ? `${collapsed ? "-translate-x-full" : "translate-x-0"} w-[228px]`
            : collapsed
              ? "w-[68px]"
              : "w-[228px]"
=======

        ${isCompact
          ? `${collapsed ? "-translate-x-full" : "translate-x-0"} w-[228px]`
          : collapsed
            ? "w-[68px]"
            : "w-[228px]"
>>>>>>> e3c8a52 (Initial commit)
        }
      `}
      data-collapsed={collapsed}
    >
<<<<<<< HEAD
      {isCompact && !collapsed && (
        <div className="flex justify-end px-3 pt-3">
=======
      {/* =========================================================
          MOBILE CLOSE BUTTON
      ========================================================== */}
      {isCompact && !collapsed && (
        <div className="flex h-10 shrink-0 items-center justify-end px-3">
>>>>>>> e3c8a52 (Initial commit)
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarCollapsed(true)}
            className="
              flex h-8 w-8 items-center justify-center
<<<<<<< HEAD
              rounded-lg border border-white/10
              bg-white/5 text-white transition
=======
              rounded-lg
              border border-white/10
              bg-white/5
              text-white
              transition
>>>>>>> e3c8a52 (Initial commit)
              hover:bg-white/10
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

<<<<<<< HEAD
      <button
        type="button"
        onClick={onDashboard}
        aria-label="Go to dashboard"
        className={`
          sidebar-brand flex h-[68px] w-full shrink-0
          items-center border-0 text-left
          ${collapsed ? "justify-center px-0" : "justify-start gap-2 px-3"}
        `}
      >
        <span
          className={`
            grid shrink-0 place-items-center rounded-xl bg-#082E52
            
            ${collapsed ? "h-25 w-12 p-1.5" : "h-25 w-12 p-1.5"}
          `}
        >
          <img
            className="h-full w-full object-contain"
            src={logo}
            alt="CtrlBooks logo"
          />
        </span>

        {!collapsed && (
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="whitespace-nowrap text-[29px] font-black italic leading-none tracking-[-0.09em]">
              <span className="text-[#4CAF50] tracking-[0.06em]">Ctrl</span>
              <span className="sidebar-brand-title-books tracking-[0.03em]">
                Books
              </span>
            </div>

            <div className="mt-1 h-[1px] w-[92%] bg-[#4CAF50]" />
          </div>
        )}
      </button>

      <nav className="sidebar-nav min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 py-5">
        {navItems.map(([IconComponent, label, expandable, badge, path]) => {
          const targetPath = label === "Dashboard" ? "/dashboard" : `/${path}`;

          const active =
            (label === "Dashboard" && showDashboard) ||
            isCollectPaymentsRoute(label) ||
            isCashBankRoute(label) ||
            currentPath.startsWith(`/${path}`) ||
            submenuItems[label]?.some(([, itemPath]) =>
              isSubmenuActive(itemPath),
            );

          return (
            <div className="mb-1" key={label}>
              <a
                href={expandable ? undefined : targetPath}
                onClick={(event) => {
                  if (expandable) {
                    event.preventDefault();

                    setExpandedNav((current) => ({
                      ...current,
                      [label]: !isNavExpanded(label, path),
                    }));

                    return;
                  }

                  if (label === "Dashboard") {
                    onDashboard(event);
                    closeOnMobile();
                    return;
                  }

                  handleNavClick(event, targetPath);
                }}
                className={`
                  sidebar-link flex h-[42px] w-full
                  items-center gap-3 rounded-lg px-3
                  text-left text-[13px] font-medium
                  no-underline transition-all duration-200

                  ${
                    active
                      ? "is-active"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <span className="flex w-5 shrink-0 items-center justify-center">
                  <IconComponent className="h-4 w-4" />
                </span>

                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate">{label}</span>

                    {badge && (
                      <em
                        className="
                          rounded-full bg-red-500 px-1.5 py-0.5
                          text-[9px] font-semibold not-italic text-white
                        "
                      >
                        {badge}
                      </em>
                    )}

                    {expandable && <Arrow />}
                  </>
                )}
              </a>

              {!collapsed &&
                submenuItems[label] &&
                isNavExpanded(label, path) && (
                  <div className="ml-4 border-l border-white/10 py-1 pl-3">
                    {submenuItems[label].map(([item, itemPath]) => (
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
                        className={`
                          block rounded-md px-3 py-2
                          text-[12px] no-underline transition
                          ${
                            isSubmenuActive(itemPath)
                              ? "bg-white/10 font-semibold text-emerald-300"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }
                        `}
                      >
                        {item}
                      </a>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </nav>

      {!collapsed && (
        <div
          className="
    mx-3 mb-4 flex items-center gap-3
    rounded-xl border border-white/10
    bg-[#059669] px-4 py-3
  "
        >
          {/* Phone Icon */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center ">
            <Phone size={17} strokeWidth={2} className="text-white" />
          </div>

          {/* Help Content */}
          <div className="flex flex-col">
            <p className="text-[11px] font-medium leading-4 text-white px-4">
=======
      {/* =========================================================
    LOGO / BRAND
========================================================== */}
      <div
        className={`
          bg-white
    flex h-[68px] w-full shrink-0
    items-center
    border-b border-white/10
    ${collapsed ? "justify-center" : "justify-center px-4"}
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
        object-contain
        ${collapsed
                ? "h-9 w-9"
                : "h-[45px] w-auto max-w-[140px]"
              }
      `}
          />
        </button>
      </div>

      {/* =========================================================
          NAVIGATION
      ========================================================== */}
      <nav
        className="
          sidebar-nav
          min-h-0
          flex-1
          overflow-y-auto
          overflow-x-hidden
          px-3
          py-4
        "
      >
        {navItems.map(
          ([IconComponent, label, expandable, badge, path]) => {
            const targetPath =
              label === "Dashboard"
                ? "/dashboard"
                : `/${path}`;

            const active =
              (label === "Dashboard" && showDashboard) ||
              isCollectPaymentsRoute(label) ||
              isCashBankRoute(label) ||
              currentPath.startsWith(`/${path}`) ||
              submenuItems[label]?.some(([, itemPath]) =>
                isSubmenuActive(itemPath)
              );

            return (
              <div
                className="mb-1"
                key={label}
              >
                {/* =================================================
                    MAIN NAV ITEM
                ================================================= */}
                <a
                  href={expandable ? undefined : targetPath}
                  onClick={(event) => {
                    /* ---------------------------------------------
                       EXPANDABLE ITEM
                    --------------------------------------------- */
                    if (expandable) {
                      event.preventDefault();

                      setExpandedNav((current) => ({
                        ...current,
                        [label]: !isNavExpanded(
                          label,
                          path
                        ),
                      }));

                      return;
                    }

                    /* ---------------------------------------------
                       DASHBOARD
                    --------------------------------------------- */
                    if (label === "Dashboard") {
                      onDashboard(event);
                      closeOnMobile();
                      return;
                    }

                    /* ---------------------------------------------
                       NORMAL NAVIGATION
                    --------------------------------------------- */
                    handleNavClick(
                      event,
                      targetPath
                    );
                  }}
                  className={`
                    sidebar-link

                    flex
                    h-[42px]
                    w-full
                    items-center
                    gap-3
                    rounded-lg
                    px-3

                    text-left
                    text-[13px]
                    font-medium
                    no-underline

                    transition-all
                    duration-200

                    ${active
                      ? "is-active"
                      : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }
                  `}
                >
                  {/* ICON */}
                  <span
                    className="
                      flex
                      w-5
                      shrink-0
                      items-center
                      justify-center
                    "
                  >
                    <IconComponent
                      className="h-4 w-4"
                      strokeWidth={2}
                    />
                  </span>

                  {/* TEXT + BADGE + ARROW */}
                  {!collapsed && (
                    <>
                      {/* LABEL */}
                      <span
                        className="
                          min-w-0
                          flex-1
                          truncate
                        "
                      >
                        {label}
                      </span>

                      {/* BADGE */}
                      {badge && (
                        <em
                          className="
                            rounded-full
                            bg-red-500
                            px-1.5
                            py-0.5
                            text-[9px]
                            font-semibold
                            not-italic
                            text-white
                          "
                        >
                          {badge}
                        </em>
                      )}

                      {/* ARROW */}
                      {expandable && <Arrow />}
                    </>
                  )}
                </a>

                {/* =================================================
                    SUBMENU
                ================================================= */}
                {!collapsed &&
                  submenuItems[label] &&
                  isNavExpanded(label, path) && (
                    <div
                      className="
                        ml-4
                        border-l
                        border-white/10
                        py-1
                        pl-3
                      "
                    >
                      {submenuItems[label].map(
                        ([item, itemPath]) => (
                          <a
                            key={item}
                            href={itemPath}
                            onClick={(event) => {
                              /* -------------------------------------
                                 QUOTATION
                              ------------------------------------- */
                              if (
                                itemPath ===
                                "/create-voucher/Quotation"
                              ) {
                                onQuotation(event);
                                closeOnMobile();
                                return;
                              }

                              /* -------------------------------------
                                 NORMAL SUBMENU NAVIGATION
                              ------------------------------------- */
                              handleNavClick(
                                event,
                                itemPath
                              );
                            }}
                            className={`
                              block
                              rounded-md
                              px-3
                              py-2

                              text-[12px]
                              no-underline

                              transition

                              ${isSubmenuActive(
                              itemPath
                            )
                                ? `
                                      bg-white/10
                                      font-semibold
                                      text-emerald-300
                                    `
                                : `
                                      text-slate-300
                                      hover:bg-white/5
                                      hover:text-white
                                    `
                              }
                            `}
                          >
                            {item}
                          </a>
                        )
                      )}
                    </div>
                  )}
              </div>
            );
          }
        )}
      </nav>

      {/* =========================================================
          NEED HELP SECTION
      ========================================================== */}
      {!collapsed && (
        <div
          className="
            mx-3
            mb-4
            flex
            shrink-0
            items-center
            gap-3
            rounded-xl
            border
            border-white/10
            bg-[#059669]
            px-4
            py-3
          "
        >
          {/* PHONE ICON */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
            "
          >
            <Phone
              size={17}
              strokeWidth={2}
              className="text-white"
            />
          </div>

          {/* HELP CONTENT */}
          <div className="flex min-w-0 flex-col">
            <p
              className="
                text-[11px]
                font-medium
                leading-4
                text-white
              "
            >
>>>>>>> e3c8a52 (Initial commit)
              Need help?
            </p>

            <a
              href="tel:+919311472357"
<<<<<<< HEAD
              className="mt-0.5 text-[12px] font-semibold text-white no-underline hover:underline"
=======
              className="
                mt-0.5
                text-[12px]
                font-semibold
                text-white
                no-underline
                hover:underline
              "
>>>>>>> e3c8a52 (Initial commit)
            >
              +91 9311472357
            </a>
          </div>
        </div>
      )}
    </aside>
  );
}

<<<<<<< HEAD
export default Sidebar;
=======
export default Sidebar;
>>>>>>> e3c8a52 (Initial commit)

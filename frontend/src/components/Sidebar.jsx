import { X, Phone } from "lucide-react";
import logo from "../assets/Control-Books-Dashboard.png";
import smallLogo from "../assets/logo.png";
import { navItems, submenuItems } from "../routes/navigation";

function Arrow() {
  return (
    <span
      className="ml-auto text-base leading-none text-slate-400"
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

  const isSubItemAllowed = (parentPath, itemPath) => {
    if (!Array.isArray(allowedModules)) return true;
    if (allowedModules.includes(parentPath)) return true;
    return allowedModules.includes(itemPath);
  };

  const visibleNavItems = navItems.filter(([, label, , , path]) => {
    if (!Array.isArray(allowedModules)) return true;

    const subItems = submenuItems[label];

    if (!subItems) {
      return allowedModules.includes(path);
    }

    return (
      allowedModules.includes(path) ||
      subItems.some(([, itemPath]) =>
        isSubItemAllowed(path, itemPath),
      )
    );
  });

  const isSubmenuActive = (itemPath) =>
    entryPath === itemPath.toLowerCase();

  const isCollectPaymentsRoute = (label) =>
    label === "Collect Payments" &&
    ["/receivables", "/receivablesnew"].includes(entryPath);

  const isCashBankRoute = (label) =>
    label === "Cash & Bank" &&
    (entryPath.startsWith("/cash/") ||
      entryPath.startsWith("/bank/") ||
      entryPath === "/cash-bank/cash" ||
      entryPath === "/cash-bank/bank");

  const isNavExpanded = (label, path) =>
    expandedNav[label] ??
    (currentPath.startsWith(`/${path}`) ||
      submenuItems[label]?.some(([, itemPath]) =>
        isSubmenuActive(itemPath),
      ));

  const closeOnMobile = () => {
    if (isCompact) {
      setSidebarCollapsed(true);
    }
  };

  const handleNavClick = (event, targetPath) => {
    if (!targetPath) return;

    event.preventDefault();
    onNavigate(targetPath);
    closeOnMobile();
  };

  return (
    <aside
      className={`
        app-sidebar
        fixed left-0 top-0 z-40

        flex h-screen shrink-0 flex-col

        overflow-hidden

        border-r border-slate-300/40

        bg-slate-200/[0.72]

        text-slate-800

        shadow-[8px_0_35px_rgba(0,0,0,0.10)]

        backdrop-blur-[24px]
        backdrop-saturate-[150%]

        transition-all duration-200

        ${
          isCompact
            ? `${collapsed ? "-translate-x-full" : "translate-x-0"} w-[228px]`
            : collapsed
              ? "w-[68px]"
              : "w-[228px]"
        }
      `}
      data-collapsed={collapsed}
    >
      {/* =====================================================
          STATIC LIQUID GLASS BACKGROUND
          DESIGN ONLY - DOES NOT AFFECT LAYOUT
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Main glass surface */}
        <div
          className="
            absolute
            inset-0

            bg-gradient-to-b
            from-white/[0.72]
            via-slate-100/[0.78]
            to-slate-300/[0.72]
          "
        />

        {/* Top-left subtle grey glow */}
        <div
          className="
            absolute
            -left-24
            -top-24

            h-64
            w-64

            rounded-full

            bg-white/[0.35]

            blur-[72px]
          "
        />

        {/* Bottom-left grey glow */}
        <div
          className="
            absolute
            -bottom-24
            -left-20

            h-72
            w-72

            rounded-full

            bg-slate-400/[0.12]

            blur-[80px]
          "
        />

        {/* Very subtle white glow */}
        <div
          className="
            absolute
            -bottom-20
            -right-28

            h-64
            w-64

            rounded-full

            bg-white/[0.28]

            blur-[80px]
          "
        />

        {/* =================================================
            STATIC CURVED LIQUID LINES
        ================================================= */}

        <div
          className="
            absolute

            -bottom-[115px]
            -left-[125px]

            h-[225px]
            w-[455px]

            rotate-[-14deg]

            rounded-[50%]

            border-t
            border-white/[0.55]
          "
        />

        <div
          className="
            absolute

            -bottom-[155px]
            -left-[110px]

            h-[245px]
            w-[475px]

            rotate-[-14deg]

            rounded-[50%]

            border-t
            border-slate-400/[0.18]
          "
        />

        <div
          className="
            absolute

            -bottom-[195px]
            -left-[90px]

            h-[270px]
            w-[500px]

            rotate-[-14deg]

            rounded-[50%]

            border-t
            border-white/[0.30]
          "
        />

        {/* Soft diagonal glass reflection */}
        <div
          className="
            absolute

            -left-[32%]
            top-0

            h-full
            w-[52%]

            rotate-[14deg]

            bg-gradient-to-r
            from-white/[0.28]
            via-white/[0.06]
            to-transparent

            blur-[10px]
          "
        />

        {/* Soft dark vignette */}
        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_45%_18%,transparent_0%,rgba(0,0,0,0.015)_52%,rgba(0,0,0,0.08)_100%)]
          "
        />

        {/* Top glass edge */}
        <div
          className="
            absolute
            left-0
            right-0
            top-0

            h-px

            bg-gradient-to-r
            from-transparent
            via-white/[0.75]
            to-transparent
          "
        />

        {/* Right glass edge */}
        <div
          className="
            absolute
            bottom-0
            right-0
            top-0

            w-px

            bg-gradient-to-b
            from-white/[0.70]
            via-slate-300/[0.20]
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          MOBILE CLOSE BUTTON
          SAME LAYOUT
      ====================================================== */}

      {isCompact && !collapsed && (
        <div
          className="
            relative
            z-10

            flex
            h-10
            shrink-0
            items-center
            justify-end

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
              items-center
              justify-center

              rounded-lg

              border
              border-slate-300/50

              bg-white/[0.30]

              text-slate-500

              backdrop-blur-md

              shadow-[inset_0_1px_0_rgba(255,255,255,0.70)]

              transition

              hover:border-slate-300/70
              hover:bg-white/[0.45]
              hover:text-slate-800
            "
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* =====================================================
          LOGO
          SAME SIZE / SAME POSITION
      ====================================================== */}

      <div
        className={`
          relative
          z-10

          flex
          h-[68px]
          w-full
          shrink-0
          items-center

          border-b
          border-slate-300/[0.30]

          bg-white/[0.18]

          ${
            collapsed
              ? "justify-center"
              : "justify-center px-4"
          }
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

              ${
                collapsed
                  ? "h-9 w-9"
                  : "h-[45px] w-auto max-w-[140px]"
              }
            `}
          />
        </button>
      </div>

      {/* =====================================================
          NAVIGATION
          SAME LAYOUT / SAME HEIGHTS
      ====================================================== */}

      <nav
        className="
          sidebar-nav
          relative
          z-10

          min-h-0
          flex-1

          overflow-y-auto
          overflow-x-hidden

          px-3
          py-5
        "
      >
        {visibleNavItems.map(
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
                isSubmenuActive(itemPath),
              );

            return (
              <div
                className="mb-1"
                key={label}
              >
                <a
                  href={
                    expandable
                      ? undefined
                      : targetPath
                  }
                  onClick={(event) => {
                    if (expandable) {
                      event.preventDefault();

                      setExpandedNav((current) => ({
                        ...current,
                        [label]: !isNavExpanded(
                          label,
                          path,
                        ),
                      }));

                      return;
                    }

                    if (label === "Dashboard") {
                      onDashboard(event);
                      closeOnMobile();
                      return;
                    }

                    handleNavClick(
                      event,
                      targetPath,
                    );
                  }}
                  className={`
                    sidebar-link
                    group
                    relative

                    flex
                    h-[42px]
                    w-full
                    items-center
                    gap-3

                    overflow-hidden

                    rounded-lg

                    border

                    px-3

                    text-left
                    text-[13px]
                    font-medium

                    no-underline

                    transition-all
                    duration-200

                    ${
                      active
                        ? `
                          border-slate-300/[0.55]

                          bg-white/[0.48]

                          text-slate-900

                          shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]

                          backdrop-blur-md
                        `
                        : `
                          border-transparent

                          bg-transparent

                          text-slate-600

                          hover:border-slate-300/[0.35]
                          hover:bg-white/[0.28]
                          hover:text-slate-900
                        `
                    }
                  `}
                >
                  {/* Active liquid glass shine */}
                  {active && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-0

                        bg-gradient-to-r
                        from-white/[0.18]
                        via-transparent
                        to-slate-300/[0.08]
                      "
                    />
                  )}

                  {/* Icon */}
                  <span
                    className={`
                      relative
                      z-10

                      flex
                      w-5
                      shrink-0
                      items-center
                      justify-center

                      transition-colors
                      duration-200

                      ${
                        active
                          ? "text-slate-800"
                          : "text-slate-800 group-hover:text-slate-700"
                      }
                    `}
                  >
                    <IconComponent className="h-4 w-4" />
                  </span>

                  {!collapsed && (
                    <>
                      {/* Label */}
                      <span
                        className="
                          relative
                          z-10

                          min-w-0
                          flex-1
                          truncate
                        "
                      >
                        {label}
                      </span>

                      {/* Badge */}
                      {badge && (
                        <em
                          className="
                            relative
                            z-10

                            rounded-full

                            bg-slate-600/[0.78]

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

                      {/* Arrow */}
                      {expandable && (
                        <span className="relative z-10">
                          <Arrow />
                        </span>
                      )}
                    </>
                  )}
                </a>

                {/* =================================================
                    SUBMENU
                ================================================== */}

                {!collapsed &&
                  submenuItems[label] &&
                  isNavExpanded(
                    label,
                    path,
                  ) && (
                    <div
                      className="
                        relative
                        z-10

                        ml-4

                        border-l
                        border-slate-300/[0.45]

                        py-1
                        pl-3
                      "
                    >
                      {submenuItems[label]
                        .filter(([, itemPath]) =>
                          isSubItemAllowed(
                            path,
                            itemPath,
                          ),
                        )
                        .map(
                          ([item, itemPath]) => (
                            <a
                              key={item}
                              href={itemPath}
                              onClick={(event) => {
                                if (
                                  itemPath ===
                                  "/create-voucher/Quotation"
                                ) {
                                  onQuotation(
                                    event,
                                  );
                                  closeOnMobile();
                                  return;
                                }

                                handleNavClick(
                                  event,
                                  itemPath,
                                );
                              }}
                              className={`
                                block
                                rounded-md

                                border
                                border-transparent

                                px-3
                                py-2

                                text-[12px]

                                no-underline

                                transition-all
                                duration-200

                                ${
                                  isSubmenuActive(
                                    itemPath,
                                  )
                                    ? `
                                      border-slate-300/[0.45]

                                      bg-white/[0.38]

                                      font-semibold

                                      text-slate-800

                                      backdrop-blur-md
                                    `
                                    : `
                                      text-slate-600

                                      hover:bg-white/[0.22]

                                      hover:text-slate-800
                                    `
                                }
                              `}
                            >
                              {item}
                            </a>
                          ),
                        )}
                    </div>
                  )}
              </div>
            );
          },
        )}
      </nav>

      {/* =====================================================
          NEED HELP
          SAME LAYOUT / SAME POSITION
      ====================================================== */}

      {!collapsed && (
        <div
          className="
            relative
            z-10

            mx-3
            mb-4

            flex
            shrink-0
            items-center
            gap-3

            overflow-hidden

            rounded-xl

            border
            border-slate-300/[0.45]

            bg-white/[0.36]

            px-4
            py-3

            backdrop-blur-md

            shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]
          "
        >
          {/* Phone icon */}
          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center

              rounded-full

              bg-white/[0.42]

              border
              border-slate-300/[0.35]
            "
          >
            <Phone
              size={17}
              strokeWidth={2}
              className="text-slate-700"
            />
          </div>

          {/* Text */}
          <div
            className="
              flex
              min-w-0
              flex-col
            "
          >
            <p
              className="
                text-[11px]
                font-medium
                leading-4
                text-slate-500
              "
            >
              Need help?
            </p>

            <a
              href="tel:+919311472357"
              className="
                mt-0.5

                text-[12px]
                font-semibold

                text-slate-800

                no-underline

                transition

                hover:text-slate-950
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
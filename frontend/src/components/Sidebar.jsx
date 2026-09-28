import { X, Phone } from "lucide-react";
import logo from "../assets/Control-Books-Dashboard.png";
import smallLogo from "../assets/logo.png";
import {
  navItems,
  submenuItems,
} from "../routes/navigation";

function Arrow() {
  return (
    <span
      className="
        ml-auto
        text-base
        leading-none
        text-slate-500
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
  const entryPath =
    currentPath.toLowerCase();

  // ============================================================
  // MODULE ACCESS
  // ============================================================

  const isSubItemAllowed = (
    parentPath,
    itemPath,
  ) => {
    if (!Array.isArray(allowedModules)) {
      return true;
    }

    if (
      allowedModules.includes(
        parentPath,
      )
    ) {
      return true;
    }

    return allowedModules.includes(
      itemPath,
    );
  };

  // ============================================================
  // VISIBLE NAV ITEMS
  // ============================================================

  const visibleNavItems =
    navItems.filter(
      ([
        ,
        label,
        ,
        ,
        path,
      ]) => {
        if (
          !Array.isArray(
            allowedModules,
          )
        ) {
          return true;
        }

        const subItems =
          submenuItems[label];

        if (!subItems) {
          return allowedModules.includes(
            path,
          );
        }

        return (
          allowedModules.includes(
            path,
          ) ||
          subItems.some(
            ([
              ,
              itemPath,
            ]) =>
              isSubItemAllowed(
                path,
                itemPath,
              ),
          )
        );
      },
    );

  // ============================================================
  // ACTIVE SUBMENU
  // ============================================================

  const isSubmenuActive = (
    itemPath,
  ) =>
    entryPath ===
    itemPath.toLowerCase();

  // ============================================================
  // SPECIAL ROUTES
  // ============================================================

  const isCollectPaymentsRoute = (
    label,
  ) =>
    label ===
    "Collect Payments" &&
    [
      "/receivables",
      "/receivablesnew",
    ].includes(entryPath);

  const isCashBankRoute = (
    label,
  ) =>
    label === "Cash & Bank" &&
    (entryPath.startsWith(
      "/cash/",
    ) ||
      entryPath.startsWith(
        "/bank/",
      ) ||
      entryPath ===
      "/cash-bank/cash" ||
      entryPath ===
      "/cash-bank/bank");

  // ============================================================
  // NAV EXPANDED
  // ============================================================

  const isNavExpanded = (
    label,
    path,
  ) =>
    expandedNav[label] ??
    (currentPath.startsWith(
      `/${path}`,
    ) ||
      submenuItems[label]?.some(
        ([
          ,
          itemPath,
        ]) =>
          isSubmenuActive(
            itemPath,
          ),
      ));

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

  const handleNavClick = (
    event,
    targetPath,
  ) => {
    if (!targetPath) {
      return;
    }

    event.preventDefault();

    onNavigate(targetPath);

    closeOnMobile();
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
        border-[#17233F]

        bg-[#0A1128]

        text-white

        shadow-[8px_0_35px_rgba(0,0,0,0.30)]

        transition-all
        duration-200

        ${isCompact
          ? `${collapsed
            ? "-translate-x-full"
            : "translate-x-0"
          } w-[228px]`
          : collapsed
            ? "w-[68px]"
            : "w-[228px]"
        }
      `}
      data-collapsed={
        collapsed
      }
    >
      {/* =====================================================
          STATIC LIQUID GLASS BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Main solid background */}

        <div
          className="
            absolute
            inset-0
            bg-[#0A1128]
          "
        />

        {/* Top left subtle glow */}

        <div
          className="
            absolute
            -left-24
            -top-24

            h-64
            w-64

            rounded-full

            bg-white/[0.035]

            blur-[72px]
          "
        />

        {/* Top right subtle glow */}

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

        {/* Bottom left glow */}

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

        {/* Bottom right glow */}

        <div
          className="
            absolute
            -bottom-20
            -right-28

            h-64
            w-64

            rounded-full

            bg-white/[0.025]

            blur-[80px]
          "
        />

        {/* =================================================
            CURVED LIQUID LINES
        ================================================= */}

        {/* <div
          className="
            absolute

            -bottom-[115px]
            -left-[125px]

            h-[225px]
            w-[455px]

            rotate-[-14deg]

            rounded-[50%]

            border-t
            border-white/[0.10]
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
            border-blue-200/[0.045]
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
            border-white/[0.055]
          "
        /> */}

        {/* Diagonal glass reflection */}

        <div
          className="
            absolute

            -left-[32%]
            top-0

            h-full
            w-[52%]

            rotate-[14deg]

            bg-gradient-to-r
            from-white/[0.025]
            via-white/[0.008]
            to-transparent

            blur-[10px]
          "
        />

        {/* Dark vignette */}

        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_45%_18%,transparent_0%,rgba(0,0,0,0.015)_52%,rgba(0,0,0,0.16)_100%)]
          "
        />

        {/* Top edge */}

        <div
          className="
            absolute
            left-0
            right-0
            top-0

            h-px

            bg-gradient-to-r
            from-transparent
            via-white/[0.14]
            to-transparent
          "
        />

        {/* Right edge */}

        <div
          className="
            absolute
            bottom-0
            right-0
            top-0

            w-px

            bg-gradient-to-b
            from-white/[0.12]
            via-white/[0.035]
            to-transparent
          "
        />
      </div>

      {/* =====================================================
          MOBILE CLOSE BUTTON
      ====================================================== */}

      {isCompact &&
        !collapsed && (
          <div
            className="
              relative
              z-10

              flex
              h-10
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
              onClick={() =>
                setSidebarCollapsed(
                  true,
                )
              }
              className="
                flex
                h-8
                w-8
                items-center
                justify-center

                rounded-lg

                border
                border-[#1B2948]

                bg-[#0A1128]

                text-slate-400

                transition

                hover:border-[#26385E]
                hover:bg-[#111B35]
                hover:text-white
              "
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

      {/* =====================================================
          LOGO
          SOLID #0A1128 BACKGROUND
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
          border-[#17233F]

          bg-[#0A1128]

          ${collapsed
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
            src={
              collapsed
                ? smallLogo
                : logo
            }
            alt="CtrlBooks logo"
            className={`
              block
              

              ${collapsed
                ? "h-10 w-10"
                : "h-15 w-500 ml-4"
              }
            `}
          />
        </button>
      </div>

      {/* =====================================================
          NAVIGATION
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

          [scrollbar-width:thin]
          [scrollbar-color:#26385E_transparent]
        "
      >
        {visibleNavItems.map(
          ([
            IconComponent,
            label,
            expandable,
            badge,
            path,
          ]) => {
            const targetPath =
              label ===
                "Dashboard"
                ? "/dashboard"
                : `/${path}`;

            const active =
              (label ===
                "Dashboard" &&
                showDashboard) ||
              isCollectPaymentsRoute(
                label,
              ) ||
              isCashBankRoute(
                label,
              ) ||
              currentPath.startsWith(
                `/${path}`,
              ) ||
              submenuItems[
                label
              ]?.some(
                ([
                  ,
                  itemPath,
                ]) =>
                  isSubmenuActive(
                    itemPath,
                  ),
              );

            return (
              <div
                className="mb-1"
                key={label}
              >
                {/* =================================================
                    MAIN NAV ITEM
                ================================================== */}

                <a
                  href={
                    expandable
                      ? undefined
                      : targetPath
                  }
                  onClick={(
                    event,
                  ) => {
                    if (
                      expandable
                    ) {
                      event.preventDefault();

                      setExpandedNav(
                        (
                          current,
                        ) => ({
                          ...current,
                          [label]:
                            !isNavExpanded(
                              label,
                              path,
                            ),
                        }),
                      );

                      return;
                    }

                    if (
                      label ===
                      "Dashboard"
                    ) {
                      onDashboard(
                        event,
                      );

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

                    ${active
                      ? `
                          border-[#26385E]

                          bg-[#111B35]

                          text-white
                          border-green-500

                          shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                        `
                      : `
                          border-transparent

                          bg-transparent

                          text-slate-300

                          hover:border-green-500
                          hover:bg-[#101932]
                          hover:text-white
                          
                        `
                    }
                  `}
                >
                  {/* Active shine */}

                  {active && (
                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-0

                        bg-gradient-to-r
                        from-white/[0.035]
                        via-transparent
                        to-blue-200/[0.015]
                        
                      "
                    />
                  )}

                  {/* Active indicator */}

                  {active && (
                    <span
                      className="
                        absolute
                        left-0
                        top-1/2

                        h-5
                        w-[2px]

                        -translate-y-1/2

                        rounded-r-full

                        bg-emerald-400
                        
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

                      ${active
                        ? "text-emerald-400"
                        : "text-slate-400 group-hover:text-emerald-400"
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

                          text-slate-200
                          group-hover:text-white
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

                            border
                            border-[#26385E]

                            bg-[#111B35]

                            px-1.5
                            py-0.5

                            text-[9px]
                            font-semibold
                            not-italic
                            text-slate-300
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
    border-[#1B2948]
    py-1
    pl-3
  "
                    >
                      {submenuItems[label]
                        .filter(
                          ([, itemPath]) =>
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
                                  onQuotation(event);
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

            px-3
            py-2

            text-[12px]

            no-underline

            transition-all
            duration-200

            ${isSubmenuActive(itemPath)
                                  ? `
                  border-[#009966]
                  bg-[#111B35]
                  font-semibold
                  text-white
                `
                                  : `
                  border-transparent
                  text-slate-400
                  hover:border-[#009966]
                  hover:bg-[#101932]
                  hover:text-white
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
          MATCHING YOUR SCREENSHOT
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

            rounded-xl

            border
            border-[#1B2948]

            bg-[#0A1128]

            px-3
            py-2.5
          "
        >
          {/* Phone icon */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center

              rounded-lg

              text-emerald-400
            "
          >
            <Phone
              size={18}
              strokeWidth={2}
            />
          </div>

          {/* Help text */}

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
                text-slate-400
              "
            >
              Need help?
            </p>

            <a
              href="tel:+919311472357"
              className="
    mt-0.5
    text-[12px]
    font-bold
    leading-4
    text-emerald-400
    no-underline
    transition
    hover:text-[#43E198]
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
import { useState } from "react";
function Arrow() {
  return (
    <span className="ml-auto flex h-5 w-4 shrink-0 items-center justify-center text-base leading-none text-slate-400" aria-hidden="true">
      ›
    </span>
  );
}

export default function SidebarNavigation({ visibleNavItems, navItemRefs, submenuItems, isSubItemAllowed, isSubmenuActive, isCollectPaymentsRoute, isCashBankRoute, currentPath, showDashboard, collapsed, isNavExpanded, handleExpandableClick, handleDashboardClick, handleNavClick, closeAllDropdowns, onQuotation, closeOnMobile, onNavigate }) {
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (event, label, path) => {
    event.preventDefault();
    event.stopPropagation();

    const isCurrentlyOpen = openSubmenu === label;

    // Preserve any existing parent navigation logic.
    // handleExpandableClick(event, label, path);

    // Close the current submenu, or open only the clicked submenu.
    setOpenSubmenu(isCurrentlyOpen ? null : label);
  };
  return (
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
        ([
          IconComponent,
          label,
          expandable,
          badge,
          path,
        ]) => {
          const targetPath =
            label === "Dashboard"
              ? "/dashboard"
              : `/${path}`;

          const hasSubmenu =
            Array.isArray(
              submenuItems[label],
            ) &&
            submenuItems[label].length > 0;

          const active =
            (label === "Dashboard" &&
              showDashboard) ||
            isCollectPaymentsRoute(
              label,
            ) ||
            isCashBankRoute(label) ||
            currentPath.startsWith(
              `/${path}`,
            ) ||
            submenuItems[label]?.some(
              ([, itemPath]) =>
                isSubmenuActive(itemPath),
            );
          const submenuOpen =
            hasSubmenu && openSubmenu === label;

          return (
            <div
              key={label}
              ref={(element) => {
                navItemRefs.current[label] =
                  element;
              }}
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
                href={
                  expandable
                    ? undefined
                    : targetPath
                }
                onClick={(event) => {
                  if (expandable) {
                    toggleSubmenu(event, label, path);
                    return;
                  }

                  if (label === "Dashboard") {
                    handleDashboardClick(event);
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

                    ${active
                    ? "text-emerald-400"
                    : "text-white hover:text-emerald-400"
                  }
                  `}
              >
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

                      ${active
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

                          ${active
                          ? "text-emerald-400"
                          : "text-white group-hover:text-emerald-400"
                        }
                        `}
                    >
                      {label}
                    </span>

                    {/* ========================================
                          BADGE
                      ======================================== */}

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
                      ======================================== */}

                    {expandable && hasSubmenu && (
                      <span
                        className={`relative z-10 ml-auto flex h-8 w-8 shrink-0 items-center justify-center text-slate-400 transition-transform duration-200 ${submenuOpen ? "rotate-90 bottom-[20%]" : "rotate-0"
                          }`}
                        aria-hidden="true"
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

              {!collapsed &&
                hasSubmenu &&
                submenuOpen && (
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
                      .filter(
                        ([, itemPath]) =>
                          isSubItemAllowed(
                            path,
                            itemPath,
                          ),
                      )
                      .map(
                        ([item, itemPath]) => {
                          const subActive =
                            isSubmenuActive(
                              itemPath,
                            );

                          return (
                            <a

                              key={item}
                              href={itemPath}
                              onClick={(
                                event,
                              ) => {
                                event.preventDefault();

                                // Close all dropdowns
                                closeAllDropdowns();

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

                                onNavigate(
                                  itemPath,
                                );

                                closeOnMobile();
                              }}
                              style={{
                                boxSizing:
                                  "border-box",
                                display:
                                  "block",
                                position:
                                  "relative",
                                width: "100%",
                                height:
                                  "38px",
                                minHeight:
                                  "38px",
                                maxHeight:
                                  "38px",
                                margin: 0,
                                paddingTop:
                                  "8px",
                                paddingBottom:
                                  "8px",
                                paddingLeft:
                                  "12px",
                                paddingRight:
                                  "12px",
                                border:
                                  "0",
                                borderWidth:
                                  "0",
                                borderStyle:
                                  "none",
                                borderRadius:
                                  "6px",
                                lineHeight:
                                  "22px",
                                fontSize:
                                  "14px",
                                fontWeight:
                                  500,
                                textDecoration:
                                  "none",
                                transform:
                                  "none",
                              }}
                              className={`
                                  overflow-hidden

                                  outline-none
                                  no-underline
                                  transition-none

                                  ${subActive
                                  ? "text-emerald-400"
                                  : "text-white hover:text-emerald-400"
                                }
                                `}
                            >
                              {/* =================================
                                    SUBMENU ACTIVE BACKGROUND
                                ================================== */}

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

                              {/* =================================
                                    SUBMENU TEXT
                                ================================== */}

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
                        },
                      )}
                  </div>
                )}
            </div>
          );
        },
      )}
    </nav>
  );
}

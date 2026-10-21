import { useEffect, useRef } from "react";
import { navItems, submenuItems } from "../routes/navigation";
import SidebarNavigation from "./Sidebar/SidebarNavigation";
import SidebarBackground from "./Sidebar/SidebarBackground";
import SidebarHeader from "./Sidebar/SidebarHeader";
import SidebarHelp from "./Sidebar/SidebarHelp";

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

  const navItemRefs = useRef({});

  const isSubItemAllowed = (parentPath, itemPath) => {
    if (!Array.isArray(allowedModules)) {
      return true;
    }

    if (allowedModules.includes(parentPath)) {
      return true;
    }

    return allowedModules.includes(itemPath);
  };

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
  // AUTO SCROLL TO OPENED DROPDOWN
  // ============================================================

  useEffect(() => {
    const openedLabel = Object.keys(expandedNav).find(
      (label) => expandedNav[label],
    );

    if (!openedLabel || collapsed) {
      return;
    }

    const element = navItemRefs.current[openedLabel];

    if (!element) {
      return;
    }

    // Wait until submenu is rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      });
    });
  }, [expandedNav, collapsed]);

  // ============================================================
  // CLOSE ALL DROPDOWNS
  // ============================================================

  const closeAllDropdowns = () => {
    setExpandedNav({});
  };

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

    // Close every open dropdown
    closeAllDropdowns();

    onNavigate(targetPath);
    closeOnMobile();
  };

  // ============================================================
  // DASHBOARD
  // ============================================================

  const handleDashboardClick = (event) => {
    event.preventDefault();

    // Close all dropdowns
    closeAllDropdowns();

    onDashboard(event);
    closeOnMobile();
  };

  // ============================================================
  // SINGLE SUBMENU OPEN
  // ============================================================

  const handleExpandableClick = (event, label, path) => {
    event.preventDefault();

    setExpandedNav((current) => {
      const isCurrentlyOpen = current[label] ?? isNavExpanded(label, path);

      // Clicking the already-open dropdown closes it
      if (isCurrentlyOpen) {
        return {};
      }

      // Close all other dropdowns and open only this one
      return {
        [label]: true,
      };
    });
  };

  // ============================================================
  // RENDER
  // ============================================================

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
      <SidebarBackground />

      <SidebarHeader
        collapsed={collapsed}
        isCompact={isCompact}
        setSidebarCollapsed={setSidebarCollapsed}
        closeAllDropdowns={closeAllDropdowns}
        onDashboard={onDashboard}
        closeOnMobile={closeOnMobile}
      />

      <SidebarNavigation
        visibleNavItems={visibleNavItems}
        navItemRefs={navItemRefs}
        submenuItems={submenuItems}
        isSubItemAllowed={isSubItemAllowed}
        isSubmenuActive={isSubmenuActive}
        isCollectPaymentsRoute={isCollectPaymentsRoute}
        isCashBankRoute={isCashBankRoute}
        currentPath={currentPath}
        showDashboard={showDashboard}
        collapsed={collapsed}
        isNavExpanded={isNavExpanded}
        handleExpandableClick={handleExpandableClick}
        handleDashboardClick={handleDashboardClick}
        handleNavClick={handleNavClick}
        closeAllDropdowns={closeAllDropdowns}
        onQuotation={onQuotation}
        closeOnMobile={closeOnMobile}
        onNavigate={onNavigate}
      />

      <SidebarHelp collapsed={collapsed} />
    </aside>
  );
}

export default Sidebar;

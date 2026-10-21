import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react";
import { fetchInvoices } from "../../services/billingApi";
import CompanySelector from "./CompanySelector";
import HeaderActions from "./HeaderActions";
import ConnectorStatusButton from "./ConnectorStatus/ConnectorStatusButton";

export default function AppHeader({
  sidebarCollapsed,
  setSidebarCollapsed,
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
  const [hasInvoices, setHasInvoices] = useState(false);

  useEffect(() => {
    fetchInvoices({ page: 1, limit: 1 })
      .then((data) => {
        setHasInvoices(
          Number(data?.total || 0) > 0 || data?.items?.length > 0,
        );
      })
      .catch(() => setHasInvoices(false));
  }, []);

  useEffect(() => {
    const closeMenus = () => {
      setShowCompanyMenu(false);
      setShowProfileMenu(false);
    };
    const closeMenusOutsideHeader = (event) => {
      if (!headerRef.current?.contains(event.target)) closeMenus();
    };

    window.addEventListener("popstate", closeMenus);
    document.addEventListener("mousedown", closeMenusOutsideHeader);
    return () => {
      window.removeEventListener("popstate", closeMenus);
      document.removeEventListener("mousedown", closeMenusOutsideHeader);
    };
  }, [setShowCompanyMenu, setShowProfileMenu]);

  const toggleCompanyMenu = () => {
    if (!selectedCompany) return;
    setShowCompanyMenu((open) => !open);
    setShowProfileMenu(false);
  };

  const toggleProfileMenu = () => {
    setShowProfileMenu((open) => !open);
    setShowCompanyMenu(false);
  };

  const closeMenus = () => {
    setShowCompanyMenu(false);
    setShowProfileMenu(false);
  };

  const handleCompanySelect = (company) => {
    if (!company) return;
    onSelectCompany?.(company);
    onNavigate?.("/dashboard");
    closeMenus();
  };

  const handleProfileAction = (label) => {
    closeMenus();
    if (label === "Profile") {
      onNavigate?.("/profile");
      onProfileClick?.();
    } else if (label === "All User") {
      onNavigate?.("/all-users");
      onAllUsersClick?.();
    } else if (label === "Download Invoice") {
      onNavigate?.("/download-invoice");
    } else if (label === "Logout") {
      onLogout?.();
    }
  };

  return (
    <header
      ref={headerRef}
      className="app-header relative z-[1000] w-full overflow-visible border-b border-gray-200 bg-white text-gray-900 shadow-sm"
    >
      <div className="relative z-50 flex h-16 min-h-16 w-full min-w-0 items-stretch overflow-visible bg-transparent px-0 sm:px-2">
        <div className="flex h-16 w-12 shrink-0 items-center justify-center border-r border-black/[0.06] bg-black/[0.02] sm:w-14">
          <button
            type="button"
            aria-label="Toggle sidebar"
            aria-expanded={!sidebarCollapsed}
            onClick={() => setSidebarCollapsed((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-black/[0.08] bg-black/[0.04] text-emerald-700 shadow-[inset_0_1px_0_rgba(0,0,0,0.04)] transition-all hover:border-black/[0.15] hover:bg-black/[0.05] hover:text-gray-900 active:scale-95"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        <CompanySelector
          selectedCompany={selectedCompany}
          companyOptions={companyOptions}
          showCompanyMenu={showCompanyMenu}
          onToggle={toggleCompanyMenu}
          onSelectCompany={handleCompanySelect}
        />

        <HeaderActions
          onMobileVersionClick={onMobileVersionClick}
          connectorStatusRows={connectorStatusRows}
          lastSyncMeta={lastSyncMeta}
          connectorStatusError={connectorStatusError}
          isConnectorStatusLoading={isConnectorStatusLoading}
          showProfileMenu={showProfileMenu}
          onToggleProfile={toggleProfileMenu}
          hasInvoices={hasInvoices}
          onProfileAction={handleProfileAction}
        />
      </div>

      <div className="relative z-10 flex min-h-16 w-full border-t border-gray-200 bg-white lg:hidden">
        <div className="relative z-10 flex min-w-0 flex-1 items-center justify-center bg-transparent px-3 py-2">
          <ConnectorStatusButton
            rows={connectorStatusRows}
            lastSyncMeta={lastSyncMeta}
            connectorStatusError={connectorStatusError}
            isConnectorStatusLoading={isConnectorStatusLoading}
          />
        </div>
      </div>
    </header>
  );
}

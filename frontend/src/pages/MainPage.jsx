import { useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";
import { getCompanyId, selectedCompanyStorageKey } from "./MainPage/utils";
import { getRouteFlags } from "../routes/routeConfig";
import MainPageLayout from "./MainPage/MainPageLayout";
import useMainPageNavigation from "./MainPage/useMainPageNavigation";
import useCompanySelection from "./MainPage/useCompanySelection";
import {
  extractCompanies,
  extractConnectorsStatusRows,
  extractLastSyncMeta,
  fetchCompanies,
  fetchConnectorsStatus,
  normalizeCompany,
} from "../services/companiesApi";
import {
  extractOrganizationContext,
  fetchProfile,
} from "../services/profileApi";


function App() {
  const [activeTab, setActiveTab] = useState("Customers");

  const [selectedPeriod, setSelectedPeriod] = useState(
    "This Year (1st Apr ’26 - 31st Mar ’27)",
  );

  const [dayBookDate, setDayBookDate] = useState("");

  const customDateInput = useRef(null);

  const [currentPath, setCurrentPath] = useState(
    window.location.pathname,
  );

  const [showEway, setShowEway] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  const [selectedCompany, setSelectedCompany] = useState(() => {
    const storedCompanyId =
      typeof window !== "undefined"
        ? window.localStorage.getItem(
          selectedCompanyStorageKey,
        )
        : null;

    return storedCompanyId
      ? { id: storedCompanyId }
      : {
        name: "",
        meta: "",
        isCurrent: true,
      };
  });

  const selectedCompanyRef = useRef(selectedCompany);

  const [connectorStatusRows, setConnectorStatusRows] = useState([]);
  const [lastSyncMeta, setLastSyncMeta] = useState(null);
  const [connectorStatusError, setConnectorStatusError] =
    useState("");
  const [
    isConnectorStatusLoading,
    setIsConnectorStatusLoading,
  ] = useState(false);

  const [companyOptions, setCompanyOptions] = useState([
    {
      name: "",
      meta: "",
      isCurrent: true,
    },
    {
      name: "",
      meta: "",
      isCurrent: false,
    },
  ]);

  const [expandedNav, setExpandedNav] = useState({});
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [isCompact, setIsCompact] = useState(() =>
    typeof window !== "undefined"
      ? window.innerWidth < 1024
      : false,
  );

  const [allowedModules, setAllowedModules] =
    useState(null);

  const accessToken = useAuthStore(
    (state) => state.accessToken,
  );

  const logout = useAuthStore(
    (state) => state.logout,
  );

  /* =========================================================
     PROFILE / MODULE ACCESS
     ========================================================= */

  useEffect(() => {
    if (!accessToken) {
      setAllowedModules(null);
      return undefined;
    }

    let isMounted = true;

    fetchProfile(accessToken)
      .then((response) => {
        if (!isMounted) return;

        const ctx =
          extractOrganizationContext(response);

        // Owner (or no member restriction found)
        // => full sidebar
        setAllowedModules(
          ctx.role === "OWNER"
            ? null
            : ctx.allowedModules,
        );
      })
      .catch((error) => {
        console.warn(
          "Failed to load organization profile for sidebar access:",
          error,
        );
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  /* =========================================================
     RESPONSIVE SIDEBAR
     ========================================================= */

  useEffect(() => {
    const handleResize = () => {
      const compact =
        window.innerWidth < 1024;

      setIsCompact(compact);

      if (compact) {
        setSidebarCollapsed(true);
      }
    };

    handleResize();

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, []);

  /* =========================================================
     CUSTOM DATE PICKER
     ========================================================= */

  const openCustomDatePicker = () => {
    const input = customDateInput.current;

    if (!input) return;

    try {
      if (input.showPicker) {
        input.showPicker();
      } else {
        input.click();
      }
    } catch {
      input.click();
    }
  };

  /* =========================================================
     ROUTE LISTENER
     ========================================================= */

  useEffect(() => {
    const refreshRoute = () =>
      setCurrentPath(
        window.location.pathname,
      );

    window.addEventListener(
      "popstate",
      refreshRoute,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        refreshRoute,
      );
    };
  }, []);

  /* =========================================================
     CONNECTOR STATUS
     ========================================================= */

  useEffect(() => {
    if (!accessToken) {
      setConnectorStatusRows([]);
      setLastSyncMeta(null);
      setConnectorStatusError("");

      return undefined;
    }

    let isMounted = true;

    setIsConnectorStatusLoading(true);
    setConnectorStatusError("");

    fetchConnectorsStatus(accessToken)
      .then((response) => {
        if (!isMounted) return;

        const rows =
          extractConnectorsStatusRows(
            response,
          );

        setConnectorStatusRows(rows);

        setLastSyncMeta(
          extractLastSyncMeta(response),
        );
      })
      .catch((error) => {
        if (!isMounted) return;

        setConnectorStatusError(
          error?.message ||
          "Unable to load connector status.",
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsConnectorStatusLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  /* =========================================================
     COMPANIES
     ========================================================= */

  useEffect(() => {
    if (!accessToken) return undefined;

    let isMounted = true;

    fetchCompanies(accessToken)
      .then((response) => {
        if (!isMounted) return;

        const companies =
          extractCompanies(response).map(
            normalizeCompany,
          );

        if (companies.length === 0) return;

        const storedCompanyId =
          typeof window !== "undefined"
            ? window.localStorage.getItem(
              selectedCompanyStorageKey,
            )
            : null;

        const selectedCompanyState =
          selectedCompanyRef.current;

        const selectedCompanyId =
          getCompanyId(
            selectedCompanyState,
          );

        const selectedCompanyName =
          String(
            selectedCompanyState?.name ||
            selectedCompanyState?.companyName ||
            "",
          )
            .trim()
            .toLowerCase();

        const currentCompany =
          companies.find((company) => {
            const companyId =
              getCompanyId(company);

            const companyName =
              String(company?.name || "")
                .trim()
                .toLowerCase();

            return (
              (companyId &&
                String(companyId) ===
                String(
                  storedCompanyId ||
                  selectedCompanyId,
                )) ||
              (selectedCompanyName &&
                companyName ===
                selectedCompanyName)
            );
          }) || companies[0];

        const remainingCompanies =
          companies.filter(
            (company) =>
              company !== currentCompany,
          );

        const normalizedCurrentCompany = {
          ...currentCompany,
          isCurrent: true,
        };

        selectedCompanyRef.current =
          normalizedCurrentCompany;

        setSelectedCompany(
          normalizedCurrentCompany,
        );

        setCompanyOptions([
          {
            ...currentCompany,
            isCurrent: true,
          },
          ...remainingCompanies.map(
            (company) => ({
              ...company,
              isCurrent: false,
            }),
          ),
        ]);

        if (
          typeof window !== "undefined" &&
          getCompanyId(currentCompany)
        ) {
          window.localStorage.setItem(
            selectedCompanyStorageKey,
            String(
              getCompanyId(currentCompany),
            ),
          );
        }
      })
      .catch((error) => {
        console.warn(
          "Company list API failed, using local company list:",
          error,
        );
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken]);

  const {
    navigateTo,
    openQuotation,
    openMobileVersion,
    openDashboard,
  } = useMainPageNavigation(setShowEway);

  const flags = getRouteFlags(
    currentPath,
  );

  const entryPath =
    flags.normalizedPath;

  /* =========================================================
     COMPANY HANDLERS
     ========================================================= */

  const { handleCompanyAdd, selectCompany } = useCompanySelection({
    selectedCompanyRef,
    setSelectedCompany,
    setCompanyOptions,
    setShowCompanyMenu,
  });

  /* =========================================================
     RENDER PAGE
     ========================================================= */

  /* =========================================================
     MAIN RETURN
     ========================================================= */

  return (
    <MainPageLayout
      sidebarCollapsed={sidebarCollapsed}
      setSidebarCollapsed={setSidebarCollapsed}
      isCompact={isCompact}
      currentPath={currentPath}
      flags={flags}
      expandedNav={expandedNav}
      setExpandedNav={setExpandedNav}
      openDashboard={openDashboard}
      openQuotation={openQuotation}
      navigateTo={navigateTo}
      allowedModules={allowedModules}
      showEway={showEway}
      setShowEway={setShowEway}
      showProfileMenu={showProfileMenu}
      setShowProfileMenu={setShowProfileMenu}
      showCompanyMenu={showCompanyMenu}
      setShowCompanyMenu={setShowCompanyMenu}
      openMobileVersion={openMobileVersion}
      selectedCompany={selectedCompany}
      companyOptions={companyOptions}
      handleCompanyAdd={handleCompanyAdd}
      selectCompany={selectCompany}
      logout={logout}
      connectorStatusRows={connectorStatusRows}
      lastSyncMeta={lastSyncMeta}
      connectorStatusError={connectorStatusError}
      isConnectorStatusLoading={isConnectorStatusLoading}
      entryPath={entryPath}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      selectedPeriod={selectedPeriod}
      setSelectedPeriod={setSelectedPeriod}
      dayBookDate={dayBookDate}
      setDayBookDate={setDayBookDate}
      openCustomDatePicker={openCustomDatePicker}
      customDateInput={customDateInput}
    />
  );
}

export default App;
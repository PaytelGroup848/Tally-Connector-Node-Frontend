import AppHeader from "../../components/AppHeader"
import Sidebar from "../../components/Sidebar"
import PageRenderer from "./PageRenderer"
import QuickCreateButton from "./QuickCreateButton"

export default function MainPageLayout({
  sidebarCollapsed,
  setSidebarCollapsed,
  isCompact,
  currentPath,
  flags,
  expandedNav,
  setExpandedNav,
  openDashboard,
  openQuotation,
  navigateTo,
  allowedModules,
  showEway,
  setShowEway,
  showProfileMenu,
  setShowProfileMenu,
  showCompanyMenu,
  setShowCompanyMenu,
  openMobileVersion,
  selectedCompany,
  companyOptions,
  handleCompanyAdd,
  selectCompany,
  logout,
  connectorStatusRows,
  lastSyncMeta,
  connectorStatusError,
  isConnectorStatusLoading,
  entryPath,
  activeTab,
  setActiveTab,
  selectedPeriod,
  setSelectedPeriod,
  dayBookDate,
  setDayBookDate,
  openCustomDatePicker,
  customDateInput,
}) {
  return (
    <div className="app-shell relative min-h-screen bg-app-bg text-app-text">
      <Sidebar
        collapsed={sidebarCollapsed}
        isCompact={isCompact}
        setSidebarCollapsed={setSidebarCollapsed}
        currentPath={currentPath}
        showDashboard={flags.showDashboard}
        expandedNav={expandedNav}
        setExpandedNav={setExpandedNav}
        onDashboard={openDashboard}
        onQuotation={openQuotation}
        onNavigate={navigateTo}
        allowedModules={allowedModules}
      />

      <main
        className={`app-main relative min-h-screen min-w-0 transition-[margin-left,width] duration-200 ${
          isCompact
            ? "ml-0 w-full"
            : sidebarCollapsed
              ? "ml-[68px] sidebar-collapsed w-[calc(100%-68px)]"
              : "ml-[228px] w-[calc(100%-228px)]"
        }`}
      >
        <AppHeader
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          setShowEway={setShowEway}
          onOpenEway={() => navigateTo("/eway")}
          showProfileMenu={showProfileMenu}
          setShowProfileMenu={setShowProfileMenu}
          showCompanyMenu={showCompanyMenu}
          setShowCompanyMenu={setShowCompanyMenu}
          onNavigate={navigateTo}
          onProfileClick={() => navigateTo("/profile")}
          onAllUsersClick={() => navigateTo("/all-users")}
          onMobileVersionClick={openMobileVersion}
          selectedCompany={selectedCompany}
          companyOptions={companyOptions}
          onAddCompany={handleCompanyAdd}
          onSelectCompany={selectCompany}
          onLogout={async () => {
            await logout()
            window.location.replace("/")
          }}
          connectorStatusRows={connectorStatusRows}
          lastSyncMeta={lastSyncMeta}
          connectorStatusError={connectorStatusError}
          isConnectorStatusLoading={isConnectorStatusLoading}
        />

        <PageRenderer
          flags={flags}
          currentPath={currentPath}
          entryPath={entryPath}
          selectedCompany={selectedCompany}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedPeriod={selectedPeriod}
          setSelectedPeriod={setSelectedPeriod}
          dayBookDate={dayBookDate}
          setDayBookDate={setDayBookDate}
          openCustomDatePicker={openCustomDatePicker}
          customDateInput={customDateInput}
          navigateTo={navigateTo}
          showEway={showEway}
        />
      </main>

      <QuickCreateButton navigateTo={navigateTo} />
    </div>
  )
}

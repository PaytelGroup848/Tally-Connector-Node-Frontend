import DashboardPage from "../Dashboard"
import PlansPage from "../PlansPage"
import ProfilePage from "../ProfilePage"
import MyCompanyDetailsPage from "../../components/MyCompanyDetailsPage"
import { getCompanyId } from "./utils"

export default function renderDashboardRoute({
  flags,
  currentPath,
  entryPath,
  selectedCompany,
  activeTab,
  setActiveTab,
  selectedPeriod,
  setSelectedPeriod,
  dayBookDate,
  setDayBookDate,
  openCustomDatePicker,
  customDateInput,
  navigateTo,
}) {
  if (flags.showCompanyDetailsPage) {
    return <MyCompanyDetailsPage />
  }

  if (entryPath === "/my-ledgers") {
    return (
      <MyCompanyDetailsPage
        companyId={
          getCompanyId(selectedCompany) ||
          "6aa0f659f858467a84d08d57"
        }
      />
    )
  }

  if (currentPath === "/profile") {
    return <ProfilePage />
  }

  if (flags.showPlansPage) {
    return <PlansPage />
  }

  if (flags.showDashboard) {
    return (
      <DashboardPage
        companyId={getCompanyId(selectedCompany)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        dayBookDate={dayBookDate}
        setDayBookDate={setDayBookDate}
        openCustomDatePicker={openCustomDatePicker}
        customDateInput={customDateInput}
        onMetricClick={(label) => {
          const routes = {
            CASH: "/cash-bank/cash",
            BANK: "/cash-bank/bank",
          }
          const target = routes[label]
          if (target) navigateTo(target)
        }}
      />
    )
  }

  return null
}

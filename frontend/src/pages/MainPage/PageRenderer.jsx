import MyEwayBillPage from "./MyEwayBillPage";
import renderMyVoucherRoute from "./MyVoucherRoutes";
import renderDashboardRoute from "./renderDashboardRoute";
import { getCompanyId } from "./utils";
import EwayPage from "../EwayPage";
import AddNewPage from "../AddNewPage";
import AddUserPage from "../AddUserPage";
import AllUsersPage from "../AllUsersPage";
import DownloadInvoicePage from "../DownloadInvoicePage";
import GstSearchPage from "../GstSearchPage";
import ItemsPage from "../ItemsPage";
import SettingsPage from "../SettingsPage";
import ViewBankStatusPage from "../../components/ViewBankStatusPage";
import CreateItemPage from "../CreateItemPage";
import CreatePartyPage from "../CreatePartyPage";
import MyEntryListPage from "../MyEntryListPage";
import NotFoundPage from "../NotFoundPage";
import PartiesPage from "../PartiesPage";
import PurchasePage from "../PurchasePage";
import PhysicalStockPage from "../PhysicalStockPage";
import ReportListPage from "../ReportListPage";
import TrialBalancePage from "../TrialBalancePage";
import DayBookPage from "../DayBookPage";
import ProfitLossPage from "../Profit&LossPage";
import BalanceSheetPage from "../BalanceSheetPage";
import VoucherLinesPage from "../VoucherLinesPage";
import ReportsPage from "../ReportsPage";
import ReceiptPage from "../ReceiptPage";
import { DocumentVoucherPage } from "../DocumentVoucherPage";
import ManageReminderPage from "../ManageReminderPage";
import DataBackupPage from "../DataBackupPage";
import VouchersPage from "../VouchersPage";


export default function PageRenderer({
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
  showEway,
}) {
  const renderPage = () => {
    if (currentPath === "/bank-status") {
      const searchParams = new URLSearchParams(window.location.search);
      const companyId = searchParams.get("companyId");
      const companyName = searchParams.get("companyName") || "";

      return (
        <ViewBankStatusPage
          key={companyId || "missing-company"}
          companyId={companyId}
          companyName={companyName}
          onClose={() => navigateTo("/settings")}
        />
      );
    }

    const dashboardRoute = renderDashboardRoute({
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
    });
    if (dashboardRoute) return dashboardRoute;

    if (flags.showAddNewPage) {
      return (
        <AddNewPage
          path={currentPath}
          companyId={getCompanyId(
            selectedCompany,
          )}
        />
      );
    }

    if (
      flags.showEwayPage ||
      showEway
    ) {
      return <EwayPage />;
    }

    if (flags.showReportsPage) {
      return <ReportsPage />;
    }

    if (flags.showCreateItemPage) {
      return <CreateItemPage />;
    }

    if (flags.showCreatePartyPage) {
      return <CreatePartyPage />;
    }

    if (flags.showItemsPage) {
      return (
        <ItemsPage
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showPartiesPage) {
      return (
        <PartiesPage
          selectedCompany={
            selectedCompany
          }
        />
      );
    }
    if (flags.showSettingsPage) {
      return (
        <SettingsPage
          selectedCompany={
            selectedCompany
          }
          navigateTo={navigateTo}
        />
      );
    }

    if (currentPath === "/my-eway-bill") {
      return <MyEwayBillPage />;
    }

    const myVoucherRoutes = renderMyVoucherRoute({
      currentPath,
      flags,
      selectedCompany,
    });
    if (myVoucherRoutes) return myVoucherRoutes;

    if (
      flags.showManageReminderPage
    ) {
      return <ManageReminderPage />;
    }

    if (flags.showEntryList) {
      return (
        <MyEntryListPage
          path={entryPath}
        />
      );
    }

    if (flags.showGstPage) {
      return <GstSearchPage />;
    }

    if (flags.showVouchersPage) {
      return (
        <VouchersPage
          companyId={getCompanyId(
            selectedCompany,
          )}
        />
      );
    }

    

    if (flags.showAllUsersPage) {
      return <AllUsersPage />;
    }

    if (flags.showAddUserPage) {
      return <AddUserPage />;
    }

  

   

    if (
      flags.showDownloadInvoicePage
    ) {
      return <DownloadInvoicePage />;
    }

    if (
      entryPath ===
      "/trial-balance"
    ) {
      return (
        <TrialBalancePage
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (
      entryPath ===
      "/day-book"
    ) {
      return (
        <DayBookPage
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (
      entryPath ===
      "/profit-loss"
    ) {
      return (
        <ProfitLossPage
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (
      entryPath ===
      "/balance-sheet"
    ) {
      return (
        <BalanceSheetPage
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (
      entryPath ===
      "/voucher-lines"
    ) {
      return (
        <VoucherLinesPage
          companyId={
            selectedCompany?.id
          }
          companyName={
            selectedCompany?.name
          }
        />
      );
    }

    if (flags.showPayment) {
      return (
        <ReceiptPage
          key={currentPath}
          companyId={
            selectedCompany?.id
          }
          selectedCompany={
            selectedCompany
          }
          documentType="Payment"
        />
      );
    }

    if (flags.showReceiptNote) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Receipt Note"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showReceipt) {
      return (
        <ReceiptPage
          key={currentPath}
          companyId={
            selectedCompany?.id
          }
          selectedCompany={
            selectedCompany
          }
        />
      );
    }

    if (flags.showPurchaseOrder) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Purchase Order"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showPurchase) {
      return currentPath.toLowerCase() ===
        "/create-voucher/purchaseinvoice" ? (
        <DocumentVoucherPage
        key={currentPath}
          title="Purchase"
          companyId={
            selectedCompany?.id
          }
        />
      ) : (
        <PurchasePage
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showReport) {
      return (
        <ReportListPage
          path={entryPath}
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showStockJournal) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Stock Journal"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showDataBackupPage) {
      return <DataBackupPage />;
    }

    if (flags.showJournal) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Journal"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showContra) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Contra"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showDeliveryNote) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Delivery Note"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showPhysicalStock) {
      return (
        <PhysicalStockPage
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showDebitNote) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Debit Note"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showCreditNote) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Credit Note"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showSalesOrder) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Sales Order"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showQuotation) {
      return (
          <DocumentVoucherPage
          key={currentPath}
          title="Quotation"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    if (flags.showSalesVoucher) {
      return (
        <DocumentVoucherPage
        key={currentPath}
          title="Sales"
          companyId={
            selectedCompany?.id
          }
        />
      );
    }

    return (
      <NotFoundPage
        path={currentPath}
      />
    );
  };

  return renderPage();
}

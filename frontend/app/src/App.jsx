import { useEffect, useRef, useState } from 'react'
import AppHeader from './components/AppHeader'
import Sidebar from './components/Sidebar'
import DashboardPage from './pages/Dashboard'
import EwayPage from './pages/EwayPage'
import ContraPage from './pages/ContraPage'
import CreditNotePage from './pages/CreditNotePage'
import ConfigurationsPage from './pages/ConfigurationsPage'
import DebitNotePage from './pages/DebitNotePage'
import DeliveryNotePage from './pages/DeliveryNotePage'
import JournalPage from './pages/JournalPage'
import GstSearchPage from './pages/GstSearchPage'
import ItemsPage from './pages/ItemsPage'
import MyEntryListPage from './pages/MyEntryListPage'
import MyVouchersPage from './pages/MyVouchersPage'
import PartiesPage from './pages/PartiesPage'
import PaymentPage from './pages/PaymentPage'
import PurchasePage from './pages/PurchasePage'
import PurchaseOrderPage from './pages/PurchaseOrderPage'
import PhysicalStockPage from './pages/PhysicalStockPage'
import ReportListPage from './pages/ReportListPage'
import ReportsPage from './pages/ReportsPage'
import ReceiptPage from './pages/ReceiptPage'
import ReceiptNotePage from './pages/ReceiptNotePage'
import SectionPage from './pages/SectionPage'
import SalesOrderPage from './pages/SalesOrderPage'
import StockJournalPage from './pages/StockJournalPage'
import VoucherPage from './pages/VoucherPage'
import { getRouteFlags } from './routes/routeConfig'

function App() {
  const [activeTab, setActiveTab] = useState('Customers')
  const [selectedPeriod, setSelectedPeriod] = useState('This Year (1st Apr ’26 - 31st Mar ’27)')
  const [dayBookDate, setDayBookDate] = useState('')
  const customDateInput = useRef(null)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [showEway, setShowEway] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showCompanyMenu, setShowCompanyMenu] = useState(false)
  const [expandedNav, setExpandedNav] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const openCustomDatePicker = () => {
    const input = customDateInput.current
    if (!input) return
    try {
      if (input.showPicker) input.showPicker()
      else input.click()
    } catch {
      input.click()
    }
  }

  useEffect(() => {
    const refreshRoute = () => setCurrentPath(window.location.pathname)
    window.addEventListener('popstate', refreshRoute)
    return () => window.removeEventListener('popstate', refreshRoute)
  }, [])

  const navigateTo = (path) => {
    if (!path || window.location.pathname === path) return
    window.history.pushState({}, '', path)
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  const handleNavigate = (event, path) => {
    if (!path) return
    event.preventDefault()
    navigateTo(path)
  }

  const openQuotation = (event) => {
    handleNavigate(event, '/create-voucher/Quotation')
  }

  const openDashboard = (event) => {
    handleNavigate(event, '/dashboard')
    setShowEway(false)
  }

  const flags = getRouteFlags(currentPath)
  const entryPath = flags.normalizedPath

  const renderPage = () => {
    if (flags.showDashboard) return <DashboardPage activeTab={activeTab} setActiveTab={setActiveTab} selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} dayBookDate={dayBookDate} setDayBookDate={setDayBookDate} openCustomDatePicker={openCustomDatePicker} customDateInput={customDateInput} />
    if (showEway) return <EwayPage />
    if (flags.showReportsPage) return <ReportsPage />
    if (flags.showItemsPage) return <ItemsPage />
    if (flags.showPartiesPage) return <PartiesPage />
    if (flags.showMyVouchersPage) return <MyVouchersPage />
    if (flags.showEntryList) return <MyEntryListPage path={entryPath} />
    if (flags.showGstPage) return <GstSearchPage />
    if (flags.showConfigurationsPage) return <ConfigurationsPage />
    if (flags.showReport) return <ReportListPage path={entryPath} />
    if (flags.showPayment) return <PaymentPage />
    if (flags.showReceiptNote) return <ReceiptNotePage />
    if (flags.showReceipt) return <ReceiptPage />
    if (flags.showPurchaseOrder) return <PurchaseOrderPage />
    if (flags.showPurchase) return <PurchasePage />
    if (flags.showStockJournal) return <StockJournalPage />
    if (flags.showJournal) return <JournalPage />
    if (flags.showContra) return <ContraPage />
    if (flags.showDeliveryNote) return <DeliveryNotePage />
    if (flags.showPhysicalStock) return <PhysicalStockPage />
    if (flags.showDebitNote) return <DebitNotePage />
    if (flags.showCreditNote) return <CreditNotePage />
    if (flags.showSalesOrder) return <SalesOrderPage />
    if (flags.showQuotation) return <VoucherPage />
    if (flags.showSalesVoucher) return <VoucherPage type="Sales" />
    return <SectionPage path={currentPath} />
  }

  return <div className="app-shell relative min-h-screen bg-slate-100 text-slate-900">
    <Sidebar collapsed={sidebarCollapsed} currentPath={currentPath} showDashboard={flags.showDashboard} expandedNav={expandedNav} setExpandedNav={setExpandedNav} onDashboard={openDashboard} onQuotation={openQuotation} onNavigate={(path) => navigateTo(path)} />
    <main className={`app-main relative min-h-screen min-w-0 flex-1 transition-[margin-left] duration-200 ${sidebarCollapsed ? 'ml-[58px]' : 'ml-[200px]'}`}><AppHeader sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} setShowEway={setShowEway} showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} showCompanyMenu={showCompanyMenu} setShowCompanyMenu={setShowCompanyMenu} />{renderPage()}</main>
  </div>
}

export default App

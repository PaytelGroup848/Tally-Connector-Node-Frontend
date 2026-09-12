import { useEffect, useRef, useState } from 'react'
import AppHeader from '../components/AppHeader'
import Sidebar from '../components/Sidebar'
import useAuthStore from '../store/authStore'
import DashboardPage from './Dashboard'
import EwayPage from './EwayPage'
import ProfilePage from './ProfilePage'
import AddNewPage from './AddNewPage'
import AddUserPage from './AddUserPage'
import AllUsersPage from './AllUsersPage'
import ContraPage from './ContraPage'
import DownloadInvoicePage from './DownloadInvoicePage'
import CreditNotePage from './CreditNotePage'
import InactiveCustomersPage from './InactiveCustomersPage'
import ConfigurationsPage from './ConfigurationsPage'
import DebitNotePage from './DebitNotePage'
import DeliveryNotePage from './DeliveryNotePage'
import JournalPage from './JournalPage'
import GstSearchPage from './GstSearchPage'
import ItemsPage from './ItemsPage'
import CreateItemPage from './CreateItemPage'
import CreatePartyPage from './CreatePartyPage'
import MyEntryListPage from './MyEntryListPage'
import MyVouchersPage from './MyVouchersPage'
import PartiesPage from './PartiesPage'
import PaymentPage from './PaymentPage'
import PurchasePage from './PurchasePage'
import PurchaseOrderPage from './PurchaseOrderPage'
import PhysicalStockPage from './PhysicalStockPage'
import ReportListPage from './ReportListPage'
import TrialBalancePage from './TrialBalancePage'
import DayBookPage from './DayBookPage'
import ProfitLossPage from './Profit&LossPage'
import BalanceSheetPage from './BalanceSheetPage'
import VoucherLinesPage from './VoucherLinesPage'
import ReportsPage from './ReportsPage'
import ReceiptPage from './ReceiptPage'
import ReceiptNotePage from './ReceiptNotePage'
import SectionPage from './SectionPage'
import SalesOrderPage from './SalesOrderPage'
import { DocumentVoucherPage } from './DocumentVoucherPage'
import StockJournalPage from './StockJournalPage'
import MangaeReminderPage from './ManageReminderPage'
import InactiveStocksPage from './InactiveStocksPage'
import DataBackupPage from './DataBackupPage'
import PlansPage from './PlansPage'
import MyCompanyDetailsPage from '../components/MyCompanyDetailsPage'
import { getRouteFlags } from '../routes/routeConfig'
import {
  extractCompanies,
  extractConnectorsStatusRows,
  extractLastSyncMeta,
  fetchCompanies,
  fetchConnectorsStatus,
  normalizeCompany,
} from '../services/companiesApi'

const selectedCompanyStorageKey = 'selectedCompanyId'

function getCompanyId(company) {
  return company?.id || company?._id || company?.companyId || company?.company_id
}

function App() {
  const [activeTab, setActiveTab] = useState('Customers')
  const [selectedPeriod, setSelectedPeriod] = useState('This Year (1st Apr ’26 - 31st Mar ’27)')
  const [dayBookDate, setDayBookDate] = useState('')
  const customDateInput = useRef(null)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const [showEway, setShowEway] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showCompanyMenu, setShowCompanyMenu] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(() => {
    const storedCompanyId = typeof window !== 'undefined' ? window.localStorage.getItem(selectedCompanyStorageKey) : null
    return storedCompanyId ? { id: storedCompanyId } : {
      name: 'Paytel Financial Services Pvt Ltd 22-23',
      meta: 'Synced a day ago',
      isCurrent: true,
    }
  })
  const [connectorStatusRows, setConnectorStatusRows] = useState([])
  const [lastSyncMeta, setLastSyncMeta] = useState(null)
  const [connectorStatusError, setConnectorStatusError] = useState('')
  const [isConnectorStatusLoading, setIsConnectorStatusLoading] = useState(false)
  const [companyOptions, setCompanyOptions] = useState([
    { name: 'Paytel Financial Services Pvt Ltd 22-23', meta: 'Synced a day ago', isCurrent: true },
    { name: 'PayTel Financial Technologies Pvt. Ltd.', meta: '(Delhi)', isCurrent: false },
  ])
  const [expandedNav, setExpandedNav] = useState({})
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isCompact, setIsCompact] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 1024 : false)
  const [showQuickCreate, setShowQuickCreate] = useState(false)
  const accessToken = useAuthStore((state) => state.accessToken)
  const logout = useAuthStore((state) => state.logout)

  const quickCreateGroups = [
    {
      title: 'Sales',
      items: [
        ['Sales Invoice', '/create-voucher/SalesInvoice'],
        ['Sales Order', '/create-voucher/SalesOrder'],
        ['Credit Note', '/create-voucher/CreditNote'],
        ['Quotation', '/create-voucher/Quotation'],
        ['Receipt', '/create-voucher/Receipt'],
        ['Delivery Note', '/create-voucher/DeliveryNote'],
      ],
    },
    {
      title: 'Purchase',
      items: [
        ['Purchase Invoice', '/create-voucher/PurchaseInvoice'],
        ['Purchase Order', '/create-voucher/PurchaseOrder'],
        ['Debit Note', '/create-voucher/DebitNote'],
        ['Payment', '/create-voucher/Payment'],
        ['Journal', '/create-voucher/Journal'],
        ['Contra', '/create-voucher/Contra'],
        ['Receipt Note', '/create-voucher/ReceiptNote'],
      ],
    },
    {
      title: 'Items & Parties',
      items: [
        ['Create Items', '/items/create'],
        ['Create Parties', '/parties/create'],
      ],
    },
    {
      title: 'Inventory',
      items: [
        ['Physical Stock', '/create-voucher/PhysicalStock'],
        ['Stock Journal', '/create-voucher/StockJournal'],
      ],
    },
  ]

  useEffect(() => {
    const handleResize = () => {
      const compact = window.innerWidth < 1024
      setIsCompact(compact)
      if (compact) setSidebarCollapsed(true)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  useEffect(() => {
    if (!accessToken) {
      setConnectorStatusRows([])
      setLastSyncMeta(null)
      setConnectorStatusError('')
      return undefined
    }

    let isMounted = true
    setIsConnectorStatusLoading(true)
    setConnectorStatusError('')

    fetchConnectorsStatus(accessToken)
      .then((response) => {
        if (!isMounted) return
        const rows = extractConnectorsStatusRows(response)
        setConnectorStatusRows(rows)
        setLastSyncMeta(extractLastSyncMeta(response))
      })
      .catch((error) => {
        if (!isMounted) return
        setConnectorStatusError(error?.message || 'Unable to load connector status.')
      })
      .finally(() => {
        if (isMounted) setIsConnectorStatusLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [accessToken])

  useEffect(() => {
    if (!accessToken) return undefined

    let isMounted = true

    fetchCompanies(accessToken)
      .then((response) => {
        if (!isMounted) return

        const companies = extractCompanies(response).map(normalizeCompany)
        if (companies.length === 0) return

        const storedCompanyId = typeof window !== 'undefined' ? window.localStorage.getItem(selectedCompanyStorageKey) : null
        const selectedCompanyId = getCompanyId(selectedCompany)
        const currentCompany = companies.find((company) => {
          const companyId = getCompanyId(company)
          return companyId && (String(companyId) === String(storedCompanyId || selectedCompanyId))
        }) || companies[0]
        const remainingCompanies = companies.filter((company) => company !== currentCompany)
        setSelectedCompany({ ...currentCompany, isCurrent: true })
        setCompanyOptions([
          { ...currentCompany, isCurrent: true },
          ...remainingCompanies.map((company) => ({ ...company, isCurrent: false })),
        ])
        if (typeof window !== 'undefined' && getCompanyId(currentCompany)) window.localStorage.setItem(selectedCompanyStorageKey, String(getCompanyId(currentCompany)))
      })
      .catch((error) => {
        console.warn('Company list API failed, using local company list:', error)
      })

    return () => {
      isMounted = false
    }
  }, [accessToken])

  const navigateTo = (path) => {
    if (!path) return
    const isEwayPath = path === '/eway' || path === '/e-way'
    setShowEway(isEwayPath)
    if (window.location.pathname === path) return
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

  const openMobileVersion = () => {
    window.open('/mobile-version', '_blank', 'width=390,height=844,noopener,noreferrer')
  }

  const openDashboard = (event) => {
    handleNavigate(event, '/dashboard')
    setShowEway(false)
  }

  const openCompanyDetails = (company) => {
    const companyId = getCompanyId(company)
    if (!companyId) return
    setSelectedCompany(company)
    window.localStorage.setItem(selectedCompanyStorageKey, String(companyId))
    setShowCompanyMenu(false)
    navigateTo(`/company-details/${encodeURIComponent(companyId)}`)
  }

  const flags = getRouteFlags(currentPath)
  const entryPath = flags.normalizedPath

  const handleCompanyAdd = () => {
    const candidate = { name: 'PayTel Financial Technologies Pvt. Ltd.', meta: '(Delhi)', isCurrent: true }
    setCompanyOptions((current) => {
      const next = current.map((company) => ({ ...company, isCurrent: false }))
      const alreadyExists = next.some((company) => company.name === candidate.name)
      if (alreadyExists) return next
      return [candidate, ...next]
    })
    setSelectedCompany(candidate)
    if (typeof window !== 'undefined' && getCompanyId(candidate)) window.localStorage.setItem(selectedCompanyStorageKey, String(getCompanyId(candidate)))
    setShowCompanyMenu(false)
  }

  const selectCompany = (company) => {
    const companyId = getCompanyId(company)
    if (!companyId) return
    setSelectedCompany(company)
    window.localStorage.setItem(selectedCompanyStorageKey, String(companyId))
    setShowCompanyMenu(false)
  }

  const renderPage = () => {
    if (flags.showCompanyDetailsPage) return <MyCompanyDetailsPage />
    if (currentPath === '/profile') return <ProfilePage />
    if (flags.showPlansPage) return <PlansPage />
    if (flags.showDashboard) return <DashboardPage activeTab={activeTab} setActiveTab={setActiveTab} selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} dayBookDate={dayBookDate} setDayBookDate={setDayBookDate} openCustomDatePicker={openCustomDatePicker} customDateInput={customDateInput} onMetricClick={(label) => {
      const routes = {
        CASH: '/cash-bank/cash',
        BANK: '/cash-bank/bank',
      }
      const target = routes[label]
      if (target) navigateTo(target)
    }} />
    if (flags.showAddNewPage) return <AddNewPage path={currentPath} />
    if (flags.showEwayPage || showEway) return <EwayPage />
    if (flags.showReportsPage) return <ReportsPage />
    if (flags.showCreateItemPage) return <CreateItemPage />
    if (flags.showCreatePartyPage) return <CreatePartyPage />
    if (flags.showItemsPage) return <ItemsPage companyId={selectedCompany?.id} />
    if (flags.showPartiesPage) return <PartiesPage />
    if (flags.showMyVouchersPage) return <MyVouchersPage companyId={selectedCompany?.id} />
    if (flags.showManageReminderPage) return <ManageReminderPage />
    if (flags.showEntryList) return <MyEntryListPage path={entryPath} />
    if (flags.showGstPage) return <GstSearchPage />
    if (flags.showConfigurationsPage) return <ConfigurationsPage />
    if (flags.showAllUsersPage) return <AllUsersPage />
    if (flags.showAddUserPage) return <AddUserPage />
    if (flags.showInactiveCustomersPage) return <InactiveCustomersPage />
    if (flags.showInactiveStocksPage) return <InactiveStocksPage />
    if (flags.showDownloadInvoicePage) return <DownloadInvoicePage />
    if (entryPath === '/trial-balance') return <TrialBalancePage companyId={selectedCompany?.id} />
    if (entryPath === '/day-book') return <DayBookPage companyId={selectedCompany?.id} />
    if (entryPath === '/profit-loss') return <ProfitLossPage companyId={selectedCompany?.id} />
    if (entryPath === '/balance-sheet') return <BalanceSheetPage companyId={selectedCompany?.id} />
    if (entryPath === '/voucher-lines') return <VoucherLinesPage companyId={selectedCompany?.id} companyName={selectedCompany?.name} />
    if (flags.showPayment) return <PaymentPage />
    if (flags.showReceiptNote) return <ReceiptNotePage />
    if (flags.showReceipt) return <ReceiptPage />
    if (flags.showPurchaseOrder) return <PurchaseOrderPage />
    if (flags.showPurchase) return <PurchasePage companyId={selectedCompany?.id} />
    if (flags.showReport) return <ReportListPage path={entryPath} companyId={selectedCompany?.id} />
    if (flags.showStockJournal) return <StockJournalPage />
    if (flags.showDataBackupPage) return <DataBackupPage />
    if (flags.showJournal) return <JournalPage />
    if (flags.showContra) return <ContraPage />
    if (flags.showDeliveryNote) return <DeliveryNotePage />
    if (flags.showPhysicalStock) return <PhysicalStockPage />
    if (flags.showDebitNote) return <DebitNotePage companyId={selectedCompany?.id} />
    if (flags.showCreditNote) return <CreditNotePage />
    if (flags.showSalesOrder) return <SalesOrderPage />
    if (flags.showQuotation) return <DocumentVoucherPage title="Quotation" />
    if (flags.showSalesVoucher) return <DocumentVoucherPage title="Sales" companyId={selectedCompany?.id} />
    return <SectionPage path={currentPath} />
  }

  return <div className="app-shell relative min-h-screen bg-slate-100 text-slate-900">
    <Sidebar collapsed={sidebarCollapsed} isCompact={isCompact} setSidebarCollapsed={setSidebarCollapsed} currentPath={currentPath} showDashboard={flags.showDashboard} expandedNav={expandedNav} setExpandedNav={setExpandedNav} onDashboard={openDashboard} onQuotation={openQuotation} onNavigate={(path) => navigateTo(path)} />
    <main
      className={`app-main relative min-h-screen min-w-0 flex-1 transition-[margin-left,width] duration-200 ${isCompact ? 'ml-0' : sidebarCollapsed ? 'ml-[58px]' : 'ml-[200px]'}`}
      style={{
        width: isCompact ? '100%' : `calc(100% - ${sidebarCollapsed ? 58 : 200}px)`,
      }}
    >
      <AppHeader sidebarCollapsed={sidebarCollapsed} setSidebarCollapsed={setSidebarCollapsed} setShowEway={setShowEway} onOpenEway={() => navigateTo('/eway')} showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu} showCompanyMenu={showCompanyMenu} setShowCompanyMenu={setShowCompanyMenu} onProfileClick={() => navigateTo('/profile')} onAllUsersClick={() => navigateTo('/all-users')} onMobileVersionClick={openMobileVersion} selectedCompany={selectedCompany} companyOptions={companyOptions} onAddCompany={handleCompanyAdd} onCompanyClick={openCompanyDetails} onSelectCompany={selectCompany} onLogout={async () => { await logout(); window.location.replace('/') }} connectorStatusRows={connectorStatusRows} lastSyncMeta={lastSyncMeta} connectorStatusError={connectorStatusError} isConnectorStatusLoading={isConnectorStatusLoading} />{renderPage()}
    </main>

    <div className="fixed bottom-5 right-5 z-40">
      {showQuickCreate && (
        <div className="mb-3 w-[min(280px,calc(100vw-2rem))] overflow-hidden rounded-lg border border-slate-200 bg-white shadow-[0_18px_42px_rgba(15,23,42,0.18)]">
          <div className="flex items-center justify-between bg-[#101010] px-3 py-2 text-white">

            <button type="button" aria-label="Close quick create" onClick={() => setShowQuickCreate(false)} className="ml-auto text-lg leading-none text-white/80 hover:text-white">×</button>
          </div>
          <div className="max-h-[360px] overflow-y-auto bg-slate-100 p-2">
            {quickCreateGroups.map((group) => (
              <div key={group.title} className="mb-2 overflow-hidden rounded-md border border-slate-200 bg-white">
                <div className="bg-[#101010] px-3 py-2 text-sm font-semibold text-white">{group.title}</div>
                <div className="p-1.5">
                  {group.items.map(([label, targetPath]) => (
                    <button
                      key={`${group.title}-${label}`}
                      type="button"
                      onClick={() => {
                        setShowQuickCreate(false)
                        if (targetPath.startsWith('/create-voucher/')) {
                          navigateTo(targetPath)
                          return
                        }
                        navigateTo(targetPath)
                      }}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-100"
                    >
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">•</span>
                      <span className="flex-1">{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Quick create"
        onClick={() => setShowQuickCreate((current) => !current)}
        className="grid h-14 w-14 place-items-center rounded-full bg-[#111827] text-3xl font-light text-white shadow-[0_10px_28px_rgba(17,24,39,0.35)] transition hover:scale-105"
      >
        +
      </button>
    </div>
  </div>
}

export default App
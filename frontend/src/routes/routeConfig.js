const entryListPaths = new Set([
  '/my-stock-items',
  '/my-ledgers',
  '/my-parties',
  '/my-invoices',
  '/my-receipts',
  '/my-payments',
  '/my-eway-bill',
  '/my-quotations',
])

const reportPaths = new Set([
  '/sales', '/purchaseorder', '/payables', '/payments', '/debitnote',
  '/creditnote', '/receivables', '/collect-payments', '/receivablesnew',
  '/receipt', '/receiptnote', '/deliverynote', '/salesorder',
  '/trial-balance', '/day-book', '/profit-loss', '/balance-sheet',
  '/voucher-lines', '/cash/voucher-list/cash-in-hand', '/cash-bank/cash',
  '/cash-bank/bank', '/bank/voucher-list/bank-accounts',
])

const voucherPaths = {
  quotation: '/create-voucher/quotation',
  sales: new Set(['/create-voucher/sales', '/create-voucher/salesinvoice']),
  deliveryNote: '/create-voucher/deliverynote',
  receiptNote: '/create-voucher/receiptnote',
  physicalStock: '/create-voucher/physicalstock',
  stockJournal: '/create-voucher/stockjournal',
  debitNote: '/create-voucher/debitnote',
  creditNote: '/create-voucher/creditnote',
  receipt: '/create-voucher/receipt',
  payment: new Set(['/create-voucher/payment', '/purchase/payment']),
  salesOrder: '/create-voucher/salesorder',
  purchase: new Set(['/purchase', '/create-voucher/purchase', '/create-voucher/purchaseinvoice']),
  purchaseOrder: '/create-voucher/purchaseorder',
  journal: '/create-voucher/journal',
  contra: '/create-voucher/contra',
}

const addNewPaths = new Set([
  '/parties/add-new',
  '/items/add-new',
  '/my-stock-items/add-new',
  '/my-ledgers/add-new',
  '/my-parties/add-new',
])

export function getRouteFlags(path = '') {
  const normalizedPath = path.toLowerCase()
  const myVoucherPaths = [
    '/my-vouchers', '/my-quotations', '/my-invoices',
    '/my-receipts', '/my-payments', '/my-sales-order', '/my-purchase',
    '/my-journal', '/my-contra', '/my-purchase-order', '/my-credit-note',
    '/my-debit-note', '/my-stock-journal', '/my-physical-stock',
    '/my-receipt-note', '/my-delivery-note', '/my-parties', '/my-stock-items',
  ]

  return {
    normalizedPath,
    showQuotation: normalizedPath === voucherPaths.quotation,
    showSalesVoucher: voucherPaths.sales.has(normalizedPath),
    showDeliveryNote: normalizedPath === voucherPaths.deliveryNote,
    showReceiptNote: normalizedPath === voucherPaths.receiptNote,
    showPhysicalStock: normalizedPath === voucherPaths.physicalStock,
    showStockJournal: normalizedPath === voucherPaths.stockJournal,
    showDebitNote: normalizedPath === voucherPaths.debitNote,
    showCreditNote: normalizedPath === voucherPaths.creditNote,
    showReceipt: normalizedPath === voucherPaths.receipt,
    showPayment: voucherPaths.payment.has(normalizedPath),
    showSalesOrder: normalizedPath === voucherPaths.salesOrder,
    showPurchase: voucherPaths.purchase.has(normalizedPath),
    showPurchaseOrder: normalizedPath === voucherPaths.purchaseOrder,
    showJournal: normalizedPath === voucherPaths.journal,
    showContra: normalizedPath === voucherPaths.contra,
    showDashboard: path === '/' || path === '/dashboard',
    showPlansPage: normalizedPath === '/plans',
    showEwayPage: normalizedPath === '/eway' || normalizedPath === '/e-way',
    showManageReminderPage: normalizedPath === '/manage-reminders',
    showReportsPage: normalizedPath === '/reports',
    showVouchersPage: normalizedPath === '/vouchers',
    showItemsPage: normalizedPath === '/items',
    showPartiesPage: normalizedPath === '/parties',
    showMyVouchersPage: myVoucherPaths.includes(normalizedPath),
    showEntryList: entryListPaths.has(normalizedPath) && !myVoucherPaths.includes(normalizedPath),
    showGstPage: normalizedPath === '/gstsearch' || normalizedPath === '/gst-search',
    showConfigurationsPage: normalizedPath === '/configurations',
    showAllUsersPage: normalizedPath === '/all-users',
    showAddUserPage: normalizedPath === '/add-user',
    showInactiveCustomersPage: normalizedPath === '/inactive-customers',
    showInactiveStocksPage: normalizedPath === '/inactive-stocks',
    showDownloadInvoicePage: normalizedPath === '/download-invoice',
    showAddNewPage: addNewPaths.has(normalizedPath),
    showReport: reportPaths.has(normalizedPath),
    showCreateItemPage: normalizedPath === '/items/create',
    showDataBackupPage: normalizedPath === '/data-backup',
    showCreatePartyPage: normalizedPath === '/parties/create',
    showMobileVersionPage: normalizedPath === '/mobile-version',
    showCompanyDetailsPage: normalizedPath.startsWith('/company-details/'),
  }
}

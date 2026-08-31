const entryListPaths = new Set(['/tracking-report', '/my-stock-items', '/my-ledgers', '/my-invoices', '/my-eway-bill', '/my-quotations'])
const reportPaths = new Set(['/sales', '/purchase', '/purchaseorder', '/payables', '/payments', '/debitnote', '/creditnote', '/receivables', '/collect-payments', '/receivablesnew', '/receipt', '/receiptnote', '/deliverynote', '/salesorder', '/cash/voucher-list/cash-in-hand', '/cash-bank/cash', '/cash-bank/bank', '/bank/voucher-list/bank-accounts'])

export function getRouteFlags(path) {
  const normalizedPath = path.toLowerCase()
  return {
    normalizedPath,
    showQuotation: normalizedPath.includes('/create-voucher/quotation'),
    showSalesVoucher: normalizedPath.includes('/create-voucher/sales'),
    showDeliveryNote: normalizedPath.includes('/create-voucher/deliverynote'),
    showReceiptNote: normalizedPath.includes('/create-voucher/receiptnote'),
    showPhysicalStock: normalizedPath.includes('/create-voucher/physicalstock'),
    showStockJournal: normalizedPath.includes('/create-voucher/stockjournal'),
    showDebitNote: normalizedPath.includes('/create-voucher/debitnote'),
    showCreditNote: normalizedPath.includes('/create-voucher/creditnote'),
    showReceipt: normalizedPath.includes('/create-voucher/receipt'),
    showPayment: normalizedPath.includes('/create-voucher/payment') || normalizedPath.includes('/purchase/payment'),
    showSalesOrder: normalizedPath.includes('/create-voucher/salesorder'),
    showPurchase: normalizedPath.includes('/create-voucher/purchase'),
    showPurchaseOrder: normalizedPath.includes('/create-voucher/purchaseorder'),
    showJournal: normalizedPath.includes('/create-voucher/journal'),
    showContra: normalizedPath.includes('/create-voucher/contra'),
    showDashboard: path === '/' || path === '/dashboard',
    showReportsPage: normalizedPath === '/reports',
    showItemsPage: normalizedPath === '/items',
    showPartiesPage: normalizedPath === '/parties',
    showMyVouchersPage: normalizedPath === '/my-vouchers',
    showEntryList: entryListPaths.has(normalizedPath),
    showGstPage: normalizedPath === '/gstsearch' || normalizedPath === '/gst-search',
    showConfigurationsPage: normalizedPath === '/configurations',
    showDataBackupPage: normalizedPath === '/data-backup',
    showReport: reportPaths.has(normalizedPath),
  }
}

import {
  BarChart3,
  Building2,
  ClipboardList,
  DatabaseBackup,
  FileText,
  HandCoins,
  LayoutDashboard,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Users,
  WalletCards,
} from 'lucide-react'

export const navItems = [
  [LayoutDashboard, 'Dashboard', false, false, 'dashboard'],
  [Plus, 'Create Vouchers', true, false, 'create-voucher'],
  [FileText, 'Sales', true, false, 'sales'],
  [ShoppingCart, 'Purchase', true, false, 'purchase'],
  [WalletCards, 'Cash & Bank', true, false, 'cash-bank'],
  [HandCoins, 'Collect Payments', false, false, 'collect-payments'],
  [Users, 'Parties', false, false, 'parties'],
  [Package, 'Items', false, false, 'items'],
  [BarChart3, 'Reports', true, false, 'reports'],
  [ClipboardList, 'My Entries', true, false, 'my-entries'],
  [Settings, 'Configurations', false, false, 'configurations'],
  [Search, 'GST Search', false, 'NEW', 'gst-search'],
  [DatabaseBackup, 'Data Backup', false, false, 'data-backup'],
]

export const submenuItems = {
  'Create Vouchers': [['Quotation', '/create-voucher/Quotation'], ['Sales Invoice', '/create-voucher/SalesInvoice'], ['Receipt', '/create-voucher/Receipt'], ['Payment', '/create-voucher/Payment'], ['Sales Order', '/create-voucher/SalesOrder'], ['Purchase Invoice', '/create-voucher/PurchaseInvoice'], ['Journal', '/create-voucher/Journal'], ['Contra', '/create-voucher/Contra'], ['Purchase Order', '/create-voucher/PurchaseOrder'], ['Credit Note', '/create-voucher/CreditNote'], ['Debit Note', '/create-voucher/DebitNote'], ['Stock Journal', '/create-voucher/StockJournal'], ['Physical Stock', '/create-voucher/PhysicalStock'], ['Receipt Note', '/create-voucher/ReceiptNote'], ['Delivery Note', '/create-voucher/DeliveryNote']],
  Sales: [['Sales', '/sales'], ['Credit Note', '/creditNote'], ['Receipt', '/receipt'], ['Receivables', '/receivables'], ['Sales Order', '/salesorder'], ['Delivery Note', '/deliveryNote']],
  Purchase: [['Purchase', '/purchase'], ['Debit Note', '/debitNote'], ['Payment', '/payments'], ['Payables', '/payables'], ['Purchase Order', '/purchaseorder'], ['Receipt Note', '/receiptNote']],
  Reports: [['Trial Balance', '/trial-balance'], ['Day Book', '/day-book'], ['Profit & Loss', '/profit-loss'], ['Balance Sheet', '/balance-sheet'], ['Voucher Lines', '/voucher-lines']],
  'Cash & Bank': [['Cash', '/cash-bank/cash'], ['Bank', '/cash-bank/bank']],
  'My Entries': [['My Vouchers', '/my-vouchers'], ['My Quotations', '/my-quotations'], ['My eWay Bills', '/my-eway-bill'], ['My Invoices', '/my-invoices'], ['My Parties', '/my-parties'], ['My Stock Items', '/my-stock-items'],['Tracking Report', '/tracking-report']],
}

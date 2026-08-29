export const navItems = [
  ['▣', 'Dashboard', false, false, 'dashboard'], ['＋', 'Create Vouchers', true, false, 'create-voucher'], ['▥', 'Sales', true, false, 'sales'], ['♧', 'Purchase', true, false, 'purchase'], ['▤', 'Cash & Bank', true, false, 'cash-bank'], ['▣', 'Collect Payments', false, false, 'collect-payments'], ['▱', 'Parties', false, false, 'parties'], ['▤', 'Items', false, false, 'items'], ['▥', 'Reports', false, false, 'reports'], ['▧', 'My Entries', true, false, 'my-entries'], ['⚙', 'Configurations', false, false, 'configurations'], ['⌕', 'GST Search', false, 'NEW', 'gst-search'], ['⌂', 'Data Backup', false, false, 'data-backup'],
]

export const submenuItems = {
  'Create Vouchers': [['Quotation', '/create-voucher/Quotation'], ['Sales Invoice', '/create-voucher/SalesInvoice'], ['Receipt', '/create-voucher/Receipt'], ['Payment', '/create-voucher/Payment'], ['Sales Order', '/create-voucher/SalesOrder'], ['Purchase Invoice', '/create-voucher/PurchaseInvoice'], ['Journal', '/create-voucher/Journal'], ['Contra', '/create-voucher/Contra'], ['Purchase Order', '/create-voucher/PurchaseOrder'], ['Credit Note', '/create-voucher/CreditNote'], ['Debit Note', '/create-voucher/DebitNote'], ['Stock Journal', '/create-voucher/StockJournal'], ['Physical Stock', '/create-voucher/PhysicalStock'], ['Receipt Note', '/create-voucher/ReceiptNote'], ['Delivery Note', '/create-voucher/DeliveryNote']],
  Sales: [['Sales', '/sales'], ['Credit Note', '/creditNote'], ['Receipt', '/receipt'], ['Receivables', '/receivables'], ['Sales Order', '/salesorder'], ['Delivery Note', '/deliveryNote']],
  Purchase: [['Purchase', '/purchase'], ['Debit Note', '/debitNote'], ['Payment', '/payments'], ['Payables', '/payables'], ['Purchase Order', '/purchaseorder'], ['Receipt Note', '/receiptNote']],
  'Cash & Bank': [['Cash', '/cash-bank/cash'], ['Bank', '/cash-bank/bank']],
  'My Entries': [['My Vouchers', '/my-vouchers'], ['My Quotations', '/my-quotations'], ['My eWay Bills', '/my-eway-bill'], ['My Invoices', '/my-invoices'], ['My Parties', '/parties'], ['My Stock Items', '/my-stock-items'], ['My Ledgers', '/my-ledgers'], ['Tracking Report', '/tracking-report']],
}

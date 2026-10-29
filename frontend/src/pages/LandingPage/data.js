import { BarChart3, Cloud, LayoutDashboard, Receipt, ShieldCheck, ShoppingCart, Smartphone, WalletCards } from "lucide-react";
import test2 from "../../assets/New Testimonial-Review-Card-1.png";
import test3 from "../../assets/New-Testimonial-Review-Card-2 (2).png";
import test4 from "../../assets/New-Testimonial-Review-Card-3 (2).png";
import test5 from "../../assets/New-Testimonial-Review-Card-8 (2).png";
import test6 from "../../assets/New-Testimonial-Review-Card-5 (2).png";
import test7 from "../../assets/New-Testimonial-Review-Card-10.png";
import test11 from "../../assets/New-Testimonial-Review-Card-9 (2).png";

export const features = [
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    description:
      "Get a complete view of your business with live sales, purchases, receivables and payables.",
  },
  {
    icon: Receipt,
    title: "Create Transactions",
    description:
      "Create sales, purchases, receipts, payments, quotations and other business transactions.",
  },
  {
    icon: BarChart3,
    title: "Business Reports",
    description:
      "Understand your business through easy-to-read charts, reports and financial summaries.",
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description:
      "Access your business data from anywhere through a mobile-friendly experience.",
  },
  {
    icon: Cloud,
    title: "Cloud Data",
    description:
      "Keep business information available across your connected devices.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Data",
    description:
      "Business information is protected with modern security-focused infrastructure.",
  },
];


export const transactions = [
  {
    label: "Sales",
    value: "₹ 1,15,900",
    icon: ShoppingCart,
  },
  {
    label: "Receivables",
    value: "₹ 2,10,500",
    icon: WalletCards,
  },
  {
    label: "Purchase",
    value: "₹ 1,59,000",
    icon: Receipt,
  },
];

export const testimonialImages = [

  test2,
  test3,
  test4,
  test5,
  test6,
  test7,
  test11,
];

export const planData = [

  {
    id: "6aa0ea43710906eea178f548",
    name: "Pro",
    description: "Create & Manage Entries",
    features: [
      "COMPANY_READ",
      "LEDGER_READ",
      "CUSTOMER_READ",
      "SUPPLIER_READ",
      "STOCK_READ",
      "VOUCHER_READ",
      "REPORTS_READ",
      "CONNECTOR_STATUS",
      "COMMAND_CREATE",
      "SYNC_LEDGER",
      "SYNC_VOUCHER",
      "SYNC_STOCK",
    ],
    seatLimit: 2,
    price: 3000,
    billingText: "/ year",
    highlighted: true,
  },
];

export const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN").format(value);

export const showcaseFeatures = [
  {
    id: "feature-invoices",
    title: "Generate eWay Bills & eInvoices on the go",
    description:
      "Easily generate e-way bills in under 30 seconds with validations built into your workflow. Create e-invoices and e-way bills together.",
    kind: "invoice",
  },
  {
    id: "feature-inactive",
    title: "Get Inactive Customers & Items Reports",
    description:
      "Understand your inactive customers and items. Re-engage with them to grow your business.",
    kind: "inactive",
  },
  {
    id: "feature-reminders",
    title: "Send Payment Reminder to Recover Dues",
    description:
      "Automate payment reminders via SMS and email to prompt parties for delayed payments and improve cash flow.",
    kind: "reminder",
  },
  {
    id: "feature-backup",
    title: "Data Backup and Restore",
    description:
      "Be ready with backup for your financial data. Never lose important information in case of migration or system crash.",
    kind: "backup",
  },
  {
    id: "feature-gst",
    title: "Create GST Bills and share on WhatsApp",
    description:
      "Simplify your workflow by creating GST bills and instantly sharing them via WhatsApp or email to minimize errors.",
    kind: "gst",
  },
  {
    id: "feature-reports",
    title: "View Daily Books, Expense Tracking, Balance Sheet",
    description:
      "Evaluate daily business performance with comprehensive financial reports, enabling informed, data-driven decisions.",
    kind: "reports",
  },
];

export const featureLabels = {
  COMPANY_READ: "Read Company",
  LEDGER_READ: "Read Ledger",
  CUSTOMER_READ: "Read Customers",
  SUPPLIER_READ: "Read Suppliers",
  STOCK_READ: "Read Stock",
  VOUCHER_READ: "Read Vouchers",
  REPORTS_READ: "Access Reports",
  CONNECTOR_STATUS: "Connector Status",
  COMMAND_CREATE: "Create Entries",
  SYNC_LEDGER: "Sync Ledgers",
  SYNC_VOUCHER: "Sync Vouchers",
  SYNC_STOCK: "Sync Stock",
  SYNC_MASTER: "Sync Masters",
};

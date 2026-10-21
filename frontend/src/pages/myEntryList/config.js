export const entryListPages = {
  "/my-stock-items": [
    "My Stock Items",
    ["Name", "Date", "Status", "Action"],
    [],
  ],
  "/my-ledgers": [
    "My Ledgers",
    ["Name", "Date", "Status", "Action"],
    [],
  ],
  "/my-parties": [
    "My Parties",
    ["Name", "Date", "Status", "Action"],
    [],
  ],
  "/my-invoices": [
    "My Invoices",
    [
      "IRN/ACK No ↑",
      "Name",
      "Date",
      "Invoice No",
      "Amount",
      "Sync Status",
      "eInvoices Status",
      "Download",
    ],
    [],
  ],
  "/my-eway-bill": [
    "My eWay Bills",
    [
      "eWayBillNo",
      "Name",
      "Date",
      "Invoice No",
      "Valid till",
      "Amount",
      "Sync Status",
      "eWay Status",
      "Download",
    ],
    [],
  ],
  "/my-quotations": [
    "My Quotations",
    ["Name", "Date", "Quotation", "Amount", "Action"],
    [],
  ],
};

export const addNewRoutes = {
  "/my-stock-items": "/my-stock-items/add-new",
  "/my-ledgers": "/my-ledgers/add-new",
  "/my-parties": "/my-parties/add-new",
  "/my-invoices": "/my-invoices/add-new",
  "/my-eway-bill": "/my-eway-bill/add-new",
  "/my-quotations": "/my-quotations/add-new",
};

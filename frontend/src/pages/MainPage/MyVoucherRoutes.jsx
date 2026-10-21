import ItemsPage from "../ItemsPage";
import MyVouchersPage from "../MyVouchersPage";
import { getCompanyId } from "./utils";

export default function renderMyVoucherRoute({
  currentPath,
  flags,
  selectedCompany,
}) {
    if (
      currentPath ===
      "/my-receipts"
    ) {
      return (
        <MyVouchersPage
        key={currentPath}
          companyId={getCompanyId(
            selectedCompany,
          )}
          title="My Receipts"
          voucherType="Receipt"
          commandType="CREATE_VOUCHER"
        />
      );
    }

    if (
      currentPath ===
      "/my-payments"
    ) {
      return (
        <MyVouchersPage
        key={currentPath}
          companyId={getCompanyId(
            selectedCompany,
          )}
          title="My Payments"
          voucherType="Payment"
          commandType="CREATE_VOUCHER"
        />
      );
    }

    if (
      currentPath ===
      "/my-sales-order"
    ) {
      return (
        <MyVouchersPage
          key={currentPath}
          companyId={getCompanyId(
            selectedCompany,
          )}
          title="My Sales Order"
          voucherType="Sales Order"
          commandType="CREATE_VOUCHER"
        />
      );
    }

    if (
      currentPath ===
      "/my-purchase"
    ) {
      return (
        <MyVouchersPage
          key={currentPath}
          companyId={getCompanyId(
            selectedCompany,
          )}
          title="My Purchase"
          voucherType="Purchase"
          commandType="CREATE_VOUCHER"
        />
      );
    }

    const additionalMyVoucherTypes = {
      "/my-journal": [
        "My Journal",
        "Journal",
      ],
      "/my-contra": [
        "My Contra",
        "Contra",
      ],
      "/my-purchase-order": [
        "My Purchase Order",
        "Purchase Order",
      ],
      "/my-credit-note": [
        "My Credit Note",
        "Credit Note",
      ],
      "/my-debit-note": [
        "My Debit Note",
        "Debit Note",
      ],
      "/my-stock-journal": [
        "My Stock Journal",
        "Stock Journal",
      ],
      "/my-physical-stock": [
        "My Physical Stock",
        "Physical Stock",
      ],
      "/my-receipt-note": [
        "My Receipt Note",
        "Receipt Note",
      ],
      "/my-delivery-note": [
        "My Delivery Note",
        "Delivery Note",
      ],
    };

    const additionalMyVoucher =
      additionalMyVoucherTypes[
      currentPath
      ];

    if (additionalMyVoucher) {
      return (
        
        <MyVouchersPage
        key={currentPath}
          companyId={getCompanyId(
            selectedCompany,
          )}
          title={
            additionalMyVoucher[0]
          }
          voucherType={
            additionalMyVoucher[1]
          }
          commandType="CREATE_VOUCHER"
        />
      );
    }

    if (
      currentPath ===
      "/my-stock-items"
    ) {
      return (
        <ItemsPage
          companyId={getCompanyId(
            selectedCompany,
          )}
          myStockItems
        />
      );
    }

    if (flags.showMyVouchersPage) {
      return (
        <MyVouchersPage
          companyId={getCompanyId(
            selectedCompany,
          )}
          title={
            currentPath ===
              "/my-quotations"
              ? "My Quotations"
              : currentPath ===
                "/my-invoices"
                ? "My Invoices"
                : currentPath ===
                  "/my-parties"
                  ? "My Parties"
                  : currentPath ===
                    "/my-stock-items"
                    ? "My Stock Items"
                    : "My Vouchers"
          }
          voucherType={
            currentPath ===
              "/my-quotations"
              ? "Quotation"
              : currentPath ===
                "/my-invoices"
                ? "Sales"
                : currentPath ===
                  "/my-vouchers"
                  ? "Sales"
                  : ""
          }
          commandType={
            currentPath ===
              "/my-parties"
              ? "CREATE_PARTY"
              : currentPath ===
                "/my-stock-items"
                ? "UPDATE_STOCK_ITEM"
                : "CREATE_VOUCHER"
          }
        />
      );
    }

    return null;
}

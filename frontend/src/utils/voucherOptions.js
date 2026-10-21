import { DROPDOWN_PAGE_SIZE } from "./voucherHelpers";

export function buildVoucherOptions({
  customers,
  suppliers,
  stockItems,
  vouchers,
  ledgers,
  godowns,
  voucherTypes,
  getDisplayValue,
  getStockValue,
  getVoucherValue,
  isSalesInvoice,
  isSalesOrder,
  isSupplierVoucher,
  visibleVoucherTypeCount,
  setVisibleVoucherTypeCount,
}) {
const customerOptions = customers
      .map((customer) =>
        getDisplayValue(customer, [
          "name",
          "customerName",
          "partyName",
          "ledgerName",
          "displayName",
        ]),
      )
      .filter(Boolean)
      .filter((name, index, names) => names.indexOf(name) === index);

const supplierOptions = suppliers
      .map((supplier) =>
        getDisplayValue(supplier, [
          "name",
          "supplierName",
          "partyName",
          "ledgerName",
          "displayName",
        ]),
      )
      .filter(Boolean)
      .filter((name, index, names) => names.indexOf(name) === index);

const itemOptions = stockItems
      .map((item) =>
        getStockValue(item, [
          "itemName",
          "item_name",
          "stockName",
          "stock_name",
          "stockItemName",
          "stock_item_name",
          "item",
          "name",
          "displayName",
        ]),
      )
      .filter(Boolean)
      .filter((name, index, names) => names.indexOf(name) === index);

const voucherPartyOptions = vouchers
      .map((voucher) =>
        getVoucherValue(voucher, [
          "partyLedger",
          "party ledger",
          "partyName",
          "ledgerName",
          "party",
          "customerName",
        ]),
      )
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

const voucherNumberOptions = vouchers
      .map((voucher) =>
        getVoucherValue(voucher, [
          "voucherNumber",
          "voucherNo",
          "voucher no",
          "voucher_no",
          "number",
        ]),
      )
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

const ledgerTypeOptions = ledgers
      .map((ledger) =>
        getDisplayValue(ledger, [
          "ledgerType",
          "ledger_type",
          "type",
          "ledgerName",
          "name",
          "displayName",
        ]),
      )
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

const partyLedgerOptions = [
      ...customerOptions,
      ...ledgers
        .map((ledger) =>
          getDisplayValue(ledger, [
            "ledgerName",
            "name",
            "displayName",
            "partyName",
          ]),
        )
        .filter(Boolean),
    ].filter((value, index, values) => values.indexOf(value) === index);

const supplierLedgerOptions = [
      ...supplierOptions,
      ...ledgers
        .map((ledger) =>
          getDisplayValue(ledger, [
            "ledgerName",
            "name",
            "displayName",
            "partyName",
          ]),
        )
        .filter(Boolean),
    ].filter((value, index, values) => values.indexOf(value) === index);

const ledgerOptions = ledgers
      .map((ledger) =>
        getDisplayValue(ledger, [
          "ledgerName",
          "name",
          "displayName",
          "partyName",
        ]),
      )
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

const voucherTypeOptions = voucherTypes
      .map((voucherType) =>
        typeof voucherType === "string"
          ? voucherType
          : getDisplayValue(voucherType, [
              "voucherType",
              "voucher_type",
              "type",
              "name",
              "value",
              "displayName",
            ]),
      )
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

const visibleVoucherTypeOptions = voucherTypeOptions.slice(
      0,
      visibleVoucherTypeCount,
    );

const hasMoreVoucherTypeOptions =
      visibleVoucherTypeCount < voucherTypeOptions.length;

const loadMoreVoucherTypeOptions = () => {
      setVisibleVoucherTypeCount((current) =>
        Math.min(current + DROPDOWN_PAGE_SIZE, voucherTypeOptions.length),
      );
    };

if ((isSalesInvoice || isSalesOrder) && voucherTypeOptions.length === 0) {
      voucherTypeOptions.push(isSalesOrder ? "Sales Order" : "Sales");
    }

const godownOptions = godowns
      .map((godownEntry) =>
        getDisplayValue(godownEntry, [
          "godownName",
          "godown_name",
          "name",
          "warehouse",
          "location",
          "displayName",
        ]),
      )
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index);

const partySources = isSupplierVoucher
      ? ["suppliers", "ledgers"]
      : ["customers", "ledgers"];

const partyOptions = isSupplierVoucher
      ? supplierLedgerOptions
      : partyLedgerOptions;

  return {
    customerOptions,
    supplierOptions,
    itemOptions,
    voucherPartyOptions,
    voucherNumberOptions,
    ledgerTypeOptions,
    partyLedgerOptions,
    supplierLedgerOptions,
    ledgerOptions,
    voucherTypeOptions,
    visibleVoucherTypeOptions,
    hasMoreVoucherTypeOptions,
    loadMoreVoucherTypeOptions,
    godownOptions,
    partySources,
    partyOptions,
  };
}

export const DROPDOWN_PAGE_SIZE = 20;

export let nextItemRowId = 1;

export let nextLedgerRowId = 1;

export function createEmptyLedgerRow() {
    return {
      id: nextLedgerRowId++,
      ledgerName: "",
      category: "tax",
      calculationType: "percentage",
      value: "",
      effect: "add",
    };
  }

export function createEmptyItemRow({ taxInclusive = false } = {}) {
    return {
      id: nextItemRowId++,
      item: "",
      quantity: "0",
      rate: "",
      units: "",
      discount: "0",
      hsnCode: "",
      godown: "",
      description: "",
      gstRate: "18", // ADD THIS
      taxInclusive,
    };
  }

export function createJournalRow(id = Date.now()) {
    return {
      id,
      type: "",
      partyName: "",
      amount: "",
    };
  }

export function getJournalTotalsInPaise(rows = []) {
    return rows.reduce(
      (totals, row) => {
        const amount = Number(row.amount);
        const amountInPaise = Number.isFinite(amount)
          ? Math.round(amount * 100)
          : 0;

        if (row.type === "Debit") {
          totals.debit += amountInPaise;
        }

        if (row.type === "Credit") {
          totals.credit += amountInPaise;
        }

        return totals;
      },
      { debit: 0, credit: 0 },
    );
  }

export function formatJournalPaise(amountInPaise) {
    return (amountInPaise / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

export function normalizePartyName(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

export function findCompanyGstin(response) {
    const gstinKeys = new Set(["gstin", "gstnumber", "gstregistrationnumber"]);
    const pending = [response];

    while (pending.length > 0) {
      const value = pending.shift();
      if (!value || typeof value !== "object") continue;

      for (const [key, candidate] of Object.entries(value)) {
        if (
          gstinKeys.has(key.toLowerCase().replace(/[^a-z0-9]/g, "")) &&
          typeof candidate === "string" &&
          candidate.trim()
        ) {
          return candidate.trim();
        }

        if (candidate && typeof candidate === "object") pending.push(candidate);
      }
    }

    return "";
  }

export function getGstinStateCode(value) {
    const gstin = String(value || "")
      .trim()
      .toUpperCase();
    const match = /^([0-9]{2})[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.exec(
      gstin,
    );
    return match?.[1] || "";
  }

export function getPartyBalance(entry) {
    const balanceKeys = new Set(["closingbalance", "balance", "currentbalance"]);
    const pending = [entry];

    while (pending.length > 0) {
      const value = pending.shift();
      if (!value || typeof value !== "object") continue;

      for (const [key, candidate] of Object.entries(value)) {
        const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, "");
        if (
          balanceKeys.has(normalizedKey) &&
          candidate !== null &&
          candidate !== undefined &&
          String(candidate).trim() !== "" &&
          Number.isFinite(Number(candidate))
        ) {
          return String(candidate);
        }
      }

      for (const child of Object.values(value)) {
        if (child && typeof child === "object") pending.push(child);
      }
    }

    return null;
  }

export function isTaxLedgerName(value) {
    return /(gst|cgst|sgst|igst|utgst|cess|tax)/i.test(String(value || ""));
  }

export function calculateAdditionalLedgerAmount(row, subtotal) {
    const value = Number(row?.value) || 0;

    if (row?.calculationType === "amount") {
      return Math.max(0, value);
    }

    return Math.max(0, (subtotal * Math.max(0, value)) / 100);
  }

export function createStockJournalRow(id = Date.now()) {
    return {
      id,
      item: "",
      qty: "",
      rate: "",
      godown: "",
      batch: "",
    };
  }

export function getStockFieldValue(entry, keys) {
    const candidates = [entry, entry?.data, entry?.payload, entry?.item];
    const normalizedKeys = keys.map((key) =>
      key.toLowerCase().replace(/[^a-z0-9]/g, ""),
    );

    for (const candidate of candidates) {
      if (!candidate || typeof candidate !== "object") continue;
      const matchingKey = Object.keys(candidate).find((key) =>
        normalizedKeys.includes(key.toLowerCase().replace(/[^a-z0-9]/g, "")),
      );
      if (
        matchingKey &&
        candidate[matchingKey] !== null &&
        candidate[matchingKey] !== undefined
      )
        return String(candidate[matchingKey]).trim();
    }

    return "";
  }

import {
  calculateAdditionalLedgerAmount,
  createEmptyLedgerRow,
  isTaxLedgerName,
} from "../utils/voucherHelpers";

export function createVoucherTotals({
  itemRows,
  additionalLedgers,
  setAdditionalLedgers,
  setShowLedgerPanel,
  isSameState,
}) {
const getEnteredAmount = (row) => {
      const quantity = Math.max(0, Number(row.quantity) || 0);
      const rate = Math.max(0, Number(row.rate) || 0);
      const discount = Math.min(100, Math.max(0, Number(row.discount) || 0));

      return quantity * rate * (1 - discount / 100);
    };

const calculateRowAmount = (row) => getEnteredAmount(row);

const calculateRowTax = (row) => {
      if (!row.taxInclusive) return 0;

      const gstRate = Math.max(0, Number(row.gstRate ?? 18) || 0);

      return calculateRowAmount(row) * (gstRate / 100);
    };

const calculateRowTaxBreakdown = (row) => {
      const taxAmount = Number(calculateRowTax(row).toFixed(2));

      if (isSameState === null) {
        return {
          taxAmount,
          cgstAmount: null,
          sgstAmount: null,
          igstAmount: null,
        };
      }

      if (isSameState) {
        const cgstAmount = Number((taxAmount / 2).toFixed(2));
        return {
          taxAmount,
          cgstAmount,
          sgstAmount: Number((taxAmount - cgstAmount).toFixed(2)),
          igstAmount: 0,
        };
      }

      return {
        taxAmount,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: taxAmount,
      };
    };

const subtotal = itemRows.reduce(
      (total, row) => total + calculateRowAmount(row),
      0,
    );

const itemTaxes = itemRows.reduce(
      (total, row) => total + calculateRowTax(row),
      0,
    );

const addAdditionalLedger = () => {
      setAdditionalLedgers((rows) => [...rows, createEmptyLedgerRow()]);
      setShowLedgerPanel(true);
    };

const removeAdditionalLedger = (rowId) => {
      setAdditionalLedgers((rows) => rows.filter((row) => row.id !== rowId));
    };

const updateAdditionalLedger = (rowId, changes) => {
      setAdditionalLedgers((rows) =>
        rows.map((row) => (row.id === rowId ? { ...row, ...changes } : row)),
      );
    };

const calculateLedgerTotals = () => {
      const entries = additionalLedgers
        .filter((row) => row.ledgerName?.trim())
        .map((row) => ({
          ...row,
          amount: calculateAdditionalLedgerAmount(row, subtotal),
        }));

      const taxes = entries
        .filter(
          (row) => row.category === "tax" || isTaxLedgerName(row.ledgerName),
        )
        .reduce(
          (total, row) =>
            total + (row.effect === "deduct" ? -row.amount : row.amount),
          0,
        );

      const otherLedgers = entries
        .filter(
          (row) => row.category !== "tax" && !isTaxLedgerName(row.ledgerName),
        )
        .reduce(
          (total, row) =>
            total + (row.effect === "deduct" ? -row.amount : row.amount),
          0,
        );

      return {
        entries,
        taxes: itemTaxes + taxes,
        otherLedgers,
        grandTotal: subtotal + itemTaxes + taxes + otherLedgers,
      };
    };

  return { getEnteredAmount, calculateRowAmount, calculateRowTax, calculateRowTaxBreakdown, subtotal, itemTaxes, addAdditionalLedger, removeAdditionalLedger, updateAdditionalLedger, calculateLedgerTotals };
}

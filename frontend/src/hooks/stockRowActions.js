import { createStockJournalRow } from "../utils/voucherHelpers";

export function createStockRowActions({ stockItems, findStockRate }) {
const updateStockRow = (setter, rowId, field, value) => {
      setter((currentRows) =>
        currentRows.map((row) => {
          if (row.id !== rowId) return row;

          // Auto-fetch rate when item is selected
          if (field === "item") {
            const matchingRate = findStockRate(stockItems, value);

            return {
              ...row,
              item: value,
              rate: matchingRate || "", // Auto fill rate
            };
          }

          // Normal field update
          return {
            ...row,
            [field]: value,
          };
        }),
      );
    };

const addStockRow = (setter) => {
      setter((currentRows) => [
        ...currentRows,
        createStockJournalRow(Date.now() + Math.random()),
      ]);
    };

const removeStockRow = (setter, rowId) => {
      setter((currentRows) =>
        currentRows.length === 1
          ? currentRows
          : currentRows.filter((row) => row.id !== rowId),
      );
    };

  return { updateStockRow, addStockRow, removeStockRow };
}

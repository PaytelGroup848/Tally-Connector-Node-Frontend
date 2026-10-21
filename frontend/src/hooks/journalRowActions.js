import { createJournalRow } from "../utils/voucherHelpers";

export function createJournalRowActions({ setJournalRows }) {
const updateJournalRow = (rowId, field, value) => {
      setJournalRows((currentRows) => {
        const currentRow = currentRows.find((row) => row.id === rowId);

        if (!currentRow) return currentRows;

        // Update the selected field.
        const updatedRows = currentRows.map((row) =>
          row.id === rowId ? { ...row, [field]: value } : row,
        );

        // Automatically synchronize Debit and Credit amounts.
        if (
          field !== "amount" ||
          !["Debit", "Credit"].includes(currentRow.type)
        ) {
          return updatedRows;
        }

        const oppositeType = currentRow.type === "Debit" ? "Credit" : "Debit";

        // Find this row's position within its Debit/Credit section.
        const sameTypeRows = currentRows.filter(
          (row) => row.type === currentRow.type,
        );

        const rowIndex = sameTypeRows.findIndex((row) => row.id === rowId);

        // Find the corresponding row in the opposite section.
        const oppositeRows = currentRows.filter(
          (row) => row.type === oppositeType,
        );

        const oppositeRow = oppositeRows[rowIndex];

        if (!oppositeRow) return updatedRows;

        // Copy the exact amount into the matching opposite row.
        return updatedRows.map((row) =>
          row.id === oppositeRow.id ? { ...row, amount: value } : row,
        );
      });
    };

const addJournalRow = (type) => {
      setJournalRows((currentRows) => {
        const oppositeType = type === "Debit" ? "Credit" : "Debit";

        const sameTypeRows = currentRows.filter((row) => row.type === type);

        const oppositeRows = currentRows.filter(
          (row) => row.type === oppositeType,
        );

        const matchingRow = oppositeRows[sameTypeRows.length];

        return [
          ...currentRows,
          {
            ...createJournalRow(Date.now()),
            type,
            amount: matchingRow?.amount ?? "",
          },
        ];
      });
    };

const removeJournalRow = (rowId) => {
      setJournalRows((currentRows) => {
        if (currentRows.length === 1) return currentRows;
        return currentRows.filter((row) => row.id !== rowId);
      });
    };

  return { updateJournalRow, addJournalRow, removeJournalRow };
}

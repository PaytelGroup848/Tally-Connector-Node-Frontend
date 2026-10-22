
import { createJournalRow } from "../utils/voucherHelpers";

export function createJournalRowActions({ setJournalRows }) {
  const updateJournalRow = (rowId, field, value) => {
    setJournalRows((currentRows) =>
      currentRows.map((row) =>
        row.id === rowId
          ? { ...row, [field]: value }
          : row
      )
    );
  };

  const addJournalRow = (type) => {
    setJournalRows((currentRows) => [
      ...currentRows,
      {
        ...createJournalRow(Date.now()),
        type,
        amount: "",
      },
    ]);
  };

  const removeJournalRow = (rowId) => {
    setJournalRows((currentRows) => {
      if (currentRows.length === 1) return currentRows;

      return currentRows.filter((row) => row.id !== rowId);
    });
  };

  return {
    updateJournalRow,
    addJournalRow,
    removeJournalRow,
  };
}

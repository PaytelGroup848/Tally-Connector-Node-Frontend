import { createEmptyItemRow } from "../utils/voucherHelpers";

export function createItemRowActions({ stockItems, setItemRows, setClearToken, findStockRate, findStockQuantity, findStockUnits, findStockHsnCode, defaultTaxInclusive = false }) {
const updateItemRow = (rowId, field, value) => {
      setItemRows((currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                [field]: value,
              }
            : row,
        ),
      );
    };

const updateItemRowValues = (rowId, changes) => {
      setItemRows((currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                ...changes,
              }
            : row,
        ),
      );
    };

const handleItemSelect = (rowId, itemName) => {
      const matchingRate = findStockRate(stockItems, itemName);
      const matchingQuantity = findStockQuantity(stockItems, itemName);
      const matchingHsnCode = findStockHsnCode(stockItems, itemName);

      updateItemRowValues(rowId, {
        item: itemName,
        quantity: matchingQuantity !== "" ? matchingQuantity : "0",
        rate: matchingRate,
        units: findStockUnits(stockItems, itemName),
        hsnCode: matchingHsnCode,
      });
    };

const addItemRow = () => {
      setItemRows((currentRows) => [
        ...currentRows,
        createEmptyItemRow({ taxInclusive: defaultTaxInclusive }),
      ]);
    };

const clearItemRow = (rowId) => {
      setItemRows((currentRows) =>
        currentRows.map((row) =>
          row.id === rowId
            ? {
                ...row,
                item: "",
                quantity: "0",
                rate: "",
                units: "",
                discount: "0",
                hsnCode: "",
                godown: "",
                description: "",
                gstRate: "18",
                taxInclusive: defaultTaxInclusive,
              }
            : row,
        ),
      );
    };

const deleteItemRow = (rowId) => {
      setItemRows((currentRows) => {
        if (currentRows.length === 1) {
          return [
            {
              ...currentRows[0],
              item: "",
              quantity: "0",
              rate: "",
              units: "",
              discount: "0",
              hsnCode: "",
              godown: "",
              description: "",
              gstRate: "18",
              taxInclusive: defaultTaxInclusive,
            },
          ];
        }

        return currentRows.filter((row) => row.id !== rowId);
      });
    };

const resetItemRows = () => {
      setItemRows([
        createEmptyItemRow({ taxInclusive: defaultTaxInclusive }),
      ]);

      setClearToken((token) => token + 1);
    };

  return { updateItemRow, updateItemRowValues, handleItemSelect, addItemRow, clearItemRow, deleteItemRow, resetItemRows };
}

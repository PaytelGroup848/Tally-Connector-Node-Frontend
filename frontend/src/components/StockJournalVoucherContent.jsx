import { getStockFieldValue } from "../utils/voucherHelpers";
import { SearchableDropdown } from "./SearchableDropdown";

export function StockJournalSide({
    title,
    rows,
    stockItems,
    batches,
    itemOptions,
    godownOptions,
    itemDropdownProps,
    godownDropdownProps,
    batchDropdownProps,
    optionsLoading,
    onAddRow,
    onRemoveRow,
    onRowChange,
  }) {
    const batchOptionsFor = (itemName) =>
      batches
        .filter((batch) => {
          const batchItem = getStockFieldValue(batch, [
            "itemName",
            "item_name",
            "stockName",
            "stock_name",
            "stockItemName",
            "stock_item_name",
            "item",
          ]);
          return (
            !batchItem ||
            batchItem.toLowerCase() === String(itemName || "").toLowerCase()
          );
        })
        .map((batch) =>
          getStockFieldValue(batch, [
            "batchName",
            "batch_name",
            "batchNo",
            "batch_no",
            "batch",
            "batchNumber",
            "batch_number",
            "name",
            "displayName",
          ]),
        )
        .concat(
          stockItems
            .filter(
              (item) =>
                getStockFieldValue(item, [
                  "itemName",
                  "item_name",
                  "stockName",
                  "stock_name",
                  "stockItemName",
                  "stock_item_name",
                  "item",
                ]).toLowerCase() === String(itemName || "").toLowerCase(),
            )
            .map((item) =>
              getStockFieldValue(item, [
                "batchName",
                "batch_name",
                "batchNo",
                "batch_no",
                "batch",
                "batchNumber",
                "batch_number",
              ]),
            ),
        )
        .filter(
          (value, index, values) => value && values.indexOf(value) === index,
        );

    return (
      <div className="flex min-h-[360px] flex-col overflow-hidden border border-slate-200 bg-[#f5f7f4]">
        <div className="flex h-9 shrink-0 items-center justify-between border-b border-slate-200 px-3 text-xs font-semibold text-slate-800">
          <span>{title}</span>
          <button
            type="button"
            onClick={onAddRow}
            className="inline-flex items-center gap-1 rounded-md bg-emerald-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            <span className="text-sm leading-none">+</span>
            Add Item
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-x-auto">
          <div className="min-w-[760px] xl:min-w-0">
            <div className="pl-[5%] grid grid-cols-[minmax(115px,1.15fr)_minmax(48px,.55fr)_minmax(52px,.6fr)_minmax(78px,.8fr)_minmax(88px,.9fr)_minmax(70px,.7fr)_28px] gap-1 bg-slate-100 p-1.5 text-[10px] font-semibold text-slate-700">
              <span>Items</span>
              <span>Qty</span>
              <span>Rate</span>
              <span>Godown</span>
              <span>Batch Name</span>
              <span>Amount</span>
              <span />
            </div>
            {rows.map((row) => {
              const amount = (Number(row.qty) || 0) * (Number(row.rate) || 0);
              return (
                <div
                  key={row.id}
                  className="grid grid-cols-[minmax(115px,1.15fr)_minmax(48px,.55fr)_minmax(52px,.6fr)_minmax(78px,.8fr)_minmax(88px,.9fr)_minmax(70px,.7fr)_28px] gap-1 border-t border-slate-200 bg-white p-1.5"
                >
                  <SearchableDropdown
                    name={`stockItem-${row.id}`}
                    label="items"
                    options={itemOptions}
                    {...itemDropdownProps}
                    loading={optionsLoading}
                    value={row.item}
                    onSelect={(value) => onRowChange(row.id, "item", value)}
                    onClear={() => onRowChange(row.id, "item", "")}
                    placeholder="Search Item"
                  />
                  <input
                    type="number"
                    min="0"
                    value={row.qty}
                    onChange={(event) =>
                      onRowChange(row.id, "qty", event.target.value)
                    }
                    className="min-h-9 rounded border border-slate-300 px-2 text-xs outline-none"
                    placeholder="0"
                  />
                  <input
                    type="number"
                    step="any"
                    min="0"
                    value={row.rate}
                    onChange={(event) =>
                      onRowChange(row.id, "rate", event.target.value)
                    }
                    className="min-h-9 rounded border border-slate-300 px-2 text-xs outline-none"
                    placeholder="0"
                  />
                  <SearchableDropdown
                    name={`stockGodown-${row.id}`}
                    label="godowns"
                    options={godownOptions}
                    {...godownDropdownProps}
                    loading={optionsLoading}
                    value={row.godown}
                    onSelect={(value) => onRowChange(row.id, "godown", value)}
                    onClear={() => onRowChange(row.id, "godown", "")}
                    placeholder="Select"
                  />
                  <SearchableDropdown
                    name={`stockBatch-${row.id}`}
                    label="batches"
                    options={batchOptionsFor(row.item)}
                    {...batchDropdownProps}
                    loading={optionsLoading}
                    value={row.batch}
                    onSelect={(value) => onRowChange(row.id, "batch", value)}
                    onClear={() => onRowChange(row.id, "batch", "")}
                    placeholder="Select"
                  />
                  <input
                    readOnly
                    value={amount.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    className="min-h-9 rounded border border-slate-300 bg-slate-50 px-2 text-xs outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveRow(row.id)}
                    disabled={rows.length === 1}
                    className="text-red-500 disabled:opacity-40"
                    aria-label="Remove row"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

export function StockJournalVoucherContent({
    sourceRows,
    destinationRows,
    stockItems,
    batches,
    itemOptions,
    godownOptions,
    itemDropdownProps,
    godownDropdownProps,
    batchDropdownProps,
    optionsLoading,
    onAddSource,
    onAddDestination,
    onRemoveSource,
    onRemoveDestination,
    onSourceChange,
    onDestinationChange,
  }) {
    const totalQuantity = [...sourceRows, ...destinationRows].reduce(
      (sum, row) => sum + (Number(row.qty) || 0),
      0,
    );
    const totalAmount = [...sourceRows, ...destinationRows].reduce(
      (sum, row) => sum + (Number(row.qty) || 0) * (Number(row.rate) || 0),
      0,
    );

    return (
      <>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>Voucher Type</span>
            <input
              name="voucherType"
              value="Stock Journal"
              readOnly
              className="min-h-9 rounded border border-slate-300 bg-white px-2 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>Voucher No (optional)</span>
            <input
              name="voucherNumber"
              defaultValue=""
              className="min-h-9 rounded border border-slate-300 bg-white px-2 text-xs"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-slate-700">
            <span>Date</span>
            <input
              name="date"
              type="date"
              defaultValue={new Date().toLocaleDateString("en-CA")}
              className="min-h-9 rounded border border-slate-300 bg-white px-2 text-xs"
            />
          </label>
        </div>

        <div className="mt-4 grid items-stretch gap-2 xl:grid-cols-2">
          <StockJournalSide
            title="Source (Consumption)"
            rows={sourceRows}
            stockItems={stockItems}
            batches={batches}
            itemOptions={itemOptions}
            godownOptions={godownOptions}
            itemDropdownProps={itemDropdownProps}
            godownDropdownProps={godownDropdownProps}
            batchDropdownProps={batchDropdownProps}
            optionsLoading={optionsLoading}
            onAddRow={onAddSource}
            onRemoveRow={onRemoveSource}
            onRowChange={onSourceChange}
          />
          <StockJournalSide
            title="Destination (Production)"
            rows={destinationRows}
            stockItems={stockItems}
            batches={batches}
            itemOptions={itemOptions}
            godownOptions={godownOptions}
            itemDropdownProps={itemDropdownProps}
            godownDropdownProps={godownDropdownProps}
            batchDropdownProps={batchDropdownProps}
            optionsLoading={optionsLoading}
            onAddRow={onAddDestination}
            onRemoveRow={onRemoveDestination}
            onRowChange={onDestinationChange}
          />
        </div>

        <div className="mt-3 flex justify-between bg-[#e8f7ea] px-3 py-2 text-[11px] font-semibold text-slate-700">
          <span>TOTAL</span>
          <span>Qty {totalQuantity}</span>
          <span>Amount ₹{totalAmount.toFixed(2)}</span>
        </div>
        <label className="mt-4 flex flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Narration</span>
          <textarea
            name="narration"
            rows="2"
            placeholder="Enter narration"
            className="rounded border border-slate-300 bg-white px-2 py-2 text-xs outline-none"
          />
        </label>
      </>
    );
  }

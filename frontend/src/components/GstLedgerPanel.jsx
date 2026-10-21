import { useState } from "react";
import { createEmptyLedgerRow, isTaxLedgerName, calculateAdditionalLedgerAmount } from "../utils/voucherHelpers";
import { SearchableDropdown } from "./SearchableDropdown";

export function GstLedgerPanel({
    subtotal = 0,
    ledgerOptions = [],
    ledgerDropdownProps = {},
  }) {
    const [rows, setRows] = useState([]);
    const [open, setOpen] = useState(false);

    const updateRow = (id, changes) => {
      setRows((currentRows) =>
        currentRows.map((row) => (row.id === id ? { ...row, ...changes } : row)),
      );
    };

    const formatCurrency = (value) =>
      Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    return (
      <div className="rounded-md bg-white p-3">
        <button
          type="button"
          onClick={() => setOpen((currentOpen) => !currentOpen)}
          className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
        >
          <span className="text-base leading-none">{open ? "−" : "+"}</span>
          {open ? "Hide GST And Other Ledgers" : "Add GST And Other Ledger"}
        </button>

        {open && (
          <div className="mb-3 rounded-lg border border-green-100 bg-green-50/60 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-bold text-slate-800">
                  GST &amp; Other Ledgers
                </p>
                <p className="text-[11px] text-slate-500">
                  Add GST/tax ledgers or other accounting adjustments.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setRows((currentRows) => [
                    ...currentRows,
                    createEmptyLedgerRow(),
                  ])
                }
                className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-800"
              >
                <span className="text-sm leading-none">+</span>Add Ledger
              </button>
            </div>

            {rows.length === 0 ? (
              <div className="rounded-md border border-dashed border-green-200 bg-white px-3 py-3 text-center text-[11px] text-slate-500">
                No GST or other ledger has been added yet.
              </div>
            ) : (
              <div className="space-y-2">
                {rows.map((row) => (
                  <div
                    key={row.id}
                    className="rounded-md border border-green-100 bg-white p-2"
                  >
                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.65fr)_minmax(0,.9fr)_minmax(0,.85fr)_minmax(0,.85fr)_28px]">
                      <label className="flex min-w-0 flex-col gap-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Ledger
                        </span>
                        <SearchableDropdown
                          name={`additionalLedger-${row.id}`}
                          label="GST and other ledgers"
                          options={ledgerOptions}
                          {...ledgerDropdownProps}
                          placeholder="Select ledger"
                          value={row.ledgerName}
                          onSelect={(value) =>
                            updateRow(row.id, {
                              ledgerName: value || "",
                              category: isTaxLedgerName(value) ? "tax" : "other",
                            })
                          }
                          onClear={() => updateRow(row.id, { ledgerName: "" })}
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Category
                        </span>
                        <select
                          value={row.category}
                          onChange={(event) =>
                            updateRow(row.id, { category: event.target.value })
                          }
                          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        >
                          <option value="tax">GST / Tax</option>
                          <option value="other">Other Ledger</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          Calculation
                        </span>
                        <select
                          value={row.calculationType}
                          onChange={(event) =>
                            updateRow(row.id, {
                              calculationType: event.target.value,
                            })
                          }
                          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        >
                          <option value="percentage">Percentage</option>
                          <option value="amount">Fixed Amount</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-1">
                        <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                          {row.calculationType === "percentage"
                            ? "Rate %"
                            : "Amount"}
                        </span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.value}
                          onChange={(event) =>
                            updateRow(row.id, { value: event.target.value })
                          }
                          placeholder="0"
                          className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setRows((currentRows) =>
                            currentRows.filter(
                              (currentRow) => currentRow.id !== row.id,
                            ),
                          )
                        }
                        className="mt-5 flex h-9 items-center justify-center rounded-md border border-red-100 bg-red-50 text-sm font-bold text-red-500 transition hover:bg-red-100"
                        aria-label="Remove ledger"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-2 flex flex-col gap-2 border-t border-slate-100 pt-2 sm:flex-row sm:items-center sm:justify-between">
                      <label className="inline-flex items-center gap-2 text-[11px] font-medium text-slate-600">
                        <span>Effect</span>
                        <select
                          value={row.effect}
                          onChange={(event) =>
                            updateRow(row.id, { effect: event.target.value })
                          }
                          className="h-8 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-100"
                        >
                          <option value="add">Add</option>
                          <option value="deduct">Deduct</option>
                        </select>
                      </label>
                      <div className="text-xs font-semibold text-slate-700">
                        Calculated:{" "}
                        <span
                          className={
                            row.effect === "deduct"
                              ? "text-red-600"
                              : "text-green-700"
                          }
                        >
                          {row.effect === "deduct" ? "- " : "+ "}₹
                          {formatCurrency(
                            calculateAdditionalLedgerAmount(row, subtotal),
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

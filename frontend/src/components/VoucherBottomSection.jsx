import { isTaxLedgerName, calculateAdditionalLedgerAmount } from "../utils/voucherHelpers";
import { AdvancedVoucherSettings } from "./AdvancedVoucherSettings";
import { SearchableDropdown } from "./SearchableDropdown";

export function VoucherBottomSection({
    subtotal,
    itemTaxes,
    isSameState,
    hideIgstBreakdown = false,
    companyGstinLoading,
    companyGstinError,
    hasCompanyGstin,
    ledgerOptions,
    ledgerDropdownProps,
    additionalLedgers,
    onAddLedger,
    onRemoveLedger,
    onLedgerChange,
    showLedgerPanel,
    onToggleLedgerPanel,
  }) {
    const ledgerCalculations = additionalLedgers
      .filter((row) => row.ledgerName?.trim())
      .map((row) => ({
        ...row,
        amount: calculateAdditionalLedgerAmount(row, subtotal),
      }));

    const ledgerTaxes = ledgerCalculations
      .filter((row) => row.category === "tax" || isTaxLedgerName(row.ledgerName))
      .reduce(
        (total, row) =>
          total + (row.effect === "deduct" ? -row.amount : row.amount),
        0,
      );

    const otherLedgers = ledgerCalculations
      .filter((row) => row.category !== "tax" && !isTaxLedgerName(row.ledgerName))
      .reduce(
        (total, row) =>
          total + (row.effect === "deduct" ? -row.amount : row.amount),
        0,
      );

    const taxes = itemTaxes + ledgerTaxes;
    const grandTotal = subtotal + taxes + otherLedgers;
    const cgstAmount = Number((itemTaxes / 2).toFixed(2));
    const sgstAmount = Number((itemTaxes - cgstAmount).toFixed(2));

    const formatCurrency = (value) =>
      Number(value || 0).toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

    return (
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_.9fr]">
        <div className="space-y-2">
          <details open className="group rounded-md bg-white">
            <summary className="flex cursor-pointer list-none items-center justify-between border-b border-slate-100 px-4 py-3 text-sm font-medium text-slate-800">
              Narration
              <span className="text-lg leading-none transition group-open:rotate-90">
                ›
              </span>
            </summary>
            <div className="relative p-3">
              <textarea
                name="narration"
                rows="3"
                className="w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                placeholder="Enter narration"
              />
            </div>
          </details>

          <AdvancedVoucherSettings />
        </div>

        <div className="rounded-md bg-white p-3">
          <button
            type="button"
            onClick={onToggleLedgerPanel}
            className="mb-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
          >
            <span className="text-base leading-none">
              {showLedgerPanel ? "−" : "+"}
            </span>
            {showLedgerPanel
              ? "Hide GST And Other Ledgers"
              : "Add GST And Other Ledger"}
          </button>

          {showLedgerPanel && (
            <div className="mb-3 rounded-lg border border-green-100 bg-green-50/60 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold text-slate-800">
                    GST & Other Ledgers
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Add GST/tax ledgers or other accounting adjustments.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onAddLedger}
                  className="inline-flex shrink-0 items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1.5 text-[11px] font-semibold text-white transition hover:bg-emerald-800"
                >
                  <span className="text-sm leading-none">+</span>
                  Add Ledger
                </button>
              </div>

              {additionalLedgers.length === 0 ? (
                <div className="rounded-md border border-dashed border-green-200 bg-white px-3 py-3 text-center text-[11px] text-slate-500">
                  No GST or other ledger has been added yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {additionalLedgers.map((row) => {
                    const amount = calculateAdditionalLedgerAmount(row, subtotal);

                    return (
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
                              onSelect={(value) => {
                                const nextValue = value || "";
                                onLedgerChange(row.id, {
                                  ledgerName: nextValue,
                                  category: isTaxLedgerName(nextValue)
                                    ? "tax"
                                    : "other",
                                });
                              }}
                              onClear={() =>
                                onLedgerChange(row.id, { ledgerName: "" })
                              }
                            />
                          </label>

                          <label className="flex flex-col gap-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                              Category
                            </span>
                            <select
                              value={row.category}
                              onChange={(event) =>
                                onLedgerChange(row.id, {
                                  category: event.target.value,
                                })
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
                                onLedgerChange(row.id, {
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
                                onLedgerChange(row.id, {
                                  value: event.target.value,
                                })
                              }
                              placeholder="0"
                              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
                            />
                          </label>

                          <button
                            type="button"
                            onClick={() => onRemoveLedger(row.id)}
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
                                onLedgerChange(row.id, {
                                  effect: event.target.value,
                                })
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
                              {formatCurrency(amount)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          <div className="space-y-2 bg-green-50 p-3 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Sub Total</span>
              <span>₹{formatCurrency(subtotal)}</span>
            </div>
            {isSameState === true ? (
              <>
                <div className="flex justify-between">
                  <span>CGST (9%)</span>
                  <span>₹{formatCurrency(cgstAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (9%)</span>
                  <span>₹{formatCurrency(sgstAmount)}</span>
                </div>
              </>
            ) : isSameState === false && !hideIgstBreakdown ? (
              <div className="flex justify-between">
                <span>IGST (18%)</span>
                <span>₹{formatCurrency(itemTaxes)}</span>
              </div>
            ) : itemTaxes > 0 ? (
              <div className="text-xs text-amber-700">
                {companyGstinLoading
                  ? "Loading company GSTIN to determine the GST split..."
                  : companyGstinError
                    ? `GST breakdown unavailable: ${companyGstinError}`
                    : hasCompanyGstin
                      ? ""
                      : "Company GSTIN is not configured; GST breakdown is unavailable."}
              </div>
            ) : null}
            {Math.abs(ledgerTaxes) > 0.000001 && (
              <div className="flex justify-between">
                <span>Other GST / Tax Ledgers</span>
                <span>₹{formatCurrency(ledgerTaxes)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{formatCurrency(taxes)}</span>
            </div>

            {Math.abs(otherLedgers) > 0.000001 && (
              <div className="flex justify-between">
                <span>Other Ledgers</span>
                <span>₹{formatCurrency(otherLedgers)}</span>
              </div>
            )}

            <div className="mt-3 flex justify-between border-t border-green-100 pt-3 text-base font-bold text-slate-900">
              <span>Grand Total</span>
              <span>₹{formatCurrency(grandTotal)}</span>
            </div>
          </div>
        </div>

        <input type="hidden" name="subTotal" value={subtotal.toFixed(2)} />
        <input type="hidden" name="taxes" value={taxes.toFixed(2)} />
        <input
          type="hidden"
          name="otherLedgerAmount"
          value={otherLedgers.toFixed(2)}
        />
        <input type="hidden" name="grandTotal" value={grandTotal.toFixed(2)} />
      </div>
    );
  }

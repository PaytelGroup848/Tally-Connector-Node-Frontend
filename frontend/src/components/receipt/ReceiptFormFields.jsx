import {
  AdvancedVoucherSettings,
  SearchableDropdown,
} from "../../pages/DocumentVoucherPage";
import { getDisplayName } from "../../utils/receipt";

export default function ReceiptFormFields({
  form,
  updateField,
  companyBanks,
  banksLoading,
  ledgerOptions,
  ledgerPage,
  loadMoreLedgers,
  fetchClosingBalance,
  closingBalance,
  closingBalanceLoading,
  closingBalanceError,
  setClosingBalance,
  closingBalanceEditedRef,
  optionsLoading,
}) {
  return (
    <div className="bg-[#f5f7f4] p-5">
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
          <span>Voucher Type</span>

          <input
            name="voucherType"
            value={form.voucherType || "Receipt"}
            readOnly
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
          <span>Voucher No (optional)</span>

          <input
            value={form.voucherNumber}
            type="text"
            min="0"
            step="1"
            onChange={(event) =>
              updateField("voucherNumber", event.target.value)
            }
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
            placeholder="Voucher No"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
          <span>Date</span>

          <div className="relative">
            <input
              type="date"
              value={form.date}
              required
              onChange={(event) => updateField("date", event.target.value)}
              className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-10 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />

            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              🗓
            </span>
          </div>
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
          <span>Transaction Type</span>

          <SearchableDropdown
            name="transactionType"
            label="transaction type"
            options={[
              "CASH",
              ...companyBanks
                .map((bank) => bank.name || bank.ledgerName || "")
                .filter(Boolean),
            ].filter((value, index, array) => array.indexOf(value) === index)}
            placeholder={banksLoading ? "Loading banks..." : "Select Bank"}
            value={form.transactionType || ""}
            onSelect={(value) => updateField("transactionType", value)}
            disabled={banksLoading}
          />
        </label>

        {banksLoading && <small>Loading bank accounts...</small>}

        <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
          <span>Party Name</span>

          <SearchableDropdown
            name="ledger"
            label="ledgers"
            options={ledgerOptions.map((ledger) =>
              getDisplayName(ledger, [
                "ledgerName",
                "name",
                "displayName",
                "partyName",
              ]),
            )}
            infiniteScroll
            hasMoreOptions={ledgerPage.hasMore}
            loadingMore={ledgerPage.loading}
            loadMoreError={ledgerPage.error}
            onLoadMore={loadMoreLedgers}
            placeholder="Select Party"
            value={form.ledger}
            onSelect={(value) => updateField("ledger", value)}
            onOptionSelect={fetchClosingBalance}
            onClear={() => {
              updateField("ledger", "");
              setClosingBalance("");
            }}
            disabled={optionsLoading}
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
          <span>Closing Balance</span>

          <input
            type="number"
            step="any"
            value={closingBalance}
            onChange={(event) => {
              closingBalanceEditedRef.current = true;
              setClosingBalance(event.target.value);
            }}
            aria-describedby={
              closingBalanceError ? "closing-balance-error" : undefined
            }
            placeholder={
              closingBalanceLoading ? "Loading..." : "Closing Balance"
            }
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
          {closingBalanceError && (
            <span
              id="closing-balance-error"
              className="text-xs text-red-600"
              role="status"
            >
              {closingBalanceError}
            </span>
          )}
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-[12px] font-medium text-slate-700">
          <span>Amount</span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            required
            onChange={(event) => updateField("amount", event.target.value)}
            placeholder="Amount"
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </label>
      </div>

      <div className="mt-5 grid items-start gap-3 lg:grid-cols-[1.35fr_.9fr]">
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
                value={form.narration}
                onChange={(event) =>
                  updateField("narration", event.target.value)
                }
                placeholder="Enter narration"
                className="min-h-[78px] w-full resize-y rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </details>

          <AdvancedVoucherSettings />
        </div>
      </div>
    </div>
  );
}

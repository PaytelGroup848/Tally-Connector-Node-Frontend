import { useEffect, useState } from "react";
import useAuthStore from "../store/authStore";
import { fetchCompanyBank, extractBank } from "../services/companiesApi";
import { getJournalTotalsInPaise } from "../utils/voucherHelpers";
import { SearchableDropdown } from "./SearchableDropdown";

export function JournalVoucherContent({
  companyId,
  voucherType,
  rows,
  partyOptions,
  partyDropdownProps,
  optionsLoading,
  onAddRow,
  onRemoveRow,
  onRowChange,
}) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [companyBanks, setCompanyBanks] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);

  const { debit: debitTotal, credit: creditTotal } =
    getJournalTotalsInPaise(rows);

  useEffect(() => {
    let active = true;

    const loadBanks = async () => {
      if (!accessToken || !companyId) {
        setCompanyBanks([]);
        setBanksLoading(false);
        return;
      }

      setBanksLoading(true);

      try {
        const response = await fetchCompanyBank(accessToken, companyId, {
          page: 1,
          limit: 100, // Contra ke liye zyada bank chahiye ho sakte hain
          q: "",
        });

        // extractBank() already tumhare companiesApi.js mein defined hai
        const banks = extractBank(response);

        if (active) setCompanyBanks(banks);
      } catch (error) {
        console.error("Failed to fetch Contra banks:", error);
        if (active) setCompanyBanks([]);
      } finally {
        if (active) setBanksLoading(false);
      }
    };

    loadBanks();
    return () => {
      active = false;
    };
  }, [accessToken, companyId]);

  const hasEnteredAmount = rows.some(
    (row) => String(row.amount ?? "").trim() !== "",
  );

  const amountsDoNotMatch = hasEnteredAmount && debitTotal !== creditTotal;

  console.log("this is my voucher type", voucherType);

  const renderParticularSection = (type) => {
    const sectionRows = rows.filter((row) => row.type === type);

    return (
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {type} Particulars
          </span>
          <button
            type="button"
            onClick={() => onAddRow(type)}
            className="rounded-md bg-[#dff4e4] px-2 py-1 text-sm font-bold text-green-700"
            aria-label={`Add ${type.toLowerCase()} particular`}
          >
            +
          </button>
        </div>

        <div className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1fr_40px] gap-2 bg-slate-100 p-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          <span>Type</span>
          <span>
            {voucherType === "Contra" ? "Transaction Type" : "Party Name"}
          </span>
          <span>Amount</span>
          <span />
        </div>

        {sectionRows.map((row) => (
          <div
            key={row.id}
            className="grid min-w-[760px] grid-cols-[1fr_1.4fr_1fr_40px] gap-2 border-t border-slate-200 bg-white p-2"
          >
            <input
              value={type}
              readOnly
              aria-label={`${type} entry type`}
              className="min-h-9 rounded-md border border-slate-300 bg-slate-50 px-2 text-xs font-semibold text-slate-700 outline-none"
            />

            {voucherType === "Contra" ? (
              <select
                name={`transactionType-${row.id}`}
                value={row.partyName || ""}
                required
                disabled={banksLoading}
                onChange={(event) =>
                  onRowChange(row.id, "partyName", event.target.value)
                }
                className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="">
                  {banksLoading
                    ? "Loading bank accounts..."
                    : "Select transaction type"}
                </option>

                <option value="CASH">Cash</option>

                {companyBanks.map((bank, index) => {
                  const bankId = bank._id ?? bank.tallyExternalId ?? index;
                  const bankName =
                    bank.name ??
                    bank.ledgerName ??
                    bank.bankName ??
                    bank.accountName ??
                    "";

                  if (!bankName) return null;

                  return (
                    <option key={String(bankId)} value={bankName}>
                      {bankName}
                    </option>
                  );
                })}
              </select>
            ) : (
              <SearchableDropdown
                name={`journalPartyName-${row.id}`}
                label="parties"
                options={partyOptions}
                {...partyDropdownProps}
                loading={optionsLoading}
                value={row.partyName}
                onSelect={(value) => onRowChange(row.id, "partyName", value)}
                onClear={() => onRowChange(row.id, "partyName", "")}
                placeholder="Select Party Name"
              />
            )}

            <input
              name={`journalAmount-${row.id}`}
              type="number"
              min="0"
              step="0.01"
              value={row.amount}
              onChange={(event) =>
                onRowChange(row.id, "amount", event.target.value)
              }
              className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Amount"
            />
            <button
              type="button"
              onClick={() => onRemoveRow(row.id)}
              disabled={sectionRows.length === 1}
              className="min-h-9 rounded-md border border-slate-200 bg-slate-100 text-lg text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Remove ${type.toLowerCase()} particular`}
            >
              ×
            </button>
          </div>
        ))}
      </section>
    );
  };

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Voucher Type</span>
          <input
            name="voucherType"
            value={voucherType}
            readOnly
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Voucher No (optional)</span>
          <input
            name="voucherNumber"
            type="text"
            min="0"
            step="1"
            defaultValue=""
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Date</span>
          <input
            name="date"
            type="date"
            defaultValue={new Date().toLocaleDateString("en-CA")}
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
        </label>
      </div>

      <div className="mt-5 space-y-4 overflow-x-auto">
        {renderParticularSection("Debit")}
        {renderParticularSection("Credit")}
      </div>

      {amountsDoNotMatch && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
        >
          <p className="font-semibold">
            Note: Debit and Credit amounts must be the same.
          </p>
        </div>
      )}

      <label className="mt-5 block text-xs font-semibold text-slate-700">
        <span>Narration</span>
        <textarea
          name="narration"
          rows="3"
          placeholder="Enter Narration"
          className="mt-2 min-h-[84px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </label>
    </>
  );
}

// src/pages/Settings/BankDetailsModal.jsx
import { useEffect, useRef, useState } from "react";
import { X, Pencil, Star, Plus } from "lucide-react";
import useAuthStore from "../../store/authStore";
import {
  createCompanyBank,
  fetchCompanyBanks,
  setDefaultCompanyBank,
  updateCompanyBank,
  updateTallyBankLedger,
} from "../../services/CompanyDetailsAndBanksApi";
import { fetchCompanyBank, extractBank } from "../../services/companiesApi";
import {
  EMPTY_BANK_FORM,
  extractBankList,
  extractUnderOptions,
} from "./settingsHelpers";
import { useNavigate } from "react-router-dom";

export default function BankDetailsModal({ company, onClose }) {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);

  const [companyBanks, setCompanyBanks] = useState([]);
  const [bankUnderOptions, setBankUnderOptions] = useState([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [banksError, setBanksError] = useState("");
  const [bankFormOpen, setBankFormOpen] = useState(false);
  const [editingBankId, setEditingBankId] = useState(null);
  const [bankEditOriginal, setBankEditOriginal] = useState(null);
  const [bankForm, setBankForm] = useState(EMPTY_BANK_FORM);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankSaveError, setBankSaveError] = useState("");
  const [bankActionBusyId, setBankActionBusyId] = useState(null);
  const [bankActionError, setBankActionError] = useState("");

  const banksRequestRef = useRef(0);

  const mergeBankLists = (tallyBanks, appBanks) => {
    return tallyBanks.map((tallyBank) => {
      const details = tallyBank.bankDetails || {};

      // Match karo: pehle exact accountNumber + ifsc, phir bankName se
      const matchedAppBank = appBanks.find((appBank) => {
        const sameAccount =
          String(appBank.accountNumber || "").trim() ===
          String(details.accountNumber || "").trim();

        const sameIfsc =
          String(appBank.ifscCode || "")
            .toUpperCase()
            .trim() ===
          String(details.ifscCode || "")
            .toUpperCase()
            .trim();

        const sameBankName =
          String(appBank.bankName || "")
            .toLowerCase()
            .trim() ===
          String(tallyBank.name || "")
            .toLowerCase()
            .trim();

        return (sameAccount && sameIfsc) || sameBankName;
      });

      // 👇 Tally bank + app bank ka data MERGE karo
      // Agar Tally mein field khali hai, toh app ka data use karo
      const mergedDetails = {
        accountHolderName:
          details.accountHolderName || matchedAppBank?.accountHolderName || "",
        accountNumber:
          details.accountNumber || matchedAppBank?.accountNumber || "",
        ifscCode: details.ifscCode || matchedAppBank?.ifscCode || "",
        swiftCode: details.swiftCode || matchedAppBank?.swiftCode || "",
        branchName: details.branchName || matchedAppBank?.branchName || "",
        bankName:
          details.bankName || matchedAppBank?.bankName || tallyBank.name || "",
      };

      return {
        ...tallyBank,
        // 👇 Merged bankDetails
        bankDetails: mergedDetails,
        appBankId: matchedAppBank?._id || null,
        isDefault: Boolean(matchedAppBank?.isDefault),
      };
    });
  };

  const reloadBanks = async (requestId, companyId) => {
    const [tallyRes, appRes] = await Promise.allSettled([
      fetchCompanyBank(accessToken, companyId, {
        page: 1,
        limit: 100,
        q: "",
      }),
      fetchCompanyBanks(accessToken, companyId),
    ]);

    if (requestId !== banksRequestRef.current) return;

    const tallyBanks =
      tallyRes.status === "fulfilled" ? extractBank(tallyRes.value) : [];
    const appBanks =
      appRes.status === "fulfilled" ? extractBankList(appRes.value) : [];

    const finalBanks = mergeBankLists(tallyBanks, appBanks);
    setCompanyBanks(finalBanks);

    const apiUnderOptions = [
      ...new Set(finalBanks.map((b) => b.parent || b.group).filter(Boolean)),
    ];

    const DEFAULT_UNDER_OPTIONS = [
      "Bank Accounts",
      "Bank OD A/c",
      "Bank OCC A/c",
    ];

    const underOptions = [
      ...new Set([...DEFAULT_UNDER_OPTIONS, ...apiUnderOptions]),
    ];
    setBankUnderOptions(underOptions);
  };

  // Initial load
  useEffect(() => {
    if (!company?.id || !accessToken) return;

    const requestId = ++banksRequestRef.current;
    setBanksLoading(true);
    setBanksError("");

    reloadBanks(requestId, company.id)
      .catch((error) => {
        if (requestId !== banksRequestRef.current) return;
        setBanksError(error?.message || "Unable to load banks.");
      })
      .finally(() => {
        if (requestId === banksRequestRef.current) {
          setBanksLoading(false);
        }
      });

    return () => {
      banksRequestRef.current += 1;
    };
  }, [company?.id, accessToken]);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!company?.id || !accessToken) return;

    const requestId = banksRequestRef.current;
    setBankSaving(true);
    setBankSaveError("");

    try {
      if (editingBankId) {
        const updates = Object.fromEntries(
          Object.entries(bankForm).filter(
            ([key, value]) =>
              key !== "isDefault" && value !== bankEditOriginal?.[key],
          ),
        );

        if (Object.keys(updates).length === 0) {
          setBankFormOpen(false);
          setEditingBankId(null);
          setBankEditOriginal(null);
          setBankSaving(false);
          return;
        }

        const isTallyBank = !bankEditOriginal?.appBankId;

        if (isTallyBank) {
          // Tally ledger update karo
          await updateTallyBankLedger(
            accessToken,
            company.id,
            editingBankId, // ye tallyExternalId hai
            updates,
          );
        } else {
          // App bank update karo
          await updateCompanyBank(
            accessToken,
            company.id,
            editingBankId,
            updates,
          );
        }
      } else {
        await createCompanyBank(accessToken, company.id, bankForm);
      }

      if (requestId !== banksRequestRef.current) return;

      await reloadBanks(requestId, company.id);

      setBankForm(EMPTY_BANK_FORM);
      setEditingBankId(null);
      setBankEditOriginal(null);
      setBankFormOpen(false);
    } catch (error) {
      if (requestId !== banksRequestRef.current) return;
      const msg = error?.message || "Unable to save bank.";
      setBankSaveError(
        msg.toLowerCase().includes("tally") ? `Tally Sync Error: ${msg}` : msg,
      );
    } finally {
      if (requestId === banksRequestRef.current) setBankSaving(false);
    }
  };

  const handleAction = async (bank, action) => {
    const bankId = bank.appBankId;
    if (!company?.id || !bankId || !accessToken) {
      setBankActionError("Bank not linked. Try refreshing.");
      return;
    }

    const requestId = banksRequestRef.current;
    setBankActionBusyId(bankId);
    setBankActionError("");

    try {
      if (action === "default") {
        await setDefaultCompanyBank(accessToken, company.id, bankId);
      }
      if (requestId !== banksRequestRef.current) return;
      await reloadBanks(requestId, company.id);
    } catch (error) {
      if (requestId !== banksRequestRef.current) return;
      setBankActionError(error?.message || "Unable to update bank.");
    } finally {
      if (requestId === banksRequestRef.current) {
        setBankActionBusyId(null);
      }
    }
  };

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
              Bank Details
            </p>
            <h2 className="mt-1 text-lg font-bold text-slate-900">
              {company?.name || "Company"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        <div className="space-y-4 overflow-y-auto p-5">
          <div className="flex justify-end gap-2">
            {console.log("this is my company ", company)}

          <button
  type="button"
  onClick={() => {
    const companyId = company?.id || company?._id;
    const companyName = company?.name || "";

    if (!companyId) {
      setBanksError(
        "Company ID not found. Please select a company again.",
      );
      return;
    }

    onClose?.();

    window.location.href = `/bank-status?companyId=${encodeURIComponent(companyId)}&companyName=${encodeURIComponent(companyName)}`;
  }}
  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
>
  View Bank Status
</button>

            <button
              type="button"
              onClick={() => {
                setBankForm(EMPTY_BANK_FORM);
                setEditingBankId(null);
                setBankEditOriginal(null);
                setBankSaveError("");
                setBankFormOpen((open) => !open);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              <Plus size={16} />
              {bankFormOpen ? "Close Form" : "Add Bank"}
            </button>
          </div>

          {banksLoading && (
            <p className="text-sm text-slate-500" role="status">
              Loading bank details...
            </p>
          )}
          {banksError && (
            <p className="text-sm text-red-600" role="alert">
              {banksError}
            </p>
          )}
          {bankActionError && (
            <p className="text-sm text-red-600" role="alert">
              {bankActionError}
            </p>
          )}

          {!banksLoading &&
            !banksError &&
            companyBanks.length === 0 &&
            !bankFormOpen && (
              <div className="rounded-xl border border-slate-200 p-5 text-center text-sm text-slate-500">
                No bank accounts found.
              </div>
            )}

          {companyBanks.map((bank, bankIndex) => {
            const details = bank.bankDetails || {};
            const bankName =
              bank.name || bank.bankName || details.bankName || "Bank";
            const under = bank.parent || bank.group || "Bank Accounts";

            return (
              <div
                key={bank._id || bank.tallyExternalId || bankIndex}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-semibold text-slate-900">{bankName}</h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {bank.isDefault && (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Default
                      </span>
                    )}
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {under}
                    </span>
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
                  {[
                    [
                      "Account Holder",
                      details.accountHolderName || bank.accountHolderName,
                    ],
                    [
                      "Account Number",
                      details.accountNumber || bank.accountNumber,
                    ],
                    ["IFSC Code", details.ifscCode || bank.ifscCode],
                    ["SWIFT Code", details.swiftCode || bank.swiftCode],
                    ["Branch", details.branchName || bank.branchName],
                    [
                      "Closing Balance",
                      bank.closingBalance != null
                        ? `₹${Number(bank.closingBalance).toLocaleString("en-IN")}`
                        : null,
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-xs text-slate-500">{label}</dt>
                      <dd className="break-words font-medium text-slate-800">
                        {value || "—"}
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                  {bank.appBankId || bank.tallyExternalId ? (
                    <button
                      type="button"
                      disabled={Boolean(bankActionBusyId)}
                      onClick={() => {
                        setBankForm({
                          bankName,
                          under,
                          accountHolderName: details.accountHolderName || "",
                          accountNumber: details.accountNumber || "",
                          ifscCode: details.ifscCode || "",
                          swiftCode: details.swiftCode || "",
                          branchName: details.branchName || "",
                          isDefault: Boolean(bank.isDefault),
                        });
                        setBankEditOriginal({
                          bankName,
                          under,
                          accountHolderName: details.accountHolderName || "",
                          accountNumber: details.accountNumber || "",
                          ifscCode: details.ifscCode || "",
                          swiftCode: details.swiftCode || "",
                          branchName: details.branchName || "",
                          isDefault: Boolean(bank.isDefault),
                          // 👇 Track karo ki ye Tally bank hai ya app bank
                          appBankId: bank.appBankId || null,
                        });
                        // 👇 Priority: appBankId > tallyExternalId
                        setEditingBankId(
                          bank.appBankId || bank.tallyExternalId,
                        );
                        setBankSaveError("");
                        setBankFormOpen(true);
                      }}
                      className="..."
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  ) : null}

                  {(bank.appBankId || bank._id || bank.tallyExternalId) && (
                    <button
                      type="button"
                      disabled={Boolean(bankActionBusyId)}
                      onClick={() => {
                        setBankForm({
                          bankName,
                          under,
                          accountHolderName: details.accountHolderName || "",
                          accountNumber: details.accountNumber || "",
                          ifscCode: details.ifscCode || "",
                          swiftCode: details.swiftCode || "",
                          branchName: details.branchName || "",
                          isDefault: Boolean(bank.isDefault),
                        });
                        setBankEditOriginal({
                          bankName,
                          under,
                          accountHolderName: details.accountHolderName || "",
                          accountNumber: details.accountNumber || "",
                          ifscCode: details.ifscCode || "",
                          swiftCode: details.swiftCode || "",
                          branchName: details.branchName || "",
                          isDefault: Boolean(bank.isDefault),
                        });
                        // 👇 ID priority: appBankId > _id > tallyExternalId
                        setEditingBankId(
                          bank.appBankId || bank._id || bank.tallyExternalId,
                        );
                        setBankSaveError("");
                        setBankFormOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {bankFormOpen && (
            <div
              className="fixed inset-0 z-[310] flex items-center justify-center bg-slate-950/50 p-4"
              onClick={() => !bankSaving && setBankFormOpen(false)}
            >
              <section
                role="dialog"
                aria-modal="true"
                className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600">
                      Bank Details
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-slate-900">
                      {editingBankId ? "Edit Bank Account" : "Add Bank Account"}
                    </h3>
                  </div>
                  <button
                    type="button"
                    disabled={bankSaving}
                    onClick={() => {
                      setBankFormOpen(false);
                      setEditingBankId(null);
                    }}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </header>

                <form
                  className="space-y-4 overflow-y-auto p-5"
                  onSubmit={handleSave}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      ["bankName", "Bank Name"],
                      ["under", "Under"],
                      ["accountHolderName", "Account Holder Name"],
                      ["accountNumber", "Account Number"],
                      ["ifscCode", "IFSC Code"],
                      ["swiftCode", "SWIFT Code (optional)"],
                      ["branchName", "Branch Name (optional)"],
                    ].map(([name, label]) => (
                      <label key={name} className="block">
                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                          {label}
                        </span>
                        {name === "under" ? (
                          <select
                            value={bankForm.under}
                            onChange={(e) =>
                              setBankForm((c) => ({
                                ...c,
                                under: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          >
                            <option value="">Select Under</option>
                            {bankForm.under &&
                              !bankUnderOptions.includes(bankForm.under) && (
                                <option value={bankForm.under}>
                                  {bankForm.under}
                                </option>
                              )}
                            {bankUnderOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            required={[
                              "bankName",
                              "accountHolderName",
                              "accountNumber",
                              "ifscCode",
                            ].includes(name)}
                            value={bankForm[name]}
                            onChange={(e) =>
                              setBankForm((c) => ({
                                ...c,
                                [name]: e.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                          />
                        )}
                      </label>
                    ))}
                  </div>

                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={bankForm.isDefault}
                      disabled={Boolean(
                        editingBankId && bankEditOriginal?.isDefault,
                      )}
                      onChange={(e) =>
                        setBankForm((c) => ({
                          ...c,
                          isDefault: e.target.checked,
                        }))
                      }
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    {editingBankId && bankEditOriginal?.isDefault
                      ? "Default bank account"
                      : "Set as default bank"}
                  </label>

                  {bankSaveError && (
                    <p className="text-sm text-red-600" role="alert">
                      {bankSaveError}
                    </p>
                  )}

                  <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                    <button
                      type="button"
                      disabled={bankSaving}
                      onClick={() => {
                        setBankFormOpen(false);
                        setEditingBankId(null);
                      }}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bankSaving}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {bankSaving
                        ? "Saving..."
                        : editingBankId
                          ? "Save Changes"
                          : "Add Bank"}
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

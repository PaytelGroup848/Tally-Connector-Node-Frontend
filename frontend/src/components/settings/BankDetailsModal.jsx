// src/pages/Settings/BankDetailsModal.jsx
import { useEffect, useRef, useState } from "react";
import { X, Pencil, Star, Plus } from "lucide-react";
import { SearchableDropdown } from "../../components/SearchableDropdown";
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

      const matchedAppBank = appBanks.find((appBank) => {
        const tAccount = String(details.accountNumber || "").trim();
        const aAccount = String(appBank.accountNumber || "").trim();
        const tIfsc = String(details.ifscCode || "")
          .toUpperCase()
          .trim();
        const aIfsc = String(appBank.ifscCode || "")
          .toUpperCase()
          .trim();
        const tName = String(tallyBank.name || "")
          .toLowerCase()
          .trim();
        const aName = String(appBank.bankName || "")
          .toLowerCase()
          .trim();

        // Rule 1: Both account + IFSC match (strong)
        if (
          tAccount &&
          aAccount &&
          tIfsc &&
          aIfsc &&
          tAccount === aAccount &&
          tIfsc === aIfsc
        ) {
          return true;
        }

        // Rule 2: Bank name match (case-insensitive)
        if (tName && aName && tName === aName) {
          return true;
        }

        // Rule 3: Account number alone matches (Tally bank has it)
        if (tAccount && aAccount && tAccount === aAccount) {
          return true;
        }

        return false;
      });

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

    console.log("Tally banks:", tallyBanks);
    console.log("App banks:", appBanks);

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

        const shouldSetDefault =
          Boolean(bankForm.isDefault) && !Boolean(bankEditOriginal?.isDefault);

        if (Object.keys(updates).length === 0 && !shouldSetDefault) {
          setBankFormOpen(false);
          setEditingBankId(null);
          setBankEditOriginal(null);
          setBankSaving(false);
          return;
        }

        if (Object.keys(updates).length > 0) {
          const isTallyBank = !bankEditOriginal?.appBankId;
          if (isTallyBank) {
            await updateTallyBankLedger(
              accessToken,
              company.id,
              editingBankId,
              {
                ...updates,
                ledgerName: bankForm.bankName,
              },
            );
          } else {
            await updateCompanyBank(
              accessToken,
              company.id,
              editingBankId,
              updates,
            );
          }
        }

        if (shouldSetDefault) {
          let appBankId = bankEditOriginal?.appBankId;

          if (!appBankId) {
            const freshBanks = await fetchCompanyBanks(accessToken, company.id);
            const allBanks = extractBankList(freshBanks);

            // Match karo: account number + IFSC (ya bank name)
            const matched = allBanks.find(
              (b) =>
                (String(b.accountNumber || "").trim() ===
                  String(bankForm.accountNumber || "").trim() &&
                  String(b.ifscCode || "").toUpperCase() ===
                    String(bankForm.ifscCode || "").toUpperCase()) ||
                String(b.bankName || "")
                  .toLowerCase()
                  .trim() ===
                  String(bankForm.bankName || "")
                    .toLowerCase()
                    .trim(),
            );

            appBankId = matched?._id || matched?.id || null;
          }

          if (!appBankId) {
            setBankSaveError(
              "Could not link this bank to your account. It may not be synced yet. Please try again after Tally sync completes.",
            );
            setBankSaving(false);
            return;
          }

          // 👇 Ab default set karo
          await setDefaultCompanyBank(accessToken, company.id, appBankId);
        }
      } else {
        // Create new bank
        const payload = { ...bankForm };
        if (payload.isDefault === undefined) payload.isDefault = false;
        await createCompanyBank(accessToken, company.id, payload);
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

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        className="flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
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

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Bank Name
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Under
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Account Holder
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Account Number
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    IFSC Code
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    SWIFT Code
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600">
                    Branch
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-600">
                    Closing Balance
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-slate-600">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {companyBanks.length > 0 ? (
                  companyBanks.map((bank, bankIndex) => {
                    const details = bank.bankDetails || {};

                    const bankName =
                      bank.name || bank.bankName || details.bankName || "Bank";

                    const under = bank.parent || bank.group || "Bank Accounts";

                    const accountHolderName =
                      details.accountHolderName || bank.accountHolderName;

                    const accountNumber =
                      details.accountNumber || bank.accountNumber;

                    const ifscCode = details.ifscCode || bank.ifscCode;
                    const swiftCode = details.swiftCode || bank.swiftCode;
                    const branchName = details.branchName || bank.branchName;

                    const closingBalance =
                      bank.closingBalance != null
                        ? `₹${Number(bank.closingBalance).toLocaleString("en-IN")}`
                        : "—";

                    return (
                      <tr
                        key={bank._id || bank.tallyExternalId || bankIndex}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-900">
                              {bankName}
                            </span>

                            {bank.isDefault && (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                Default
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                          {under}
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          {accountHolderName || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-800">
                          {accountNumber || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {ifscCode || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                          {swiftCode || "—"}
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          {branchName || "—"}
                        </td>

                        <td className="whitespace-nowrap px-4 py-3 text-right font-medium text-slate-800">
                          {closingBalance}
                        </td>

                        <td className="px-4 py-3 text-center">
                          {(bank.appBankId ||
                            bank._id ||
                            bank.tallyExternalId) && (
                            <button
                              type="button"
                              disabled={Boolean(bankActionBusyId)}
                              onClick={() => {
                                setBankForm({
                                  bankName,
                                  under,
                                  accountHolderName:
                                    details.accountHolderName ||
                                    bank.accountHolderName ||
                                    "",
                                  accountNumber:
                                    details.accountNumber ||
                                    bank.accountNumber ||
                                    "",
                                  ifscCode:
                                    details.ifscCode || bank.ifscCode || "",
                                  swiftCode:
                                    details.swiftCode || bank.swiftCode || "",
                                  branchName:
                                    details.branchName || bank.branchName || "",
                                  isDefault: Boolean(bank.isDefault),
                                });

                                setBankEditOriginal({
                                  bankName,
                                  under,
                                  accountHolderName:
                                    details.accountHolderName ||
                                    bank.accountHolderName ||
                                    "",
                                  accountNumber:
                                    details.accountNumber ||
                                    bank.accountNumber ||
                                    "",
                                  ifscCode:
                                    details.ifscCode || bank.ifscCode || "",
                                  swiftCode:
                                    details.swiftCode || bank.swiftCode || "",
                                  branchName:
                                    details.branchName || bank.branchName || "",
                                  isDefault: Boolean(bank.isDefault),
                                  appBankId: bank.appBankId || null,
                                });

                                setEditingBankId(
                                  bank.appBankId || bank.tallyExternalId,
                                );

                                setBankSaveError("");
                                setBankFormOpen(true);
                              }}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-10 text-center text-sm text-slate-500"
                    >
                      No bank accounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

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
                          <SearchableDropdown
                            name="under"
                            label="under"
                            options={[
                              ...new Set([
                                ...(bankForm.under &&
                                !bankUnderOptions.includes(bankForm.under)
                                  ? [bankForm.under]
                                  : []),
                                ...bankUnderOptions,
                              ]),
                            ]}
                            placeholder="Select Under"
                            value={bankForm.under || ""}
                            onSelect={(value) =>
                              setBankForm((current) => ({
                                ...current,
                                under: value,
                              }))
                            }
                            onClear={() =>
                              setBankForm((current) => ({
                                ...current,
                                under: "",
                              }))
                            }
                          />
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

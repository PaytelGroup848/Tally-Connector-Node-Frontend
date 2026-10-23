import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { getGstStateCode } from "./utils";
import { SearchableDropdown } from "../../components/SearchableDropdown";
export default function CreatePartyModal({
  partyForm,
  gstLookup,
  createError,
  createMessage,
  isCreating,
  onClose,
  onSubmit,
  updatePartyField,
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-900/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className=" max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Add New Party
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Create a customer or supplier for the selected company.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close add party form"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-4 px-5 pt-5 sm:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>
              Party Name<span className="text-red-500"> *</span>
            </span>
            <input
              type="text"
              required
              value={partyForm.partyName}
              onChange={(event) =>
                updatePartyField("partyName", event.target.value)
              }
              placeholder="Enter party name"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>
              Party Type<span className="text-red-500"> *</span>
            </span>
            <SearchableDropdown
              name="partyType"
              label="party types"
              options={[
                "Customer (Sundry Debtors)",
                "Supplier (Sundry Creditors)",
              ]}
              placeholder="Select Party Type"
              value={
                partyForm.partyType === "CUSTOMER"
                  ? "Customer (Sundry Debtors)"
                  : partyForm.partyType === "SUPPLIER"
                    ? "Supplier (Sundry Creditors)"
                    : ""
              }
              onSelect={(selectedLabel) => {
                const partyType =
                  selectedLabel === "Customer (Sundry Debtors)"
                    ? "CUSTOMER"
                    : "SUPPLIER";

                updatePartyField("partyType", partyType);
              }}
              onClear={() => updatePartyField("partyType", "")}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>Phone Number</span>
            <input
              type="tel"
              value={partyForm.contactNumber}
              onChange={(event) =>
                updatePartyField("contactNumber", event.target.value)
              }
              placeholder="9999999999"
              maxLength={15}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>Email</span>
            <input
              type="email"
              value={partyForm.email}
              onChange={(event) =>
                updatePartyField("email", event.target.value)
              }
              placeholder="example@gmail.com"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>Opening Balance</span>
            <input
              type="number"
              min="0"
              step="0.01"
              value={partyForm.openingBalance}
              onChange={(event) =>
                updatePartyField("openingBalance", event.target.value)
              }
              placeholder="0"
              className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>GST Number</span>
            <div
              className={`relative flex h-10 items-center rounded-md border transition ${
                gstLookup.status === "valid"
                  ? "border-emerald-400 bg-emerald-50/50"
                  : gstLookup.status === "invalid"
                    ? "border-red-400 bg-red-50/50"
                    : "border-slate-300"
              }`}
            >
              <input
                type="text"
                value={partyForm.gstNumber}
                onChange={(event) =>
                  updatePartyField(
                    "gstNumber",
                    event.target.value.toUpperCase().replace(/\s/g, ""),
                  )
                }
                maxLength={15}
                className="h-full w-full rounded-md bg-transparent px-3 pr-10 text-sm font-medium tracking-wider text-slate-800 outline-none placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400"
              />
              <span className="absolute right-3 flex items-center">
                {gstLookup.status === "checking" && (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                )}
                {gstLookup.status === "valid" && (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                )}
                {gstLookup.status === "invalid" && (
                  <AlertCircle className="h-4 w-4 text-red-500" />
                )}
              </span>
            </div>
            {gstLookup.status === "checking" && (
              <span className="text-[11px] text-blue-600">
                Verifying GSTIN…
              </span>
            )}
            {gstLookup.status === "valid" && (
              <span className="text-[11px] text-emerald-600">
                ✓ {gstLookup.data?.trade_name || "Valid GSTIN"}
              </span>
            )}
            {gstLookup.status === "invalid" && gstLookup.error && (
              <span className="text-[11px] text-red-600">
                {gstLookup.error}
              </span>
            )}
            {gstLookup.status === "idle" && (
              <span className="text-[11px] text-slate-400">
                Format: 22AAAAA0000A1Z5 (15 digits)
              </span>
            )}
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>GST Registration Type</span>
            <SearchableDropdown
              name="gstRegistrationType"
              label="GST registration types"
              options={[
                "Regular",
                "Composition",
                "Unregistered",
                "Consumer",
                "Overseas",
                "SEZ",
                "Deemed Exporter",
                "Input Service Distributor",
              ]}
              placeholder="Select Registration Type"
              value={partyForm.gstRegistrationType || ""}
              onSelect={(value) =>
                updatePartyField("gstRegistrationType", value)
              }
              onClear={() => updatePartyField("gstRegistrationType", "")}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>State</span>
            <input
              type="text"
              value={partyForm.state}
              onChange={(event) => {
                const state = event.target.value;
                updatePartyField("state", state);
                updatePartyField("stateCode", getGstStateCode(state));
              }}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>State Code</span>
            <input
              type="text"
              inputMode="numeric"
              value={partyForm.stateCode}
              onChange={(event) =>
                updatePartyField(
                  "stateCode",
                  event.target.value.replace(/\D/g, "").slice(0, 2),
                )
              }
              maxLength={2}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700">
            <span>Postal Code</span>
            <input
              type="text"
              inputMode="numeric"
              value={partyForm.postalCode}
              onChange={(event) =>
                updatePartyField(
                  "postalCode",
                  event.target.value.replace(/\D/g, "").slice(0, 6),
                )
              }
              maxLength={6}
              className="h-10 rounded-md border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-medium text-slate-700 sm:col-span-2">
            <span>Postal Address</span>
            <textarea
              value={partyForm.postalAddress}
              onChange={(event) =>
                updatePartyField("postalAddress", event.target.value)
              }
              rows={3}
              placeholder="Building, street, area, city…"
              className="min-h-[80px] w-full resize-y rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </label>

          {createError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700 sm:col-span-2">
              {createError}
            </p>
          )}
          {createMessage && (
            <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700 sm:col-span-2">
              {createMessage}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-1">
          <button
            type="button"
            onClick={onClose}
            disabled={isCreating}
            className="rounded-md border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isCreating}
            className="rounded-md bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreating ? "Creating..." : "Create Party"}
          </button>
        </div>
      </form>
    </div>
  );
}

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  Loader2,
  Lock,
  LogIn,
  MapPin,
  ShieldCheck,
  Truck,
  User,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import StatusToast from "../../components/receipt/StatusToast";
import { useSaveNICConfig, useVerifyNICConfig } from "../../hooks/useEwayBill";

const navigateTo = (path) => {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

/* GST state codes (first two digits of GSTIN) */
const GST_STATES = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  10: "Bihar",
  11: "Sikkim",
  12: "Arunachal Pradesh",
  13: "Nagaland",
  14: "Manipur",
  15: "Mizoram",
  16: "Tripura",
  17: "Meghalaya",
  18: "Assam",
  19: "West Bengal",
  20: "Jharkhand",
  21: "Odisha",
  22: "Chhattisgarh",
  23: "Madhya Pradesh",
  24: "Gujarat",
  26: "Dadra & Nagar Haveli and Daman & Diu",
  27: "Maharashtra",
  29: "Karnataka",
  30: "Goa",
  31: "Lakshadweep",
  32: "Kerala",
  33: "Tamil Nadu",
  34: "Puducherry",
  35: "Andaman & Nicobar Islands",
  36: "Telangana",
  37: "Andhra Pradesh",
  38: "Ladakh",
  97: "Other Territory",
  99: "Centre Jurisdiction",
};

const digitsOnly = (value) => String(value).replace(/\D/g, "");

/* NIC-style input: grey icon block on the left + flat input */
function PortalField({
  id,
  label,
  icon: Icon,
  right,
  hint,
  required,
  readOnly,
  className = "",
  ...props
}) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1 block text-xs font-semibold text-slate-700"
      >
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <div
        className={`flex h-10 overflow-hidden rounded border transition ${
          readOnly
            ? "border-slate-200 bg-slate-100"
            : "border-slate-300 bg-white focus-within:border-[#1b5fa8] focus-within:ring-2 focus-within:ring-[#1b5fa8]/20"
        }`}
      >
        {Icon && (
          <span className="flex w-10 shrink-0 items-center justify-center border-r border-slate-300 bg-slate-100 text-[#1b4f8a]">
            <Icon size={16} />
          </span>
        )}
        <input
          id={id}
          required={required}
          readOnly={readOnly}
          className={`h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-slate-400 ${
            readOnly
              ? "cursor-not-allowed font-semibold text-slate-600"
              : "text-slate-800"
          }`}
          {...props}
        />
        {right}
      </div>
      {hint && (
        <p className="mt-1 truncate text-[11px] text-slate-500">{hint}</p>
      )}
    </div>
  );
}

function ColumnTitle({ icon: Icon, children, badge }) {
  return (
    <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
      <Icon size={16} className="text-[#1b4f8a]" />
      <h2 className="text-sm font-semibold text-slate-800">{children}</h2>
      {badge && (
        <span className="rounded bg-slate-200 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
          {badge}
        </span>
      )}
    </div>
  );
}

export default function NICSettingsPage({ companyId }) {
  const token = useAuthStore((s) => s.accessToken);
  const saveMutation = useSaveNICConfig(companyId);
  const verifyMutation = useVerifyNICConfig(companyId);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    gstin: "",
    // Consignor details (optional) — auto-filled in the E-Way Bill form
    fromTrdName: "",
    fromAddr1: "",
    fromPlace: "",
    fromPincode: "",
    fromStateCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const isSaving = saveMutation.isPending || verifyMutation.isPending;

  const stateName = useMemo(
    () => GST_STATES[formData.fromStateCode] || "",
    [formData.fromStateCode],
  );

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "gstin") {
        const gstin = value.toUpperCase().replace(/\s/g, "");
        // State code = first two digits of GSTIN
        const stateCode = /^\d{2}/.test(gstin) ? gstin.slice(0, 2) : "";
        return { ...prev, gstin, fromStateCode: stateCode };
      }

      if (name === "fromPincode") {
        return { ...prev, fromPincode: digitsOnly(value).slice(0, 6) };
      }

      return { ...prev, [name]: value };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setToast(null);

    try {
      const payload = {
        username: formData.username,
        password: formData.password,
        gstin: formData.gstin,
        fromTrdName: formData.fromTrdName,
        fromAddr1: formData.fromAddr1,
        fromPlace: formData.fromPlace,
        fromPincode: formData.fromPincode,
        fromStateCode: formData.fromStateCode,
      };

      await saveMutation.mutateAsync(payload);
      await verifyMutation.mutateAsync();

      setToast({
        message: "NIC configuration saved & verified successfully.",
        isError: false,
      });

      window.setTimeout(() => navigateTo("/my-eway-bill"), 1200);
    } catch (err) {
      setToast({
        message: err?.message || "Unable to save NIC configuration.",
        isError: true,
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-60px)] flex-col bg-[#e9eff6]">
      <StatusToast
        visible={Boolean(toast)}
        message={toast?.message}
        isError={Boolean(toast?.isError)}
        onClose={() => setToast(null)}
      />

      {/* Portal style top bar */}
      <div className="border-b-4 border-[#f28c28] bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-[#143e73] text-white">
              <Truck size={20} />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold text-[#143e73]">
                e-Way Bill System
              </div>
              <div className="text-[11px] text-slate-500">
                National Informatics Centre &middot; GST Network
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigateTo("/my-eway-bill")}
            className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]"
          >
            <ArrowLeft size={16} /> Back to E-Way Bills
          </button>
        </div>
      </div>

      {/* Blue band */}
      <div className="flex flex-1 items-center bg-gradient-to-br from-[#143e73] via-[#1b5fa8] to-[#2a7bc4]">
        <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
          {/* Heading */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 text-white">
            <div>
              <h1 className="text-xl font-bold sm:text-2xl">
                Connect your NIC e-Way Bill account
              </h1>
              <p className="mt-0.5 text-xs text-blue-100 sm:text-sm">
                First step before you can generate, update or cancel e-Way
                Bills.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-blue-100">
              <ShieldCheck size={15} className="text-[#ffb866]" />
              Credentials are stored securely for this company only
            </div>
          </div>

          {/* Card */}
          <form
            onSubmit={handleSave}
            className="overflow-hidden rounded bg-white shadow-2xl"
          >
            <div className="flex items-center gap-2 bg-[#143e73] px-5 py-3 text-white">
              <LogIn size={17} />
              <span className="text-sm font-semibold">NIC Portal Login</span>
            </div>

            {!companyId && (
              <div className="mx-5 mt-4 flex items-start gap-2 rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                Select a company before saving NIC settings.
              </div>
            )}

            <div className="grid gap-6 p-5 lg:grid-cols-2 lg:gap-0">
              {/* Left: credentials */}
              <div className="lg:pr-6">
                <ColumnTitle icon={Lock}>Login Credentials</ColumnTitle>
                <div className="space-y-3">
                  <PortalField
                    id="nic-username"
                    label="User Name"
                    icon={User}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    autoComplete="username"
                    placeholder="Enter NIC username"
                  />

                  <PortalField
                    id="nic-password"
                    label="Password"
                    icon={Lock}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="current-password"
                    placeholder="Enter NIC password"
                    right={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        aria-pressed={showPassword}
                        className="flex w-10 shrink-0 items-center justify-center text-slate-500 transition hover:text-[#1b4f8a] focus:outline-none focus-visible:bg-slate-100"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    }
                  />

                  <PortalField
                    id="nic-gstin"
                    label="GSTIN"
                    icon={Building2}
                    name="gstin"
                    value={formData.gstin}
                    onChange={handleChange}
                    required
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="e.g. 07AAGCB1286Q012"
                    hint={
                      stateName
                        ? `State detected: ${stateName} (${formData.fromStateCode})`
                        : "State code is filled automatically from the first 2 digits"
                    }
                  />
                </div>
              </div>

              {/* Right: consignor */}
              <div className="lg:border-l lg:border-slate-200 lg:pl-6">
                <ColumnTitle icon={MapPin} badge="Optional">
                  Consignor Details
                </ColumnTitle>
                <div className="grid grid-cols-5 gap-3">
                  <PortalField
                    className="col-span-5"
                    id="nic-from-trd-name"
                    label="Trade Name"
                    icon={FileText}
                    name="fromTrdName"
                    value={formData.fromTrdName}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="Trade / legal name"
                  />

                  <PortalField
                    className="col-span-5"
                    id="nic-from-addr1"
                    label="Address Line 1"
                    icon={MapPin}
                    name="fromAddr1"
                    value={formData.fromAddr1}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="Building, street, area"
                  />

                  <PortalField
                    className="col-span-5 sm:col-span-2"
                    id="nic-from-place"
                    label="Place"
                    name="fromPlace"
                    value={formData.fromPlace}
                    onChange={handleChange}
                    autoComplete="off"
                    placeholder="City"
                  />

                  <PortalField
                    className="col-span-3 sm:col-span-2"
                    id="nic-from-pincode"
                    label="Pincode"
                    name="fromPincode"
                    value={formData.fromPincode}
                    onChange={handleChange}
                    autoComplete="off"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="6 digits"
                  />

                  <PortalField
                    className="col-span-2 sm:col-span-1"
                    id="nic-from-state-code"
                    label="State Code"
                    name="fromStateCode"
                    value={formData.fromStateCode}
                    readOnly
                    tabIndex={-1}
                    placeholder="Auto"
                    title="Auto-filled from the first 2 digits of GSTIN"
                  />
                </div>
              </div>
            </div>

            {/* Footer: status + action */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-3">
              {toast ? (
                <div
                  role="status"
                  className={`flex items-center gap-2 text-sm ${
                    toast.isError ? "text-red-700" : "text-emerald-700"
                  }`}
                >
                  {toast.isError ? (
                    <AlertCircle size={16} className="shrink-0" />
                  ) : (
                    <CheckCircle2 size={16} className="shrink-0" />
                  )}
                  {toast.message}
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  Forgot your credentials? Reset them on the official NIC e-Way
                  Bill portal.
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving || !companyId || !token}
                className="inline-flex h-10 min-w-[200px] items-center justify-center gap-2 rounded bg-[#f28c28] px-6 text-sm font-bold text-white transition hover:bg-[#d97a1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f28c28] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 max-sm:w-full"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving &amp; Verifying...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Save &amp; Verify
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

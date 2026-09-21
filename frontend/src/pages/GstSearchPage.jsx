import axios from "axios";
import { useState } from "react";
import {
  FileText,
  Search,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from "lucide-react";

function GstSearchPage() {
  const [gstin, setGstin] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!gstin.trim()) {
      setError("Please enter a GSTIN number");
      return;
    }

    setLoading(true);
    setError("");
    setData(null);

    try {
      const formData = new FormData();
      formData.append("gstin", gstin.trim().toUpperCase());

      const res = await axios.post(
        "/tally-api/gstin-serach-api.php",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      if (res.data?.status === 1) {
        setData(res.data);
      } else {
        setError(res.data?.message || "Invalid GSTIN. Please try again.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg shadow-blue-200">
            <FileText className="h-6 w-6 text-white" strokeWidth={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">GSTIN Search</h1>
            <p className="text-sm text-slate-500">
              Verify GST Number and get business details instantly
            </p>
          </div>
        </div>

        {/* Search Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-100">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                value={gstin}
                onChange={(e) => setGstin(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                maxLength={15}
                className="w-full rounded-xl border border-slate-300 bg-slate-50 py-2.5 pl-10 pr-3 text-sm font-medium tracking-wide text-slate-800 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="Enter GST Number (e.g. 29AAICA3918J1ZE)"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Searching
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Search
                </>
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Format: 22AAAAA0000A1Z5 (15 Digits)
          </p>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {data && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100">
            {/* Result Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-emerald-600 shadow-sm">
                  <CheckCircle2 className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Validation Status
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    {data.validation_status} · {data.gstin_status}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                {data.message}
              </span>
            </div>

            {/* Result Body */}
            <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2">
              <Field label="Trade Name" value={data.trade_name} />
              <Field label="Legal Name" value={data.legal_name} />
              <Field label="GSTIN" value={data.gstin} mono />
              <Field label="Registration Type" value={data.registration_type} />
              <Field label="Registration Date" value={data.registration_date} />
              <Field
                label="Business Constitution"
                value={data.business_constitution}
              />
              <Field label="Enablement Status" value={data.enablement_status} />
              <Field
                label="State / City / Pincode"
                value={`${data.state} · ${data.city} · ${data.pincode}`}
              />

              <div className="sm:col-span-2">
                <Field label="Address" value={data.address} />
              </div>

              <div className="sm:col-span-2">
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Business Activity
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.business_activity?.split(",").map((act, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700"
                    >
                      {act.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {data.geolocation && (
                <div className="sm:col-span-2">
                  <a
                    href={`https://www.google.com/maps?q=${encodeURIComponent(
                      data.geolocation,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <MapPin className="h-3.5 w-3.5 text-slate-400 transition group-hover:text-blue-600" />
                    <span>View on Map</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-[11px] text-slate-500 group-hover:text-blue-600">
                      {data.geolocation}
                    </span>
                    <ExternalLink className="h-3.5 w-3.5 text-blue-600 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable field component
function Field({ label, value, mono }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p
        className={`break-words text-sm font-medium text-slate-800 ${
          mono ? "font-mono tracking-wider" : ""
        }`}
      >
        {value || "—"}
      </p>
    </div>
  );
}

export default GstSearchPage;

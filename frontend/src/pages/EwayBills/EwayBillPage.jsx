import { useState } from "react";
import { useEwayBills } from "../../hooks/useEwayBill";
import {
  extractEwayBills,
  extractEwayBillTotal,
} from "../../services/ewayBillApi";
import { Plus, Search, Eye, Settings } from "lucide-react";
import StatusToast from "../../components/receipt/StatusToast";
import GenerateEwayBillModal from "./GenerateEwayBillModal";
import ManageEwayBillModal from "./ManageEwayBillModal";

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const statusStyles = {
  ACT: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  EXPIRED: "bg-amber-100 text-amber-700",
};

const statusLabels = {
  ACT: "Active",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

const navigateTo = (path) => {
  if (window.location.pathname === path) return;
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
};

export default function EwayBillPage({ companyId }) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [toast, setToast] = useState(null);

  const { data, isLoading, isError, error } = useEwayBills(
    companyId,
    page,
    limit,
    search,
  );

  const bills = extractEwayBills(data);
  const total = extractEwayBillTotal(data, bills.length);
  const totalPages = Math.ceil(total / limit) || 1;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Search change par page 1 par jao
  };

  const notify = (message, isError = false) => setToast({ message, isError });

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-4 sm:p-6">
      <StatusToast
        visible={Boolean(toast)}
        message={toast?.message}
        isError={Boolean(toast?.isError)}
        onClose={() => setToast(null)}
      />

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">E-Way Bills</h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage all your generated e-way bills here.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => navigateTo("/my-eway-bill/settings")}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <Settings size={16} /> NIC Settings
            </button>
            <button
              onClick={() => setIsGenerateOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
            >
              <Plus size={16} /> Generate E-Way Bill
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white rounded-t-xl border border-slate-200 p-4 flex flex-wrap items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by E-Way Bill No or Party..."
              value={search}
              onChange={handleSearchChange}
              className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span>Show</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="rounded-lg border border-slate-200 px-2 py-1 outline-none"
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <span>records</span>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border-x border-b border-slate-200 rounded-b-xl overflow-hidden">
          {isLoading ? (
            <div className="p-8 text-center text-slate-500">
              Loading E-Way Bills...
            </div>
          ) : isError ? (
            <div className="p-8 text-center text-red-500">{error.message}</div>
          ) : bills.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No e-way bills found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-6 py-3 font-semibold">E-Way Bill No</th>
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Party</th>
                    <th className="px-6 py-3 font-semibold">Vehicle No</th>
                    <th className="px-6 py-3 font-semibold">Valid Upto</th>
                    <th className="px-6 py-3 font-semibold">Status</th>
                    <th className="px-6 py-3 font-semibold text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {bills.map((bill) => (
                    <tr key={bill._id} className="hover:bg-slate-50">
                      <td className="px-6 py-3 font-medium text-slate-800">
                        {bill.ewayBillNo}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {formatDate(bill.generatedDate)}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {bill.partyLedger || "—"}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {bill.vehicleNo || "—"}
                      </td>
                      <td className="px-6 py-3 text-slate-600">
                        {formatDate(bill.validUpto)}
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusStyles[bill.status] ||
                            "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {statusLabels[bill.status] || bill.status || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <button
                          onClick={() => setSelectedBill(bill)}
                          className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100"
                        >
                          <Eye size={14} /> Manage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-2">
          <span className="text-sm text-slate-500">
            Showing {bills.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {Math.min(page * limit, total)} of {total} records
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="h-8 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isGenerateOpen && (
        <GenerateEwayBillModal
          companyId={companyId}
          onClose={() => setIsGenerateOpen(false)}
          onSuccess={(message) => notify(message)}
          onError={(message) => notify(message, true)}
        />
      )}
      {selectedBill && (
        <ManageEwayBillModal
          companyId={companyId}
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
          onSuccess={(message) => notify(message)}
          onError={(message) => notify(message, true)}
        />
      )}
    </div>
  );
}

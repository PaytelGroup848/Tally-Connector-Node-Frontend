import React, { useEffect, useState } from "react";
import {
  FileText,
  Eye,
  Download,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Receipt,
  RefreshCw,
} from "lucide-react";
import { fetchInvoices, downloadInvoicePdf } from "../services/billingApi";
import InvoiceViewModal from "../components/InvoiceViewModal";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(n) || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

function DownloadInvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Modal
  const [viewInvoice, setViewInvoice] = useState(null);

  const loadInvoices = async (p = page) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchInvoices({ page: p, limit });
      setInvoices(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      setError(err.message || "Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleDownload = async (invoice) => {
    try {
      setDownloadingId(invoice._id);
      await downloadInvoicePdf(invoice._id, invoice.invoiceNumber);
    } catch (err) {
      alert(err.message || "Download failed");
    } finally {
      setDownloadingId(null);
    }
  };

  const totalPages = Math.max(Math.ceil(total / limit), 1);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-lg">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">
                Invoices
              </h1>
              <p className="text-sm text-slate-500">
                View and download your billing invoices
              </p>
            </div>
          </div>
          <button
            onClick={() => loadInvoices(page)}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-60 transition self-start"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Error state */}
        {error && (
          <div className="mb-4 flex items-start gap-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <div className="text-sm">{error}</div>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="animate-pulse">
              <div className="h-12 bg-slate-100 border-b border-slate-200" />
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 border-b border-slate-100 flex items-center px-4 gap-4"
                >
                  <div className="h-3 bg-slate-200 rounded w-32" />
                  <div className="h-3 bg-slate-200 rounded w-24" />
                  <div className="h-3 bg-slate-200 rounded w-16" />
                  <div className="h-3 bg-slate-200 rounded w-20 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && invoices.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <div className="inline-flex p-4 bg-slate-100 rounded-full mb-3">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">
              No invoices yet
            </h3>
            <p className="text-sm text-slate-500">
              Your invoices will appear here once you make a purchase.
            </p>
          </div>
        )}

        {/* Invoice table */}
        {!loading && invoices.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr className="text-left text-slate-600">
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                      Invoice #
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                      Subtotal
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                      GST
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                      Total
                    </th>
                    <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wide text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr
                      key={inv._id}
                      className="hover:bg-slate-50/70 transition"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-slate-400 flex-shrink-0" />
                          <span className="font-medium text-slate-800">
                            {inv.invoiceNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">
                        {fmtDate(inv.invoiceDate)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inv.status} />
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {fmtINR(inv.subtotal)}
                      </td>
                      <td className="px-4 py-3 text-right text-slate-700">
                        {fmtINR(inv.gstAmount)}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-900">
                        {fmtINR(inv.totalAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setViewInvoice(inv)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 hover:border-slate-400 transition"
                            title="View invoice"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(inv)}
                            disabled={downloadingId === inv._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-wait transition"
                            title="Download PDF"
                          >
                            {downloadingId === inv._id ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                Downloading
                              </>
                            ) : (
                              <>
                                <Download className="w-3.5 h-3.5" />
                                PDF
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-3">
              {invoices.map((inv) => (
                <div
                  key={inv._id}
                  className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="font-semibold text-slate-800 text-sm">
                        {inv.invoiceNumber}
                      </span>
                    </div>
                    <StatusBadge status={inv.status} />
                  </div>
                  <div className="text-xs text-slate-500 mb-3">
                    {fmtDate(inv.invoiceDate)}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div>
                      <div className="text-slate-500">Subtotal</div>
                      <div className="font-medium text-slate-700">
                        {fmtINR(inv.subtotal)}
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-500">GST</div>
                      <div className="font-medium text-slate-700">
                        {fmtINR(inv.gstAmount)}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-500">Total</div>
                      <div className="font-bold text-slate-900">
                        {fmtINR(inv.totalAmount)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewInvoice(inv)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleDownload(inv)}
                      disabled={downloadingId === inv._id}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-60 transition"
                    >
                      {downloadingId === inv._id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          Downloading
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-slate-500">
                  Page <span className="font-medium">{page}</span> of{" "}
                  <span className="font-medium">{totalPages}</span> · {total}{" "}
                  invoice{total !== 1 ? "s" : ""}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(p - 1, 1))}
                    disabled={page === 1 || loading}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                    disabled={page === totalPages || loading}
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Modal */}
      <InvoiceViewModal
        invoice={viewInvoice}
        onClose={() => setViewInvoice(null)}
        onDownload={handleDownload}
        isDownloading={downloadingId === viewInvoice?._id}
      />
    </div>
  );
}

// ------- Small components -------
const StatusBadge = ({ status }) => {
  const isPaid = status === "PAID";
  const isCancelled = status === "CANCELLED";

  const cls = isPaid
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : isCancelled
      ? "bg-red-50 text-red-700 border-red-200"
      : "bg-slate-50 text-slate-700 border-slate-200";

  const Icon = isPaid ? CheckCircle2 : isCancelled ? XCircle : AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full border ${cls}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

export default DownloadInvoicePage;

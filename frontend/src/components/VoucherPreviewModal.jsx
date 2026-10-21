import { useEffect, useState } from "react";
import { X, Download, Loader2 } from "lucide-react";
import useAuthStore from "../store/authStore";
import {
  fetchVoucherHtml,
  downloadVoucherPdfFile,
} from "../services/voucherPreviewApi";

export default function VoucherPreviewModal({
  open,
  onClose,
  companyId,
  voucherId,
  fileName = "voucher",
}) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);


  useEffect(() => {
    if (!open || !companyId || !voucherId || !accessToken) return;

    let active = true;
    setHtml("");
    setError("");
    setLoading(true);

    fetchVoucherHtml(accessToken, companyId, voucherId)
      .then((result) => {
        if (active) setHtml(result);
      })
      .catch((err) => {
        if (active) setError(err?.message || "Unable to load preview.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [open, companyId, voucherId, accessToken]);


  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc key se close
  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const handleDownload = async () => {
    if (!accessToken || !companyId || !voucherId) return;
    setDownloading(true);
    try {
      await downloadVoucherPdfFile(accessToken, companyId, voucherId, fileName);
    } catch (err) {
      setError(err?.message || "Download failed.");
    } finally {
      setDownloading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex h-[92vh] w-full max-w-[1000px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Invoice Preview
            </h3>
            <p className="text-[11px] text-slate-500">Review before download</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={downloading || loading || !!error}
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Download size={14} />
              )}
              {downloading ? "Downloading..." : "Download PDF"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
              aria-label="Close preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="relative flex-1 overflow-hidden bg-slate-100">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-emerald-600" />
                <p className="text-xs text-slate-500">Loading preview...</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div className="absolute inset-0 flex items-center justify-center p-6">
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            </div>
          )}

          {!loading && !error && html && (
            <iframe
              title="Invoice Preview"
              srcDoc={html}
              className="h-full w-full border-0"
            />
          )}
        </div>
      </div>
    </div>
  );
}

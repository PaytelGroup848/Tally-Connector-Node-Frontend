import { useCallback, useEffect, useRef, useState } from "react";
import {
  X,
  Download,
  Loader2,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileText,
  AlertCircle,
  RefreshCw,
  Check,
  Eye,
} from "lucide-react";
import useAuthStore from "../store/authStore";
import { lockBodyScroll } from "../utils/bodyScrollLock";
import {
  fetchVoucherHtml,
  downloadVoucherPdfFile,
} from "../services/voucherPreviewApi";

const PAPER_WIDTH = 794;
const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2;
const ZOOM_STEP = 0.1;

const PAD_LEFT = 20;
const PAD_RIGHT = 20;
const SHEET_WIDTH = PAPER_WIDTH + PAD_LEFT + PAD_RIGHT;

function IconButton({ label, onClick, disabled, children, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent ${className}`}
    >
      {children}
    </button>
  );
}

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
  const [downloadError, setDownloadError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  const [zoom, setZoom] = useState(null);
  const [areaWidth, setAreaWidth] = useState(0);
  const [docHeight, setDocHeight] = useState(1123);

  const [previewCopy, setPreviewCopy] = useState("ORIGINAL");
  const [selectedCopies, setSelectedCopies] = useState(["ORIGINAL"]);

  const areaRef = useRef(null);
  const iframeRef = useRef(null);
  const closeBtnRef = useRef(null);

  const handleCopyToggle = (type) => {
    setSelectedCopies((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  // 👇 Yahan handleDownloadAll ko fix kiya gaya hai
  const handleDownloadAll = async () => {
    if (selectedCopies.length === 0)
      return alert("Select at least one copy type");

    setDownloading(true);
    setDownloadError("");

    try {
      for (const copy of selectedCopies) {
        // Ek ke baad ek download hoga
        await downloadVoucherPdfFile(
          accessToken,
          companyId,
          voucherId,
          fileName,
          copy,
        );
        // Browser ko thoda time do taaki next download trigger ho sake
        await new Promise((resolve) => setTimeout(resolve, 800));
      }
    } catch (err) {
      setDownloadError(err?.message || "Download failed. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    if (!open || !companyId || !voucherId || !accessToken) return;

    let active = true;
    setHtml("");
    setError("");
    setDownloadError("");
    setZoom(null);
    setLoading(true);

    fetchVoucherHtml(accessToken, companyId, voucherId, previewCopy)
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
  }, [open, companyId, voucherId, accessToken, reloadKey, previewCopy]); // 👈 previewCopy dependency mein add kiya

  useEffect(() => {
    if (!open) return;
    return lockBodyScroll();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) closeBtnRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open || !areaRef.current) return;
    const el = areaRef.current;
    const update = () => setAreaWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, loading, error, html]);

  const fitZoom = areaWidth
    ? Math.min(1, Math.max(MIN_ZOOM, (areaWidth - 32) / SHEET_WIDTH))
    : 1;
  const currentZoom = zoom ?? fitZoom;

  const zoomBy = (delta) => {
    const next = Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, Math.round((currentZoom + delta) * 10) / 10),
    );
    setZoom(next);
  };

  const measureIframe = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;
      const h = Math.max(
        doc.documentElement?.scrollHeight || 0,
        doc.body?.scrollHeight || 0,
      );
      if (h) setDocHeight(h);
    } catch {}
  }, []);

  const handleIframeLoad = () => {
    measureIframe();
    setTimeout(measureIframe, 400);
  };

  const handlePrint = () => {
    try {
      iframeRef.current?.contentWindow?.focus();
      iframeRef.current?.contentWindow?.print();
    } catch {
      setDownloadError("Unable to open the print dialog.");
    }
  };

  if (!open) return null;

  const ready = !loading && !error && !!html;
  const zoomPct = Math.round(currentZoom * 100);
  const COPY_OPTIONS = [
    { value: "ORIGINAL", label: "Original" },
    { value: "DUPLICATE", label: "Duplicate" },
    { value: "CHALLAN", label: "Challan" },
  ];

  return (
    <div
      className="fixed inset-0 z-[999999] flex items-stretch justify-center bg-slate-900/60 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="voucher-preview-title"
        className="relative flex h-full w-full max-w-[1100px] flex-col overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 sm:h-[92vh] sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ------------------------------ Header ----------------------------- */}
        <header className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
              <FileText size={20} />
            </div>
            <div className="min-w-0">
              <h3
                id="voucher-preview-title"
                className="truncate text-sm font-semibold text-slate-900 sm:text-base"
              >
                Invoice preview
              </h3>
              <p className="truncate text-xs text-slate-500">
                {fileName}.pdf · Check the details before downloading
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="hidden items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 sm:flex">
              <IconButton
                label="Zoom out"
                onClick={() => zoomBy(-ZOOM_STEP)}
                disabled={!ready || currentZoom <= MIN_ZOOM}
              >
                <ZoomOut size={16} />
              </IconButton>
              <span className="w-12 select-none text-center text-xs font-medium tabular-nums text-slate-700">
                {zoomPct}%
              </span>
              <IconButton
                label="Zoom in"
                onClick={() => zoomBy(ZOOM_STEP)}
                disabled={!ready || currentZoom >= MAX_ZOOM}
              >
                <ZoomIn size={16} />
              </IconButton>
              <IconButton
                label="Fit to width"
                onClick={() => setZoom(null)}
                disabled={!ready || zoom === null}
              >
                <Maximize2 size={15} />
              </IconButton>
            </div>

            <IconButton
              label="Print"
              onClick={handlePrint}
              disabled={!ready}
              className="hidden border border-slate-200 sm:inline-flex"
            >
              <Printer size={16} />
            </IconButton>

            <button
              type="button"
              onClick={handleDownloadAll}
              disabled={
                downloading || loading || !!error || selectedCopies.length === 0
              }
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {downloading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              <span>{downloading ? "Downloading…" : "Download PDF"}</span>
            </button>

            <span className="mx-0.5 hidden h-6 w-px bg-slate-200 sm:block" />

            <IconButton
              label="Close preview"
              onClick={onClose}
              className="[&]:hover:bg-red-50 [&]:hover:text-red-600"
            >
              <span ref={closeBtnRef} tabIndex={-1} className="contents">
                <X size={18} />
              </span>
            </IconButton>
          </div>
        </header>

        {/* 👇 Naya Sub-Header for Copy Selection */}
        {/* Copy selection bar */}
        <div className="flex flex-col gap-3 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-3 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: choose which copies to download */}
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">
                Copies to download
              </span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                {selectedCopies.length} selected
              </span>
              <button
                type="button"
                onClick={() =>
                  setSelectedCopies(
                    selectedCopies.length === COPY_OPTIONS.length
                      ? []
                      : COPY_OPTIONS.map((c) => c.value),
                  )
                }
                className="ml-1 text-xs font-medium text-emerald-700 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded"
              >
                {selectedCopies.length === COPY_OPTIONS.length
                  ? "Clear all"
                  : "Select all"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {COPY_OPTIONS.map(({ value, label }) => {
                const checked = selectedCopies.includes(value);
                return (
                  <label
                    key={value}
                    className={`group relative flex cursor-pointer select-none items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-1 ${
                      checked
                        ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleCopyToggle(value)}
                      className="sr-only"
                    />
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-md border transition ${
                        checked
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white text-transparent group-hover:border-slate-400"
                      }`}
                    >
                      <Check size={11} strokeWidth={3.5} />
                    </span>
                    {label}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Right: choose which copy to preview (custom segmented control) */}
          <div className="lg:text-right">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-700 lg:justify-end">
              <Eye size={13} className="text-slate-500" />
              Preview
            </div>

            <div
              role="tablist"
              aria-label="Preview copy"
              className="inline-flex w-full rounded-xl bg-slate-200/70 p-1 lg:w-auto"
            >
              {COPY_OPTIONS.map(({ value, label }) => {
                const active = previewCopy === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPreviewCopy(value)}
                    className={`flex-1 rounded-lg px-3.5 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:flex-none ${
                      active
                        ? "bg-white text-emerald-700 shadow-sm ring-1 ring-black/5"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {downloadError && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700 sm:px-5"
          >
            <span className="flex items-center gap-2">
              <AlertCircle size={14} className="shrink-0" />
              {downloadError}
            </span>
            <button
              type="button"
              onClick={() => setDownloadError("")}
              className="rounded p-1 hover:bg-red-100"
              aria-label="Dismiss error"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ------------------------------- Body ------------------------------ */}
        <div
          ref={areaRef}
          className="relative flex-1 overflow-auto bg-slate-200/70 [background-image:radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px]"
        >
          {/* Loading skeleton */}
          {loading && (
            <div className="flex min-h-full items-start justify-center p-4 sm:p-8">
              <div
                className="w-full max-w-[794px] animate-pulse rounded-md bg-white p-8 shadow-lg ring-1 ring-black/5 sm:p-12"
                aria-busy="true"
              >
                <div className="mb-8 flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="h-5 w-40 rounded bg-slate-200" />
                    <div className="h-3 w-56 rounded bg-slate-100" />
                  </div>
                  <div className="h-12 w-12 rounded bg-slate-200" />
                </div>
                <div className="mb-8 grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-200" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-3/4 rounded bg-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-200" />
                    <div className="h-3 w-full rounded bg-slate-100" />
                    <div className="h-3 w-2/3 rounded bg-slate-100" />
                  </div>
                </div>
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-8 w-full rounded bg-slate-100" />
                  ))}
                </div>
                <div className="mt-8 ml-auto h-10 w-48 rounded bg-slate-200" />
              </div>
              <div className="pointer-events-none absolute inset-x-0 top-6 flex justify-center">
                <div className="flex items-center gap-2 rounded-full bg-slate-900/85 px-3.5 py-1.5 text-xs font-medium text-white shadow-lg">
                  <Loader2 size={14} className="animate-spin" />
                  Loading preview…
                </div>
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="flex min-h-full items-center justify-center p-6">
              <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertCircle size={24} />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Couldn’t load the preview
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {error}
                </p>
                <div className="mt-5 flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-3.5 text-sm font-semibold text-white transition hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-2"
                  >
                    <RefreshCw size={14} />
                    Try again
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex h-9 items-center rounded-lg border border-slate-200 px-3.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Paper */}
          {ready && (
            <div className="flex min-h-full justify-center px-4 py-6 sm:py-8">
              <div
                className="shrink-0 overflow-hidden rounded-sm pt-5 bg-white shadow-[0_10px_40px_-10px_rgba(15,23,42,0.35)] ring-1 ring-black/5"
                style={{
                  width: SHEET_WIDTH * currentZoom,
                  height: docHeight * currentZoom,
                }}
              >
                <div
                  className="bg-white"
                  style={{
                    width: SHEET_WIDTH,
                    height: docHeight,
                    paddingLeft: PAD_LEFT,
                    paddingRight: PAD_RIGHT,
                    boxSizing: "border-box",
                    transform: `scale(${currentZoom})`,
                    transformOrigin: "top left",
                  }}
                >
                  <iframe
                    ref={iframeRef}
                    title="Invoice Preview"
                    srcDoc={html}
                    sandbox="allow-same-origin allow-modals"
                    onLoad={handleIframeLoad}
                    scrolling="no"
                    className="block border-0 bg-white"
                    style={{
                      width: PAPER_WIDTH,
                      height: docHeight,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

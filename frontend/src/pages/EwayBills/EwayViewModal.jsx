import { useCallback, useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Download,
  FileText,
  Loader2,
  Printer,
  X,
} from "lucide-react";

/* Skeleton shown while the bill HTML is loading */
function PaperSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-[860px] animate-pulse space-y-5 rounded bg-white p-6 shadow-md ring-1 ring-slate-200 sm:p-8"
      aria-hidden="true"
    >
      <div className="mx-auto h-5 w-40 rounded bg-slate-200" />
      <div className="grid grid-cols-4 gap-4 rounded border border-slate-100 p-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-2.5 w-16 rounded bg-slate-200" />
            <div className="h-3.5 w-24 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="flex gap-4 rounded border border-slate-100 p-4">
        <div className="h-20 w-20 shrink-0 rounded bg-slate-200" />
        <div className="flex-1 space-y-2.5 pt-1">
          <div className="h-3 w-full rounded bg-slate-200" />
          <div className="h-3 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-200" />
        </div>
      </div>
      <div className="space-y-3 rounded border border-slate-100 p-4">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-6">
            <div className="h-3 w-1/2 rounded bg-slate-200" />
            <div className="h-3 w-1/2 rounded bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EwayViewModal({
  html,
  loading,
  error,
  ewayBillNo,
  onClose,
  onDownload,
  isDownloading,
}) {
  const iframeRef = useRef(null);
  const observerRef = useRef(null);
  const [frameHeight, setFrameHeight] = useState(600);

  const isReady = !loading && !error && Boolean(html);

  // Esc closes the modal
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  // Lock background scroll while the modal is open
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  // Size the iframe to its content so only the modal body scrolls (no double scrollbars)
  const syncHeight = useCallback(() => {
    const doc = iframeRef.current?.contentDocument;
    const body = doc?.body;
    if (!doc || !body) return;

    const styles = doc.defaultView.getComputedStyle(body);
    const margins =
      (parseFloat(styles.marginTop) || 0) +
      (parseFloat(styles.marginBottom) || 0);

    setFrameHeight(Math.max(Math.ceil(body.offsetHeight + margins), 400));
  }, []);

  const handleFrameLoad = useCallback(() => {
    syncHeight();

    observerRef.current?.disconnect();
    const body = iframeRef.current?.contentDocument?.body;
    if (body && typeof ResizeObserver !== "undefined") {
      observerRef.current = new ResizeObserver(syncHeight);
      observerRef.current.observe(body);
    }
  }, [syncHeight]);

  useEffect(() => () => observerRef.current?.disconnect(), []);

  const handlePrint = () => {
    const frame = iframeRef.current?.contentWindow;
    if (!frame) return;
    frame.focus();
    frame.print();
  };

  return (
    <div
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/60 p-2 backdrop-blur-sm sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`E-Way Bill ${ewayBillNo || ""}`}
        className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-b-4 border-[#009966] bg-[#143e73] px-4 py-3 text-white sm:px-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white/10">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <h2 className="truncate text-base font-semibold sm:text-lg">
                E-Way Bill
              </h2>
              <p className="truncate text-xs text-blue-100">
                EWB No. {ewayBillNo || "—"}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              disabled={!isReady}
              aria-label="Print"
              className="inline-flex items-center gap-1.5 rounded border border-white/30 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Printer className="h-4 w-4" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              type="button"
              onClick={onDownload}
              disabled={isDownloading || !isReady}
              aria-label="Download"
              className="inline-flex items-center gap-1.5 rounded bg-[#009966] px-3.5 py-2 text-sm font-bold text-white transition hover:bg-[#d97a1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009966] focus-visible:ring-offset-2 focus-visible:ring-offset-[#143e73] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDownloading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">
                {isDownloading ? "Downloading..." : "Download"}
              </span>
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded p-2 text-blue-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body: grey desk with a paper sheet */}
        <div className="min-h-[60vh] flex-1 overflow-y-auto bg-[#e9eff6] px-3 py-5 sm:px-8 sm:py-8">
          {loading ? (
            <>
              <div className="mb-4 flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading E-Way Bill...
              </div>
              <PaperSkeleton />
            </>
          ) : error ? (
            <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-lg border border-red-200 bg-white px-6 py-8 text-center shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-slate-800">
                Unable to load E-Way Bill
              </h3>
              <p className="mt-1 text-sm text-slate-600">{error}</p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="mx-auto w-full max-w-[860px] rounded bg-white p-4 shadow-md ring-1 ring-slate-200 sm:p-8">
              <iframe
                ref={iframeRef}
                title="E-Way Bill"
                srcDoc={html || ""}
                onLoad={handleFrameLoad}
                scrolling="no"
                style={{ height: frameHeight }}
                className="block w-full border-0 bg-white"
              />
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-2.5 text-xs text-slate-500 sm:px-5">
          <span></span>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-300 bg-white px-4 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default EwayViewModal;

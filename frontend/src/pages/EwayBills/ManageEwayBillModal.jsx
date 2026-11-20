import { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Ban,
  Building2,
  Check,
  ClipboardList,
  Copy,
  Download,
  Eye,
  FileText,
  History,
  Loader2,
  MapPin,
  Package,
  Pencil,
  QrCode,
  Receipt,
  Truck,
  X,
} from "lucide-react";
import {
  useCancelEwayBill,
  useEwayBillDetails,
  useEwayBillQR,
  useUpdateVehicle,
} from "../../hooks/useEwayBill";
import {
  downloadEwayBillPdfFile,
  fetchEwayBillHtml,
} from "../../services/ewayBillApi";
import useAuthStore from "../../store/authStore";
import { lockBodyScroll } from "../../utils/bodyScrollLock";
import EwayViewModal from "./EwayViewModal";

/* ---------- styles ---------- */
const inputClass =
  "mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1b5fa8] focus:ring-2 focus:ring-[#1b5fa8]/20";
const labelClass = "text-xs font-semibold text-slate-700";

const CANCEL_REASONS = [
  ["1", "Duplicate"],
  ["2", "Order Cancelled"],
  ["3", "Data Entry Mistake"],
  ["4", "Others"],
];

/* ---------- label maps (NIC codes -> readable text) ---------- */
const SUPPLY_TYPES = { O: "Outward", I: "Inward" };

const SUB_SUPPLY_TYPES = {
  1: "Supply",
  2: "Import",
  3: "Export",
  4: "Job Work",
  5: "For Own Use",
  6: "Job Work Returns",
  7: "Sales Return",
  8: "Others",
  9: "SKD/CKD",
  10: "Line Sales",
  11: "Recipient Not Known",
  12: "Exhibition or Fairs",
};

const DOC_TYPES = {
  INV: "Tax Invoice",
  BIL: "Bill of Supply",
  BOE: "Bill of Entry",
  CHL: "Delivery Challan",
  OTH: "Others",
};

const TRANSACTION_TYPES = {
  1: "Regular",
  2: "Bill To - Ship To",
  3: "Bill From - Dispatch From",
  4: "Combination of 2 & 3",
};

const VEHICLE_TYPES = { R: "Regular", O: "Over Dimensional Cargo" };

const TRANS_MODES = {
  1: "Road",
  2: "Rail",
  3: "Air",
  4: "Ship",
  5: "In Transit",
};

/* ---------- helpers ---------- */
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const pad2 = (value) => String(value).padStart(2, "0");
const digitsOnly = (value) => String(value).replace(/\D/g, "");

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// NIC date/time: "16/11/2026" or "16/11/2026 02:41:00 PM"
const formatNicDateTime = (value) => {
  if (!value) return "—";

  const match =
    /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?)?$/i.exec(
      String(value).trim(),
    );

  if (!match) return formatDate(value);

  const [, dd, mm, yyyy, hh, min, , mer] = match;
  const datePart = `${dd} ${MONTHS[Number(mm) - 1] || mm} ${yyyy}`;
  if (!hh) return datePart;

  let hour = Number(hh);
  if (mer) {
    const upper = mer.toUpperCase();
    if (upper === "PM" && hour < 12) hour += 12;
    if (upper === "AM" && hour === 12) hour = 0;
  }

  return `${datePart}, ${pad2(hour)}:${min}`;
};

const money = (value) => {
  if (value === undefined || value === null || value === "") return "—";
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `₹ ${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const labelOf = (map, value) => {
  if (value === undefined || value === null || value === "") return "";
  return map[value] ?? String(value);
};

const statusStyles = {
  ACT: "bg-green-100 text-green-800 ring-green-200",
  CANCELLED: "bg-red-100 text-red-800 ring-red-200",
  EXPIRED: "bg-amber-100 text-amber-800 ring-amber-200",
};

const statusLabels = {
  ACT: "Active",
  CANCELLED: "Cancelled",
  EXPIRED: "Expired",
};

/* ---------- small UI pieces ---------- */
function Detail({ label, value, className = "" }) {
  const empty = value === undefined || value === null || value === "";

  return (
    <div className={`min-w-0 ${className}`}>
      <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div
        className={`mt-0.5 break-words text-sm ${
          empty ? "text-slate-300" : "font-semibold text-slate-800"
        }`}
      >
        {empty ? "—" : value}
      </div>
    </div>
  );
}

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children}
    </div>
  );
}

function InfoSection({
  title,
  icon: Icon,
  badge,
  tone = "blue",
  children,
  className = "",
}) {
  return (
    <section
      className={`rounded-lg border border-slate-200 bg-white shadow-sm ${className}`}
    >
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-2.5">
        {Icon ? (
          <Icon
            size={15}
            className={tone === "orange" ? "text-[#f28c28]" : "text-[#1b5fa8]"}
          />
        ) : null}
        <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        {badge ? (
          <span
            className={`ml-1 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white ${
              tone === "orange" ? "bg-[#f28c28]" : "bg-[#143e73]"
            }`}
          >
            {badge}
          </span>
        ) : null}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function Tab({ active, onClick, icon: Icon, count, children }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-semibold transition focus:outline-none focus-visible:bg-slate-100 ${
        active
          ? "border-[#f28c28] text-[#143e73]"
          : "border-transparent text-slate-500 hover:text-slate-800"
      }`}
    >
      <Icon size={15} />
      {children}
      {typeof count === "number" && (
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            active ? "bg-[#143e73] text-white" : "bg-slate-200 text-slate-600"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function ManageEwayBillModal({
  companyId,
  bill,
  onClose,
  onSuccess,
  onError,
}) {
  const billId = bill?._id;
  const detailsQuery = useEwayBillDetails(companyId, billId);
  const qrQuery = useEwayBillQR(companyId, billId);
  const updateVehicleMutation = useUpdateVehicle(companyId);
  const cancelMutation = useCancelEwayBill(companyId);

  const [mode, setMode] = useState("view");
  const [tab, setTab] = useState("overview");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [viewHtml, setViewHtml] = useState("");
  const [viewError, setViewError] = useState("");
  const bodyRef = useRef(null);

  const accessToken = useAuthStore((s) => s.accessToken);

  const [vehicleForm, setVehicleForm] = useState({
    vehicleNo: "",
    fromPlace: "",
    fromState: "",
    reasonCode: "1",
    reasonRem: "Vehicle changed",
  });

  const [cancelForm, setCancelForm] = useState({
    reasonCode: "2",
    remark: "",
  });

  useEffect(() => lockBodyScroll(), []);

  const record = detailsQuery.data?.data || bill || {};
  // rawResponse flat (data object) ya nested { data: {...} } dono handle karo
  const nic = record.rawResponse?.data || record.rawResponse || {};
  const itemList = Array.isArray(nic.itemList) ? nic.itemList : [];
  const vehicleList = Array.isArray(nic.VehiclListDetails)
    ? nic.VehiclListDetails
    : Array.isArray(nic.vehicleList)
      ? nic.vehicleList
      : [];

  const isCancelled = record.status === "CANCELLED";
  const isBusy = updateVehicleMutation.isPending || cancelMutation.isPending;
  const ewbNo = nic.ewbNo || record.ewayBillNo;
  const itemsTaxableTotal = itemList.reduce(
    (sum, item) => sum + (Number(item.taxableAmount) || 0),
    0,
  );

  // Linked e-Invoice QR
  const qrResult = qrQuery.data?.data || null;
  const qrAvailable = qrQuery.data?.success === true && !!qrResult?.qrCode;

  // EWB ke saath generate hua e-Invoice (IRN) linked hai?
  const hasEinvoice =
    !!record.einvoice && record.einvoice.status !== "CANCELLED";

  // Esc: go back from an action view, otherwise close (blocked while busy)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape" || isBusy) return;
      if (mode !== "view") {
        setMode("view");
        setError("");
      } else {
        onClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mode, isBusy, onClose]);

  useEffect(() => {
    setVehicleForm((prev) => ({
      ...prev,
      vehicleNo: record.vehicleNo || prev.vehicleNo,
      fromPlace: nic.fromPlace || prev.fromPlace,
      fromState: nic.fromStateCode ?? prev.fromState,
    }));
  }, [record.vehicleNo, nic.fromPlace, nic.fromStateCode]);

  const showError = (message) => {
    setError(message);
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMode = (nextMode) => {
    setError("");
    setMode(nextMode);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const handleCopy = async () => {
    if (!ewbNo) return;
    try {
      await navigator.clipboard.writeText(String(ewbNo));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard not available */
    }
  };

  // E-Way Bill HTML fetch karke modal me dikhao (PDF preview)
  const handleViewPdf = async () => {
    setViewOpen(true);
    setViewHtml("");
    setViewError("");
    try {
      setIsPreviewing(true);
      const html = await fetchEwayBillHtml(accessToken, companyId, billId);
      setViewHtml(html);
    } catch (err) {
      setViewError(err?.message || "Failed to load E-Way Bill");
    } finally {
      setIsPreviewing(false);
    }
  };

  // E-Way Bill PDF download karo
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      await downloadEwayBillPdfFile(accessToken, companyId, billId, ewbNo);
    } catch (err) {
      onError?.(err?.message || "Failed to download E-Way Bill PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleUpdateVehicle = async (event) => {
    event.preventDefault();
    setError("");

    if (!vehicleForm.vehicleNo.trim()) {
      showError("Vehicle number is required.");
      return;
    }

    try {
      await updateVehicleMutation.mutateAsync({
        id: billId,
        payload: {
          vehicleNo: vehicleForm.vehicleNo.trim().toUpperCase(),
          fromPlace: vehicleForm.fromPlace,
          fromState: vehicleForm.fromState,
          reasonCode: vehicleForm.reasonCode,
          reasonRem: vehicleForm.reasonRem,
        },
      });

      onSuccess?.("Vehicle details updated successfully.");
      onClose();
    } catch (err) {
      const message = err?.message || "Failed to update vehicle details.";
      showError(message);
      onError?.(message);
    }
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    setError("");

    if (!cancelForm.remark.trim()) {
      showError("Cancellation remark is required.");
      return;
    }

    try {
      const result = await cancelMutation.mutateAsync({
        id: billId,
        reasonCode: cancelForm.reasonCode,
        remark: cancelForm.remark.trim(),
      });

      onSuccess?.(
        result?.message ||
          (hasEinvoice
            ? "E-Way Bill and E-Invoice cancelled successfully."
            : "E-Way Bill cancelled successfully."),
      );
      onClose();
    } catch (err) {
      const message = err?.message || "Failed to cancel E-Way Bill.";
      showError(message);
      onError?.(message);
    }
  };

  const isLoaded = !detailsQuery.isLoading && !detailsQuery.isError;

  return (
    <div className="fixed inset-x-0 bottom-0 top-0 z-[1000] flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="E-Way Bill details"
        className="flex h-full max-h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl sm:w-[90%]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b-4 border-[#009966] bg-[#143e73] px-5 py-3.5 text-white">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white/10">
              <FileText className="h-5 w-5" />
            </div>
            <div className="min-w-0 leading-tight">
              <h2 className="truncate text-base font-semibold sm:text-lg">
                {mode === "vehicle"
                  ? "Update Vehicle (Part-B)"
                  : mode === "cancel"
                    ? "Cancel E-Way Bill"
                    : "E-Way Bill Details"}
              </h2>
              <p className="truncate text-xs text-blue-100">
                EWB No. {ewbNo || "—"}
                {record.partyLedger ? ` • ${record.partyLedger}` : ""}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="rounded p-2 text-blue-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Loading / error */}
        {detailsQuery.isLoading && (
          <div className="flex flex-1 items-center justify-center gap-2 bg-[#eef3f8] text-sm text-slate-500">
            <Loader2 size={18} className="animate-spin" /> Loading details...
          </div>
        )}

        {detailsQuery.isError && (
          <div className="flex-1 bg-[#eef3f8] p-5">
            <div className="flex items-center gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} />
              {detailsQuery.error?.message ||
                "Unable to load E-Way Bill details."}
            </div>
          </div>
        )}

        {isLoaded && (
          <>
            {/* Summary strip (always visible) */}
            <div className="shrink-0 border-b border-slate-200 bg-white px-5 py-3">
              <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      E-Way Bill No
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span className="text-base font-bold tracking-wide text-[#143e73]">
                        {ewbNo || "—"}
                      </span>
                      {ewbNo && (
                        <button
                          type="button"
                          onClick={handleCopy}
                          aria-label="Copy E-Way Bill number"
                          className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-[#143e73] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40"
                        >
                          {copied ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </div>
                    <span
                      className={`mt-0.5 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                        statusStyles[record.status] ||
                        "bg-slate-100 text-slate-600 ring-slate-200"
                      }`}
                    >
                      {statusLabels[record.status] || record.status || "—"}
                    </span>
                  </div>

                  <Detail
                    label="Valid Upto"
                    value={formatNicDateTime(nic.validUpto || record.validUpto)}
                  />
                  <Detail
                    label="Vehicle No"
                    value={record.vehicleNo || vehicleList[0]?.vehicleNo}
                  />
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                    Total Invoice Value
                  </div>
                  <div className="text-xl font-bold text-[#143e73]">
                    {money(nic.totInvValue ?? nic.totalValue)}
                  </div>
                </div>
              </div>

              {isCancelled && (
                <div className="mt-3 flex items-start gap-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  <Ban size={14} className="mt-0.5 shrink-0" />
                  <span>
                    Cancelled on {formatDate(record.cancelledDate)}
                    {record.cancelReason
                      ? ` • Reason: ${record.cancelReason}`
                      : ""}
                    {record.cancelRemark ? ` • ${record.cancelRemark}` : ""}
                  </span>
                </div>
              )}
            </div>

            {/* Tabs (details view only) */}
            {mode === "view" && (
              <div
                role="tablist"
                className="flex shrink-0 gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3"
              >
                <Tab
                  active={tab === "overview"}
                  onClick={() => setTab("overview")}
                  icon={ClipboardList}
                >
                  Overview
                </Tab>
                <Tab
                  active={tab === "items"}
                  onClick={() => setTab("items")}
                  icon={Package}
                  count={itemList.length}
                >
                  Items
                </Tab>
                <Tab
                  active={tab === "history"}
                  onClick={() => setTab("history")}
                  icon={History}
                  count={vehicleList.length}
                >
                  Vehicle / Part-B History
                </Tab>
                <Tab
                  active={tab === "qr"}
                  onClick={() => setTab("qr")}
                  icon={QrCode}
                >
                  QR Code
                </Tab>
              </div>
            )}

            {/* Scrollable body */}
            <div
              ref={bodyRef}
              className="min-h-0 flex-1 space-y-4 overflow-y-auto bg-[#eef3f8] p-4 sm:p-5"
            >
              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2 rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* ---------------- OVERVIEW ---------------- */}
              {mode === "view" && tab === "overview" && (
                <>
                  <div className="grid gap-4 lg:grid-cols-2">
                    <InfoSection
                      title="From (Consignor)"
                      icon={Building2}
                      badge="From"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Detail label="GSTIN" value={nic.fromGstin} />
                        <Detail label="Trade Name" value={nic.fromTrdName} />
                        <Detail
                          label="Address"
                          value={[nic.fromAddr1, nic.fromAddr2]
                            .filter(Boolean)
                            .join(", ")}
                          className="col-span-2"
                        />
                        <Detail label="Place" value={nic.fromPlace} />
                        <Detail label="Pincode" value={nic.fromPincode} />
                        <Detail label="State Code" value={nic.fromStateCode} />
                      </div>
                    </InfoSection>

                    <InfoSection
                      title="To (Consignee)"
                      icon={MapPin}
                      badge="To"
                      tone="orange"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <Detail label="GSTIN" value={nic.toGstin} />
                        <Detail label="Trade Name" value={nic.toTrdName} />
                        <Detail
                          label="Address"
                          value={[nic.toAddr1, nic.toAddr2]
                            .filter(Boolean)
                            .join(", ")}
                          className="col-span-2"
                        />
                        <Detail label="Place" value={nic.toPlace} />
                        <Detail label="Pincode" value={nic.toPincode} />
                        <Detail label="State Code" value={nic.toStateCode} />
                      </div>
                    </InfoSection>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <InfoSection title="Document Details" icon={ClipboardList}>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Detail
                          label="Document Type"
                          value={labelOf(DOC_TYPES, nic.docType)}
                        />
                        <Detail label="Document No" value={nic.docNo} />
                        <Detail
                          label="Document Date"
                          value={formatNicDateTime(nic.docDate)}
                        />
                        <Detail
                          label="Supply Type"
                          value={labelOf(SUPPLY_TYPES, nic.supplyType)}
                        />
                        <Detail
                          label="Sub Supply Type"
                          value={labelOf(SUB_SUPPLY_TYPES, nic.subSupplyType)}
                        />
                        <Detail
                          label="Transaction Type"
                          value={labelOf(
                            TRANSACTION_TYPES,
                            nic.transactionType,
                          )}
                        />
                      </div>
                    </InfoSection>

                    <InfoSection title="Transport & Transporter" icon={Truck}>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Detail
                          label="Transporter ID"
                          value={nic.transporterId}
                        />
                        <Detail
                          label="Transporter Name"
                          value={nic.transporterName}
                          className="sm:col-span-2"
                        />
                        <Detail
                          label="Vehicle No"
                          value={record.vehicleNo || vehicleList[0]?.vehicleNo}
                        />
                        <Detail
                          label="Vehicle Type"
                          value={labelOf(VEHICLE_TYPES, nic.vehicleType)}
                        />
                        <Detail
                          label="Actual Distance"
                          value={
                            nic.actualDist === undefined ||
                            nic.actualDist === null
                              ? ""
                              : `${nic.actualDist} km`
                          }
                        />
                        <Detail
                          label="Act. From State Code"
                          value={nic.actFromStateCode}
                        />
                        <Detail
                          label="Act. To State Code"
                          value={nic.actToStateCode}
                        />
                      </div>
                    </InfoSection>
                  </div>

                  <InfoSection title="Value Summary" icon={Receipt}>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-8">
                      {[
                        ["Taxable Value", nic.totalValue],
                        ["IGST", nic.igstValue],
                        ["CGST", nic.cgstValue],
                        ["SGST", nic.sgstValue],
                        ["Cess", nic.cessValue],
                        ["Cess Non-Advol", nic.cessNonAdvolValue],
                        ["Other Value", nic.otherValue],
                      ].map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded border border-slate-200 bg-slate-50 px-3 py-2"
                        >
                          <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                            {label}
                          </div>
                          <div className="mt-0.5 text-sm font-semibold text-slate-800">
                            {money(value)}
                          </div>
                        </div>
                      ))}
                      <div className="rounded border border-[#143e73] bg-[#143e73] px-3 py-2 text-white">
                        <div className="text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                          Invoice Value
                        </div>
                        <div className="mt-0.5 text-sm font-bold">
                          {money(nic.totInvValue)}
                        </div>
                      </div>
                    </div>
                  </InfoSection>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <InfoSection title="Bill Summary" icon={FileText}>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <Detail
                          label="EWB Date"
                          value={formatNicDateTime(nic.ewayBillDate)}
                        />
                        <Detail
                          label="Generated On"
                          value={formatDate(record.generatedDate)}
                        />
                        <Detail
                          label="Validity (Days)"
                          value={nic.noValidDays}
                        />
                        <Detail
                          label="Extended Times"
                          value={nic.extendedTimes}
                        />
                        <Detail label="Generation Mode" value={nic.genMode} />
                        <Detail
                          label="Reject Status"
                          value={nic.rejectStatus}
                        />
                        <Detail label="User GSTIN" value={nic.userGstin} />
                        <Detail
                          label="Party Ledger"
                          value={record.partyLedger}
                          className="col-span-2"
                        />
                      </div>
                    </InfoSection>

                    <InfoSection title="System Info" icon={FileText}>
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        {/* <Detail
                          label="Tally Sync Status"
                          value={record.tallySyncStatus}
                        /> */}
                        <Detail
                          label="Created At"
                          value={formatDate(record.createdAt)}
                        />
                        <Detail
                          label="Updated At"
                          value={formatDate(record.updatedAt)}
                        />
                      </div>
                    </InfoSection>
                  </div>
                </>
              )}

              {/* ---------------- ITEMS ---------------- */}
              {mode === "view" && tab === "items" && (
                <InfoSection
                  title={`Item List${itemList.length ? ` (${itemList.length})` : ""}`}
                  icon={Package}
                >
                  {itemList.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-500">
                      No items found.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded border border-slate-200">
                      <table className="w-full min-w-[900px] text-left text-sm">
                        <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-600">
                          <tr>
                            <th className="w-10 px-3 py-2.5 font-semibold">
                              #
                            </th>
                            <th className="px-3 py-2.5 font-semibold">
                              Product
                            </th>
                            <th className="px-3 py-2.5 font-semibold">HSN</th>
                            <th className="px-3 py-2.5 text-right font-semibold">
                              Qty
                            </th>
                            <th className="px-3 py-2.5 font-semibold">Unit</th>
                            <th className="px-3 py-2.5 text-right font-semibold">
                              CGST %
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold">
                              SGST %
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold">
                              IGST %
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold">
                              Cess %
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold">
                              Taxable
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {itemList.map((item, index) => (
                            <tr
                              key={item.itemNo || index}
                              className="odd:bg-white even:bg-slate-50/60 hover:bg-[#eaf2fb]"
                            >
                              <td className="px-3 py-2.5 text-xs font-semibold text-slate-400">
                                {item.itemNo ?? index + 1}
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="font-medium text-slate-800">
                                  {item.productName || "—"}
                                </div>
                                {item.productDesc &&
                                  item.productDesc !== item.productName && (
                                    <div className="text-xs text-slate-400">
                                      {item.productDesc}
                                    </div>
                                  )}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">
                                {item.hsnCode || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-right text-slate-600">
                                {item.quantity ?? "—"}
                              </td>
                              <td className="px-3 py-2.5 text-slate-600">
                                {item.qtyUnit || "—"}
                              </td>
                              <td className="px-3 py-2.5 text-right text-slate-600">
                                {item.cgstRate ?? 0}
                              </td>
                              <td className="px-3 py-2.5 text-right text-slate-600">
                                {item.sgstRate ?? 0}
                              </td>
                              <td className="px-3 py-2.5 text-right text-slate-600">
                                {item.igstRate ?? 0}
                              </td>
                              <td className="px-3 py-2.5 text-right text-slate-600">
                                {item.cessRate ?? 0}
                              </td>
                              <td className="px-3 py-2.5 text-right font-semibold text-slate-800">
                                {money(item.taxableAmount)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="border-t-2 border-slate-200 bg-slate-100">
                          <tr>
                            <td
                              colSpan={9}
                              className="px-3 py-2.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-600"
                            >
                              Total Taxable
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold text-[#143e73]">
                              {money(itemsTaxableTotal)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </InfoSection>
              )}

              {/* ---------------- HISTORY ---------------- */}
              {mode === "view" && tab === "history" && (
                <InfoSection
                  title={`Vehicle / Part-B History${
                    vehicleList.length ? ` (${vehicleList.length})` : ""
                  }`}
                  icon={History}
                >
                  {vehicleList.length === 0 ? (
                    <p className="py-6 text-center text-sm text-slate-500">
                      No vehicle updates yet.
                    </p>
                  ) : (
                    <ol className="relative space-y-4 border-l-2 border-slate-200 pl-6">
                      {vehicleList.map((vehicle, index) => (
                        <li key={index} className="relative">
                          <span className="absolute -left-[33px] top-3 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-[#1b5fa8] ring-2 ring-[#1b5fa8]/30" />
                          <div className="rounded border border-slate-200 bg-white p-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <Truck size={15} className="text-[#1b5fa8]" />
                                <span className="font-semibold text-slate-800">
                                  {vehicle.vehicleNo || "—"}
                                </span>
                                <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
                                  {vehicle.updMode || "—"}
                                </span>
                              </div>
                              <span className="text-xs text-slate-500">
                                {formatNicDateTime(vehicle.enteredDate)}
                              </span>
                            </div>
                            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                              <Detail
                                label="From Place"
                                value={vehicle.fromPlace}
                              />
                              <Detail
                                label="From State"
                                value={vehicle.fromState}
                              />
                              <Detail
                                label="Transport Mode"
                                value={labelOf(TRANS_MODES, vehicle.transMode)}
                              />
                              <Detail
                                label="Trip Sheet No"
                                value={vehicle.tripshtNo}
                              />
                              <Detail
                                label="Trans Doc No"
                                value={vehicle.transDocNo}
                              />
                              <Detail
                                label="Trans Doc Date"
                                value={
                                  vehicle.transDocDate
                                    ? formatNicDateTime(vehicle.transDocDate)
                                    : ""
                                }
                              />
                              <Detail
                                label="Group No"
                                value={vehicle.groupNo}
                              />
                              <Detail
                                label="User GSTIN"
                                value={vehicle.userGSTINTransin}
                              />
                            </div>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </InfoSection>
              )}

              {/* ---------------- QR CODE ---------------- */}
              {mode === "view" && tab === "qr" && (
                <InfoSection title="e-Invoice QR Code" icon={QrCode}>
                  {qrQuery.isLoading ? (
                    <div className="flex items-center justify-center gap-2 py-10 text-sm text-slate-500">
                      <Loader2 size={18} className="animate-spin" /> Fetching QR
                      code...
                    </div>
                  ) : qrAvailable ? (
                    <div className="flex flex-col items-center gap-5">
                      <img
                        src={qrResult.qrCode}
                        alt="e-Invoice QR Code"
                        className="h-64 w-64 rounded border border-slate-200 bg-white p-2"
                      />
                      <div className="grid w-full max-w-xl grid-cols-1 gap-3">
                        <Detail label="IRN" value={qrResult.irn} />
                        <Detail
                          label="Acknowledgement No"
                          value={qrResult.ackNo}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-10 text-center text-sm text-slate-500">
                      <QrCode size={30} className="text-slate-300" />
                      <span>
                        {qrQuery.isError
                          ? qrQuery.error?.message || "Unable to fetch QR code."
                          : qrQuery.data?.message ||
                            "No e-invoice linked to this E-Way Bill"}
                      </span>
                    </div>
                  )}
                </InfoSection>
              )}

              {/* ---------------- UPDATE VEHICLE ---------------- */}
              {mode === "vehicle" && (
                <form
                  id="vehicle-form"
                  onSubmit={handleUpdateVehicle}
                  className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white shadow-sm"
                >
                  <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
                    <Truck size={16} className="text-[#1b5fa8]" />
                    <h3 className="text-sm font-semibold text-slate-800">
                      Enter new vehicle (Part-B) details
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
                    <Field label="Vehicle No" required>
                      <input
                        value={vehicleForm.vehicleNo}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            vehicleNo: e.target.value
                              .toUpperCase()
                              .replace(/[\s-]/g, ""),
                          })
                        }
                        placeholder="HR55AB1234"
                        autoFocus
                        className={inputClass}
                      />
                    </Field>
                    <Field label="From Place">
                      <input
                        value={vehicleForm.fromPlace}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            fromPlace: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>
                    <Field label="From State Code">
                      <input
                        value={vehicleForm.fromState}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            fromState: digitsOnly(e.target.value).slice(0, 2),
                          })
                        }
                        inputMode="numeric"
                        maxLength={2}
                        placeholder="07"
                        className={inputClass}
                      />
                    </Field>
                    <Field label="Reason">
                      <select
                        value={vehicleForm.reasonCode}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            reasonCode: e.target.value,
                          })
                        }
                        className={inputClass}
                      >
                        <option value="1">Due to Break Down</option>
                        <option value="2">Due to Transhipment</option>
                        <option value="3">Others</option>
                        <option value="4">First Time</option>
                      </select>
                    </Field>
                    <Field label="Remark" className="sm:col-span-2">
                      <input
                        value={vehicleForm.reasonRem}
                        onChange={(e) =>
                          setVehicleForm({
                            ...vehicleForm,
                            reasonRem: e.target.value,
                          })
                        }
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </form>
              )}

              {/* ---------------- CANCEL ---------------- */}
              {mode === "cancel" && (
                <form
                  id="cancel-form"
                  onSubmit={handleCancel}
                  className="mx-auto max-w-3xl overflow-hidden rounded-lg border border-red-200 bg-white shadow-sm"
                >
                  <div className="flex items-start gap-3 border-b border-red-100 bg-red-50 px-4 py-3">
                    <AlertTriangle
                      size={18}
                      className="mt-0.5 shrink-0 text-red-600"
                    />
                    <div className="text-sm text-red-800">
                      <div className="font-semibold">
                        This action cannot be undone.
                      </div>
                      <div className="mt-0.5 text-xs text-red-700">
                        An E-Way Bill can be cancelled only within 24 hours of
                        generation, and only if it has not been verified by an
                        officer or the recipient.
                      </div>
                    </div>
                  </div>

                  {hasEinvoice && (
                    <div className="flex items-start gap-3 border-b border-blue-100 bg-[#eaf2fb] px-4 py-3">
                      <Receipt
                        size={18}
                        className="mt-0.5 shrink-0 text-[#1b5fa8]"
                      />
                      <div className="text-sm text-[#143e73]">
                        <div className="font-semibold">
                          Linked e-Invoice (IRN) found.
                        </div>
                        <div className="mt-0.5 text-xs text-[#1b5fa8]">
                          This E-Way Bill was generated with e-Invoicing.
                          Confirming will cancel the E-Way Bill first, then the
                          IRN
                          {record.einvoice?.irn
                            ? ` (${record.einvoice.irn})`
                            : ""}
                          .
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2">
                    <Field label="Reason Code" required>
                      <select
                        value={cancelForm.reasonCode}
                        onChange={(e) =>
                          setCancelForm({
                            ...cancelForm,
                            reasonCode: e.target.value,
                          })
                        }
                        className={inputClass}
                      >
                        {CANCEL_REASONS.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Remark" required>
                      <input
                        value={cancelForm.remark}
                        onChange={(e) =>
                          setCancelForm({
                            ...cancelForm,
                            remark: e.target.value,
                          })
                        }
                        placeholder="Enter cancellation remark"
                        autoFocus
                        className={inputClass}
                      />
                    </Field>
                  </div>
                </form>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3">
          {mode === "view" ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40"
              >
                Close
              </button>

              {isLoaded && (
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleViewPdf}
                    disabled={isPreviewing}
                    className="inline-flex items-center gap-2 rounded border border-[#1b5fa8] bg-white px-4 py-2.5 text-sm font-semibold text-[#1b5fa8] transition hover:bg-[#eaf2fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPreviewing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Eye size={16} />
                    )}
                    {isPreviewing ? "Loading..." : "View PDF"}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isDownloading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Download size={16} />
                    )}
                    {isDownloading ? "Downloading..." : "Download PDF"}
                  </button>

                  {!isCancelled && (
                    <>
                      <button
                        type="button"
                        onClick={() => openMode("cancel")}
                        className="inline-flex items-center gap-2 rounded border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                      >
                        <Ban size={16} /> Cancel E-Way Bill
                      </button>
                      <button
                        type="button"
                        onClick={() => openMode("vehicle")}
                        className="inline-flex items-center gap-2 rounded bg-[#009966] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#096345] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#009966] focus-visible:ring-offset-2"
                      >
                        <Truck size={16} /> Update Vehicle (Part-B)
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => openMode("view")}
                disabled={isBusy}
                className="inline-flex items-center gap-2 rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40 disabled:opacity-60"
              >
                <ArrowLeft size={16} /> Back to details
              </button>

              {mode === "vehicle" ? (
                <button
                  type="submit"
                  form="vehicle-form"
                  disabled={isBusy}
                  className="inline-flex items-center gap-2 rounded bg-[#f28c28] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#d97a1a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f28c28] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {updateVehicleMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Pencil size={16} />
                  )}
                  {updateVehicleMutation.isPending
                    ? "Updating..."
                    : "Update Vehicle"}
                </button>
              ) : (
                <button
                  type="submit"
                  form="cancel-form"
                  disabled={isBusy}
                  className="inline-flex items-center gap-2 rounded bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {cancelMutation.isPending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Ban size={16} />
                  )}
                  {cancelMutation.isPending
                    ? "Cancelling..."
                    : hasEinvoice
                      ? "Cancel E-Way Bill & IRN"
                      : "Confirm Cancel"}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {viewOpen && (
        <EwayViewModal
          html={viewHtml}
          loading={isPreviewing}
          error={viewError}
          ewayBillNo={ewbNo}
          onClose={() => setViewOpen(false)}
          onDownload={handleDownloadPdf}
          isDownloading={isDownloading}
        />
      )}
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  ExternalLink,
  FileText,
  Loader2,
  MapPin,
  Package,
  Plus,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import useAuthStore from "../../store/authStore";
import { useGenerateEwayBill, useNICConfig } from "../../hooks/useEwayBill";
import {
  extractStockItems,
  extractVoucherPagination,
  extractVouchers,
  fetchCompanyStock,
  fetchCompanyVouchers,
} from "../../services/companiesApi";
import {
  findStockHsnCode,
  findStockGstRate,
  findStockItem,
  findStockRate,
  findStockUnits,
  getStockValue,
} from "../../utils/stockLookups";
import { SearchableDropdown } from "../../components/SearchableDropdown";
import { getGstStateCode } from "../parties/utils";
import { lockBodyScroll } from "../../utils/bodyScrollLock";

/* ---------- styles ---------- */
const inputClass =
  "mt-1 h-10 w-full rounded border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1b5fa8] focus:ring-2 focus:ring-[#1b5fa8]/20";
const cellInputClass =
  "h-9 w-full rounded border border-slate-300 bg-white px-2 text-sm text-slate-800 outline-none transition focus:border-[#1b5fa8] focus:ring-2 focus:ring-[#1b5fa8]/20";
const labelClass = "text-xs font-semibold text-slate-700";

/* ---------- helpers ---------- */
const num = (value) => Number(value) || 0;
const round = (value) => Number(value.toFixed(2));
const money = (value) =>
  `₹ ${num(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

// Tally-style line: gross = rate × qty, discount = gross × disc%, taxable = gross − discount
const lineGross = (item) => num(item.rate) * num(item.quantity);
const lineDiscount = (item) => (lineGross(item) * num(item.discPercent)) / 100;
const computeTaxable = (item) => round(lineGross(item) - lineDiscount(item));

const digitsOnly = (value) => String(value).replace(/\D/g, "");
const decimalOnly = (value) => {
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const [whole, ...rest] = cleaned.split(".");
  return rest.length ? `${whole}.${rest.join("")}` : whole;
};

// Pehli non-empty value return karo (multiple key fallbacks ke liye)
const pickFirst = (...values) =>
  values.find(
    (value) => value !== undefined && value !== null && value !== "",
  ) || "";

// Address se city nikaalo: "Street, Area, City, District" -> second-to-last
const placeFromAddress = (address) => {
  const parts = String(address || "")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
  return parts.length >= 2 ? parts[parts.length - 2] : "";
};

// GSTIN ke pehle 2 digits = state code
const stateCodeFromGstin = (gstin) => {
  const match = /^(\d{2})/.exec(String(gstin || "").trim());
  return match ? match[1] : "";
};

const toISODate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

// NIC expects dates in dd/mm/yyyy format
const toNICDate = (value) => {
  if (!value) return "";

  const isoMatch = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(value));
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}/${month}/${year}`;
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
};

const VOUCHERS_PAGE_SIZE = 20;

const ITEM_OPTION_KEYS = [
  "itemName",
  "item_name",
  "stockName",
  "stock_name",
  "stockItemName",
  "stock_item_name",
  "item",
  "name",
  "displayName",
];

const SUB_SUPPLY_TYPES = [
  { value: "1", label: "1 - Supply" },
  { value: "2", label: "2 - Import" },
  { value: "3", label: "3 - Export" },
  { value: "4", label: "4 - Job Work" },
  { value: "5", label: "5 - For Own Use" },
  { value: "6", label: "6 - Job Work Returns" },
  { value: "7", label: "7 - Sales Return" },
  { value: "8", label: "8 - Others" },
  { value: "9", label: "9 - SKD/CKD" },
  { value: "10", label: "10 - Line Sales" },
  { value: "11", label: "11 - Recipient Not Known" },
  { value: "12", label: "12 - Exhibition or Fairs" },
];

const emptyItem = () => ({
  productName: "",
  hsnCode: "",
  quantity: "1",
  rate: "",
  discPercent: "0",
  qtyUnit: "NOS",
  taxableAmount: "",
  gstRate: "",
  cessRate: "0",
});

/* ---------- small UI pieces ---------- */
function Field({ label, required, hint, children, className = "" }) {
  return (
    <div className={className}>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-red-600">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
    </div>
  );
}

function Section({ step, title, icon: Icon, right, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#143e73] text-xs font-bold text-white">
            {step}
          </span>
          {Icon ? <Icon size={16} className="text-[#1b5fa8]" /> : null}
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        {right}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function GenerateEwayBillModal({
  companyId,
  onClose,
  onSuccess,
  onError,
}) {
  const token = useAuthStore((s) => s.accessToken);
  const generateMutation = useGenerateEwayBill(companyId);

  const [vouchers, setVouchers] = useState([]);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [isVouchersLoading, setIsVouchersLoading] = useState(false);
  const [isLoadingMoreVouchers, setIsLoadingMoreVouchers] = useState(false);
  const [hasMoreVouchers, setHasMoreVouchers] = useState(false);
  const [vouchersError, setVouchersError] = useState("");
  const voucherRequestRef = useRef(0);
  const voucherPageRef = useRef(1);
  const voucherQueryRef = useRef("");
  const bodyRef = useRef(null);
  const [error, setError] = useState("");
  const [generateEinvoice, setGenerateEinvoice] = useState(false);
  const [result, setResult] = useState(null);

  const [stockOptions, setStockOptions] = useState([]);
  const [isStockLoading, setIsStockLoading] = useState(false);
  const [stockError, setStockError] = useState("");
  const stockRequestRef = useRef(0);

  const [payload, setPayload] = useState({
    supplyType: "O",
    subSupplyType: "1",
    docType: "INV",
    docNo: "",
    docDate: "",
    fromGstin: "",
    fromTrdName: "",
    fromAddr1: "",
    fromPlace: "",
    fromPincode: "",
    fromStateCode: "",
    toGstin: "",
    toTrdName: "",
    toAddr1: "",
    toPlace: "",
    toPincode: "",
    toStateCode: "",
    transMode: "1",
    vehicleNo: "",
    transDistance: "",
    transporterId: "",
    transporterName: "",
    transDocNo: "",
    transDocDate: "",
    itemList: [emptyItem()],
  });

  const nicConfigQuery = useNICConfig(companyId);

  const isSubmitting = generateMutation.isPending;

  // Consignor (From) details ko NIC Settings se auto-fill karo
  useEffect(() => {
    const config = nicConfigQuery.data;
    if (!config) return;

    setPayload((prev) => ({
      ...prev,
      fromGstin: prev.fromGstin || config.fromGstin || config.gstin || "",
      fromTrdName: prev.fromTrdName || config.fromTrdName || "",
      fromAddr1: prev.fromAddr1 || config.fromAddr1 || "",
      fromPlace: prev.fromPlace || config.fromPlace || "",
      fromPincode: prev.fromPincode || config.fromPincode || "",
      fromStateCode: prev.fromStateCode || config.fromStateCode || "",
    }));
  }, [nicConfigQuery.data]);

  useEffect(() => lockBodyScroll(), []);

  // Esc to close (blocked while submitting)
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape" && !isSubmitting) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, isSubmitting]);

  // Stock items: latest search request wins (debounced typing handled by SearchableDropdown)
  const loadStockItems = useCallback(
    (query) => {
      if (!token || !companyId) return;

      const requestId = stockRequestRef.current + 1;
      stockRequestRef.current = requestId;
      setIsStockLoading(true);
      setStockError("");

      fetchCompanyStock(token, companyId, {
        page: 1,
        limit: 20,
        q: query || "",
      })
        .then((response) => {
          if (stockRequestRef.current !== requestId) return;
          setStockOptions(extractStockItems(response));
          setIsStockLoading(false);
        })
        .catch((err) => {
          if (stockRequestRef.current !== requestId) return;
          setStockError(err?.message || "Unable to load items.");
          setStockOptions([]);
          setIsStockLoading(false);
        });
    },
    [token, companyId],
  );

  useEffect(() => {
    loadStockItems("");
  }, [loadStockItems]);

  // Vouchers: server-side search + infinite scroll (20 per page)
  const loadVouchers = useCallback(
    (query = "", { append = false } = {}) => {
      if (!token || !companyId) return;

      const page = append ? voucherPageRef.current + 1 : 1;
      const requestId = voucherRequestRef.current + 1;
      voucherRequestRef.current = requestId;

      if (append) setIsLoadingMoreVouchers(true);
      else setIsVouchersLoading(true);
      setVouchersError("");

      fetchCompanyVouchers(token, companyId, {
        page,
        limit: VOUCHERS_PAGE_SIZE,
        q: query || "",
      })
        .then((response) => {
          if (voucherRequestRef.current !== requestId) return;

          const items = extractVouchers(response);
          const total = num(extractVoucherPagination(response)?.total);

          voucherPageRef.current = page;
          voucherQueryRef.current = query || "";
          setVouchers((prev) => (append ? [...prev, ...items] : items));
          setHasMoreVouchers(
            total > 0
              ? page * VOUCHERS_PAGE_SIZE < total
              : items.length === VOUCHERS_PAGE_SIZE,
          );
          setIsVouchersLoading(false);
          setIsLoadingMoreVouchers(false);
        })
        .catch((err) => {
          if (voucherRequestRef.current !== requestId) return;
          setVouchersError(err?.message || "Unable to load invoices.");
          if (!append) setVouchers([]);
          setHasMoreVouchers(false);
          setIsVouchersLoading(false);
          setIsLoadingMoreVouchers(false);
        });
    },
    [token, companyId],
  );

  useEffect(() => {
    loadVouchers("");
  }, [loadVouchers]);

  const voucherOptions = useMemo(
    () =>
      vouchers.map((voucher) => ({
        id: voucher._id,
        name: `${voucher.voucherNumber || "—"} • ${
          voucher.partyLedger || "—"
        } • ${toISODate(voucher.date) || "—"}`,
        voucher,
      })),
    [vouchers],
  );

  const selectedVoucherLabel = selectedVoucher
    ? `${selectedVoucher.voucherNumber || "—"} • ${
        selectedVoucher.partyLedger || "—"
      } • ${toISODate(selectedVoucher.date) || "—"}`
    : "";

  const itemOptions = useMemo(
    () =>
      stockOptions
        .map((item) => getStockValue(item, ITEM_OPTION_KEYS))
        .filter(Boolean)
        .filter((name, index, names) => names.indexOf(name) === index),
    [stockOptions],
  );

  // Inter-state supply => IGST, otherwise CGST + SGST
  const isInterState = Boolean(
    payload.fromGstin &&
    payload.toGstin &&
    payload.fromGstin !== payload.toGstin,
  );

  const itemTotals = useMemo(
    () =>
      payload.itemList.reduce(
        (acc, item) => {
          const taxable = num(item.taxableAmount);
          const gst = num(item.gstRate);
          const half = gst / 2;
          acc.taxable += taxable;
          if (isInterState) {
            acc.igst += (taxable * gst) / 100;
          } else {
            acc.cgst += (taxable * half) / 100;
            acc.sgst += (taxable * half) / 100;
          }
          acc.cess += (taxable * num(item.cessRate)) / 100;
          return acc;
        },
        { taxable: 0, sgst: 0, cgst: 0, igst: 0, cess: 0 },
      ),
    [payload.itemList, isInterState],
  );

  const voucherAmount = num(selectedVoucher?.amount);
  const taxableValue = itemTotals.taxable || voucherAmount;
  const totalValue = round(
    taxableValue +
      itemTotals.sgst +
      itemTotals.cgst +
      itemTotals.igst +
      itemTotals.cess,
  );

  const updatePayload = (name, value) =>
    setPayload((prev) => ({ ...prev, [name]: value }));

  const updateItem = (index, name, value) =>
    setPayload((prev) => ({
      ...prev,
      itemList: prev.itemList.map((item, i) => {
        if (i !== index) return item;

        const next = { ...item, [name]: value };

        // Rate / Qty / Disc% badalne par taxable auto-calculate karo
        if (name === "rate" || name === "quantity" || name === "discPercent") {
          next.taxableAmount = computeTaxable(next);
        }

        return next;
      }),
    }));

  const addItem = () =>
    setPayload((prev) => ({
      ...prev,
      itemList: [...prev.itemList, emptyItem()],
    }));

  const removeItem = (index) =>
    setPayload((prev) => ({
      ...prev,
      itemList:
        prev.itemList.length === 1
          ? [emptyItem()]
          : prev.itemList.filter((_, i) => i !== index),
    }));

  // Item select hote hi HSN, unit, GST rate aur taxable auto-fill karo
  const applyStockItem = (index, itemName) => {
    const matchedItem = findStockItem(stockOptions, itemName);

    setPayload((prev) => ({
      ...prev,
      itemList: prev.itemList.map((item, i) => {
        if (i !== index) return item;

        // Typing partial text: sirf naam update karo, baaki fields chhedo mat
        if (!matchedItem) {
          return { ...item, productName: itemName };
        }

        const hsnCode = findStockHsnCode(stockOptions, itemName);
        const qtyUnit = findStockUnits(stockOptions, itemName) || "NOS";
        const gstRate = findStockGstRate(stockOptions, itemName) || "18";
        const rate = findStockRate(stockOptions, itemName);

        const next = {
          ...item,
          productName: itemName,
          hsnCode,
          qtyUnit,
          gstRate: String(gstRate),
          rate: rate ? String(rate) : item.rate,
        };
        next.taxableAmount = computeTaxable(next);

        return next;
      }),
    }));
  };

  const handleVoucherSelect = (voucher) => {
    if (!voucher) {
      setSelectedVoucher(null);
      return;
    }

    setSelectedVoucher(voucher);

    const raw = voucher.raw || {};
    const advanced = raw.advancedSettings || {};
    const consignee = raw.consigneeDetails || {};

    // Party Details
    const toGstin = pickFirst(
      raw.consigneeGstin,
      advanced.consigneeGstin,
      consignee.consigneeGstin,
      raw.partyGstin,
      raw.PARTYGSTIN,
      raw.partygstin,
      raw.gstin,
    );
    const toAddress = pickFirst(
      raw.consigneeAddress,
      advanced.consigneeAddress,
      consignee.consigneeAddress,
    );
    const toStateName = pickFirst(
      raw.consigneeState,
      advanced.consigneeState,
      consignee.consigneeState,
      raw.placeOfSupply,
    );
    const toStateCode =
      stateCodeFromGstin(toGstin) || getGstStateCode(toStateName);

    // Item List auto-fill
    // Voucher response me items 'inventoryEntries' ya 'items' me ho sakte hain
    const rawItems = raw.inventoryEntries || raw.items || [];

    const autoFilledItems = rawItems.map((item) => {
      const rate = num(item.rate);
      const qty = num(item.quantity);
      const discount = num(item.discount) || 0; // Tally se discount amount aa raha hai

      const gross = rate * qty;
      const taxableAmount = round(gross - discount);

      // GST Rate
      const gstRate = num(item.gstRate) || 0;
      const isItemInterState = Boolean(
        toGstin && payload.fromGstin && payload.fromGstin !== toGstin,
      );

      return {
        productName: item.itemName || item.name || "",
        hsnCode: String(item.hsnCode || ""),
        quantity: String(qty || 1),
        rate: String(rate || ""),
        discPercent: "0", // UI se hata diya hai, par state me rakhna zaroori hai
        qtyUnit: item.unit || "NOS",
        taxableAmount: String(taxableAmount || ""),
        gstRate: String(gstRate),
        cessRate: "0", // Agar cess chahiye toh item.cessRate add karna
        // Internal tracking ke liye discount save karo
        _discount: discount,
      };
    });

    setPayload((prev) => ({
      ...prev,
      docNo: voucher.voucherNumber || prev.docNo,
      docDate: toISODate(voucher.date) || prev.docDate,
      toTrdName:
        pickFirst(
          raw.consigneeName,
          advanced.consigneeName,
          consignee.consigneeName,
          voucher.partyLedger,
        ) || prev.toTrdName,
      toGstin: toGstin || prev.toGstin,
      toAddr1: toAddress || prev.toAddr1,
      toPlace: placeFromAddress(toAddress) || prev.toPlace,
      toPincode:
        digitsOnly(
          pickFirst(
            raw.consigneePincode,
            advanced.consigneePincode,
            consignee.consigneePincode,
          ),
        ) || prev.toPincode,
      toStateCode: toStateCode || prev.toStateCode,

      itemList: autoFilledItems.length > 0 ? autoFilledItems : [emptyItem()],
    }));
  };

  const showError = (message) => {
    setError(message);
    bodyRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!companyId) {
      showError("Please select a company first.");
      return;
    }

    if (!selectedVoucher) {
      showError(
        "Please select the invoice voucher to link this e-way bill to.",
      );
      return;
    }

    if (!payload.docNo || !payload.docDate) {
      showError("Document number and document date are required.");
      return;
    }

    // 👇 Yahan se strict calculation start hota hai
    let totalTaxable = 0;
    let totalCgst = 0;
    let totalSgst = 0;
    let totalIgst = 0;
    let totalCess = 0;

    const finalItemList = payload.itemList.map((item) => {
      const gst = num(item.gstRate);
      const half = gst / 2;

      // Agar auto-filled item hai jisme _discount hai, toh taxable calculate karo
      let taxableAmount = num(item.taxableAmount);
      if (
        item._discount !== undefined &&
        num(item.rate) &&
        num(item.quantity)
      ) {
        const gross = num(item.rate) * num(item.quantity);
        taxableAmount = round(gross - num(item._discount));
      }

      taxableAmount = round(taxableAmount);

      const cgstRate = isInterState ? 0 : half;
      const sgstRate = isInterState ? 0 : half;
      const igstRate = isInterState ? gst : 0;
      const cessRate = num(item.cessRate);

      const cgstAmt = round((taxableAmount * cgstRate) / 100);
      const sgstAmt = round((taxableAmount * sgstRate) / 100);
      const igstAmt = round((taxableAmount * igstRate) / 100);
      const cessAmt = round((taxableAmount * cessRate) / 100);

      totalTaxable = round(totalTaxable + taxableAmount);
      totalCgst = round(totalCgst + cgstAmt);
      totalSgst = round(totalSgst + sgstAmt);
      totalIgst = round(totalIgst + igstAmt);
      totalCess = round(totalCess + cessAmt);

      return {
        productName: item.productName,
        hsnCode: item.hsnCode,
        quantity: num(item.quantity),
        qtyUnit: item.qtyUnit,
        rate: num(item.rate),
        discPercent: num(item.discPercent),
        discount: 0, // 👈 NIC ko discount 0 hi bhejenge
        taxableAmount: taxableAmount,
        cgstRate: cgstRate,
        sgstRate: sgstRate,
        igstRate: igstRate,
        cessRate: cessRate,
      };
    });

    // Final Total = Sum of Taxable + Sum of Taxes
    const calculatedTotal = round(
      totalTaxable + totalCgst + totalSgst + totalIgst + totalCess,
    );

    const ewayPayload = {
      ...payload,
      docDate: toNICDate(payload.docDate),
      totalValue: calculatedTotal, // NIC ko totalValue mein Taxable Amount jata hai
      cgstValue: totalCgst,
      sgstValue: totalSgst,
      igstValue: totalIgst,
      cessValue: totalCess,
      itemList: finalItemList,
    };

    try {
      const response = await generateMutation.mutateAsync({
        voucherId: selectedVoucher._id,
        partyLedger: selectedVoucher.partyLedger || payload.toTrdName || "",
        ewayPayload,
        generateEinvoice,
      });

      const einvoice = response?.data?.einvoice;
      if (einvoice?.irn) {
        setResult({ ...einvoice, ewbNo: response?.data?.ewayBillNo });
        onSuccess?.("E-Invoice and E-Way Bill generated successfully.");
        return;
      }

      onSuccess?.("E-Way Bill generated successfully.");
      onClose();
    } catch (err) {
      const message = err?.message || "Failed to generate E-Way Bill.";
      showError(message);
      onError?.(message);
    }
  };

  // e-Invoice generate hone par IRN + QR dikhao
  if (result) {
    return (
      <div className="fixed inset-x-0 bottom-0 top-0 z-[1000] flex items-center justify-center bg-black/60 p-2 sm:p-4">
        <div className="flex max-h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl sm:w-[90%] sm:max-w-lg">
          <div className="flex items-center gap-3 border-b-4 border-[#009966] bg-[#143e73] px-5 py-3.5 text-white">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h2 className="text-base font-semibold sm:text-lg">
                E-Invoice Generated
              </h2>
              <p className="text-xs text-blue-100">
                IRN and E-Way Bill details
              </p>
            </div>
          </div>

          <div className="space-y-4 overflow-y-auto bg-[#eef3f8] p-5">
            <div className="flex items-start gap-2 rounded border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>
                E-Invoice (IRN) and E-Way Bill generated successfully.
              </span>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-500">IRN</p>
              <p className="mt-1 break-all font-mono text-xs text-slate-800">
                {result.irn}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">Ack No</p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {result.ackNo || "—"}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold text-slate-500">
                  E-Way Bill No
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {result.ewbNo || "—"}
                </p>
              </div>
            </div>

            {result.qrCode ? (
              <div className="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white p-4">
                <img
                  src={result.qrCode}
                  alt="e-Invoice QR Code"
                  className="h-56 w-56 object-contain"
                />
                <p className="text-xs text-slate-500">
                  Scan to verify the e-Invoice
                </p>
              </div>
            ) : null}
          </div>

          <div className="flex justify-end border-t border-slate-200 bg-white px-5 py-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-[#009966] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#056e4b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#046e4b] focus-visible:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 top-0 z-[1000] flex items-center justify-center bg-black/60 p-2 sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="flex h-full max-h-full w-full flex-col overflow-hidden rounded-lg bg-white shadow-2xl sm:w-[90%]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b-4 border-[#009966] bg-[#143e73] px-5 py-3.5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded bg-white/10">
              <Truck className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <h2 className="text-base font-semibold sm:text-lg">
                Generate E-Way Bill
              </h2>
              <p className="text-xs text-blue-100">
                Link an invoice, verify the details and submit to the NIC portal
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded p-2 text-blue-100 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
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

          {/* 1. Voucher */}
          <Section step={1} title="Invoice / Voucher" icon={FileText}>
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Linked Invoice / Voucher" required>
                <SearchableDropdown
                  name="voucher"
                  label="invoices"
                  options={voucherOptions}
                  value={selectedVoucherLabel}
                  placeholder="Search by invoice no or party..."
                  loading={isVouchersLoading}
                  loadError={vouchersError}
                  serverSideFiltering
                  onInputChange={loadVouchers}
                  onOptionSelect={(option) =>
                    handleVoucherSelect(option.voucher)
                  }
                  onClear={() => setSelectedVoucher(null)}
                  onLoadMore={() =>
                    loadVouchers(voucherQueryRef.current, { append: true })
                  }
                  hasMoreOptions={hasMoreVouchers}
                  loadingMore={isLoadingMoreVouchers}
                />
              </Field>

              {selectedVoucher ? (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded border border-[#1b5fa8]/20 bg-[#eaf2fb] px-4 py-3 text-xs text-slate-600">
                  <div>
                    Party
                    <div className="text-sm font-semibold text-slate-800">
                      {selectedVoucher.partyLedger || "—"}
                    </div>
                  </div>
                  <div>
                    Invoice No
                    <div className="text-sm font-semibold text-slate-800">
                      {selectedVoucher.voucherNumber || "—"}
                    </div>
                  </div>
                  <div>
                    Invoice Amount
                    <div className="text-sm font-semibold text-[#143e73]">
                      {money(voucherAmount)}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="self-end rounded border border-dashed border-slate-300 px-4 py-3 text-xs text-slate-500">
                  Select an invoice to auto-fill the document number, date and
                  consignee details.
                </p>
              )}
            </div>
          </Section>

          {/* 2. Documents */}
          <Section step={2} title="Document Details" icon={ClipboardList}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
              <Field label="Supply Type">
                <select
                  value={payload.supplyType}
                  onChange={(e) => updatePayload("supplyType", e.target.value)}
                  className={inputClass}
                >
                  <option value="O">Outward</option>
                  <option value="I">Inward</option>
                </select>
              </Field>
              <Field label="Sub Supply Type">
                <select
                  value={payload.subSupplyType}
                  onChange={(e) =>
                    updatePayload("subSupplyType", e.target.value)
                  }
                  className={inputClass}
                >
                  {SUB_SUPPLY_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Doc Type">
                <select
                  value={payload.docType}
                  onChange={(e) => updatePayload("docType", e.target.value)}
                  className={inputClass}
                >
                  <option value="INV">Tax Invoice</option>
                  <option value="BIL">Bill of Supply</option>
                  <option value="CHL">Delivery Challan</option>
                </select>
              </Field>
              <Field label="Doc No" required>
                <input
                  value={payload.docNo}
                  onChange={(e) => updatePayload("docNo", e.target.value)}
                  className={inputClass}
                  placeholder="INV-001"
                />
              </Field>
              <Field label="Doc Date" required>
                <input
                  type="date"
                  value={payload.docDate}
                  onChange={(e) => updatePayload("docDate", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* 3. From / To */}
          <div className="grid gap-4 xl:grid-cols-2">
            <Section step={3} title="From (Consignor)" icon={MapPin}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="GSTIN">
                  <input
                    value={payload.fromGstin}
                    onChange={(e) =>
                      updatePayload(
                        "fromGstin",
                        e.target.value.toUpperCase().replace(/\s/g, ""),
                      )
                    }
                    maxLength={15}
                    spellCheck={false}
                    placeholder="07AAGCB1286Q012"
                    className={inputClass}
                  />
                </Field>
                <Field label="Trade Name">
                  <input
                    value={payload.fromTrdName}
                    onChange={(e) =>
                      updatePayload("fromTrdName", e.target.value)
                    }
                    className={inputClass}
                  />
                </Field>
                <Field label="Address" className="col-span-2">
                  <input
                    value={payload.fromAddr1}
                    onChange={(e) => updatePayload("fromAddr1", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Place">
                  <input
                    value={payload.fromPlace}
                    onChange={(e) => updatePayload("fromPlace", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Pincode">
                    <input
                      value={payload.fromPincode}
                      onChange={(e) =>
                        updatePayload("fromPincode", digitsOnly(e.target.value))
                      }
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="110001"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="State Code">
                    <input
                      value={payload.fromStateCode}
                      onChange={(e) =>
                        updatePayload(
                          "fromStateCode",
                          digitsOnly(e.target.value),
                        )
                      }
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="07"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </Section>

            <Section step={4} title="To (Consignee)" icon={MapPin}>
              <div className="grid grid-cols-2 gap-4">
                <Field label="GSTIN">
                  <input
                    value={payload.toGstin}
                    onChange={(e) =>
                      updatePayload(
                        "toGstin",
                        e.target.value.toUpperCase().replace(/\s/g, ""),
                      )
                    }
                    maxLength={15}
                    spellCheck={false}
                    placeholder="06AAACX1234Q1Z5"
                    className={inputClass}
                  />
                </Field>
                <Field label="Trade Name">
                  <input
                    value={payload.toTrdName}
                    onChange={(e) => updatePayload("toTrdName", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Address" className="col-span-2">
                  <input
                    value={payload.toAddr1}
                    onChange={(e) => updatePayload("toAddr1", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Place">
                  <input
                    value={payload.toPlace}
                    onChange={(e) => updatePayload("toPlace", e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Pincode">
                    <input
                      value={payload.toPincode}
                      onChange={(e) =>
                        updatePayload("toPincode", digitsOnly(e.target.value))
                      }
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="122001"
                      className={inputClass}
                    />
                  </Field>
                  <Field label="State Code">
                    <input
                      value={payload.toStateCode}
                      onChange={(e) =>
                        updatePayload("toStateCode", digitsOnly(e.target.value))
                      }
                      inputMode="numeric"
                      maxLength={2}
                      placeholder="06"
                      className={inputClass}
                    />
                  </Field>
                </div>
              </div>
            </Section>
          </div>

          {/* 5. Transport */}
          {/* 5. Transport */}
          <Section step={5} title="Transport Details" icon={Truck}>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-7">
              <Field label="Transport Mode">
                <select
                  value={payload.transMode}
                  onChange={(e) => updatePayload("transMode", e.target.value)}
                  className={inputClass}
                >
                  <option value="1">Road</option>
                  <option value="2">Rail</option>
                  <option value="3">Air</option>
                  <option value="4">Ship</option>
                </select>
              </Field>
              <Field label="Vehicle No">
                <input
                  value={payload.vehicleNo}
                  onChange={(e) =>
                    updatePayload(
                      "vehicleNo",
                      e.target.value.toUpperCase().replace(/[\s-]/g, ""),
                    )
                  }
                  placeholder="HR55AB1234"
                  className={inputClass}
                />
              </Field>
              <Field label="Distance (Km)">
                <input
                  value={payload.transDistance}
                  onChange={(e) =>
                    updatePayload("transDistance", digitsOnly(e.target.value))
                  }
                  inputMode="numeric"
                  placeholder="0 = auto"
                  className={inputClass}
                />
              </Field>
              <Field label="Transporter ID">
                <input
                  value={payload.transporterId}
                  onChange={(e) =>
                    updatePayload(
                      "transporterId",
                      e.target.value.toUpperCase().replace(/\s/g, ""),
                    )
                  }
                  maxLength={15}
                  placeholder="05AAACG0904A1ZL"
                  className={inputClass}
                />
              </Field>
              <Field label="Transporter Name">
                <input
                  value={payload.transporterName}
                  onChange={(e) =>
                    updatePayload("transporterName", e.target.value)
                  }
                  placeholder="DTDC"
                  className={inputClass}
                />
              </Field>
              {/* 👇 Naye fields add karo */}
              <Field label="Trans Doc No">
                <input
                  value={payload.transDocNo || ""}
                  onChange={(e) => updatePayload("transDocNo", e.target.value)}
                  placeholder="TR-001"
                  maxLength={15}
                  className={inputClass}
                />
              </Field>
              <Field label="Trans Doc Date">
                <input
                  type="date"
                  value={payload.transDocDate || ""}
                  onChange={(e) =>
                    updatePayload("transDocDate", e.target.value)
                  }
                  className={inputClass}
                />
              </Field>
            </div>
          </Section>

          {/* 6. Items */}
          <Section
            step={6}
            title="Item List"
            icon={Package}
            right={
              <span
                className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                  isInterState
                    ? "bg-orange-50 text-orange-700"
                    : "bg-emerald-50 text-emerald-700"
                }`}
              >
                {isInterState
                  ? "Inter-state • IGST applies"
                  : "Intra-state • CGST + SGST"}
              </span>
            }
          >
            <div className="overflow-x-auto rounded border border-slate-200">
              <table className="w-full min-w-[1180px] text-left text-sm">
                <thead className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-600">
                  <tr>
                    <th className="w-10 px-3 py-2.5 font-semibold">#</th>
                    <th className="min-w-[240px] px-2 py-2.5 font-semibold">
                      Item
                    </th>
                    <th className="w-24 px-2 py-2.5 font-semibold">HSN</th>
                    <th className="w-20 px-2 py-2.5 font-semibold">Qty</th>
                    <th className="w-24 px-2 py-2.5 font-semibold">Rate</th>
                    <th className="w-20 px-2 py-2.5 font-semibold">Unit</th>
                    {/* <th className="w-24 px-2 py-2.5 font-semibold">Disc %</th> */}
                    <th className="w-28 px-2 py-2.5 text-right font-semibold">
                      Taxable
                    </th>
                    <th className="w-24 px-2 py-2.5 font-semibold">GST %</th>
                    <th className="w-24 px-2 py-2.5 text-right font-semibold">
                      Tax
                    </th>
                    <th className="w-32 px-2 py-2.5 text-right font-semibold">
                      Amount
                    </th>
                    <th className="w-12 px-2 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {payload.itemList.map((item, index) => {
                    const rowTaxable = num(item.taxableAmount);
                    const rowTax = (rowTaxable * num(item.gstRate)) / 100;
                    const rowAmount = rowTaxable + rowTax;

                    return (
                      <tr key={index} className="align-middle">
                        <td className="px-3 py-2 text-xs font-semibold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="px-2 py-2">
                          <SearchableDropdown
                            name={`item-${index}`}
                            label="items"
                            options={itemOptions}
                            onInputChange={loadStockItems}
                            placeholder={stockError || "Search Item"}
                            loading={isStockLoading}
                            value={item.productName}
                            onSelect={(name) => applyStockItem(index, name)}
                            onClear={() => updateItem(index, "productName", "")}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            value={item.hsnCode}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "hsnCode",
                                digitsOnly(e.target.value),
                              )
                            }
                            inputMode="numeric"
                            maxLength={8}
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                decimalOnly(e.target.value),
                              )
                            }
                            inputMode="decimal"
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            value={item.rate}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "rate",
                                decimalOnly(e.target.value),
                              )
                            }
                            inputMode="decimal"
                            placeholder="0.00"
                            className={cellInputClass}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <input
                            value={item.qtyUnit}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "qtyUnit",
                                e.target.value.toUpperCase(),
                              )
                            }
                            className={cellInputClass}
                          />
                        </td>
                        {/* <td className="px-2 py-2">
                          <div className="relative">
                            <input
                              value={item.discPercent}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "discPercent",
                                  decimalOnly(e.target.value),
                                )
                              }
                              inputMode="decimal"
                              placeholder="0"
                              className={`${cellInputClass} pr-6`}
                            />
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                              %
                            </span>
                          </div>
                        </td> */}
                        <td className="px-2 py-2 text-right font-semibold text-slate-800">
                          {money(rowTaxable)}
                        </td>
                        <td className="px-2 py-2">
                          <div className="relative">
                            <input
                              value={item.gstRate}
                              onChange={(e) =>
                                updateItem(
                                  index,
                                  "gstRate",
                                  decimalOnly(e.target.value),
                                )
                              }
                              inputMode="decimal"
                              placeholder="18"
                              className={`${cellInputClass} pr-6`}
                            />
                            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                              %
                            </span>
                          </div>
                        </td>
                        <td className="px-2 py-2 text-right text-slate-600">
                          {money(rowTax)}
                        </td>
                        <td className="px-2 py-2 text-right font-semibold text-slate-800">
                          {money(rowAmount)}
                        </td>
                        <td className="px-2 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="rounded p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                            aria-label={`Remove item ${index + 1}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
              <button
                type="button"
                onClick={addItem}
                className="inline-flex items-center gap-1.5 rounded border border-[#1b5fa8] bg-white px-3.5 py-2 text-xs font-semibold text-[#1b5fa8] transition hover:bg-[#eaf2fb] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40"
              >
                <Plus size={14} /> Add Item
              </button>

              <dl className="grid min-w-[260px] grid-cols-2 gap-x-8 gap-y-1.5 text-sm">
                <dt className="text-slate-500">Taxable Value</dt>
                <dd className="text-right font-semibold text-slate-800">
                  {money(taxableValue)}
                </dd>
                {isInterState ? (
                  <>
                    <dt className="text-slate-500">IGST</dt>
                    <dd className="text-right font-semibold text-slate-800">
                      {money(itemTotals.igst)}
                    </dd>
                  </>
                ) : (
                  <>
                    <dt className="text-slate-500">CGST</dt>
                    <dd className="text-right font-semibold text-slate-800">
                      {money(itemTotals.cgst)}
                    </dd>
                    <dt className="text-slate-500">SGST</dt>
                    <dd className="text-right font-semibold text-slate-800">
                      {money(itemTotals.sgst)}
                    </dd>
                  </>
                )}
                {itemTotals.cess > 0 && (
                  <>
                    <dt className="text-slate-500">Cess</dt>
                    <dd className="text-right font-semibold text-slate-800">
                      {money(itemTotals.cess)}
                    </dd>
                  </>
                )}
                <dt className="border-t border-slate-200 pt-1.5 font-semibold text-slate-700">
                  Total Value
                </dt>
                <dd className="border-t border-slate-200 pt-1.5 text-right text-base font-bold text-[#143e73]">
                  {money(totalValue)}
                </dd>
              </dl>
            </div>

            {/* e-Invoice (IRN) Guidance */}
            <div
              className={`rounded-lg mt-5 border transition-colors ${
                generateEinvoice
                  ? "border-[#1b5fa8] bg-blue-50/50"
                  : "border-slate-200 bg-slate-50"
              } p-4`}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={generateEinvoice}
                  onChange={(e) => setGenerateEinvoice(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[#1b5fa8]"
                />

                <div>
                  <span className="text-sm font-semibold text-slate-800">
                    Generate E-Invoice (IRN) with E-Way Bill
                  </span>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Generate a GST-compliant electronic invoice through the
                    Invoice Registration Portal (IRP), including a unique
                    Invoice Reference Number (IRN) and digitally signed QR code.
                  </p>
                </div>
              </label>

              <div className="mt-3 space-y-3 border-t border-slate-200/60 pt-3 text-xs text-slate-600">
                {/* Guideline 1 */}
                <div>
                  <p className="font-semibold text-amber-700 mb-1">
                    Businesses with Annual Aggregate Turnover Exceeding INR 5
                    Crore
                  </p>
                  <p className="leading-relaxed">
                    As per GST e-Invoicing provisions, registered taxpayers
                    whose aggregate turnover has exceeded INR 5 crore in any
                    preceding financial year from 2017-18 onwards are required
                    to generate an e-Invoice for applicable transactions,
                    subject to notified exemptions. For covered B2B and export
                    transactions, the Invoice Reference Number (IRN) must be
                    generated through an authorised Invoice Registration Portal
                    before issuing the invoice.
                  </p>
                </div>

                {/* Guideline 2 */}
                <div>
                  <p className="font-semibold text-emerald-700 mb-1">
                    Businesses with Annual Aggregate Turnover Not Exceeding INR
                    5 Crore
                  </p>
                  <p className="leading-relaxed">
                    Businesses that are not covered under the mandatory
                    e-Invoicing provisions are not required to generate an IRN
                    or a signed e-Invoice QR code. They may issue regular
                    GST-compliant tax invoices and generate an E-Way Bill
                    directly through the E-Way Bill Portal whenever required
                    under the applicable GST transportation rules and
                    provisions.
                  </p>
                </div>

                {/* Guideline 3 */}
                <div>
                  <p className="font-semibold text-[#1b5fa8] mb-1">
                    IRN Generation and Signed QR Code Requirements
                  </p>
                  <p className="leading-relaxed">
                    Upon successful validation of invoice details by the Invoice
                    Registration Portal, a unique IRN and digitally signed QR
                    code are generated and returned to the taxpayer. The signed
                    QR code contains essential invoice information and is
                    required to be included on the applicable e-Invoice. An
                    E-Way Bill generated independently without an e-Invoice does
                    not receive the e-Invoice signed QR code.
                  </p>
                </div>

                <div className="border-t border-slate-200/60 pt-2 text-center">
                  <a
                    href="https://docs.ewaybillgst.gov.in/Documents/Blocking_EWB.pdf"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#1b5fa8] font-medium hover:underline"
                  >
                    View Official NIC E-Invoice and E-Way Bill Guidelines
                    <ExternalLink size={14} strokeWidth={2} />
                  </a>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3">
          <div className="text-xs text-slate-500">
            Total value{" "}
            <span className="ml-1 text-base font-bold text-[#143e73]">
              {money(totalValue)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1b5fa8]/40 disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded bg-[#009966] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#056e4b] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#046e4b] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Truck size={16} />
              )}
              {isSubmitting ? "Generating..." : "Generate E-Way Bill"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

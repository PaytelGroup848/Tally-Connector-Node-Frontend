import React from "react";
import { X, Download, FileText } from "lucide-react";

const fmtINR = (n) =>
  new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);

const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtDateShort = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

// ------- Number → words (Indian format) -------
const numberToWords = (num) => {
  if (num === 0) return "Zero";
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];
  if (num < 20) return ones[num];
  if (num < 100)
    return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
  if (num < 1000)
    return (
      ones[Math.floor(num / 100)] +
      " Hundred" +
      (num % 100 ? " and " + numberToWords(num % 100) : "")
    );
  if (num < 100000)
    return (
      numberToWords(Math.floor(num / 1000)) +
      " Thousand" +
      (num % 1000 ? " " + numberToWords(num % 1000) : "")
    );
  if (num < 10000000)
    return (
      numberToWords(Math.floor(num / 100000)) +
      " Lakh" +
      (num % 100000 ? " " + numberToWords(num % 100000) : "")
    );
  return (
    numberToWords(Math.floor(num / 10000000)) +
    " Crore" +
    (num % 10000000 ? " " + numberToWords(num % 10000000) : "")
  );
};

const amountInWords = (amt) => {
  const rupees = Math.floor(amt);
  const paise = Math.round((amt - rupees) * 100);
  let words = numberToWords(rupees) + " Rupees";
  if (paise > 0) words += " and " + numberToWords(paise) + " Paise";
  return words + " Only";
};

function InvoiceViewModal({ invoice, onClose, onDownload, isDownloading }) {
  if (!invoice) return null;

  const baseAmount = Number(invoice.subtotal) || 0;
  const gstAmount = Number(invoice.gstAmount) || 0;
  const totalAmount = Number(invoice.totalAmount) || 0;
  const gstRate = Number(invoice.gstPercent) || 18;
  const rounded = Math.round(totalAmount);
  const roundOff = rounded - totalAmount;

  const planName = invoice.plan?.name || "Subscription";
  const durationMonths = invoice.plan?.durationMonths || 1;
  const extraSeats = invoice.plan?.extraSeats || 0;

  const invoiceDate = invoice.invoiceDate || new Date();
  const renewalDate = new Date(invoiceDate);
  renewalDate.setMonth(renewalDate.getMonth() + durationMonths);

  const buyer = invoice.billingTo || {};
  const seller = invoice.seller || {};

  const companyInfo = {
    companyName: "PayTel Financial Technologies Pvt. Ltd.(Delhi)",
    addressLine1: "A-212, 1st Floor, Phase-3",
    addressLine2: "Okhla Industrial Area",
    cityPincode: "New Delhi-110020",
    gstin: "07AALCP3083C1ZH",
    stateName: "Delhi",
    stateCode: "07",
    cin: "U74999DL2020PTC367460",
    email: "customercare@cloudedata.com",
    website: "www.cloudedata.com",
    bankAccountHolder: "PAYTEL FINANCIAL TECHNOLOGIES PVT. LTD.",
    bankName: "Yes Bank Ltd.",
    bankAccountNumber: "029861900004141",
    bankBranch: "Okhla Industrial Estate-3",
    bankIFSC: "YESB0000298",
    jurisdiction: "DELHI",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-2 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-full max-w-4xl max-h-[95vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-base sm:text-lg font-semibold text-slate-800">
              Tax Invoice — {invoice.invoiceNumber}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(invoice)}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-60 disabled:cursor-wait transition"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-slate-200 transition"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto p-4 sm:p-6 bg-slate-50">
          <div className="bg-white border border-slate-300 rounded-lg overflow-hidden text-[11px] sm:text-[12px] leading-relaxed">
            {/* Title */}
            <div className="text-center py-3 border-b border-slate-300">
              <div className="text-base sm:text-lg font-bold tracking-wide text-slate-800 uppercase">
                Tax Invoice
              </div>
            </div>

            {/* Top grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="p-3 border-b sm:border-b-0 sm:border-r border-slate-300 text-slate-700">
                <div className="font-bold text-slate-900 text-[13px] mb-1">
                  {companyInfo.companyName}
                </div>
                <div>
                  {companyInfo.addressLine1}, {companyInfo.addressLine2}
                </div>
                <div>{companyInfo.cityPincode}</div>
                <div>
                  GSTIN: <strong>{companyInfo.gstin}</strong>
                </div>
                <div>
                  State: {companyInfo.stateName} | Code: {companyInfo.stateCode}
                </div>
                <div>CIN: {companyInfo.cin}</div>
                <div>Email: {companyInfo.email}</div>
                <div>Website: {companyInfo.website}</div>
              </div>
              <div className="p-3 text-slate-700">
                <Row label="Invoice No." value={invoice.invoiceNumber} />
                <Row label="Billing Date" value={fmtDate(invoiceDate)} />
                <Row label="Renewal Date" value={fmtDate(renewalDate)} />
                <Row label="Service" value={`${planName} Subscription`} />
              </div>
            </div>

            {/* Bill To */}
            <div className="border-t border-slate-300 p-3 text-slate-700">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wide mb-1">
                Bill To
              </div>
              <div className="font-bold text-slate-900 text-[13px]">
                {buyer.name || seller.name || "Customer"}
              </div>
              {buyer.address && <div>Address: {buyer.address}</div>}
              {buyer.phone && <div>Phone: {buyer.phone}</div>}
              {buyer.email && <div>Email: {buyer.email}</div>}
              {buyer.gstin && (
                <div>
                  GSTIN: <strong>{buyer.gstin}</strong>
                </div>
              )}
            </div>

            {/* Items table */}
            <div className="border-t border-slate-300">
              <table className="w-full text-[11px] sm:text-[12px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="border-r border-slate-300 px-2 py-2 text-center w-10">
                      Sl No.
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-left">
                      Description of Services
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-center w-14">
                      GST Rate
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-center w-16">
                      Quantity
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-right w-24">
                      Rate
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-center w-12">
                      per
                    </th>
                    <th className="px-2 py-2 text-right w-28">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-t border-slate-300">
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      1
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2">
                      <div className="font-bold">{planName} Subscription</div>
                      <div className="text-[10px] text-slate-500">
                        From {fmtDateShort(invoiceDate)} to{" "}
                        {fmtDateShort(renewalDate)}
                      </div>
                      {extraSeats > 0 && (
                        <div className="text-[10px] text-slate-500">
                          + {extraSeats} extra seat(s)
                        </div>
                      )}
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      {gstRate}%
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      1 No.
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-right">
                      {fmtINR(baseAmount)}
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      No.
                    </td>
                    <td className="px-2 py-2 text-right font-bold">
                      {fmtINR(baseAmount)}
                    </td>
                  </tr>

                  {/* IGST row */}
                  <tr className="border-t border-slate-300">
                    <td className="border-r border-slate-300 px-2 py-2"></td>
                    <td className="border-r border-slate-300 px-2 py-2 text-right text-slate-600">
                      IGST Output-{gstRate}% ({companyInfo.stateName})
                    </td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      {gstRate}
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      %
                    </td>
                    <td className="px-2 py-2 text-right">
                      {fmtINR(gstAmount)}
                    </td>
                  </tr>

                  {/* Round off */}
                  <tr className="border-t border-slate-300">
                    <td className="border-r border-slate-300 px-2 py-2"></td>
                    <td className="border-r border-slate-300 px-2 py-2 text-right text-slate-600">
                      Round Off
                    </td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="px-2 py-2 text-right">
                      {(roundOff >= 0 ? "+" : "") + fmtINR(roundOff)}
                    </td>
                  </tr>

                  {/* Total */}
                  <tr className="border-t-2 border-slate-400 bg-slate-100">
                    <td className="border-r border-slate-300 px-2 py-2"></td>
                    <td className="border-r border-slate-300 px-2 py-2 font-bold">
                      Total
                    </td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center font-bold">
                      1 No.
                    </td>
                    <td className="border-r border-slate-300"></td>
                    <td className="border-r border-slate-300"></td>
                    <td className="px-2 py-2 text-right font-bold text-[13px]">
                      ₹ {fmtINR(rounded)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amount in words */}
            <div className="border-t border-slate-300 bg-slate-100 px-3 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-[11px]">
              <span>
                <strong>Amount Chargeable (in words):</strong> INR{" "}
                {amountInWords(rounded)}
              </span>
              <span className="italic text-slate-500">E. &amp; O.E.</span>
            </div>

            {/* Tax breakup */}
            <div className="border-t border-slate-300">
              <table className="w-full text-[11px] sm:text-[12px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="border-r border-slate-300 px-2 py-2 text-center">
                      HSN/SAC
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-center">
                      Taxable Value (₹)
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-center">
                      IGST Rate
                    </th>
                    <th className="border-r border-slate-300 px-2 py-2 text-center">
                      IGST Amount (₹)
                    </th>
                    <th className="px-2 py-2 text-center">Total Amount (₹)</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-t border-slate-300">
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      998315
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      {fmtINR(baseAmount)}
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      {gstRate}%
                    </td>
                    <td className="border-r border-slate-300 px-2 py-2 text-center">
                      {fmtINR(gstAmount)}
                    </td>
                    <td className="px-2 py-2 text-center font-bold">
                      {fmtINR(totalAmount)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Amount summary */}
            <div className="border-t border-slate-300">
              <SummaryRow
                label="Taxable Amount (Before GST)"
                value={`₹ ${fmtINR(baseAmount)}`}
              />
              <SummaryRow
                label={`IGST @ ${gstRate}%`}
                value={`₹ ${fmtINR(gstAmount)}`}
              />
              <SummaryRow
                label="Total Amount Payable"
                value={`₹ ${fmtINR(totalAmount)}`}
                highlight
              />
            </div>

            {/* Bank Details */}
            <div className="border-t border-slate-300 p-3">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wide mb-2">
                Company's Bank Details
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-slate-700">
                <BankRow k="Account Holder" v={companyInfo.bankAccountHolder} />
                <BankRow k="Account No." v={companyInfo.bankAccountNumber} />
                <BankRow k="Bank Name" v={companyInfo.bankName} />
                <BankRow k="Branch" v={companyInfo.bankBranch} />
                <BankRow k="IFSC Code" v={companyInfo.bankIFSC} />
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-300 bg-slate-50 px-3 py-2 text-center text-[10px] text-slate-500">
              <strong>
                SUBJECT TO {companyInfo.jurisdiction} JURISDICTION
              </strong>{" "}
              | This is a System Generated Invoice
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const Row = ({ label, value }) => (
  <div className="mb-1">
    <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wide">
      {label}
    </div>
    <div className="font-bold text-slate-900">{value}</div>
  </div>
);

const SummaryRow = ({ label, value, highlight }) => (
  <div
    className={`flex items-center justify-between px-3 py-2 border-b border-slate-200 last:border-b-0 ${
      highlight ? "bg-slate-200 font-bold text-slate-900" : "text-slate-700"
    }`}
  >
    <span>{label}</span>
    <span>{value}</span>
  </div>
);

const BankRow = ({ k, v }) => (
  <div className="flex gap-2">
    <span className="text-slate-500 text-[10px] min-w-[100px]">{k}</span>
    <span className="font-semibold">: {v}</span>
  </div>
);

export default InvoiceViewModal;

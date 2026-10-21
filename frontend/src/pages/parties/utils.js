export const initialPartyForm = {
  partyName: "",
  partyType: "",
  contactNumber: "",
  gstNumber: "",
  gstRegistrationType: "",
  state: "",
  stateCode: "",
  postalAddress: "",
  postalCode: "",
  ledgerGroup: "",
  ledgerName: "",
  openingBalance: "",
  openingBalanceType: "Credit",
  country: "India",
  ledgerMobile: "",
  email: "",
  narration: "",
};

const GST_STATE_CODES = {
  "jammu and kashmir": "01",
  "himachal pradesh": "02",
  punjab: "03",
  chandigarh: "04",
  uttarakhand: "05",
  haryana: "06",
  delhi: "07",
  rajasthan: "08",
  "uttar pradesh": "09",
  bihar: "10",
  sikkim: "11",
  "arunachal pradesh": "12",
  nagaland: "13",
  manipur: "14",
  mizoram: "15",
  tripura: "16",
  meghalaya: "17",
  assam: "18",
  "west bengal": "19",
  jharkhand: "20",
  odisha: "21",
  orissa: "21",
  chhattisgarh: "22",
  "madhya pradesh": "23",
  gujarat: "24",
  "dadra and nagar haveli and daman and diu": "26",
  maharashtra: "27",
  karnataka: "29",
  goa: "30",
  lakshadweep: "31",
  kerala: "32",
  "tamil nadu": "33",
  puducherry: "34",
  pondicherry: "34",
  "andaman and nicobar islands": "35",
  telangana: "36",
  "andhra pradesh": "37",
  ladakh: "38",
  "other territory": "97",
  "other country": "99",
};

export function getGstStateCode(state) {
  const normalizedState = String(state || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  return GST_STATE_CODES[normalizedState] || "";
}

export function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatAmount(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "0.00";

  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getCompanyId(company) {
  return (
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id ||
    null
  );
}

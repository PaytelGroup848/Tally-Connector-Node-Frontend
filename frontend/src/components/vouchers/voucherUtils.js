import { getUniqueFields } from "../../utils/columnUtils";

export function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "NA";
  }

  if (typeof value === "number") {
    return value.toLocaleString("en-IN");
  }

  return String(value);
}

export function formatIstDate(value) {
  if (value === null || value === undefined || value === "") {
    return "NA";
  }

  const rawValue = String(value).trim();
  const dateValue = /^\d{4}-\d{2}-\d{2}$/.test(rawValue)
    ? new Date(
        Number(rawValue.slice(0, 4)),
        Number(rawValue.slice(5, 7)) - 1,
        Number(rawValue.slice(8, 10)),
      )
    : new Date(rawValue);

  if (Number.isNaN(dateValue.getTime())) {
    return String(value);
  }

  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
  }).format(dateValue);
}

export function formatCellValue(value, column = "") {
  if (value === null || value === undefined || value === "") {
    return "NA";
  }

  const normalizedColumn = normalizeColumnKey(column);

  if (
    normalizedColumn.includes("date") ||
    normalizedColumn.includes("time") ||
    normalizedColumn.endsWith("at")
  ) {
    return formatIstDate(value);
  }

  return formatValue(value);
}

export function isStructuredValue(value) {
  return value !== null && typeof value === "object";
}

export function isViewableField(key, value) {
  const normalizedKey = normalizeColumnKey(key);

  return (
    isStructuredValue(value) ||
    normalizedKey.includes("error") ||
    normalizedKey.includes("message")
  );
}

export function getDetailEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index + 1), item]);
  }

  if (value && typeof value === "object") {
    return Object.entries(value);
  }

  return [];
}

export function formatColumnLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());
}

export function normalizeColumnKey(key) {
  return String(key)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function isIdentifierColumn(key) {
  const normalizedKey = normalizeColumnKey(key);

  return (
    normalizedKey === "id" ||
    normalizedKey.endsWith("id") ||
    normalizedKey.endsWith("guid")
  );
}

export function isHiddenColumn(key) {
  const normalizedKey = normalizeColumnKey(key);

  return (
    isIdentifierColumn(key) ||
    normalizedKey === "vouchernumber" ||
    (normalizedKey.includes("date") && normalizedKey.length == 4) ||
    (normalizedKey.includes("v") && normalizedKey.length == 1) ||
    normalizedKey === "raw" ||
    normalizedKey === "source"
  );
}

export function getVoucherTypeValue(value) {
  if (typeof value === "string") return value;

  if (value && typeof value === "object") {
    return String(
      value.voucherType || value.voucher_type || value.name || value.type || "",
    );
  }

  return "";
}

export function getUniqueVoucherColumns(fields = []) {
  return getUniqueFields(fields, {
    isHidden: (field) => isHiddenColumn(field),
  });
}

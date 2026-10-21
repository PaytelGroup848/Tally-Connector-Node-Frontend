export const ROLE_OPTIONS = [
  {
    value: "VIEWER",
    label: "View Only",
  },
  {
    value: "ACCOUNTANT",
    label: "View & Create",
  },
  {
    value: "ADMIN",
    label: "Admin Access",
  },
];

export function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
}

/* ============================================================
   USERS TABLE
============================================================ */

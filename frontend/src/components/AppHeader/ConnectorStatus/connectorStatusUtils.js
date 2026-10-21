export function formatConnectorDateTime(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function getConnectorStatusType(status) {
  const key = String(status || "").toLowerCase();
  if (["online", "active", "connected"].includes(key)) return "online";
  if (["offline", "inactive", "disconnected"].includes(key)) return "offline";
  return "unknown";
}

export function getConnectorDotClass(statusType) {
  if (statusType === "online") {
    return "bg-emerald-600 shadow-[0_0_8px_rgba(52,211,153,0.65)]";
  }
  if (statusType === "offline") {
    return "bg-red-600 shadow-[0_0_8px_rgba(248,113,113,0.55)]";
  }
  return "bg-red-200 shadow-[0_0_8px_rgba(248,113,113,0.55)]";
}

export function getConnectorBadgeClass(statusType) {
  if (statusType === "online") {
    return "border border-emerald-600 bg-emerald-300/[0.10] text-emerald-600";
  }
  if (statusType === "offline") {
    return "border border-red-500 bg-red-300 text-red-600";
  }
  return "border border-red-600 bg-red-300/[0.08] text-red-700";
}

export function getTallyConnectionClass(tallyConnected) {
  if (tallyConnected === true) return "text-emerald-600";
  if (tallyConnected === false) return "text-red-600";
  return "text-red-300";
}

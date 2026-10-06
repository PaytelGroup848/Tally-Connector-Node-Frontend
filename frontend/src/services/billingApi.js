import useAuthStore from "../store/authStore";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://connector.cloudata.in/api";

const authHeaders = () => {
  const token = useAuthStore.getState().accessToken;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res) => {
  if (res.status === 401) {
    // Token invalid → logout
    try {
      await useAuthStore.getState().logout();
    } catch (_) {}
    throw new Error("Session expired. Please login again.");
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || `Request failed (${res.status})`);
  }

  return data;
};

// -------- Subscription --------
export const fetchMySubscription = async () => {
  const res = await fetch(`${API_BASE}/billing/subscription/me`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data?.data?.subscription || null;
};

// -------- Invoices --------
export const fetchInvoices = async ({ page = 1, limit = 10 } = {}) => {
  const params = new URLSearchParams({ page, limit });
  const res = await fetch(`${API_BASE}/billing/invoices?${params}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data?.data || { items: [], total: 0, page: 1, limit: 10 };
};

export const fetchInvoiceById = async (invoiceId) => {
  const res = await fetch(`${API_BASE}/billing/invoices/${invoiceId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  const data = await handleResponse(res);
  return data?.data?.invoice || null;
};

// -------- PDF Download --------
export const downloadInvoicePdf = async (invoiceId, invoiceNumber) => {
  const res = await fetch(`${API_BASE}/billing/invoices/${invoiceId}/pdf`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to download invoice");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoiceNumber || "invoice"}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

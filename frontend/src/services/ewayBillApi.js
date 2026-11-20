const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  "https://connector.cloudata.in/api"
).replace(/\/$/, "");

// NIC Config save karo
export async function saveNICConfig(accessToken, companyId, payload) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/config`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "Failed to save NIC config");
  return data;
}

// NIC Config get karo (consignor auto-fill ke liye; password excluded)
export async function fetchNICConfig(accessToken, companyId) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/config`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!res.ok) return null;

  const data = await res.json().catch(() => ({}));
  return data.data || null;
}

// NIC Config verify karo
export async function verifyNICConfig(accessToken, companyId) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/config/verify`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.message || "NIC authentication failed");
  return data;
}

// List get karo
export async function fetchEwayBills(
  accessToken,
  companyId,
  page = 1,
  limit = 20,
  search = "",
) {
  const params = new URLSearchParams({ page, limit, q: search });
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills?${params}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch e-way bills");
  return res.json();
}

// List response se records array nikalo (backend shape vary kar sakta hai)
export function extractEwayBills(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.items)) return response.data.items;

  const pending = [response];
  const keys = ["ewayBills", "records", "items", "results", "rows", "data"];

  while (pending.length > 0) {
    const value = pending.shift();
    if (!value || typeof value !== "object") continue;

    for (const key of keys) {
      if (Array.isArray(value[key])) return value[key];
    }

    for (const child of Object.values(value)) {
      if (child && typeof child === "object") pending.push(child);
    }
  }

  return [];
}

export function extractEwayBillTotal(response, fallback = 0) {
  const total =
    response?.total ??
    response?.data?.total ??
    response?.pagination?.total ??
    response?.data?.pagination?.total;

  return Number.isFinite(Number(total)) ? Number(total) : fallback;
}

// Generate karo
export async function generateEwayBill(accessToken, companyId, payload) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/generate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to generate e-way bill");
  }
  return res.json();
}

// Details get karo
export async function fetchEwayBillDetails(accessToken, companyId, id) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/${id}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch details");
  return res.json();
}

// e-Invoice QR code get karo (linked e-Invoice se)
export async function fetchEwayBillQR(accessToken, companyId, id) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/${id}/qr`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to fetch QR code");
  return res.json();
}

// E-Way Bill HTML (PDF preview) get karo
export async function fetchEwayBillHtml(accessToken, companyId, id) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/${id}/html`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to load HTML");
  return res.text(); // HTML string
}

// E-Way Bill PDF download karo
export async function downloadEwayBillPdfFile(
  accessToken,
  companyId,
  id,
  ewayBillNo,
) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/${id}/pdf`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
  if (!res.ok) throw new Error("Failed to download PDF");

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `EWAY-BILL-${ewayBillNo || id}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Cancel karo
export async function cancelEwayBill(
  accessToken,
  companyId,
  id,
  reasonCode,
  remark,
) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/${id}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ cancelRsnCode: reasonCode, cancelRmrk: remark }),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to cancel");
  return data;
}

// Vehicle update karo
export async function updateVehicle(accessToken, companyId, id, payload) {
  const res = await fetch(
    `${API_BASE_URL}/companies/${companyId}/eway-bills/${id}/vehicle`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(payload),
    },
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Failed to update vehicle");
  return data;
}

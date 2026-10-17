const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  "https://connector.cloudata.in/api"
).replace(/\/$/, "");

// HTML fetch karo (modal ke iframe ke liye)
export async function fetchVoucherHtml(accessToken, companyId, voucherId) {
  if (!accessToken) throw new Error("Access token not found");
  if (!companyId) throw new Error("Company ID is required");
  if (!voucherId) throw new Error("Voucher ID is required");

  const response = await fetch(
    `${API_BASE_URL}/companies/${encodeURIComponent(companyId)}/vouchers/${encodeURIComponent(voucherId)}/html`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "Unable to load invoice preview.");
  }

  return response.text(); // HTML string
}

// PDF download karo (blob banao, phir download)
export async function downloadVoucherPdfFile(
  accessToken,
  companyId,
  voucherId,
  fileName = "voucher",
) {
  if (!accessToken) throw new Error("Access token not found");
  if (!companyId) throw new Error("Company ID is required");
  if (!voucherId) throw new Error("Voucher ID is required");

  const response = await fetch(
    `${API_BASE_URL}/companies/${encodeURIComponent(companyId)}/vouchers/${encodeURIComponent(voucherId)}/pdf`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data?.message || "Unable to download PDF.");
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

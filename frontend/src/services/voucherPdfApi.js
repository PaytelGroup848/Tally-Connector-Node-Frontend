import useAuthStore from "../store/authStore";

const BaseUrl =
  import.meta.env.VITE_API_BASE_URL ||
  "https://connector.cloudata.in/api" ||
  "http://localhost:5000/api";

export const downloadVoucherPdf = async (companyId, voucher) => {
  const token = useAuthStore.getState().accessToken;

  const res = await fetch(
    `${BaseUrl}/companies/${companyId}/vouchers/${voucher._id}/pdf`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "PDF download failed");
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${voucher.voucherType}-${voucher.voucherNumber}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
};

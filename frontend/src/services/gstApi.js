import axios from "axios";

export async function lookupGstin(gstin) {
  const formData = new FormData();
  formData.append("gstin", gstin.trim().toUpperCase());

  const res = await axios.post("/tally-api/gstin-serach-api.php", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

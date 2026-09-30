const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  "https://connector.cloudata.in/api"
).replace(/\/$/, "");

export async function fetchSuperAdminUsers({
  accessToken,
  page = 1,
  limit = 500,
  q = "",
  signal,
}) {
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    q,
  });

  const response = await fetch(
    `${API_BASE_URL}/super-admin/users?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      signal,
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to fetch super admin users");
  }

  return data;
}

export async function updateSuperAdminUserSuspension({
  accessToken,
  id,
  isSuspended,
}) {
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await fetch(
    `${API_BASE_URL}/super-admin/users/${encodeURIComponent(id)}/suspend`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ isSuspended }),
    },
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to update user suspension");
  }

  return data;
}

export async function createSuperAdminUser({
  accessToken,
  email,
  organizationName,
}) {
  if (!accessToken) {
    throw new Error("Access token not found");
  }

  const response = await fetch(`${API_BASE_URL}/super-admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ email, organizationName }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "Failed to create user");
  }

  return data;
}

import { request } from "./client";

export function fetchCompanySettings(accessToken, companyId) {
  return request(
    `/companies/${encodeURIComponent(companyId)}/settings`,
    accessToken,
  )
}

export function extractCompanyProfile(response) {
  return response?.data?.profile || response?.profile || {}
}

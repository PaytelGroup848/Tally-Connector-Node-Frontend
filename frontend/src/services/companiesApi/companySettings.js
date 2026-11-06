import { request } from "./client";

export function fetchCompanySettings(accessToken, companyId) {
  return request(
    `/companies/${encodeURIComponent(companyId)}/settings`,
    accessToken,
  )
}

export function fetchCompanyDataYear(accessToken, companyId) {
  return request(
    `/companies/${encodeURIComponent(companyId)}/companydatayear`,
    accessToken,
  )
}

export function extractCompanyProfile(response) {
  return response?.data?.profile || response?.profile || {}
}

export function extractCompanyDataYear(response) {
  const candidates = [
    response?.data?.data,
    response?.data,
    response?.companyDataYear,
    response,
  ]

  return candidates.find(
    (candidate) =>
      candidate?.companyDataStartDate || candidate?.companyDataEndDate,
  ) || {}
}

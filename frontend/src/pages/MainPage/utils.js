export const selectedCompanyStorageKey = "selectedCompanyId"

export function getCompanyId(company) {
  return (
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id
  );
}

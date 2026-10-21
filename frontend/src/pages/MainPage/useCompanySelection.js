import { getCompanyId, selectedCompanyStorageKey } from "./utils"

export default function useCompanySelection({
  selectedCompanyRef,
  setSelectedCompany,
  setCompanyOptions,
  setShowCompanyMenu,
}) {
  const handleCompanyAdd = () => {
    const candidate = {
      name: "",
      meta: "",
      isCurrent: true,
    }

    setCompanyOptions((current) => {
      const next = current.map((company) => ({
        ...company,
        isCurrent: false,
      }))
      const alreadyExists = next.some(
        (company) => company.name === candidate.name,
      )

      return alreadyExists ? next : [candidate, ...next]
    })

    selectedCompanyRef.current = candidate
    setSelectedCompany(candidate)

    if (typeof window !== "undefined" && getCompanyId(candidate)) {
      window.localStorage.setItem(
        selectedCompanyStorageKey,
        String(getCompanyId(candidate)),
      )
    }

    setShowCompanyMenu(false)
  }

  const selectCompany = (company) => {
    if (!company) return

    const companyId = getCompanyId(company)
    const nextCompany = { ...company, isCurrent: true }

    selectedCompanyRef.current = nextCompany
    setSelectedCompany(nextCompany)
    setCompanyOptions((current) =>
      current.map((option) => ({
        ...option,
        isCurrent:
          option === company ||
          (companyId &&
            getCompanyId(option) &&
            String(getCompanyId(option)) === String(companyId)),
      })),
    )

    if (typeof window !== "undefined" && companyId) {
      window.localStorage.setItem(
        selectedCompanyStorageKey,
        String(companyId),
      )
    }

    setShowCompanyMenu(false)
  }

  return { handleCompanyAdd, selectCompany }
}

export default function useMainPageNavigation(setShowEway) {
  const navigateTo = (path) => {
    if (!path) return

    setShowEway(path === "/eway" || path === "/e-way")

    if (window.location.pathname === path) return

    window.history.pushState({}, "", path)
    window.dispatchEvent(new PopStateEvent("popstate"))
  }

  const handleNavigate = (event, path) => {
    if (!path) return
    event.preventDefault()
    navigateTo(path)
  }

  const openQuotation = (event) => {
    handleNavigate(event, "/create-voucher/Quotation")
  }

  const openMobileVersion = () => {
    window.open(
      "/dashboard",
      "_blank",
      "width=390,height=844,noopener,noreferrer",
    )
  }

  const openDashboard = (event) => {
    handleNavigate(event, "/dashboard")
    setShowEway(false)
  }

  return {
    navigateTo,
    openQuotation,
    openMobileVersion,
    openDashboard,
  }
}

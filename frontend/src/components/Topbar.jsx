function Topbar({ sidebarCollapsed, setSidebarCollapsed, children }) {
  return <header className="topbar"><button type="button" aria-label="Menu" aria-expanded={!sidebarCollapsed} onClick={() => setSidebarCollapsed((current) => !current)} className="menu-button">☰</button>{children}</header>
}

export default Topbar

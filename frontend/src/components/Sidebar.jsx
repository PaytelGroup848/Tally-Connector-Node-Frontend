import { X } from 'lucide-react'
import logo from '../assets/cloudedata.svg'
import { navItems, submenuItems } from '../routes/navigation'

function Arrow() {
  return <span className="ml-auto text-xl leading-none" aria-hidden="true">›</span>
}

function Sidebar({ collapsed, isCompact, setSidebarCollapsed, currentPath, showDashboard, expandedNav, setExpandedNav, onDashboard, onQuotation, onNavigate, onPlanClick }) {
  const entryPath = currentPath.toLowerCase()
  const isSubmenuActive = (itemPath) => entryPath === itemPath.toLowerCase()
  const isCollectPaymentsRoute = label => label === 'Collect Payments' && ['/receivables', '/receivablesnew'].includes(entryPath)
  const isCashBankRoute = label => label === 'Cash & Bank' && (entryPath.startsWith('/cash/') || entryPath.startsWith('/bank/') || entryPath === '/cash-bank/cash' || entryPath === '/cash-bank/bank')
  const isNavExpanded = (label, path) => expandedNav[label] ?? (currentPath.startsWith(`/${path}`) || submenuItems[label]?.some(([, itemPath]) => isSubmenuActive(itemPath)))

  const handleNavClick = (event, targetPath) => {
    if (!targetPath) return
    event.preventDefault()
    onNavigate(targetPath)
  }

  return (
    <aside className={`app-sidebar fixed left-0 top-0 z-30 flex h-screen shrink-0 flex-col text-white transition-all duration-200 ${isCompact ? `${collapsed ? '-translate-x-full' : 'translate-x-0'} w-[200px]` : collapsed ? 'w-[58px]' : 'w-[200px]'}`} data-collapsed={collapsed}>
      {isCompact && !collapsed && (
        <div className="flex justify-end px-3 pt-3">
          <button type="button" aria-label="Close sidebar" onClick={() => setSidebarCollapsed(true)} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/10">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
      <button type="button" className={`sidebar-brand flex h-[60px] w-full shrink-0 items-center gap-2 border-0 px-2 text-left text-neutral-800 ${collapsed ? 'justify-center px-0' : ''}`} onClick={onDashboard} aria-label="Go to dashboard">
        <img className="h-[300px] w-[300px] shrink-0 object-contain " src={logo} alt="Cloudedata" />
        
      </button>
      <nav className="overflow-y-auto px-3 py-4">
        {navItems.map(([IconComponent, label, expandable, badge, path]) => {
          const isDataBackupItem = label === 'Data Backup'
          const targetPath = label === 'Dashboard' ? '/dashboard' : `/${path}`

          return (
            <div className="group" key={label}>
              <a
                className={`sidebar-link flex h-[40px] w-full items-center gap-3 rounded-lg px-3 text-left text-[12px] font-semibold no-underline transition-colors ${((label === 'Dashboard' && showDashboard) || isCollectPaymentsRoute(label) || isCashBankRoute(label) || currentPath.startsWith(`/${path}`) || submenuItems[label]?.some(([, itemPath]) => isSubmenuActive(itemPath))) ? 'is-active bg-white text-neutral-900' : 'text-neutral-300 hover:bg-white/10 hover:text-white'}`}
                href={expandable ? undefined : targetPath}
                onClick={(event) => {
                  if (expandable) {
                    event.preventDefault()
                    setExpandedNav((current) => ({ ...current, [label]: !isNavExpanded(label, path) }))
                    return
                  }

                  if (label === 'Dashboard') {
                    onDashboard(event)
                    return
                  }

                  handleNavClick(event, targetPath)
                }}
              >
                <span className="flex w-4 shrink-0 items-center justify-center text-center"><IconComponent className="h-4 w-4" /></span>{!collapsed && <><span>{label}</span>{badge && <em className="ml-auto rounded bg-red-500 px-1.5 py-0.5 text-[9px] not-italic text-white">{badge}</em>}{expandable && <Arrow />}</>}
              </a>
              {!collapsed && submenuItems[label] && isNavExpanded(label, path) && <div className="flex flex-col pb-2 pl-8">{submenuItems[label].map(([item, itemPath]) => <a className={`px-2 py-1.5 text-[11px] no-underline ${isSubmenuActive(itemPath) ? 'text-green-500' : 'text-neutral-100 hover:text-green-400'}`} href={itemPath} onClick={(event) => { if (itemPath === '/create-voucher/Quotation') { onQuotation(event); return } handleNavClick(event, itemPath) }} key={item}>{item} <span className="float-right">›</span></a>)}</div>}
            </div>
          )
        })}
      </nav>
      {!collapsed && <div className="sidebar-support mt-auto mx-3 mb-4 rounded-lg px-3 py-3 text-[10px]"><span className="inline-flex items-center justify-center align-middle"><div className="h-2 w-2 rounded-full bg-emerald-400" aria-hidden="true" /></span>&nbsp; <u>+91 9311472357</u></div>}
    </aside>
  )
}

export default Sidebar

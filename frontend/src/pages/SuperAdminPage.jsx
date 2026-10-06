import React, { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import SuperAdminUsersPage from './SuperAdminUsersPage'
import SuperAdminPlansPage from './SuperAdminPlansPage'
import AllOrganisationsPage from './SuperAdminAllOrganisationsPage'
import {
    Users,
    CreditCard,
    Building2,
    Menu,
    X,
} from 'lucide-react'

const SuperAdminPage = () => {
    const navigate = useNavigate()
    const location = useLocation()

    const [sidebarOpen, setSidebarOpen] = useState(false)

    /*
     * =========================================================
     * ROOT SUPER ADMIN ROUTE
     *
     * /super-admin
     *      ↓
     * /super-admin/users
     * =========================================================
     */
    if (location.pathname === '/super-admin') {
        return (
            <Navigate
                to="/super-admin/users"
                replace
            />
        )
    }

    /*
     * =========================================================
     * ACTIVE NAVIGATION
     * =========================================================
     */

    const navItems = [
        {
            label: 'Users',
            icon: Users,
            path: '/super-admin/users',
        },
        {
            label: 'Plans',
            icon: CreditCard,
            path: '/super-admin/plans',
        },
         {
            label: 'All Organisations / Invoices',
                icon: Building2,
            path: '/super-admin/organisations',
        },
    ]

    /*
     * =========================================================
     * NAVIGATION
     * =========================================================
     */

    const handleNavClick = (item) => {
        setSidebarOpen(false)
        navigate(item.path)
    }

    return (
        <div className="min-h-screen bg-[#f7f9fc] text-[#17355f]">

            {/* =================================================
                MOBILE OVERLAY
                ================================================= */}

            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-[90] bg-slate-950/40 lg:hidden"
                />
            )}

            {/* =================================================
                SIDEBAR
                ================================================= */}

            <aside
                className={`
                    fixed
                    left-0
                    top-0
                    z-[100]
                    flex
                    h-screen
                    w-[250px]
                    flex-col
                    border-r
                    border-[#dfe7f0]
                    bg-white
                    transition-transform
                    duration-200
                    lg:translate-x-0
                    ${
                        sidebarOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }
                `}
            >

                {/* =================================================
                    LOGO / BRAND
                    ================================================= */}

                <div className="flex h-[70px] items-center border-b border-[#e5ebf2] px-5">
                    <div className="flex items-center gap-3">

                        {/* LOGO TEXT */}
                        <div>
                            <p className="text-[15px] font-bold text-[#17355f]">
                                CtrlBooks
                            </p>

                            <p className="text-[10px] font-medium text-slate-400">
                                Super Admin
                            </p>
                        </div>
                    </div>

                    {/* MOBILE CLOSE BUTTON */}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* =================================================
                    SIDEBAR CONTENT
                    ================================================= */}

                <div className="flex flex-1 flex-col px-3 py-5">

                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Administration
                    </p>

                    <nav className="space-y-1">

                        {navItems.map((item) => {
                            const Icon = item.icon

                            const isActive =
                                location.pathname === item.path

                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() =>
                                        handleNavClick(item)
                                    }
                                    className={`
                                        flex
                                        w-full
                                        items-center
                                        gap-3
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-left
                                        text-[12px]
                                        font-semibold
                                        transition

                                        ${
                                            isActive
                                                ? 'bg-emerald-50 text-[#059669]'
                                                : 'text-slate-500 hover:bg-slate-50 hover:text-[#17355f]'
                                        }
                                    `}
                                >

                                    <Icon
                                        size={17}
                                        strokeWidth={
                                            isActive
                                                ? 2.2
                                                : 1.8
                                        }
                                    />

                                    <span>
                                        {item.label}
                                    </span>

                                    {isActive && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#059669]" />
                                    )}
                                </button>
                            )
                        })}

                    </nav>

                </div>
            </aside>

            {/* =================================================
                MAIN AREA
                ================================================= */}

            <div className="min-h-screen lg:pl-[250px]">

                {/* =================================================
                    TOP NAVBAR
                    ================================================= */}

                <header className="sticky top-0 z-50 flex h-[70px] items-center justify-between border-b border-[#dfe7f0] bg-white px-4 sm:px-6 lg:px-7">

                    {/* LEFT SIDE */}
                    <div className="flex items-center gap-3">

                        {/* MOBILE MENU */}
                        <button
                            type="button"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden"
                            aria-label="Open sidebar"
                        >
                            <Menu size={18} />
                        </button>

                        {/* PAGE TITLE */}
                        {/* <div>

                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#059669]">
                                Admin Console
                            </p>

                            <h1 className="text-[15px] font-bold text-[#17355f]">
                                {location.pathname === '/super-admin/plans'
                                    ? 'Plans'
                                    : location.pathname === '/super-admin/organisations'
                                        ? 'All Organisations / Invoices'
                                        : 'Users'}
                            </h1>

                        </div> */}
                    </div>

                    {/* RIGHT SIDE */}
                    <div className="flex items-center gap-2 sm:gap-4">

                        {/* DIVIDER */}
                        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

                        {/* =================================================
                            PROFILE
                            ================================================= */}

                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-slate-50"
                        >

                            {/* PROFILE AVATAR */}
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-[#059669]">
                                SA
                            </div>

                            {/* PROFILE TEXT */}
                            <div className="hidden text-left sm:block">

                                <p className="text-[11px] font-bold text-[#17355f]">
                                    Super Admin
                                </p>

                                <p className="text-[10px] text-slate-400">
                                    Administrator
                                </p>

                            </div>

                        </button>

                    </div>
                </header>

                {/* =================================================
                    PAGE CONTENT
                    ================================================= */}

                <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-7">

                    {location.pathname === '/super-admin/users' ? (
                        <SuperAdminUsersPage />
                    ) : location.pathname === '/super-admin/plans' ? (
                        <SuperAdminPlansPage />
                    ) : location.pathname === '/super-admin/organisations' ? (
                        <AllOrganisationsPage />
                    ) : (
                        <Navigate
                            to="/super-admin/users"
                            replace
                        />
                    )}

                </main>
            </div>
        </div>
    )
}

export default SuperAdminPage
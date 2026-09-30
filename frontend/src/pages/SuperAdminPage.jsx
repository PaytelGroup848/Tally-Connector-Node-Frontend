import React, { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SuperAdminUsersPage from './SuperAdminUsersPage'
import {
    LayoutDashboard,
    Users,
    Building2,
    CreditCard,
    Settings,
    Search,
    User,
    Bell,
    ChevronDown,
    MoreVertical,
    Plus,
    Activity,
    LogOut,
    Menu,
    X,
} from 'lucide-react'

const SuperAdminPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const activeNav = location.pathname === '/super-admin/users' ? 'Users' : 'Dashboard'
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const users = [
        {
            id: 1,
            name: 'Rahul Sharma',
            email: 'rahul@abccompany.com',
            company: 'ABC Enterprises',
            role: 'Admin',
            status: 'Active',
            lastLogin: '29 Sep 2026, 05:20 PM',
        },
        {
            id: 2,
            name: 'Priya Mehta',
            email: 'priya@mehtafoods.com',
            company: 'Mehta Foods',
            role: 'User',
            status: 'Active',
            lastLogin: '29 Sep 2026, 04:45 PM',
        },
        {
            id: 3,
            name: 'Amit Verma',
            email: 'amit@vermaindustries.com',
            company: 'Verma Industries',
            role: 'Manager',
            status: 'Inactive',
            lastLogin: '27 Sep 2026, 11:10 AM',
        },
        {
            id: 4,
            name: 'Neha Gupta',
            email: 'neha@guptatraders.com',
            company: 'Gupta Traders',
            role: 'Admin',
            status: 'Active',
            lastLogin: '28 Sep 2026, 02:25 PM',
        },
        {
            id: 5,
            name: 'Vikas Jain',
            email: 'vikas@jainretail.com',
            company: 'Jain Retail',
            role: 'User',
            status: 'Pending',
            lastLogin: 'Never',
        },
        {
            id: 6,
            name: 'Pooja Singh',
            email: 'pooja@singhcorp.com',
            company: 'Singh Corp',
            role: 'Manager',
            status: 'Active',
            lastLogin: '29 Sep 2026, 01:35 PM',
        },
    ]

    const navItems = [
        {
            label: 'Dashboard',
            icon: LayoutDashboard,
            path: '/super-admin',
        },
        {
            label: 'Users',
            icon: Users,
            path: '/super-admin/users',
        },
        {
            label: 'Companies',
            icon: Building2,
            path: '/companies',
        },
        {
            label: 'Plans & Billing',
            icon: CreditCard,
            path: '/plans-billing',
        },
        {
            label: 'Activity Logs',
            icon: Activity,
            path: '/activity-logs',
        },
        {
            label: 'Settings',
            icon: Settings,
            path: '/settings',
        },
    ]

    const filteredUsers = useMemo(() => {
        return users.filter((user) => {
            const query = search.toLowerCase().trim()

            const matchesSearch =
                user.name.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query) ||
                user.company.toLowerCase().includes(query)

            const matchesStatus =
                statusFilter === 'All' ||
                user.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [search, statusFilter])

    const getStatusClasses = (status) => {
        if (status === 'Active') {
            return 'border border-emerald-200 bg-emerald-50 text-emerald-700'
        }

        if (status === 'Pending') {
            return 'border border-amber-200 bg-amber-50 text-amber-700'
        }

        return 'border border-slate-200 bg-slate-100 text-slate-600'
    }

    const handleNavClick = (item) => {
        setSidebarOpen(false)

        navigate(item.path)
    }

    return (
        <div className="min-h-screen bg-[#f7f9fc] text-[#17355f]">
            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-[90] bg-slate-950/40 lg:hidden"
                />
            )}

            {/* SIDEBAR */}
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
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                {/* LOGO */}
                <div className="flex h-[70px] items-center border-b border-[#e5ebf2] px-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#059669]">
                        </div>

                        <div>
                            <p className="text-[15px] font-bold text-[#17355f]">
                                CtrlBooks
                            </p>

                            <p className="text-[10px] font-medium text-slate-400">
                                Super Admin
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 lg:hidden"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* SIDEBAR CONTENT */}
                <div className="flex flex-1 flex-col px-3 py-5">
                    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                        Administration
                    </p>

                    <nav className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = activeNav === item.label

                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() => handleNavClick(item)}
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
                                        strokeWidth={isActive ? 2.2 : 1.8}
                                    />

                                    <span>{item.label}</span>

                                    {item.label === 'Users' && isActive && (
                                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#059669]" />
                                    )}
                                </button>
                            )
                        })}
                    </nav>

                    {/* LOGOUT */}
                    <div className="mt-auto">
                        <div className="mb-3 border-t border-slate-100" />

                        <button
                            type="button"
                            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[12px] font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                            <LogOut size={17} />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* MAIN AREA */}
            <div className="min-h-screen lg:pl-[250px]">
                {/* TOP NAVBAR */}
                <header className="sticky top-0 z-50 flex h-[70px] items-center justify-between border-b border-[#dfe7f0] bg-white px-4 sm:px-6 lg:px-7">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setSidebarOpen(true)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 lg:hidden"
                        >
                            <Menu size={18} />
                        </button>

                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#059669]">
                                Admin Console
                            </p>

                            <h1 className="text-[15px] font-bold text-[#17355f]">
                                {activeNav}
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* SEARCH */}
                        <div className="relative hidden md:block">
                            <Search
                                size={15}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                type="text"
                                placeholder="Search..."
                                className="h-9 w-[200px] rounded-lg border border-slate-200 bg-[#f9fafb] pl-9 pr-3 text-[11px] text-slate-700 outline-none transition focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20"
                            />
                            
                        </div>

                        {/* NOTIFICATION */}
                        <button
                            type="button"
                            className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                            <Bell size={17} />
                            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
                        </button>

                        <div className="hidden h-7 w-px bg-slate-200 sm:block" />

                        {/* PROFILE */}
                        <button
                            type="button"
                            className="flex items-center gap-2 rounded-lg px-1.5 py-1.5 hover:bg-slate-50"
                        >
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-[#059669]">
                                SA
                            </div>

                            <div className="hidden text-left sm:block">
                                <p className="text-[11px] font-bold text-[#17355f]">
                                    Super Admin
                                </p>

                                <p className="text-[10px] text-slate-400">
                                    Administrator
                                </p>
                            </div>

                            <ChevronDown
                                size={14}
                                className="hidden text-slate-400 sm:block"
                            />
                        </button>
                    </div>
                </header>

                {/* PAGE CONTENT */}
                <main className="px-4 py-5 sm:px-6 lg:px-7 lg:py-7">
                    {location.pathname === '/super-admin/users' ? (
                        <SuperAdminUsersPage />
                    ) : (
                        <div className="mx-auto max-w-[1450px]">
                        {/* PAGE HEADING */}
                        <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.13em] text-[#059669]">
                                    User Management
                                </p>

                                <h2 className="text-[24px] font-bold tracking-tight text-[#17355f]">
                                    Users
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Manage platform users, roles, access and
                                    account status.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#059669] px-4 text-[12px] font-semibold text-white shadow-sm transition hover:bg-[#047857]"
                            >
                                <Plus size={16} />
                                Add User
                            </button>
                        </div>

                        {/* USERS TABLE */}
                        <section className="overflow-hidden rounded-xl border border-[#dfe7f0] bg-white shadow-sm">
                            {/* TABLE TOOLBAR */}
                            <div className="flex flex-col gap-3 border-b border-[#e5ebf2] px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-[#17355f]">
                                        All Users
                                    </h3>

                                    <p className="mt-1 text-[10px] text-slate-400">
                                        {filteredUsers.length} users found
                                    </p>
                                </div>

                                <div className="flex flex-col gap-2 sm:flex-row">
                                    <div className="relative">
                                        <Search
                                            size={15}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(event) =>
                                                setSearch(event.target.value)
                                            }
                                            placeholder="Search users..."
                                            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-[11px] text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#059669] focus:ring-1 focus:ring-[#059669]/20 sm:w-[230px]"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(event.target.value)
                                        }
                                        className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-[11px] text-slate-600 outline-none focus:border-[#059669]"
                                    >
                                        <option value="All">All Status</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">
                                            Inactive
                                        </option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>

                            {/* TABLE */}
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[950px] border-collapse">
                                    <thead>
                                        <tr className="bg-[#f7f9fc] text-left">
                                            <th className="border-b border-[#e5ebf2] px-5 py-3 text-[10px] font-bold uppercase tracking-wide text-[#52708f]">
                                                User
                                            </th>

                                            <th className="border-b border-[#e5ebf2] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#52708f]">
                                                Company
                                            </th>

                                            <th className="border-b border-[#e5ebf2] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#52708f]">
                                                Role
                                            </th>

                                            <th className="border-b border-[#e5ebf2] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#52708f]">
                                                Status
                                            </th>

                                            <th className="border-b border-[#e5ebf2] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-[#52708f]">
                                                Last Login
                                            </th>

                                            <th className="border-b border-[#e5ebf2] px-4 py-3 text-center text-[10px] font-bold uppercase tracking-wide text-[#52708f]">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="border-b border-[#edf1f5] last:border-b-0 hover:bg-[#fbfefd]"
                                                >
                                                    <td className="px-5 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-[10px] font-bold text-[#059669]">
                                                                {user.name
                                                                    .split(' ')
                                                                    .map(
                                                                        (
                                                                            part,
                                                                        ) =>
                                                                            part.charAt(
                                                                                0,
                                                                            ),
                                                                    )
                                                                    .slice(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .join('')}
                                                            </div>

                                                            <div className="min-w-0">
                                                                <p className="truncate text-[12px] font-semibold text-[#17355f]">
                                                                    {user.name}
                                                                </p>

                                                                <p className="truncate text-[10px] text-slate-400">
                                                                    {user.email}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Building2
                                                                size={14}
                                                                className="text-slate-400"
                                                            />

                                                            <span className="text-[11px] font-medium text-slate-600">
                                                                {user.company}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                                                            {user.role}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span
                                                            className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold ${getStatusClasses(
                                                                user.status,
                                                            )}`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <span className="text-[10px] text-slate-500">
                                                            {user.lastLogin}
                                                        </span>
                                                    </td>

                                                    <td className="px-4 py-4">
                                                        <div className="flex justify-center">
                                                            <button
                                                                type="button"
                                                                className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-[#059669]"
                                                            >
                                                                <MoreVertical
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-5 py-12 text-center"
                                                >
                                                    <div className="flex flex-col items-center">
                                                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                                                            <button onClick={() => navigate('/users')}>
                                                                <Users
                                                                    size={20}
                                                                    className="text-slate-400"
                                                                />
                                                            </button>
                                                        </div>

                                                        <p className="text-sm font-semibold text-slate-600">
                                                            No users found
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Try a different
                                                            search or status
                                                            filter.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* FOOTER */}
                            <div className="flex flex-col items-center justify-between gap-3 border-t border-[#e5ebf2] px-5 py-3 sm:flex-row">
                                <p className="text-[10px] text-slate-400">
                                    Showing{' '}
                                    <span className="font-semibold text-slate-600">
                                        {filteredUsers.length}
                                    </span>{' '}
                                    of{' '}
                                    <span className="font-semibold text-slate-600">
                                        {users.length}
                                    </span>{' '}
                                    users
                                </p>

                                <div className="flex items-center gap-1">
                                    <button
                                        type="button"
                                        className="rounded-md border border-slate-200 px-3 py-1.5 text-[10px] text-slate-500 hover:bg-slate-50"
                                    >
                                        Previous
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-md bg-[#059669] px-3 py-1.5 text-[10px] font-semibold text-white"
                                    >
                                        1
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-md border border-slate-200 px-3 py-1.5 text-[10px] text-slate-500 hover:bg-slate-50"
                                    >
                                        2
                                    </button>

                                    <button
                                        type="button"
                                        className="rounded-md border border-slate-200 px-3 py-1.5 text-[10px] text-slate-500 hover:bg-slate-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        </section>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default SuperAdminPage


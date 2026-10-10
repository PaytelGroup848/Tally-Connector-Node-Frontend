import { useEffect, useRef, useState } from 'react'
import {
    Building2,
    Settings,
    Landmark,
    ChevronRight,
    X,
    Pencil,
    Trash2,
    Star,
    Upload,
    Save,
    Plus,
} from 'lucide-react'

import useAuthStore from '../store/authStore'
import {
    deleteCompanyLogo,
    deleteCompanyBank,
    createCompanyBank,
    fetchCompanyBanks,
    fetchCompanySettings,
    setDefaultCompanyBank,
    getCompanyLogoUrl,
    updateCompanyBank,
    updateCompanySettings,
    uploadCompanyLogo,
} from '../services/BanksApi'
import {
    extractCompanies,
    fetchCompanies,
    normalizeCompany,
} from '../services/companiesApi'


const COMPANY_SETTING_FIELDS = [
    { name: 'address', label: 'Address', type: 'text' },
    { name: 'gstin', label: 'GSTIN', type: 'text' },
    { name: 'cin', label: 'CIN', type: 'text' },
    { name: 'pan', label: 'PAN', type: 'text' },
    { name: 'mobile', label: 'Mobile', type: 'tel' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'website', label: 'Website (optional)', type: 'text' },
    { name: 'state', label: 'State', type: 'text' },
    { name: 'stateCode', label: 'State Code', type: 'text' },
    { name: 'termsAndConditions', label: 'Terms and Conditions (optional)', type: 'textarea' },
]

const EMPTY_BANK_FORM = {
    bankName: '',
    under: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    swiftCode: '',
    branchName: '',
    isDefault: false,
}

const extractBankList = (response) => {
    if (Array.isArray(response)) return response

    const pending = [response]
    while (pending.length > 0) {
        const value = pending.shift()
        if (!value || typeof value !== 'object') continue
        if (Array.isArray(value)) return value

        for (const [key, child] of Object.entries(value)) {
            const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
            if (
                Array.isArray(child) &&
                ['banks', 'bankdetails', 'items', 'records', 'results'].includes(normalizedKey)
            ) {
                return child
            }
            if (child && typeof child === 'object') pending.push(child)
        }
    }

    return []
}

const extractUnderOptions = (response, banks = []) => {
    const optionKeys = new Set(['underoptions', 'underlist', 'bankgroups', 'groups'])
    const pending = [response]
    const options = []

    while (pending.length > 0) {
        const value = pending.shift()
        if (!value || typeof value !== 'object') continue

        for (const [key, child] of Object.entries(value)) {
            const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '')
            if (optionKeys.has(normalizedKey) && Array.isArray(child)) {
                for (const option of child) {
                    const label = typeof option === 'string'
                        ? option
                        : option?.under || option?.groupName || option?.name || option?.label || option?.value
                    if (typeof label === 'string' && label.trim()) {
                        options.push(label.trim())
                    }
                }
            }
            if (child && typeof child === 'object') pending.push(child)
        }
    }

    for (const bank of banks) {
        if (typeof bank?.under === 'string' && bank.under.trim()) {
            options.push(bank.under.trim())
        }
    }

    return [...new Set(options)]
}

const getCompanySettingsData = (response) =>
    response?.data?.settings ??
    response?.settings ??
    response?.data ??
    response ??
    {}

const normalizeSettingKey = (key) =>
    key.toLowerCase().replace(/[^a-z0-9]/g, '')

const SETTING_FIELD_ALIASES = {
    address: ['address', 'companyaddress'],
    gstin: ['gstin', 'gstnumber', 'gstregistrationnumber'],
    cin: ['cin', 'corporateidentificationnumber'],
    pan: ['pan', 'pannumber'],
    mobile: ['mobile', 'mobilenumber', 'phone', 'phonenumber', 'contactnumber'],
    email: ['email', 'emailaddress'],
    website: ['website', 'websiteurl'],
    state: ['state', 'statename'],
    stateCode: ['statecode', 'stateid'],
    termsAndConditions: ['termsandconditions', 'termsconditions', 'terms', 'tnc'],
}

const findSettingValue = (sources, fieldName) => {
    const aliases = new Set(
        (SETTING_FIELD_ALIASES[fieldName] || [fieldName]).map(normalizeSettingKey),
    )
    let emptyValueFound = false

    for (const source of sources) {
        const pending = [source]
        while (pending.length > 0) {
            const value = pending.shift()
            if (!value || typeof value !== 'object') continue

            for (const [key, child] of Object.entries(value)) {
                if (aliases.has(normalizeSettingKey(key))) {
                    if (child !== null && child !== undefined && String(child).trim()) {
                        return String(child)
                    }
                    emptyValueFound = true
                }

                if (child && typeof child === 'object') pending.push(child)
            }
        }
    }

    return emptyValueFound ? '' : undefined
}

const getSettingsFormValues = (response, fallbackCompany) => {
    const sources = [
        getCompanySettingsData(response),
        response,
        fallbackCompany,
    ]

    return Object.fromEntries(
        COMPANY_SETTING_FIELDS.map(({ name }) => [
            name,
            findSettingValue(sources, name) ?? '',
        ]),
    )
}

const normalizeWebsite = (website) => {
    const value = website.trim()
    if (!value || /^https?:\/\//i.test(value)) return value
    return `https://${value}`
}

const getFinalFieldName = (path) =>
    path.replace(/\[\d+\]/g, '').split('.').filter(Boolean).at(-1) || 'Value'

const formatFieldLabel = (path) =>
    getFinalFieldName(path)
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/[_-]+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())

const formatFieldValue = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    if (typeof value === 'boolean') return value ? 'Yes' : 'No'
    return String(value)
}

const flattenSettings = (value, parentKey = '') => {
    if (Array.isArray(value)) {
        if (value.length === 0) {
            return [{ key: formatFieldLabel(parentKey), value: '[]' }]
        }
        return value.flatMap((item, index) =>
            flattenSettings(item, `${parentKey}[${index}]`),
        )
    }

    if (value !== null && typeof value === 'object') {
        const entries = Object.entries(value).filter(([key]) =>
            ![
                'id',
                'statuscode',
                'success',
                'message',
                'companyname',
                'createdat',
                'updatedat',
                'logourl',
            ].includes(key.replace(/[^a-z0-9]/gi, '').toLowerCase()),
        )

        if (entries.length === 0) {
            return Object.keys(value).length === 0
                ? [{ key: formatFieldLabel(parentKey), value: '{}' }]
                : []
        }

        return entries.flatMap(([key, childValue]) =>
            flattenSettings(childValue, parentKey ? `${parentKey}.${key}` : key),
        )
    }

    return [{
        key: formatFieldLabel(parentKey),
        value: formatFieldValue(value),
    }]
}

const SettingsPage = () => {
    const [companies, setCompanies] = useState([])
    const [companiesLoading, setCompaniesLoading] = useState(false)
    const [companiesError, setCompaniesError] = useState('')
    const [activeCard, setActiveCard] = useState(null)
    const [bankModalCompany, setBankModalCompany] = useState(null)
    const [banksCompanyId, setBanksCompanyId] = useState(null)
    const [companyBanks, setCompanyBanks] = useState([])
    const [bankUnderOptions, setBankUnderOptions] = useState([])
    const [banksLoading, setBanksLoading] = useState(false)
    const [banksError, setBanksError] = useState('')
    const [bankFormOpen, setBankFormOpen] = useState(false)
    const [editingBankId, setEditingBankId] = useState(null)
    const [bankEditOriginal, setBankEditOriginal] = useState(null)
    const [bankForm, setBankForm] = useState(EMPTY_BANK_FORM)
    const [bankSaving, setBankSaving] = useState(false)
    const [bankSaveError, setBankSaveError] = useState('')
    const [bankActionBusyId, setBankActionBusyId] = useState(null)
    const [bankActionError, setBankActionError] = useState('')
    const [settingsCompany, setSettingsCompany] = useState(null)
    const [companySettings, setCompanySettings] = useState(null)
    const [editingSettings, setEditingSettings] = useState(false)
    const [settingsLoading, setSettingsLoading] = useState(false)
    const [settingsError, setSettingsError] = useState('')
    const [settingsForm, setSettingsForm] = useState(() => getSettingsFormValues(null))
    const [settingsSaving, setSettingsSaving] = useState(false)
    const [settingsSaveMessage, setSettingsSaveMessage] = useState('')
    const [settingsSaveError, setSettingsSaveError] = useState('')
    const [logoUrl, setLogoUrl] = useState('')
    const [logoBusy, setLogoBusy] = useState(false)
    const [logoError, setLogoError] = useState('')
    const settingsRequestRef = useRef(0)
    const banksRequestRef = useRef(0)

    const accessToken = useAuthStore((state) => state.accessToken)

    // Fetch companies from API
    useEffect(() => {
        if (!accessToken) {
            setCompanies([])
            setCompaniesLoading(false)
            setCompaniesError('Sign in to load companies.')
            return
        }

        let isMounted = true

        const loadCompanies = async () => {
            setCompaniesLoading(true)
            setCompaniesError('')

            try {
                const response = await fetchCompanies(accessToken)

                if (!isMounted) return

                const companyList = extractCompanies(response).map(normalizeCompany)

                setCompanies(companyList)
            } catch (error) {
                if (!isMounted) return

                setCompanies([])
                setCompaniesError(
                    error?.message || 'Unable to load companies.',
                )
            } finally {
                if (isMounted) {
                    setCompaniesLoading(false)
                }
            }
        }

        loadCompanies()

        return () => {
            isMounted = false
        }
    }, [accessToken])

    const openCompanySettings = async (company) => {
        const requestId = ++settingsRequestRef.current
        setSettingsCompany(company)
        setCompanySettings(null)
        setEditingSettings(false)
        setSettingsLoading(false)
        setSettingsSaving(false)
        setLogoBusy(false)
        setSettingsError('')
        setSettingsForm(getSettingsFormValues(null))
        setSettingsSaveMessage('')
        setSettingsSaveError('')
        setLogoUrl('')
        setLogoError('')

        if (!company.id) {
            setSettingsError('This company does not have an ID.')
            return
        }

        if (!accessToken) {
            setSettingsError('Sign in to load company settings.')
            return
        }
        setSettingsLoading(true)

        try {
            const response = await fetchCompanySettings(accessToken, company.id)
            if (requestId !== settingsRequestRef.current) return
            setCompanySettings(response)
            setSettingsForm(getSettingsFormValues(response, company))
            setLogoUrl(getCompanyLogoUrl(response) || getCompanyLogoUrl(company))
        } catch (error) {
            if (requestId !== settingsRequestRef.current) return
            setSettingsError(error?.message || 'Unable to load company settings.')
        } finally {
            if (requestId === settingsRequestRef.current) setSettingsLoading(false)
        }
    }

    const saveCompanySettings = async (event) => {
        event.preventDefault()
        const companyId = settingsCompany?.id
        if (!companyId || !accessToken) return

        const requestId = settingsRequestRef.current
        setSettingsSaving(true)
        setSettingsSaveMessage('')
        setSettingsSaveError('')

        try {
            const settingsToSave = {
                ...settingsForm,
                website: normalizeWebsite(settingsForm.website || ''),
            }
            await updateCompanySettings(
                accessToken,
                companyId,
                settingsToSave,
            )
            if (requestId !== settingsRequestRef.current) return
            setCompanySettings({
                data: {
                    ...settingsToSave,
                    ...(logoUrl ? { logoUrl } : {}),
                },
            })
            setSettingsForm(settingsToSave)
            setSettingsSaveMessage('')
            setEditingSettings(false)
        } catch (error) {
            if (requestId !== settingsRequestRef.current) return
            setSettingsSaveError(error?.message || 'Unable to save company settings.')
        } finally {
            if (requestId === settingsRequestRef.current) setSettingsSaving(false)
        }
    }

    const handleCompanyLogoUpload = async (event) => {
        const logoFile = event.target.files?.[0]
        event.target.value = ''
        if (!logoFile || !settingsCompany?.id || !accessToken) return

        const requestId = settingsRequestRef.current
        setLogoBusy(true)
        setLogoError('')

        try {
            const response = await uploadCompanyLogo(
                accessToken,
                settingsCompany.id,
                logoFile,
            )
            if (requestId !== settingsRequestRef.current) return
            const updatedSettings = await fetchCompanySettings(
                accessToken,
                settingsCompany.id,
            )
            if (requestId !== settingsRequestRef.current) return
            setCompanySettings(updatedSettings)
            setLogoUrl(
                getCompanyLogoUrl(updatedSettings) ||
                getCompanyLogoUrl(response) ||
                getCompanyLogoUrl(settingsCompany),
            )
        } catch (error) {
            if (requestId !== settingsRequestRef.current) return
            setLogoError(error?.message || 'Unable to upload company logo.')
        } finally {
            if (requestId === settingsRequestRef.current) setLogoBusy(false)
        }
    }

    const handleCompanyLogoDelete = async () => {
        if (!settingsCompany?.id || !accessToken) return

        const requestId = settingsRequestRef.current
        setLogoBusy(true)
        setLogoError('')

        try {
            await deleteCompanyLogo(accessToken, settingsCompany.id)
            if (requestId !== settingsRequestRef.current) return
            setLogoUrl('')
        } catch (error) {
            if (requestId !== settingsRequestRef.current) return
            setLogoError(error?.message || 'Unable to delete company logo.')
        } finally {
            if (requestId === settingsRequestRef.current) setLogoBusy(false)
        }
    }

    const toggleBankDetails = async (company, sectionKey) => {
        if (activeCard === sectionKey) {
            banksRequestRef.current += 1
            setActiveCard(null)
            setBankModalCompany(null)
            setBanksCompanyId(null)
            setBankUnderOptions([])
            setBanksLoading(false)
            setBankFormOpen(false)
            return
        }

        setActiveCard(sectionKey)
        setBankModalCompany(company)
        setBanksCompanyId(company.id)
        setCompanyBanks([])
        setBankUnderOptions([])
        setBanksError('')
        setBankFormOpen(false)
        setEditingBankId(null)
        setBankEditOriginal(null)
        setBankForm(EMPTY_BANK_FORM)
        setBankSaveError('')
        setBankActionError('')

        if (!company.id) {
            setBanksError('This company does not have an ID.')
            return
        }
        if (!accessToken) {
            setBanksError('Sign in to load bank details.')
            return
        }

        const requestId = ++banksRequestRef.current
        setBanksLoading(true)
        try {
            const response = await fetchCompanyBanks(accessToken, company.id)
            if (requestId !== banksRequestRef.current) return
            const banks = extractBankList(response)
            setCompanyBanks(banks)
            setBankUnderOptions(extractUnderOptions(response, banks))
        } catch (error) {
            if (requestId !== banksRequestRef.current) return
            setBanksError(error?.message || 'Unable to load bank details.')
        } finally {
            if (requestId === banksRequestRef.current) setBanksLoading(false)
        }
    }

    const closeBankModal = () => {
        banksRequestRef.current += 1
        setActiveCard(null)
        setBankModalCompany(null)
        setBanksCompanyId(null)
        setBanksLoading(false)
        setBankFormOpen(false)
        setEditingBankId(null)
        setBankEditOriginal(null)
        setBankActionBusyId(null)
        setBankActionError('')
    }

    const saveCompanyBank = async (event) => {
        event.preventDefault()
        if (!banksCompanyId || !accessToken) return

        const requestId = banksRequestRef.current
        setBankSaving(true)
        setBankSaveError('')
        try {
            if (editingBankId) {
                const updates = Object.fromEntries(
                    Object.entries(bankForm).filter(
                        ([key, value]) =>
                            key !== 'isDefault' &&
                            value !== bankEditOriginal?.[key],
                    ),
                )
                const shouldSetDefault =
                    bankForm.isDefault && !bankEditOriginal?.isDefault

                if (Object.keys(updates).length === 0 && !shouldSetDefault) {
                    setBankFormOpen(false)
                    setEditingBankId(null)
                    setBankEditOriginal(null)
                    return
                }
                if (Object.keys(updates).length > 0) {
                    await updateCompanyBank(
                        accessToken,
                        banksCompanyId,
                        editingBankId,
                        updates,
                    )
                }
                if (shouldSetDefault) {
                    await setDefaultCompanyBank(
                        accessToken,
                        banksCompanyId,
                        editingBankId,
                    )
                }
            } else {
                await createCompanyBank(accessToken, banksCompanyId, bankForm)
            }
            if (requestId !== banksRequestRef.current) return
            const response = await fetchCompanyBanks(accessToken, banksCompanyId)
            if (requestId !== banksRequestRef.current) return
            const banks = extractBankList(response)
            setCompanyBanks(banks)
            setBankUnderOptions(extractUnderOptions(response, banks))
            setBankForm(EMPTY_BANK_FORM)
            setEditingBankId(null)
            setBankEditOriginal(null)
            setBankFormOpen(false)
        } catch (error) {
            if (requestId !== banksRequestRef.current) return
            setBankSaveError(error?.message || 'Unable to add bank details.')
        } finally {
            if (requestId === banksRequestRef.current) setBankSaving(false)
        }
    }

    const handleBankAction = async (bank, action) => {
        const bankId = bank.id || bank._id || bank.bankId || bank.bank_id
        if (!banksCompanyId || !bankId || !accessToken) {
            setBankActionError('Bank ID is missing; unable to update this bank.')
            return
        }

        const requestId = banksRequestRef.current
        setBankActionBusyId(bankId)
        setBankActionError('')
        try {
            if (action === 'default') {
                await setDefaultCompanyBank(accessToken, banksCompanyId, bankId)
            } else {
                await deleteCompanyBank(accessToken, banksCompanyId, bankId)
            }

            if (requestId !== banksRequestRef.current) return
            const response = await fetchCompanyBanks(accessToken, banksCompanyId)
            if (requestId !== banksRequestRef.current) return
            const banks = extractBankList(response)
            setCompanyBanks(banks)
            setBankUnderOptions(extractUnderOptions(response, banks))
        } catch (error) {
            if (requestId !== banksRequestRef.current) return
            setBankActionError(error?.message || 'Unable to update bank details.')
        } finally {
            if (requestId === banksRequestRef.current) setBankActionBusyId(null)
        }
    }

    // Sections displayed inside each company card
    const sections = [
        {
            id: 'settings',
            title: 'Company Settings',
            description: 'Configure company preferences',
            icon: Settings,
            color: 'violet',
        },
        {
            id: 'bank',
            title: 'Bank Details',
            description: 'Update payment information',
            icon: Landmark,
            color: 'blue',
        },
    ]

    return (
        <section className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Page Header */}
                <div className="mb-6">
                    <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                        Settings
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your company and account preferences
                    </p>
                </div>

                {/* Loading State */}
                {companiesLoading && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                            Loading companies...
                        </div>
                    </div>
                )}

                {/* Error State */}
                {!companiesLoading && companiesError && (
                    <div
                        className="rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-600"
                        role="alert"
                    >
                        {companiesError}
                    </div>
                )}

                {/* Empty State */}
                {!companiesLoading &&
                    !companiesError &&
                    companies.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
                            <Building2
                                size={24}
                                className="mb-3 text-slate-400"
                            />

                            <p className="font-medium text-slate-700">
                                No companies found
                            </p>

                            <p className="mt-1">
                                Your companies will appear here once they are available.
                            </p>
                        </div>
                    )}

                {/* Company Cards: Actual API Data */}
                {!companiesLoading &&
                    !companiesError &&
                    companies.length > 0 && (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {companies.map((company, companyIndex) => (
                                <div
                                    key={
                                        company.id ||
                                        `${company.name || 'company'}-${companyIndex}`
                                    }
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_4px_20px_rgba(15,23,42,0.04)] transition hover:shadow-md"
                                >
                                    {/* Actual Company Name */}
                                    <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4">
                                        {/* <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                      <Building2 size={19} strokeWidth={2} />
                    </div> */}

                                        <div className="min-w-0 flex-1">
                                            {/* <p className="flex justify-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                        Company Name
                      </p> */}

                                            <h2
                                                className="flex justify-center mt-1 break-words text-sm font-semibold text-slate-900"
                                                title={company.name || 'Unnamed Company'}
                                            >
                                                {company.name || 'Unnamed Company'}
                                            </h2>

                                            {company.meta && (
                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    {company.meta}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Company Settings and Bank Details */}
                                    <div>
                                        {sections.map((section, sectionIndex) => {
                                            const Icon = section.icon

                                            const sectionKey = `${company.id || company.name || companyIndex
                                                }-${section.id}`

                                            const isActive = activeCard === sectionKey

                                            return (
                                                <div key={section.id}>
                                                    <button
                                                        type="button"
                                                        aria-expanded={isActive}
                                                        onClick={() => {
                                                            if (section.id === 'settings') {
                                                                openCompanySettings(company)
                                                                return
                                                            }

                                                            toggleBankDetails(company, sectionKey)
                                                        }}
                                                        className={`group flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-slate-50 ${sectionIndex < sections.length - 1
                                                            ? 'border-b border-slate-100'
                                                            : ''
                                                            }`}
                                                    >
                                                        {/* Section Icon */}
                                                        <div
                                                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${section.color === 'violet'
                                                                ? 'bg-violet-50 text-violet-600 ring-1 ring-violet-100'
                                                                : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'
                                                                }`}
                                                        >
                                                            <Icon size={16} strokeWidth={2} />
                                                        </div>

                                                        {/* Section Text */}
                                                        <div className="min-w-0 flex-1">
                                                            <p className="text-sm font-semibold text-slate-900">
                                                                {section.title}
                                                            </p>

                                                            <p className="mt-0.5 text-[11px] text-slate-500">
                                                                {section.description}
                                                            </p>
                                                        </div>

                                                        {/* Arrow */}
                                                        <ChevronRight
                                                            size={16}
                                                            className={`shrink-0 text-slate-300 transition group-hover:text-slate-500 ${isActive ? 'rotate-90' : ''
                                                                }`}
                                                        />
                                                    </button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>

            {bankModalCompany && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4"
                    onClick={closeBankModal}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="company-bank-details-title"
                        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                    Bank Details
                                </p>
                                <h2
                                    id="company-bank-details-title"
                                    className="mt-1 text-lg font-bold text-slate-900"
                                >
                                    {bankModalCompany.name || 'Company'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                aria-label="Close bank details"
                                onClick={closeBankModal}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="space-y-4 overflow-y-auto p-5">
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setBankForm(EMPTY_BANK_FORM)
                                        setEditingBankId(null)
                                        setBankEditOriginal(null)
                                        setBankSaveError('')
                                        setBankFormOpen((open) => !open)
                                    }}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                >
                                    <Plus size={16} />
                                    {bankFormOpen ? 'Close Form' : 'Add Bank'}
                                </button>
                            </div>

                            {banksLoading && (
                                <p className="text-sm text-slate-500" role="status">
                                    Loading bank details...
                                </p>
                            )}
                            {banksError && (
                                <p className="text-sm text-red-600" role="alert">
                                    {banksError}
                                </p>
                            )}
                            {bankActionError && (
                                <p className="text-sm text-red-600" role="alert">
                                    {bankActionError}
                                </p>
                            )}
                            {!banksLoading && !banksError && companyBanks.length === 0 && !bankFormOpen && (
                                <div className="rounded-xl border border-slate-200 p-5 text-center text-sm text-slate-500">
                                    No bank accounts found.
                                </div>
                            )}
                            {companyBanks.map((bank, bankIndex) => (
                                <div
                                    key={bank.id || bank._id || bank.accountNumber || bankIndex}
                                    className="rounded-xl border border-slate-200 p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <h3 className="font-semibold text-slate-900">
                                            {bank.bankName || 'Bank'}
                                        </h3>
                                        {bank.isDefault && (
                                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                                                Default
                                            </span>
                                        )}
                                    </div>
                                    <dl className="mt-3 grid grid-cols-1 gap-x-5 gap-y-2 text-sm sm:grid-cols-2">
                                        {[
                                            ['Account Holder', bank.accountHolderName],
                                            ['Account Number', bank.accountNumber],
                                            ['Under', bank.under],
                                            ['IFSC Code', bank.ifscCode],
                                            ['SWIFT Code', bank.swiftCode],
                                            ['Branch', bank.branchName],
                                        ].map(([label, value]) => (
                                            <div key={label}>
                                                <dt className="text-xs text-slate-500">{label}</dt>
                                                <dd className="break-words font-medium text-slate-800">
                                                    {value || '—'}
                                                </dd>
                                            </div>
                                        ))}
                                    </dl>
                                    <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-3">
                                        <button
                                            type="button"
                                            disabled={Boolean(bankActionBusyId)}
                                            onClick={() => {
                                                const bankId =
                                                    bank.id || bank._id || bank.bankId || bank.bank_id
                                                if (!bankId) {
                                                    setBankActionError('Bank ID is missing; unable to edit this bank.')
                                                    return
                                                }
                                                setBankForm({
                                                    bankName: bank.bankName || '',
                                                    under: bank.under || '',
                                                    accountHolderName: bank.accountHolderName || '',
                                                    accountNumber: bank.accountNumber || '',
                                                    ifscCode: bank.ifscCode || '',
                                                    swiftCode: bank.swiftCode || '',
                                                    branchName: bank.branchName || '',
                                                    isDefault: Boolean(bank.isDefault),
                                                })
                                                setBankEditOriginal({
                                                    bankName: bank.bankName || '',
                                                    under: bank.under || '',
                                                    accountHolderName: bank.accountHolderName || '',
                                                    accountNumber: bank.accountNumber || '',
                                                    ifscCode: bank.ifscCode || '',
                                                    swiftCode: bank.swiftCode || '',
                                                    branchName: bank.branchName || '',
                                                    isDefault: Boolean(bank.isDefault),
                                                })
                                                setEditingBankId(bankId)
                                                setBankSaveError('')
                                                setBankFormOpen(true)
                                            }}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </button>
                                        {!bank.isDefault && (
                                            <button
                                                type="button"
                                                disabled={Boolean(bankActionBusyId)}
                                                onClick={() => handleBankAction(bank, 'default')}
                                                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-50 disabled:opacity-50"
                                            >
                                                <Star size={14} />
                                                Set Default
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            disabled={Boolean(bankActionBusyId)}
                                            onClick={() => handleBankAction(bank, 'delete')}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                        >
                                            <Trash2 size={14} />
                                            {bankActionBusyId === (bank.id || bank._id || bank.bankId || bank.bank_id)
                                                ? 'Working...'
                                                : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {bankFormOpen && (
                                <div
                                    className="fixed inset-0 z-[310] flex items-center justify-center bg-slate-950/50 p-4"
                                    onClick={() => !bankSaving && setBankFormOpen(false)}
                                >
                                    <section
                                        role="dialog"
                                        aria-modal="true"
                                        aria-labelledby="add-bank-title"
                                        className="flex max-h-[85vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                                        onClick={(event) => event.stopPropagation()}
                                    >
                                        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                                    Bank Details
                                                </p>
                                                <h3 id="add-bank-title" className="mt-1 text-lg font-bold text-slate-900">
                                                    {editingBankId ? 'Edit Bank Account' : 'Add Bank Account'}
                                                </h3>
                                            </div>
                                            <button
                                                type="button"
                                                aria-label="Close add bank dialog"
                                                disabled={bankSaving}
                                                onClick={() => {
                                                    setBankFormOpen(false)
                                                    setEditingBankId(null)
                                                }}
                                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                                            >
                                                <X size={18} />
                                            </button>
                                        </header>
                                        <form
                                            className="space-y-4 overflow-y-auto p-5"
                                            onSubmit={saveCompanyBank}
                                        >
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                {[
                                                    ['bankName', 'Bank Name'],
                                                    ['under', 'Under'],
                                                    ['accountHolderName', 'Account Holder Name'],
                                                    ['accountNumber', 'Account Number'],
                                                    ['ifscCode', 'IFSC Code'],
                                                    ['swiftCode', 'SWIFT Code'],
                                                    ['branchName', 'Branch Name'],
                                                ].map(([name, label]) => (
                                                    <label key={name} className="block">
                                                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                                            {label}
                                                        </span>
                                                        {name === 'under' ? (
                                                            <select
                                                                value={bankForm.under}
                                                                onChange={(event) =>
                                                                    setBankForm((current) => ({
                                                                        ...current,
                                                                        under: event.target.value,
                                                                    }))
                                                                }
                                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                            >
                                                                <option value="">Select Under</option>
                                                                {bankForm.under && !bankUnderOptions.includes(bankForm.under) && (
                                                                    <option value={bankForm.under}>
                                                                        {bankForm.under}
                                                                    </option>
                                                                )}
                                                                {bankUnderOptions.map((option) => (
                                                                    <option key={option} value={option}>
                                                                        {option}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        ) : (
                                                            <input
                                                                required={['bankName', 'accountHolderName', 'accountNumber', 'ifscCode'].includes(name)}
                                                                value={bankForm[name]}
                                                                onChange={(event) =>
                                                                    setBankForm((current) => ({
                                                                        ...current,
                                                                        [name]: event.target.value,
                                                                    }))
                                                                }
                                                                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                                            />
                                                        )}
                                                    </label>
                                                ))}
                                            </div>
                                            <label className="flex items-center gap-2 text-sm text-slate-700">
                                                <input
                                                    type="checkbox"
                                                    checked={bankForm.isDefault}
                                                    disabled={Boolean(editingBankId && bankEditOriginal?.isDefault)}
                                                    onChange={(event) =>
                                                        setBankForm((current) => ({
                                                            ...current,
                                                            isDefault: event.target.checked,
                                                        }))
                                                    }
                                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                {editingBankId && bankEditOriginal?.isDefault
                                                    ? 'Default bank account'
                                                    : 'Set as default bank'}
                                            </label>
                                            {bankSaveError && (
                                                <p className="text-sm text-red-600" role="alert">
                                                    {bankSaveError}
                                                </p>
                                            )}
                                            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
                                                <button
                                                    type="button"
                                                    disabled={bankSaving}
                                                    onClick={() => {
                                                        setBankFormOpen(false)
                                                        setEditingBankId(null)
                                                    }}
                                                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={bankSaving}
                                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                                >
                                                    {bankSaving
                                                        ? editingBankId ? 'Saving...' : 'Adding...'
                                                        : editingBankId ? 'Save Changes' : 'Add Bank'}
                                                </button>
                                            </div>
                                        </form>
                                    </section>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            )}

            {settingsCompany && (
                <div
                    className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/50 p-4"
                    onClick={() => {
                        settingsRequestRef.current += 1
                        setSettingsCompany(null)
                        setSettingsLoading(false)
                    }}
                >
                    <section
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="company-settings-title"
                        className="flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <header className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-violet-600">
                                    Company Settings
                                </p>
                                <h2
                                    id="company-settings-title"
                                    className="mt-1 text-lg font-bold text-slate-900"
                                >
                                    {settingsCompany.name || 'Company'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                aria-label="Close company settings"
                                onClick={() => {
                                    settingsRequestRef.current += 1
                                    setSettingsCompany(null)
                                    setSettingsLoading(false)
                                }}
                                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X size={18} />
                            </button>
                        </header>

                        <div className="overflow-y-auto p-5">
                            {settingsLoading ? (
                                <p className="text-sm text-slate-500" role="status">
                                    Loading company settings...
                                </p>
                            ) : settingsError ? (
                                <p className="text-sm text-red-600" role="alert">
                                    {settingsError}
                                </p>
                            ) : !editingSettings ? (
                                <div className="space-y-4">
                                    {settingsSaveMessage && (
                                        <p className="text-sm text-emerald-700" role="status">
                                            {settingsSaveMessage}
                                        </p>
                                    )}
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSettingsForm(
                                                    getSettingsFormValues(companySettings, settingsCompany),
                                                )
                                                setSettingsSaveMessage('')
                                                setSettingsSaveError('')
                                                setEditingSettings(true)
                                            }}
                                            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                                        >
                                            <Pencil size={16} />
                                            Edit Settings
                                        </button>
                                    </div>
                                    {logoUrl && (
                                        <div className="flex justify-center">
                                            <img
                                                src={logoUrl}
                                                alt={`${settingsCompany.name || 'Company'} logo`}
                                                className="h-28 w-28 rounded-full border border-slate-200 bg-white object-contain p-2 shadow-sm"
                                            />
                                        </div>
                                    )}
                                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                                        <table className="w-full min-w-[400px] border-collapse text-left text-sm">
                                            <thead className="bg-slate-50">
                                                <tr>
                                                    <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700">
                                                        Field
                                                    </th>
                                                    <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-700">
                                                        Value
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {flattenSettings(companySettings).map((row, index) => (
                                                    <tr
                                                        key={`${row.key}-${index}`}
                                                        className="transition hover:bg-slate-50"
                                                    >
                                                        <td className="w-2/5 break-words border-b border-slate-100 px-4 py-3 font-medium text-slate-600">
                                                            {row.key}
                                                        </td>
                                                        <td className="break-all border-b border-slate-100 px-4 py-3 text-slate-800">
                                                            {row.value}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <form className="space-y-5" onSubmit={saveCompanySettings}>
                                    <div className="rounded-xl border border-slate-200 p-4">
                                        <h3 className="flex justify-center text-sm font-semibold text-slate-800">
                                            Company Logo
                                        </h3>
                                        {logoUrl && (
                                            <img
                                                src={logoUrl}
                                                alt={`${settingsCompany.name || 'Company'} logo`}
                                                className="mx-auto mt-3 h-24 w-24 rounded-full border border-slate-200 bg-white object-contain p-2"
                                            />
                                        )}
                                        <div className="flex justify-center mt-3 flex flex-wrap items-center gap-3">
                                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                                <Upload size={16} />
                                                {logoBusy ? 'Please wait...' : 'Upload logo'}
                                                <input
                                                    type="file"
                                                    name="logo"
                                                    accept="image/*"
                                                    disabled={logoBusy}
                                                    onChange={handleCompanyLogoUpload}
                                                    className="sr-only"
                                                />
                                            </label>
                                            {logoUrl && (
                                                <button
                                                    type="button"
                                                    disabled={logoBusy}
                                                    onClick={handleCompanyLogoDelete}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete logo
                                                </button>
                                            )}
                                        </div>
                                        {logoError && (
                                            <p className="mt-2 text-sm text-red-600" role="alert">
                                                {logoError}
                                            </p>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        {COMPANY_SETTING_FIELDS.map((field) => (
                                            <label
                                                key={field.name}
                                                className={`block ${field.type === 'textarea' ? 'sm:col-span-2' : ''}`}
                                            >
                                                <span className="mb-1.5 block text-sm font-medium text-slate-700">
                                                    {field.label}
                                                </span>
                                                {field.type === 'textarea' ? (
                                                    <div>
                                                        <textarea
                                                            rows={5}
                                                            maxLength={200}
                                                            value={settingsForm[field.name]}
                                                            onChange={(event) =>
                                                                setSettingsForm((current) => ({
                                                                    ...current,
                                                                    [field.name]: event.target.value,
                                                                }))
                                                            }
                                                            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                                        />
                                                        <span className="mt-1 block text-right text-xs text-slate-500">
                                                            {settingsForm[field.name].length}/200
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <input
                                                        type={field.type}
                                                        inputMode={field.name === 'website' ? 'url' : undefined}
                                                        value={settingsForm[field.name]}
                                                        onChange={(event) =>
                                                            setSettingsForm((current) => ({
                                                                ...current,
                                                                [field.name]: event.target.value,
                                                            }))
                                                        }
                                                        onBlur={
                                                            field.name === 'website'
                                                                ? (event) =>
                                                                    setSettingsForm((current) => ({
                                                                        ...current,
                                                                        website: normalizeWebsite(event.target.value),
                                                                    }))
                                                                : undefined
                                                         }
                                                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none transition focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
                                                    />
                                                )}
                                            </label>
                                        ))}
                                    </div>

                                    {/* <div className="rounded-xl border border-slate-200 p-4">
                                        <h3 className="text-sm font-semibold text-slate-800">
                                            Company Logo
                                        </h3>
                                        {logoUrl && (
                                            <img
                                                src={logoUrl}
                                                alt={`${settingsCompany.name || 'Company'} logo`}
                                                className="mt-3 h-24 w-24 rounded-full border border-slate-200 bg-white object-contain p-2"
                                            />
                                        )}
                                        <div className="mt-3 flex flex-wrap items-center gap-3">
                                            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
                                                <Upload size={16} />
                                                {logoBusy ? 'Please wait...' : 'Upload logo'}
                                                <input
                                                    type="file"
                                                    name="logo"
                                                    accept="image/*"
                                                    disabled={logoBusy}
                                                    onChange={handleCompanyLogoUpload}
                                                    className="sr-only"
                                                />
                                            </label>
                                            {logoUrl && (
                                                <button
                                                    type="button"
                                                    disabled={logoBusy}
                                                    onClick={handleCompanyLogoDelete}
                                                    className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                                                >
                                                    <Trash2 size={16} />
                                                    Delete logo
                                                </button>
                                            )}
                                        </div>
                                        {logoError && (
                                            <p className="mt-2 text-sm text-red-600" role="alert">
                                                {logoError}
                                            </p>
                                        )}
                                    </div> */}

                                    {settingsSaveError && (
                                        <p className="text-sm text-red-600" role="alert">
                                            {settingsSaveError}
                                        </p>
                                    )}
                                    {settingsSaveMessage && (
                                        <p className="text-sm text-emerald-700" role="status">
                                            {settingsSaveMessage}
                                        </p>
                                    )}

                                    <div className="flex justify-between border-t border-slate-100 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSettingsForm(
                                                    getSettingsFormValues(companySettings, settingsCompany),
                                                )
                                                setSettingsSaveMessage('')
                                                setSettingsSaveError('')
                                                setEditingSettings(false)
                                            }}
                                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={settingsSaving || logoBusy}
                                            className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Save size={16} />
                                            {settingsSaving ? 'Saving...' : 'Save Settings'}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </section>
    )
}

export default SettingsPage
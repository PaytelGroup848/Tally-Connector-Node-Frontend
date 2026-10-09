import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import { postCompanyCommand } from '../services/companiesApi'

function getPageMeta(path = '') {
  const normalizedPath = path.toLowerCase()

  if (normalizedPath.includes('/parties/add-new')) {
    return {
      title: 'Add New Party',
      subtitle: 'Create a new customer or vendor profile',
      fields: [
        { label: 'Party Name', placeholder: 'Enter party name' },
        { label: 'Contact Number', placeholder: 'Enter phone number' },
        { label: 'Email', placeholder: 'Enter email address' },
        { label: 'Opening Balance', placeholder: 'Enter amount' },
      ],
    }
  }

  if (normalizedPath.includes('/items/add-new')) {
    return {
      title: 'Add New Item',
      subtitle: 'Create a new stock item',
      fields: [
        { key: 'itemName', label: 'Item Name', placeholder: 'Enter item name' },
        { key: 'quantity', label: 'Quantity', placeholder: 'Enter quantity' },
        { key: 'rate', label: 'Rate', placeholder: 'Enter rate' },
        { key: 'value', label: 'Value', placeholder: 'Enter value' },
        { key: 'hsnCode', label: 'HSN Code', placeholder: 'Enter HSN code' },
        { key: 'unit', label: 'Unit', placeholder: 'e.g. Nos, Kg' },
        { key: 'batch', label: 'Batch', placeholder: 'Enter batch number' },
        { key: 'godown', label: 'Godown', placeholder: 'Enter godown name' },
        { key: 'gstRate', label: 'GST Rate', placeholder: 'Enter GST Rate' },
        { key: 'typeOfSupply', label: 'Type Of Supply', placeholder: 'Enter Type Of Supply' },
      ],
    }
  }

  if (normalizedPath.includes('/my-stock-items/add-new')) {
    return {
      title: 'Add New Stock Item',
      subtitle: 'Create a stock item entry',
      fields: [
        { label: 'Stock Item', placeholder: 'Enter stock item name' },
        { label: 'Category', placeholder: 'Enter category' },
        { label: 'Unit Price', placeholder: 'Enter unit price' },
      ],
    }
  }

  if (normalizedPath.includes('/my-ledgers/add-new')) {
    return {
      title: ' Ledger',
      subtitle: 'Create a ledger account',
      fields: [
        { label: 'Ledger Name', placeholder: 'Enter ledger name' },
        { label: 'Group', placeholder: 'Select group' },
        { label: 'Opening Balance', placeholder: 'Enter opening balance' },
      ],
    }
  }

  if (normalizedPath.includes('/my-parties/add-new')) {
    return {
      title: 'Add New Party',
      subtitle: 'Create a party profile',
      fields: [
        { label: 'Party Name', placeholder: 'Enter party name' },
        { label: 'Mobile', placeholder: 'Enter mobile number' },
        { label: 'Email', placeholder: 'Enter email address' },
        { label: 'Opening Balance', placeholder: 'Enter opening balance' },
      ],
    }
  }

  return {
    title: ' Record',
    subtitle: 'Create a new record',
    fields: [
      { label: 'Name', placeholder: 'Enter name' },
      { label: 'Date', placeholder: 'Select date' },
      { label: 'Amount', placeholder: 'Enter amount' },
    ],
  }
}
// function extractHsnOptions(response) {
//   if (Array.isArray(response)) return response

//   if (!response || typeof response !== 'object') return []

//   const possibleKeys = [
//     'results',
//     'data',
//     'result',
//     'hsnList',
//     'hsnDetails',
//     'hsnCodes',
//     'suggestions',
//     'items',
//     'records',
//   ]

//   for (const key of possibleKeys) {
//     const value = response[key]

//     if (Array.isArray(value) && value.length > 0) {
//       return value
//     }

//     if (value && typeof value === 'object') {
//       const nested = extractHsnOptions(value)
//       if (nested.length > 0) return nested
//     }
//   }

//   return []
// }


// const code =
//   option?.hsnCode ??
//   option?.hsncode ??
//   option?.hsn_code ??
//   option?.HSNCode ??
//   option?.HSN_CODE ??
//   option?.code ??
//   option?.Code ??
//   option?.hsn ??
//   option?.value ??
//   ''

// const description =
//   option?.hsnDesc ??
//   option?.hsnDescription ??
//   option?.hsn_description ??
//   option?.description ??
//   option?.Description ??
//   option?.desc ??
//   option?.name ??
//   option?.text ??
//   option?.label ??
//   ''

// return {
//   code: String(code).trim(),
//   description: String(description).trim(),
// }
// function getHsnOptionDetails(option) {
//   return {
//     code: String(option?.c ?? '').trim(),
//     description: String(option?.n ?? '').trim(),
//   }
// }
function getHsnOptionDetails(option) {
  return {
    code: String(option?.c ?? '').trim(),
    description: String(option?.n ?? '').trim(),
  }
}
function AddNewPage({ path, companyId }) {
  const meta = getPageMeta(path)
  const accessToken = useAuthStore((state) => state.accessToken)
  const isItemPage =
    path.toLowerCase().replace(/\/+$/, '') === '/items/add-new'
  const [formValues, setFormValues] = useState({})
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [hsnSuggestions, setHsnSuggestions] = useState([])
  const [isSearchingHsn, setIsSearchingHsn] = useState(false)
  const [isHsnDropdownOpen, setIsHsnDropdownOpen] = useState(false)
  const [hsnSearchError, setHsnSearchError] = useState('')

  const hsnQuery = String(formValues.hsnCode || '').trim()
  const quantity = Number(formValues.quantity) || 0
  const rate = Number(formValues.rate) || 0

  const calculatedAmount = Number(
    (quantity * rate).toFixed(2)
  )
  useEffect(() => {
    if (!isItemPage || hsnQuery.length < 3) {
      setHsnSuggestions([])
      setIsSearchingHsn(false)
      setHsnSearchError('')
      return
    }

    const controller = new AbortController()

    const timeoutId = window.setTimeout(async () => {
      setIsSearchingHsn(true)
      setHsnSearchError('')

      try {
        const params = new URLSearchParams({
          inputText: hsnQuery,
          selectedType: 'byCode',
          category: 'null',
        })

        const response = await fetch(
          `https://services.gst.gov.in/commonservices/hsn/search/qsearch?${params.toString()}`,
          {
            method: 'GET',
            headers: {
              Accept: 'application/json',
            },
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`HSN search failed (${response.status})`)
        }

        const result = await response.json()

        // API response: { data: [{ c: '7117', n: 'IMITATION JEWELLERY' }] }
        const options = Array.isArray(result?.data)
          ? result.data
          : []

        setHsnSuggestions(
          options
            .filter((option) => option?.c != null && String(option.c).trim())
            .slice(0, 15)
        )
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('HSN search error:', error)
          setHsnSuggestions([])
          setHsnSearchError(
            'Unable to load HSN suggestions. Please try again.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearchingHsn(false)
        }
      }
    }, 350)

    return () => {
      window.clearTimeout(timeoutId)
      controller.abort()
    }
  }, [hsnQuery, isItemPage])
  useEffect(() => {
    setFormValues({})
    setErrorMessage('')
    setSuccessMessage('')
  }, [path])

  const updateField = (key, value) => {
    setFormValues((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!isItemPage) return

    const itemName = String(formValues.itemName || '').trim()
    if (!itemName) {
      setErrorMessage('Item name is required.')
      return
    }

    if (!accessToken || !companyId) {
      setErrorMessage('Please select a company before creating an item.')
      return
    }

    try {
      setIsSaving(true)
      setErrorMessage('')
      setSuccessMessage('')

      await postCompanyCommand(accessToken, companyId, {
        type: 'CREATE_STOCK_ITEM',
        payload: {
          itemName,
          quantity: Number(formValues.quantity) || 0,
          rate: Number(formValues.rate) || 0,
          value: calculatedAmount,
          hsnCode: String(formValues.hsnCode || '').trim(),
          unit: String(formValues.unit || '').trim(),
          batch: String(formValues.batch || '').trim(),
          godown: String(formValues.godown || '').trim(),
          gstRate:
            formValues.gstRate == null || formValues.gstRate === ''
              ? 18
              : Number(formValues.gstRate),
          typeOfSupply: String(formValues.typeOfSupply || '').trim(),
        },
      })

      setFormValues({})
      setSuccessMessage('Item created successfully.')
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to create item.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleViewStatus = () => {
    window.history.pushState({}, '', '/my-stock-items')
    window.dispatchEvent(new PopStateEvent('popstate'))
  }

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] p-5 text-slate-900">
      <div className="mx-auto max-w-4xl rounded-xl border border-slate-200 bg-white shadow-[0_8px_24px_rgba(24,33,43,0.05)]">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Create</div>
            <h1 className="mt-1 text-2xl font-semibold text-slate-900">{meta.title}</h1>
          </div>
          <button type="button" onClick={() => window.history.back()} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700">
            Back
          </button>
        </div>

        <div className="p-6">
          <p className="mb-6 text-sm text-slate-600">{meta.subtitle}</p>

          <div className="grid gap-5 md:grid-cols-1">
            <div className="grid gap-5 md:grid-cols-2">
              {meta.fields.map((field) => {
                const fieldKey = field.key || field.label
                const isCalculatedAmount =
                  isItemPage && fieldKey === 'value'

                return (
                  <label
                    key={field.label}
                    className="flex flex-col gap-2 text-sm font-medium text-slate-700"
                  >
                    {field.label}

                    <div className="relative">
                      {fieldKey === 'typeOfSupply' ? (
                        <select
                          value={formValues.typeOfSupply || ''}
                          onChange={(event) =>
                            updateField('typeOfSupply', event.target.value)
                          }
                          className="h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:bg-white"
                        >
                          <option value="">Select Type Of Supply</option>
                          <option value="Capital Goods">Capital Goods</option>
                          <option value="Goods">Goods</option>
                          <option value="Services">Services</option>
                        </select>
                      ) : (
                        <>
                          <input
                            value={
                              isCalculatedAmount
                                ? calculatedAmount.toFixed(2)
                                : fieldKey === 'gstRate'
                                  ? (formValues.gstRate ?? '18')
                                  : formValues[fieldKey] || ''
                            }
                            onChange={(event) => {
                              updateField(fieldKey, event.target.value)

                              if (fieldKey === 'hsnCode') {
                                setIsHsnDropdownOpen(true)
                              }
                            }}
                            onFocus={() => {
                              if (fieldKey === 'hsnCode') {
                                setIsHsnDropdownOpen(true)
                              }
                            }}
                            onBlur={() => {
                              if (fieldKey === 'hsnCode') {
                                setIsHsnDropdownOpen(false)
                              }
                            }}
                            readOnly={isCalculatedAmount}
                            type="text"
                            inputMode={fieldKey === 'gstRate' ? 'decimal' : 'text'}
                            placeholder={field.placeholder}
                            className={`h-11 w-full rounded-md border border-slate-300 bg-slate-50 px-3 text-sm text-slate-800 outline-none transition focus:border-slate-500 focus:bg-white ${fieldKey === 'gstRate' ? 'pr-8' : ''
                              }`}
                          />

                          {fieldKey === 'gstRate' && (
                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                              %
                            </span>
                          )}

                          {/* HSN search dropdown */}
                          {fieldKey === 'hsnCode' &&
                            isItemPage &&
                            isHsnDropdownOpen &&
                            hsnQuery.length >= 3 && (
                              <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-md border border-slate-200 bg-white shadow-lg">
                                {isSearchingHsn ? (
                                  <div className="px-3 py-3 text-sm text-slate-500">
                                    Searching HSN codes...
                                  </div>
                                ) : hsnSearchError ? (
                                  <div className="px-3 py-3 text-sm text-red-600">
                                    {hsnSearchError}
                                  </div>
                                ) : hsnSuggestions.length === 0 ? (
                                  <div className="px-3 py-3 text-sm text-slate-500">
                                    No HSN codes found.
                                  </div>
                                ) : (
                                  <table className="w-full border-collapse text-left text-xs">
                                    <thead className="sticky top-0 bg-slate-100">
                                      <tr>
                                        <th className="border-b border-r border-slate-200 px-3 py-2 font-semibold text-slate-700">
                                          HSN Code
                                        </th>
                                        <th className="border-b border-slate-200 px-3 py-2 font-semibold text-slate-700">
                                          Description
                                        </th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {hsnSuggestions.map((option, index) => {
                                        const { code, description } =
                                          getHsnOptionDetails(option)

                                        return (
                                          <tr
                                            key={`${code}-${index}`}
                                            onMouseDown={(event) =>
                                              event.preventDefault()
                                            }
                                            onClick={() => {
                                              updateField('hsnCode', code)
                                              setIsHsnDropdownOpen(false)
                                              setHsnSuggestions([])
                                            }}
                                            className="cursor-pointer hover:bg-emerald-50"
                                          >
                                            <td className="border-b border-r border-slate-100 px-3 py-2 font-medium text-slate-800">
                                              {code}
                                            </td>
                                            <td className="border-b border-slate-100 px-3 py-2 text-slate-600">
                                              {description}
                                            </td>
                                          </tr>
                                        )
                                      })}
                                    </tbody>
                                  </table>
                                )}
                              </div>
                            )}
                        </>
                      )}
                    </div>
                  </label>
                )
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-end gap-3">
            <button type="button" onClick={() => window.history.back()} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSaving || !isItemPage}
              className="rounded-md bg-[#1f2d3d] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          </div>

          {errorMessage && (
            <p role="alert" className="mt-4 text-right text-sm text-red-600">
              {errorMessage}
            </p>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/50 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="item-created-title"
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl font-semibold text-emerald-700">
                ✓
              </div>
              <h2 id="item-created-title" className="mt-4 text-lg font-semibold text-slate-900">
                Item created successfully
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                You can check the item creation status in My Stock Items.
              </p>
            </div>
            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setSuccessMessage('')}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleViewStatus}
                className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                View Status
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default AddNewPage

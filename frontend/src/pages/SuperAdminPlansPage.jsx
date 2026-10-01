import { useEffect, useMemo, useState } from 'react'
import {
  RefreshCw,
  Eye,
  X,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import useAuthStore from '../store/authStore'
import {
  fetchSuperAdminPlans,
  updateSuperAdminPlan,
} from '../services/superAdminApi'

/* =========================================================
   EXTRACT PLANS
   ========================================================= */

function extractPlans(response) {
  const candidates = [
    response?.data?.plans,
    response?.data?.items,
    response?.data?.results,
    response?.data?.data,
    response?.plans,
    response?.items,
    response?.results,
    response?.result?.plans,
    response?.result,
    response?.data,
    response,
  ]

  return candidates.find(Array.isArray) || []
}

/* =========================================================
   HIDDEN PLAN FIELDS
   ========================================================= */

function isHiddenPlanField(key) {
  return /^(?:_?id|plan_?id|v|__v)$/i.test(key)
}

function isSystemPlanField(key) {
  return (
    isHiddenPlanField(key) ||
    /^(?:created|updated|deleted)(?:at|by|on)$/i.test(key)
  )
}

function getPlanId(plan) {
  return plan?.id ?? plan?._id ?? plan?.planId ?? plan?.plan_id
}

function getEditablePlanValues(plan) {
  return Object.fromEntries(
    Object.entries(plan || {})
      .filter(([key]) => !isSystemPlanField(key))
      .map(([key, value]) => [key, value]),
  )
}

function coercePlanFieldValue(value, originalValue) {
  if (originalValue === null) {
    return value === '' ? null : value
  }

  if (typeof originalValue === 'number') {
    const number = value === '' ? null : Number(value)
    if (number !== null && Number.isNaN(number)) {
      throw new Error('Enter a valid number.')
    }
    return number
  }

  if (typeof originalValue === 'boolean') {
    return value === true || value === 'true'
  }

  return value
}

function normalizeKey(key) {
  return key.toLowerCase().replace(/[_-]/g, '')
}

function isFeatureField(key, value) {
  return (
    Array.isArray(value) &&
    ['features', 'featurelist', 'includedfeatures', 'capabilities'].includes(
      normalizeKey(key),
    )
  )
}

function isPricingField(key, value) {
  return (
    Array.isArray(value) &&
    ['pricingoptions', 'pricing', 'prices', 'options'].includes(
      normalizeKey(key),
    )
  )
}

function getFeatureText(feature) {
  if (!feature || typeof feature !== 'object') {
    return String(feature ?? '')
  }

  const key = ['name', 'title', 'label', 'code', 'key'].find(
    (candidate) => feature[candidate] !== undefined,
  )

  return key ? String(feature[key]) : JSON.stringify(feature)
}

function createPricingOption(existingOptions) {
  const template = existingOptions[0]
  if (!template) {
    return {
      durationMonths: 12,
      price: 0,
      discountPercent: 0,
      addonPricePerSeat: 0,
    }
  }

  return Object.fromEntries(
    Object.entries(template).map(([key, value]) => {
      const normalizedKey = normalizeKey(key)
      if (normalizedKey.includes('duration') || normalizedKey.includes('month')) {
        return [key, 12]
      }
      if (typeof value === 'number') {
        return [key, 0]
      }
      if (typeof value === 'boolean') {
        return [key, false]
      }
      return [key, '']
    }),
  )
}

/* =========================================================
   FORMAT COLUMN NAME
   ========================================================= */

function formatColumnName(column) {
  return column
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) =>
      character.toUpperCase(),
    )
}

/* =========================================================
   FORMAT DATE ONLY
   ========================================================= */

function formatDateOnly(value) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/* =========================================================
   CHECK IF VALUE IS JSON / OBJECT / ARRAY
   ========================================================= */

function isJsonValue(value) {
  return (
    value !== null &&
    typeof value === 'object'
  )
}

/* =========================================================
   REMOVE HIDDEN FIELDS RECURSIVELY
   ========================================================= */

function removeHiddenFields(value) {
  if (Array.isArray(value)) {
    return value.map((item) =>
      removeHiddenFields(item),
    )
  }

  if (
    value &&
    typeof value === 'object'
  ) {
    return Object.fromEntries(
      Object.entries(value)
        .filter(
          ([key]) =>
            !isHiddenPlanField(key),
        )
        .map(([key, nestedValue]) => [
          key,
          removeHiddenFields(nestedValue),
        ]),
    )
  }

  return value
}

/* =========================================================
   GET COLUMNS FROM ARRAY OF OBJECTS
   ========================================================= */

function getObjectArrayColumns(value) {
  if (!Array.isArray(value)) {
    return []
  }

  const columns = []

  value.forEach((item) => {
    if (
      item &&
      typeof item === 'object' &&
      !Array.isArray(item)
    ) {
      Object.keys(item).forEach((key) => {
        if (
          !isHiddenPlanField(key) &&
          !columns.includes(key)
        ) {
          columns.push(key)
        }
      })
    }
  })

  return columns
}

/* =========================================================
   FORMAT POPUP VALUE
   ========================================================= */

function formatPopupValue(
  value,
  column = '',
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-'
  }

  const lastKey = column
    .split('.')
    .pop()
    ?.toLowerCase()

  /* DATE ONLY */
  if (
    lastKey === 'createdat' ||
    lastKey === 'updatedat'
  ) {
    return formatDateOnly(value)
  }

  /* BOOLEAN */
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  /* ARRAY */
  if (Array.isArray(value)) {
    return value.length
      ? `${value.length} items`
      : '-'
  }

  /* OBJECT */
  if (
    value &&
    typeof value === 'object'
  ) {
    const entries = Object.entries(
      value,
    ).filter(
      ([key]) =>
        !isHiddenPlanField(key),
    )

    if (!entries.length) {
      return '-'
    }

    return entries
      .map(
        ([key, nestedValue]) =>
          `${formatColumnName(
            key,
          )}: ${formatPopupValue(
            nestedValue,
            `${column}.${key}`,
          )}`,
      )
      .join(', ')
  }

  return String(value)
}

/* =========================================================
   FORMAT NORMAL TABLE VALUE
   ========================================================= */

function formatPlanValue(
  value,
  column = '',
) {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return '-'
  }

  const lastKey = column
    .split('.')
    .pop()
    ?.toLowerCase()

  /* CREATED AT / UPDATED AT */
  if (
    lastKey === 'createdat' ||
    lastKey === 'updatedat'
  ) {
    return formatDateOnly(value)
  }

  /* BOOLEAN */
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }

  /* JSON */
  if (isJsonValue(value)) {
    return null
  }

  return String(value)
}

/* =========================================================
   JSON VIEW MODAL
   ========================================================= */

function JsonViewModal({
  title,
  value,
  onClose,
}) {
  const cleanedValue =
    removeHiddenFields(value)

  /* =======================================================
     ARRAY OF OBJECTS
     ======================================================= */

  const isObjectArray =
    Array.isArray(cleanedValue) &&
    cleanedValue.length > 0 &&
    cleanedValue.every(
      (item) =>
        item &&
        typeof item === 'object' &&
        !Array.isArray(item),
    )

  const arrayColumns =
    isObjectArray
      ? getObjectArrayColumns(
          cleanedValue,
        )
      : []

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/40 p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(event) =>
          event.stopPropagation()
        }
      >
        {/* =================================================
            MODAL HEADER
            ================================================= */}

        <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
              Plan Details
            </p>

            <h3 className="mt-1 text-lg font-bold text-slate-800">
              {title}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              Detailed information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            MODAL BODY
            ================================================= */}

        <div className="min-h-0 overflow-auto p-6">

          {/* =================================================
              ARRAY OF OBJECTS
              ================================================= */}

          {isObjectArray ? (
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[750px] border-collapse text-left">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                        S.No.
                      </th>

                      {arrayColumns.map(
                        (column) => (
                          <th
                            key={column}
                            className="whitespace-nowrap border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500"
                          >
                            {formatColumnName(
                              column,
                            )}
                          </th>
                        ),
                      )}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {cleanedValue.map(
                      (item, index) => (
                        <tr
                          key={index}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="whitespace-nowrap px-4 py-4">
                            <span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-emerald-50 px-2 text-xs font-bold text-emerald-700">
                              {index + 1}
                            </span>
                          </td>

                          {arrayColumns.map(
                            (column) => {
                              const cellValue =
                                item?.[
                                  column
                                ]

                              return (
                                <td
                                  key={column}
                                  className="max-w-[300px] break-words px-4 py-4 text-sm text-slate-700"
                                >
                                  {isJsonValue(
                                    cellValue,
                                  ) ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        onClose()
                                      }
                                      className="text-xs font-semibold text-emerald-600 hover:underline"
                                    >
                                      View
                                    </button>
                                  ) : (
                                    formatPopupValue(
                                      cellValue,
                                      column,
                                    )
                                  )}
                                </td>
                              )
                            },
                          )}
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : Array.isArray(
              cleanedValue,
            ) ? (
            /* =================================================
               SIMPLE ARRAY
               ================================================= */

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-[100px] border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      S.No.
                    </th>

                    <th className="border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Features
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {cleanedValue.map(
                    (item, index) => (
                      <tr
                        key={index}
                        className="transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-3 text-sm font-semibold text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-700">
                          {isJsonValue(
                            item,
                          ) ? (
                            <pre className="whitespace-pre-wrap text-xs">
                              {JSON.stringify(
                                item,
                                null,
                                2,
                              )}
                            </pre>
                          ) : (
                            formatPopupValue(
                              item,
                            )
                          )}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            /* =================================================
               NORMAL OBJECT
               ================================================= */

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full border-collapse text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="w-[40%] border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Field
                    </th>

                    <th className="border-b border-slate-200 px-4 py-3 text-xs font-bold uppercase tracking-wide text-slate-500">
                      Value
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {cleanedValue &&
                  typeof cleanedValue ===
                    'object' ? (
                    Object.entries(
                      cleanedValue,
                    )
                      .filter(
                        ([key]) =>
                          !isHiddenPlanField(
                            key,
                          ),
                      )
                      .map(
                        ([
                          column,
                          cellValue,
                        ]) => (
                          <tr
                            key={column}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="break-words px-4 py-3 text-sm font-semibold text-slate-600">
                              {formatColumnName(
                                column,
                              )}
                            </td>

                            <td className="break-words px-4 py-3 text-sm text-slate-700">
                              {isJsonValue(
                                cellValue,
                              ) ? (
                                <div className="text-xs text-slate-500">
                                  Nested data
                                </div>
                              ) : (
                                formatPopupValue(
                                  cellValue,
                                  column,
                                )
                              )}
                            </td>
                          </tr>
                        ),
                      )
                  ) : (
                    <tr>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-600">
                        Value
                      </td>

                      <td className="px-4 py-3 text-sm text-slate-700">
                        {formatPopupValue(
                          cleanedValue,
                        )}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* =================================================
            FOOTER
            ================================================= */}

        <div className="flex shrink-0 justify-end border-t border-slate-200 px-6 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

const SuperAdminPlansPage = () => {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [refreshKey, setRefreshKey] =
    useState(0)

  /* =========================================================
     SELECTED JSON
     ========================================================= */

  const [selectedJson, setSelectedJson] =
    useState(null)
  const [editingPlan, setEditingPlan] =
    useState(null)
  const [editValues, setEditValues] =
    useState({})
  const [editError, setEditError] =
    useState('')
  const [savingPlan, setSavingPlan] =
    useState(false)

  /* =========================================================
     FETCH PLANS
     ========================================================= */

  useEffect(() => {
    const controller =
      new AbortController()

    let active = true

    const loadPlans = async () => {
      if (!accessToken) {
        setPlans([])
        setError(
          'Access token not found',
        )
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')

      try {
        const response =
          await fetchSuperAdminPlans({
            accessToken,
            signal: controller.signal,
          })

        if (active) {
          setPlans(
            extractPlans(response),
          )
        }
      } catch (loadError) {
        if (
          active &&
          loadError.name !==
            'AbortError'
        ) {
          setPlans([])
          setError(
            loadError.message ||
              'Failed to fetch plans.',
          )
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadPlans()

    return () => {
      active = false
      controller.abort()
    }
  }, [accessToken, refreshKey])

  const openPlanEditor = (plan) => {
    setEditingPlan(plan)
    setEditValues(getEditablePlanValues(plan))
    setEditError('')
  }

  const handlePlanUpdate = async (event) => {
    event.preventDefault()

    const planId = getPlanId(editingPlan)

    if (planId === undefined || planId === null || planId === '') {
      setEditError('This plan has no ID and cannot be updated.')
      return
    }

    const updates = {}

    try {
      Object.entries(editValues).forEach(([key, value]) => {
        const originalValue = editingPlan[key]
        const nextValue =
          originalValue !== null && typeof originalValue === 'object'
            ? value
            : coercePlanFieldValue(value, originalValue)

        if (JSON.stringify(nextValue) !== JSON.stringify(originalValue)) {
          updates[key] = nextValue
        }
      })
    } catch (parseError) {
      setEditError(
        parseError instanceof SyntaxError
          ? 'Complex values must contain valid JSON.'
          : parseError.message,
      )
      return
    }

    if (!Object.keys(updates).length) {
      setEditError('No changes to save.')
      return
    }

    try {
      setSavingPlan(true)
      setEditError('')

      await updateSuperAdminPlan({
        accessToken,
        planId,
        updates,
      })

      setPlans((currentPlans) =>
        currentPlans.map((plan) =>
          String(getPlanId(plan)) === String(planId)
            ? { ...plan, ...updates }
            : plan,
        ),
      )
      setEditingPlan(null)
    } catch (updateError) {
      setEditError(updateError.message || 'Failed to update plan.')
    } finally {
      setSavingPlan(false)
    }
  }

  /* =========================================================
     TABLE COLUMNS
     ========================================================= */

  const columns = useMemo(
    () =>
      [
        ...new Set(
          plans.flatMap((plan) =>
            Object.keys(plan || {}),
          ),
        ),
      ].filter(
        (column) =>
          !isHiddenPlanField(column),
      ),
    [plans],
  )

  const editEntries = Object.entries(editValues)
  const featuresEntry = editEntries.find(([key, value]) =>
    isFeatureField(key, value),
  )
  const pricingEntry = editEntries.find(([key, value]) =>
    isPricingField(key, value),
  )
  const basicEntries = editEntries.filter(
    ([key, value]) =>
      !isFeatureField(key, value) &&
      !isPricingField(key, value) &&
      !isSystemPlanField(key),
  )

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <>
      <section className="mx-auto max-w-[1450px]">

        {/* =====================================================
            PAGE HEADER
            ===================================================== */}

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            

            <h2 className="text-2xl font-bold text-slate-800">
              Plans
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {loading
                ? 'Loading plans...'
                : `${plans.length} plans found`}
            </p>
          </div>

         
        </div>

        {/* =====================================================
            ERROR
            ===================================================== */}

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* =====================================================
            TABLE
            ===================================================== */}

        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[760px] border-collapse text-left">

            {/* TABLE HEADER */}
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                {columns.map(
                  (column) => (
                    <th
                      key={column}
                      className="whitespace-nowrap border-b border-slate-200 px-5 py-3 font-semibold"
                    >
                      {formatColumnName(
                        column,
                      )}
                    </th>
                  ),
                )}
                <th className="whitespace-nowrap border-b border-slate-200 px-5 py-3 text-center font-semibold">
                  Action
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={Math.max(
                      columns.length + 1,
                      1,
                    )}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    Loading plans...
                  </td>
                </tr>
              ) : plans.length ? (
                plans.map(
                  (plan, index) => (
                    <tr
                      key={
                        plan.id ??
                        plan._id ??
                        plan.planId ??
                        index
                      }
                      className="transition hover:bg-slate-50"
                    >
                      {columns.map(
                        (column) => {
                          const value =
                            plan?.[
                              column
                            ]

                          /* ==================================
                             JSON FIELD
                             ================================== */

                          if (
                            isJsonValue(
                              value,
                            )
                          ) {
                            return (
                              <td
                                key={
                                  column
                                }
                                className="px-5 py-4 align-top"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    setSelectedJson(
                                      {
                                        title:
                                          formatColumnName(
                                            column,
                                          ),
                                        value:
                                          value,
                                      },
                                    )
                                  }
                                  className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
                                >
                                  <Eye
                                    size={
                                      14
                                    }
                                    strokeWidth={
                                      2
                                    }
                                  />

                                  View
                                </button>
                              </td>
                            )
                          }

                          /* ==================================
                             NORMAL VALUE
                             ================================== */

                          return (
                            <td
                              key={
                                column
                              }
                              className="max-w-[360px] break-words px-5 py-4 align-top"
                            >
                              {formatPlanValue(
                                value,
                                column,
                              )}
                            </td>
                          )
                        },
                      )}
                      <td className="whitespace-nowrap px-5 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => openPlanEditor(plan)}
                          disabled={!getPlanId(plan)}
                          className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Pencil size={14} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={Math.max(
                      columns.length + 1,
                      1,
                    )}
                    className="px-5 py-10 text-center text-slate-500"
                  >
                    No plans found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* =======================================================
          JSON MODAL
          ======================================================= */}

      {selectedJson && (
        <JsonViewModal
          title={
            selectedJson.title
          }
          value={
            selectedJson.value
          }
          onClose={() =>
            setSelectedJson(null)
          }
        />
      )}

      {editingPlan && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-950/40 p-4"
          onClick={() => !savingPlan && setEditingPlan(null)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                  Edit Plan
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  {editingPlan.name ||
                    editingPlan.planName ||
                    editingPlan.title ||
                    'Plan details'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                disabled={savingPlan}
                aria-label="Close edit plan dialog"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form
              onSubmit={handlePlanUpdate}
              className="flex min-h-0 flex-1 flex-col"
            >
              <div className="min-h-0 space-y-6 overflow-y-auto p-5 sm:p-6">
                <section>
                  <h4 className="mb-4 text-sm font-bold text-slate-800">
                    Plan details
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {basicEntries
                      .filter(
                        ([, value]) =>
                          value === null || typeof value !== 'object',
                      )
                      .map(([key, value]) => {
                        const originalValue = editingPlan[key]
                        const normalizedKey = normalizeKey(key)
                        const isLongText = [
                          'description',
                          'summary',
                          'subtitle',
                        ].includes(normalizedKey)
                        const fieldClassName =
                          'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50'

                        return (
                          <label
                            key={key}
                            className={`block text-sm font-semibold text-slate-700 ${
                              isLongText ? 'sm:col-span-2' : ''
                            }`}
                          >
                            {formatColumnName(key)}
                            {typeof originalValue === 'boolean' ? (
                              <select
                                value={String(value)}
                                onChange={(event) =>
                                  setEditValues((current) => ({
                                    ...current,
                                    [key]: event.target.value === 'true',
                                  }))
                                }
                                disabled={savingPlan}
                                className={fieldClassName}
                              >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </select>
                            ) : isLongText ? (
                              <textarea
                                value={value ?? ''}
                                onChange={(event) =>
                                  setEditValues((current) => ({
                                    ...current,
                                    [key]: event.target.value,
                                  }))
                                }
                                rows={3}
                                disabled={savingPlan}
                                className={fieldClassName}
                              />
                            ) : (
                              <input
                                type={typeof originalValue === 'number' ? 'number' : 'text'}
                                value={value ?? ''}
                                onChange={(event) =>
                                  setEditValues((current) => ({
                                    ...current,
                                    [key]: coercePlanFieldValue(
                                      event.target.value,
                                      originalValue,
                                    ),
                                  }))
                                }
                                disabled={savingPlan}
                                className={fieldClassName}
                              />
                            )}
                          </label>
                        )
                      })}
                  </div>
                </section>

                {featuresEntry && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="text-sm font-bold text-slate-800">
                        Features
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setEditValues((current) => ({
                            ...current,
                            [featuresEntry[0]]: [
                              ...current[featuresEntry[0]],
                              typeof current[featuresEntry[0]][0] === 'object'
                                ? { name: '' }
                                : '',
                            ],
                          }))
                        }
                        disabled={savingPlan}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Plus size={14} />
                        Add feature
                      </button>
                    </div>
                    <div className="space-y-2">
                      {featuresEntry[1].map((feature, index) => {
                        const featureObjectKey =
                          feature && typeof feature === 'object'
                            ? ['name', 'title', 'label', 'code', 'key'].find(
                                (candidate) => feature[candidate] !== undefined,
                              ) || 'name'
                            : null

                        return (
                          <div
                            key={`${featuresEntry[0]}-${index}`}
                            className="flex items-center gap-2"
                          >
                            <span className="w-7 shrink-0 text-xs font-semibold text-slate-400">
                              {index + 1}.
                            </span>
                            <input
                              type="text"
                              value={getFeatureText(feature)}
                              onChange={(event) =>
                                setEditValues((current) => ({
                                  ...current,
                                  [featuresEntry[0]]: current[
                                    featuresEntry[0]
                                  ].map((item, itemIndex) =>
                                    itemIndex !== index
                                      ? item
                                      : featureObjectKey
                                        ? {
                                            ...item,
                                            [featureObjectKey]: event.target.value,
                                          }
                                        : event.target.value,
                                  ),
                                }))
                              }
                              disabled={savingPlan}
                              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setEditValues((current) => ({
                                  ...current,
                                  [featuresEntry[0]]: current[
                                    featuresEntry[0]
                                  ].filter((_, itemIndex) => itemIndex !== index),
                                }))
                              }
                              disabled={savingPlan}
                              aria-label={`Remove feature ${index + 1}`}
                              title="Remove feature"
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </section>
                )}

                {pricingEntry && (
                  <section>
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <h4 className="text-sm font-bold text-slate-800">
                        Pricing options
                      </h4>
                      <button
                        type="button"
                        onClick={() =>
                          setEditValues((current) => ({
                            ...current,
                            [pricingEntry[0]]: [
                              ...current[pricingEntry[0]],
                              createPricingOption(current[pricingEntry[0]]),
                            ],
                          }))
                        }
                        disabled={savingPlan}
                        className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                      >
                        <Plus size={14} />
                        Add option
                      </button>
                    </div>
                    <div className="space-y-3">
                      {pricingEntry[1].map((option, optionIndex) => (
                        <div
                          key={`${pricingEntry[0]}-${optionIndex}`}
                          className="rounded-lg border border-slate-200 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between">
                            <h5 className="text-xs font-bold uppercase text-slate-500">
                              Option {optionIndex + 1}
                            </h5>
                            <button
                              type="button"
                              onClick={() =>
                                setEditValues((current) => ({
                                  ...current,
                                  [pricingEntry[0]]: current[
                                    pricingEntry[0]
                                  ].filter((_, index) => index !== optionIndex),
                                }))
                              }
                              disabled={savingPlan}
                              aria-label={`Remove pricing option ${optionIndex + 1}`}
                              title="Remove option"
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {Object.entries(option || {})
                              .filter(([key]) => !isSystemPlanField(key))
                              .filter(([, value]) =>
                                value === null || typeof value !== 'object',
                              )
                              .map(([key, value]) => (
                                <label
                                  key={key}
                                  className="block text-xs font-semibold text-slate-600"
                                >
                                  {formatColumnName(key)}
                                  {typeof value === 'boolean' ? (
                                    <select
                                      value={String(value)}
                                      onChange={(event) =>
                                        setEditValues((current) => ({
                                          ...current,
                                          [pricingEntry[0]]: current[
                                            pricingEntry[0]
                                          ].map((item, index) =>
                                            index !== optionIndex
                                              ? item
                                              : {
                                                  ...item,
                                                  [key]: event.target.value === 'true',
                                                },
                                          ),
                                        }))
                                      }
                                      disabled={savingPlan}
                                      className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                                    >
                                      <option value="true">Yes</option>
                                      <option value="false">No</option>
                                    </select>
                                  ) : (
                                    <input
                                      type={typeof value === 'number' ? 'number' : 'text'}
                                      value={value ?? ''}
                                      onChange={(event) =>
                                        setEditValues((current) => ({
                                          ...current,
                                          [pricingEntry[0]]: current[
                                            pricingEntry[0]
                                          ].map((item, index) =>
                                            index !== optionIndex
                                              ? item
                                              : {
                                                  ...item,
                                                  [key]: coercePlanFieldValue(
                                                    event.target.value,
                                                    value,
                                                  ),
                                                },
                                          ),
                                        }))
                                      }
                                      disabled={savingPlan}
                                      className="mt-1.5 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-normal text-slate-700 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50"
                                    />
                                  )}
                                </label>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {editError && (
                  <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {editError}
                  </div>
                )}
              </div>

              <div className="flex shrink-0 justify-end gap-2 border-t border-slate-200 px-6 py-3">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  disabled={savingPlan}
                  className="h-10 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPlan}
                  className="h-10 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingPlan ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default SuperAdminPlansPage
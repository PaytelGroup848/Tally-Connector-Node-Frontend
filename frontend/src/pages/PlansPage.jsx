import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Check,
  Crown,
  Users,
  Zap,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'

import useAuthStore from '../store/authStore'
import usePlansStore from '../store/plansStore'
import { fetchPlans } from '../services/plansApi'
import CheckoutPage from './CheckoutPage'

const fallbackPlans = [
  {
    id: '6a92859f7ab0a704aa5bf28b',
    name: 'Pro',
    description: 'Create & Manage Entries',
    features: [
      'LEDGER_READ',
      'SYNC_LEDGER',
      'CUSTOMER_READ',
      'SUPPLIER_READ',
      'STOCK_READ',
      'VOUCHER_READ',
      'REPORTS_READ',
      'COMMAND_CREATE',
      'CONNECTOR_STATUS',
      'COMPANY_READ',
    ],
    seatLimit: 2,
    pricingOptions: [
      {
        durationMonths: 12,
        price: 5000,
        discountPercent: 0,
      },
      {
        durationMonths: 36,
        price: 11250,
        discountPercent: 25,
      },
    ],
    addonPricePerSeat: 999,
  },
  {
    id: '6a96981af843d1e46a933530',
    name: 'Growth',
    description: 'Read-Only Access',
    features: [
      'COMPANY_READ',
      'LEDGER_READ',
      'CUSTOMER_READ',
      'SUPPLIER_READ',
      'STOCK_READ',
      'VOUCHER_READ',
      'REPORTS_READ',
      'CONNECTOR_STATUS',
    ],
    seatLimit: 1,
    pricingOptions: [
      {
        durationMonths: 12,
        price: 3000,
        discountPercent: 0,
      },
      {
        durationMonths: 36,
        price: 7200,
        discountPercent: 25,
      },
    ],
    addonPricePerSeat: 999,
  },
  {
    id: '6a969869f843d1e46a933532',
    name: 'Pro Plus',
    description: 'E-Way & E-Invoices',
    features: [
      'COMPANY_READ',
      'LEDGER_READ',
      'CUSTOMER_READ',
      'SUPPLIER_READ',
      'STOCK_READ',
      'VOUCHER_READ',
      'REPORTS_READ',
      'CONNECTOR_STATUS',
      'COMMAND_CREATE',
      'SYNC_LEDGER',
      'SYNC_VOUCHER',
      'SYNC_STOCK',
      'SYNC_MASTER',
    ],
    seatLimit: 2,
    pricingOptions: [
      {
        durationMonths: 12,
        price: 7000,
        discountPercent: 0,
      },
      {
        durationMonths: 36,
        price: 15750,
        discountPercent: 25,
      },
    ],
    addonPricePerSeat: 999,
  },
]

const durations = [
  {
    months: 1,
    label: '1M',
    fullLabel: '1 Month',
  },
  {
    months: 3,
    label: '3M',
    fullLabel: '3 Months',
  },
  {
    months: 6,
    label: '6M',
    fullLabel: '6 Months',
  },
  {
    months: 12,
    label: '1Y',
    fullLabel: '1 Year',
  },
  {
    months: 36,
    label: '3Y',
    fullLabel: '3 Years',
  },
]

const featureLabels = {
  LEDGER_READ: 'Read Ledger',
  SYNC_LEDGER: 'Sync Ledger',
  CUSTOMER_READ: 'Read Customers',
  SUPPLIER_READ: 'Read Suppliers',
  STOCK_READ: 'Read Stock',
  VOUCHER_READ: 'Read Vouchers',
  REPORTS_READ: 'Access Reports',
  COMMAND_CREATE: 'Create Entries',
  CONNECTOR_STATUS: 'Connector Status',
  COMPANY_READ: 'Read Company',
  SYNC_VOUCHER: 'Sync Vouchers',
  SYNC_STOCK: 'Sync Stock',
  SYNC_MASTER: 'Sync Masters',
}

const PlanIcon = ({ planName }) => {
  if (planName === 'Growth') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <ShieldCheck size={21} />
      </div>
    )
  }

  if (planName === 'Pro Plus') {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
        <Crown size={21} />
      </div>
    )
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
      <Zap size={21} />
    </div>
  )
}

const formatPrice = (price) =>
  new Intl.NumberFormat('en-IN').format(
    Number(price) || 0,
  )

/* --------------------------------------------------
   PRICING NORMALIZATION
-------------------------------------------------- */

const normalizePricingOption = (
  option,
  fallbackMonths = 12,
) => {
  if (typeof option === 'number') {
    return {
      durationMonths: fallbackMonths,
      price: Number(option) || 0,
      discountPercent: 0,
      addonPricePerSeat: 0,
    }
  }

  const months = Number(
    option?.durationMonths ??
      option?.months ??
      option?.duration ??
      option?.billingPeriod ??
      fallbackMonths,
  )

  const price = Number(
    option?.price ??
      option?.amount ??
      option?.total ??
      option?.value ??
      option?.planPrice ??
      option?.monthlyPrice ??
      option?.basePrice ??
      0,
  )

  const discountPercent = Number(
    option?.discountPercent ??
      option?.discount ??
      option?.offerDiscount ??
      0,
  )

  const addonPricePerSeat = Number(
    option?.addonPricePerSeat ??
      option?.extraSeatPrice ??
      option?.additionalSeatPrice ??
      option?.seatPrice ??
      option?.pricePerSeat ??
      option?.perSeatPrice ??
      0,
  )

  return {
    durationMonths: Number.isFinite(months)
      ? months
      : fallbackMonths,

    price: Number.isFinite(price)
      ? price
      : 0,

    discountPercent: Number.isFinite(
      discountPercent,
    )
      ? discountPercent
      : 0,

    addonPricePerSeat: Number.isFinite(
      addonPricePerSeat,
    )
      ? addonPricePerSeat
      : 0,
  }
}

/* --------------------------------------------------
   PLAN NORMALIZATION
-------------------------------------------------- */

const normalizePlans = (inputPlans) => {
  const rawPlans = Array.isArray(inputPlans)
    ? inputPlans
    : Array.isArray(inputPlans?.plans)
      ? inputPlans.plans
      : Array.isArray(inputPlans?.data)
        ? inputPlans.data
        : Array.isArray(inputPlans?.result)
          ? inputPlans.result
          : []

  return rawPlans.map((plan, index) => {
    const pricingArray = Array.isArray(
      plan?.pricingOptions,
    )
      ? plan.pricingOptions
      : Array.isArray(plan?.pricing)
        ? plan.pricing
        : Array.isArray(plan?.prices)
          ? plan.prices
          : Array.isArray(plan?.options)
            ? plan.options
            : []

    const normalizedPricing = pricingArray.length
      ? pricingArray.map((option) =>
          normalizePricingOption(
            option,
            Number(
              option?.months ??
                option?.durationMonths ??
                option?.duration ??
                12,
            ),
          ),
        )
      : [
          normalizePricingOption(
            {
              durationMonths:
                plan?.durationMonths ??
                plan?.duration ??
                plan?.months ??
                12,

              price:
                plan?.price ??
                plan?.amount ??
                plan?.monthlyPrice ??
                plan?.basePrice ??
                0,

              discountPercent:
                plan?.discountPercent ??
                plan?.discount ??
                0,

              addonPricePerSeat:
                plan?.addonPricePerSeat ??
                plan?.extraSeatPrice ??
                plan?.additionalSeatPrice ??
                plan?.seatPrice ??
                plan?.pricePerSeat ??
                plan?.perSeatPrice ??
                0,
            },
            Number(
              plan?.durationMonths ??
                plan?.duration ??
                plan?.months ??
                12,
            ),
          ),
        ]

    const features = Array.isArray(
      plan?.features,
    )
      ? plan.features
      : Array.isArray(plan?.featureList)
        ? plan.featureList
        : Array.isArray(plan?.permissions)
          ? plan.permissions
          : []

    const normalizedAddonPrice = Number(
      plan?.addonPricePerSeat ??
        plan?.extraSeatPrice ??
        plan?.additionalSeatPrice ??
        plan?.seatPrice ??
        plan?.pricePerSeat ??
        plan?.perSeatPrice ??
        normalizedPricing.find(
          (option) =>
            Number(
              option?.addonPricePerSeat,
            ) > 0,
        )?.addonPricePerSeat ??
        0,
    )

    const pricingOptions =
      normalizedPricing.map((option) => ({
        ...option,
        addonPricePerSeat:
          Number(
            option?.addonPricePerSeat,
          ) > 0
            ? Number(
                option.addonPricePerSeat,
              )
            : normalizedAddonPrice,
      }))

    return {
      id:
        plan?.id ??
        plan?.planId ??
        plan?._id ??
        `${plan?.name ?? 'plan'}-${index}`,

      name:
        plan?.name ??
        plan?.planName ??
        plan?.title ??
        `Plan ${index + 1}`,

      description:
        plan?.description ??
        plan?.subtitle ??
        plan?.summary ??
        'Plan details',

      features,

      seatLimit: Number(
        plan?.seatLimit ??
          plan?.maxSeats ??
          plan?.seats ??
          plan?.seat_count ??
          1,
      ),

      pricingOptions,

      addonPricePerSeat:
        normalizedAddonPrice,
    }
  })
}

/* --------------------------------------------------
   PAGE
-------------------------------------------------- */

function PlansPage() {
  const accessToken = useAuthStore(
    (state) => state.accessToken,
  )

  const plansFromStore = usePlansStore(
    (state) => state.plans,
  )

  const selectedPlanId = usePlansStore(
    (state) => state.selectedPlanId,
  )

  const setPlans = usePlansStore(
    (state) => state.setPlans,
  )

  const setSelectedPlanId = usePlansStore(
    (state) => state.setSelectedPlanId,
  )

  const [selectedDuration, setSelectedDuration] =
    useState(12)

  const [selectedPlan, setSelectedPlan] =
    useState('')

  const [extraSeats, setExtraSeats] =
    useState(1)

  const [isCheckoutOpen, setIsCheckoutOpen] =
    useState(false)

  /* --------------------------------------------------
     FETCH
  -------------------------------------------------- */

  const {
    data: apiPlans = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['plans', accessToken],
    queryFn: () => fetchPlans(accessToken),
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })

  /* --------------------------------------------------
     NORMALIZE
  -------------------------------------------------- */

  const plans = useMemo(() => {
    const sourcePlans =
      Array.isArray(apiPlans) &&
      apiPlans.length
        ? apiPlans
        : fallbackPlans

    return normalizePlans(sourcePlans)
  }, [apiPlans])

  /* --------------------------------------------------
     STORE
  -------------------------------------------------- */

  useEffect(() => {
    if (!plans.length) return

    const sameData =
      plansFromStore.length ===
        plans.length &&
      plansFromStore.every(
        (plan, index) => {
          const nextPlan = plans[index]

          return (
            plan.id === nextPlan?.id &&
            plan.name === nextPlan?.name &&
            plan.description ===
              nextPlan?.description &&
            plan.seatLimit ===
              nextPlan?.seatLimit &&
            plan.addonPricePerSeat ===
              nextPlan?.addonPricePerSeat &&
            JSON.stringify(
              plan.pricingOptions,
            ) ===
              JSON.stringify(
                nextPlan?.pricingOptions,
              )
          )
        },
      )

    if (!sameData) {
      setPlans(plans)
    }
  }, [
    plans,
    plansFromStore,
    setPlans,
  ])

  /* --------------------------------------------------
     SELECTED DURATION
  -------------------------------------------------- */

  const selectedDurationData = useMemo(
    () =>
      durations.find(
        (duration) =>
          duration.months ===
          selectedDuration,
      ),
    [selectedDuration],
  )

  const visiblePlans =
    plansFromStore.length
      ? plansFromStore
      : plans

  /* --------------------------------------------------
     SELECTED PLAN
  -------------------------------------------------- */

  const selectedPlanData =
    visiblePlans.find(
      (plan) =>
        plan.name === selectedPlan ||
        plan.id === selectedPlanId,
    ) || visiblePlans[0]

  /* --------------------------------------------------
     BASE PRICE
  -------------------------------------------------- */

  const basePricing = useMemo(
    () =>
      selectedPlanData?.pricingOptions?.find(
        (option) =>
          option.durationMonths ===
          selectedDuration,
      ) ||
      selectedPlanData?.pricingOptions?.[0] ||
      null,
    [
      selectedPlanData,
      selectedDuration,
    ],
  )

  /* --------------------------------------------------
     ADDITIONAL SEAT PRICE
  -------------------------------------------------- */

  const getPlanSeatRate = (
    plan,
    durationMonths,
  ) => {
    if (!plan) return 0

    const pricing =
      Array.isArray(
        plan?.pricingOptions,
      )
        ? plan.pricingOptions.find(
            (option) =>
              option.durationMonths ===
              durationMonths,
          )
        : null

    return Number(
      pricing?.addonPricePerSeat ??
        plan?.addonPricePerSeat ??
        0,
    )
  }

  const basePlanPrice =
    Number(basePricing?.price) || 0

  const additionalSeatRate =
    getPlanSeatRate(
      selectedPlanData,
      selectedDuration,
    )

  const extraSeatTotal =
    additionalSeatRate *
    Math.max(
      0,
      Number(extraSeats || 0) - 1,
    )

  const totalAmount =
    basePlanPrice +
    extraSeatTotal

  /* --------------------------------------------------
     OPEN CHECKOUT
  -------------------------------------------------- */

  const openCheckout = (
    planName,
    planId,
  ) => {
    setSelectedPlan(planName)

    setSelectedPlanId(
      planId || planName,
    )

    setExtraSeats(1)

    setIsCheckoutOpen(true)
  }

  /* --------------------------------------------------
     CHECKOUT
  -------------------------------------------------- */

  if (isCheckoutOpen) {
    return (
      <CheckoutPage
        selectedPlanData={
          selectedPlanData
        }
        selectedDurationData={
          selectedDurationData
        }
        accessToken={accessToken}
        extraSeats={extraSeats}
        setExtraSeats={
          setExtraSeats
        }
        basePlanPrice={
          basePlanPrice
        }
        addonPricePerSeat={
          additionalSeatRate
        }
        extraSeatTotal={
          extraSeatTotal
        }
        totalAmount={
          totalAmount
        }
        onBack={() =>
          setIsCheckoutOpen(false)
        }
        PlanIcon={PlanIcon}
        featureLabels={
          featureLabels
        }
        formatPrice={
          formatPrice
        }
      />
    )
  }

  /* --------------------------------------------------
     UI
  -------------------------------------------------- */

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-[#F0FDF4] via-[#F7FAF8] to-white px-4 py-3 sm:px-5 lg:px-6">

      <div className="mx-auto flex h-full max-w-7xl flex-col">

        {/* HEADER */}
        <div className="shrink-0 text-center">

          <div className="mb-1.5 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-green-700">
            Flexible Plans
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-[#143D2A] sm:text-3xl lg:text-4xl">
            Choose the right plan
          </h1>

          <p className="mx-auto mt-1.5 max-w-2xl text-xs leading-5 text-slate-500 sm:text-sm">
            Powerful Tally connectivity,
            reporting and business management
            tools designed for your workflow.
          </p>

        </div>

        {/* ERROR */}
        {isError && (
          <div className="mt-3 shrink-0 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
            {error?.message ||
              'Unable to load plans right now you are seeing the old plan.'}
          </div>
        )}

        {/* DURATION */}
        <div className="mt-3 flex shrink-0 justify-center">
          <div className="inline-flex flex-wrap justify-center gap-1 rounded-xl border border-green-100 bg-white p-1 shadow-sm">
            {durations.map(
              (duration) => {
                const isAvailable =
                  visiblePlans.some(
                    (plan) =>
                      Array.isArray(
                        plan.pricingOptions,
                      ) &&
                      plan.pricingOptions.some(
                        (option) =>
                          option.durationMonths ===
                          duration.months,
                      ),
                  )

                const isSelected =
                  selectedDuration ===
                  duration.months

                return (
                  <button
                    key={
                      duration.months
                    }
                    type="button"
                    disabled={
                      !isAvailable
                    }
                    onClick={() =>
                      isAvailable &&
                      setSelectedDuration(
                        duration.months,
                      )
                    }
                    className={`min-w-[64px] rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#16A34A] text-white shadow-md shadow-green-200'
                        : isAvailable
                          ? 'text-slate-600 hover:bg-green-50 hover:text-green-700'
                          : 'cursor-not-allowed text-slate-300'
                    }`}
                  >
                    {
                      duration.label
                    }

                    {!isAvailable && (
                      <span className="ml-1 text-[8px]">
                        N/A
                      </span>
                    )}
                  </button>
                )
              },
            )}
          </div>
        </div>

        {/* DURATION LABEL */}
        <p className="mt-1 shrink-0 text-center text-[10px] text-slate-400">
          {
            selectedDurationData?.fullLabel
          }

          {selectedDuration ===
            36 && (
            <span className="ml-1.5 font-semibold text-green-600">
              Save 25%
            </span>
          )}
        </p>

        {/* PLANS */}
        <div className="mt-3 min-h-0 flex-1">
          <div className="grid h-full gap-4 lg:grid-cols-3">

            {visiblePlans.map(
              (plan) => {
                const pricing =
                  Array.isArray(
                    plan.pricingOptions,
                  )
                    ? plan.pricingOptions.find(
                        (option) =>
                          option.durationMonths ===
                          selectedDuration,
                      )
                    : null

                const planSeatRate =
                  getPlanSeatRate(
                    plan,
                    selectedDuration,
                  )

                const isPopular =
                  plan.name ===
                  'Pro'

                const isSelected =
                  selectedPlan ===
                    plan.name ||
                  selectedPlanId ===
                    (plan.id ||
                      plan.name)

                return (
                  <div
                    key={
                      plan.id ||
                      plan.name
                    }
                    className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white ${
                      isPopular
                        ? 'border-2 border-green-500 shadow-[0_12px_35px_rgba(22,163,74,0.12)]'
                        : 'border border-slate-200 shadow-sm'
                    }`}
                  >

                    {/* POPULAR */}
                    {isPopular && (
                      <div className="absolute right-4 top-4 rounded-full bg-green-600 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-white">
                        Most Popular
                      </div>
                    )}

                    {/* TOP */}
                    <div className="shrink-0 p-5 pb-4">

                      <div className="flex items-start gap-3">

                        <PlanIcon
                          planName={
                            plan.name
                          }
                        />

                        <div className="min-w-0 pr-20">

                          <h2 className="text-lg font-bold text-[#143D2A]">
                            {
                              plan.name
                            }
                          </h2>

                          <p className="mt-0.5 text-xs text-slate-500">
                            {
                              plan.description
                            }
                          </p>

                        </div>
                      </div>

                      {/* PRICE */}
                      <div className="mt-4">

                        {pricing ? (
                          <>
                            <div className="flex items-end gap-1.5">

                              <span className="text-3xl font-extrabold tracking-tight text-[#143D2A]">
                                ₹
                                {formatPrice(
                                  pricing.price,
                                )}
                              </span>

                              <span className="mb-0.5 text-xs text-slate-400">
                                /
                                {
                                  selectedDurationData?.label
                                }
                              </span>

                            </div>

                            {pricing.discountPercent >
                              0 && (
                              <div className="mt-1.5 inline-flex rounded-full bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700">
                                {
                                  pricing.discountPercent
                                }
                                % OFF
                              </div>
                            )}

                            {selectedDuration ===
                              36 && (
                              <p className="mt-1 text-[10px] text-slate-400">
                                ≈ ₹
                                {formatPrice(
                                  Math.round(
                                    pricing.price /
                                      36,
                                  ),
                                )}{' '}
                                / month
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="text-2xl font-bold text-slate-300">
                              Not Available
                            </div>

                            <p className="mt-1 text-[10px] text-slate-400">
                              This duration
                              is not
                              available.
                            </p>
                          </>
                        )}

                      </div>

                      {/* BUTTON */}
                      <div className="mt-4">
                        <button
                          type="button"
                          disabled={
                            !pricing
                          }
                          onClick={() => {
                            const key =
                              plan.id ||
                              plan.name

                            setSelectedPlan(
                              plan.name,
                            )

                            setSelectedPlanId(
                              key,
                            )

                            setExtraSeats(
                              1,
                            )

                            setIsCheckoutOpen(
                              true,
                            )
                          }}
                          className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-semibold transition-all ${
                            pricing
                              ? isSelected
                                ? 'bg-[#16A34A] text-white shadow-md shadow-green-200 hover:bg-[#15803D]'
                                : 'border border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                              : 'cursor-not-allowed bg-slate-100 text-slate-300'
                          }`}
                        >
                          {pricing
                            ? isSelected
                              ? 'Selected Plan'
                              : 'Choose Plan'
                            : 'Unavailable'}

                          {pricing && (
                            <ArrowRight
                              size={
                                14
                              }
                            />
                          )}
                        </button>
                      </div>

                    </div>

                    <div className="mx-5 shrink-0 border-t border-slate-100" />

                    {/* CONTENT */}
                    <div className="flex min-h-0 flex-1 flex-col p-5 pt-4">

                      <div className="flex shrink-0 items-center justify-between">

                        <h3 className="text-xs font-bold text-[#143D2A]">
                          What's included
                        </h3>

                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Users
                            size={
                              12
                            }
                          />

                          {
                            plan.seatLimit ||
                            1
                          }{' '}
                          seat
                          {(plan.seatLimit ||
                            1) > 1
                            ? 's'
                            : ''}
                        </div>

                      </div>

                      {/* FEATURES */}
                      <div className="mt-3 min-h-0 flex-1 overflow-hidden">
                        <div className="space-y-1.5">

                          {(
                            plan.features ||
                            []
                          ).map(
                            (
                              feature,
                            ) => (
                              <div
                                key={
                                  feature
                                }
                                className="flex items-start gap-2"
                              >
                                <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                                  <Check
                                    size={
                                      10
                                    }
                                    strokeWidth={
                                      3
                                    }
                                  />
                                </div>

                                <span className="text-[11px] leading-4 text-slate-600">
                                  {
                                    featureLabels[
                                      feature
                                    ] ||
                                      feature
                                  }
                                </span>
                              </div>
                            ),
                          )}

                        </div>
                      </div>

                      {/* ADDITIONAL SEAT */}
                      <div className="mt-3 shrink-0 rounded-lg border border-green-100 bg-green-50/70 px-3 py-2.5">

                        <div className="flex items-center justify-between gap-2">

                          <div>
                            <span className="block text-[10px] font-semibold text-green-700">
                              Additional seat
                            </span>

                            <span className="block text-[9px] text-green-600/80">
                              Per additional user
                            </span>
                          </div>

                          <span className="text-right text-sm font-bold text-[#143D2A]">
                            ₹
                            {formatPrice(
                              planSeatRate,
                            )}

                            <span className="ml-1 text-[9px] font-medium text-slate-500">
                              / seat
                            </span>
                          </span>

                        </div>
                      </div>

                    </div>
                  </div>
                )
              },
            )}

          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="mt-2 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500">
            Loading plans...
          </div>
        )}

      </div>
    </div>
  )
}

export default PlansPage
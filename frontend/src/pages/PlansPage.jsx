import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Check,
  Crown,
  Users,
  Zap,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import useAuthStore from "../store/authStore";
import usePlansStore from "../store/plansStore";
import { fetchPlans } from "../services/plansApi";
import CheckoutPage from "./CheckoutPage";

/* =========================================================
   FALLBACK PLANS
========================================================= */

const fallbackPlans = [
  {
    id: "6ab4ea8e13c17fc5c86be1de",
    name: "Pro",
    description: "Complete Tally Sync & Management",

    features: [
      "COMPANY_READ",
      "LEDGER_READ",
      "CUSTOMER_READ",
      "SUPPLIER_READ",
      "STOCK_READ",
      "VOUCHER_READ",
      "REPORTS_READ",
      "CONNECTOR_STATUS",
      "COMMAND_CREATE",
      "SYNC_LEDGER",
      "SYNC_VOUCHER",
      "SYNC_STOCK",
      "SYNC_MASTER",
    ],

    seatLimit: 1,

    pricingOptions: [
      {
        durationMonths: 6,
        price: 1650,
        discountPercent: 0,
        addonPricePerSeat: 1650,
      },
      {
        durationMonths: 12,
        price: 3000,
        discountPercent: 0,
        addonPricePerSeat: 3000,
      },
      {
        durationMonths: 24,
        price: 60000,
        discountPercent: 0,
        addonPricePerSeat: 60000,
      },
    ],

    addonPricePerSeat: 3000,
  },
];

/* =========================================================
   DURATIONS
========================================================= */

const durations = [
  {
    months: 6,
    label: "6M",
    fullLabel: "6 Months",
  },
  {
    months: 12,
    label: "1Y",
    fullLabel: "1 Year",
  },
  {
    months: 24,
    label: "2Y",
    fullLabel: "2 Years",
  },
];

const featureLabels = {
  LEDGER_READ: "Read Ledger",
  SYNC_LEDGER: "Sync Ledger",

  CUSTOMER_READ: "Read Customers",
  SUPPLIER_READ: "Read Suppliers",
  STOCK_READ: "Read Stock",
  VOUCHER_READ: "Read Vouchers",

  REPORTS_READ: "Access Reports",
  COMMAND_CREATE: "Create Entries",

  CONNECTOR_STATUS: "Connector Status",
  COMPANY_READ: "Read Company",

  SYNC_VOUCHER: "Sync Vouchers",
  SYNC_STOCK: "Sync Stock",
  SYNC_MASTER: "Sync Masters",

  EWAY_CREATE: "Create E-Way Bills",
  EWAY_READ: "Read E-Way Bills",

  EINVOICE_CREATE: "Create E-Invoices",
  EINVOICE_READ: "Read E-Invoices",

  PAYMENT_READ: "Read Payments",
  PAYMENT_CREATE: "Create Payments",

  USER_READ: "Read Users",
  USER_CREATE: "Create Users",
};

const PlanIcon = ({ planName }) => {
  if (planName === "Growth") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
        <ShieldCheck size={21} />
      </div>
    );
  }

  if (planName === "Pro Plus") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
        <Crown size={21} />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-100 text-lime-700">
      <Zap size={21} />
    </div>
  );
};

/* =========================================================
   FORMAT PRICE
========================================================= */

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN").format(Number(price) || 0);

/* =========================================================
   NORMALIZE PRICING OPTION
========================================================= */

const normalizePricingOption = (option, fallbackMonths = 12) => {
  if (typeof option === "number") {
    return {
      durationMonths: fallbackMonths,
      price: Number(option) || 0,
      discountPercent: 0,
      addonPricePerSeat: 0,
    };
  }

  const months = Number(
    option?.durationMonths ??
      option?.months ??
      option?.duration ??
      option?.billingPeriod ??
      fallbackMonths,
  );

  const price = Number(
    option?.price ??
      option?.amount ??
      option?.total ??
      option?.value ??
      option?.planPrice ??
      option?.monthlyPrice ??
      option?.basePrice ??
      0,
  );

  const discountPercent = Number(
    option?.discountPercent ?? option?.discount ?? option?.offerDiscount ?? 0,
  );

  const addonPricePerSeat = Number(
    option?.addonPricePerSeat ??
      option?.extraSeatPrice ??
      option?.additionalSeatPrice ??
      option?.seatPrice ??
      option?.pricePerSeat ??
      option?.perSeatPrice ??
      0,
  );

  return {
    durationMonths: Number.isFinite(months) ? months : fallbackMonths,

    price: Number.isFinite(price) ? price : 0,

    discountPercent: Number.isFinite(discountPercent) ? discountPercent : 0,

    addonPricePerSeat: Number.isFinite(addonPricePerSeat)
      ? addonPricePerSeat
      : 0,
  };
};

/* =========================================================
   NORMALIZE FEATURES
========================================================= */

const normalizeFeatures = (plan) => {
  let rawFeatures = [];

  if (Array.isArray(plan?.features)) {
    rawFeatures = plan.features;
  } else if (Array.isArray(plan?.featureList)) {
    rawFeatures = plan.featureList;
  } else if (Array.isArray(plan?.permissions)) {
    rawFeatures = plan.permissions;
  } else if (Array.isArray(plan?.includedFeatures)) {
    rawFeatures = plan.includedFeatures;
  } else if (Array.isArray(plan?.capabilities)) {
    rawFeatures = plan.capabilities;
  }

  return [
    ...new Set(
      rawFeatures
        .map((feature) => {
          if (typeof feature === "string") {
            return feature.trim();
          }

          if (feature && typeof feature === "object") {
            const enabled =
              feature.enabled ??
              feature.active ??
              feature.isActive ??
              feature.included ??
              feature.allowed ??
              true;

            if (enabled === false) {
              return null;
            }

            return (
              feature.code ??
              feature.key ??
              feature.permission ??
              feature.permissionCode ??
              feature.featureCode ??
              feature.slug ??
              feature.id ??
              feature.name ??
              feature.title ??
              null
            );
          }

          return null;
        })
        .filter(Boolean)
        .map((feature) => String(feature).trim()),
    ),
  ];
};

/* =========================================================
   NORMALIZE PLANS
========================================================= */

const normalizePlans = (input) => {
  let rawPlans = [];

  if (Array.isArray(input)) {
    rawPlans = input;
  } else if (Array.isArray(input?.plans)) {
    rawPlans = input.plans;
  } else if (Array.isArray(input?.data?.plans)) {
    rawPlans = input.data.plans;
  } else if (Array.isArray(input?.data)) {
    rawPlans = input.data;
  } else if (Array.isArray(input?.result)) {
    rawPlans = input.result;
  } else if (Array.isArray(input?.result?.plans)) {
    rawPlans = input.result.plans;
  }

  return rawPlans.map((plan, index) => {
    /* =================================================
         PRICING
      ================================================= */

    const pricingArray = Array.isArray(plan?.pricingOptions)
      ? plan.pricingOptions
      : Array.isArray(plan?.pricing)
        ? plan.pricing
        : Array.isArray(plan?.prices)
          ? plan.prices
          : Array.isArray(plan?.options)
            ? plan.options
            : [];

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
                plan?.durationMonths ?? plan?.duration ?? plan?.months ?? 12,

              price:
                plan?.price ??
                plan?.amount ??
                plan?.monthlyPrice ??
                plan?.basePrice ??
                0,

              discountPercent: plan?.discountPercent ?? plan?.discount ?? 0,

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
              plan?.durationMonths ?? plan?.duration ?? plan?.months ?? 12,
            ),
          ),
        ];

    /* =================================================
         FEATURES
      ================================================= */

    const features = normalizeFeatures(plan);

    /* =================================================
         ADDON PRICE
      ================================================= */

    const normalizedAddonPrice = Number(
      plan?.addonPricePerSeat ??
        plan?.extraSeatPrice ??
        plan?.additionalSeatPrice ??
        plan?.seatPrice ??
        plan?.pricePerSeat ??
        plan?.perSeatPrice ??
        normalizedPricing.find(
          (option) => Number(option?.addonPricePerSeat) > 0,
        )?.addonPricePerSeat ??
        0,
    );

    /* =================================================
         PRICING OPTIONS
      ================================================= */

    const pricingOptions = normalizedPricing.map((option) => ({
      ...option,

      addonPricePerSeat:
        Number(option?.addonPricePerSeat) > 0
          ? Number(option.addonPricePerSeat)
          : normalizedAddonPrice,
    }));

    return {
      id:
        plan?.id ??
        plan?.planId ??
        plan?._id ??
        `${plan?.name ?? "plan"}-${index}`,

      name: plan?.name ?? plan?.planName ?? plan?.title ?? `Plan ${index + 1}`,

      description:
        plan?.description ?? plan?.subtitle ?? plan?.summary ?? "Plan details",

      features,

      seatLimit: Number(
        plan?.seatLimit ??
          plan?.maxSeats ??
          plan?.seats ??
          plan?.seat_count ??
          1,
      ),

      pricingOptions,

      addonPricePerSeat: normalizedAddonPrice,
    };
  });
};

/* =========================================================
   PAGE
========================================================= */

function PlansPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const plansFromStore = usePlansStore((state) => state.plans);

  const selectedPlanId = usePlansStore((state) => state.selectedPlanId);

  const setPlans = usePlansStore((state) => state.setPlans);

  const setSelectedPlanId = usePlansStore((state) => state.setSelectedPlanId);

  const [selectedDuration, setSelectedDuration] = useState(12);

  const [selectedPlan, setSelectedPlan] = useState("");

  const [extraSeats, setExtraSeats] = useState(1);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  /* =========================================================
     FETCH
  ========================================================= */

  const {
    data: apiPlans,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["plans", accessToken],

    queryFn: () => fetchPlans(accessToken),

    enabled: !!accessToken,

    staleTime: 5 * 60 * 1000,

    retry: 1,
  });

  /* =========================================================
     NORMALIZE API DATA
  ========================================================= */

  const plans = useMemo(() => {
    const normalizedApiPlans = normalizePlans(apiPlans);

    if (normalizedApiPlans.length) {
      return normalizedApiPlans;
    }

    return normalizePlans(fallbackPlans);
  }, [apiPlans]);

  /* =========================================================
     STORE
  ========================================================= */

  useEffect(() => {
    if (!plans.length) {
      return;
    }

    const sameData =
      plansFromStore.length === plans.length &&
      plansFromStore.every((plan, index) => {
        const nextPlan = plans[index];

        return (
          plan.id === nextPlan?.id &&
          plan.name === nextPlan?.name &&
          plan.description === nextPlan?.description &&
          plan.seatLimit === nextPlan?.seatLimit &&
          plan.addonPricePerSeat === nextPlan?.addonPricePerSeat &&
          JSON.stringify(plan.features || []) ===
            JSON.stringify(nextPlan?.features || []) &&
          JSON.stringify(plan.pricingOptions || []) ===
            JSON.stringify(nextPlan?.pricingOptions || [])
        );
      });

    if (!sameData) {
      setPlans(plans);
    }
  }, [plans, plansFromStore, setPlans]);

  /* =========================================================
     DURATION
  ========================================================= */

  const selectedDurationData = useMemo(
    () => durations.find((duration) => duration.months === selectedDuration),
    [selectedDuration],
  );

  /* =========================================================
     VISIBLE PLANS
  ========================================================= */

  const visiblePlans = plansFromStore.length ? plansFromStore : plans;

  /* =========================================================
     SELECTED PLAN
  ========================================================= */

  const selectedPlanData =
    visiblePlans.find(
      (plan) => plan.name === selectedPlan || plan.id === selectedPlanId,
    ) || visiblePlans[0];

  /* =========================================================
     BASE PRICE
  ========================================================= */

  const basePricing = useMemo(
    () =>
      selectedPlanData?.pricingOptions?.find(
        (option) => Number(option.durationMonths) === Number(selectedDuration),
      ) ||
      selectedPlanData?.pricingOptions?.[0] ||
      null,

    [selectedPlanData, selectedDuration],
  );

  /* =========================================================
     SEAT PRICE
  ========================================================= */

  const getPlanSeatRate = (plan, durationMonths) => {
    if (!plan) {
      return 0;
    }

    const pricing = Array.isArray(plan?.pricingOptions)
      ? plan.pricingOptions.find(
          (option) => Number(option.durationMonths) === Number(durationMonths),
        )
      : null;

    return Number(pricing?.addonPricePerSeat ?? plan?.addonPricePerSeat ?? 0);
  };

  const basePlanPrice = Number(basePricing?.price) || 0;

  const additionalSeatRate = getPlanSeatRate(
    selectedPlanData,
    selectedDuration,
  );

  const extraSeatTotal =
    additionalSeatRate * Math.max(0, Number(extraSeats || 0) - 1);

  const totalAmount = basePlanPrice + extraSeatTotal;

  const openCheckout = (planName, planId) => {
    setSelectedPlan(planName);

    setSelectedPlanId(planId || planName);

    setExtraSeats(1);

    setIsCheckoutOpen(true);
  };

  if (isCheckoutOpen) {
    return (
      <CheckoutPage
        selectedPlanData={selectedPlanData}
        selectedDurationData={selectedDurationData}
        setSelectedDuration={setSelectedDuration}
        accessToken={accessToken}
        extraSeats={extraSeats}
        setExtraSeats={setExtraSeats}
        basePlanPrice={basePlanPrice}
        addonPricePerSeat={additionalSeatRate}
        extraSeatTotal={extraSeatTotal}
        totalAmount={totalAmount}
        onBack={() => setIsCheckoutOpen(false)}
        PlanIcon={PlanIcon}
        featureLabels={featureLabels}
        formatPrice={formatPrice}
      />
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto bg-gradient-to-br from-[#F0FDF4] via-[#F7FAF8] to-white px-3 py-2 sm:px-4 sm:py-3 lg:px-6">
      <div className="mx-auto flex h-full max-w-7xl flex-col">
        <div className="shrink-0 text-center">
          <div className="mb-1 inline-flex items-center rounded-full border border-green-200 bg-green-50 px-3 py-1 text-[8px] font-bold uppercase tracking-[0.18em] text-green-700 sm:text-[9px]">
            Flexible Plan
          </div>

          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-[#143D2A] sm:text-3xl lg:text-4xl">
            Choose the right plan
          </h1>

          <p className="mx-auto mt-1 max-w-2xl text-[10px] leading-4 text-slate-500 sm:text-xs lg:text-sm">
            Powerful Tally connectivity, reporting and business management tools
            designed for your workflow.
          </p>
        </div>

        {isError && (
          <div className="mt-2 shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-[10px] text-red-700">
            {error?.message || "Unable to load plans right now."}
          </div>
        )}

        <div className="mt-2 min-h-0 flex-1 sm:mt-3">
          <div className="flex h-full flex-wrap items-stretch justify-center gap-3">
            {visiblePlans.map((plan) => {
              const pricing = Array.isArray(plan.pricingOptions)
                ? plan.pricingOptions.find(
                    (option) =>
                      Number(option.durationMonths) ===
                      Number(selectedDuration),
                  )
                : null;

              const planSeatRate = getPlanSeatRate(plan, selectedDuration);

              const isPopular = plan.name === "Pro";

              const isSelected =
                selectedPlan === plan.name || selectedPlanId === plan.id;

              const featureCount = Array.isArray(plan.features)
                ? plan.features.length
                : 0;

              const featureColumns =
                featureCount > 8 ? "grid-cols-2 lg:grid-cols-3" : "grid-cols-2";

              return (
                <div
                  key={plan.id || plan.name}
                  className={`relative flex h-full min-h-0 w-full max-w-sm flex-col rounded-2xl bg-white sm:max-w-md ${
                    isPopular
                      ? "border-2 border-green-500 shadow-[0_10px_30px_rgba(22,163,74,0.12)]"
                      : "border border-slate-200 shadow-sm"
                  }`}
                >
                  {/* =================================================
                        POPULAR
                    ================================================= */}

                  {isPopular && (
                    <div className="absolute right-3 top-3 z-10 rounded-full bg-green-600 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-white sm:right-4 sm:top-4 sm:text-[8px]">
                      Most Popular
                    </div>
                  )}

                  {/* =================================================
                        TOP
                    ================================================= */}

                  <div className="shrink-0 p-3 pb-2.5 sm:p-4 sm:pb-3 lg:p-5 lg:pb-3">
                    <div className="flex min-h-[62px] items-start gap-2.5 sm:min-h-[68px] sm:gap-3">
                      {/* PLAN ICON */}

                      <PlanIcon planName={plan.name} />

                      {/* PLAN TITLE + DESCRIPTION */}

                      <div className="min-w-0 flex-1 pr-12">
                        <h2 className="truncate text-base font-bold leading-tight text-[#143D2A] sm:text-lg">
                          {plan.name}
                        </h2>

                        {/* DESCRIPTION */}

                        <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-4 text-green-700 sm:text-[11px] sm:leading-4">
                          {plan.description || "Plan details"}
                        </p>
                      </div>
                    </div>

                    {/* =================================================
                          PRICE
                      ================================================= */}

                    <div className="mt-2 min-h-[45px] sm:mt-3">
                      {pricing ? (
                        <>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-extrabold leading-none tracking-tight text-[#143D2A] sm:text-3xl lg:text-4xl">
                              ₹{formatPrice(pricing.price)}
                            </span>

                            <span className="mb-0.5 text-[8px] text-slate-400 sm:mb-1 sm:text-[10px]">
                              /{selectedDurationData?.label}
                            </span>
                          </div>

                          {pricing.discountPercent > 0 && (
                            <div className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-0.5 text-[8px] font-bold text-green-700">
                              {pricing.discountPercent}% OFF
                            </div>
                          )}

                          <p className="mt-1 text-[8px] text-slate-400 sm:text-[9px]">
                            + 18% GST at checkout
                          </p>
                        </>
                      ) : (
                        <div className="text-xl font-bold text-slate-300">
                          Not Available
                        </div>
                      )}
                    </div>

                    {/* =================================================
                          BUTTON
                      ================================================= */}

                    <button
                      type="button"
                      disabled={!pricing}
                      onClick={() => openCheckout(plan.name, plan.id)}
                      className={`mt-2.5 flex h-9 w-full items-center justify-center gap-1.5 rounded-lg px-3 text-[10px] font-semibold transition-all sm:mt-3 sm:h-10 sm:text-xs ${
                        pricing
                          ? isSelected
                            ? "bg-[#0abe4c] text-white shadow-md shadow-green-200 hover:bg-[#15803D]"
                            : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                          : "cursor-not-allowed bg-slate-100 text-slate-300"
                      }`}
                    >
                      {pricing
                        ? isSelected
                          ? "Selected Plan"
                          : "Choose Plan"
                        : "Unavailable"}

                      {pricing && <ArrowRight size={13} />}
                    </button>
                  </div>

                  {/* =================================================
                        DIVIDER
                    ================================================= */}

                  <div className="mx-3 shrink-0 border-t border-slate-100 sm:mx-4 lg:mx-5" />

                  {/* =================================================
                        FEATURES AREA
                    ================================================= */}

                  <div className="flex min-h-0 flex-1 flex-col p-3 pt-2.5 sm:p-4 sm:pt-3 lg:p-5 lg:pt-3">
                    {/* FEATURES HEADER */}

                    <div className="flex shrink-0 items-center justify-between gap-2">
                      <h3 className="text-[10px] font-bold text-[#143D2A] sm:text-xs">
                        What's included
                      </h3>

                      <div className="flex shrink-0 items-center gap-1 text-[8px] text-slate-400 sm:text-[9px]">
                        <Users size={10} />
                        {plan.seatLimit || 1} User
                        {(plan.seatLimit || 1) > 1 ? "s" : ""}
                      </div>
                    </div>

                    {/* =================================================
                          FEATURES
                      ================================================= */}

                    <div
                      className={`
                          mt-2.5
                          grid
                          ${featureColumns}
                          content-start
                          gap-x-3
                          gap-y-1.5
                          sm:mt-3
                          sm:gap-x-4
                          sm:gap-y-2
                        `}
                    >
                      {(plan.features || []).map((feature) => (
                        <div
                          key={feature}
                          className="flex min-w-0 items-start gap-1.5"
                        >
                          <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 sm:h-4 sm:w-4">
                            <Check size={8} strokeWidth={3} />
                          </div>

                          <span className="min-w-0 break-words text-[8px] leading-3 text-slate-600 sm:text-[9px] sm:leading-3.5 lg:text-[10px]">
                            {featureLabels?.[feature] || feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* =================================================
                          BOTTOM AREA
                      ================================================= */}

                    <div className="mt-auto pt-2.5 sm:pt-3">
                      <div className="rounded-lg border border-green-100 bg-green-50/70 px-2.5 py-2 sm:rounded-xl sm:px-3 sm:py-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="block text-[8px] font-semibold text-green-700 sm:text-[9px] lg:text-[10px]">
                              Additional User
                            </span>

                            <span className="mt-0.5 block text-[7px] text-green-600/80 sm:text-[8px] lg:text-[9px]">
                              Per additional user
                            </span>
                          </div>

                          <span className="shrink-0 text-xs font-bold text-[#143D2A] sm:text-sm">
                            ₹{formatPrice(planSeatRate)}
                            <span className="ml-1 text-[7px] font-medium text-slate-500 sm:text-[8px]">
                              / User
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {isLoading && (
          <div className="mt-2 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-center text-[9px] text-slate-500">
            Loading plans...
          </div>
        )}
      </div>
    </div>
  );
}

export default PlansPage;

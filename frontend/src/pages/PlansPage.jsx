import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";

import PlanCard, { PlanIcon } from "../components/plans/PlanCard";
import useAuthStore from "../store/authStore";
import usePlansStore from "../store/plansStore";
import { fetchPlans } from "../services/plansApi";
import {
  durations,
  fallbackPlans,
  featureLabels,
  formatPrice,
  normalizePlans,
} from "../utils/plans";
import CheckoutPage from "./CheckoutPage";

function PlansPage() {
  const navigate = useNavigate();
  const accessToken = useAuthStore((state) => state.accessToken);
  const logout = useAuthStore((state) => state.logout);
  const plansFromStore = usePlansStore((state) => state.plans);
  const selectedPlanId = usePlansStore((state) => state.selectedPlanId);
  const setPlans = usePlansStore((state) => state.setPlans);
  const setSelectedPlanId = usePlansStore((state) => state.setSelectedPlanId);

  const [selectedDuration, setSelectedDuration] = useState(12);
  const [selectedPlan, setSelectedPlan] = useState("");
  const [extraSeats, setExtraSeats] = useState(1);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

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

  const plans = useMemo(() => {
    const normalizedApiPlans = normalizePlans(apiPlans);
    return normalizedApiPlans.length ? normalizedApiPlans : normalizePlans(fallbackPlans);
  }, [apiPlans]);

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

  const selectedDurationData = useMemo(
    () => durations.find((duration) => duration.months === selectedDuration),
    [selectedDuration],
  );

  const visiblePlans = plansFromStore.length ? plansFromStore : plans;

  const selectedPlanData =
    visiblePlans.find(
      (plan) => plan.name === selectedPlan || plan.id === selectedPlanId,
    ) || visiblePlans[0];

  const basePricing = useMemo(
    () =>
      selectedPlanData?.pricingOptions?.find(
        (option) => Number(option.durationMonths) === Number(selectedDuration),
      ) ||
      selectedPlanData?.pricingOptions?.[0] ||
      null,
    [selectedPlanData, selectedDuration],
  );

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
  const additionalSeatRate = getPlanSeatRate(selectedPlanData, selectedDuration);
  const extraSeatTotal =
    additionalSeatRate * Math.max(0, Number(extraSeats || 0) - 1);
  const totalAmount = basePlanPrice + extraSeatTotal;

  const openCheckout = (planName, planId) => {
    setSelectedPlan(planName);
    setSelectedPlanId(planId || planName);
    setExtraSeats(1);
    setIsCheckoutOpen(true);
  };

  const handleLogout = () => {
    if (typeof logout === "function") {
      logout();
    } else {
      useAuthStore.setState({
        accessToken: null,
        user: null,
      });
    }

    navigate("/login", { replace: true });
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
        <div className="flex shrink-0 items-center justify-end pb-2 sm:pb-3">
          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 text-[10px] font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 hover:text-red-700 sm:h-10 sm:px-4 sm:text-xs"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>

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
            {visiblePlans.map((plan) => (
              <PlanCard
                key={plan.id || plan.name}
                plan={plan}
                selectedDuration={selectedDuration}
                selectedDurationData={selectedDurationData}
                selectedPlan={selectedPlan}
                selectedPlanId={selectedPlanId}
                onSelect={openCheckout}
              />
            ))}
          </div>
        </div>

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

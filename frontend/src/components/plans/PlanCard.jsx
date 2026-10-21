import {
  ArrowRight,
  Check,
  Crown,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";

import { featureLabels, formatPrice } from "../../utils/plans";

export const PlanIcon = ({ planName }) => {
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

export function PlanCard({
  plan,
  selectedDuration,
  selectedDurationData,
  selectedPlan,
  selectedPlanId,
  onSelect,
}) {
  const pricing = Array.isArray(plan.pricingOptions)
    ? plan.pricingOptions.find(
        (option) => Number(option.durationMonths) === Number(selectedDuration),
      )
    : null;

  const planSeatRate = getPlanSeatRate(plan, selectedDuration);
  const isPopular = plan.name === "Pro";
  const isSelected = selectedPlan === plan.name || selectedPlanId === plan.id;
  const featureCount = Array.isArray(plan.features) ? plan.features.length : 0;
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
      {isPopular && (
        <div className="absolute right-3 top-3 z-10 rounded-full bg-green-600 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-white sm:right-4 sm:top-4 sm:text-[8px]">
          Most Popular
        </div>
      )}

      <div className="shrink-0 p-3 pb-2.5 sm:p-4 sm:pb-3 lg:p-5 lg:pb-3">
        <div className="flex min-h-[62px] items-start gap-2.5 sm:min-h-[68px] sm:gap-3">
          <PlanIcon planName={plan.name} />

          <div className="min-w-0 flex-1 pr-12">
            <h2 className="truncate text-base font-bold leading-tight text-[#143D2A] sm:text-lg">
              {plan.name}
            </h2>

            <p className="mt-1 line-clamp-2 text-[10px] font-medium leading-4 text-green-700 sm:text-[11px] sm:leading-4">
              {plan.description || "Plan details"}
            </p>
          </div>
        </div>

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
            <div className="text-[10px] font-medium text-slate-400 sm:text-xs">
              Not Available
            </div>
          )}
        </div>

        <button
          type="button"
          disabled={!pricing}
          onClick={() => onSelect(plan.name, plan.id)}
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

      <div className="mx-3 shrink-0 border-t border-slate-100 sm:mx-4 lg:mx-5" />

      <div className="flex min-h-0 flex-1 flex-col p-3 pt-2.5 sm:p-4 sm:pt-3 lg:p-5 lg:pt-3">
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
}

export default PlanCard;

import { ArrowRight, Check, Users, Zap } from "lucide-react";
import { featureLabels, formatPrice } from "./data";

export default function PriceCard({
  title,
  price,
  description,
  features,
  highlighted = false,
  seatLimit = 1,
  additionalUserPrice = 3000,
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-[24px] border-2 p-5 transition duration-300 sm:p-6 ${highlighted
        ? "border-emerald-700 bg-white shadow-[0_20px_50px_rgba(97,201,40,0.12)]"
        : "border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
        }`}
    >
      {/* Popular Badge */}
      {highlighted && (
        <div className="absolute right-4 top-4 rounded-full bg-emerald-700 px-4 py-1.5 text-[9px] font-black uppercase tracking-wide text-white">
          MOST POPULAR
        </div>
      )}

      {/* Plan Header */}
      <div className="flex items-center gap-3 pr-28">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaffbf] text-[#4d9619]">
          <Zap size={23} strokeWidth={2.5} />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {title}
          </h3>

          <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
            {description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mt-10">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black tracking-tight text-[#082f3f] sm:text-[40px]">
            {price}
          </span>

          <span className="mb-2 text-[10px] font-medium text-slate-500">
            /1Y
          </span>
        </div>

        <p className="mt-0.5 text-[10px] text-slate-400">
          + 18% GST at checkout
        </p>
      </div>

      {/* Choose Plan */}
      <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#9feebd] bg-[#f3fff6] px-4 py-3 text-xs font-semibold text-emerald-700 transition hover:bg-[#eaffef]"
      >
        Choose Plan
        <ArrowRight size={15} />
      </div>

      {/* Divider */}
      <div className="my-3 h-px bg-slate-200" />

      {/* Included Header */}
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-extrabold text-slate-800">
          What's included
        </h4>

        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
          <Users size={12} />
          {seatLimit} {seatLimit === 1 ? "User" : "Users"}
        </div>
      </div>

      {/* Features */}
      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex min-w-0 items-start gap-1.5"
          >
            <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ddfae8] text-emerald-600">
              <Check size={10} strokeWidth={3} />
            </span>

            <span className="text-[10px] font-medium leading-4 text-slate-600">
              {featureLabels[feature] ||
                feature
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
          </div>
        ))}
      </div>

      {/* Additional User */}
      <div className="mt-5 rounded-xl border border-[#d5f4de] bg-[#f5fff7] px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-emerald-700">
              Additional User
            </p>

            <p className="mt-0.5 text-[9px] text-slate-500">
              Per additional user
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-slate-900">
              ₹{formatPrice(additionalUserPrice)}
            </span>

            <span className="ml-1 text-[9px] text-slate-500">
              / User
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

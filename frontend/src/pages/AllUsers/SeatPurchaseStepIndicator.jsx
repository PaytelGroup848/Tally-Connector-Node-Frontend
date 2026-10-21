import { CheckCircle2 } from "lucide-react";

export default function SeatPurchaseStepIndicator({ step }) {
  return (
    <div className="border-b border-slate-200 bg-slate-50 px-5 py-3 md:px-6">
      <div className="flex items-center">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step === "select"
              ? "bg-emerald-600 text-white"
              : "bg-emerald-600 text-white"
            }`}
          >
            {step === "details" ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              "1"
            )}
          </span>
          <span className={`text-xs font-semibold ${step === "select"
              ? "text-emerald-700"
              : "text-slate-500"
            }`}
          >
            Select seats
          </span>
        </div>

        <div className="mx-3 h-px flex-1 bg-slate-200" />

        <div className="flex min-w-0 items-center gap-2">
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${step === "details"
              ? "bg-emerald-600 text-white"
              : "bg-slate-200 text-slate-500"
            }`}
          >
            2
          </span>
          <span className={`text-xs font-semibold ${step === "details"
              ? "text-emerald-700"
              : "text-slate-400"
            }`}
          >
            Order details
          </span>
        </div>
      </div>
    </div>
  );
}

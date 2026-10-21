import { ArrowRight } from "lucide-react";

export function MiniStat({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-lg font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

export function DashboardSideItem({
  icon: Icon,
  label,
  active = false,
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${active
        ? "bg-white/10 text-[#9bf26f]"
        : "text-white/55"
        }`}
    >
      <Icon size={13} />

      <span>{label}</span>
    </div>
  );
}

export function TrustItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center justify-center gap-3 border-slate-100 px-3 text-center sm:justify-start">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
        <Icon size={18} />
      </div>

      <span className="text-xs font-bold text-slate-600 sm:text-sm">
        {text}
      </span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xl font-extrabold tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
        {description}
      </p>
    </div>
  );
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group w-full rounded-2xl border p-6 text-left transition duration-300 focus:outline-none focus:ring-[#61c928]/30 ${active
        ? "border-slate-200 bg-white hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/40"
        : "border-slate-200 bg-white hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/40"
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${active
            ? "bg-green-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"
            : "bg-green-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"
            }`}
        >
          <Icon size={22} />
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${active
            ? "bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-emerald-700"
            : "bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-emerald-700"
            }`}
          aria-hidden="true"
        >
          <ArrowRight size={16} />
        </div>
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-800">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>

      <div
        className={`mt-5 text-xs font-black uppercase tracking-[0.14em] transition ${active ? "text-slate-400 group-hover:text-emerald-700" : "text-slate-400 group-hover:text-emerald-700"
          }`}
      >
        {active ? "View feature" : "View feature"}
      </div>
    </button>
  );
}

export function ProductPoint({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-emerald-700">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="text-sm font-extrabold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

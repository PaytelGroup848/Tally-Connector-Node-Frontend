import React from "react";

export default function FeatureCards() {
  return (
    <div className="flex flex-row justify-center gap-6 p-8 bg-gradient-to-b from-white to-emerald-50/40">
      {/* AI Insights */}
      <div className="w-64 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-emerald-500"
          >
            <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
            <path d="M5 19l.8 2.4L8 22l-2.2.6L5 25l-.8-2.4L2 22l2.2-.6L5 19z" />
            <path d="M19 15l.6 1.8L21 17l-1.4.4L19 19l-.6-1.8L17 17l1.4-.4L19 15z" />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-slate-800">AI Insights</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          Get smart suggestions and stay ahead.
        </p>
      </div>

      {/* Real-Time */}
      <div className="w-64 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-emerald-500"
          >
            <path d="M2 20h.01" />
            <path d="M7 20v-4" />
            <path d="M12 20v-8" />
            <path d="M17 20V8" />
            <path d="M22 4v16" />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-slate-800">Real-Time</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          Track your business live, anytime.
        </p>
      </div>

      {/* Multi-Device */}
      <div className="w-64 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5 text-emerald-500"
          >
            <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
            <path d="M12 18h.01" />
          </svg>
        </div>
        <h3 className="mb-1 text-lg font-semibold text-slate-800">Multi-Device</h3>
        <p className="text-sm leading-relaxed text-slate-500">
          Access on web & mobile, wherever you are.
        </p>
      </div>
    </div>
  );
}
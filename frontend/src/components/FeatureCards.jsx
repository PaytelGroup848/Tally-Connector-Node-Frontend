import React from "react";

const iconProps = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.8",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className: "h-5 w-5 text-emerald-500",
};

const cards = [
  {
    title: "AI Insights",
    text: "Get smart suggestions and stay ahead.",
    icon: (
      <svg {...iconProps}>
        <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
        <path d="M20 3v4" />
        <path d="M22 5h-4" />
      </svg>
    ),
  },
  {
    title: "Real-Time",
    text: "Track your business live, anytime.",
    icon: (
      <svg {...iconProps}>
        <path d="M7 20v-4" />
        <path d="M12 20v-8" />
        <path d="M17 20V8" />
        <path d="M22 4v16" />
      </svg>
    ),
  },
  {
    title: "Multi-Device",
    text: "Access on web & mobile, wherever you are.",
    icon: (
      <svg {...iconProps}>
        <rect x="7" y="2" width="10" height="20" rx="2" ry="2" />
        <path d="M12 18h.01" />
      </svg>
    ),
  },
];

export default function FeatureCards() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-5 mb-5">
      {cards.map(({ title, text, icon }) => (
        <div
          key={title}
          className="max-sm:mx-[20%] rounded-2xl border border-emerald-100 bg-white/90 p-3 shadow-sm"
        >
          <div className="mb-1 flex h-5 w-5 items-center justify-center rounded-xl bg-emerald-50">
            {icon}
          </div>
          <h6 className="text-sm mb-1 text-base font-semibold text-slate-800">{title}</h6>
          <p className="text-xs leading-relaxed text-slate-500">{text}</p>
        </div>
      ))}
    </div>
  );
}
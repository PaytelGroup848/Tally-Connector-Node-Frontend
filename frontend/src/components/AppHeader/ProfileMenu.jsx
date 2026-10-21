import { ChevronDown, User } from "lucide-react";

const profileItems = ["Profile", "All User", "Download Invoice", "Logout"];

export default function ProfileMenu({
  isOpen,
  onToggle,
  hasInvoices,
  onProfileAction,
}) {
  return (
    <div className="relative flex h-16 w-14 shrink-0 sm:w-[92px]">
      <button
        type="button"
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        onClick={onToggle}
        className="flex h-16 w-full items-center justify-center gap-1 bg-black/[0.02] px-1 transition-all hover:bg-black/[0.03] active:bg-black/[0.05] sm:gap-2 sm:px-2"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/[0.08] bg-black/[0.04] shadow-[inset_0_1px_0_rgba(0,0,0,0.05)]">
          <User className="h-4 w-4 text-emerald-700" />
        </span>
        <ChevronDown
          className={`hidden h-4 w-4 shrink-0 text-gray-500 transition-transform sm:block ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-[62px] z-[11000] w-52 max-w-[calc(100vw-16px)] overflow-hidden rounded-xl border border-gray-200 bg-white p-1.5 text-gray-900 shadow-lg">
          <div className="relative z-10">
            {profileItems
              .filter((label) => label !== "Download Invoice" || hasInvoices)
              .map((label) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => onProfileAction(label)}
                  className="block w-full rounded-lg px-3 py-3 text-left text-xs text-gray-600 transition-all hover:bg-black/[0.04] hover:text-gray-900 active:bg-black/[0.06]"
                >
                  {label}
                </button>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

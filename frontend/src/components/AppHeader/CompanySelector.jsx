import { ChevronDown } from "lucide-react";

function getCompanyId(company) {
  return (
    company?.id ||
    company?._id ||
    company?.companyId ||
    company?.company_id ||
    null
  );
}

const excludedCompanyNames = new Set([
  "dummy",
  "dummy company",
  "unnamed company",
  "test",
  "test company",
  "na",
  "n/a",
]);

export default function CompanySelector({
  selectedCompany,
  companyOptions,
  showCompanyMenu,
  onToggle,
  onSelectCompany,
}) {
  const companies = Array.isArray(companyOptions)
    ? companyOptions.filter((company) => {
        const name = String(company?.name || company?.companyName || "")
          .trim()
          .toLowerCase();
        return name && !excludedCompanyNames.has(name);
      })
    : [];
  const selectedCompanyId = getCompanyId(selectedCompany);

  return (
    <div className="relative flex h-16 min-w-0 flex-1 shrink items-center border-r border-black/[0.06] bg-black/[0.02] sm:w-[230px] sm:min-w-[180px] sm:flex-none">
      <button
        type="button"
        aria-label={selectedCompany ? "Select company" : "No company selected"}
        aria-expanded={selectedCompany ? showCompanyMenu : false}
        onClick={onToggle}
        disabled={!selectedCompany}
        className={`flex h-full w-full items-center gap-2 px-2 text-left outline-none transition-all sm:gap-3 sm:px-5 ${
          selectedCompany
            ? "cursor-pointer hover:bg-black/[0.03]"
            : "cursor-not-allowed bg-black/[0.04]"
        }`}
      >
        <span className="min-w-0 flex-1">
          <strong className="block truncate text-[12px] font-semibold leading-4 text-gray-900">
            {selectedCompany?.name ||
              selectedCompany?.companyName ||
              "No company selected"}
          </strong>
          <span className="mt-0.5 block truncate text-[10px] leading-3 text-gray-500">
            {selectedCompany?.meta || selectedCompany?.city || ""}
          </span>
        </span>
        {selectedCompany && (
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-gray-500 transition-transform ${
              showCompanyMenu ? "rotate-180" : ""
            }`}
          />
        )}
      </button>

      {showCompanyMenu && selectedCompany && (
        <div className="absolute left-2 top-[62px] z-[1100] w-[min(300px,calc(100vw-16px))] overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg">
          <div className="border-b border-black/[0.06] bg-black/[0.02] px-4 py-3">
            <p className="m-0 text-[10px] font-semibold uppercase tracking-wide text-emerald-700">
              My Companies
            </p>
          </div>
          {companies.length > 0 ? (
            <div className="glass-scrollbar max-h-[320px] overflow-y-auto p-1.5">
              {companies.map((company, index) => {
                const companyId = getCompanyId(company);
                const key =
                  companyId ||
                  company?.name ||
                  company?.companyName ||
                  `company-${index}`;
                const isSelected =
                  companyId &&
                  selectedCompanyId &&
                  String(companyId) === String(selectedCompanyId);
                const companyName =
                  company?.name || company?.companyName || "";
                const companyMeta =
                  company?.meta || company?.city || company?.address || "";

                return (
                  <button
                    type="button"
                    key={key}
                    onClick={() => onSelectCompany(company)}
                    className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all ${
                      isSelected
                        ? "bg-emerald-300/[0.08] shadow-[inset_0_1px_0_rgba(0,0,0,0.04)]"
                        : "hover:bg-black/[0.03]"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                        isSelected
                          ? "border border-emerald-300/[0.12] bg-emerald-300/[0.10] text-emerald-800"
                          : "border border-black/[0.06] bg-black/[0.04] text-gray-500"
                      }`}
                    >
                      {companyName.trim().charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-xs font-semibold ${
                          isSelected ? "text-emerald-800" : "text-gray-800"
                        }`}
                      >
                        {companyName}
                      </span>
                      {companyMeta && (
                        <span className="mt-0.5 block truncate text-[10px] text-gray-500">
                          {companyMeta}
                        </span>
                      )}
                    </span>
                    {isSelected && (
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400 text-[10px] font-bold text-[#06251d] shadow-[0_0_12px_rgba(52,211,153,0.25)]">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm font-medium text-gray-600">
                No companies available
              </p>
              <p className="mt-1 text-[11px] text-gray-400">
                No companies were found for your account.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

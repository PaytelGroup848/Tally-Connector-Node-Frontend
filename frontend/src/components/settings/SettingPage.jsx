import { useEffect, useState } from "react";
import { Building2, Settings, Landmark, ChevronRight } from "lucide-react";
import useAuthStore from "../../store/authStore";
import {
  extractCompanies,
  fetchCompanies,
  normalizeCompany,
} from "../../services/companiesApi";
import CompanySettingsModal from "./CompanySettingsModal";
import BankDetailsModal from "./BankDetailsModal";

const sections = [
  {
    id: "settings",
    title: "Company Settings",
    description: "Configure company preferences",
    icon: Settings,
    color: "emerald",
  },
  {
    id: "bank",
    title: "Bank Details",
    description: "Update payment information",
    icon: Landmark,
    color: "blue",
  },
];

export default function SettingPage() {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState("");

  const [settingsCompany, setSettingsCompany] = useState(null);
  const [bankCompany, setBankCompany] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      setCompanies([]);
      setCompaniesLoading(false);
      setCompaniesError("Sign in to load companies.");
      return;
    }

    let mounted = true;

    (async () => {
      setCompaniesLoading(true);
      setCompaniesError("");
      try {
        const response = await fetchCompanies(accessToken);
        if (!mounted) return;
        const list = extractCompanies(response).map(normalizeCompany);
        setCompanies(list);
      } catch (error) {
        if (!mounted) return;
        setCompanies([]);
        setCompaniesError(error?.message || "Unable to load companies.");
      } finally {
        if (mounted) setCompaniesLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [accessToken]);

  return (
    <section className="min-h-screen bg-[#f7f9fc] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Company & Bank Details
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your company and account preferences
          </p>
        </div>

        {companiesLoading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
              Loading companies...
            </div>
          </div>
        )}

        {!companiesLoading && companiesError && (
          <div
            className="rounded-2xl border border-red-200 bg-white p-5 text-sm text-red-600"
            role="alert"
          >
            {companiesError}
          </div>
        )}

        {!companiesLoading && !companiesError && companies.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500">
            <Building2 size={24} className="mb-3 text-slate-400" />
            <p className="font-medium text-slate-700">No companies found</p>
            <p className="mt-1">
              Your companies will appear here once they are available.
            </p>
          </div>
        )}

        {!companiesLoading && !companiesError && companies.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {companies.map((company, companyIndex) => (
              <div
                key={company.id || `company-${companyIndex}`}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0px_4px_20px_rgba(15,23,42,0.04)] transition hover:shadow-md"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="min-w-0 flex-1">
                    <h2
                      className="flex justify-center mt-1 break-words text-sm font-semibold text-slate-900"
                      title={company.name || "Unnamed Company"}
                    >
                      {company.name || "Unnamed Company"}
                    </h2>
                    {company.meta && (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        {company.meta}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  {sections.map((section, sectionIndex) => {
                    const Icon = section.icon;
                    return (
                      <div key={section.id}>
                        <button
                          type="button"
                          onClick={() => {
                            if (section.id === "settings") {
                              setSettingsCompany(company);
                            } else {
                              setBankCompany(company);
                            }
                          }}
                          className={`group flex w-full items-center gap-3 px-4 py-4 text-left transition ${section.color === "emerald" ? "bg-emerald-50 hover:bg-emerald-100" : "bg-sky-100 hover:bg-sky-200"}  ${
                            sectionIndex < sections.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }`}
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                              section.color === "emerald"
                                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                                : "bg-blue-50 text-sky-600 ring-1 ring-blue-100"
                            }`}
                          >
                            <Icon size={16} strokeWidth={2} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-900">
                              {section.title}
                            </p>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {section.description}
                            </p>
                          </div>
                          <ChevronRight
                            size={16}
                            className="shrink-0 text-slate-300 transition group-hover:text-slate-500"
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {settingsCompany && (
        <CompanySettingsModal
          company={settingsCompany}
          onClose={() => setSettingsCompany(null)}
        />
      )}

      {bankCompany && (
        <BankDetailsModal
          company={bankCompany}
          onClose={() => setBankCompany(null)}
        />
      )}
    </section>
  );
}

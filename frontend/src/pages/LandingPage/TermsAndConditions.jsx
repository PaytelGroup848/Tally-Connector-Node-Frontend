
import { LegalPageHeader, LegalPageFooter } from "./LegalPageChrome";
import TermsSectionsOne from "./TermsSectionsOne";
import TermsSectionsTwo from "./TermsSectionsTwo";
import TermsSectionsThree from "./TermsSectionsThree";
import { FileText, Mail, Globe, Scale } from "lucide-react";

const TermsAndConditions = () => {
    const sections = [
        { id: "overview", label: "Overview" },
        { id: "definitions", label: "Definitions" },
        { id: "modifications", label: "Modifications to Terms" },
        { id: "eligibility", label: "Eligibility & Authority" },
        { id: "sanctions", label: "Sanctions Compliance" },
        { id: "security", label: "Account Security" },
        { id: "data-transfer", label: "International Data Transfer" },
        { id: "sharing", label: "Account Sharing & Permissions" },
        { id: "availability", label: "Service Availability" },
        { id: "acceptable-use", label: "Acceptable Use Policy" },
        { id: "intellectual-property", label: "Intellectual Property" },
        { id: "user-content", label: "User Content" },
        { id: "monitoring", label: "Monitoring & Termination" },
        { id: "spam", label: "No Spam Policy" },
        { id: "third-party", label: "Third-Party Links" },
        { id: "ai", label: "AI & Automated Tools" },
        { id: "warranties", label: "Disclaimer of Warranties" },
        { id: "liability", label: "Limitation of Liability" },
        { id: "indemnification", label: "Indemnification" },
        { id: "discontinued", label: "Discontinued Services" },
        { id: "fees", label: "Fees, Payments & Renewals" },
        { id: "governing-law", label: "Governing Law" },
        { id: "contact", label: "Contact Information" },
        { id: "service-specific", label: "Cloudedata Accounting ERP" },
    ];

    const scrollToSection = (id) => {
        const element = document.getElementById(id);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <div className="min-h-screen bg-[#f6f8fb] text-slate-800">
               <LegalPageHeader />
            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                <Scale size={16} />
                                Legal Agreement
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                                Terms of Service
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                Please read this agreement carefully, as it contains important
                                information regarding your legal rights and remedies.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 lg:min-w-[270px]">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                Effective Date
                            </p>

                            <p className="mt-2 text-base font-semibold text-slate-900">
                                {new Date().toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                            </p>

                            <div className="mt-5 space-y-3 border-t border-slate-200 pt-4">
                                <a
                                    href="mailto:info@cloudedata.com"
                                    className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
                                >
                                    <Mail size={16} />
                                    info@cloudedata.com
                                </a>

                                <a
                                    href="https://www.cloudedata.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
                                >
                                    <Globe size={16} />
                                    www.cloudedata.com
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
                <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
                    {/* Sidebar */}
                    <aside className="lg:sticky lg:top-8 lg:self-start">
                        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <FileText size={18} />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-slate-900">
                                        On this page
                                    </p>

                                    <p className="text-xs text-slate-500">
                                        Terms of Service
                                    </p>
                                </div>
                            </div>

                            <nav className="mt-4 max-h-[70vh] space-y-1 overflow-y-auto pr-1">
                                {sections.map((section, index) => (
                                    <button
                                        key={section.id}
                                        type="button"
                                        onClick={() => scrollToSection(section.id)}
                                        className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-600 transition hover:bg-emerald-50 hover:text-emerald-700"
                                    >
                                        <span className="mt-0.5 w-6 shrink-0 text-xs font-semibold text-slate-400 group-hover:text-emerald-600">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        <span>{section.label}</span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Document */}
                    <article className="min-w-0">
                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            {/* Document Header */}
                            <div className="border-b border-slate-200 bg-gradient-to-br from-white via-white to-emerald-50/40 px-6 py-8 sm:px-10 sm:py-10">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                                        <FileText size={23} />
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-bold text-slate-950">
                                            Cloude Data Terms of Service
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Effective:{" "} {new Date().toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })} 
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="px-6 py-8 sm:px-10 sm:py-12">
                                <TermsSectionsOne />
                                <TermsSectionsTwo />
                                <TermsSectionsThree />
                            </div>
                        </div>
                        {/* Footer */}
                        <div className="px-2 py-8 text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} Cloudedata. All rights reserved.
                        </div>
                    </article>
                </div>
            </main>
            <LegalPageFooter />
        </div>
    );
};

export default TermsAndConditions;

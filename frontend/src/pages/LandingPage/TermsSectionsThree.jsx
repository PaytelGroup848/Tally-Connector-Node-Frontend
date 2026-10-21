import { LegalSection, ServiceClause } from "./TermsAndConditionsComponents";
import { CreditCard, Mail, Globe, Cloud } from "lucide-react";

export default function TermsSectionsThree() {
  return (
    <>
                                {/* 21 */}
                                <LegalSection
                                    id="fees"
                                    number="21"
                                    title="Fees, Payments & Renewals"
                                >
                                    <p>
                                        All prices exclude applicable taxes. Services may
                                        automatically renew unless disabled. Refunds are governed by
                                        the Refund Policy. Non-payment may result in suspension or
                                        termination.
                                    </p>

                                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                <CreditCard size={19} />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    Payments & Renewals
                                                </p>

                                                <p className="mt-1 leading-7 text-slate-600">
                                                    Applicable taxes are additional, services may renew
                                                    automatically, and non-payment may lead to suspension
                                                    or termination.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </LegalSection>

                                {/* 22 */}
                                <LegalSection
                                    id="governing-law"
                                    number="22"
                                    title="Governing Law & Jurisdiction"
                                >
                                    <p>
                                        These Terms are governed by the laws of India. All disputes
                                        shall be subject to the exclusive jurisdiction of the
                                        courts in New Delhi.
                                    </p>
                                </LegalSection>

                                {/* 23 */}
                                <LegalSection
                                    id="contact"
                                    number="23"
                                    title="Contact Information"
                                    lastStandardSection
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                    <Mail size={18} />
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Email
                                                    </p>

                                                    <a
                                                        href="mailto:info@cloudedata.com"
                                                        className="mt-1 block font-semibold text-emerald-600 hover:text-emerald-700"
                                                    >
                                                        info@cloudedata.com
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                    <Globe size={18} />
                                                </div>

                                                <div>
                                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                                        Address
                                                    </p>

                                                    <p className="mt-1 leading-6 font-semibold text-slate-900">
                                                        Okhla Industrial Estate, Phase 3,
                                                        <br />
                                                        New Delhi – 110020, India
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </LegalSection>

                                {/* 24 */}
                                <section
                                    id="service-specific"
                                    className="scroll-mt-8 border-t border-slate-200 pt-12"
                                >
                                    <div className="mb-8 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-green-50 p-6 sm:p-8">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                                                <Cloud size={22} />
                                            </div>

                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-widest text-emerald-700">
                                                    Section 24
                                                </p>

                                                <h2 className="mt-1 text-2xl font-bold text-slate-950">
                                                    Service-Specific Terms
                                                </h2>

                                                <p className="mt-2 text-sm leading-6 text-slate-600">
                                                    Cloudedata Accounting ERP on Cloud
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <ServiceClause
                                        number="24.1"
                                        title="Scope of Services"
                                    >
                                        Secure cloud-hosted access to Accounting ERP solutions
                                        including storage and management of client accounting data
                                        on dedicated cloud servers.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.2"
                                        title="Data Responsibility & Security"
                                    >
                                        Cloude Data maintains uptime and data protection. In case of
                                        cyber-attack, the most recent verified backup will be
                                        restored. Liability is limited to restoration up to the
                                        latest available backup.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.3"
                                        title="Client Conduct & Liability"
                                    >
                                        Clients must use services responsibly and lawfully.
                                        Abusive, unlawful, or inappropriate conduct may result in
                                        service suspension or termination.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.4"
                                        title="Data Access & Client Control"
                                    >
                                        Cloude Data does not access, modify, or control client data
                                        stored in the assigned cloud environment. Clients retain
                                        full responsibility for managing, copying, editing, and
                                        deleting their data.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.5"
                                        title="Malicious File Policy"
                                    >
                                        Uploading malicious or harmful files is strictly
                                        prohibited. If such actions cause damage or service
                                        interruption, the client will be fully liable for losses and
                                        associated recovery costs.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.6"
                                        title="Backup Policy"
                                    >
                                        Client data is backed up regularly (typically daily). In
                                        case of data loss, restoration will occur within 6–24 hours
                                        from the latest available backup.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.7"
                                        title="Server Maintenance & Downtime"
                                    >
                                        Emergency maintenance may occur when required for system
                                        stability. Where possible, at least 1 hour prior notice will
                                        be provided.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.8"
                                        title="Support Availability"
                                    >
                                        Support is available Monday–Saturday, 10:00 AM – 7:30 PM
                                        IST. All support requests must be submitted through the
                                        official support portal or support email.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.9"
                                        title="No Refund Policy"
                                    >
                                        All payments made to Cloudedata are non-refundable,
                                        including cases of cancellation, dissatisfaction, or
                                        downtime caused by third-party or client-side issues.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.10"
                                        title="Fees & Payment"
                                    >
                                        Clients must pay the service fees as specified in their
                                        billing invoice, plan, and subscription period.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.11"
                                        title="Term, Renewal & Termination"
                                    >
                                        Services automatically renew unless either party provides 30
                                        days written notice. Upon termination, clients will have
                                        2–3 days to export their data.
                                    </ServiceClause>

                                    <ServiceClause
                                        number="24.12"
                                        title="Governing Law & Jurisdiction"
                                    >
                                        These service-specific terms are governed by the laws of
                                        India, and disputes fall under the courts of New Delhi.
                                    </ServiceClause>
                                </section>

                                {/* Questions */}
                                <section className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 p-6 text-white sm:p-8">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
                                                Questions?
                                            </p>

                                            <h2 className="mt-2 text-2xl font-bold">
                                                Need clarification about these Terms?
                                            </h2>

                                            <p className="mt-2 max-w-xl leading-7 text-emerald-50">
                                                If you have any questions regarding these Terms of
                                                Service, please contact us.
                                            </p>
                                        </div>

                                        <div className="shrink-0 space-y-3">
                                            <a
                                                href="mailto:info@cloudedata.com"
                                                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20"
                                            >
                                                <Mail size={18} />
                                                info@cloudedata.com
                                            </a>

                                            <a
                                                href="https://www.cloudedata.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20"
                                            >
                                                <Globe size={18} />
                                                www.cloudedata.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-5 border-t border-white/10 pt-5 text-sm text-emerald-100">
                                        Last updated:{" "}
                                        {new Date().toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </div>
                                </section>


    </>
  );
}

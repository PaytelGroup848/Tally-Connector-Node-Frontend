import { Globe, Mail, ShieldCheck } from "lucide-react";
import { InfoItem, SectionNumber } from "./PolicyComponents";

export default function PrivacySections() {
    return (
        <>
                                {/* 1. Overview */}
                                <section
                                    id="overview"
                                    className="scroll-mt-8 border-b border-slate-200 pb-10"
                                >
                                    <SectionNumber number="01" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Overview
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        This Universal Terms of Service Agreement (“Agreement”) is
                                        entered into between Cloudedata and you (“User”) and becomes
                                        effective on the date you access our website or electronically
                                        accept these terms.
                                    </p>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        Unless stated otherwise, the contracting entity is:
                                    </p>

                                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                        <p className="font-bold text-slate-900">
                                            Paytel Terminal Pvt. Ltd.
                                        </p>

                                        <p className="mt-2 leading-7 text-slate-600">
                                            Registered Address: Okhla Industrial Estate, Phase 3, New
                                            Delhi – 110020, India
                                        </p>
                                    </div>

                                    <p className="mt-6 leading-8 text-slate-600">
                                        This Agreement governs your use of:
                                    </p>

                                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="font-semibold text-slate-900">
                                                The Cloudedata website
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                (“Site”)
                                            </p>
                                        </div>

                                        <div className="rounded-xl border border-slate-200 p-4">
                                            <p className="font-semibold text-slate-900">
                                                Products and services
                                            </p>
                                            <p className="mt-1 text-sm text-slate-500">
                                                Provided by Cloudedata (“Services”)
                                            </p>
                                        </div>
                                    </div>

                                    <p className="mt-6 leading-8 text-slate-600">
                                        Your use of the Site or Services confirms that you have read
                                        and understood this Agreement, agree to comply with all
                                        applicable policies, and are using our Services for
                                        commercial or professional purposes. Cloudedata reserves the
                                        right to update or modify these terms at any time;
                                        continued use constitutes acceptance.
                                    </p>
                                </section>

                                {/* 2. Eligibility */}
                                <section
                                    id="eligibility"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="02" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Eligibility &amp; Authority
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        To use Cloudedata Services, you confirm that:
                                    </p>

                                    <div className="mt-5 space-y-3">
                                        <InfoItem>
                                            You are at least 18 years of age.
                                        </InfoItem>

                                        <InfoItem>
                                            You are legally capable of entering into binding
                                            agreements.
                                        </InfoItem>

                                        <InfoItem>
                                            You are not prohibited under applicable laws of India or
                                            other jurisdictions.
                                        </InfoItem>
                                    </div>

                                    <p className="mt-6 leading-8 text-slate-600">
                                        If you accept this Agreement on behalf of a business or
                                        legal entity, you confirm that you have full authority to
                                        bind that entity to these terms. You remain responsible for
                                        all activities conducted through your account.
                                    </p>
                                </section>

                                {/* 3. Sanctions */}
                                <section
                                    id="sanctions"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="03" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Sanctions &amp; Compliance
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        You represent and warrant that you are not located in,
                                        resident of, or operating from a sanctioned country, nor
                                        affiliated with any sanctioned individual or entity. You
                                        will not use Cloudedata Services for or on behalf of any
                                        sanctioned party.
                                    </p>

                                    <p className="mt-6 leading-8 text-slate-600">
                                        Cloudedata reserves the right to conduct sanctions screening,
                                        request verification information, and suspend or terminate
                                        Services immediately if sanctions violations are detected.
                                        You agree to indemnify Cloudedata against any losses arising
                                        from non-compliance.
                                    </p>
                                </section>

                                {/* 4. Security */}
                                <section
                                    id="security"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="04" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Account Registration &amp; Security
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        To access certain Services, you must create a Cloudedata
                                        account. You agree to provide accurate and complete account
                                        information, keep login credentials secure, and update
                                        information promptly.
                                    </p>

                                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                                        <div className="flex gap-4">
                                            <div className="mt-0.5 shrink-0">
                                                <ShieldCheck className="text-amber-600" size={20} />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-amber-900">
                                                    Security recommendation
                                                </p>

                                                <p className="mt-2 leading-7 text-amber-800">
                                                    Change your password at least once every six (6)
                                                    months.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-6 leading-8 text-slate-600">
                                        Cloudedata is not responsible for losses resulting from
                                        unauthorised access caused by your failure to secure your
                                        credentials.
                                    </p>
                                </section>

                                {/* 5. Sharing */}
                                <section
                                    id="sharing"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="05" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Account Access &amp; Sharing
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        Cloudedata allows controlled account access to trusted third
                                        parties. By granting access, you acknowledge that access is
                                        provided at your own risk, authorised users may view limited
                                        personal and billing information, and certain critical
                                        actions remain restricted.
                                    </p>

                                    <p className="mt-6 leading-8 text-slate-600">
                                        You assume full legal and financial responsibility for
                                        actions taken by authorised users. Cloudedata is not
                                        responsible for disputes between account holders and
                                        authorised third parties.
                                    </p>
                                </section>

                                {/* 6. Transfers */}
                                <section
                                    id="transfers"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="06" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        International Data Transfers
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        If you access Cloudedata Services from outside the country
                                        where our servers are located, your data may be transferred
                                        across international borders. By using our Services, you
                                        consent to such transfers in compliance with applicable data
                                        protection laws.
                                    </p>
                                </section>

                                {/* 7. Availability */}
                                <section
                                    id="availability"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="07" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Service Availability
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        Cloudedata aims to provide services 24/7, using commercially
                                        reasonable efforts. However, you acknowledge that services
                                        may occasionally be unavailable due to scheduled
                                        maintenance, system upgrades, network failures,
                                        cybersecurity incidents, or events beyond our reasonable
                                        control.
                                    </p>

                                    <p className="mt-6 leading-8 text-slate-600">
                                        Cloudedata does not guarantee uninterrupted availability and
                                        shall not be liable for downtime beyond its reasonable
                                        control.
                                    </p>
                                </section>

                                {/* 8. Beta */}
                                <section
                                    id="beta"
                                    className="scroll-mt-8 pt-10"
                                >
                                    <SectionNumber number="08" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Pre-Release &amp; Beta Services
                                    </h2>

                                    <p className="mt-5 leading-8 text-slate-600">
                                        From time to time, Cloudedata may offer beta services or
                                        limited preview features. These services are provided
                                        “as-is” and may be modified or discontinued at any time.
                                    </p>
                                </section>

                                {/* Contact */}
                                <section className="mt-12 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 p-6 text-white sm:p-8">
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
                                                Contact Information
                                            </p>

                                            <h2 className="mt-2 text-2xl font-bold">
                                                Have questions about these Terms?
                                            </h2>

                                            <p className="mt-2 max-w-xl leading-7 text-emerald-50">
                                                For questions regarding these Terms of Service, please
                                                contact our support team.
                                            </p>
                                        </div>

                                        <div className="shrink-0 space-y-3">
                                            <a
                                                href="mailto:support@cloudedata.com"
                                                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-medium transition hover:bg-white/20"
                                            >
                                                <Mail size={18} />
                                                support@cloudedata.com
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

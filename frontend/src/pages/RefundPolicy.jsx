import React from "react";
import HeaderLandingPage from "./HeaderLandingPage";
import FooterLandingPage from "./FooterLandingPage";
import {
    FileText,
    Mail,
    Globe,
    Wallet,
    CreditCard,
    ShieldAlert,
    AlertTriangle,
    Cloud,
} from "lucide-react";

const RefundPolicy = () => {
    const sections = [
        { id: "refund-policy", label: "Refund Policy" },
        { id: "standard-refunds", label: "Products Available for Refund" },
        { id: "non-refundable", label: "Products NOT Eligible" },
        { id: "payment-rules", label: "Payment Methods & Refund Rules" },
        { id: "balance-refunds", label: "Refunds from Balance" },
        { id: "erp", label: "Accounting ERP on Cloud" },
        { id: "chargebacks", label: "Chargebacks" },
        { id: "questions", label: "Questions?" },
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
           <HeaderLandingPage/>

            {/* Header */}
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                    <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                        <div className="max-w-3xl">
                            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                                <Wallet size={16} />
                                Financial Policy
                            </div>

                            <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                                Refund Policy
                            </h1>

                            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                Please read this agreement carefully, as it contains important
                                information regarding your legal rights and remedies.
                            </p>
                        </div>

                        {/* Meta */}
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
                                    href="mailto:support@cloudedata.com"
                                    className="flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-emerald-600"
                                >
                                    <Mail size={16} />
                                    support@cloudedata.com
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
                                        Refund Policy
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
                                            Cloude Data Refund Policy
                                        </h2>

                                        <p className="mt-1 text-sm text-slate-500">
                                            Effective:{" "}
                                            {new Date().toLocaleDateString("en-IN", {
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
                                {/* Refund Policy */}
                                <section
                                    id="refund-policy"
                                    className="scroll-mt-8 border-b border-slate-200 pb-10"
                                >
                                    <SectionNumber number="01" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Refund Policy
                                    </h2>

                                    <p className="mt-5 text-[15px] leading-8 text-slate-600">
                                        Products purchased from Cloude Data may be refunded only if
                                        canceled within 30 days of the date of the transaction.
                                    </p>

                                    {/* Important Crypto Notice */}
                                    <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">
                                                <AlertTriangle size={20} />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-amber-900">
                                                    Cryptocurrency, Tokens & Digital Assets
                                                </p>

                                                <p className="mt-2 leading-7 text-amber-800">
                                                    Due to their nature, cryptocurrencies, tokens and
                                                    digital assets are generally irreversible and their
                                                    exchange rates are highly volatile. We cannot be
                                                    responsible for any risk including but not limited to
                                                    exchange rate risk and market risk. Products
                                                    purchased using cryptocurrencies, tokens or digital
                                                    assets will not be refunded.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-6 text-[15px] leading-8 text-slate-600">
                                        If a client’s actions are found to violate applicable laws
                                        or Cloude Data’s Terms of Services, any payments made to
                                        Cloude Data will not be refunded.
                                    </p>

                                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                        <p className="font-semibold text-slate-900">
                                            Date of the transaction
                                        </p>

                                        <p className="mt-2 leading-7 text-slate-600">
                                            “Date of the transaction” means the date of purchase of
                                            any product or service, including the date any renewal is
                                            processed.
                                        </p>

                                        <p className="mt-4 leading-7 text-slate-600">
                                            You may cancel a product at any time, but a refund will
                                            only be issued if cancellation is requested within the
                                            refund timeframe specified for the applicable product, if
                                            available at all.
                                        </p>
                                    </div>
                                </section>

                                {/* Products Available for Refund */}
                                <section
                                    id="standard-refunds"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="02" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Products Available for Refund
                                    </h2>

                                    <p className="mt-5 text-[15px] leading-8 text-slate-600">
                                        The following products are available for refunds under the
                                        standard refund terms:
                                    </p>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <RefundItem>
                                            Hosting (all plans, except first payment after Free Trial)
                                        </RefundItem>

                                        <RefundItem>Daily Backups</RefundItem>

                                        <RefundItem>Cloude Data Email</RefundItem>

                                        <RefundItem>Titan Email</RefundItem>

                                        <RefundItem>Priority Support</RefundItem>

                                        <RefundItem>NordVPN 6 and 12-month plans</RefundItem>

                                        <RefundItem>VPN 6 and 12-month plans</RefundItem>

                                        <RefundItem>KVM VPS (except upgrades)</RefundItem>

                                        <RefundItem>Kubernetes</RefundItem>
                                    </div>
                                </section>

                                {/* Non Refundable */}
                                <section
                                    id="non-refundable"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="03" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Products NOT Eligible for Refunds
                                    </h2>

                                    <div className="mt-6 grid gap-3 sm:grid-cols-2">
                                        <NonRefundableItem>
                                            Redemption Fees
                                        </NonRefundableItem>

                                        <NonRefundableItem>
                                            VPS License
                                        </NonRefundableItem>

                                        <NonRefundableItem>
                                            Upgrades for Minecraft (Game Panel) VPS
                                        </NonRefundableItem>

                                        <NonRefundableItem>
                                            Upgrades for KVM VPS
                                        </NonRefundableItem>

                                        <NonRefundableItem>
                                            Kubernetes
                                        </NonRefundableItem>
                                    </div>

                                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm">
                                                <ShieldAlert size={20} />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-red-900">
                                                    Abuse & Terms Violations
                                                </p>

                                                <p className="mt-2 leading-7 text-red-800">
                                                    Any products or services that were suspended,
                                                    canceled, or terminated due to abusive usage or
                                                    violation of Terms are not eligible for a refund.
                                                    Cloude Data reserves the right to unilaterally
                                                    decline refund requests if signs of refund abuse occur
                                                    (e.g., repetitive refunds, bulk purchases and
                                                    refunds).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Methods */}
                                <section
                                    id="payment-rules"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="04" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Payment Methods &amp; Refund Rules
                                    </h2>

                                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                                                <CreditCard size={19} />
                                            </div>

                                            <div>
                                                <h3 className="text-lg font-bold text-slate-900">
                                                    Refunds to Balance
                                                </h3>

                                                <p className="mt-2 leading-7 text-slate-600">
                                                    We provide refunds to the original funding source.
                                                    Once a refund is initiated for an invoice, it becomes
                                                    irrevocable and cannot be refunded to a different
                                                    source.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Balance Refunds */}
                                <section
                                    id="balance-refunds"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="05" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Refunds from Balance
                                    </h2>

                                    <p className="mt-5 text-[15px] leading-8 text-slate-600">
                                        Over-funded balance can be refunded within 30 days of the
                                        payment that resulted in over-funding.
                                    </p>

                                    <p className="mt-5 text-[15px] leading-8 text-slate-600">
                                        In special cases, other payments can be refunded instead of
                                        the original payment if the 30-day timeframe applies.
                                    </p>
                                </section>

                                {/* ERP */}
                                <section
                                    id="erp"
                                    className="scroll-mt-8 border-b border-slate-200 py-10"
                                >
                                    <SectionNumber number="06" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Accounting ERP on Cloud
                                    </h2>

                                    <div className="mt-6 overflow-hidden rounded-2xl border border-emerald-100">
                                        <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white">
                                            <div className="flex items-start gap-4">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                                    <Cloud size={22} />
                                                </div>

                                                <div>
                                                    <p className="text-lg font-bold">
                                                        Non-Refundable &amp; Non-Cancellable
                                                    </p>

                                                    <p className="mt-2 leading-7 text-emerald-50">
                                                        All purchases of our Accounting ERP on Cloud
                                                        services are non-refundable and non-cancellable.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-white p-6">
                                            <p className="leading-7 text-slate-600">
                                                Once payment is made, no refunds will be issued.
                                                Subscriptions cannot be canceled or terminated before
                                                the end of the billing period.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                {/* Chargebacks */}
                                <section
                                    id="chargebacks"
                                    className="scroll-mt-8 pt-10"
                                >
                                    <SectionNumber number="07" />

                                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                                        Chargebacks
                                    </h2>

                                    <p className="mt-5 text-[15px] leading-8 text-slate-600">
                                        If we record a decline, chargeback, reversal, payment
                                        dispute, risk of payment fraud or other rejection of any
                                        payable fees on your account (“Chargeback”), this will be
                                        considered a breach of your payment obligations.
                                    </p>

                                    <p className="mt-5 text-[15px] leading-8 text-slate-600">
                                        You agree that Cloude Data may pursue all available lawful
                                        remedies, including immediate termination of your account
                                        and services.
                                    </p>

                                    <div className="mt-6 space-y-4">
                                        <ChargebackItem>
                                            In the event of a Chargeback, your account may be blocked
                                            without option to re-purchase, and any data may be subject
                                            to cancellation and loss.
                                        </ChargebackItem>

                                        <ChargebackItem>
                                            Your ability to checkout using credit card will not resume
                                            until you verify the payment method and pay all applicable
                                            fees, including fees incurred by Cloude Data for each
                                            Chargeback.
                                        </ChargebackItem>

                                        <ChargebackItem>
                                            Criminal fraud or obvious payment fraud (compromised
                                            credit card details) will result in permanent service
                                            termination without any option to recover.
                                        </ChargebackItem>
                                    </div>

                                    <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
                                        <p className="font-semibold text-emerald-900">
                                            Contact Support Before Filing a Chargeback
                                        </p>

                                        <p className="mt-2 leading-7 text-emerald-800">
                                            We encourage you to first contact our Customer Support
                                            team before filing a Chargeback to prevent service
                                            cancellation and avoid unwarranted Chargeback fees.
                                            We reserve the right to dispute any Chargeback by
                                            providing relevant documentation proving the transaction
                                            was authorized.
                                        </p>
                                    </div>
                                </section>

                                {/* Questions */}
                                <section
                                    id="questions"
                                    className="mt-12 scroll-mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 p-6 text-white sm:p-8"
                                >
                                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-100">
                                                Questions?
                                            </p>

                                            <h2 className="mt-2 text-2xl font-bold">
                                                Need help with a refund?
                                            </h2>

                                            <p className="mt-2 max-w-xl leading-7 text-emerald-50">
                                                If you have any questions regarding our Refund Policy,
                                                please contact our support team before making a purchase
                                                or filing a dispute.
                                            </p>
                                        </div>

                                        <div className="shrink-0">
                                            <a
                                                href="mailto:support@cloudedata.com"
                                                className="flex items-center gap-3 rounded-xl bg-white/10 px-5 py-3 text-sm font-medium transition hover:bg-white/20"
                                            >
                                                <Mail size={18} />
                                                support@cloudedata.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="mt-7 flex flex-col gap-3 border-t border-white/20 pt-5 text-sm text-emerald-50 sm:flex-row sm:items-center sm:justify-between">
                                        <span>
                                            support@cloudedata.com
                                        </span>

                                        <a
                                            href="https://www.cloudedata.com"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 transition hover:text-white"
                                        >
                                            <Globe size={16} />
                                            www.cloudedata.com
                                        </a>
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
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-2 py-8 text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} Cloudedata. All rights reserved.
                        </div>
                    </article>
                </div>
            </main>
            <FooterLandingPage/>
        </div>
    );
};

/* =========================================================
   COMPONENTS
   ========================================================= */

const SectionNumber = ({ number }) => {
    return (
        <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-widest text-emerald-700">
            SECTION {number}
        </div>
    );
};

const RefundItem = ({ children }) => {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50/40">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span>{children}</span>
        </div>
    );
};

const NonRefundableItem = ({ children }) => {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-red-100 bg-red-50/60 p-4 text-sm text-slate-700">
            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
            <span>{children}</span>
        </div>
    );
};

const ChargebackItem = ({ children }) => {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <p className="leading-7 text-slate-700">{children}</p>
        </div>
    );
};

export default RefundPolicy;
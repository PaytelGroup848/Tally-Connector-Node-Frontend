import { Cloud, CreditCard, Globe, Mail } from "lucide-react";
import { ChargebackItem, SectionNumber } from "./PolicyComponents";

export default function RefundSectionsTwo() {
    return (
        <>
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

        </>
    );
}

import { AlertTriangle, ShieldAlert } from "lucide-react";
import { NonRefundableItem, RefundItem, SectionNumber } from "./PolicyComponents";

export default function RefundSectionsOne() {
    return (
        <>
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

        </>
    );
}

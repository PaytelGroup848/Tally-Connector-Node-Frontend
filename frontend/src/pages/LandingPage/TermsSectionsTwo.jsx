import { LegalSection, HighlightBox } from "./TermsAndConditionsComponents";
import { Scale, ShieldCheck } from "lucide-react";

export default function TermsSectionsTwo() {
  return (
    <>
                                {/* 11 */}
                                <LegalSection
                                    id="intellectual-property"
                                    number="11"
                                    title="Intellectual Property Rights"
                                >
                                    <p>
                                        All content, software, trademarks, designs, and materials on
                                        the website are owned or licensed by Cloude Data and
                                        protected under intellectual property laws. You may not
                                        copy, reproduce, modify, or distribute any materials without
                                        written permission.
                                    </p>
                                </LegalSection>

                                {/* 12 */}
                                <LegalSection id="user-content" number="12" title="User Content">
                                    <p>
                                        You retain ownership of the content you host using our
                                        services. However, by uploading content, you grant Cloude
                                        Data a limited license to host and process the content
                                        solely for service delivery. You are responsible for
                                        ensuring that your content does not violate third-party
                                        rights.
                                    </p>
                                </LegalSection>

                                {/* 13 */}
                                <LegalSection
                                    id="monitoring"
                                    number="13"
                                    title="Monitoring & Termination"
                                >
                                    <p>
                                        Cloude Data reserves the right to monitor hosted content,
                                        remove prohibited materials, and suspend or terminate
                                        accounts without prior notice. Repeated violations may
                                        result in permanent service termination.
                                    </p>
                                </LegalSection>

                                {/* 14 */}
                                <LegalSection
                                    id="spam"
                                    number="14"
                                    title="No Spam Policy"
                                >
                                    <p>
                                        Sending spam, bulk messages, or unsolicited communications
                                        using Cloude Data services is strictly prohibited.
                                        Violations will result in immediate service suspension or
                                        termination.
                                    </p>
                                </LegalSection>

                                {/* 15 */}
                                <LegalSection
                                    id="third-party"
                                    number="15"
                                    title="Third-Party Links"
                                >
                                    <p>
                                        Our website may contain links to third-party websites. Cloude
                                        Data is not responsible for their content, policies, or
                                        practices. Use third-party websites at your own risk.
                                    </p>
                                </LegalSection>

                                {/* 16 */}
                                <LegalSection
                                    id="ai"
                                    number="16"
                                    title="AI & Automated Tools"
                                >
                                    <p>
                                        Cloude Data may provide AI-based tools and automation
                                        features. Users are responsible for reviewing AI-generated
                                        outputs before using them. Sensitive or confidential data
                                        should not be uploaded to AI tools.
                                    </p>

                                    <HighlightBox
                                        icon={<ShieldCheck size={20} />}
                                        title="Important"
                                    >
                                        Always review AI-generated outputs before relying on them,
                                        and avoid uploading sensitive or confidential information
                                        to AI tools.
                                    </HighlightBox>
                                </LegalSection>

                                {/* 17 */}
                                <LegalSection
                                    id="warranties"
                                    number="17"
                                    title="Disclaimer of Warranties"
                                >
                                    <p>
                                        All services are provided 'as is' and 'as available' without
                                        warranties of any kind. Cloude Data does not guarantee
                                        uninterrupted service or accuracy of information.
                                    </p>
                                </LegalSection>

                                {/* 18 */}
                                <LegalSection
                                    id="liability"
                                    number="18"
                                    title="Limitation of Liability"
                                >
                                    <p>
                                        To the maximum extent permitted by law, Cloude Data will not
                                        be liable for loss of data, business interruption, loss of
                                        profits, or indirect damages. Total liability shall not
                                        exceed the amount paid by the user in the previous 12 months
                                        or ₹100,000, whichever is lower.
                                    </p>

                                    <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                                <Scale size={19} />
                                            </div>

                                            <div>
                                                <p className="font-semibold text-slate-900">
                                                    Liability Cap
                                                </p>

                                                <p className="mt-1 leading-7 text-slate-600">
                                                    Maximum aggregate liability: the amount paid by the
                                                    user during the previous 12 months or ₹100,000,
                                                    whichever is lower.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </LegalSection>

                                {/* 19 */}
                                <LegalSection
                                    id="indemnification"
                                    number="19"
                                    title="Indemnification"
                                >
                                    <p>
                                        You agree to indemnify and hold Cloude Data harmless against
                                        claims arising from your use of services, violation of this
                                        Agreement, or infringement of third-party rights.
                                    </p>
                                </LegalSection>

                                {/* 20 */}
                                <LegalSection
                                    id="discontinued"
                                    number="20"
                                    title="Discontinued Services"
                                >
                                    <p>
                                        Cloude Data may discontinue services at any time. Where
                                        possible, customers will receive advance notice and may be
                                        provided with migration or refund options depending on the
                                        situation.
                                    </p>
                                </LegalSection>


    </>
  );
}

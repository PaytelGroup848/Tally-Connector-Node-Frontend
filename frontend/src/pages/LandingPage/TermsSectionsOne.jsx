import { LegalSection, DefinitionRow, InfoItem, HighlightBox, RestrictionItem } from "./TermsAndConditionsComponents";
import { ShieldCheck } from "lucide-react";

export default function TermsSectionsOne() {
  return (
    <>
                                {/* 1 */}
                                <LegalSection id="overview" number="01" title="Overview">
                                    <p>
                                        “We”, “Us”, “Our” refer to Cloude Data. “You”, “User”,
                                        “Customer” refer to any individual or legal entity using
                                        our services. “Services” refer to all products and
                                        solutions offered by Cloude Data. This Agreement does not
                                        create any third-party rights.
                                    </p>
                                </LegalSection>

                                {/* 2 */}
                                <LegalSection id="definitions" number="02" title="Definitions">
                                    <div className="overflow-hidden rounded-2xl border border-slate-200">
                                        <div className="grid border-b border-slate-200 bg-slate-50 sm:grid-cols-3">
                                            <div className="p-4 text-sm font-semibold text-slate-900">
                                                Term
                                            </div>
                                            <div className="p-4 text-sm font-semibold text-slate-900 sm:col-span-2">
                                                Meaning
                                            </div>
                                        </div>

                                        <DefinitionRow term="We / Us / Our" value="Cloude Data" />
                                        <DefinitionRow
                                            term="You / User / Customer"
                                            value="Individual or entity using the services"
                                        />
                                        <DefinitionRow
                                            term="Services"
                                            value="All products and solutions offered by Cloude Data"
                                        />
                                        <DefinitionRow
                                            term="Third-party rights"
                                            value="This Agreement does not create any third-party rights"
                                        />
                                    </div>
                                </LegalSection>

                                {/* 3 */}
                                <LegalSection
                                    id="modifications"
                                    number="03"
                                    title="Modifications to Terms"
                                >
                                    <p>
                                        Cloude Data reserves the right to modify these Terms at any
                                        time. Updated terms become effective immediately once posted
                                        on the website. Continued use of the website or services
                                        after updates indicates acceptance of the revised terms.
                                    </p>
                                </LegalSection>

                                {/* 4 */}
                                <LegalSection
                                    id="eligibility"
                                    number="04"
                                    title="Eligibility & Authority"
                                >
                                    <p>By using our services, you confirm that:</p>

                                    <InfoItem>
                                        You are at least 18 years of age.
                                    </InfoItem>

                                    <InfoItem>
                                        You are legally capable of entering binding contracts.
                                    </InfoItem>

                                    <InfoItem>
                                        You are not restricted under Indian or international law.
                                    </InfoItem>

                                    <InfoItem>
                                        If acting on behalf of an organization, you have the legal
                                        authority to bind that organization to these Terms.
                                    </InfoItem>
                                </LegalSection>

                                {/* 5 */}
                                <LegalSection
                                    id="sanctions"
                                    number="05"
                                    title="Sanctions Compliance"
                                >
                                    <p>
                                        You represent that you are not subject to sanctions imposed
                                        by India, the United States, the European Union, the United
                                        Nations, or other governing authorities. Cloude Data
                                        reserves the right to suspend or terminate services
                                        immediately if sanctions violations are suspected.
                                    </p>
                                </LegalSection>

                                {/* 6 */}
                                <LegalSection
                                    id="security"
                                    number="06"
                                    title="Account Registration & Security"
                                >
                                    <p>
                                        To access certain services, you must create an account. You
                                        agree to provide accurate and complete information, maintain
                                        confidentiality of login credentials, and notify us
                                        immediately of unauthorized access. You are solely
                                        responsible for all activities that occur under your
                                        account.
                                    </p>

                                    <HighlightBox
                                        icon={<ShieldCheck size={20} />}
                                        title="Account Security"
                                    >
                                        Keep your credentials confidential and notify Cloude Data
                                        immediately if you believe your account has been accessed
                                        without authorization.
                                    </HighlightBox>
                                </LegalSection>

                                {/* 7 */}
                                <LegalSection
                                    id="data-transfer"
                                    number="07"
                                    title="International Data Transfer"
                                >
                                    <p>
                                        By accessing our website or services, you consent to the
                                        transfer, storage, and processing of data across
                                        international borders, including servers located outside
                                        your country.
                                    </p>
                                </LegalSection>

                                {/* 8 */}
                                <LegalSection
                                    id="sharing"
                                    number="08"
                                    title="Account Sharing & Access Permissions"
                                >
                                    <p>
                                        Users may grant limited access to trusted individuals.
                                        However, the account holder remains fully responsible for
                                        all actions taken through the account, and Cloude Data is
                                        not responsible for disputes between account holders and
                                        authorized users.
                                    </p>
                                </LegalSection>

                                {/* 9 */}
                                <LegalSection
                                    id="availability"
                                    number="09"
                                    title="Service Availability"
                                >
                                    <p>
                                        Cloude Data aims to provide services 24/7. However, service
                                        availability may be affected by scheduled maintenance,
                                        technical failures, or events beyond our control. We do not
                                        guarantee uninterrupted service and are not liable for
                                        downtime.
                                    </p>
                                </LegalSection>

                                {/* 10 */}
                                <LegalSection
                                    id="acceptable-use"
                                    number="10"
                                    title="Acceptable Use Policy"
                                >
                                    <p>
                                        You agree not to use Cloude Data services for:
                                    </p>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                                        <RestrictionItem>Illegal activities</RestrictionItem>
                                        <RestrictionItem>Child exploitation</RestrictionItem>
                                        <RestrictionItem>Terrorism</RestrictionItem>
                                        <RestrictionItem>Spam</RestrictionItem>
                                        <RestrictionItem>Malware distribution</RestrictionItem>
                                        <RestrictionItem>
                                            Cryptocurrency mining without permission
                                        </RestrictionItem>
                                        <RestrictionItem>
                                            Intellectual property violations
                                        </RestrictionItem>
                                        <RestrictionItem>False claims</RestrictionItem>
                                        <RestrictionItem>
                                            Activities threatening national security
                                        </RestrictionItem>
                                    </div>

                                    <p className="mt-6">
                                        Violations may result in immediate suspension or
                                        termination.
                                    </p>
                                </LegalSection>


    </>
  );
}

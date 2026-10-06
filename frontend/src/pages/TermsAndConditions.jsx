
import React from "react";
import {
    FileText,
    Mail,
    Globe,
    ShieldCheck,
    Scale,
    CreditCard,
    Cloud,
} from "lucide-react";

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
            {/* Top Accent */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600" />

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
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-2 py-8 text-center text-sm text-slate-500">
                            © {new Date().getFullYear()} Cloudedata. All rights reserved.
                        </div>
                    </article>
                </div>
            </main>
        </div>
    );
};

/* =========================================================
   COMPONENTS
   ========================================================= */

const LegalSection = ({
    id,
    number,
    title,
    children,
    lastStandardSection = false,
}) => {
    return (
        <section
            id={id}
            className={`scroll-mt-8 ${lastStandardSection
                    ? "pb-10"
                    : "border-b border-slate-200 pb-10"
                } ${number === "01" ? "" : "pt-10"}`}
        >
            <SectionNumber number={number} />

            <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {title}
            </h2>

            <div className="mt-5 space-y-5 text-[15px] leading-8 text-slate-600">
                {children}
            </div>
        </section>
    );
};

const SectionNumber = ({ number }) => {
    return (
        <div className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold tracking-widest text-emerald-700">
            SECTION {number}
        </div>
    );
};

const InfoItem = ({ children }) => {
    return (
        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <span className="mt-3 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />

            <p className="leading-7 text-slate-700">{children}</p>
        </div>
    );
};

const RestrictionItem = ({ children }) => {
    return (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
            <span>{children}</span>
        </div>
    );
};

const HighlightBox = ({ icon, title, children }) => {
    return (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <div className="flex items-start gap-4">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                    {icon}
                </div>

                <div>
                    <p className="font-semibold text-emerald-900">{title}</p>

                    <p className="mt-2 leading-7 text-emerald-800">{children}</p>
                </div>
            </div>
        </div>
    );
};

const DefinitionRow = ({ term, value }) => {
    return (
        <div className="grid border-b border-slate-200 last:border-b-0 sm:grid-cols-3">
            <div className="p-4 text-sm font-semibold text-slate-900">
                {term}
            </div>

            <div className="p-4 text-sm leading-6 text-slate-600 sm:col-span-2">
                {value}
            </div>
        </div>
    );
};

const ServiceClause = ({ number, title, children }) => {
    return (
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-emerald-200 hover:shadow-sm sm:p-6">
            <div className="flex gap-4">
                <div className="shrink-0">
                    <div className="flex h-9 min-w-9 items-center justify-center rounded-lg bg-emerald-50 px-2 text-xs font-bold text-emerald-700">
                        {number}
                    </div>
                </div>

                <div>
                    <h3 className="text-base font-bold text-slate-900 sm:text-lg">
                        {title}
                    </h3>

                    <p className="mt-2 text-[15px] leading-7 text-slate-600">
                        {children}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;

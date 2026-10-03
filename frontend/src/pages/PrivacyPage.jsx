import React from "react";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-slate-200 sm:px-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-emerald-600">
                Legal Document
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Privacy &amp; Terms
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                Please read this agreement carefully, as it contains important
                information regarding your legal rights and remedies.
              </p>
            </div>

            <div className="shrink-0 text-left text-sm text-slate-600 sm:text-right">
              <p>
                <a
                  href="mailto:support@cloudedata.com"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  support@cloudedata.com
                </a>
              </p>

              <p className="mt-1">
                <a
                  href="https://www.cloudedata.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  www.cloudedata.com
                </a>
              </p>

              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-slate-500">
                Effective: October 3, 2026
              </p>
            </div>
          </div>
        </div>

        {/* Legal Content */}
        <article className="rounded-2xl bg-white px-6 py-8 shadow-sm ring-1 ring-slate-200 sm:px-10 sm:py-10">
          {/* 1. Overview */}
          <section className="border-b border-slate-200 pb-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              1. Overview
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              This Universal Terms of Service Agreement (“Agreement”) is
              entered into between Cloudedata and you (“User”) and becomes
              effective on the date you access our website or electronically
              accept these terms.
            </p>

            <p className="mt-4 leading-7 text-slate-700">
              Unless stated otherwise, the contracting entity is:
            </p>

            <div className="mt-4 rounded-xl bg-slate-50 p-5">
              <p className="font-semibold text-slate-900">
                Paytel Terminal Pvt. Ltd.
              </p>

              <p className="mt-2 leading-7 text-slate-700">
                Registered Address: Okhla Industrial Estate, Phase 3, New Delhi
                – 110020, India
              </p>
            </div>

            <p className="mt-6 leading-7 text-slate-700">
              This Agreement governs your use of:
            </p>

            <ul className="mt-4 space-y-2 pl-6 text-slate-700">
              <li className="list-disc">
                The Cloudedata website (“Site”)
              </li>
              <li className="list-disc">
                All products and services provided by Cloudedata (“Services”)
              </li>
            </ul>

            <p className="mt-6 leading-7 text-slate-700">
              Your use of the Site or Services confirms that you have read and
              understood this Agreement, agree to comply with all applicable
              policies, and are using our Services for commercial or
              professional purposes. Cloudedata reserves the right to update or
              modify these terms at any time; continued use constitutes
              acceptance.
            </p>
          </section>

          {/* 2. Eligibility & Authority */}
          <section className="border-b border-slate-200 py-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              2. Eligibility &amp; Authority
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              To use Cloudedata Services, you confirm that:
            </p>

            <ul className="mt-4 space-y-3 pl-6 text-slate-700">
              <li className="list-disc">
                You are at least 18 years of age.
              </li>
              <li className="list-disc">
                You are legally capable of entering into binding agreements.
              </li>
              <li className="list-disc">
                You are not prohibited under applicable laws of India or other
                jurisdictions.
              </li>
            </ul>

            <p className="mt-6 leading-7 text-slate-700">
              If you accept this Agreement on behalf of a business or legal
              entity, you confirm that you have full authority to bind that
              entity to these terms. You remain responsible for all activities
              conducted through your account.
            </p>
          </section>

          {/* 3. Sanctions & Compliance */}
          <section className="border-b border-slate-200 py-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              3. Sanctions &amp; Compliance
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              You represent and warrant that you are not located in, resident
              of, or operating from a sanctioned country, nor affiliated with
              any sanctioned individual or entity. You will not use Cloudedata
              Services for or on behalf of any sanctioned party.
            </p>

            <p className="mt-6 leading-7 text-slate-700">
              Cloudedata reserves the right to conduct sanctions screening,
              request verification information, and suspend or terminate
              Services immediately if sanctions violations are detected. You
              agree to indemnify Cloudedata against any losses arising from
              non-compliance.
            </p>
          </section>

          {/* 4. Account Registration & Security */}
          <section className="border-b border-slate-200 py-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              4. Account Registration &amp; Security
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              To access certain Services, you must create a Cloudedata account.
              You agree to provide accurate and complete account information,
              keep login credentials secure, and update information promptly.
            </p>

            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-5">
              <p className="font-semibold text-amber-900">
                Security recommendation
              </p>

              <p className="mt-2 leading-7 text-amber-800">
                Change your password at least once every six (6) months.
              </p>
            </div>

            <p className="mt-6 leading-7 text-slate-700">
              Cloudedata is not responsible for losses resulting from
              unauthorised access caused by your failure to secure your
              credentials.
            </p>
          </section>

          {/* 5. Account Access & Sharing */}
          <section className="border-b border-slate-200 py-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              5. Account Access &amp; Sharing
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              Cloudedata allows controlled account access to trusted third
              parties. By granting access, you acknowledge that access is
              provided at your own risk, authorised users may view limited
              personal and billing information, and certain critical actions
              remain restricted.
            </p>

            <p className="mt-6 leading-7 text-slate-700">
              You assume full legal and financial responsibility for actions
              taken by authorised users. Cloudedata is not responsible for
              disputes between account holders and authorised third parties.
            </p>
          </section>

          {/* 6. International Data Transfers */}
          <section className="border-b border-slate-200 py-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              6. International Data Transfers
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              If you access Cloudedata Services from outside the country where
              our servers are located, your data may be transferred across
              international borders. By using our Services, you consent to
              such transfers in compliance with applicable data protection
              laws.
            </p>
          </section>

          {/* 7. Service Availability */}
          <section className="border-b border-slate-200 py-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              7. Service Availability
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              Cloudedata aims to provide services 24/7, using commercially
              reasonable efforts. However, you acknowledge that services may
              occasionally be unavailable due to scheduled maintenance, system
              upgrades, network failures, cybersecurity incidents, or events
              beyond our reasonable control.
            </p>

            <p className="mt-6 leading-7 text-slate-700">
              Cloudedata does not guarantee uninterrupted availability and shall
              not be liable for downtime beyond its reasonable control.
            </p>
          </section>

          {/* 8. Pre-Release & Beta Services */}
          <section className="pt-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              8. Pre-Release &amp; Beta Services
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              From time to time, Cloudedata may offer beta services or limited
              preview features. These services are provided “as-is” and may be
              modified or discontinued at any time.
            </p>
          </section>

          {/* Contact Information */}
          <section className="mt-10 rounded-2xl bg-slate-50 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              Contact Information
            </h2>

            <p className="mt-4 leading-7 text-slate-700">
              For questions regarding these Terms of Service, please contact:
            </p>

            <div className="mt-5 space-y-2">
              <p>
                <a
                  href="mailto:support@cloudedata.com"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  support@cloudedata.com
                </a>
              </p>

              <p>
                <a
                  href="https://www.cloudedata.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  www.cloudedata.com
                </a>
              </p>
            </div>

            <p className="mt-5 text-sm font-medium text-slate-500">
              Last updated: October 3, 2026
            </p>
          </section>
        </article>

        {/* Footer */}
        <div className="py-8 text-center text-sm text-slate-500">
          © 2026 Cloudedata. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
import { ArrowRight, ChevronDown } from "lucide-react";
import { SectionHeading } from "./LandingPrimitives";

export default function FaqCtaSection({ faqOpen, setFaqOpen, goToLogin }) {
  return (
    <>
        {/* ================= FAQ ================= */}
        <section
          id="faq"
          className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-4xl">
            <SectionHeading
              eyebrow="FAQ"
              title=""
              description="Common questions about the CtrlBooks business experience."
            />

            <div className="mt-12 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {[
                {
                  question: "What is CtrlBooks?",
                  answer:
                    "CtrlBooks is positioned around keeping business and accounting information accessible through connected web and mobile experiences.",
                },
                {
                  question:
                    "Can I access business data on mobile?",
                  answer:
                    "The CtrlBooks website presents mobile access as one of its key product capabilities.",
                },
                {
                  question:
                    "What kind of transactions can be managed?",
                  answer:
                    "The product visuals show transaction flows such as quotation, sales, receipt, payment, sales order and purchase.",
                },
                {
                  question:
                    "Can teams access the business information?",
                  answer:
                    "The product is designed around connected business information and access across users and devices.",
                },
              ].map((item, index) => {
                const open = faqOpen === index;

                return (
                  <div key={item.question}>
                    <button
                      onClick={() =>
                        setFaqOpen(open ? null : index)
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left"
                    >
                      <span className="text-sm font-bold text-slate-800 sm:text-base">
                        {item.question}
                      </span>

                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {open && (
                      <div className="px-5 pb-5 text-sm leading-7 text-slate-700">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================= CTA ================= */}
        <section
          id="contact"
          className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-24"
        >
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-emerald-700 px-7 py-14 text-white shadow-2xl shadow-green-100 sm:px-12 lg:px-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>


                <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
                  Keep your business information closer to you.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-green-50 sm:text-base">
                  Connect your business workflow with a clean web and mobile
                  experience.
                </p>
              </div>

              <button
                onClick={goToLogin}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-green-700 transition hover:bg-green-50"
              >
                Start using CtrlBooks
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

        </section>
        {/* <section>
          <EnquiryForm />
        </section> */}

        {/* ================= LOGIN ANCHOR ================= */}
        <div id="login" className="h-0" />


    </>
  );
}

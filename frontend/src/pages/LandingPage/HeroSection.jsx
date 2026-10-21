import { ArrowRight, Sparkles } from "lucide-react";
import FeatureCards from "../../components/FeatureCards";
import DashboardPreview from "./DashboardPreview";

export default function HeroSection({ goToLogin }) {
  return (
    <>
      {/* ================= HERO ================= */}
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-b from-[#f5fff2] via-white to-white"
        >
          <div className="absolute left-[-80px] top-20 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />

          <div className="absolute right-[-100px] top-0 h-96 w-96 rounded-full bg-lime-100/50 blur-3xl" />

          <div className="max-sm:pt-[100px] relative mx-auto flex max-w-7xl items-start gap-2 px-4 pt-10 sm:px-6 lg:gap-10 lg:px-8 lg:pt-10">
            {/* Left */}
            <div className="w-full max-w-lg shrink-0 text-left lg:w-[42%]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50">
                  <Sparkles
                    size={18}
                    strokeWidth={2}
                    className="text-emerald-700"
                  />
                </span>
                AI Powered Accounting & Business Management
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                <span className="block">Smart accounts,</span>

                <span className="block text-emerald-700">
                  Bigger Decisions.
                </span>
                <span className="block text-emerald-700">
                  with AI.
                </span>
              </h1>

              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                CtrlBooks brings your accounting, inventory, invoicing and business insights together — powered by AI, so you can focus on what really matters: growing your business.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start">
                <button
                  onClick={goToLogin}
                  className="max-sm:w-[60%] group inline-flex items-center justify-center gap-2 rounded-full bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-100 transition hover:bg-emerald-800 mr-8"
                >
                  Start using CtrlBooks

                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>

                <FeatureCards/>

            </div>

            {/* Right - More Width */}
            <div className="flex min-w-0 flex-1 items-start justify-center lg:justify-end">
              <div className="w-full lg:max-w-3xl mt-0">
                <DashboardPreview />
              </div>
            </div>
          </div>
        </section>

        {/* ================= TRUST BAR ================= */}
        {/* <section className="border-y border-slate-100 bg-white">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-5 px-4 py-8 sm:px-6 md:grid-cols-4 lg:px-8">
            <TrustItem
              icon={Cloud}
              text="Cloud connected"
            />
            <TrustItem
              icon={Smartphone}
              text="Mobile ready"
            />
            <TrustItem
              icon={ShieldCheck}
              text="Security focused"
            />
            <TrustItem
              icon={Globe2}
              text="Anywhere access"
            />
          </div>
        </section> */}


    </>
  );
}

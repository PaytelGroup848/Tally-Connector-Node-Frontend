import logoFull from "../../assets/Control-Books-Dashboard.png";
import CloudeData from "../../assets/Cloudedata.png";
import { SocialIcon } from "./SocialIcon";

export default function FooterSection({ scrollTo, goToPrivacy, goToTerms, goToRefund }) {
  return (
    <>
      {/* =========================================================
            FOOTER
        ========================================================= */}
      <footer id="footer" className="scroll-mt-24 bg-white text-slate-900">
        {/* Main Footer */}
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-3 lg:gap-16 lg:px-8">
          {/* Grow Your Business */}
          <div>
            <img src={logoFull} />
            <img src={CloudeData} className="h-[70px] w-[55%]" />
            <h3 className="text-[22px] font-extrabold text-emerald-700">
              Grow Your Business
            </h3>

            <div className="mt-6">
              <p className="text-sm font-bold text-slate-900">
                Experience Financial Data on Mobile
              </p>

              <p className="mt-2 text-sm italic text-slate-600">
                Business made simpler for Business users.
              </p>

            </div>
          </div>


          {/* Quick Links */}
          <div>
            <h3 className="text-[22px] font-extrabold text-emerald-700">
              Quick Links
            </h3>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => scrollTo("home")}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                Home
              </button>

              <button
                onClick={() => scrollTo("features")}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                Features
              </button>


              <button
                onClick={() => scrollTo("product")}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                Product
              </button>

              {/* <button
                  onClick={() => scrollTo("pricing")}
                  className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
                >
                  Pricing
                </button> */}

              <button
                onClick={() => scrollTo("testimonials")}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                Testimonials
              </button>

              <button
                onClick={() => scrollTo("faq")}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                FAQ
              </button>

              <button
                onClick={() => scrollTo("footer")}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                Contact Us
              </button>
              {/* <button
                onClick={goToPrivacy}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                Privacy Policy
              </button> */}
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-[22px] font-extrabold text-emerald-700">
              Contact Us
            </h3>

            <div className="mt-6 space-y-2 text-sm leading-5 text-slate-900">
              <p className="font-bold">
                CloudeData
                <br />

              </p>

              <p className="pt-1 font-semibold text-slate-700">
                First Floor, A 212, Okhla Phase 3 Rd, near by hdfc bank, Okhla Phase III, Okhla Industrial Estate, New Delhi, Delhi 110020
              </p>

              <p className="font-semibold text-slate-700">
                Support Email:{" "}
                <a
                  href="mailto:info@clouddata.com"
                  className="hover:text-emerald-700"
                >
                  info@cloudedata.com
                </a>
              </p>

              <p className="font-semibold text-slate-700">
                Support Mobile:{" "}
                <a
                  href="tel:+91 9311472355"
                  className="hover:text-emerald-700"
                >
                  +91 9311472357
                </a>{" "}

              </p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-200">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-5 sm:px-8 lg:flex-row lg:px-8">
            {/* Copyright */}
            <p className="text-center text-xs font-semibold text-slate-700 lg:text-left">
              © 2026 CloudeData All Right Reserved
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <SocialIcon type="facebook" />
              <SocialIcon type="instagram" />
              <SocialIcon type="linkedin" />
              <SocialIcon type="youtube" />
              <SocialIcon type="x" />
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs font-semibold">
              <button
                type="button"
                onClick={goToPrivacy}
                className="text-slate-700 transition hover:text-emerald-700"
              >
                Privacy Policy
              </button>

              <button
                type="button"
                onClick={goToTerms}
                className="text-slate-700 transition hover:text-emerald-700"
              >
                Terms & Conditions
              </button>

              <button
                type="button"
                onClick={goToRefund}
                className="text-slate-700 transition hover:text-emerald-700"
              >
                Refund Policy
              </button>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

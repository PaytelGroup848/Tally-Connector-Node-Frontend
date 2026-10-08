import React from "react";
import logoFull from "../assets/Control-Books-Dashboard.png";
import CloudeData from "../assets/Cloudedata.png";

export default function FooterLandingPage({ scrollTo }) {
  return (
    <footer id="footer" className="scroll-mt-24 bg-white text-slate-900">
      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 sm:px-8 lg:grid-cols-3 lg:gap-16 lg:px-8">
        {/* Grow Your Business */}
        <div>
          <img src={logoFull} alt="CtrlBooks Logo" />
          <img src={CloudeData} alt="CloudeData" className="h-[70px] w-[55%]" />
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
              onClick={() => {
                window.location.href = "/";
              }}
              className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
            >
              Home
            </button>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
            >
              Features
            </button>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
            >
              Product
            </button>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
            >
              Testimonials
            </button>

            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
            >
              FAQ
            </button>

            <button
              onClick={() => scrollTo?.("footer")}
              className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
            >
              Contact Us
            </button>

            {/* <button
              onClick={() => {
                window.location.href = "/privacy-policy";
              }}
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
            <p className="font-bold">CloudeData</p>

            <p className="pt-1 font-semibold text-slate-700">
              First Floor, A 212, Okhla Phase 3 Rd, near by hdfc bank, Okhla
              Phase III, Okhla Industrial Estate, New Delhi, Delhi 110020
            </p>

            <p className="font-semibold text-slate-700">
              Support Email:{" "}
              <a
                href="mailto:info@cloudedata.com"
                className="hover:text-emerald-700"
              >
                info@cloudedata.com
              </a>
            </p>

            <p className="font-semibold text-slate-700">
              Support Mobile:{" "}
              <a href="tel:+919311472357" className="hover:text-emerald-700">
                +91 9311472357
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-slate-200">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-6 py-5 sm:px-8 lg:flex-row lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-700 lg:text-left">
            © 2026 CloudeData All Right Reserved
          </p>

          <div className="flex items-center gap-3">
            <SocialIcon type="facebook" />
            <SocialIcon type="instagram" />
            <SocialIcon type="linkedin" />
            <SocialIcon type="youtube" />
            <SocialIcon type="x" />
          </div>

          <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                window.location.href = "/privacy-policy";
              }}
              className="text-slate-700 transition hover:text-emerald-700"
            >
              Privacy Policy
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/terms-and-conditions";
              }}
              className="text-slate-700 transition hover:text-emerald-700"
            >
              Terms & Conditions
            </button>

            <button
              type="button"
              onClick={() => {
                window.location.href = "/refund-policy";
              }}
              className="text-slate-700 transition hover:text-emerald-700"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ type }) {
  const socialLinks = {
    facebook: "https://www.facebook.com/Cloudedataa/",
    instagram: "https://www.instagram.com/cloudedata/",
    linkedin: "https://www.linkedin.com/company/cloude-data",
    youtube: "https://www.youtube.com/@Cloudedata",
    x: "https://x.com/CloudeData",
  };

  const commonProps = {
    width: 17,
    height: 17,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  return (
    <a
      href={socialLinks[type]}
      target="_blank"
      rel="noreferrer"
      aria-label={`${type === "x" ? "X" : type} social profile`}
      title={type === "x" ? "X" : type}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900 text-slate-900 transition hover:border-[#4fc52a] hover:bg-emerald-700 hover:text-white"
    >
      {type === "facebook" && (
        <svg {...commonProps}>
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      )}

      {type === "instagram" && (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle
            cx="17.5"
            cy="6.5"
            r="0.8"
            fill="currentColor"
            stroke="none"
          />
        </svg>
      )}

      {type === "linkedin" && (
        <svg {...commonProps}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )}

      {type === "youtube" && (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8ZM9.6 15.5v-7l6.4 3.5-6.4 3.5Z" />
        </svg>
      )}

      {type === "x" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817-5.967 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      )}
    </a>
  );
}
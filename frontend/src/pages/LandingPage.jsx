import React, { useState, useEffect } from "react";
import EnquiryModal from "../components/EnquiryModal";
import EnquiryForm from "../components/EnquiryFormSection";
import LoginPage from "./LoginPage";
import logoFull from "../assets/Control-Books-Dashboard.png";
import CloudeData from "../assets/Cloudedata.png"
import PrivacyPage from "./PrivacyPage";
import TermsAndConditions from "./TermsAndConditions";
import RefundPolicy from "./RefundPolicy";
import mobileScreen from "../assets/Control-Books-Mobile-Screen-Website-Image-1.png";
import invoiceFeatureImage from "../assets/Control-Books-Website-Image-2 (7).png";
import inactiveFeatureImage from "../assets/Control-Books-Website-Image-3 (2).png";
import reminderFeatureImage from "../assets/Control-Books-Website-Image-4 (2).png";
import backupFeatureImage from "../assets/Control-Books-Website-Image-5 (1).png";
import gstFeatureImage from "../assets/Control-Books-Website-Image-6 (3).png";
import reportsFeatureImage from "../assets/Control-Books-Website-Image-7 (2).png";
import Dashboard from "../assets/DashboardImage.png";
import DashboardInlaptop from "../assets/Control-Books-Laptop-Screen-Image-2 (1).png";
import test2 from "../assets/New Testimonial-Review-Card-1.png";
import test3 from "../assets/New-Testimonial-Review-Card-2 (2).png";
import test4 from "../assets/New-Testimonial-Review-Card-3 (2).png";
import test5 from "../assets/New-Testimonial-Review-Card-8 (2).png";
import test6 from "../assets/New-Testimonial-Review-Card-5 (2).png";
import test7 from "../assets/New-Testimonial-Review-Card-10.png";
import test8 from "../assets/New-Testimonial-Review-Card-4 (2).png";
import test9 from "../assets/New-Testimonial-Review-Card-6 (2).png";
import test10 from "../assets/New-Testimonial-Review-Card-7 (2).png";
import test11 from "../assets/New-Testimonial-Review-Card-9 (2).png";
import {
  ArrowRight,
  Download,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Cloud,
  CreditCard,
  Globe2,
  Landmark,
  LayoutDashboard,
  Menu,
  Monitor,
  Receipt,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Phone,
  Users,
  WalletCards,
  X,
  Play,
  ArrowUpRight,
  IndianRupee,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
const features = [
  {
    icon: LayoutDashboard,
    title: "Real-time Dashboard",
    description:
      "Get a complete view of your business with live sales, purchases, receivables and payables.",
  },
  {
    icon: Receipt,
    title: "Create Transactions",
    description:
      "Create sales, purchases, receipts, payments, quotations and other business transactions.",
  },
  {
    icon: BarChart3,
    title: "Business Reports",
    description:
      "Understand your business through easy-to-read charts, reports and financial summaries.",
  },
  {
    icon: Smartphone,
    title: "Mobile Access",
    description:
      "Access your business data from anywhere through a mobile-friendly experience.",
  },
  {
    icon: Cloud,
    title: "Cloud Data",
    description:
      "Keep business information available across your connected devices.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Data",
    description:
      "Business information is protected with modern security-focused infrastructure.",
  },
];


const transactions = [
  {
    label: "Sales",
    value: "₹ 1,15,900",
    icon: ShoppingCart,
  },
  {
    label: "Receivables",
    value: "₹ 2,10,500",
    icon: WalletCards,
  },
  {
    label: "Purchase",
    value: "₹ 1,59,000",
    icon: Receipt,
  },
];

const testimonialImages = [

  test2,
  test3,
  test4,
  test5,
  test6,
  test7,
  test8,
  test9,
  test10,
  test11,
];

const planData = [

  {
    id: "6aa0ea43710906eea178f548",
    name: "Pro",
    description: "Create & Manage Entries",
    features: [
      "COMPANY_READ",
      "LEDGER_READ",
      "CUSTOMER_READ",
      "SUPPLIER_READ",
      "STOCK_READ",
      "VOUCHER_READ",
      "REPORTS_READ",
      "CONNECTOR_STATUS",
      "COMMAND_CREATE",
      "SYNC_LEDGER",
      "SYNC_VOUCHER",
      "SYNC_STOCK",
    ],
    seatLimit: 2,
    price: 3000,
    billingText: "/ year",
    highlighted: true,
  },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN").format(value);

function App() {
  const [showEnquiry, setShowEnquiry] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);

  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => {
        return (prev + 1) % testimonialImages.length;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const [activeFeature, setActiveFeature] = useState(null);
  const scrollTo = (id) => {
    setMobileOpen(false);

    requestAnimationFrame(() => {
      const target = document.getElementById(id);

      if (!target) {
        return;
      }

      const headerOffset = 96;
      const targetPosition =
        target.getBoundingClientRect().top +
        window.scrollY -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  };
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const navigateTo = (path) => {
    if (window.location.pathname === path) {
      return;
    }

    window.history.pushState({}, "", path);

    setCurrentPath(path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setMobileOpen(false);
  };

  const goToLogin = () => {
    navigateTo("/login");
  };

  const goToPrivacy = () => {
    navigateTo("/privacy-policy");
  };

  const goToTerms = () => {
    navigateTo("/terms-and-conditions");
  };

  const goToRefund = () => {
    navigateTo("/refund-policy");
  };

  const goToHome = () => {
    navigateTo("/");
  };
  if (currentPath === "/privacy-policy") {
    return <PrivacyPage onBack={goToHome} />;
  }

  if (currentPath === "/terms-and-conditions") {
    return <TermsAndConditions onBack={goToHome} />;
  }

  if (currentPath === "/refund-policy") {
    return <RefundPolicy onBack={goToHome} />;
  }

  if (currentPath === "/login") {
    return <LoginPage onBack={goToHome} />;
  }
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur ">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2"
          >
            <img
              src={logoFull}
              alt="CtrlBooks Logo"
              className="h-18 sm:h-14 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <div className="flex items-center gap-1">
              <Phone size={16} strokeWidth={2} />

              <div className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700">
                +91 9311472357
              </div>
            </div>

            <button
              onClick={() => scrollTo("home")}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              Home
            </button>

            <button
              onClick={() => scrollTo("features")}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              Features
            </button>
            <button
              onClick={() => scrollTo("pricing")}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              Pricing
            </button>
            {/* <button
                onClick={() => scrollTo("pricing")}
                className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
              >
                Pricing
              </button> */}

            <button
              onClick={() => scrollTo("testimonials")}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              Testimonials
            </button>

            <button
              onClick={() => scrollTo("faq")}
              className="text-sm font-semibold text-slate-700 transition hover:text-emerald-700"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Actions */}
          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">

            {/* Start using CtrlBooks */}
            <button
              onClick={goToLogin}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-green-100 transition hover:bg-emerald-800 mr-8"
            >
              Start using CtrlBooks

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </button>

            {/* Download Connector + Enquiry */}
            <div className="mt-23 flex w-[190px] flex-col items-center">

              {/* Download Connector */}
              <a
                href="http://191.44.87.205:8000/downloads/CtrlBooks_Setup_v1.0.2.exe"
                download
                title="Download CtrlBooks Connector"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-emerald-800"
              >
                <span className="whitespace-nowrap">
                  Download Connector
                </span>

                <Download
                  size={18}
                  strokeWidth={2.2}
                  className="shrink-0"
                />
              </a>

              {/* Enquiry Now */}
              <div className="relative flex h-[95px] w-[140px] items-start justify-center">

                {/* Chain */}
                <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 flex-col items-center">
                  <div className="h-3 w-[3px] bg-[#8b5a18]" />

                  <div className="flex flex-col items-center">
                    <span className="h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
                    <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
                    <span className="-mt-1 h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
                    <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
                  </div>

                  <div className="mt-1 h-4 w-4 rounded-full border border-gray-400 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 shadow-md" />
                </div>

                {/* Yellow Tag */}
                <div className="relative mt-12 w-[125px] rotate-[-14deg] rounded-[10px] border border-[#d69b08] bg-gradient-to-br from-[#fff06a] via-[#ffd83d] to-[#f5bd00] px-3 py-2 shadow-[0_5px_12px_rgba(0,0,0,0.18)]">

                  {/* Screw holes */}
                  <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                  <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                  <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
                  <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />

                  <div className="text-center font-serif text-[13px] font-black leading-tight tracking-[0.08em] text-black">
                    <button
                      onClick={() => setShowEnquiry(true)}
                      className="focus:outline-none"
                    >
                      ENQUIRY NOW
                    </button>

                    <EnquiryModal
                      isOpen={showEnquiry}
                      onClose={() => setShowEnquiry(false)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          {/* Mobile menu button */}
          {/* ================= MOBILE NAV ACTIONS ================= */}
          <div className="flex items-center gap-2 lg:hidden">

            <div className=" flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={goToLogin}
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-1 py-1 text-xs font-bold text-white shadow-xl shadow-green-100 transition hover:bg-emerald-800 mr-1"
              >
                Start using CtrlBooks
              </button>


            </div>


            {/* Menu */}
            <button
              type="button"
              onClick={() =>
                setMobileOpen((value) => !value)
              }
              aria-label={
                mobileOpen
                  ? "Close navigation menu"
                  : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              className="
        flex
        h-10
        w-9
        items-center
        justify-center

        rounded-lg

        border
        border-slate-200

        bg-white

        text-slate-700

        transition

        hover:bg-slate-50
      "
            >
              {mobileOpen ? (
                <X size={20} />
              ) : (
                <Menu size={20} />
              )}
            </button>

          </div>

        </div>
        {/* Enquiry Now */}
        <div className="left-3/4 absolute flex h-[95px] w-[20%] items-start justify-center lg:hidden">

          {/* Chain */}
          <div className="absolute left-1/2 top-0 z-10 flex -translate-x-1/2 flex-col items-center">
            <div className="h-3 w-[3px] bg-[#8b5a18]" />

            <div className="flex flex-col items-center">
              <span className="h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
              <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
              <span className="-mt-1 h-2 w-2 rotate-45 border-2 border-[#8b5a18]" />
              <span className="-mt-1 h-2 w-2 -rotate-45 border-2 border-[#8b5a18]" />
            </div>

            <div className="mt-1 h-4 w-4 rounded-full border border-gray-400 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-500 shadow-md" />
          </div>

          {/* Yellow Tag */}
          <div className="relative mt-12 w-[125px] rotate-[-14deg] rounded-[10px] border border-[#d69b08] bg-gradient-to-br from-[#fff06a] via-[#ffd83d] to-[#f5bd00] px-3 py-2 shadow-[0_5px_12px_rgba(0,0,0,0.18)]">

            {/* Screw holes */}
            <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
            <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
            <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />
            <span className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full border border-gray-400 bg-gray-200" />

            <div className="text-center font-serif text-[13px] font-black leading-tight tracking-[0.08em] text-black">
              <button
                onClick={() => setShowEnquiry(true)}
                className="focus:outline-none"
              >
                ENQUIRY NOW
              </button>

              <EnquiryModal
                isOpen={showEnquiry}
                onClose={() => setShowEnquiry(false)}
              />
            </div>
          </div>
        </div>
        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-5 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {[
                ["Home", "home"],
                ["Features", "features"],
                ["Pricing", "pricing"],
                ["Testimonials", "testimonials"],
                ["FAQ", "faq"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="rounded-lg px-4 py-3 text-left text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  {label}
                </button>
              ))}

              {/* <div className="ml-4 border-l border-green-100 pl-3">
                  <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                    Feature workflows
                  </p>

                  {showcaseFeatures.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => scrollTo(feature.id)}
                      className="block w-full rounded-lg px-4 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-green-50 hover:text-emerald-700"
                    >
                      {feature.title}
                    </button>
                  ))}
                </div> */}
              <div>

              </div>
              {/* <div className="mt-2 grid grid-cols-2 gap-3">
                  <button
                    onClick={goToLogin}
                    className="rounded-xl border border-slate-200 py-3 text-sm font-bold"
                  >
                    Login
                  </button>

                  <button
                    onClick={() => scrollTo("footer")}
                    className="rounded-xl bg-emerald-700 py-3 text-sm font-bold text-white"
                  >
                    Get Started
                  </button>
                </div> */}
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <main>
        <section
          id="home"
          className="relative overflow-hidden bg-gradient-to-b from-[#f5fff2] via-white to-white"
        >
          <div className="absolute left-[-80px] top-20 h-72 w-72 rounded-full bg-green-100/60 blur-3xl" />

          <div className="absolute right-[-100px] top-0 h-96 w-96 rounded-full bg-lime-100/50 blur-3xl" />

          <div className="relative mx-auto flex max-w-7xl items-start gap-2 px-4 pt-10 sm:px-6 lg:gap-10 lg:px-8 lg:pt-10">
            {/* Left */}
            <div className="w-full max-w-lg shrink-0 text-left lg:w-[42%]">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
                <span className="h-2 w-2 rounded-full bg-emerald-700" />
                Business data on mobile & web
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                <span className="block">Your business,</span>

                <span className="block text-emerald-700">
                  Live on your fingertips.
                </span>
              </h1>

              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                Monitor your business, access accounting information and stay
                connected with your team from anywhere.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start">
                <button
                  onClick={goToLogin}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-100 transition hover:bg-emerald-800 mr-8"
                >
                  Start using CtrlBooks

                  <ArrowRight
                    size={18}
                    className="transition group-hover:translate-x-1"
                  />
                </button>
              </div>

              <div className="mt-8 grid max-w-lg grid-cols-2 gap-4 sm:grid-cols-3">
                <MiniStat value="24/7" label="Business access" />
                <MiniStat value="Cloud" label="Connected data" />
                <MiniStat value="Mobile" label="Ready" />
              </div>
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
        <section className="border-y border-slate-100 bg-white">
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
        </section>

        {/* ================= FEATURES ================= */}
        <section
          id="features"
          className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="FEATURES"
              title=""
              description="A clean business management experience built around visibility, transactions and easy access to your business information."
            />

            <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const showcaseFeature = showcaseFeatures[index];

                return (
                  <FeatureCard
                    key={feature.title}
                    icon={feature.icon}
                    title={feature.title}
                    description={feature.description}
                    active={activeFeature === showcaseFeature?.id}
                    onClick={() => {
                      if (!showcaseFeature) return;
                      setActiveFeature(showcaseFeature.id);

                      requestAnimationFrame(() => {
                        const target = document.getElementById(
                          "feature-showcase-details"
                        );

                        if (target) {
                          const headerOffset = 96;
                          const targetPosition =
                            target.getBoundingClientRect().top +
                            window.scrollY -
                            headerOffset;

                          window.scrollTo({
                            top: targetPosition,
                            behavior: "smooth",
                          });
                        }
                      });
                    }}
                  />
                );
              })}
            </div>
            {/* ================= PRICING ================= */}
            <section
              id="pricing"
              className="bg-[#f7fbf7] px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
            >
              <div className="mx-auto max-w-7xl">
                <SectionHeading
                  eyebrow="PRICING"
                  title="Choose the right plan for your business"
                  description="Simple and transparent pricing with powerful business and Tally management features."
                />

                <div className="mx-auto mt-14 flex max-w-7xl gap-6 justify-center">
                  {planData.map((plan) => (
                    <PriceCard
                      key={plan.id}
                      title={plan.name}
                      price={`₹${formatPrice(plan.price)}`}
                      description={
                        plan.name === "Pro"
                          ? "Complete Tally Sync & Management"
                          : plan.description
                      }
                      features={plan.features}
                      highlighted={plan.highlighted}
                      seatLimit={plan.seatLimit}
                      additionalUserPrice={3000}
                    />
                  ))}
                </div>
              </div>
            </section>
            <FeatureShowcase
              activeFeature={activeFeature}
              setActiveFeature={setActiveFeature}
            />
          </div>
        </section>

        {/* ================= PRODUCT ================= */}
        <section
          id="product"
          className="overflow-hidden bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
            {/* product mobile UI */}
            <div className="relative order-2 lg:order-1">
              <img
                src={mobileScreen}
                alt="CtrlBooks mobile screen showing business balances and transaction options"
                className="relative mx-auto h-auto w-full max-w-md object-contain"
              />
            </div>

            {/* content */}
            <div className="order-1 lg:order-2">
              <p className="text-xl font-extrabold tracking-[0.18em] text-emerald-700">
                MOBILE BUSINESS
              </p>



              <p className="mt-5 max-w-xl text-base leading-8 text-slate-600">
                Keep track of transactions, customer activity, business
                performance and important accounting information without being
                tied to your desk.
              </p>

              <div className="mt-8 space-y-5">
                <ProductPoint
                  icon={Smartphone}
                  title="Access on mobile"
                  description="Get important business information when you need it."
                />

                <ProductPoint
                  icon={Monitor}
                  title="Web experience"
                  description="Use the browser-based experience for a larger workspace."
                />

                <ProductPoint
                  icon={Bell}
                  title="Stay informed"
                  description="Keep important business activity visible and organized."
                />
              </div>

              <button
                onClick={() => scrollTo("contact")}
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-800"
              >
                Explore CtrlBooks
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>


        {/* ================= TESTIMONIALS ================= */}
        <section id="testimonials" className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeading
              eyebrow="TESTIMONIALS"
              title=""
              description="Teams choose CtrlBooks to simplify daily operations, stay organized, and keep financial visibility in one place."
            />
          </div>

          <div className="relative w-full overflow-hidden">
            <div className="flex w-max gap-0 animate-[testimonialScroll_70s_linear_infinite]">
              {testimonialImages.map((image, index) => (
                <img
                  key={`first-${index}`}
                  src={image}
                  alt={`Testimonial ${index + 1}`}
                  className="block h-[min(70vh,640px)] w-auto max-w-none shrink-0 -mr-8"
                  loading="lazy"
                />
              ))}

              {testimonialImages.map((image, index) => (
                <img
                  key={`second-${index}`}
                  src={image}
                  alt={`Testimonial ${index + 1}`}
                  className="block h-[min(70vh,640px)] w-auto max-w-none shrink-0 -mr-8"
                  loading="lazy"
                />
              ))}
            </div>
          </div>

          <style>{`
    @keyframes testimonialScroll {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }
  `}</style>
        </section>

        {/* ================= STATS ================= */}
        <section className="bg-emerald-800 px-4 py-16 text-white sm:px-6 lg:px-8">
          <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <DarkStat
              value="24/7"
              title="Business visibility"
              description="Access information when you need it."
            />

            <DarkStat
              value="Cloud"
              title="Connected experience"
              description="Keep your business data within reach."
            />

            <DarkStat
              value="Mobile"
              title="Built for movement"
              description="Work beyond the office environment."
            />

            <DarkStat
              value="Simple"
              title="Easy workflows"
              description="Focus on your business instead of complexity."
            />
          </div>
        </section>


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
      </main>

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
              <button
                onClick={goToPrivacy}
                className="block text-sm font-semibold text-slate-900 transition hover:text-emerald-700"
              >
                Privacy Policy
              </button>
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
    </div>
  );
}

/* =========================================================
  COMPONENTS
========================================================= */

function MiniStat({ value, label }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <p className="text-lg font-black text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-[11px] font-medium text-slate-400">
        {label}
      </p>
    </div>
  );
}

function DashboardSideItem({
  icon: Icon,
  label,
  active = false,
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 ${active
        ? "bg-white/10 text-[#9bf26f]"
        : "text-white/55"
        }`}
    >
      <Icon size={13} />

      <span>{label}</span>
    </div>
  );
}

function TrustItem({ icon: Icon, text }) {
  return (
    <div className="flex items-center justify-center gap-3 border-slate-100 px-3 text-center sm:justify-start">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
        <Icon size={18} />
      </div>

      <span className="text-xs font-bold text-slate-600 sm:text-sm">
        {text}
      </span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-xl font-extrabold tracking-[0.2em] text-emerald-700">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-7 text-slate-500 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
  active = false,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group w-full rounded-2xl border p-6 text-left transition duration-300 focus:outline-none focus:ring-[#61c928]/30 ${active
        ? "border-slate-200 bg-white hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/40"
        : "border-slate-200 bg-white hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/40"
        }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition ${active
            ? "bg-green-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"
            : "bg-green-50 text-emerald-700 group-hover:bg-emerald-700 group-hover:text-white"
            }`}
        >
          <Icon size={22} />
        </div>

        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${active
            ? "bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-emerald-700"
            : "bg-slate-50 text-slate-400 group-hover:bg-green-50 group-hover:text-emerald-700"
            }`}
          aria-hidden="true"
        >
          <ArrowRight size={16} />
        </div>
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-800">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>

      <div
        className={`mt-5 text-xs font-black uppercase tracking-[0.14em] transition ${active ? "text-slate-400 group-hover:text-emerald-700" : "text-slate-400 group-hover:text-emerald-700"
          }`}
      >
        {active ? "View feature" : "View feature"}
      </div>
    </button>
  );
}

function ProductPoint({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-emerald-700">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="text-sm font-extrabold text-slate-800">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}

const showcaseFeatures = [
  {
    id: "feature-invoices",
    title: "Generate eWay Bills & eInvoices on the go",
    description:
      "Easily generate e-way bills in under 30 seconds with validations built into your workflow. Create e-invoices and e-way bills together.",
    kind: "invoice",
  },
  {
    id: "feature-inactive",
    title: "Get Inactive Customers & Items Reports",
    description:
      "Understand your inactive customers and items. Re-engage with them to grow your business.",
    kind: "inactive",
  },
  {
    id: "feature-reminders",
    title: "Send Payment Reminder to Recover Dues",
    description:
      "Automate payment reminders via SMS and email to prompt parties for delayed payments and improve cash flow.",
    kind: "reminder",
  },
  {
    id: "feature-backup",
    title: "Data Backup and Restore",
    description:
      "Be ready with backup for your financial data. Never lose important information in case of migration or system crash.",
    kind: "backup",
  },
  {
    id: "feature-gst",
    title: "Create GST Bills and share on WhatsApp",
    description:
      "Simplify your workflow by creating GST bills and instantly sharing them via WhatsApp or email to minimize errors.",
    kind: "gst",
  },
  {
    id: "feature-reports",
    title: "View Daily Books, Expense Tracking, Balance Sheet",
    description:
      "Evaluate daily business performance with comprehensive financial reports, enabling informed, data-driven decisions.",
    kind: "reports",
  },
];

function FeatureShowcase({ activeFeature, setActiveFeature }) {
  const selectedFeature =
    showcaseFeatures.find((feature) => feature.id === activeFeature) ||
    showcaseFeatures[0];

  if (!selectedFeature) {
    return null;
  }

  return (
    <div
      id="feature-showcase-details"
      className="mt-20 border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:mt-28 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="BUILT FOR DAILY WORK"
          title="Explore each feature"
          description="Everything you need to manage daily business operations is designed to stay simple, clear, and ready to use."
        />

        <div className="mt-12 space-y-12 lg:mt-16">
          {showcaseFeatures.map((feature) => (
            <div
              key={feature.id}
              id={feature.id}
              className="grid min-w-0 items-center gap-10 lg:grid-cols-2 lg:gap-20"
            >
              <div className="min-w-0">
                <ShowcaseIllustration kind={feature.kind} />
              </div>

              <div className="min-w-0 max-w-xl lg:justify-self-stretch">
                <span className="inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-emerald-700">
                  CtrlBooks feature
                </span>

                <h3 className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                  {feature.title}
                </h3>

                <p className="mt-5 text-base leading-8 text-slate-600">
                  {feature.description}
                </p>

                <LeadCapture />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadCapture() {
  return (
    <div>



    </div>
  );
}

function ShowcaseIllustration({ kind }) {
  const featureImages = {
    invoice: invoiceFeatureImage,
    inactive: inactiveFeatureImage,
    reminder: reminderFeatureImage,
    backup: backupFeatureImage,
    gst: gstFeatureImage,
    reports: reportsFeatureImage,
  };
  const imageDescriptions = {
    invoice: "Generate e-way bills and e-invoices",
    inactive: "Inactive customer and item reports",
    reminder: "Payment reminders to recover dues",
    backup: "Business data backup and restore",
    gst: "Create GST bills and share on WhatsApp",
    reports: "Daily books, expense tracking and balance sheet",
  };

  if (featureImages[kind]) {
    return (
      <img
        src={featureImages[kind]}
        alt={imageDescriptions[kind]}
        className="mx-auto h-auto w-full max-w-[480px] rounded-2xl object-contain"
      />
    );
  }

  const common =
    "relative mx-auto flex h-[250px] w-full max-w-[390px] items-center justify-center overflow-hidden rounded-[42%] bg-[#eaffd8] sm:h-[310px]";

  if (kind === "invoice") {
    return (
      <div className={common}>
        <div className="absolute left-8 top-8 rounded-lg bg-white px-5 py-3 text-xs font-bold shadow-lg">
          Generate e-Way Bills
        </div>

        <div className="absolute right-8 top-20 rounded-lg bg-white px-5 py-3 text-xs font-bold shadow-lg">
          Generate e-Invoices
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-3">
          <ShowcasePaper title="e-Way Bill" />
          <ShowcasePaper title="e-Invoice" />
        </div>
      </div>
    );
  }

  if (kind === "inactive") {
    return (
      <div className={common}>
        <div className="absolute right-8 top-10 space-y-2">
          <ShowcasePerson name="Arun Kumar" />
          <ShowcasePerson name="Sanjay Sharma" />
        </div>

        <div className="rounded-2xl bg-white p-5 shadow-xl">
          <div className="mb-3 text-sm font-black">
            Inactive Items
          </div>

          {["Cap", "Jeans", "T-Shirt", "Shoes"].map(
            (item) => (
              <div
                key={item}
                className="flex items-center gap-3 border-b border-slate-100 py-2 text-xs text-slate-600"
              >
                <b className="text-red-500">×</b>
                {item}
                <span className="h-1.5 flex-1 bg-slate-200" />
              </div>
            )
          )}
        </div>
      </div>
    );
  }

  if (kind === "reminder") {
    return (
      <div className={common}>
        <div className="w-[78%] rounded-2xl bg-white p-4 shadow-xl">
          <div className="space-y-3 text-xs font-bold text-slate-700">
            <div className="flex justify-between">
              <span>ARUN PVT LTD</span>
              <span>₹ 23,50,201</span>
            </div>

            <div className="h-2 rounded bg-green-100" />

            <div className="flex justify-between">
              <span>Amit Enterprises</span>
              <span>₹ 61,152</span>
            </div>

            <div className="h-2 rounded bg-green-100" />
          </div>

          <div className="mt-5 flex gap-2">
            <span className="rounded-full bg-white px-3 py-2 text-[10px] font-bold shadow">
              Send Reminder
            </span>

            <span className="rounded-full bg-slate-900 px-3 py-2 text-[10px] font-bold text-white">
              Schedule Reminder
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (kind === "backup") {
    return (
      <div className={common}>
        <div className="text-center">
          <div className="text-7xl">☁</div>

          <div className="mt-3 flex items-center gap-3">
            <div className="h-20 w-28 border-4 border-[#082f3f] bg-white" />

            <div className="h-20 w-12 rounded-lg border-4 border-[#082f3f] bg-white" />
          </div>

          <div className="mt-3 text-sm font-black text-slate-800">
            Backup securely. Restore instantly.
          </div>
        </div>
      </div>
    );
  }

  if (kind === "gst") {
    return (
      <div className={common}>
        <div className="relative rounded-2xl bg-white p-4 shadow-xl">
          <div className="text-xs font-black">
            ABC Pvt Ltd
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              "Sales ₹ 1,15,900",
              "Receivables ₹ 2,10,000",
              "Purchase ₹ 1,59,000",
              "Payment ₹ 21,550",
            ].map((item) => (
              <div
                key={item}
                className="rounded bg-green-50 p-2 text-[9px] font-bold text-slate-700"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="absolute -bottom-8 -left-8 rounded-lg bg-white p-3 text-[10px] font-bold shadow-lg">
            Create Transaction
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={common}>
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white p-4 shadow-xl">
          <div className="text-xs font-bold text-slate-500">
            Sales
          </div>

          <div className="mt-2 text-xl font-black">
            ₹ 11.50K
          </div>

          <div className="mt-4 flex h-16 items-end gap-1">
            {[30, 55, 40, 75, 60].map(
              (height, index) => (
                <span
                  key={index}
                  className="w-3 rounded-t bg-emerald-700"
                  style={{ height: `${height}%` }}
                />
              )
            )}
          </div>
        </div>

        <div className="rounded-2xl bg-white p-4 shadow-xl">
          <div className="text-xs font-bold text-slate-500">
            Reports
          </div>

          <div className="mt-3 space-y-2">
            {[
              "Receivables",
              "Purchase",
              "Payables",
              "Receipt",
            ].map((item) => (
              <div
                key={item}
                className="flex justify-between text-[10px] font-bold"
              >
                <span>{item}</span>
                <span>₹ 2,15,201</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShowcasePaper({ title }) {
  return (
    <div className="h-36 w-28 rounded-lg border border-slate-200 bg-white p-2 shadow-xl">
      <div className="text-[10px] font-black text-emerald-700">
        {title}
      </div>

      <div className="mt-3 h-2 rounded bg-slate-200" />
      <div className="mt-2 h-2 rounded bg-slate-100" />
      <div className="mt-7 h-10 rounded bg-green-50" />
    </div>
  );
}

function ShowcasePerson({ name }) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-lg">
      <span className="h-6 w-6 rounded-full bg-slate-200" />

      <span className="text-[10px] font-bold">
        {name}
      </span>

      <b className="text-red-500">×</b>
    </div>
  );
}

function DarkStat({
  value,
  title,
  description,
}) {
  return (
    <div>
      <p className="text-3xl font-black text-white">
        {value}
      </p>

      <h3 className="mt-2 text-sm font-extrabold">
        {title}
      </h3>

      <p className="mt-2 text-xs leading-6 text-white/75">
        {description}
      </p>
    </div>
  );
}

const featureLabels = {
  COMPANY_READ: "Read Company",
  LEDGER_READ: "Read Ledger",
  CUSTOMER_READ: "Read Customers",
  SUPPLIER_READ: "Read Suppliers",
  STOCK_READ: "Read Stock",
  VOUCHER_READ: "Read Vouchers",
  REPORTS_READ: "Access Reports",
  CONNECTOR_STATUS: "Connector Status",
  COMMAND_CREATE: "Create Entries",
  SYNC_LEDGER: "Sync Ledgers",
  SYNC_VOUCHER: "Sync Vouchers",
  SYNC_STOCK: "Sync Stock",
  SYNC_MASTER: "Sync Masters",
};

function PriceCard({
  title,
  price,
  description,
  features,
  highlighted = false,
  seatLimit = 1,
  additionalUserPrice = 3000,
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-[24px] border-2 p-5 transition duration-300 sm:p-6 ${highlighted
        ? "border-emerald-700 bg-white shadow-[0_20px_50px_rgba(97,201,40,0.12)]"
        : "border-slate-200 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.05)]"
        }`}
    >
      {/* Popular Badge */}
      {highlighted && (
        <div className="absolute right-4 top-4 rounded-full bg-emerald-700 px-4 py-1.5 text-[9px] font-black uppercase tracking-wide text-white">
          MOST POPULAR
        </div>
      )}

      {/* Plan Header */}
      <div className="flex items-center gap-3 pr-28">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaffbf] text-[#4d9619]">
          <Zap size={23} strokeWidth={2.5} />
        </div>

        <div>
          <h3 className="text-lg font-extrabold text-slate-900">
            {title}
          </h3>

          <p className="mt-0.5 text-[11px] font-medium text-emerald-700">
            {description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mt-10">
        <div className="flex items-end gap-1">
          <span className="text-4xl font-black tracking-tight text-[#082f3f] sm:text-[40px]">
            {price}
          </span>

          <span className="mb-2 text-[10px] font-medium text-slate-500">
            /1Y
          </span>
        </div>

        <p className="mt-0.5 text-[10px] text-slate-400">
          + 18% GST at checkout
        </p>
      </div>

      {/* Choose Plan */}
      <button
        type="button"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-[#9feebd] bg-[#f3fff6] px-4 py-3 text-xs font-semibold text-emerald-700 transition hover:bg-[#eaffef]"
      >
        Choose Plan
        <ArrowRight size={15} />
      </button>

      {/* Divider */}
      <div className="my-3 h-px bg-slate-200" />

      {/* Included Header */}
      <div className="flex items-center justify-between gap-3">
        <h4 className="text-sm font-extrabold text-slate-800">
          What's included
        </h4>

        <div className="flex items-center gap-1 text-[10px] font-medium text-slate-400">
          <Users size={12} />
          {seatLimit} {seatLimit === 1 ? "User" : "Users"}
        </div>
      </div>

      {/* Features */}
      <div className="mt-4 grid grid-cols-1 gap-x-5 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <div  
            key={feature}
            className="flex min-w-0 items-start gap-1.5"
          >
            <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#ddfae8] text-emerald-600">
              <Check size={10} strokeWidth={3} />
            </span>

            <span className="text-[10px] font-medium leading-4 text-slate-600">
              {featureLabels[feature] ||
                feature
                  .replaceAll("_", " ")
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())}
            </span>
          </div>
        ))}
      </div>

      {/* Additional User */}
      <div className="mt-5 rounded-xl border border-[#d5f4de] bg-[#f5fff7] px-3 py-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold text-emerald-700">
              Additional User
            </p>

            <p className="mt-0.5 text-[9px] text-slate-500">
              Per additional user
            </p>
          </div>

          <div className="text-right">
            <span className="text-sm font-black text-slate-900">
              ₹{formatPrice(additionalUserPrice)}
            </span>

            <span className="ml-1 text-[9px] text-slate-500">
              / User
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    // <div className="hidden lg:block rounded-[30px] border border-[#dfeae3] bg-[#eef6ee] shadow-[0_20px_55px_rgba(13,58,77,0.12)] sm:p-3">
    // <div className="lg:mb-20">
    <img className="w-full h-[600px]" src={DashboardInlaptop} alt="Dashboard Preview" />
    // </div>
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
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
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

export default App;
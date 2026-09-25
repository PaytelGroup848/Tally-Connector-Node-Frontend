import React, { useState } from "react";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  Cloud,
  CreditCard,
  FileText,
  Globe2,
  Landmark,
  LayoutDashboard,
  Menu,
  MessageCircle,
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
} from "lucide-react";

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

const testimonials = [
  {
    name: "Riya Shah",
    role: "Owner, Bloom & Co.",
    quote:
      "CtrlBooks gave us instant visibility into sales, vendors, and cash flow. We made faster decisions without juggling multiple tools.",
  },
  {
    name: "Aman Verma",
    role: "Finance Manager, Northline Retail",
    quote:
      "The mobile access is a game changer. Our team can review transactions and account health from anywhere without waiting for the office desktop.",
  },
  {
    name: "Pooja Menon",
    role: "Founder, Cedar Studio",
    quote:
      "The workflow is clean, simple, and built for real business use. It feels like the dashboard was designed around how small teams actually work.",
  },
];

const planData = [
  {
    id: "6aa0ea17710906eea178f546",
    name: "Growth",
    description: "Read-Only Access",
    features: [
      "COMPANY_READ",
      "LEDGER_READ",
      "CUSTOMER_READ",
      "SUPPLIER_READ",
      "STOCK_READ",
      "VOUCHER_READ",
      "REPORTS_READ",
      "CONNECTOR_STATUS",
    ],
    seatLimit: 1,
    price: 3000,
    billingText: "/ year",
  },
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
    price: 5000,
    billingText: "/ year",
    highlighted: true,
  },
  {
    id: "6aa0ea55710906eea178f54a",
    name: "Pro Plus",
    description: "E-Way & E-Invoices",
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
      "SYNC_MASTER",
    ],
    seatLimit: 2,
    price: 7000,
    billingText: "/ year",
  },
];

const formatPrice = (value) =>
  new Intl.NumberFormat("en-IN").format(value);

function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [faqOpen, setFaqOpen] = useState(null);
  const [featuresOpen, setFeaturesOpen] = useState(false);

  const scrollTo = (id) => {
    setMobileOpen(false);
    setFeaturesOpen(false);

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

  const goToLogin = () => {
    setMobileOpen(false);
    setFeaturesOpen(false);
    window.history.pushState({}, "", "/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-50 border-b border-slate-100 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <button
            onClick={() => scrollTo("home")}
            className="flex items-center gap-2"
          >
            <img
              src="./src/assets/logo.png"
              alt="CtrlBooks Logo"
              className="h-12 w-auto object-contain"
            />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 lg:flex">
            <div className="flex items-center gap-1">
              <Phone size={16} strokeWidth={2} />

              <div className="text-sm font-semibold text-slate-700 transition hover:text-[#54ba23]">
                +91 9311472357
              </div>
            </div>

            <button
              onClick={() => scrollTo("home")}
              className="text-sm font-semibold text-slate-700 transition hover:text-[#54ba23]"
            >
              Home
            </button>

            <div className="relative">
              <button
                onClick={() =>
                  setFeaturesOpen((value) => !value)
                }
                className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-[#54ba23]"
                aria-expanded={featuresOpen}
              >
                Features

                <ChevronDown
                  size={14}
                  className={
                    featuresOpen
                      ? "rotate-180 transition"
                      : "transition"
                  }
                />
              </button>

              {featuresOpen && (
                <div className="absolute left-1/2 top-full mt-4 w-72 -translate-x-1/2 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/60">
                  {showcaseFeatures.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => scrollTo(feature.id)}
                      className="block w-full rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-slate-700 transition hover:bg-green-50 hover:text-[#54ba23]"
                    >
                      {feature.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => scrollTo("pricing")}
              className="text-sm font-semibold text-slate-700 transition hover:text-[#54ba23]"
            >
              Pricing
            </button>

            <button
              onClick={() => scrollTo("testimonials")}
              className="text-sm font-semibold text-slate-700 transition hover:text-[#54ba23]"
            >
              Testimonials
            </button>

            <button
              onClick={() => scrollTo("faq")}
              className="text-sm font-semibold text-slate-700 transition hover:text-[#54ba23]"
            >
              FAQ
            </button>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              onClick={goToLogin}
              className="rounded-xl px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              Login
            </button>

            <button
              onClick={() => scrollTo("footer")}
              className="rounded-xl bg-[#61c928] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-100 transition hover:bg-[#4fb31d]"
            >
              Get Started
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() =>
              setMobileOpen((value) => !value)
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 lg:hidden"
          >
            {mobileOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-5 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {[
                ["Home", "home"],
                ["Features", "features"],
                ["Product", "product"],
                ["Pricing", "pricing"],
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

              <div className="ml-4 border-l border-green-100 pl-3">
                <p className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-[#61c928]">
                  Feature workflows
                </p>

                {showcaseFeatures.map((feature) => (
                  <button
                    key={feature.id}
                    onClick={() => scrollTo(feature.id)}
                    className="block w-full rounded-lg px-4 py-2 text-left text-xs font-semibold text-slate-600 hover:bg-green-50 hover:text-[#54ba23]"
                  >
                    {feature.title}
                  </button>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-2 gap-3">
                <button
                  onClick={goToLogin}
                  className="rounded-xl border border-slate-200 py-3 text-sm font-bold"
                >
                  Login
                </button>

                <button
                  onClick={() => scrollTo("footer")}
                  className="rounded-xl bg-[#61c928] py-3 text-sm font-bold text-white"
                >
                  Get Started
                </button>
              </div>
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

          <div className="relative mx-auto grid max-w-7xl items-start gap-10 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:py-10">
            {/* Left */}
            <div className="max-w-xl text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-xs font-bold text-green-700">
                <span className="h-2 w-2 rounded-full bg-[#61c928]" />
                Business data on mobile & web
              </div>

              <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                <span className="block">Your business,</span>

                <span className="block text-[#58be22]">
                  Live on your fingertips.
                </span>
              </h1>

              <p className="mt-6 text-base leading-8 text-slate-600 sm:text-lg">
                Monitor your business, access accounting information and stay
                connected with your team from anywhere.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-start">
                <button
                  onClick={() => scrollTo("contact")}
                  className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#61c928] px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-green-100 transition hover:bg-[#4eaf1c]"
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

            <div className="flex items-start justify-center lg:justify-end">
              <DashboardPreview />
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
              {features.map((feature) => (
                <FeatureCard
                  key={feature.title}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>

            <FeatureShowcase />
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
              <div className="absolute inset-0 rounded-full bg-green-100/70 blur-3xl" />

              <div className="relative mx-auto max-w-md rounded-[38px] border-[8px] border-slate-900 bg-white p-3 shadow-2xl">
                <div className="mx-auto mb-3 h-1.5 w-20 rounded-full bg-slate-800" />

                <div className="rounded-[28px] bg-[#f8faf7] p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#61c928] text-white">
                        C
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500">
                          Company
                        </p>

                        <p className="text-sm font-black text-slate-800">
                          ABC Pvt Ltd
                        </p>
                      </div>
                    </div>

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                      <Bell
                        size={15}
                        className="text-slate-600"
                      />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    {[
                      ["Sales", "₹ 1,15,900"],
                      ["Receivable", "₹ 2,10,500"],
                      ["Purchase", "₹ 1,59,000"],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl bg-white p-3 shadow-sm"
                      >
                        <p className="text-[9px] text-slate-500">
                          {label}
                        </p>

                        <p className="mt-1 text-[11px] font-black text-slate-800">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-extrabold text-slate-800">
                        Create Transaction
                      </p>

                      <ArrowUpRight
                        size={16}
                        className="text-green-500"
                      />
                    </div>

                    <div className="mt-3 space-y-2">
                      {[
                        "Quotation",
                        "Sales",
                        "Receipt",
                        "Payment",
                        "Sales Order",
                        "Purchase",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <FileText size={15} />
                          </div>

                          <span className="text-xs font-bold text-slate-700">
                            {item}
                          </span>

                          <ChevronDown
                            size={14}
                            className="ml-auto text-slate-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2.5">
                    <MessageCircle
                      size={15}
                      className="text-green-600"
                    />

                    <span className="text-[10px] font-bold text-green-700">
                      Share business updates with your team
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* content */}
            <div className="order-1 lg:order-2">
              <p className="text-sm font-extrabold tracking-[0.18em] text-[#61c928]">
                MOBILE BUSINESS
              </p>

              <h2 className="mt-4 max-w-xl text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
                Run your business from wherever you are.
              </h2>

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
                className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#61c928] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#4eaf1c]"
              >
                Explore CtrlBooks
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* ================= TESTIMONIALS ================= */}
        <section
          id="testimonials"
          className="bg-slate-50 px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="TESTIMONIALS"
              title=""
              description="Teams choose CtrlBooks to simplify daily operations, stay organized, and keep financial visibility in one place."
            />

            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60"
                >
                  <div className="mb-5">
                    <p className="text-sm font-extrabold text-slate-800">
                      {testimonial.name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {testimonial.role}
                    </p>
                  </div>

                  <div className="mb-4 flex text-[#61c928]">
                    {Array.from({ length: 5 }).map(
                      (_, index) => (
                        <span key={index}>★</span>
                      )
                    )}
                  </div>

                  <p className="text-sm leading-7 text-slate-600">
                    “{testimonial.quote}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= STATS ================= */}
        <section className="bg-[#172d18] px-4 py-16 text-white sm:px-6 lg:px-8">
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

        {/* ================= PRICING ================= */}
        <section
          id="pricing"
          className="bg-white px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <SectionHeading
              eyebrow="PLANS"
              title=""
              description="Flexible access for businesses that want their data available across web and mobile."
            />

            <div className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-3">
              {planData.map((plan) => (
                <PriceCard
                  key={plan.id}
                  title={plan.name}
                  price={`₹${formatPrice(plan.price)}`}
                  description={plan.description}
                  features={plan.features}
                  highlighted={plan.highlighted}
                  billingText={plan.billingText}
                />
              ))}
            </div>
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
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[30px] bg-[#61c928] px-7 py-14 text-white shadow-2xl shadow-green-100 sm:px-12 lg:px-16">
            <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto]">
              <div>
                <p className="text-sm font-extrabold tracking-[0.18em] text-green-50">
                  GET STARTED
                </p>

                <h2 className="mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
                  Keep your business information closer to you.
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-green-50 sm:text-base">
                  Connect your business workflow with a clean web and mobile
                  experience.
                </p>
              </div>

              <button
                onClick={() => scrollTo("footer")}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-green-700 transition hover:bg-green-50"
              >
                Get Started
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
        </section>

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
            <h3 className="text-[22px] font-extrabold text-[#4fc52a]">
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
  <h3 className="text-[22px] font-extrabold text-[#4fc52a]">
    Quick Links
  </h3>

  <div className="mt-6 space-y-2">
    <button
      onClick={() => scrollTo("home")}
      className="block text-sm font-semibold text-slate-900 transition hover:text-[#4fc52a]"
    >
      Home
    </button>

    <button
      onClick={() => scrollTo("features")}
      className="block text-sm font-semibold text-slate-900 transition hover:text-[#4fc52a]"
    >
      Features
    </button>
    

    <button
      onClick={() => scrollTo("product")}
      className="block text-sm font-semibold text-slate-900 transition hover:text-[#4fc52a]"
    >
      Product
    </button>

    <button
      onClick={() => scrollTo("pricing")}
      className="block text-sm font-semibold text-slate-900 transition hover:text-[#4fc52a]"
    >
      Pricing
    </button>

    <button
      onClick={() => scrollTo("testimonials")}
      className="block text-sm font-semibold text-slate-900 transition hover:text-[#4fc52a]"
    >
      Testimonials
    </button>

    <button
      onClick={() => scrollTo("faq")}
      className="block text-sm font-semibold text-slate-900 transition hover:text-[#4fc52a]"
    >
      FAQ
    </button>

    <button
      onClick={() => scrollTo("footer")}
      className="block text-sm font-semibold text-slate-900 transition hover:text-[#4fc52a]"
    >
      Contact Us
    </button>
  </div>
</div>

          {/* Contact Us */}
          <div>
            <h3 className="text-[22px] font-extrabold text-[#4fc52a]">
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
                  className="hover:text-[#4fc52a]"
                >
                  info@clouddata.com
                </a>
              </p>

              <p className="font-semibold text-slate-700">
                Support Mobile:{" "}
                <a
                  href="tel:+91 9311472357"
                  className="hover:text-[#4fc52a]"
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
              <a
                href="#"
                className="text-slate-700 transition hover:text-[#4fc52a]"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="text-slate-700 transition hover:text-[#4fc52a]"
              >
                Terms & Conditions
              </a>

              <a
                href="#"
                className="text-slate-700 transition hover:text-[#4fc52a]"
              >
                Refund Policy
              </a>
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
      <p className="text-xs font-extrabold tracking-[0.2em] text-[#61c928]">
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
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl hover:shadow-slate-200/40">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-[#61c928] transition group-hover:bg-[#61c928] group-hover:text-white">
        <Icon size={22} />
      </div>

      <h3 className="mt-5 text-lg font-extrabold text-slate-800">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-slate-600">
        {description}
      </p>

      <div className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#61c928]">
        Learn more
        <ArrowRight size={14} />
      </div>
    </div>
  );
}

function ProductPoint({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#61c928]">
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

function FeatureShowcase() {
  return (
    <div className="mt-20 overflow-hidden border-t border-slate-200 bg-white py-16 lg:mt-28 lg:py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="BUILT FOR DAILY WORK"
          title=""
          description="Create, share, track and recover from one connected CtrlBooks workspace."
        />

        <div className="mt-16 space-y-20 lg:mt-24 lg:space-y-28">
          {showcaseFeatures.map((feature, index) => (
            <div
              key={feature.title}
              id={feature.id}
              className={`grid min-w-0 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 ${index % 2
                ? "lg:[&>div:first-child]:order-2 lg:[&>div:last-child]:order-1"
                : ""
                }`}
            >
              <div className="min-w-0">
                <ShowcaseIllustration kind={feature.kind} />
              </div>

              <div className="min-w-0 max-w-xl lg:justify-self-stretch">
                <h3 className="text-3xl font-black leading-tight text-slate-900 sm:text-4xl">
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
                  className="w-3 rounded-t bg-[#61c928]"
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
      <div className="text-[10px] font-black text-[#61c928]">
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
      <p className="text-3xl font-black text-[#8bea63]">
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

function PriceCard({
  title,
  price,
  description,
  features,
  highlighted = false,
  billingText = "/ month",
}) {
  return (
    <div
      className={`relative flex h-full flex-col rounded-[26px] border p-6 transition duration-300 ${highlighted
        ? "border-[#61c928] bg-[#f7fff3] shadow-[0_18px_45px_rgba(97,201,40,0.14)]"
        : "border-slate-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
        }`}
    >
      {highlighted && (
        <div className="absolute right-5 top-5 inline-flex items-center justify-center rounded-full bg-[#61c928] px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg shadow-green-100">
          Popular
        </div>
      )}

      <div className="mb-6 flex items-center justify-between gap-3">
        <p className="text-lg font-extrabold text-slate-800">
          {title}
        </p>
      </div>

      <div className="mb-4 flex items-end gap-1">
        <span className="text-4xl font-black tracking-tight text-slate-900">
          {price}
        </span>

        {price !== "Custom" && (
          <span className="mb-1 text-xs font-semibold text-slate-500">
            {billingText}
          </span>
        )}
      </div>

      <p className="min-h-[48px] text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="my-6 h-px bg-slate-200" />

      <div className="space-y-3">
        {features.map((feature) => (
          <div
            key={feature}
            className="flex items-start gap-2.5"
          >
            <Check
              size={16}
              className="mt-0.5 shrink-0 text-[#61c928]"
            />

            <span className="text-xs font-medium leading-6 text-slate-600">
              {feature}
            </span>
          </div>
        ))}
      </div>

      <button
        className={`mt-auto w-full rounded-xl py-3 text-sm font-bold transition ${highlighted
          ? "bg-[#61c928] text-white hover:bg-[#4eaf1c]"
          : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
      >
        Choose plan
      </button>
    </div>
  );
}

function DashboardPreview() {
  return (
    <div className="w-full max-w-[640px] rounded-[30px] border border-[#dfeae3] bg-[#eef6ee] p-2 shadow-[0_20px_55px_rgba(13,58,77,0.12)] sm:p-3">
      <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
        <div className="flex min-h-[320px] sm:min-h-[410px]">
          <aside className="w-[112px] shrink-0 bg-[#082f3f] p-2 text-white sm:w-[190px] sm:p-3">
            <div className="mb-5 flex items-center justify-center px-1 pt-1 sm:mb-6 sm:justify-start sm:px-2">
              <img
                src="./src/assets/logo.png"
                alt="CtrlBooks"
                className="h-auto w-[92px] object-contain sm:w-[148px]"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              {[
                "Dashboard",
                "Create Vouchers",
                "Sales",
                "Purchase",
                "Cash & Bank",
                "Collect Payments",
                "Parties",
                "Items",
                "Reports",
              ].map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center justify-between rounded-lg px-2 py-2 text-[9px] font-medium leading-tight sm:rounded-xl sm:px-3 sm:py-2.5 sm:text-xs ${index === 0
                    ? "bg-[#1db88b] text-white shadow-inner"
                    : "text-slate-200 hover:bg-white/5"
                    }`}
                >
                  <span>{item}</span>

                  {index > 1 && index < 8 && (
                    <span className="text-xs text-slate-300">
                      ›
                    </span>
                  )}
                </div>
              ))}
            </div>
          </aside>

          <main className="min-w-0 flex-1 bg-[#f4f6f5] p-2 sm:p-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 sm:pb-3">
              <div className="min-w-0 text-[9px] text-slate-500 sm:text-xs">
                <span className="block truncate font-semibold text-slate-700">
                  Annual Agency - 2022-2023
                </span>
              </div>

              <div className="hidden shrink-0 items-center gap-2 md:flex">
                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
                  Link invoice
                </button>

                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
                  Mobile version
                </button>

                <button className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600">
                  Connector status
                </button>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 sm:mt-5">
              <h3 className="text-xl font-black tracking-tight text-slate-900 sm:text-3xl">
                Dashboard
              </h3>

              <button className="inline-flex min-w-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[9px] font-medium text-slate-700 shadow-sm sm:gap-2 sm:rounded-xl sm:px-3 sm:py-2 sm:text-xs">
                <span className="text-xs sm:text-base">
                  Date
                </span>

                <span className="truncate">
                  22-08-26 - 22-09-26
                </span>
              </button>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2 sm:mt-5 sm:gap-3 2xl:grid-cols-4">
              {[
                ["Total Sales", "₹ 2.39L", ArrowUpRight],
                ["Total Receipts", "₹ 12.33K", Receipt],
                ["Total Payments", "₹ 599", CreditCard],
                [
                  "Cash & Bank Balance",
                  "₹ 29.72K",
                  Landmark,
                ],
              ].map(([label, value, Icon]) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm sm:rounded-2xl sm:p-3.5"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-50 text-green-600 sm:h-8 sm:w-8">
                      <Icon
                        size={15}
                        strokeWidth={1.75}
                      />
                    </div>
                  </div>

                  <div className="text-[9px] font-medium leading-tight text-slate-500 sm:text-xs">
                    {label}
                  </div>

                  <div className="mt-1 whitespace-nowrap text-[clamp(0.75rem,1.8vw,1.5rem)] font-black tracking-tight text-slate-900 sm:mt-2">
                    {value}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-2 sm:mt-5 sm:grid-cols-[1.5fr_1fr] sm:gap-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
                <div className="mb-3 text-sm font-extrabold text-slate-900 sm:mb-4 sm:text-xl">
                  Sales &amp; Receipts
                </div>

                <div className="flex items-center gap-3 text-[9px] text-slate-500 sm:text-xs">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#1db88b]" />
                    Sales
                  </span>

                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-300" />
                    Receipts
                  </span>
                </div>

                <div className="mt-3 flex h-24 items-end gap-2 sm:mt-4 sm:h-40 sm:gap-3">
                  {[45, 62, 38, 56, 72, 51, 66].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="flex w-full flex-col items-center gap-2"
                      >
                        <div
                          className="w-full rounded-t-xl bg-[#1db88b]"
                          style={{
                            height: `${height}%`,
                          }}
                        />

                        <div className="text-[7px] text-slate-400 sm:text-[10px]">
                          {
                            [
                              "27-08-26",
                              "01-09-26",
                              "09-09-26",
                              "10-09-26",
                              "11-09-26",
                              "12-09-26",
                              "15-09-26",
                            ][index]
                          }
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-4">
                <div className="mb-3 text-sm font-extrabold text-slate-900 sm:mb-4 sm:text-xl">
                  Receivables
                </div>

                <div className="mx-auto mt-3 flex h-24 w-24 items-center justify-center rounded-full border-[8px] border-[#1db88b] bg-[#f2f9f6] text-center text-xs font-black text-slate-900 sm:mt-4 sm:h-36 sm:w-36 sm:border-[12px] sm:text-sm">
                  <div>
                    <div className="text-sm sm:text-xl">
                      ₹ 2.47L
                    </div>

                    <div className="text-[8px] text-slate-500 sm:text-[10px]">
                      Total Outstanding
                    </div>
                  </div>
                </div>

                <div className="mt-3 space-y-1 text-[9px] text-slate-600 sm:mt-5 sm:space-y-2 sm:text-xs">
                  {[
                    ["0-30", "₹ 2.47L"],
                    ["31-60", "₹ 0"],
                    ["61-90", "₹ 0"],
                    ["91-120", "₹ 0"],
                    ["> 120", "₹ 0"],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex items-center justify-between rounded-lg bg-slate-50 px-2 py-1 sm:py-1.5"
                    >
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#1db88b]" />
                        {label}
                      </span>

                      <span className="font-semibold text-slate-700">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
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
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-900 text-slate-900 transition hover:border-[#4fc52a] hover:bg-[#4fc52a] hover:text-white"
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
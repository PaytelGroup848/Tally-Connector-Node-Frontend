import invoiceFeatureImage from "../../assets/Control-Books-Website-Image-2 (7).png";
import inactiveFeatureImage from "../../assets/Control-Books-Website-Image-3 (2).png";
import reminderFeatureImage from "../../assets/Control-Books-Website-Image-4 (2).png";
import backupFeatureImage from "../../assets/Control-Books-Website-Image-5 (1).png";
import gstFeatureImage from "../../assets/Control-Books-Website-Image-6 (3).png";
import reportsFeatureImage from "../../assets/Control-Books-Website-Image-7 (2).png";
import { showcaseFeatures } from "./data";
import { SectionHeading } from "./LandingPrimitives";

export default function FeatureShowcase({ activeFeature }) {
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

export function LeadCapture() {
  return (
    <div>



    </div>
  );
}

export function ShowcaseIllustration({ kind }) {
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

export function ShowcasePaper({ title }) {
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

export function ShowcasePerson({ name }) {
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

export function DarkStat({
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

import { features, formatPrice, planData, showcaseFeatures } from "./data";
import { FeatureCard, SectionHeading } from "./LandingPrimitives";
import FeatureShowcase from "./FeatureShowcase";
import PriceCard from "./PriceCard";

export default function FeaturesPricingSection({ activeFeature, setActiveFeature }) {
  return (
    <>
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
              className="bg-[#f7fbf7] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28"
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
            />
          </div>
        </section>


    </>
  );
}

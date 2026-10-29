import { ArrowRight, Bell, Monitor, Smartphone } from "lucide-react";
import mobileScreen from "../../assets/Control-Books-Mobile-Screen-Website-Image-1.webp";
import { ProductPoint } from "./LandingPrimitives";

export default function ProductSection({ scrollTo }) {
  return (
    <>
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
                loading="lazy"
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



    </>
  );
}

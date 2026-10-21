import { DarkStat } from "./FeatureShowcase";

export default function StatsSection() {
  return (
    <>
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



    </>
  );
}

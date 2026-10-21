import { testimonialImages } from "./data";
import { SectionHeading } from "./LandingPrimitives";

export default function TestimonialsSection() {
  return (
    <>
        {/* ================= TESTIMONIALS ================= */}
        <section id="testimonials" className="bg-slate-50">
          <div className="pt-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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


    </>
  );
}

import { Phone } from "lucide-react";

export default function SidebarHelp({ collapsed }) {
  return (
    <>
      {!collapsed && (
        <div
          className="
            relative
            z-10

            mx-3
            mb-4

            flex
            min-h-[52px]
            shrink-0
            items-center
            gap-3

            rounded-xl

            bg-emerald-700

            px-3
            py-2.5
          "
        >
          {/* Phone */}

          <div
            className="
              flex
              h-8
              w-8
              shrink-0

              items-center
              justify-center

              rounded-lg

              text-white
            "
          >
            <Phone
              size={17}
              strokeWidth={2}
            />
          </div>

          {/* Help text */}

          <div
            className="
              flex
              min-w-0
              flex-1
              flex-col
            "
          >
            <p
              className="
                m-0

                text-[13px]
                font-medium
                leading-4

                text-white
              "
            >
              Need help?
            </p>

            <a
              href="tel:+919311472357"
              className="
                mt-0.5

                block
                truncate

                text-[13px]
                font-bold
                leading-4

                text-white
                no-underline

                hover:text-white
              "
            >
              +91 9311472357
            </a>
          </div>
        </div>
      )}
    </>
  );
}

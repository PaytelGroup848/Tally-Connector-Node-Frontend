import { X } from "lucide-react";
import logo from "../../assets/Control-Books-Dashboard.png";
import smallLogo from "../../assets/logo.png";

export default function SidebarHeader({ collapsed, isCompact, setSidebarCollapsed, closeAllDropdowns, onDashboard, closeOnMobile }) {
  return (
    <>
      {isCompact && !collapsed && (
        <div
          className="
            relative
            z-10

            flex
            h-10
            min-h-10
            shrink-0
            items-center
            justify-end

            bg-[#0A1128]

            px-3
          "
        >
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() =>
              setSidebarCollapsed(true)
            }
            className="
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center

              rounded-lg

              border
              border-slate-200

              bg-[#0A1128]

              text-slate-300

              outline-none

              hover:border-slate-300
              hover:bg-[#101A36]
              hover:text-white
            "
          >
            <X className="h-4 w-4 shrink-0" />
          </button>
        </div>
      )}

      {/* =====================================================
          LOGO
      ====================================================== */}

      <div
        className={`
          relative
          z-10

          flex
          h-[68px]
          min-h-[68px]
          w-full
          shrink-0

          items-center
          justify-center

          bg-[#0A1128]

          ${collapsed ? "" : "px-4"}
        `}
      >
        <button
          type="button"
          onClick={(event) => {
            closeAllDropdowns();

            onDashboard(event);
            closeOnMobile();
          }}
          aria-label="Go to dashboard"
          className="
            flex
            h-full
            shrink-0
            items-center
            justify-center

            border-0
            bg-transparent
            p-0

            outline-none
          "
        >
          <img
            src={collapsed ? smallLogo : logo}
            alt="CtrlBooks logo"
            className={`
              block
              shrink-0
              object-contain

              ${
                collapsed
                  ? "h-10 w-10"
                  : "ml-4 h-[85%] w-[85%]"
              }
            `}
          />
        </button>
      </div>
    </>
  );
}

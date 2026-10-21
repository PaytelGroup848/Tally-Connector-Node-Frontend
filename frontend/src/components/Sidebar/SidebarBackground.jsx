export default function SidebarBackground() {
  return (
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        {/* Main background */}

        <div
          className="
            absolute
            inset-0
            bg-[#0A1128]
          "
        />

        {/* Top left */}

        <div
          className="
            absolute
            -left-24
            -top-24
            h-64
            w-64
            rounded-full
            bg-[#0A1128]
            blur-[72px]
          "
        />

        {/* Top right */}

        <div
          className="
            absolute
            -right-24
            top-20
            h-56
            w-56
            rounded-full
            bg-blue-400/[0.025]
            blur-[80px]
          "
        />

        {/* Bottom left */}

        <div
          className="
            absolute
            -bottom-24
            -left-20
            h-72
            w-72
            rounded-full
            bg-blue-300/[0.035]
            blur-[80px]
          "
        />

        {/* Bottom right */}

        <div
          className="
            absolute
            -bottom-20
            -right-28
            h-64
            w-64
            rounded-full
            bg-[#0A1128]
            blur-[80px]
          "
        />

        {/* Diagonal reflection */}

        <div
          className="
            absolute
            -left-[32%]
            top-0
            h-full
            w-[52%]
            rotate-[14deg]
            blur-[10px]
          "
        />
      </div>
  );
}

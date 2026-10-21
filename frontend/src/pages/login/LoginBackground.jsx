export default function LoginBackground() {
  return (
      <div
        className="
          pointer-events-none absolute
          inset-0 z-0 overflow-hidden"
      >
        {/* Soft mint base */}
        <div
          className="
            absolute inset-[-3%]
            bg-[radial-gradient(circle_at_20%_20%,rgba(126,229,202,0.28),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(77,190,218,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(81,214,174,0.18),transparent_36%),linear-gradient(180deg,#dff8f3_0%,#f7fbfb_48%,#eefbf8_100%)]"
        />

        {/* Top-left flowing light band */}
        <div
          className="
            absolute left-[-34%] top-[-16%] h-[42%] w-[115%]
            rotate-[-20deg] rounded-[50%] border-[18px] border-white/65"
        />

        <div
          className="
            absolute left-[-40%] top-[-11%] h-[38%] w-[112%] rotate-[-20deg]
            rounded-[50%] border-[6px] border-white/80 shadow-[0_0_28px_rgba(255,255,255,0.9)]"
        />

        {/* Top-right mint glow */}
        <div
          className="
            absolute -right-20 top-16 h-48 w-48
            rounded-full bg-[#8de7cf]/30 blur-3xl"
        />

        {/* Left floating glow */}
        <div
          className="
            absolute -left-16 top-[25%] h-36 w-36
            rounded-full bg-[#78d6bf]/25 blur-2xl"
        />

        {/* Large center/bottom sweeping wave */}
        <div
          className="
            absolute left-[-24%] bottom-[-18%] h-[48%] w-[150%] rotate-[8deg]
            rounded-[50%] border-[14px] border-white/55 shadow-[0_0_30px_rgba(255,255,255,0.55)]"
        />

        <div
          className="
            absolute left-[-31%] bottom-[-12%] h-[44%] w-[146%]
            rotate-[10deg] rounded-[50%] border-[5px] border-white/75"
        />

        <div
          className="
            absolute right-[-46%] bottom-[-7%] h-[40%] w-[120%]
            rotate-[-18deg] rounded-[50%] border-[10px] border-[#b7efe1]/55"
        />

        {/* =================================================
            STATIC GLASS BUBBLES
        ================================================== */}

        <div
          className="
            absolute left-[7%] top-[27%] h-14 w-14 rounded-full border bg-white/20
            border-white/80 shadow-[0_0_30px_rgba(255,255,255,0.6)] backdrop-blur-sm"
        />

        <div
          className="
            absolute right-[8%] top-[10%] h-11 w-11
            rounded-full bg-[#8de7cf]/18 blur-[2px]"
        />

        <div
          className="
            absolute left-[4%] bottom-[25%] h-12
            w-12 rounded-full bg-[#a6f1df]/25 blur-sm"
        />

        <div
          className="
            absolute right-[9%] bottom-[16%] h-16 w-16 rounded-full border
            border-white/75 bg-white/18 shadow-[0_0_34px_rgba(255,255,255,0.6)] backdrop-blur-sm"
        />

        {/* =================================================
            STATIC PARTICLES
        ================================================== */}

        <span
          className="
            absolute left-[9%] top-[13%] h-2 w-2 rounded-full
            bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
        />

        <span
          className="
            absolute right-[13%] top-[24%] h-2.5 w-2.5 bg-white/90
            rounded-full shadow-[0_0_14px_rgba(255,255,255,0.95)]"
        />

        <span
          className="
            absolute left-[23%] bottom-[17%] h-2 w-2 bg-white
            rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
        />

        <span
          className="
            absolute right-[23%] bottom-[27%] h-2.5 w-2.5
            rounded-full bg-white/95 shadow-[0_0_14px_rgba(255,255,255,0.95)]"
        />

        <span
          className="
            absolute right-[5%] bottom-[9%] h-2 w-2 bg-white
            rounded-full shadow-[0_0_12px_rgba(255,255,255,0.9)]"
        />

        {/* Soft highlight */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_50%_4%,rgba(255,255,255,0.92),transparent_28%),radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.42),transparent_48%),radial-gradient(circle_at_50%_100%,rgba(177,241,226,0.36),transparent_42%)]"
        />
      </div>
  );
}

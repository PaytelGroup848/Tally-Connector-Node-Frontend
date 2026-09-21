import { useState } from "react";
import {
  ArrowRight,
  Check,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import logo from "../assets/logoFull.png";
import { sendOtp, verifyOtp } from "../services/authApi";
import useAuthStore from "../store/authStore";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSendOtp = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;

    setLoading(true);
    setMessage("");

    try {
      const data = await sendOtp(trimmedEmail);
      setOtpSent(true);
      setMessage(data?.message || "OTP sent successfully. Please enter the code below.");
    } catch (error) {
      setMessage(error.message || "Unable to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp) return;

    setLoading(true);
    setMessage("");

    try {
      const data = await verifyOtp({ email: trimmedEmail, otp: trimmedOtp });
      const accessToken = data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token;

      if (!accessToken) {
        throw new Error("No access token returned after OTP verification.");
      }

      setAuth({
        accessToken,
        user: {
          email: trimmedEmail,
          ...(data?.user || {}),
        },
      });
    } catch (error) {
      setMessage(error.message || "OTP verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-white font-sans text-[#0a2a4a]">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">

        {/* =========================================================
            LEFT MARKETING SECTION
        ========================================================== */}
        <section
          className="
            relative
            hidden
            w-full
            overflow-hidden
            bg-[#eefaff]
            lg:flex
            lg:min-h-screen
            lg:w-[62%]
            lg:flex-col
            lg:px-12
            xl:px-16
          "
        >
          {/* Base gradient */}
          <div
            className="
              absolute
              inset-0
              bg-[linear-gradient(135deg,#ffffff_0%,#f8fdff_30%,#eefaff_65%,#dff7fb_100%)]
            "
          />

          {/* Large diagonal bands - Razorpay style */}
          <div
            className="
              pointer-events-none
              absolute
              -right-[16%]
              top-[-10%]
              h-[125%]
              w-[32%]
              rotate-[19deg]
              bg-gradient-to-b
              from-[#d6f5ff]
              via-[#bce9ff]
              to-[#def7f5]
              opacity-80
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-[1%]
              top-[-15%]
              h-[135%]
              w-[16%]
              rotate-[19deg]
              bg-gradient-to-b
              from-[#c7efff]
              via-[#d8f2ff]
              to-[#b9f2eb]
              opacity-90
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              right-[-7%]
              top-[-10%]
              h-[125%]
              w-[8%]
              rotate-[19deg]
              bg-white/70
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              left-[-8%]
              bottom-[-18%]
              h-[55%]
              w-[30%]
              rotate-[18deg]
              rounded-[50%]
              bg-gradient-to-br
              from-[#dffcff]
              to-[#b5e9ff]
              opacity-70
              blur-[2px]
            "
          />

          
        </section>

        {/* =========================================================
            RIGHT LOGIN SECTION
        ========================================================== */}
        <aside
          className="
            relative
            flex
            min-h-screen
            w-full
            flex-col
            overflow-hidden
            bg-white
            px-5
            py-6
            sm:px-8
            lg:w-[38%]
            lg:px-12
            lg:py-10
            xl:px-16
          "
        >
          {/* 0% Platform Fees ribbon */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-55px]
              top-5
              rotate-[28deg]
              bg-[#edf0f4]
              px-14
              py-2
              text-[0.9rem]
              font-semibold
              text-[#2d6cb1]
              shadow-[0_2px_8px_rgba(0,0,0,0.03)]
            "
          >
            0% Platform Fees
          </div>

          {/* Decorative top-right shape */}
          <div
            className="
              pointer-events-none
              absolute
              right-[-80px]
              top-[-80px]
              h-[220px]
              w-[220px]
              rounded-full
              bg-[#effbff]
            "
          />

          {/* Login content */}
          <div
            className="
              relative
              z-10
              mx-auto
              flex
              w-full
              max-w-[420px]
              flex-1
              flex-col
              justify-center
              pt-2
            "
          >
            {/* Logo */}
            <div className="mb-4 flex items-center justify-center">
              <img src={logo} alt="CtrlBooks logo" className="h-50 w-auto object-contain sm:h-50 lg:h-60 xl:h-60" />
            </div>

            {/* Heading */}
            <h2
              className="
                text-[2rem]
                font-black
                leading-[1.05]
                tracking-[-0.055em]
                text-[#152f49]
                sm:text-[2.35rem]
              "
            >
              {otpSent ? "Enter OTP" : "Login to continue"}
            </h2>

            {message && (
              <div className="mt-4 rounded-lg border border-[#d8ebff] bg-[#f4f9ff] px-3 py-2 text-xs text-[#3a5e8a] justify-center align-center flex items-center gap-2">
                {message}
              </div>
            )}

            {/* Form */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="mt-7">
                <label
                  className="
                    block
                    text-[0.92rem]
                    font-semibold
                    text-[#213d59]
                  "
                >
                  Email Address

                  <div className="relative mt-2">
                    <Mail
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        h-5
                        w-5
                        -translate-y-1/2
                        text-[#879aae]
                      "
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email address"
                      disabled={loading}
                      className="
                        h-14
                        w-full
                        rounded-lg
                        border
                        border-[#d5dee8]
                        bg-white
                        pl-11
                        pr-4
                        text-[0.96rem]
                        text-[#243b53]
                        placeholder:text-[#a7b5c5]
                        outline-none
                        transition
                        focus:border-[#4d8cff]
                        focus:ring-2
                        focus:ring-[#dce8ff]
                        disabled:opacity-60
                      "
                    />
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-5
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    bg-gradient-to-r
                    from-[#16be89]
                    to-[#1677ed]
                    text-[0.96rem]
                    font-bold
                    text-white
                    shadow-[0_8px_18px_rgba(20,152,190,0.14)]
                    transition
                    hover:brightness-105
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Sending..." : "Continue"}
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="mt-7">
                <label className="block text-[0.92rem] font-semibold text-[#213d59]">
                  OTP
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter 6 digit OTP"
                    disabled={loading}
                    className="mt-2 h-14 w-full rounded-lg border border-[#d5dee8] bg-white px-4 text-[1.1rem] text-[#243b53] placeholder:text-[#a7b5c5] outline-none transition focus:border-[#4d8cff] focus:ring-2 focus:ring-[#dce8ff] disabled:opacity-60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-5
                    flex
                    h-12
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    bg-gradient-to-r
                    from-[#16be89]
                    to-[#1677ed]
                    text-[0.96rem]
                    font-bold
                    text-white
                    shadow-[0_8px_18px_rgba(20,152,190,0.14)]
                    transition
                    hover:brightness-105
                    active:scale-[0.99]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                  {!loading && <Check className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setOtp("");
                  }}
                  className="mt-3 w-full rounded-lg border border-[#d5dee8] bg-white px-4 py-3 text-sm font-medium text-[#213d59] transition hover:bg-[#f5f9ff]"
                >
                  Use a different email
                </button>
              </form>
            )}

            <div className="mt-6 flex items-center gap-3 text-[#8493a4]">
            </div>    
          </div>
        </aside>
      </div>
    </main>
  );
};

export default LoginPage;
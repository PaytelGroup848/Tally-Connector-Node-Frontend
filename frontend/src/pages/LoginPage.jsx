import { useState } from "react";
import {
  ArrowRight,
  Check,
  Mail,
} from "lucide-react";
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
      await sendOtp(trimmedEmail);
      setOtpSent(true);
      setMessage(`OTP sent to ${trimmedEmail}`);
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
    <main className="min-h-screen overflow-hidden bg-[#f5f8fc] font-sans text-[#102a43]">
      <div className="flex min-h-screen w-full flex-col lg:flex-row">

        {/* =========================================================
            LEFT MARKETING SECTION
        ========================================================== */}
        <section
          className="
            relative
            w-full
            overflow-hidden
            bg-[#3828bd]
            lg:flex
            lg:min-h-screen
            lg:w-[60%]
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
              bg-[#3828bd]
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
              hidden
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
              hidden
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
              hidden
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
              hidden
            "
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden bg-[#2FA66F]">
            <div className="absolute -left-24 bottom-[-18%] h-[115%] w-[78%] rotate-[23deg] rounded-[48%] border border-white/10" />
            <div className="absolute -left-12 bottom-[-16%] h-[110%] w-[68%] rotate-[23deg] rounded-[48%] border border-white/10" />
            <div className="absolute left-8 bottom-[-15%] h-[104%] w-[58%] rotate-[23deg] rounded-[48%] border border-white/10" />
          </div>

          <div className="relative z-10 flex flex-1 flex-col justify-between py-10 text-white sm:py-14 lg:py-16">
          </div>
          
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
            bg-[#f5f8fc]
            px-5
            py-6
            sm:px-8
            lg:w-[40%]
            lg:px-12
            lg:py-10
            xl:px-16
          "
        >
          {/* 0% Platform Fees ribbon */}
          <div
            className="
              hidden
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
              hidden
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
              items-center
              justify-center
              pt-2
            "
          >
            {/* Logo */}
            <div className="mb-10 flex h-12 w-full items-center justify-center overflow-hidden">
              <img src={logo} alt="CtrlBooks logo" className="block h-auto w-[190px] max-w-full object-contain object-left" />
            </div>

            {/* Heading */}
            <h2
              className="
                text-[1.8rem]
                font-bold
                leading-[1.05]
                tracking-tight
                text-center text-[#092f52]
                sm:text-[2rem]
              "
            >
              {otpSent ? "Enter OTP" : "Login to continue"}
            </h2>

            <p className="mt-3 max-w-[300px] text-center text-sm leading-5 text-[#61758a]">
              {otpSent ? "Use the verification code sent to your email." : "Enter your email to receive a secure one-time login code."}
            </p>

            {message && (
              <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#dce5ee] bg-white px-3 py-2 text-xs text-[#61758a]">
                {message}
              </div>
            )}

            {/* Form */}
            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="mt-7 w-full">
                <label
                  className="
                    block
                    text-[0.92rem]
                    font-semibold
                    text-[#102a43]
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
                        text-[#8ba0b3]
                      "
                    />

                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="Enter your email address"
                      disabled={loading}
                      className="
                        h-11
                        w-full
                        rounded-lg
                        border
                        border-[#dce5ee]
                        bg-white
                        pl-11
                        pr-4
                        text-[0.96rem]
                        text-[#243b53]
                        placeholder:text-[#a7b5c5]
                        outline-none
                        transition
                        focus:border-[#10a66f]
                        focus:ring-2
                        focus:ring-[#d9f4e9]
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
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-md
                    bg-[#10a66f]
                    text-[0.96rem]
                    font-bold
                    text-white
                    shadow-[0_8px_18px_rgba(16,166,111,0.18)]
                    transition
                    hover:bg-[#0b935f]
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
              <form onSubmit={handleVerifyOtp} className="mt-7 w-full">
                <label className="block text-[0.92rem] font-semibold text-[#102a43]">
                  OTP
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
                    placeholder="Enter OTP"
                    disabled={loading}
                    className="mt-2 h-11 w-full rounded-md border border-[#dce5ee] bg-white px-4 text-[1.1rem] text-[#102a43] placeholder:text-[#8ba0b3] outline-none transition focus:border-[#10a66f] focus:ring-2 focus:ring-[#d9f4e9] disabled:opacity-60"
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-5
                    flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-md
                    bg-[#10a66f]
                    text-[0.96rem]
                    font-bold
                    text-white
                    shadow-[0_8px_18px_rgba(16,166,111,0.18)]
                    transition
                    hover:bg-[#0b935f]
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
                  className="mt-3 w-full rounded-lg border border-[#dce5ee] bg-white px-4 py-3 text-sm font-medium text-[#102a43] transition hover:bg-[#edf7f2]"
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
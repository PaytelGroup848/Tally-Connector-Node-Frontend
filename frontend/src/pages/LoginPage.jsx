import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  Mail,
  ShieldCheck,
  LockKeyhole,
  Headphones,
} from "lucide-react";

import logo from "../assets/logo.png";
import logoFull from "../assets/logoFull.png";
import { sendOtp, verifyOtp } from "../services/authApi";
import useAuthStore from "../store/authStore";
import {
  getOtpResendState,
  OTP_RESEND_SECONDS,
} from "../utils/otpUtils";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resendSeconds, setResendSeconds] = useState(0);

  const setAuth = useAuthStore((state) => state.setAuth);

  // =========================================================
  // OTP RESEND TIMER
  // =========================================================

  useEffect(() => {
    if (!otpSent || resendSeconds <= 0) {
      if (!otpSent) {
        setResendSeconds(0);
      }

      return;
    }

    const timer = setTimeout(() => {
      setResendSeconds((current) =>
        Math.max(0, current - 1),
      );
    }, 1000);

    return () => clearTimeout(timer);
  }, [otpSent, resendSeconds]);

  // =========================================================
  // SEND OTP
  // =========================================================

  const handleSendOtp = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await sendOtp(trimmedEmail);

      setOtpSent(true);
      setOtp("");
      setResendSeconds(OTP_RESEND_SECONDS);
      setMessage(`OTP sent to ${trimmedEmail}`);
    } catch (error) {
      setMessage(
        error.message ||
        "Unable to send OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESEND OTP
  // =========================================================

  const handleResendOtp = async () => {
    const trimmedEmail = email.trim();

    if (
      !trimmedEmail ||
      loading ||
      resendSeconds > 0
    ) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await sendOtp(trimmedEmail);

      setOtp("");
      setResendSeconds(OTP_RESEND_SECONDS);
      setMessage(`OTP resent to ${trimmedEmail}`);
    } catch (error) {
      setMessage(
        error.message ||
        "Unable to resend OTP. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VERIFY OTP
  // =========================================================

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    const trimmedEmail = email.trim();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail || !trimmedOtp) {
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const data = await verifyOtp({
        email: trimmedEmail,
        otp: trimmedOtp,
      });

      const accessToken =
        data?.accessToken ||
        data?.token ||
        data?.data?.accessToken ||
        data?.data?.token;

      if (!accessToken) {
        throw new Error(
          "No access token returned after OTP verification.",
        );
      }

      setAuth({
        accessToken,
        user: {
          email: trimmedEmail,
          ...(data?.user || {}),
        },
      });
    } catch (error) {
      setMessage(
        error.message ||
        "OTP verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DIFFERENT EMAIL
  // =========================================================

  const handleDifferentEmail = () => {
    setOtpSent(false);
    setOtp("");
    setResendSeconds(0);
    setMessage("");
  };

  return (
    <main
      className="
        relative
        z-0
        min-h-screen
        overflow-hidden
        bg-[#f1fbf8]
        font-sans
        text-[#102a43]
      "
    >
      {/* =====================================================
          STATIC BACKGROUND
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-0
          overflow-hidden
        "
      >
        {/* Soft mint base */}
        <div
          className="
            absolute
            inset-[-3%]

            bg-[radial-gradient(circle_at_20%_20%,rgba(126,229,202,0.28),transparent_28%),radial-gradient(circle_at_80%_35%,rgba(77,190,218,0.16),transparent_30%),radial-gradient(circle_at_50%_90%,rgba(81,214,174,0.18),transparent_36%),linear-gradient(180deg,#dff8f3_0%,#f7fbfb_48%,#eefbf8_100%)]
          "
        />

        {/* Top-left flowing light band */}
        <div
          className="
            absolute
            left-[-34%]
            top-[-16%]

            h-[42%]
            w-[115%]

            rotate-[-20deg]

            rounded-[50%]

            border-[18px]
            border-white/65
          "
        />

        <div
          className="
            absolute
            left-[-40%]
            top-[-11%]

            h-[38%]
            w-[112%]

            rotate-[-20deg]

            rounded-[50%]

            border-[6px]
            border-white/80

            shadow-[0_0_28px_rgba(255,255,255,0.9)]
          "
        />

        {/* Top-right mint glow */}
        <div
          className="
            absolute
            -right-20
            top-16

            h-48
            w-48

            rounded-full

            bg-[#8de7cf]/30

            blur-3xl
          "
        />

        {/* Left floating glow */}
        <div
          className="
            absolute
            -left-16
            top-[25%]

            h-36
            w-36

            rounded-full

            bg-[#78d6bf]/25

            blur-2xl
          "
        />

        {/* Large center/bottom sweeping wave */}
        <div
          className="
            absolute
            left-[-24%]
            bottom-[-18%]

            h-[48%]
            w-[150%]

            rotate-[8deg]

            rounded-[50%]

            border-[14px]
            border-white/55

            shadow-[0_0_30px_rgba(255,255,255,0.55)]
          "
        />

        <div
          className="
            absolute
            left-[-31%]
            bottom-[-12%]

            h-[44%]
            w-[146%]

            rotate-[10deg]

            rounded-[50%]

            border-[5px]
            border-white/75
          "
        />

        <div
          className="
            absolute
            right-[-46%]
            bottom-[-7%]

            h-[40%]
            w-[120%]

            rotate-[-18deg]

            rounded-[50%]

            border-[10px]
            border-[#b7efe1]/55
          "
        />

        {/* =================================================
            STATIC GLASS BUBBLES
        ================================================== */}

        <div
          className="
            absolute
            left-[7%]
            top-[27%]

            h-14
            w-14

            rounded-full

            border
            border-white/80

            bg-white/20

            shadow-[0_0_30px_rgba(255,255,255,0.6)]

            backdrop-blur-sm
          "
        />

        <div
          className="
            absolute
            right-[8%]
            top-[10%]

            h-11
            w-11

            rounded-full

            bg-[#8de7cf]/18

            blur-[2px]
          "
        />

        <div
          className="
            absolute
            left-[4%]
            bottom-[25%]

            h-12
            w-12

            rounded-full

            bg-[#a6f1df]/25

            blur-sm
          "
        />

        <div
          className="
            absolute
            right-[9%]
            bottom-[16%]

            h-16
            w-16

            rounded-full

            border
            border-white/75

            bg-white/18

            shadow-[0_0_34px_rgba(255,255,255,0.6)]

            backdrop-blur-sm
          "
        />

        {/* =================================================
            STATIC PARTICLES
        ================================================== */}

        <span
          className="
            absolute
            left-[9%]
            top-[13%]

            h-2
            w-2

            rounded-full

            bg-white

            shadow-[0_0_12px_rgba(255,255,255,0.9)]
          "
        />

        <span
          className="
            absolute
            right-[13%]
            top-[24%]

            h-2.5
            w-2.5

            rounded-full

            bg-white/90

            shadow-[0_0_14px_rgba(255,255,255,0.95)]
          "
        />

        <span
          className="
            absolute
            left-[23%]
            bottom-[17%]

            h-2
            w-2

            rounded-full

            bg-white

            shadow-[0_0_12px_rgba(255,255,255,0.9)]
          "
        />

        <span
          className="
            absolute
            right-[23%]
            bottom-[27%]

            h-2.5
            w-2.5

            rounded-full

            bg-white/95

            shadow-[0_0_14px_rgba(255,255,255,0.95)]
          "
        />

        <span
          className="
            absolute
            right-[5%]
            bottom-[9%]

            h-2
            w-2

            rounded-full

            bg-white

            shadow-[0_0_12px_rgba(255,255,255,0.9)]
          "
        />

        {/* Soft highlight */}
        <div
          className="
            absolute
            inset-0

            bg-[radial-gradient(circle_at_50%_4%,rgba(255,255,255,0.92),transparent_28%),radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.42),transparent_48%),radial-gradient(circle_at_50%_100%,rgba(177,241,226,0.36),transparent_42%)]
          "
        />
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-10

          flex
          min-h-screen
          w-full

          flex-col

          lg:flex-row
        "
      >
        {/* ===================================================
            LEFT MARKETING SECTION
        ==================================================== */}

        <section
          className="
            relative
            hidden
            min-h-screen
            w-full
            overflow-hidden

            lg:flex
            lg:w-[60%]
            lg:flex-col
          "
        />

        {/* ===================================================
            RIGHT LOGIN SECTION
        ==================================================== */}

        <aside
          className="
            relative
            z-20

            flex
            min-h-screen
            w-full
            flex-col

            items-center
            justify-start

            overflow-hidden

            bg-transparent

            px-5
            py-6

            sm:px-8

            lg:w-[40%]

            lg:items-stretch
            lg:justify-start

            lg:bg-[#f5f8fc]

            lg:px-12
            lg:py-10

            xl:px-16
          "
        >
          {/* =================================================
              0% PLATFORM FEES RIBBON
          ================================================== */}

          <div
            className="
              pointer-events-none

              absolute
              right-[-55px]
              top-5

              hidden

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

              hidden

              h-[220px]
              w-[220px]

              rounded-full

              bg-[#effbff]
            "
          />

          {/* =================================================
              LOGO
              SIZE KEPT EXACTLY
          ================================================== */}

          <div
            className="
              relative
              z-10

              flex
              w-full

              justify-start

              pt-14

              sm:pt-10

              lg:justify-start
              lg:pt-2
            "
          >
            <img
              src={logo}
              alt="CtrlBooks logo"
              className="
                h-auto
                w-[60px]
                max-w-full
                object-contain
              "
            />
          </div>

          {/* =================================================
              LOGIN CONTENT
          ================================================== */}

          <div
            className="
              relative
              z-10

              mx-auto

              flex
              w-full
              max-w-[420px]

              flex-col

              items-start

              justify-start

              px-1
              py-8

              sm:px-0

              lg:flex-1

              lg:items-start
              lg:justify-start

              lg:pt-5
              lg:pb-10
            "
          >
            {/* =================================================
                HEADING
            ================================================== */}

            <h2
              className="
                w-full
                max-w-[380px]

                text-start

                text-[1.3rem]
                font-bold
                leading-[1.15]
                tracking-tight

                text-[#092f52]

                sm:text-[1.25rem]

                lg:text-left
              "
            >
              <span
                className="
                  flex
                  justify-start

                  font-sans

                  text-base
                  leading-none

                  text-[#768B9D]

                  lg:justify-start
                "
              >
                Welcome to CtrlBooks
              </span>

              {otpSent ? (
                <span
                  className="
                    mt-2

                    flex
                    justify-start

                    text-3xl
                    font-semibold
                    leading-snug

                    text-[#050505]

                    lg:justify-start
                  "
                >
                  Enter OTP
                </span>
              ) : (
                <span
                  className="
                    mt-2

                    flex
                    justify-start

                    text-3xl
                    font-semibold
                    leading-snug

                    text-[#050505]

                    lg:justify-start
                  "
                >
                  Get started with your email
                </span>
              )}
            </h2>

            {/* =================================================
                SUBTITLE
            ================================================== */}

            <p
              className="
                mt-3

                w-auto
                max-w-[300px]

                text-center
                text-sm
                leading-5

                text-[#61758a]

                lg:text-left
              "
            >
              {otpSent
                ? "Use the verification code sent to your email."
                : ""}
            </p>

            {/* =================================================
                MESSAGE
            ================================================== */}

            {message && (
              <div
                className="
                  mt-4

                  flex
                  w-full
                  items-center
                  justify-start
                  gap-2

                  rounded-lg

                  border
                  border-[#dce5ee]

                  bg-white

                  px-3
                  py-2

                  text-center
                  text-xs
                  text-[#61758a]

                  shadow-[0_3px_10px_rgba(15,23,42,0.025)]
                "
              >
                {message}
              </div>
            )}

            {/* =================================================
                EMAIL FORM
            ================================================== */}

            {!otpSent ? (
              <form
                onSubmit={handleSendOtp}
                className="mt-1 w-full"
              >
                <div className="relative mt-2 w-full">
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
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="Enter your email address"
                    disabled={loading}
                    className="
                      h-11
                      w-full

                      rounded-lg

                      border
                      border-[#dce5ee]

                      bg-white

                      pl-12
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

                {/* Continue */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-5

                    flex
                    h-11
                    w-full
                    pl-4
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
                  {loading
                    ? "Sending..."
                    : "Continue"}

                  {!loading && (
                    <ArrowRight className="h-4 w-4" />
                  )}
                </button>
              </form>
            ) : (
              /* =================================================
                 OTP FORM
              ================================================== */

              <form
                onSubmit={handleVerifyOtp}
                className="mt-7 w-full"
              >
                <label
                  className="
                    block
                    w-full

                    text-left

                    text-[0.92rem]
                    font-semibold
                    text-[#102a43]
                  "
                >
                  OTP

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(
                        event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 6),
                      )
                    }
                    placeholder="Enter OTP"
                    disabled={loading}
                    className="
                      mt-2

                      h-11
                      w-full

                      rounded-md

                      border
                      border-[#dce5ee]

                      bg-white

                      px-4

                      text-center

                      text-[1.1rem]

                      tracking-[0.25em]

                      text-[#102a43]

                      placeholder:text-[#8ba0b3]
                      placeholder:tracking-normal

                      outline-none

                      transition

                      focus:border-[#10a66f]
                      focus:ring-2
                      focus:ring-[#d9f4e9]

                      disabled:opacity-60
                    "
                  />
                </label>

                {/* Verify OTP */}
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
                  {loading
                    ? "Verifying..."
                    : "Verify OTP"}

                  {!loading && (
                    <Check className="h-4 w-4" />
                  )}
                </button>

                {/* =================================================
                    RESEND OTP
                ================================================== */}

                <div className="mt-3 w-full text-center">
                  {getOtpResendState(
                    resendSeconds,
                  ).canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="
                        w-full

                        rounded-lg

                        border
                        border-[#dce5ee]

                        bg-white

                        px-4
                        py-3

                        text-sm
                        font-medium
                        text-[#102a43]

                        transition

                        hover:bg-[#edf7f2]

                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    >
                      {
                        getOtpResendState(
                          resendSeconds,
                        ).label
                      }
                    </button>
                  ) : (
                    <p
                      className="
                        text-sm
                        font-medium
                        text-[#61758a]
                      "
                    >
                      {
                        getOtpResendState(
                          resendSeconds,
                        ).label
                      }
                    </p>
                  )}
                </div>

                {/* Use different email */}
                <button
                  type="button"
                  onClick={handleDifferentEmail}
                  className="
                    mt-3
                    w-full

                    rounded-lg

                    border
                    border-[#dce5ee]

                    bg-white

                    px-4
                    py-3

                    text-sm
                    font-medium
                    text-[#102a43]

                    transition

                    hover:bg-[#edf7f2]
                  "
                >
                  Use a different email
                </button>
              </form>
            )}

            {/* =================================================
                TRUST / SECURITY / SUPPORT
            ================================================== */}

            <div
              className="
                mt-6
                w-full
              "
            >

              {/* =================================================
                  LEGAL / SUPPORT CARD
              ================================================== */}

              <div
                className="
                  mt-4
                  w-full
                  rounded-xl
                  px-4
                  py-3
                  text-start
                "
              >
                <p
                  className="
                    text-[12px]
                    leading-4
                    text-[#718096]
                  "
                >
                  By continuing, you agree to our{" "}
                  <button
                    type="button"
                    className="
                      border-0
                      bg-transparent

                      p-0

                      font-semibold
                      text-[#10a66f]

                      hover:underline
                    "
                  >
                    Privacy Policy
                  </button>{" "}
                  &{" "}
                  <button
                    type="button"
                    className="
                      border-0
                      bg-transparent

                      p-0

                      font-semibold
                      text-[#10a66f]

                      hover:underline
                    "
                  >
                    Terms of Use
                  </button>
                  .
                </p>

                <p
                  className="
                    mt-1

                    text-[11px]
                    leading-4

                    text-[#718096]
                  "
                >
                  *Limited period offer. Terms and
                  conditions apply.
                </p>

                <div
                  className="
                    mx-auto
                    my-2

                    h-px
                    w-12

                    bg-[#dcefe7]
                  "
                />

                <p
                  className="
                    text-[12px]
                    font-medium

                    text-[#61758a]
                  "
                >
                  Need help?{" "}
                  <a

                    className="
                      font-semibold

                      text-[#10a66f]

                      no-underline

                      hover:underline
                    "
                  >
                    +91 9311472355
                  </a>
                </p>
              </div>
            </div>

            <div className="mt-6 h-2" />
          </div>
        </aside>
      </div>
    </main>
  );
};

export default LoginPage;
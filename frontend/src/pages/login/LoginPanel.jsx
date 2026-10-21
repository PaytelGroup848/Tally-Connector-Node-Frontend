import { ArrowRight, Check, Mail } from "lucide-react";
import { getOtpResendState } from "../../utils/otpUtils";

export default function LoginPanel({
  logo,
  otpSent,
  email,
  setEmail,
  handleSendOtp,
  loading,
  message,
  otp,
  setOtp,
  handleVerifyOtp,
  resendSeconds,
  handleResendOtp,
  handleDifferentEmail,
}) {
  return (
        <aside
          className="
            relative z-20 flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-transparent
            px-5 py-6 sm:px-8 lg:w-[40%] lg:items-stretch lg:justify-start lg:bg-[#f5f8fc] lg:px-12 lg:py-10 xl:px-16"
        >
          {/* =================================================
              0% PLATFORM FEES RIBBON
          ================================================== */}

          <div
            className="
              pointer-events-none absolute right-[-55px] top-5 hidden rotate-[28deg] bg-[#edf0f4]
              px-14 py-2 text-[0.9rem] font-semibold text-[#2d6cb1] shadow-[0_2px_8px_rgba(0,0,0,0.03)]"
          >
            0% Platform Fees
          </div>

          {/* Decorative top-right shape */}
          <div
            className="
              pointer-events-none absolute right-[-80px] hidden
              top-[-80px] h-[220px] w-[220px] rounded-full bg-[#effbff]"
          />

          {/* =================================================
              LOGO
              SIZE KEPT EXACTLY
          ================================================== */}

          <div
            className="
              relative z-10 flex w-full justify-start
              pt-14 max-sm:pt-10 lg:justify-start lg:pt-2"
          ></div>

          {/* =================================================
              LOGIN CONTENT
          ================================================== */}

          <div
            className="
              relative z-10 mx-auto flex w-full max-w-[420px] flex-col items-start px-1 py-8
              justify-start sm:px-0 lg:flex-1 lg:items-start lg:justify-start lg:pt-5 lg:pb-10"
          >
            {/* =================================================
                HEADING
            ================================================== */}
            <img
              src={logo}
              alt="CtrlBooks logo"
              className="
                max-sm:ml-[-5%] lg:ml-[-7%] w-50
                h-auto max-w-full object-contain"
            />
            <h2
              className="
                w-full max-w-[380px] text-start text-[1.3rem] font-bold
                leading-[1.15] tracking-tight text-[#092f52] sm:text-[1.25rem] lg:text-left"
            >
              <span
                className="
                  flex justify-start font-sans text-base
                  leading-none text-[#768B9D] lg:justify-start"
              >
                Welcome to CtrlBooks
              </span>

              {otpSent ? (
                <span
                  className="
                    mt-2 flex justify-start text-3xl leading-snug
                    font-semibold text-[#050505] lg:justify-start"
                >
                  Enter OTP
                </span>
              ) : (
                <span
                  className="
                    mt-2 flex justify-start text-3xl leading-snug
                    font-semibold text-[#050505] lg:justify-start"
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
                mt-3 w-auto max-w-[300px] text-center
                text-sm leading-5 text-[#61758a] lg:text-left"
            >
              {otpSent ? "Use the verification code sent to your email." : ""}
            </p>

            {/* =================================================
                MESSAGE
            ================================================== */}

            {message && (
              <div
                className="
                  mt-4 flex w-full items-center justify-start gap-2 rounded-lg px-3 py-2
                  text-center text-xs text-grey-500 shadow-[0_3px_10px_rgba(15,23,42,0.025)]"
              >
                <b>{message}*</b>
              </div>
            )}

            {/* =================================================
                EMAIL FORM
            ================================================== */}

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="
                  mt-1
                  w-full">
                <div className="
                    relative
                    mt-2 w-full">
                  <Mail
                    className="
                      pointer-events-none absolute left-4 h-5
                      top-1/2 w-5 -translate-y-1/2 text-[#8ba0b3]"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email address"
                    disabled={loading}
                    className="
                      h-11 w-full rounded-lg border border-[#dce5ee] bg-white pl-12 pr-4 text-[0.96rem] text-[#243b53] outline-none
                      placeholder:text-[#a7b5c5] transition focus:border-[#10a66f] focus:ring-2 focus:ring-[#d9f4e9] disabled:opacity-60"
                  />
                </div>

                {/* Continue */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-5 flex h-11 w-full pl-4 items-center justify-center gap-3 rounded-md bg-[#10a66f] text-[0.96rem] font-bold text-white
                    shadow-[0_8px_18px_rgba(16,166,111,0.18)] transition hover:bg-[#0b935f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Sending..." : "Continue"}

                  {!loading && <ArrowRight className="
                      h-4
                      w-4" />}
                </button>
              </form>
            ) : (
              /* =================================================
                 OTP FORM
              ================================================== */

              <form onSubmit={handleVerifyOtp} className="
                  mt-7
                  w-full">
                <label
                  className="
                    block w-full text-left
                    text-[0.92rem] font-semibold text-[#102a43]"
                >
                  OTP
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(event) =>
                      setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    placeholder="Enter OTP"
                    disabled={loading}
                    className="
                      mt-2 h-11 w-full rounded-md border border-[#dce5ee] bg-white px-4 text-center text-[1.1rem] tracking-[0.25em] text-[#102a43] outline-none
                      placeholder:text-[#8ba0b3] placeholder:tracking-normal transition focus:border-[#10a66f] focus:ring-2 focus:ring-[#d9f4e9] disabled:opacity-60"
                  />
                </label>

                {/* Verify OTP */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    mt-5 flex h-11 w-full items-center justify-center gap-3 rounded-md bg-[#10a66f] text-[0.96rem] font-bold text-white transition
                    shadow-[0_8px_18px_rgba(16,166,111,0.18)] hover:bg-[#0b935f] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}

                  {!loading && <Check className="
                      h-4
                      w-4" />}
                </button>

                {/* =================================================
                    RESEND OTP
                ================================================== */}

                <div className="
                    mt-3 w-full
                    text-center">
                  {getOtpResendState(resendSeconds).canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={loading}
                      className="
                        w-full rounded-lg border border-[#dce5ee] bg-white px-4 py-3 text-sm font-medium
                        text-[#102a43] transition hover:bg-[#edf7f2] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {getOtpResendState(resendSeconds).label}
                    </button>
                  ) : (
                    <p
                      className="
                        text-sm
                        font-medium text-[#61758a]"
                    >
                      {getOtpResendState(resendSeconds).label}
                    </p>
                  )}
                </div>

                {/* Use different email */}
                <button
                  type="button"
                  onClick={handleDifferentEmail}
                  className="
                    mt-3 w-full rounded-lg border border-[#dce5ee] bg-white px-4 py-3
                    text-sm font-medium text-[#102a43] transition hover:bg-[#edf7f2]"
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
                w-full"
            >
              {/* =================================================
                  LEGAL / SUPPORT CARD
              ================================================== */}

              <div
                className="
                  mt-4 w-full px-4 py-3
                  rounded-xl text-start"
              >
                <p
                  className="
                    text-[12px]
                    leading-4 text-[#718096]"
                >
                  By continuing, you agree to our{" "}
                  <span
                    type="button"
                    className="
                      border-0 bg-transparent p-0
                      font-semibold text-[#10a66f]"
                  >
                    Privacy Policy
                  </span>{" "}
                  &{" "}
                  <span
                    type="button"
                    className="
                      border-0 bg-transparent p-0
                      font-semibold text-[#10a66f]"
                  >
                    Terms of Use
                  </span>
                  .
                </p>

                <p
                  className="
                    mt-1 text-[11px]
                    leading-4 text-[#718096]"
                >
                  *Limited period offer. Terms and conditions apply.
                </p>

                <div
                  className="
                    mx-auto my-2 h-px
                    w-12 bg-[#dcefe7]"
                />

                <p
                  className="
                    text-[12px]
                    font-medium text-[#61758a]"
                >
                  Need help?{" "}
                  <span
                    className="
                      font-semibold
                      text-[#10a66f] no-underline"
                  >
                    +91 9311472355
                  </span>
                </p>
              </div>
            </div>

            <div className="
                mt-6
                h-2" />
          </div>
        </aside>
  );
}

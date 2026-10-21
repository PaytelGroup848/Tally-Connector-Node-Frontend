import LoginBackground from "./login/LoginBackground";
import LoginPanel from "./login/LoginPanel";
import useLoginOtp from "./login/useLoginOtp";

import logo from "../assets/logo.png";

const LoginPage = () => {
  const {
    email,
    setEmail,
    otp,
    setOtp,
    otpSent,
    loading,
    message,
    resendSeconds,
    handleSendOtp,
    handleResendOtp,
    handleVerifyOtp,
    handleDifferentEmail,
  } = useLoginOtp();

  return (
    <main
      className="
        relative z-0 min-h-screen bg-[#f1fbf8]
        overflow-hidden font-sans text-[#102a43]"
    >
      {/* =====================================================
          STATIC BACKGROUND
      ====================================================== */}

      <LoginBackground />



      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div
        className="
          relative z-10 flex w-full
          min-h-screen flex-col lg:flex-row"
      >
        {/* ===================================================
            LEFT MARKETING SECTION
        ==================================================== */}

        <section
          className="
            relative hidden min-h-screen w-full
            overflow-hidden lg:flex lg:w-[60%] lg:flex-col"
        />

        {/* ===================================================
            RIGHT LOGIN SECTION
        ==================================================== */}

        <LoginPanel
          logo={logo}
          otpSent={otpSent}
          email={email}
          setEmail={setEmail}
          handleSendOtp={handleSendOtp}
          loading={loading}
          message={message}
          otp={otp}
          setOtp={setOtp}
          handleVerifyOtp={handleVerifyOtp}
          resendSeconds={resendSeconds}
          handleResendOtp={handleResendOtp}
          handleDifferentEmail={handleDifferentEmail}
        />
      </div>
    </main>
  );
};

export default LoginPage;

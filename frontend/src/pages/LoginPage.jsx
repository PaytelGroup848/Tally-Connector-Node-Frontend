import { useState } from 'react'
import { ArrowRight, Check, Cloud, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { sendOtp, verifyOtp } from '../services/authApi'
import useAuthStore from '../store/authStore'
import logo from '../assets/logo.png'
import loginPageImage from '../assets/loginPgImg.png'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSendOtp = async (event) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    setLoading(true)
    setMessage('')

    try {
      const data = await sendOtp(trimmedEmail)
      setOtpSent(true)
      setMessage(data?.message || 'OTP sent successfully. Please enter the code below.')
    } catch (error) {
      setMessage(error.message || 'Unable to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()

    const trimmedEmail = email.trim()
    const trimmedOtp = otp.trim()

    if (!trimmedEmail || !trimmedOtp) return

    setLoading(true)
    setMessage('')

    try {
      const data = await verifyOtp({ email: trimmedEmail, otp: trimmedOtp })
      const accessToken = data?.accessToken || data?.token || data?.data?.accessToken || data?.data?.token

      if (!accessToken) {
        throw new Error('No access token returned after OTP verification.')
      }

      setAuth({
        accessToken,
        user: {
          email: trimmedEmail,
          ...(data?.user || {}),
        },
      })
    } catch (error) {
      setMessage(error.message || 'OTP verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#06172b] p-0 font-sans"
      style={{
        backgroundImage: `linear-gradient(115deg, rgba(2, 14, 31, 0.72), rgba(4, 54, 91, 0.58)), url(${loginPageImage})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_22%,rgba(0,196,255,0.24),transparent_28%),radial-gradient(circle_at_15%_85%,rgba(0,118,255,0.2),transparent_30%)]" />

      <div
        className="relative grid min-h-screen w-full overflow-hidden bg-[#061a34]/10 lg:grid-cols-[1.08fr_0.92fr]"
      >
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden px-[8vw] py-12 text-white lg:flex xl:py-16">
          <div className="absolute -left-24 bottom-8 h-64 w-64 rounded-full bg-[#00c6ff]/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white p-2 shadow-lg shadow-black/20">
                <img src={logo} alt="CtrlBooks logo" className="h-full w-full object-contain" />
              </span>
              <span className="text-2xl font-bold tracking-tight text-white">Ctrl<span className="text-[#00d7ff]">Books</span></span>
            </div>
            <p className="mt-16 max-w-[510px] text-4xl font-bold leading-[1.08] tracking-[-0.04em] xl:text-6xl">
              Smarter Data.
              <span className="block text-[#00d7ff]">Better Decisions.</span>
            </p>
           
          </div>

          <div className="relative grid max-w-[430px] gap-4 rounded-2xl border border-white/15 bg-[#031329]/65 p-5 shadow-2xl backdrop-blur-md">
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00b7ec]/20 text-[#00d7ff]"><ShieldCheck className="h-5 w-5" /></span>
              <div><p className="text-sm font-semibold">Secure Tally Access</p><p className="mt-1 text-xs leading-5 text-blue-100/70">Access your company books through a protected cloud workspace.</p></div>
            </div>
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00b7ec]/20 text-[#00d7ff]"><Cloud className="h-5 w-5" /></span>
              <div><p className="text-sm font-semibold">Connected Business Data</p><p className="mt-1 text-xs leading-5 text-blue-100/70">Keep sales, receipts, parties, and reports available in one place.</p></div>
            </div>
            <div className="flex items-start gap-4">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#00b7ec]/20 text-[#00d7ff]"><LockKeyhole className="h-5 w-5" /></span>
              <div><p className="text-sm font-semibold">Decisions With Clarity</p><p className="mt-1 text-xs leading-5 text-blue-100/70">See the numbers that matter and move your business forward with confidence.</p></div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen w-full max-w-[530px] flex-col justify-center justify-self-center rounded-[28px] border border-white/35 bg-transparent px-6 py-10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur-2xl sm:px-12 lg:my-12 lg:min-h-[calc(100vh-6rem)] lg:mr-[7vw] lg:justify-self-end lg:px-12 xl:my-14 xl:min-h-[calc(100vh-7rem)]">
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-white p-1.5 shadow-lg shadow-black/20">
                <img src={logo} alt="CtrlBooks logo" className="h-full w-full object-contain" />
              </span>
              <span className="text-xl font-bold tracking-tight text-white">Ctrl<span className="text-[#00d7ff]">Books</span></span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-[-0.03em] sm:text-4xl">{otpSent ? 'Enter your OTP' : 'Login to continue'}</h1>
            <p className="mt-3 max-w-[390px] text-sm leading-6 text-blue-100/80">
              {otpSent ? `Enter the secure code sent to ${email}.` : 'Enter your email address to receive a secure OTP and get started with Cloude Data.'}
            </p>
          </div>

          {message && <div className="mb-5 rounded-xl border border-cyan-200/30 bg-cyan-100/10 px-4 py-3 text-xs leading-5 text-cyan-50">{message}</div>}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <label className="block text-xs font-semibold text-white/90">
                Email Address
                <span className="relative mt-2 block">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-100/80" />
                  <input type="email" placeholder="Enter your email address" value={email} onChange={(event) => setEmail(event.target.value)} required disabled={loading} className="h-14 w-full rounded-xl border border-white/25 bg-white/[0.04] pl-12 pr-4 text-sm text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-1xl transition placeholder:text-blue-100/65 focus:border-cyan-300 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/15 disabled:opacity-60" />
                </span>
              </label>
              <button type="submit" disabled={loading} className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#00d9df] to-[#2868ff] text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,174,255,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Sending OTP...' : 'Continue'}
                {!loading && <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <label className="block text-xs font-semibold text-white/90">
                Verification Code
                <input type="text" inputMode="numeric" maxLength={6} placeholder="0000" value={otp} onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))} required disabled={loading} className="mt-2 h-16 w-full rounded-xl border border-white/25 bg-white/[0.04] px-4 text-center text-2xl font-bold tracking-[0.45em] text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl transition placeholder:text-blue-100/45 focus:border-cyan-300 focus:bg-white/10 focus:ring-4 focus:ring-cyan-300/15 disabled:opacity-60" />
              </label>
              <button type="submit" disabled={loading} className="group flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-[#00d9df] to-[#2868ff] text-sm font-bold text-white shadow-[0_12px_28px_rgba(0,174,255,0.3)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                {loading ? 'Verifying...' : 'Verify and sign in'}
                {!loading && <Check className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => setOtpSent(false)} className="h-11 w-full rounded-xl border border-white/25 bg-white/10 text-xs font-semibold text-white transition hover:bg-white/20">Use a different email</button>
            </form>
          )}

          <div className="mt-9 flex items-center gap-2 text-xs text-blue-100/70"><ShieldCheck className="h-4 w-4 text-[#00d7ff]" /> Your data is safe with us</div>
        </section>
      </div>
    </main>
  )
}

export default LoginPage
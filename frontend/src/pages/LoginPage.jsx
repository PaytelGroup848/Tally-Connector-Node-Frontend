import { useState } from 'react'
import { sendOtp, verifyOtp } from '../services/authApi'
import useAuthStore from '../store/authStore'
import cloudedataLogo from '../assets/cloudedata.svg'

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

      window.location.replace('/dashboard')
    } catch (error) {
      setMessage(error.message || 'OTP verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-5 font-sans">
      <div className="w-full max-w-[420px] rounded-xl bg-white p-8 shadow-[0_6px_25px_rgba(15,23,42,0.08)]">
        <div className="mb-5 flex justify-center">
          <img src={cloudedataLogo} alt="Cloudedata logo" className="h-14 w-auto object-contain" />
        </div>

        <h2 className="mb-2 text-center text-3xl font-semibold text-slate-800">Login to continue</h2>

        <p className="mb-6 text-center text-sm text-slate-500">
          {otpSent ? 'Enter the OTP sent to your email' : ''}
        </p>

        {message && (
          <p className="mb-4 text-center text-xs text-emerald-700">{message}</p>
        )}

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={loading}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-green-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`h-11 w-full rounded-lg text-sm font-semibold text-white transition ${loading ? 'cursor-not-allowed bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">OTP Code</label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                disabled={loading}
                className="h-11 w-full rounded-lg border border-slate-300 px-3 text-sm text-slate-800 outline-none transition focus:border-emerald-500 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`h-11 w-full rounded-lg text-sm font-semibold text-white transition ${loading ? 'cursor-not-allowed bg-green-700' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              onClick={() => setOtpSent(false)}
              className="h-[42px] w-full rounded-lg border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default LoginPage
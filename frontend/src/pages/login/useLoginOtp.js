import { useEffect, useState } from 'react'
import {
  sendOtp,
  sendSuperAdminOtp,
  verifyOtp,
  verifySuperAdminOtp,
} from '../../services/authApi'
import useAuthStore from '../../store/authStore'
import { OTP_RESEND_SECONDS } from '../../utils/otpUtils'

export default function useLoginOtp() {
  const isSuperAdminLogin = window.location.pathname === '/login/admin'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [resendSeconds, setResendSeconds] = useState(0)
  const setAuth = useAuthStore((state) => state.setAuth)

  useEffect(() => {
    if (!otpSent || resendSeconds <= 0) {
      if (!otpSent) setResendSeconds(0)
      return undefined
    }

    const timer = setTimeout(() => {
      setResendSeconds((current) => Math.max(0, current - 1))
    }, 1000)

    return () => clearTimeout(timer)
  }, [otpSent, resendSeconds])

  const handleSendOtp = async (event) => {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!trimmedEmail) return

    setLoading(true)
    setMessage('')
    try {
      const sendOtpRequest = isSuperAdminLogin ? sendSuperAdminOtp : sendOtp
      await sendOtpRequest(trimmedEmail)
      setOtpSent(true)
      setOtp('')
      setResendSeconds(OTP_RESEND_SECONDS)
      setMessage(`OTP sent to ${trimmedEmail}`)
    } catch (error) {
      setMessage(error.message || 'Unable to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail || loading || resendSeconds > 0) return

    setLoading(true)
    setMessage('')
    try {
      const sendOtpRequest = isSuperAdminLogin ? sendSuperAdminOtp : sendOtp
      await sendOtpRequest(trimmedEmail)
      setOtp('')
      setResendSeconds(OTP_RESEND_SECONDS)
      setMessage(`OTP resent to ${trimmedEmail}`)
    } catch (error) {
      setMessage(error.message || 'Unable to resend OTP. Please try again.')
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
      const verifyOtpRequest = isSuperAdminLogin
        ? verifySuperAdminOtp
        : verifyOtp
      const data = await verifyOtpRequest({
        email: trimmedEmail,
        otp: trimmedOtp,
      })
      const accessToken =
        data?.accessToken ||
        data?.token ||
        data?.data?.accessToken ||
        data?.data?.token

      if (!accessToken) {
        throw new Error('No access token returned after OTP verification.')
      }

      setAuth({
        accessToken,
        user: {
          email: trimmedEmail,
          ...(data?.user || {}),
          ...(isSuperAdminLogin
            ? { role: 'SUPER_ADMIN', isSuperAdmin: true }
            : {}),
        },
      })

      if (isSuperAdminLogin) {
        window.localStorage.setItem('isSuperAdmin', 'true')
        window.history.replaceState({}, '', '/super-admin')
        window.dispatchEvent(new PopStateEvent('popstate'))
      }
    } catch (error) {
      setMessage(error.message || 'OTP verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDifferentEmail = () => {
    setOtpSent(false)
    setOtp('')
    setResendSeconds(0)
    setMessage('')
  }

  return {
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
  }
}

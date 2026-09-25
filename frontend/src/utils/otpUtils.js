export const OTP_RESEND_SECONDS = 30

export function getOtpResendState(seconds) {
  const remaining = Math.max(0, Number(seconds) || 0)

  if (remaining <= 0) {
    return {
      canResend: true,
      label: 'Resend OTP',
    }
  }

  return {
    canResend: false,
    label: `Resend OTP in ${remaining}s`,
  }
}

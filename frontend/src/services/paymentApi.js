const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  import.meta.env.BaseUrl ||
  'https://connector.cloudata.in/api'
).replace(/\/$/, '')

function buildUrl(path) {
  const cleanPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${cleanPath}`
}

export async function createPaymentOrder({
  accessToken,
  planId,
  durationMonths,
  extraSeats,
  totalSeats,
  addonPricePerSeat,
  totalAmount,
}) {
  const numericExtraSeats = Number(extraSeats) || 0
  const numericAddonPrice =
    Number(addonPricePerSeat) || 0
  const numericTotalAmount =
    Number(totalAmount) || 0

  // Razorpay expects amount in paise
  const amount = Math.round(
    numericTotalAmount * 100,
  )

  const response = await fetch(
    buildUrl('/payments/create-order'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        planId,
        durationMonths: Number(durationMonths),
        extraSeats: numericExtraSeats,
        additionalSeats: numericExtraSeats,
        additionalSeatCount: numericExtraSeats,
        totalSeats: Number(totalSeats) || numericExtraSeats + 1,
        addonPricePerSeat: numericAddonPrice,
        totalAmount: numericTotalAmount,
        amount,
        currency: 'INR',
      }),
    },
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Unable to create payment order',
    )
  }

  return data
}

export async function verifyPayment({
  accessToken,
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
}) {
  const response = await fetch(
    buildUrl('/payments/verify'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      }),
    },
  )

  const data = await response
    .json()
    .catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data?.message ||
        'Unable to verify payment',
    )
  }

  return data
}
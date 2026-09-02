import {
  ArrowRight,
  Check,
  Minus,
  Plus,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import {
  createPaymentOrder,
  verifyPayment,
} from '../services/paymentApi'
import useAuthStore from '../store/authStore'

const RAZORPAY_SCRIPT_URL =
  'https://checkout.razorpay.com/v1/checkout.js'

/* =========================================================
   LOAD RAZORPAY
========================================================= */

function loadRazorpay() {
  if (window.Razorpay) {
    return Promise.resolve()
  }

  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      `script[src="${RAZORPAY_SCRIPT_URL}"]`,
    )

    if (existingScript) {
      existingScript.addEventListener(
        'load',
        resolve,
        { once: true },
      )

      existingScript.addEventListener(
        'error',
        reject,
        { once: true },
      )

      return
    }

    const script =
      document.createElement('script')

    script.src =
      RAZORPAY_SCRIPT_URL

    script.async = true

    script.onload = resolve

    script.onerror = () =>
      reject(
        new Error(
          'Unable to load Razorpay checkout',
        ),
      )

    document.body.appendChild(script)
  })
}

/* =========================================================
   CHECKOUT PAGE
========================================================= */

const CheckoutPage = ({
  selectedPlanData,
  selectedDurationData,
  accessToken,
  extraSeats,
  setExtraSeats,
  basePlanPrice,
  addonPricePerSeat,
  extraSeatTotal,
  totalAmount,
  onBack,
  PlanIcon,
  featureLabels,
  formatPrice,
}) => {
  const [
    isCreatingOrder,
    setIsCreatingOrder,
  ] = useState(false)

  const [
    orderMessage,
    setOrderMessage,
  ] = useState('')

  /* =======================================================
     FEATURES
  ======================================================= */

  const features = useMemo(() => {
    if (
      !Array.isArray(
        selectedPlanData?.features,
      )
    ) {
      return []
    }

    return [
      ...new Set(
        selectedPlanData.features
          .filter(Boolean)
          .map((feature) =>
            String(feature).trim(),
          )
          .filter(Boolean),
      ),
    ]
  }, [selectedPlanData])

  /* =======================================================
     FEATURE COLUMN COUNT

     <= 4  → 2 columns
     5-8   → 2 columns
     9-12  → 3 columns
     13+   → 4 columns on large screens
  ======================================================= */

  const featureGridClass =
    features.length >= 13
      ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
      : features.length >= 9
        ? 'grid-cols-2 sm:grid-cols-3'
        : 'grid-cols-2'

  /* =======================================================
     CREATE PAYMENT ORDER
  ======================================================= */

  const handleCreateOrder =
    async () => {
      const safeAddonPrice =
        Number(addonPricePerSeat) || 0

      const safeExtraSeats =
        Number(extraSeats) || 0

      const billableExtraSeats =
        Math.max(
          0,
          safeExtraSeats - 1,
        )

      const safeTotalAmount =
        Number(totalAmount) || 0

      if (
        safeTotalAmount <= 0
      ) {
        setOrderMessage(
          'Invalid payment amount.',
        )

        return
      }

      if (
        safeAddonPrice < 0
      ) {
        setOrderMessage(
          'Invalid additional seat price.',
        )

        return
      }

      if (
        !selectedPlanData?.id
      ) {
        setOrderMessage(
          'Invalid plan selected.',
        )

        return
      }

      if (
        !selectedDurationData?.months
      ) {
        setOrderMessage(
          'Invalid plan duration.',
        )

        return
      }

      if (!accessToken) {
        setOrderMessage(
          'Please login before making a payment.',
        )

        return
      }

      setIsCreatingOrder(true)
      setOrderMessage('')

      try {
        /* ===============================================
           CREATE ORDER
        =============================================== */

        const response =
          await createPaymentOrder({
            accessToken,

            planId:
              selectedPlanData?.id,

            durationMonths:
              selectedDurationData?.months,

            extraSeats:
              billableExtraSeats,

            totalSeats:
              safeExtraSeats,

            addonPricePerSeat:
              safeAddonPrice,

            totalAmount:
              safeTotalAmount,
          })

        /* ===============================================
           ORDER RESPONSE
        =============================================== */

        const order =
          response?.data?.order ||
          response?.data ||
          response?.order ||
          response

        /* ===============================================
           ORDER ID
        =============================================== */

        const orderId =
          order?.id ||
          order?.orderId ||
          order?.razorpay_order_id ||
          response?.razorpay_order_id ||
          response?.razorpayOrderId

        /* ===============================================
           RAZORPAY KEY
        =============================================== */

        const razorpayKey =
          order?.key ||
          order?.keyId ||
          order?.key_id ||
          order?.razorpayKeyId ||
          response?.key ||
          response?.keyId ||
          response?.key_id ||
          response?.razorpayKeyId ||
          import.meta.env
            .VITE_RAZORPAY_KEY_ID

        /* ===============================================
           AMOUNT
        =============================================== */

        const amount =
          Math.round(
            safeTotalAmount * 100,
          )

        const currency =
          order?.currency ||
          response?.currency ||
          'INR'

        /* ===============================================
           VALIDATE ORDER
        =============================================== */

        if (
          !Number.isFinite(
            amount,
          ) ||
          amount <= 0
        ) {
          throw new Error(
            'Invalid payment amount.',
          )
        }

        if (
          !orderId ||
          !razorpayKey
        ) {
          throw new Error(
            'Payment order response is missing Razorpay order details.',
          )
        }

        /* ===============================================
           LOAD RAZORPAY
        =============================================== */

        await loadRazorpay()

        /* ===============================================
           OPEN RAZORPAY
        =============================================== */

        const razorpay =
          new window.Razorpay({
            key: razorpayKey,

            amount,

            currency,

            name: 'LiveKeeping',

            description: `${
              selectedPlanData?.name ||
              'Plan'
            } subscription`,

            order_id: orderId,

            /* ===========================================
               PAYMENT SUCCESS CALLBACK
            =========================================== */

            handler:
              async (
                payment,
              ) => {
                setIsCreatingOrder(
                  true,
                )

                setOrderMessage(
                  'Verifying payment...',
                )

                try {
                  /* =====================================
                     VERIFY PAYMENT
                  ===================================== */

                  const verification =
                    await verifyPayment(
                      {
                        accessToken,

                        razorpay_order_id:
                          payment?.razorpay_order_id,

                        razorpay_payment_id:
                          payment?.razorpay_payment_id,

                        razorpay_signature:
                          payment?.razorpay_signature,
                      },
                    )

                  /* =====================================
                     CHECK API SUCCESS
                  ===================================== */

                  if (
                    verification?.success ===
                    false
                  ) {
                    throw new Error(
                      verification?.message ||
                        'Payment verification failed.',
                    )
                  }

                  const authStore =
                    useAuthStore.getState()

                  const verifiedUser =
                    verification?.user ||
                    verification?.data?.user ||
                    verification?.data ||
                    {}

                  if (authStore?.accessToken) {
                    const normalizedUser = {
                      ...(authStore.user || {}),
                      ...(verifiedUser || {}),
                      activeSubscription:
                        verifiedUser?.activeSubscription === true ||
                        verifiedUser?.subscriptionActive === true ||
                        verifiedUser?.isActiveSubscription === true ||
                        verifiedUser?.isSubscribed === true ||
                        verifiedUser?.subscription?.active === true ||
                        verifiedUser?.plan?.active === true ||
                        String(
                          verifiedUser?.subscriptionStatus ||
                            verifiedUser?.status ||
                            verifiedUser?.subscription?.status ||
                            verifiedUser?.plan?.status ||
                            '',
                        ).toLowerCase() === 'active' ||
                        String(
                          verifiedUser?.subscriptionStatus ||
                            verifiedUser?.status ||
                            verifiedUser?.subscription?.status ||
                            verifiedUser?.plan?.status ||
                            '',
                        ).toLowerCase() === 'paid' ||
                        String(
                          verifiedUser?.subscriptionStatus ||
                            verifiedUser?.status ||
                            verifiedUser?.subscription?.status ||
                            verifiedUser?.plan?.status ||
                            '',
                        ).toLowerCase() === 'success',
                      subscriptionActive:
                        verifiedUser?.subscriptionActive === true ||
                        verifiedUser?.activeSubscription === true ||
                        verifiedUser?.isActiveSubscription === true ||
                        verifiedUser?.isSubscribed === true ||
                        verifiedUser?.subscription?.active === true ||
                        verifiedUser?.plan?.active === true ||
                        String(
                          verifiedUser?.subscriptionStatus ||
                            verifiedUser?.status ||
                            verifiedUser?.subscription?.status ||
                            verifiedUser?.plan?.status ||
                            '',
                        ).toLowerCase() === 'active' ||
                        String(
                          verifiedUser?.subscriptionStatus ||
                            verifiedUser?.status ||
                            verifiedUser?.subscription?.status ||
                            verifiedUser?.plan?.status ||
                            '',
                        ).toLowerCase() === 'paid' ||
                        String(
                          verifiedUser?.subscriptionStatus ||
                            verifiedUser?.status ||
                            verifiedUser?.subscription?.status ||
                            verifiedUser?.plan?.status ||
                            '',
                        ).toLowerCase() === 'success',
                      subscriptionStatus:
                        verifiedUser?.subscriptionStatus ||
                        verifiedUser?.status ||
                        verifiedUser?.subscription?.status ||
                        verifiedUser?.plan?.status ||
                        'active',
                      status:
                        verifiedUser?.status ||
                        verifiedUser?.subscriptionStatus ||
                        verifiedUser?.subscription?.status ||
                        verifiedUser?.plan?.status ||
                        'active',
                      paymentVerified: true,
                    }

                    authStore.setAuth({
                      accessToken:
                        authStore.accessToken,
                      user: normalizedUser,
                    })
                  }

                  /* =====================================
                     REDIRECT ONLY AFTER
                     SUCCESSFUL VERIFICATION
                  ===================================== */

                  window.history.replaceState(
                    {},
                    '',
                    '/dashboard',
                  )
                  window.dispatchEvent(
                    new PopStateEvent('popstate'),
                  )
                } catch (
                  error
                ) {
                  /* ===================================
                     VERIFICATION FAILED

                     STAY ON CHECKOUT
                  =================================== */

                  setOrderMessage(
                    error?.message ||
                      'Payment verification failed.',
                  )

                  setIsCreatingOrder(
                    false,
                  )
                }
              },

            /* ===========================================
               MODAL CLOSED
            =========================================== */

            modal: {
              ondismiss: () => {
                setIsCreatingOrder(
                  false,
                )

                setOrderMessage(
                  'Payment window closed.',
                )
              },
            },
          })

        /* ===============================================
           PAYMENT FAILED
        =============================================== */

        razorpay.on(
          'payment.failed',
          (payment) => {
            setIsCreatingOrder(
              false,
            )

            setOrderMessage(
              payment?.error
                ?.description ||
                'Payment failed. Please try again.',
            )
          },
        )

        /* ===============================================
           OPEN PAYMENT WINDOW
        =============================================== */

        razorpay.open()
      } catch (
        error
      ) {
        setOrderMessage(
          error?.message ||
            'Unable to create payment order.',
        )

        setIsCreatingOrder(
          false,
        )
      } finally {
        if (!window.Razorpay) {
          setIsCreatingOrder(
            false,
          )
        }
      }
    }

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-gradient-to-br
        from-[#F0FDF4]
        via-[#F7FAF8]
        to-white
        px-3
        py-2
        sm:px-4
        sm:py-3
        lg:px-6
      "
    >
      <div
        className="
          mx-auto
          flex
          h-full
          w-full
          max-w-6xl
          flex-col
        "
      >

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <div className="shrink-0">

          <button
            type="button"
            onClick={onBack}
            className="
              mb-2
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-slate-200
              bg-white
              px-3
              py-1.5
              text-[10px]
              font-semibold
              text-slate-700
              shadow-sm
              transition
              hover:bg-slate-50
              sm:mb-3
              sm:px-3.5
              sm:text-xs
            "
          >

            <ArrowRight
              className="
                h-3
                w-3
                rotate-180
                sm:h-3.5
                sm:w-3.5
              "
            />

            Back to plans

          </button>

        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div
          className="
            grid
            min-h-0
            flex-1
            grid-cols-1
            gap-3
            lg:grid-cols-[1.12fr_0.88fr]
            lg:gap-4
          "
        >

          {/* =================================================
              LEFT SIDE
          ================================================= */}

          <section
            className="
              flex
              min-h-0
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-slate-200
              bg-white
              shadow-[0_12px_35px_rgba(15,23,42,0.07)]
            "
          >

            {/* =================================================
                LEFT HEADER
            ================================================= */}

            <div
              className="
                shrink-0
                px-4
                pb-2
                pt-3
                sm:px-5
                sm:pb-3
                sm:pt-4
                lg:px-6
              "
            >

              <div
                className="
                  mb-1
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-green-700
                  sm:text-[9px]
                "
              >
                Checkout
              </div>

            </div>

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div
              className="
                flex
                min-h-0
                flex-1
                flex-col
                overflow-hidden
                px-4
                pb-3
                sm:px-5
                sm:pb-4
                lg:px-6
              "
            >

              {/* =================================================
                  SELECTED PLAN
              ================================================= */}

              <div
                className="
                  shrink-0
                  rounded-xl
                  border
                  border-green-100
                  bg-green-50
                  p-3
                  sm:p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div className="min-w-0">

                    <div
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-green-700
                        sm:text-[9px]
                      "
                    >
                      Selected Plan
                    </div>

                    <div
                      className="
                        mt-0.5
                        truncate
                        text-lg
                        font-bold
                        text-[#143D2A]
                        sm:text-xl
                      "
                    >
                      {
                        selectedPlanData?.name
                      }
                    </div>

                  </div>

                  <div
                    className="
                      flex
                      h-9
                      w-9
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                      text-green-700
                      shadow-sm
                      sm:h-10
                      sm:w-10
                    "
                  >

                    <PlanIcon
                      planName={
                        selectedPlanData?.name
                      }
                    />

                  </div>

                </div>

                {/* =================================================
                    PLAN INFO
                ================================================= */}

                <div
                  className="
                    mt-2
                    grid
                    grid-cols-2
                    gap-2
                    sm:mt-3
                  "
                >

                  {/* DURATION */}

                  <div
                    className="
                      rounded-lg
                      bg-white
                      p-2
                      sm:p-2.5
                    "
                  >

                    <div
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        text-slate-400
                        sm:text-[9px]
                      "
                    >
                      Duration
                    </div>

                    <div
                      className="
                        mt-0.5
                        text-xs
                        font-bold
                        text-slate-800
                        sm:text-sm
                      "
                    >
                      {
                        selectedDurationData?.fullLabel
                      }
                    </div>

                  </div>

                  {/* BASE PRICE */}

                  <div
                    className="
                      rounded-lg
                      bg-white
                      p-2
                      sm:p-2.5
                    "
                  >

                    <div
                      className="
                        text-[8px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        text-slate-400
                        sm:text-[9px]
                      "
                    >
                      Base price
                    </div>

                    <div
                      className="
                        mt-0.5
                        text-xs
                        font-bold
                        text-slate-800
                        sm:text-sm
                      "
                    >
                      ₹
                      {formatPrice(
                        basePlanPrice,
                      )}
                    </div>

                  </div>

                </div>

              </div>

              {/* =================================================
                  TOTAL SEATS
              ================================================= */}

              <div
                className="
                  mt-2.5
                  shrink-0
                  rounded-xl
                  border
                  border-slate-200
                  bg-slate-50
                  p-3
                  sm:mt-3
                  sm:p-4
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >

                  <div className="min-w-0">

                    <div
                      className="
                        text-[8px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-slate-500
                        sm:text-[9px]
                      "
                    >
                      Total seats
                    </div>

                    <div
                      className="
                        mt-0.5
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[0.1em]
                        text-green-600
                        sm:text-[9px]
                      "
                    >
                      Additional seat price
                    </div>

                    <div
                      className="
                        mt-0.5
                        text-xs
                        font-semibold
                        text-slate-600
                        sm:text-sm
                      "
                    >
                      ₹
                      {formatPrice(
                        addonPricePerSeat,
                      )}{' '}
                      per seat
                    </div>

                  </div>

                  {/* COUNTER */}

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-slate-200
                      bg-white
                      px-1.5
                      py-1
                      shadow-sm
                      sm:gap-2
                      sm:px-2
                      sm:py-1.5
                    "
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setExtraSeats(
                          (count) =>
                            Math.max(
                              1,
                              Number(count) -
                                1,
                            ),
                        )
                      }
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-slate-100
                        text-slate-700
                        transition
                        hover:bg-slate-200
                        sm:h-7
                        sm:w-7
                      "
                      aria-label="Decrease seats"
                    >
                      <Minus
                        size={13}
                      />
                    </button>

                    <span
                      className="
                        min-w-[20px]
                        text-center
                        text-sm
                        font-bold
                        text-slate-900
                        sm:min-w-[24px]
                        sm:text-base
                      "
                    >
                      {extraSeats}
                    </span>

                    <button
                      type="button"
                      onClick={() =>
                        setExtraSeats(
                          (count) =>
                            Number(count) +
                            1,
                        )
                      }
                      className="
                        flex
                        h-6
                        w-6
                        items-center
                        justify-center
                        rounded-full
                        bg-green-100
                        text-green-700
                        transition
                        hover:bg-green-200
                        sm:h-7
                        sm:w-7
                      "
                      aria-label="Increase seats"
                    >
                      <Plus
                        size={13}
                      />
                    </button>

                  </div>

                </div>

                {/* SEAT TOTAL */}

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    border-t
                    border-slate-200
                    pt-2
                    sm:mt-3
                    sm:pt-3
                  "
                >

                  <span
                    className="
                      text-[10px]
                      font-medium
                      text-slate-500
                      sm:text-xs
                    "
                  >
                    Additional seat total
                  </span>

                  <span
                    className="
                      text-xs
                      font-bold
                      text-[#143D2A]
                      sm:text-sm
                    "
                  >
                    ₹
                    {formatPrice(
                      extraSeatTotal,
                    )}
                  </span>

                </div>

              </div>

              {/* =================================================
                  INCLUDED FEATURES
              ================================================= */}

              <div
                className="
                  mt-2.5
                  flex
                  min-h-0
                  flex-1
                  flex-col
                  overflow-hidden
                  rounded-xl
                  border
                  border-slate-200
                  bg-white
                  p-3
                  sm:mt-3
                  sm:p-4
                "
              >

                {/* FEATURES HEADER */}

                <div
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-between
                    gap-2
                  "
                >

                  <div
                    className="
                      text-[10px]
                      font-bold
                      text-slate-700
                      sm:text-xs
                    "
                  >
                    Included features
                  </div>

                  <div
                    className="
                      shrink-0
                      font-bold
                      text-[8px]
                      uppercase
                      tracking-[0.12em]
                      text-slate-400
                      sm:text-[9px]
                    "
                  >
                    {
                      selectedPlanData?.name
                    }
                  </div>

                </div>

                {/* =================================================
                    FEATURES

                    NO SCROLLBAR
                ================================================= */}

                <div
                  className={`
                    mt-2.5
                    grid
                    ${featureGridClass}
                    content-start
                    gap-x-3
                    gap-y-1.5
                    sm:mt-3
                    sm:gap-x-4
                    sm:gap-y-2
                  `}
                >

                  {features.map(
                    (feature) => (
                      <div
                        key={feature}
                        className="
                          flex
                          min-w-0
                          items-start
                          gap-1.5
                        "
                      >

                        <div
                          className="
                            mt-0.5
                            flex
                            h-3.5
                            w-3.5
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-green-100
                            text-green-600
                            sm:h-4
                            sm:w-4
                          "
                        >

                          <Check
                            size={8}
                            strokeWidth={3}
                          />

                        </div>

                        {/* BOLD FEATURE TEXT */}

                        <span
                          className="
                            min-w-0
                            break-words
                            font-bold
                            text-[8px]
                            leading-3
                            text-slate-700
                            sm:text-[9px]
                            sm:leading-3.5
                            lg:text-[10px]
                          "
                        >
                          {
                            featureLabels?.[
                              feature
                            ] ||
                            feature
                          }
                        </span>

                      </div>
                    ),
                  )}

                  {features.length ===
                    0 && (
                    <div
                      className="
                        col-span-full
                        py-3
                        text-center
                        text-[10px]
                        text-slate-400
                      "
                    >
                      No features available
                    </div>
                  )}

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================= */}

          <aside
            className="
              flex
              min-h-0
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-green-200
              bg-[#143D2A]
              p-4
              text-white
              shadow-[0_12px_35px_rgba(20,61,42,0.18)]
              sm:p-5
              lg:p-6
            "
          >

            {/* =================================================
                SUMMARY HEADER
            ================================================= */}

            <div className="shrink-0">

              <div
                className="
                  text-[8px]
                  font-bold
                  uppercase
                  tracking-[0.2em]
                  text-green-200
                  sm:text-[9px]
                "
              >
                Order summary
              </div>

              <h2
                className="
                  mt-0.5
                  text-lg
                  font-bold
                  sm:text-xl
                "
              >
                Your order
              </h2>

            </div>

            {/* =================================================
                ORDER DETAILS
            ================================================= */}

            <div
              className="
                mt-4
                shrink-0
                space-y-2.5
                sm:mt-5
                sm:space-y-3
              "
            >

              {/* PLAN */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-[10px]
                  text-green-100
                  sm:text-xs
                "
              >

                <span>
                  {
                    selectedPlanData?.name
                  }{' '}
                  plan
                </span>

                <span className="shrink-0">
                  ₹
                  {formatPrice(
                    basePlanPrice,
                  )}
                </span>

              </div>

              {/* EXTRA SEATS */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-[10px]
                  text-green-100
                  sm:text-xs
                "
              >

                <span>
                  Extra seats
                </span>

                <span className="shrink-0">
                  {Math.max(
                    0,
                    Number(extraSeats) -
                      1,
                  )}{' '}
                  × ₹
                  {formatPrice(
                    addonPricePerSeat,
                  )}
                </span>

              </div>

              {/* DURATION */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-3
                  text-[10px]
                  text-green-100
                  sm:text-xs
                "
              >

                <span>
                  Duration
                </span>

                <span className="shrink-0">
                  {
                    selectedDurationData?.label
                  }
                </span>

              </div>

              {/* SUBTOTAL */}

              <div
                className="
                  border-t
                  border-white/15
                  pt-2.5
                  sm:pt-3
                "
              >

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    text-green-100
                  "
                >

                  <span className="text-[10px] sm:text-xs">
                    Subtotal
                  </span>

                  <span className="shrink-0 text-[10px] sm:text-xs">
                    ₹
                    {formatPrice(
                      basePlanPrice +
                        extraSeatTotal,
                    )}
                  </span>

                </div>

              </div>

            </div>

            {/* =================================================
                ADDITIONAL SEAT SUMMARY
            ================================================= */}

            <div
              className="
                mt-3
                shrink-0
                rounded-xl
                bg-white/10
                p-3
                sm:mt-4
              "
            >

              <div
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.15em]
                  text-green-200
                  sm:text-[9px]
                "
              >
                Additional seat
              </div>

              <div
                className="
                  mt-1
                  flex
                  items-end
                  justify-between
                  gap-2
                "
              >

                <div>

                  <div
                    className="
                      text-[10px]
                      text-green-100
                      sm:text-xs
                    "
                  >
                    {Math.max(
                      0,
                      Number(extraSeats) -
                        1,
                    )}{' '}
                    billable{' '}
                    {Math.max(
                      0,
                      Number(extraSeats) -
                        1,
                    ) === 1
                      ? 'seat'
                      : 'seats'}
                  </div>

                  <div
                    className="
                      mt-0.5
                      text-[8px]
                      text-green-100/70
                      sm:text-[10px]
                    "
                  >
                    ₹
                    {formatPrice(
                      addonPricePerSeat,
                    )}{' '}
                    each
                  </div>

                </div>

                <div
                  className="
                    shrink-0
                    text-base
                    font-bold
                    sm:text-lg
                  "
                >
                  ₹
                  {formatPrice(
                    extraSeatTotal,
                  )}
                </div>

              </div>

            </div>

            {/* =================================================
                TOTAL
            ================================================= */}

            <div
              className="
                mt-3
                shrink-0
                rounded-xl
                bg-white/10
                p-3
                sm:mt-4
                sm:p-4
              "
            >

              <div
                className="
                  text-[8px]
                  uppercase
                  tracking-[0.16em]
                  text-green-100
                  sm:text-[9px]
                "
              >
                Total payable
              </div>

              <div
                className="
                  mt-1
                  text-2xl
                  font-extrabold
                  sm:text-3xl
                "
              >
                ₹
                {formatPrice(
                  totalAmount,
                )}
              </div>

              <div
                className="
                  mt-0.5
                  text-[8px]
                  text-green-100/70
                  sm:text-[10px]
                "
              >
                Base plan + additional seats
              </div>

            </div>

            {/* =================================================
                PAYMENT MESSAGE
            ================================================= */}

            {orderMessage && (
              <div
                className="
                  mt-2.5
                  shrink-0
                  rounded-lg
                  bg-white/10
                  px-3
                  py-2
                  text-center
                  text-[9px]
                  leading-3.5
                  text-green-100
                  sm:mt-3
                  sm:text-[10px]
                  sm:leading-4
                "
              >
                {orderMessage}
              </div>
            )}

            {/* =================================================
                PAY BUTTON
            ================================================= */}

            <div
              className="
                mt-auto
                shrink-0
                pt-3
                sm:pt-4
              "
            >

              <button
                type="button"
                onClick={
                  handleCreateOrder
                }
                disabled={
                  isCreatingOrder ||
                  !accessToken ||
                  !selectedPlanData?.id ||
                  !selectedDurationData?.months
                }
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-white
                  px-4
                  py-2.5
                  text-xs
                  font-bold
                  text-[#143D2A]
                  shadow-lg
                  transition
                  hover:bg-green-50
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  sm:py-3
                  sm:text-sm
                "
              >

                {isCreatingOrder
                  ? 'Processing...'
                  : 'Confirm & Pay'}

                <ArrowRight
                  size={14}
                />

              </button>

              <p
                className="
                  mt-1.5
                  text-center
                  text-[8px]
                  text-green-100/70
                  sm:mt-2
                  sm:text-[9px]
                "
              >
                Secure billing • No hidden fees
              </p>

            </div>

          </aside>

        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
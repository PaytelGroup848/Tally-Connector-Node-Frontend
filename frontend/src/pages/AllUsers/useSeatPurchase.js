import { useState } from "react";
import { createSeatOrder, verifySeatPayment } from "../../services/paymentApi";

export default function useSeatPurchase({ accessToken, user, onPaymentSuccess }) {
  const [step, setStep] = useState("select");
  const [seatsToAdd, setSeatsToAdd] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState("");

  // Current/additional-seat pricing shown before the API call.
  // The backend response remains the source of truth after order creation.
  const seatRate = 3000;
  const gstPercent = 18;

  const subtotal = seatRate * seatsToAdd;
  const gstAmount = Math.round((subtotal * gstPercent) / 100);
  const estimatedTotal = subtotal + gstAmount;

  const formatCurrency = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

 const createOrder = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await createSeatOrder({
      accessToken,
      seats: seatsToAdd,
    });

    console.log("Seat order created:", response);

    setOrderData(response);
    setStep("details");
  } catch (orderError) {
    console.error(
      "Seat order creation failed:",
      orderError,
    );

    setError(
      orderError?.message ||
        "Unable to create seat order.",
    );
  } finally {
    setLoading(false);
  }
};

  const changeSeats = () => {
    if (paymentLoading) return;

    setStep("select");
    setOrderData(null);
    setError("");
    setPaymentSuccess(false);
  };

  const loadRazorpay = async () => {
    if (window.Razorpay) return;

    await new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
      );

      if (existingScript) {
        existingScript.addEventListener("load", resolve, {
          once: true,
        });
        existingScript.addEventListener("error", reject, {
          once: true,
        });
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;

      script.onload = resolve;
      script.onerror = () =>
        reject(
          new Error(
            "Unable to load Razorpay checkout.",
          ),
        );

      document.body.appendChild(script);
    });
  };

  const openRazorpay = async () => {
    const data = orderData?.data || orderData;

    if (!data?.orderId || !data?.keyId) {
      setError(
        "Payment details are missing from the seat order response.",
      );
      return;
    }

    try {
      setPaymentLoading(true);
      setError("");

      await loadRazorpay();

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout is unavailable.",
        );
      }

      const razorpay = new window.Razorpay({
        key: data.keyId,
        amount: Number(data.amount || 0),
        currency: data.currency || "INR",
        name: "CtrlBooks",
        description: `${Number(data?.breakdown?.seatsToAdd || seatsToAdd)
          } additional user seat${Number(data?.breakdown?.seatsToAdd || seatsToAdd) === 1
            ? ""
            : "s"
          }`,
        order_id: data.orderId,

        prefill: {
          email:
            user?.email ||
            user?.user?.email ||
            "",
        },

        theme: {
          color: "#10b981",
        },

       handler: async (paymentResponse) => {
  try {
    setPaymentLoading(true);
    setError("");

    await verifySeatPayment({
      accessToken,

      razorpay_order_id:
        paymentResponse.razorpay_order_id,

      razorpay_payment_id:
        paymentResponse.razorpay_payment_id,

      razorpay_signature:
        paymentResponse.razorpay_signature,
    });

    setPaymentSuccess(true);

    await onPaymentSuccess?.();
  } catch (verifyError) {
    console.error(
      "Seat payment verification failed:",
      verifyError,
    );

    setError(
      verifyError?.message ||
        "Payment verification failed.",
    );
  } finally {
    setPaymentLoading(false);
  }
},

        modal: {
          ondismiss: () => {
            setPaymentLoading(false);
          },
        },
      });

      razorpay.open();
    } catch (razorpayError) {
      console.error(
        "Razorpay error:",
        razorpayError,
      );

      setError(
        razorpayError?.message ||
        "Unable to open the payment window. Please try again.",
      );

      setPaymentLoading(false);
    }
  };

  const data = orderData?.data || orderData;
  const breakdown = data?.breakdown || {};

  const backendSeatCount = Number(
    breakdown.seatsToAdd ?? seatsToAdd,
  );

  const backendPerSeatRate = Number(
    breakdown.perSeatRate ?? seatRate,
  );

  const backendSubtotal = Number(
    breakdown.subtotal ?? backendPerSeatRate * backendSeatCount,
  );

  const backendGstPercent = Number(
    breakdown.gstPercent ?? gstPercent,
  );

  const backendGstAmount = Number(
    breakdown.gstAmount ??
    Math.round(
      (backendSubtotal * backendGstPercent) / 100,
    ),
  );

  const backendTotalAmount = Number(
    breakdown.totalAmount ??
    (data?.amount
      ? Number(data.amount) / 100
      : backendSubtotal + backendGstAmount),
  );


  return {
    step, seatsToAdd, setSeatsToAdd, loading, paymentLoading, orderData, paymentSuccess, error,
    seatRate, gstPercent, subtotal, gstAmount, estimatedTotal, formatCurrency, createOrder, changeSeats, openRazorpay,
    data, backendSeatCount, backendPerSeatRate, backendSubtotal, backendGstPercent, backendGstAmount, backendTotalAmount,
  };
}

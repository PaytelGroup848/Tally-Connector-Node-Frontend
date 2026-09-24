import { useEffect, useRef, useState } from "react";
import { lookupGstin } from "../services/gstApi";

const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

/**
 * Debounced GSTIN lookup.
 * Returns { status, data, error }
 * status: 'idle' | 'checking' | 'valid' | 'invalid'
 */
export function useGstLookup(gstin) {
  const [state, setState] = useState({
    status: "idle",
    data: null,
    error: "",
  });

  const requestIdRef = useRef(0);

  useEffect(() => {
    const value = (gstin || "").trim().toUpperCase();

    // Reset if empty or wrong length
    if (!value) {
      setState({ status: "idle", data: null, error: "" });
      return;
    }

    // Quick client-side format check before hitting API
    if (value.length !== 15 || !GSTIN_REGEX.test(value)) {
      setState({
        status: "invalid",
        data: null,
        error: "Invalid GSTIN format",
      });
      return;
    }

    const myId = ++requestIdRef.current;
    setState({ status: "checking", data: null, error: "" });

    const timer = setTimeout(async () => {
      try {
        const data = await lookupGstin(value);

        // Ignore stale responses
        if (myId !== requestIdRef.current) return;

        if (data?.status === 1 && data?.validation_status === "VALID") {
          setState({ status: "valid", data, error: "" });
        } else {
          setState({
            status: "invalid",
            data: null,
            error: data?.message || "GSTIN is not valid",
          });
        }
      } catch (err) {
        if (myId !== requestIdRef.current) return;
        setState({
          status: "invalid",
          data: null,
          error: err?.response?.data?.message || "Lookup failed",
        });
      }
    }, 600); // 600ms debounce

    return () => clearTimeout(timer);
  }, [gstin]);

  return state;
}

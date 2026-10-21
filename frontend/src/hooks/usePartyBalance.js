import { useEffect, useRef, useState } from "react";
import { extractCompanyProfile, extractLedgers, fetchCompanyLedgers, fetchCompanySettings } from "../services/companiesApi";
import { extractCustomers, extractSuppliers, fetchCustomers, fetchSuppliers } from "../services/customersApi";
import { DROPDOWN_PAGE_SIZE, findCompanyGstin, getPartyBalance, normalizePartyName } from "../utils/voucherHelpers";
import { getDisplayValue } from "../utils/stockLookups";

export function usePartyBalance({ companyId, accessToken, isSupplierVoucher }) {
  const requestCompanyId = companyId;
  const [companyGstinResult, setCompanyGstinResult] = useState(null);
  const [partyBalance, setPartyBalance] = useState("");
  const [partyBalanceLoading, setPartyBalanceLoading] = useState(false);
  const [partyBalanceError, setPartyBalanceError] = useState("");
  const partyBalanceRequestRef = useRef(0);
  const partyBalanceEditedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    if (!requestCompanyId || !accessToken) {
      return undefined;
    }

    fetchCompanySettings(accessToken, requestCompanyId)
      .then((response) => {
        if (!mounted) return;
        const profile = extractCompanyProfile(response);
        setCompanyGstinResult({
          companyId: requestCompanyId,
          gstin: findCompanyGstin(profile) || findCompanyGstin(response),
          error: "",
        });
      })
      .catch((error) => {
        if (!mounted) return;
        setCompanyGstinResult({
          companyId: requestCompanyId,
          gstin: "",
          error:
            error instanceof Error
              ? error.message
              : "Unable to load the company GSTIN.",
        });
      });

    return () => {
      mounted = false;
    };
  }, [accessToken, requestCompanyId]);

  const fetchSelectedPartyBalance = async (partyName) => {
      const requestId = ++partyBalanceRequestRef.current;
      partyBalanceEditedRef.current = false;
      setPartyBalance("");
      setPartyBalanceError("");

      if (!partyName || !requestCompanyId || !accessToken) {
        setPartyBalanceLoading(false);
        return;
      }

      setPartyBalanceLoading(true);

      const [partyResult, ledgersResult] = await Promise.allSettled([
        isSupplierVoucher
          ? fetchSuppliers({
            companyId: requestCompanyId,
            accessToken,
            page: 1,
            limit: DROPDOWN_PAGE_SIZE,
            q: partyName,
          })
          : fetchCustomers({
            companyId: requestCompanyId,
            accessToken,
            page: 1,
            limit: DROPDOWN_PAGE_SIZE,
            q: partyName,
          }),
        fetchCompanyLedgers(accessToken, requestCompanyId, {
          page: 1,
          limit: DROPDOWN_PAGE_SIZE,
          q: partyName,
        }),
      ]);

      if (requestId !== partyBalanceRequestRef.current) return;

      const matchingEntries = [
        ...(partyResult.status === "fulfilled"
          ? isSupplierVoucher
            ? extractSuppliers(partyResult.value)
            : extractCustomers(partyResult.value)
          : []),
        ...(ledgersResult.status === "fulfilled"
          ? extractLedgers(ledgersResult.value)
          : []),
      ].filter((entry) => {
        const name = getDisplayValue(entry, [
          "name",
          "customerName",
          "partyName",
          "ledgerName",
          "displayName",
        ]);
        return normalizePartyName(name) === normalizePartyName(partyName);
      });
      const balance = matchingEntries
        .map(getPartyBalance)
        .find((value) => value !== null);

      if (balance !== undefined) {
        if (!partyBalanceEditedRef.current) setPartyBalance(balance);
        setPartyBalanceError("");
      } else if (
        partyResult.status === "rejected" &&
        ledgersResult.status === "rejected"
      ) {
        setPartyBalanceError(
          partyResult.reason?.message ||
          ledgersResult.reason?.message ||
          "Unable to load the selected party's closing balance.",
        );
      } else {
        setPartyBalanceError(
          "Closing balance is unavailable for the selected party.",
        );
      }

      setPartyBalanceLoading(false);
    };

  const resetSelectedPartyBalance = () => {
      partyBalanceRequestRef.current += 1;
      partyBalanceEditedRef.current = false;
      setPartyBalance("");
      setPartyBalanceLoading(false);
      setPartyBalanceError("");
    };

  return {
    companyGstinResult,
    partyBalance,
    setPartyBalance,
    partyBalanceLoading,
    setPartyBalanceLoading,
    partyBalanceError,
    setPartyBalanceError,
    partyBalanceEditedRef,
    partyBalanceRequestRef,
    fetchSelectedPartyBalance,
    resetSelectedPartyBalance,
  };
}

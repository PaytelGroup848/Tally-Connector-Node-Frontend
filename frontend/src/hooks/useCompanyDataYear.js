import { useEffect, useState } from "react";
import {
  extractCompanyDataYear,
  fetchCompanyDataYear,
} from "../services/companiesApi";
import useAuthStore from "../store/authStore";

export function isDateWithinCompanyDataYear(date, startDate, endDate) {
  return Boolean(
    date &&
      startDate &&
      endDate &&
      date >= startDate &&
      date <= endDate,
  );
}

export function useCompanyDataYear(companyId) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
    loading: true,
    error: "",
  });

  useEffect(() => {
    if (!companyId || !accessToken) {
      setDateRange({
        startDate: "",
        endDate: "",
        loading: false,
        error: "",
      });
      return undefined;
    }

    let active = true;
    setDateRange({
      startDate: "",
      endDate: "",
      loading: true,
      error: "",
    });

    fetchCompanyDataYear(accessToken, companyId)
      .then((response) => {
        if (!active) return;
        const { companyDataStartDate, companyDataEndDate } =
          extractCompanyDataYear(response);

        if (
          !companyDataStartDate ||
          !companyDataEndDate ||
          companyDataEndDate < companyDataStartDate
        ) {
          throw new Error("Company data-year dates are missing from the response.");
        }

        setDateRange({
          startDate: companyDataStartDate,
          endDate: companyDataEndDate,
          loading: false,
          error: "",
        });
      })
      .catch((error) => {
        if (!active) return;
        setDateRange({
          startDate: "",
          endDate: "",
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load the company data year.",
        });
      });

    return () => {
      active = false;
    };
  }, [accessToken, companyId]);

  return dateRange;
}

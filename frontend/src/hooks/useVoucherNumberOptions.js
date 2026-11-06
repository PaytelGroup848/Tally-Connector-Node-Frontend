import { useCallback, useEffect, useRef, useState } from "react";
import {
  extractVoucherNumbers,
  fetchCompanyVoucherNumbers,
} from "../services/companiesApi";
import useAuthStore from "../store/authStore";

const VOUCHER_NUMBER_PAGE_SIZE = 20;

const getVoucherNumber = (item) =>
  String(
    typeof item === "string"
      ? item
      : item?.name ?? item?.voucherNumber ?? item?.voucher_number ?? "",
  ).trim();

const getVoucherNumbers = (response) =>
  extractVoucherNumbers(response)
    .map(getVoucherNumber)
    .filter(Boolean)
    .filter((name, index, names) => names.indexOf(name) === index);

export function useVoucherNumberOptions(companyId) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [voucherNumberOptions, setVoucherNumberOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageState, setPageState] = useState({
    nextPage: 1,
    hasMore: false,
    loading: false,
    error: "",
    q: "",
  });
  const pageStateRef = useRef(pageState);
  const requestIdRef = useRef(0);

  const updatePageState = useCallback((nextState) => {
    pageStateRef.current = nextState;
    setPageState(nextState);
  }, []);

  useEffect(() => {
    const requestId = ++requestIdRef.current;
    if (!companyId || !accessToken) {
      setVoucherNumberOptions([]);
      setLoading(false);
      updatePageState({
        nextPage: 1,
        hasMore: false,
        loading: false,
        error: "",
        q: "",
      });
      return undefined;
    }

    let mounted = true;
    setVoucherNumberOptions([]);
    setLoading(true);
    updatePageState({
      nextPage: 1,
      hasMore: false,
      loading: false,
      error: "",
      q: "",
    });

    fetchCompanyVoucherNumbers(accessToken, companyId, {
      page: 1,
      limit: VOUCHER_NUMBER_PAGE_SIZE,
      q: "",
    })
      .then((response) => {
        if (!mounted || requestIdRef.current !== requestId) return;
        const items = getVoucherNumbers(response);
        const responsePage = response?.data || response;
        setVoucherNumberOptions(items);
        updatePageState({
          nextPage: responsePage?.nextPage || 2,
          hasMore:
            responsePage?.hasMore ?? items.length >= VOUCHER_NUMBER_PAGE_SIZE,
          loading: false,
          error: "",
          q: "",
        });
      })
      .catch((error) => {
        if (!mounted || requestIdRef.current !== requestId) return;
        updatePageState({
          nextPage: 1,
          hasMore: false,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load voucher numbers.",
          q: "",
        });
      })
      .finally(() => {
        if (mounted && requestIdRef.current === requestId) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [accessToken, companyId, updatePageState]);

  const searchOptions = useCallback(
    async (query) => {
      const normalizedQuery = String(query || "").trim();
      const requestId = ++requestIdRef.current;

      if (!normalizedQuery) {
        const currentPage = pageStateRef.current;
        setVoucherNumberOptions((options) =>
          currentPage.q ? [] : options,
        );
        updatePageState({
          nextPage: currentPage.q ? 2 : currentPage.nextPage,
          hasMore: currentPage.q
            ? false
            : currentPage.hasMore,
          loading: false,
          error: "",
          q: "",
        });
        if (currentPage.q) {
          fetchCompanyVoucherNumbers(accessToken, companyId, {
            page: 1,
            limit: VOUCHER_NUMBER_PAGE_SIZE,
            q: "",
          })
            .then((response) => {
              if (requestIdRef.current !== requestId) return;
              const items = getVoucherNumbers(response);
              const responsePage = response?.data || response;
              setVoucherNumberOptions(items);
              updatePageState({
                nextPage: responsePage?.nextPage || 2,
                hasMore:
                  responsePage?.hasMore ??
                  items.length >= VOUCHER_NUMBER_PAGE_SIZE,
                loading: false,
                error: "",
                q: "",
              });
            })
            .catch((error) => {
              if (requestIdRef.current !== requestId) return;
              updatePageState({
                nextPage: 1,
                hasMore: false,
                loading: false,
                error:
                  error instanceof Error
                    ? error.message
                    : "Unable to load voucher numbers.",
                q: "",
              });
            });
        }
        return;
      }

      setVoucherNumberOptions([]);
      updatePageState({
        nextPage: 1,
        hasMore: false,
        loading: true,
        error: "",
        q: normalizedQuery,
      });

      try {
        const response = await fetchCompanyVoucherNumbers(accessToken, companyId, {
          page: 1,
          limit: VOUCHER_NUMBER_PAGE_SIZE,
          q: normalizedQuery,
        });
        if (requestIdRef.current !== requestId) return;
        const items = getVoucherNumbers(response);
        const responsePage = response?.data || response;
        setVoucherNumberOptions(items);
        updatePageState({
          nextPage: responsePage?.nextPage || 2,
          hasMore:
            responsePage?.hasMore ?? items.length >= VOUCHER_NUMBER_PAGE_SIZE,
          loading: false,
          error: "",
          q: normalizedQuery,
        });
      } catch (error) {
        if (requestIdRef.current !== requestId) return;
        updatePageState({
          nextPage: 1,
          hasMore: false,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to search voucher numbers.",
          q: normalizedQuery,
        });
      }
    },
    [accessToken, companyId, updatePageState],
  );

  const loadMoreOptions = useCallback(async () => {
    const currentPage = pageStateRef.current;
    if (!currentPage.hasMore || currentPage.loading) return;
    const requestId = requestIdRef.current;
    updatePageState({ ...currentPage, loading: true, error: "" });

    try {
      const response = await fetchCompanyVoucherNumbers(accessToken, companyId, {
        page: currentPage.nextPage,
        limit: VOUCHER_NUMBER_PAGE_SIZE,
        q: currentPage.q,
      });
      if (requestIdRef.current !== requestId) return;
      const items = getVoucherNumbers(response);
      const responsePage = response?.data || response;
      setVoucherNumberOptions((currentOptions) => [
        ...currentOptions,
        ...items.filter((item) => !currentOptions.includes(item)),
      ]);
      updatePageState({
        nextPage: responsePage?.nextPage || currentPage.nextPage + 1,
        hasMore:
          responsePage?.hasMore ?? items.length >= VOUCHER_NUMBER_PAGE_SIZE,
        loading: false,
        error: "",
        q: currentPage.q,
      });
    } catch (error) {
      if (requestIdRef.current !== requestId) return;
      updatePageState({
        ...currentPage,
        loading: false,
        error:
          error instanceof Error
            ? error.message
            : "Unable to load more voucher numbers.",
      });
    }
  }, [accessToken, companyId, updatePageState]);

  return {
    voucherNumberOptions,
    loading,
    searchOptions,
    paginationProps: {
      infiniteScroll: true,
      hasMoreOptions: pageState.hasMore,
      loadingMore: pageState.loading,
      loadMoreError: pageState.error,
      loadError: pageState.error,
      onLoadMore: loadMoreOptions,
    },
  };
}

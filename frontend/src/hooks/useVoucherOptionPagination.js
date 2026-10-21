import { useCallback } from "react";
import {
  extractBatches, extractGodowns, extractLedgers, extractStockItems, extractVouchers,
  fetchCompanyBatches, fetchCompanyGodowns, fetchCompanyLedgers, fetchCompanyStock, fetchCompanyVouchers,
} from "../services/companiesApi";
import { extractCustomers, extractSuppliers, fetchCustomers, fetchSuppliers } from "../services/customersApi";
import { DROPDOWN_PAGE_SIZE } from "../utils/voucherHelpers";

export function useVoucherOptionPagination({ state, requestCompanyId, accessToken, enableVoucherDropdownPagination }) {
  const {
    setCustomers,
    setSuppliers,
    setStockItems,
    setVouchers,
    setLedgers,
    setGodowns,
    setBatches,
    optionPages,
    setOptionPages,
    optionPagesRef,
  } = state;

const updateOptionPage = useCallback(
  (source, pageState) => {
    const nextPages = {
      ...optionPagesRef.current,
      [source]: pageState,
    };
    optionPagesRef.current = nextPages;
    setOptionPages(nextPages);
  },
  [optionPagesRef, setOptionPages],
);

const loadMoreOptions = async (source) => {
      const currentPage = optionPagesRef.current[source];
      if (!currentPage?.hasMore || currentPage.loading) return;

      const sources = {
        vouchers: {
          fetch: () =>
            fetchCompanyVouchers(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
            }),
          extract: extractVouchers,
          setItems: setVouchers,
        },
        customers: {
          fetch: () =>
            fetchCustomers({
              companyId: requestCompanyId,
              accessToken,
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
            }),
          extract: extractCustomers,
          setItems: setCustomers,
        },
        suppliers: {
          fetch: () =>
            fetchSuppliers({
              companyId: requestCompanyId,
              accessToken,
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
            }),
          extract: extractSuppliers,
          setItems: setSuppliers,
        },
        stock: {
          fetch: () =>
            fetchCompanyStock(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
            }),
          extract: extractStockItems,
          setItems: setStockItems,
        },
        ledgers: {
          fetch: () =>
            fetchCompanyLedgers(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
            }),
          extract: extractLedgers,
          setItems: setLedgers,
        },
        batches: {
          fetch: () =>
            fetchCompanyBatches(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
            }),
          extract: extractBatches,
          setItems: setBatches,
        },
        godowns: {
          fetch: () =>
            fetchCompanyGodowns(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
            }),
          extract: extractGodowns,
          setItems: setGodowns,
        },
      };
      const sourceConfig = sources[source];
      if (!sourceConfig) {
        throw new Error(`Unsupported dropdown option source: ${source}`);
      }

      updateOptionPage(source, { ...currentPage, loading: true, error: "" });

      try {
        const response = await sourceConfig.fetch();
        const items = sourceConfig.extract(response);
        sourceConfig.setItems((existingItems) => [...existingItems, ...items]);
        updateOptionPage(source, {
          nextPage: currentPage.nextPage + 1,
          hasMore: items.length >= DROPDOWN_PAGE_SIZE,
          loading: false,
          error: "",
        });
      } catch (error) {
        updateOptionPage(source, {
          ...currentPage,
          loading: false,
          error:
            error instanceof Error
              ? error.message
              : "Unable to load more dropdown options.",
        });
      }
    };

const getPaginationProps = (source) => {
      const sources = Array.isArray(source) ? source : [source];
      const pageStates = sources
        .map((sourceName) => optionPages[sourceName])
        .filter(Boolean);
      return {
        infiniteScroll: enableVoucherDropdownPagination,
        hasMoreOptions:
          enableVoucherDropdownPagination &&
          pageStates.some((pageState) => pageState.hasMore),
        loadingMore:
          enableVoucherDropdownPagination &&
          pageStates.some((pageState) => pageState.loading),
        loadMoreError: enableVoucherDropdownPagination
          ? pageStates.find((pageState) => pageState.error)?.error || ""
          : "",
        loadError:
          pageStates.find((pageState) => pageState.loadError)?.loadError ||
          pageStates.find((pageState) => pageState.error)?.error ||
          "",
        onLoadMore: enableVoucherDropdownPagination
          ? () => Promise.all(sources.map(loadMoreOptions))
          : undefined,
      };
    };

const getNativeDropdownPaginationProps = (source) => ({
      onScroll: (event) => {
        const dropdown = event.currentTarget;
        if (
          dropdown.scrollTop + dropdown.clientHeight >=
          dropdown.scrollHeight - 24
        ) {
          loadMoreOptions(source);
        }
      },
    });

const loadMoreOnNativeDropdownSelection = (event, source) => {
      if (
        event.currentTarget.selectedIndex >=
        event.currentTarget.options.length - 2
      ) {
        loadMoreOptions(source);
      }
    };

  return { updateOptionPage, loadMoreOptions, getPaginationProps, getNativeDropdownPaginationProps, loadMoreOnNativeDropdownSelection };
}

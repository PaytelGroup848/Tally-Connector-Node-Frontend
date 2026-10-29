import { useCallback, useEffect, useRef } from "react";
import {
  extractBatches, extractGodowns, extractLedgers, extractStockItems, extractVouchers,
  fetchCompanyBatches, fetchCompanyGodowns, fetchCompanyLedgers, fetchCompanyStock, fetchCompanyVouchers,
} from "../services/companiesApi";
import { extractCustomers, extractSuppliers, fetchCustomers, fetchSuppliers } from "../services/customersApi";
import { DROPDOWN_PAGE_SIZE } from "../utils/voucherHelpers";

const getOptionKey = (item) => {
  if (typeof item === "string") return item;

  const name =
    item?.name ||
    item?.ledgerName ||
    item?.itemName ||
    item?.godownName ||
    item?.batchName ||
    item?.voucherNumber ||
    item?.partyName;
  return name ? String(name) : JSON.stringify(item);
};

const appendUniqueOptions = (existingItems, newItems) => {
  const existingKeys = new Set(existingItems.map(getOptionKey));
  return [
    ...existingItems,
    ...newItems.filter((item) => !existingKeys.has(getOptionKey(item))),
  ];
};

export function useVoucherOptionPagination({ state, requestCompanyId, accessToken, enableVoucherDropdownPagination }) {
  const {
    setCustomers,
    setSuppliers,
    setStockItems,
    setVouchers,
    setLedgers,
    setGodowns,
    setBatches,
    setDropdownSearchOptions,
    setDropdownSearchQueries,
    optionPages,
    setOptionPages,
    optionPagesRef,
  } = state;
  const searchRequestsRef = useRef({});
  const searchBasePagesRef = useRef({});

  useEffect(() => {
    searchBasePagesRef.current = {};
    ["customers", "suppliers", "ledgers", "stock", "godowns", "batches", "vouchers"].forEach((source) => {
      searchRequestsRef.current[source] =
        (searchRequestsRef.current[source] || 0) + 1;
    });
    setDropdownSearchOptions({});
    setDropdownSearchQueries({});
  }, [accessToken, requestCompanyId, setDropdownSearchOptions, setDropdownSearchQueries]);

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
      const requestId = searchRequestsRef.current[source];

      const sources = {
        vouchers: {
          fetch: () =>
            fetchCompanyVouchers(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
              q: currentPage.q || "",
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
              q: currentPage.q || "",
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
              q: currentPage.q || "",
            }),
          extract: extractSuppliers,
          setItems: setSuppliers,
        },
        stock: {
          fetch: () =>
            fetchCompanyStock(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
              q: currentPage.q || "",
            }),
          extract: extractStockItems,
          setItems: setStockItems,
        },
        ledgers: {
          fetch: () =>
            fetchCompanyLedgers(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
              q: currentPage.q || "",
            }),
          extract: extractLedgers,
          setItems: setLedgers,
        },
        batches: {
          fetch: () =>
            fetchCompanyBatches(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
              q: currentPage.q || "",
            }),
          extract: extractBatches,
          setItems: setBatches,
        },
        godowns: {
          fetch: () =>
            fetchCompanyGodowns(accessToken, requestCompanyId, {
              page: currentPage.nextPage,
              limit: DROPDOWN_PAGE_SIZE,
              q: currentPage.q || "",
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
        if (searchRequestsRef.current[source] !== requestId) return;
        const items = sourceConfig.extract(response);
        const appendItems = (existingItems) => [...existingItems, ...items];
        if (currentPage.q) {
          setDropdownSearchOptions((existingOptions) => ({
            ...existingOptions,
            [source]: appendUniqueOptions(
              existingOptions[source] || [],
              items,
            ),
          }));
          sourceConfig.setItems((existingItems) =>
            appendUniqueOptions(existingItems, items),
          );
        } else {
          sourceConfig.setItems(appendItems);
        }
        updateOptionPage(source, {
          nextPage: currentPage.nextPage + 1,
          hasMore: items.length >= DROPDOWN_PAGE_SIZE,
          loading: false,
          error: "",
          q: currentPage.q || "",
        });
      } catch (error) {
        if (searchRequestsRef.current[source] !== requestId) return;
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

const searchOptions = async (sources, query) => {
      const sourceNames = Array.isArray(sources) ? sources : [sources];
      const normalizedQuery = String(query || "").trim();

      if (!normalizedQuery) {
        sourceNames.forEach((source) => {
          searchRequestsRef.current[source] =
            (searchRequestsRef.current[source] || 0) + 1;
          setDropdownSearchOptions((existingOptions) => ({
            ...existingOptions,
            [source]: [],
          }));
          setDropdownSearchQueries((existingQueries) => ({
            ...existingQueries,
            [source]: "",
          }));
          const currentPage = optionPagesRef.current[source];
          if (currentPage) {
            updateOptionPage(source, {
              ...currentPage,
              ...(searchBasePagesRef.current[source] || {}),
              loading: false,
              error: "",
              loadError: "",
              q: "",
            });
          }
          delete searchBasePagesRef.current[source];
        });
        return;
      }

      await Promise.all(sourceNames.map(async (source) => {
        const requestId = (searchRequestsRef.current[source] || 0) + 1;
        searchRequestsRef.current[source] = requestId;

        const currentPage = optionPagesRef.current[source] || {
          nextPage: 1,
          hasMore: false,
          loading: false,
          error: "",
        };
        if (!searchBasePagesRef.current[source]) {
          searchBasePagesRef.current[source] = { ...currentPage };
        }
        setDropdownSearchQueries((existingQueries) => ({
          ...existingQueries,
          [source]: normalizedQuery,
        }));
        const sourceConfig = {
          customers: {
            fetch: () =>
              fetchCustomers({
                companyId: requestCompanyId,
                accessToken,
                page: 1,
                limit: DROPDOWN_PAGE_SIZE,
                q: normalizedQuery,
              }),
            extract: extractCustomers,
            setItems: (items) =>
              setDropdownSearchOptions((existingOptions) => ({
                ...existingOptions,
                [source]: items,
              })),
            appendItems: setCustomers,
          },
          suppliers: {
            fetch: () =>
              fetchSuppliers({
                companyId: requestCompanyId,
                accessToken,
                page: 1,
                limit: DROPDOWN_PAGE_SIZE,
                q: normalizedQuery,
              }),
            extract: extractSuppliers,
            setItems: (items) =>
              setDropdownSearchOptions((existingOptions) => ({
                ...existingOptions,
                [source]: items,
              })),
            appendItems: setSuppliers,
          },
          ledgers: {
            fetch: () =>
              fetchCompanyLedgers(accessToken, requestCompanyId, {
                page: 1,
                limit: DROPDOWN_PAGE_SIZE,
                q: normalizedQuery,
              }),
            extract: extractLedgers,
            setItems: (items) =>
              setDropdownSearchOptions((existingOptions) => ({
                ...existingOptions,
                [source]: items,
              })),
            appendItems: setLedgers,
          },
          stock: {
            fetch: () =>
              fetchCompanyStock(accessToken, requestCompanyId, {
                page: 1,
                limit: DROPDOWN_PAGE_SIZE,
                q: normalizedQuery,
              }),
            extract: extractStockItems,
            setItems: (items) =>
              setDropdownSearchOptions((existingOptions) => ({
                ...existingOptions,
                [source]: items,
              })),
            appendItems: setStockItems,
          },
          godowns: {
            fetch: () =>
              fetchCompanyGodowns(accessToken, requestCompanyId, {
                page: 1,
                limit: DROPDOWN_PAGE_SIZE,
                q: normalizedQuery,
              }),
            extract: extractGodowns,
            setItems: (items) =>
              setDropdownSearchOptions((existingOptions) => ({
                ...existingOptions,
                [source]: items,
              })),
            appendItems: setGodowns,
          },
          batches: {
            fetch: () =>
              fetchCompanyBatches(accessToken, requestCompanyId, {
                page: 1,
                limit: DROPDOWN_PAGE_SIZE,
                q: normalizedQuery,
              }),
            extract: extractBatches,
            setItems: (items) =>
              setDropdownSearchOptions((existingOptions) => ({
                ...existingOptions,
                [source]: items,
              })),
            appendItems: setBatches,
          },
          vouchers: {
            fetch: () =>
              fetchCompanyVouchers(accessToken, requestCompanyId, {
                page: 1,
                limit: DROPDOWN_PAGE_SIZE,
                q: normalizedQuery,
              }),
            extract: extractVouchers,
            setItems: (items) =>
              setDropdownSearchOptions((existingOptions) => ({
                ...existingOptions,
                [source]: items,
              })),
            appendItems: setVouchers,
          },
        }[source];

        if (!sourceConfig) {
          throw new Error(`Unsupported dropdown search source: ${source}`);
        }

        sourceConfig.setItems([]);
        updateOptionPage(source, {
          ...currentPage,
          nextPage: 1,
          hasMore: false,
          loading: true,
          error: "",
          loadError: "",
          q: normalizedQuery,
        });

        try {
          const response = await sourceConfig.fetch();
          if (searchRequestsRef.current[source] !== requestId) return;
          const items = sourceConfig.extract(response);
          sourceConfig.setItems(items);
          sourceConfig.appendItems((existingItems) =>
            appendUniqueOptions(existingItems, items),
          );
          updateOptionPage(source, {
            nextPage: 2,
            hasMore: items.length >= DROPDOWN_PAGE_SIZE,
            loading: false,
            error: "",
            loadError: "",
            q: normalizedQuery,
          });
        } catch (error) {
          if (searchRequestsRef.current[source] !== requestId) return;
          updateOptionPage(source, {
            nextPage: 1,
            hasMore: false,
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Unable to search dropdown options.",
            loadError:
              error instanceof Error
                ? error.message
                : "Unable to search dropdown options.",
            q: normalizedQuery,
          });
        }
      }));
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

  return { updateOptionPage, loadMoreOptions, searchOptions, getPaginationProps, getNativeDropdownPaginationProps, loadMoreOnNativeDropdownSelection };
}

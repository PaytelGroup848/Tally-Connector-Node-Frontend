import { useCallback, useEffect, useRef, useState } from "react";
import useAuthStore from "../store/authStore";
import {
  extractBank,
  extractLedgers,
  fetchCompanyBank,
  fetchCompanyLedgers,
} from "../services/companiesApi";
import { extractParties, fetchParties } from "../services/partiesApi";
import {
  getJournalTotalsInPaise,
  getPartyBalance,
  normalizePartyName,
} from "../utils/voucherHelpers";
import { SearchableDropdown } from "./SearchableDropdown";

// Shares identical party API requests across initial loading, row searches,
// pagination and closing-balance lookups.
const PARTY_CACHE_TTL = 30 * 1000;
const PARTY_CACHE_MAX_SIZE = 100;
const partyRequestCache = new Map();

const fetchPartiesCached = ({
  accessToken,
  companyId,
  page = 1,
  limit = 20,
  q = "",
}) => {
  const normalizedQuery = String(q ?? "").trim();
  const cacheKey = JSON.stringify([
    companyId,
    accessToken,
    page,
    limit,
    normalizedQuery,
  ]);
  const now = Date.now();
  const cachedEntry = partyRequestCache.get(cacheKey);

  if (cachedEntry?.promise) {
    return cachedEntry.promise;
  }

  if (cachedEntry?.data && cachedEntry.expiresAt > now) {
    return Promise.resolve(cachedEntry.data);
  }

  const request = fetchParties({
    accessToken,
    companyId,
    page,
    limit,
    q: normalizedQuery,
  })
    .then((response) => {
      partyRequestCache.set(cacheKey, {
        data: response,
        expiresAt: Date.now() + PARTY_CACHE_TTL,
      });
      return response;
    })
    .catch((error) => {
      // Do not cache failures; the next call should be able to retry.
      partyRequestCache.delete(cacheKey);
      throw error;
    });

  partyRequestCache.set(cacheKey, { promise: request });

  // Keep the cache bounded. Map preserves insertion order.
  if (partyRequestCache.size > PARTY_CACHE_MAX_SIZE) {
    const oldestKey = partyRequestCache.keys().next().value;
    if (oldestKey !== cacheKey) {
      partyRequestCache.delete(oldestKey);
    }
  }

  return request;
};


const getPartyOptions = (response) =>
  extractParties(response)
    .map((party) =>
      typeof party === "string"
        ? party
        : party?.name ??
          party?.partyName ??
          party?.party_name ??
          party?.ledgerName ??
          party?.displayName ??
          party?.customerName ??
          party?.supplierName ??
          "",
    )
    .map((name) => String(name).trim())
    .filter(Boolean)
    .filter((name, index, names) => names.indexOf(name) === index);

const appendUniquePartyOptions = (currentOptions, newOptions) => {
  const existingNames = new Set(
    currentOptions.map((name) => normalizePartyName(name)),
  );
  return [
    ...currentOptions,
    ...newOptions.filter((name) => {
      const normalizedName = normalizePartyName(name);
      if (existingNames.has(normalizedName)) return false;
      existingNames.add(normalizedName);
      return true;
    }),
  ];
};

const getEntryName = (entry) =>
  typeof entry === "string"
    ? entry
    : entry?.name ??
      entry?.partyName ??
      entry?.party_name ??
      entry?.ledgerName ??
      entry?.ledger_name ??
      entry?.displayName ??
      entry?.customerName ??
      entry?.supplierName ??
      entry?.bankName ??
      entry?.accountName ??
      "";

const getMatchingBalance = (entries, name) => {
  const normalizedName = normalizePartyName(name);
  const match = entries.find(
    (entry) => normalizePartyName(getEntryName(entry)) === normalizedName,
  );
  return match ? getPartyBalance(match) : null;
};

export function JournalVoucherContent({
  companyId,
  voucherType,
  rows,
  companyDataStartDate,
  companyDataEndDate,
  companyDataYearLoading,
  companyDataYearError,
  voucherNumberOptions,
  voucherNumberPaginationProps,
  searchVoucherNumbers,
  voucherNumbersLoading,
  selectedVoucherNumber,
  setSelectedVoucherNumber,
  clearToken,
  onAddRow,
  onRemoveRow,
  onRowChange,
}) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [companyBanks, setCompanyBanks] = useState([]);
  const [bankSearchOptions, setBankSearchOptions] = useState(null);
  const [bankSearchLoading, setBankSearchLoading] = useState(false);
  const [bankSearchError, setBankSearchError] = useState("");
  const [banksLoading, setBanksLoading] = useState(false);
  const bankSearchRequestRef = useRef(0);
  const [partyOptions, setPartyOptions] = useState([]);
  const [partyLoading, setPartyLoading] = useState(true);
  const [partyLoadError, setPartyLoadError] = useState("");
  const [partySearchStates, setPartySearchStates] = useState({});
  const partySearchRequestsRef = useRef(new Map());
  const partyLoadMoreRequestsRef = useRef(new Map());
  const partyPaginationRef = useRef(new Map());
  const [rowBalances, setRowBalances] = useState({});
  const rowBalanceRequestsRef = useRef(new Map());

  const { debit: debitTotal, credit: creditTotal } =
    getJournalTotalsInPaise(rows);

  const searchParties = useCallback(
    async (rowId, query) => {
      const requestId =
        (partySearchRequestsRef.current.get(rowId) || 0) + 1;
      partySearchRequestsRef.current.set(rowId, requestId);
      partyPaginationRef.current.set(rowId, {
        query: String(query || "").trim(),
        page: 0,
        hasMore: false,
      });

      if (!accessToken || !companyId) {
        setPartySearchStates((currentStates) => ({
          ...currentStates,
          [rowId]: { options: [], loading: false, error: "" },
        }));
        return;
      }

      setPartySearchStates((currentStates) => ({
        ...currentStates,
        [rowId]: {
          ...currentStates[rowId],
          loading: true,
          error: "",
          loadingMore: false,
          loadRequestToken: null,
        },
      }));

      try {
        const response = await fetchPartiesCached({
          accessToken,
          companyId,
          page: 1,
          limit: 20,
          q: String(query || "").trim(),
        });

        if (partySearchRequestsRef.current.get(rowId) !== requestId) return;

        const options = getPartyOptions(response);
        partyPaginationRef.current.set(rowId, {
          query: String(query || "").trim(),
          page: 1,
          hasMore: options.length >= 20,
        });
        setPartySearchStates((currentStates) => ({
          ...currentStates,
          [rowId]: {
            options,
            loading: false,
            error: "",
            q: String(query || "").trim(),
            page: 1,
            hasMore: options.length >= 20,
            loadingMore: false,
            loadMoreError: "",
          },
        }));
      } catch (error) {
        if (partySearchRequestsRef.current.get(rowId) !== requestId) return;
        partyPaginationRef.current.set(rowId, {
          query: String(query || "").trim(),
          page: 0,
          hasMore: false,
        });
        setPartySearchStates((currentStates) => ({
          ...currentStates,
          [rowId]: {
            ...currentStates[rowId],
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : "Unable to load parties.",
            loadingMore: false,
          },
        }));
      }
    },
    [accessToken, companyId],
  );

  const loadMoreParties = async (rowId) => {
    const searchState = partySearchStates[rowId];
    const pagination = partyPaginationRef.current.get(rowId);
    const currentOptions = searchState?.options ?? partyOptions;
    const hasMore =
      pagination?.hasMore ??
      searchState?.hasMore ??
      currentOptions.length >= 20;

    if (
      !hasMore ||
      searchState?.loading ||
      searchState?.loadingMore ||
      partyLoadMoreRequestsRef.current.has(rowId) ||
      !accessToken ||
      !companyId
    ) {
      return;
    }

    const requestId = partySearchRequestsRef.current.get(rowId) || 0;
    const page = (pagination?.page ?? searchState?.page ?? 1) + 1;
    const query = pagination?.query ?? searchState?.q ?? "";
    const requestToken = Symbol(rowId);
    partyPaginationRef.current.set(rowId, {
      query,
      page,
      hasMore: true,
    });
    partyLoadMoreRequestsRef.current.set(rowId, requestToken);
    setPartySearchStates((currentStates) => ({
      ...currentStates,
      [rowId]: {
        ...currentStates[rowId],
        options: currentStates[rowId]?.options ?? partyOptions,
        q: currentStates[rowId]?.q ?? "",
        page: currentStates[rowId]?.page ?? 1,
        hasMore: currentStates[rowId]?.hasMore ?? partyOptions.length >= 20,
        loadingMore: true,
        loadMoreError: "",
        loadRequestToken: requestToken,
      },
    }));

    try {
      const response = await fetchPartiesCached({
        accessToken,
        companyId,
        page,
        limit: 20,
        q: query,
      });

      if (partySearchRequestsRef.current.get(rowId) !== requestId) return;

      const newOptions = getPartyOptions(response);
      setPartySearchStates((currentStates) => {
        const latestState = currentStates[rowId];
        const currentPageOptions = latestState?.options ?? partyOptions;
        const options = appendUniquePartyOptions(currentPageOptions, newOptions);
        const hasMore =
          newOptions.length >= 20 &&
          options.length > currentPageOptions.length;
        partyPaginationRef.current.set(rowId, {
          query,
          page,
          hasMore,
        });
        return {
          ...currentStates,
          [rowId]: {
            ...latestState,
            options,
            page,
            hasMore,
            loadMoreError: "",
          },
        };
      });
    } catch (error) {
      if (partySearchRequestsRef.current.get(rowId) !== requestId) return;
      partyPaginationRef.current.set(rowId, {
        query,
        page: page - 1,
        hasMore: true,
      });
      setPartySearchStates((currentStates) => ({
        ...currentStates,
        [rowId]: {
          ...currentStates[rowId],
          loadMoreError:
            error instanceof Error
              ? error.message
              : "Unable to load more parties.",
        },
      }));
    } finally {
      if (partyLoadMoreRequestsRef.current.get(rowId) === requestToken) {
        partyLoadMoreRequestsRef.current.delete(rowId);
      }
      setPartySearchStates((currentStates) => {
        const currentState = currentStates[rowId];
        if (currentState?.loadRequestToken !== requestToken) {
          return currentStates;
        }

        return {
          ...currentStates,
          [rowId]: {
            ...currentState,
            loadingMore: false,
            loadRequestToken: null,
          },
        };
      });
    }
  };

  const resetPartySearch = (rowId) => {
    partySearchRequestsRef.current.set(
      rowId,
      (partySearchRequestsRef.current.get(rowId) || 0) + 1,
    );
    partyPaginationRef.current.delete(rowId);
    setPartySearchStates((currentStates) => {
      const nextStates = { ...currentStates };
      delete nextStates[rowId];
      return nextStates;
    });
  };

  useEffect(() => {
    let active = true;

    const loadInitialParties = async () => {
      if (!active) return;

      if (!accessToken || !companyId) {
        setPartyOptions([]);
        setPartyLoading(false);
        setPartyLoadError("");
        return;
      }

      setPartyLoadError("");

      try {
        const response = await fetchPartiesCached({
          accessToken,
          companyId,
          page: 1,
          limit: 20,
          q: "",
        });

        if (!active) return;
        setPartyOptions(getPartyOptions(response));
      } catch (error) {
        if (!active) return;
        setPartyOptions([]);
        setPartyLoadError(
          error instanceof Error ? error.message : "Unable to load parties.",
        );
      } finally {
        if (active) setPartyLoading(false);
      }
    };

    loadInitialParties();
    return () => {
      active = false;
      partySearchRequestsRef.current.forEach((requestId, rowId) => {
        partySearchRequestsRef.current.set(rowId, requestId + 1);
      });
    };
  }, [accessToken, companyId]);

  useEffect(() => {
    bankSearchRequestRef.current += 1;
    setBankSearchOptions(null);
    setBankSearchLoading(false);
    setBankSearchError("");
    let active = true;

    const loadBanks = async () => {
      if (!accessToken || !companyId) {
        setCompanyBanks([]);
        setBanksLoading(false);
        return;
      }

      setBanksLoading(true);

      try {
        const response = await fetchCompanyBank(accessToken, companyId, {
          page: 1,
          limit: 100, // Contra ke liye zyada bank chahiye ho sakte hain
          q: "",
        });

        // extractBank() already tumhare companiesApi.js mein defined hai
        const banks = extractBank(response);

        if (active) setCompanyBanks(banks);
      } catch (error) {
        console.error("Failed to fetch Contra banks:", error);
        if (active) setCompanyBanks([]);
      } finally {
        if (active) setBanksLoading(false);
      }
    };

    loadBanks();
    return () => {
      active = false;
    };
  }, [accessToken, companyId]);

  const searchBanks = async (query) => {
    const normalizedQuery = String(query || "").trim();
    const requestId = ++bankSearchRequestRef.current;
    if (!normalizedQuery) {
      setBankSearchOptions(null);
      setBankSearchLoading(false);
      setBankSearchError("");
      return;
    }

    setBankSearchOptions([]);
    setBankSearchLoading(true);
    setBankSearchError("");
    try {
      const response = await fetchCompanyBank(accessToken, companyId, {
        page: 1,
        limit: 100,
        q: normalizedQuery,
      });
      if (bankSearchRequestRef.current !== requestId) return;
      setBankSearchOptions(extractBank(response));
    } catch (error) {
      if (bankSearchRequestRef.current !== requestId) return;
      setBankSearchError(
        error instanceof Error ? error.message : "Unable to search bank accounts.",
      );
    } finally {
      if (bankSearchRequestRef.current === requestId) {
        setBankSearchLoading(false);
      }
    }
  };

  const clearRowBalance = (rowId) => {
    rowBalanceRequestsRef.current.set(
      rowId,
      (rowBalanceRequestsRef.current.get(rowId) || 0) + 1,
    );
    setRowBalances((currentBalances) => ({
      ...currentBalances,
      [rowId]: { value: "", loading: false, error: "" },
    }));
  };

  const fetchRowClosingBalance = async (rowId, name) => {
    const requestId = (rowBalanceRequestsRef.current.get(rowId) || 0) + 1;
    rowBalanceRequestsRef.current.set(rowId, requestId);
    setRowBalances((currentBalances) => ({
      ...currentBalances,
      [rowId]: { value: "", loading: true, error: "" },
    }));

    if (!name || !companyId || !accessToken) {
      setRowBalances((currentBalances) => ({
        ...currentBalances,
        [rowId]: { value: "", loading: false, error: "" },
      }));
      return;
    }

    const isContra = voucherType === "Contra";
    const normalizedName = String(name).trim();
    const lookups = isContra
      ? [
          fetchCompanyLedgers(accessToken, companyId, {
            page: 1,
            limit: 20,
            q: normalizedName,
          }),
          ...(normalizedName.toUpperCase() === "CASH"
            ? []
            : [
                fetchCompanyBank(accessToken, companyId, {
                  page: 1,
                  limit: 20,
                  q: normalizedName,
                }),
              ]),
        ]
      : [
          fetchPartiesCached({
            accessToken,
            companyId,
            page: 1,
            limit: 20,
            q: normalizedName,
          }),
          fetchCompanyLedgers(accessToken, companyId, {
            page: 1,
            limit: 20,
            q: normalizedName,
          }),
        ];

    const results = await Promise.allSettled(lookups);
    if (rowBalanceRequestsRef.current.get(rowId) !== requestId) return;

    const entries = results.flatMap((result, index) => {
      if (result.status !== "fulfilled") return [];
      if (isContra) {
        return index === 0
          ? extractLedgers(result.value)
          : extractBank(result.value);
      }
      return index === 0
        ? extractParties(result.value)
        : extractLedgers(result.value);
    });
    const balance = getMatchingBalance(entries, normalizedName);
    const allLookupsFailed = results.every(
      (result) => result.status === "rejected",
    );

    setRowBalances((currentBalances) => ({
      ...currentBalances,
      [rowId]: {
        value: balance ?? "",
        loading: false,
        error:
          balance !== null
            ? ""
            : allLookupsFailed
              ? results.find((result) => result.status === "rejected").reason
                  ?.message ||
                "Unable to load the selected closing balance."
              : "Closing balance is unavailable for the selected account.",
      },
    }));
  };

  const hasEnteredAmount = rows.some(
    (row) => String(row.amount ?? "").trim() !== "",
  );

  const amountsDoNotMatch = hasEnteredAmount && debitTotal !== creditTotal;



  const renderParticularSection = (type) => {
    const sectionRows = rows.filter((row) => row.type === type);

    return (
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-100 px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            {type} Particulars
          </span>
          <button
            type="button"
            onClick={() => onAddRow(type)}
            className="rounded-md bg-[#dff4e4] px-2 py-1 text-sm font-bold text-green-700"
            aria-label={`Add ${type.toLowerCase()} particular`}
          >
            +
          </button>
        </div>

        <div className="grid min-w-[920px] grid-cols-[1fr_1.4fr_1fr_1fr_40px] gap-2 bg-slate-100 p-2 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          <span>Type</span>
          <span>
            {voucherType === "Contra" ? "Transaction Type" : "Party Name"}
          </span>
          <span>Amount</span>
          <span>Closing Balance</span>
          <span />
        </div>

        {sectionRows.map((row) => (
          <div
            key={row.id}
            className="grid min-w-[920px] grid-cols-[1fr_1.4fr_1fr_1fr_40px] gap-2 border-t border-slate-200 bg-white p-2"
          >
            <input
              value={type}
              readOnly
              aria-label={`${type} entry type`}
              className="min-h-9 rounded-md border border-slate-300 bg-slate-50 px-2 text-xs font-semibold text-slate-700 outline-none"
            />

            {voucherType === "Contra" ? (
              <SearchableDropdown
                name={`transactionType-${row.id}`}
                label="transaction type"
                options={[
                  "CASH",
                  ...(bankSearchOptions ?? companyBanks)
                    .map(
                      (bank) =>
                        bank.name ??
                        bank.ledgerName ??
                        bank.bankName ??
                        bank.accountName ??
                        "",
                    )
                    .filter(Boolean),
                ].filter(
                  (value, index, array) => array.indexOf(value) === index,
                )}
                placeholder={
                  banksLoading || bankSearchLoading
                    ? "Loading bank accounts..."
                    : "Select transaction type"
                }
                loading={banksLoading || bankSearchLoading}
                loadError={bankSearchError}
                onInputChange={searchBanks}
                onSelect={(value) => {
                  onRowChange(row.id, "partyName", value);
                  clearRowBalance(row.id);
                }}
                onOptionSelect={(value) =>
                  fetchRowClosingBalance(row.id, value)
                }
                disabled={banksLoading}
                value={row.partyName || ""}
                onClear={() => {
                  onRowChange(row.id, "partyName", "");
                  clearRowBalance(row.id);
                }}
              />
            ) : (
              <SearchableDropdown
                name={`journalPartyName-${row.id}`}
                label="parties"
                options={partySearchStates[row.id]?.options ?? partyOptions}
                serverSideFiltering
                loading={
                  partyLoading || partySearchStates[row.id]?.loading
                }
                loadError={
                  partySearchStates[row.id]?.error || partyLoadError
                }
                onInputChange={(query) => searchParties(row.id, query)}
                hasMoreOptions={
                  partySearchStates[row.id]?.hasMore ??
                  partyOptions.length >= 20
                }
                loadingMore={Boolean(
                  partySearchStates[row.id]?.loadingMore,
                )}
                loadMoreError={
                  partySearchStates[row.id]?.loadMoreError || ""
                }
                onLoadMore={() => loadMoreParties(row.id)}
                onOptionSelect={(value) => {
                  onRowChange(row.id, "partyName", value);
                  clearRowBalance(row.id);
                  resetPartySearch(row.id);
                  fetchRowClosingBalance(row.id, value);
                }}
                value={row.partyName}
                onClear={() => {
                  onRowChange(row.id, "partyName", "");
                  resetPartySearch(row.id);
                  clearRowBalance(row.id);
                }}
                placeholder="Select Party Name"
              />
            )}

            <input
              name={`journalAmount-${row.id}`}
              type="number"
              min="0"
              step="1"
              value={row.amount ?? ""}
              onChange={(event) =>
                onRowChange(row.id, "amount", event.target.value)
              }
              className="min-h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
              placeholder="Amount"
            />
            <div>
              <input
                name={`journalClosingBalance-${row.id}`}
                type="text"
                value={rowBalances[row.id]?.value ?? ""}
                readOnly
                aria-label={`${type} closing balance`}
                aria-describedby={
                  rowBalances[row.id]?.error
                    ? `journalClosingBalanceError-${row.id}`
                    : undefined
                }
                className="min-h-9 w-full rounded-md border border-slate-300 bg-slate-50 px-2 text-xs text-slate-700 outline-none"
                placeholder={
                  rowBalances[row.id]?.loading
                    ? "Loading..."
                    : "Closing Balance"
                }
              />
              {rowBalances[row.id]?.error && (
                <span
                  id={`journalClosingBalanceError-${row.id}`}
                  className="text-xs text-red-600"
                  role="status"
                >
                  {rowBalances[row.id].error}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => onRemoveRow(row.id)}
              disabled={sectionRows.length === 1}
              className="min-h-9 rounded-md border border-slate-200 bg-slate-100 text-lg text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Remove ${type.toLowerCase()} particular`}
            >
              ×
            </button>
          </div>
        ))}
      </section>
    );
  };

  return (
    <>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Voucher Type</span>
          <input
            name="voucherType"
            value={voucherType}
            readOnly
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Voucher No (optional)</span>
          <SearchableDropdown
            name="voucherNumber"
            label="voucher numbers"
            options={voucherNumberOptions}
            {...voucherNumberPaginationProps}
            onInputChange={searchVoucherNumbers}
            loading={voucherNumbersLoading}
            value={selectedVoucherNumber}
            onSelect={setSelectedVoucherNumber}
            resetToken={clearToken}
            placeholder="Voucher number"
          />
        </label>

        <label className="flex min-w-0 flex-col gap-1 text-xs font-medium text-slate-700">
          <span>Date</span>
          <input
            name="date"
            type="date"
            required
            defaultValue=""
            min={companyDataStartDate || undefined}
            max={companyDataEndDate || undefined}
            disabled={
              companyDataYearLoading ||
              Boolean(companyDataYearError) ||
              !companyDataStartDate ||
              !companyDataEndDate
            }
            className="min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
          />
          {companyDataYearLoading && (
            <span className="text-xs text-slate-500">
              Loading company date range...
            </span>
          )}
          {companyDataYearError && (
            <span className="text-xs text-red-600" role="status">
              Unable to load company data year: {companyDataYearError}
            </span>
          )}
        </label>
      </div>

      <div className="mt-5 space-y-4 overflow-x-auto">
        {renderParticularSection("Debit")}
        {renderParticularSection("Credit")}
      </div>

      {amountsDoNotMatch && (
        <div
          role="alert"
          aria-live="polite"
          className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-3 text-sm text-red-700"
        >
          <p className="font-semibold">
            Note: Debit and Credit amounts must be the same.
          </p>
        </div>
      )}

      <label className="mt-5 block text-xs font-semibold text-slate-700">
        <span>Narration</span>
        <textarea
          name="narration"
          rows="3"
          placeholder="Enter Narration"
          className="mt-2 min-h-[84px] w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-700 outline-none placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100"
        />
      </label>
    </>
  );
}

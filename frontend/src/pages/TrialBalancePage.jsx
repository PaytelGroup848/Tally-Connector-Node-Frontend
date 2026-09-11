
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import useAuthStore from '../store/authStore';
import {
  extractTrialBalanceRows,
  extractTrialBalancePagination,
  fetchTrialBalance,
} from '../services/companiesApi';

/*
 * Fields that should NOT be displayed in the table.
 */
const hiddenFields = new Set([
  '_id',
  '_v',
  'V',
  'companyId',
  'organizationId',
  'raw',
  'source',

  // Tally External ID
  'tallyExternalId',
  'tallyExternalID',
  'tally_external_id',
]);

/*
 * Convert API field names into readable table labels.
 */
function formatLabel(key) {
  return String(key)
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

/*
 * Format values for display.
 */
function isDateField(field) {
  const normalizedField = String(field || '')
    .replace(/[_-\s]/g, '')
    .toLowerCase()

  return (
    normalizedField.includes('date') ||
    normalizedField.includes('time') ||
    normalizedField.includes('timestamp') ||
    normalizedField.includes('createdat') ||
    normalizedField.includes('updatedat')
  )
}

function formatIstDate(value) {
  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
}

function formatValue(value, field = '') {
  if (value === null || value === undefined || value === '') {
    return 'NA';
  }

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  if (isDateField(field)) {
    return formatIstDate(value)
  }

  if (typeof value === 'number') {
    return value.toLocaleString('en-IN');
  }

  return String(value);
}

function TrialBalancePage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState('');
  const [selectedGroup, setSelectedGroup] =
    useState('All Groups');

  const trialBalanceGroups = [
    'All Groups',
    'Sundry Debtors',
    'Sundry Creditors',
    'Unsecured Loans',
    'Secured Loans',
    'Bank Accounts',
    'Cash-in-Hand',
    'Capital Account',
    'Current Liabilities',
    'Current Assets',
    'Fixed Assets',
    'Investments',
    'Loans & Advances',
    'Duties & Taxes',
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /*
   * Reset to first page when:
   * - company changes
   * - page size changes
   * - search query changes
   * - group changes
   */
  useEffect(() => {
    setPage(1);
  }, [companyId, pageSize, query, selectedGroup]);

  /*
   * Fetch Trial Balance data.
   */
  useEffect(() => {
    if (!accessToken || !companyId) {
      setRows([]);
      setTotalItems(0);
      setTotalPages(1);

      setErrorMessage(
        accessToken
          ? 'No company selected.'
          : 'Session expired. Please sign in.'
      );

      return undefined;
    }

    let isMounted = true;

    setIsLoading(true);
    setErrorMessage('');

    fetchTrialBalance(accessToken, companyId, {
      page,
      limit: pageSize,
      q: query,
      group:
        selectedGroup === 'All Groups'
          ? ''
          : selectedGroup,
    })
      .then((response) => {
        if (!isMounted) return;

        const nextRows = extractTrialBalanceRows(response);
        const pagination =
          extractTrialBalancePagination(response);

        const total = Number(
          pagination.total ??
            pagination.totalItems ??
            pagination.totalRecords ??
            pagination.count ??
            nextRows.length
        );

        const limit = Number(
          pagination.limit ??
            pagination.pageSize ??
            pageSize
        );

        const safeTotal = Number.isFinite(total)
          ? total
          : nextRows.length;

        const safeLimit =
          Number.isFinite(limit) && limit > 0
            ? limit
            : pageSize;

        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(safeTotal / safeLimit)
        );

        const apiTotalPages = Number(
          pagination.totalPages ??
            pagination.pages ??
            calculatedTotalPages
        );

        setRows(nextRows);
        setTotalItems(safeTotal);

        setTotalPages(
          Number.isFinite(apiTotalPages) &&
            apiTotalPages > 0
            ? apiTotalPages
            : calculatedTotalPages
        );
      })
      .catch((error) => {
        if (!isMounted) return;

        setRows([]);
        setTotalItems(0);
        setTotalPages(1);

        setErrorMessage(
          error?.message ||
            'Unable to load trial balance'
        );
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    accessToken,
    companyId,
    page,
    pageSize,
    query,
    selectedGroup,
  ]);

  /*
   * Dynamically determine table columns
   * from API response.
   *
   * Hidden fields such as Tally External ID
   * are excluded here.
   */
  const fields = useMemo(() => {
    const keys = new Set();

    rows.forEach((row) => {
      Object.keys(row || {}).forEach((key) => {
        if (!hiddenFields.has(key)) {
          keys.add(key);
        }
      });
    });

    return Array.from(keys);
  }, [rows]);

  /*
   * Header and every row use the EXACT
   * same grid template for alignment.
   */
  const gridTemplateColumns = useMemo(() => {
    if (!fields.length) {
      return 'minmax(900px, 1fr)';
    }

    return fields
      .map(() => 'minmax(180px, 1fr)')
      .join(' ');
  }, [fields]);

  /*
   * Pagination buttons.
   */
  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from(
        { length: totalPages },
        (_, index) => index + 1
      );
    }

    if (page <= 4) {
      return [
        1,
        2,
        3,
        4,
        5,
        '...',
        totalPages,
      ];
    }

    if (page >= totalPages - 3) {
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      '...',
      page - 1,
      page,
      page + 1,
      '...',
      totalPages,
    ];
  }, [page, totalPages]);

  /*
   * Visible record range.
   */
  const recordStart =
    totalItems > 0
      ? (page - 1) * pageSize + 1
      : 0;

  const recordEnd =
    totalItems > 0
      ? Math.min(page * pageSize, totalItems)
      : 0;

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#eef3f8] text-slate-900">

      {/* =========================
          PAGE HEADER
      ========================== */}
      <div className="flex min-h-[64px] items-center justify-between border-b border-slate-200 bg-white px-5">

        <div>
          <span className="block text-xs text-slate-500">
            Reports
          </span>

          <h1 className="text-xl font-bold text-slate-900">
            Trial Balance
          </h1>
        </div>

        <span className="text-xs text-slate-500">
          {totalItems > 0
            ? `${totalItems} records`
            : 'NA records'}
        </span>

      </div>


      {/* =========================
          MAIN CONTENT
      ========================== */}
      <section className="mx-5 mt-3 overflow-hidden rounded-lg bg-white shadow-sm">

        {/* =========================
            TOOLBAR
        ========================== */}
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 px-5 py-3">

          {/* SEARCH */}
          <label className="flex h-9 w-[260px] items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-slate-400 transition focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500">

            <Search size={15} />

            <input
              type="text"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
              placeholder="Search ledger"
              className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
            />

          </label>


          {/* GROUP FILTER */}
          <label className="flex items-center gap-2 text-xs text-slate-600">

            <span>
              Group
            </span>

            <select
              value={selectedGroup}
              onChange={(event) => {
                setSelectedGroup(event.target.value);
              }}
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
            >
              {trialBalanceGroups.map((group) => (
                <option
                  key={group}
                  value={group}
                >
                  {group}
                </option>
              ))}
            </select>

          </label>


          {/* PAGE SIZE */}
          <label className="flex items-center gap-2 text-xs text-slate-600">

            <span>
              Show
            </span>

            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(
                  Number(event.target.value)
                );
              }}
              className="h-9 rounded-md border border-slate-300 bg-white px-2 text-xs text-slate-700 outline-none focus:border-emerald-500"
            >
              {[10, 20, 30, 50].map((size) => (
                <option
                  key={size}
                  value={size}
                >
                  {size}
                </option>
              ))}
            </select>

            <span>
              records
            </span>

          </label>


          {/* PAGE INFORMATION */}
          <span className="ml-auto text-xs text-slate-500">
            Page {page} · {pageSize} per page
          </span>

        </div>


        {/* =========================
            ERROR MESSAGE
        ========================== */}
        {errorMessage && (
          <div className="mx-5 mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}


        {/* =========================
            TABLE
        ========================== */}
        <div className="mx-5 my-3 overflow-x-auto rounded-md border border-slate-200">

          {/* 
            This wrapper guarantees that
            header and body have the same
            available width.
          */}
          <div className="min-w-[900px]">

            {/* =========================
                TABLE HEADER
            ========================== */}
            {fields.length > 0 && (
              <div
                className="grid items-center border-b border-slate-200 bg-[#edf2f6] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600"
                style={{
                  gridTemplateColumns,
                }}
              >
                {fields.map((field) => (
                  <div
                    key={field}
                    className="min-w-0 pr-4 text-left"
                    title={formatLabel(field)}
                  >
                    <span className="block truncate">
                      {formatLabel(field)}
                    </span>
                  </div>
                ))}
              </div>
            )}


            {/* =========================
                LOADING
            ========================== */}
            {isLoading && (
              <div className="flex min-h-[180px] items-center justify-center">

                <div className="flex items-center gap-2 text-xs text-slate-500">

                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />

                  <span>
                    Loading trial balance...
                  </span>

                </div>

              </div>
            )}


            {/* =========================
                DATA ROWS
            ========================== */}
            {!isLoading && rows.length > 0 && (
              <div>

                {rows.map((row, index) => (
                  <div
                    key={
                      row?._id ||
                      row?.id ||
                      `trial-balance-row-${index}`
                    }
                    className="grid items-start border-b border-slate-100 px-4 py-3 text-xs text-slate-700 last:border-b-0 odd:bg-white even:bg-slate-50"
                    style={{
                      gridTemplateColumns,
                    }}
                  >

                    {fields.map((field) => {
                      const value = row?.[field];

                      return (
                        <div
                          key={field}
                          className="min-w-0 pr-4 text-left"
                        >

                          <div
                            className="max-h-24 overflow-y-auto whitespace-pre-wrap break-words leading-5 [overflow-wrap:anywhere]"
                            title={
                              typeof value === 'object'
                                ? formatValue(value, field)
                                : String(
                                    value ?? ''
                                  )
                            }
                          >
                            {formatValue(value, field)}
                          </div>

                        </div>
                      );
                    })}

                  </div>
                ))}

              </div>
            )}


            {/* =========================
                EMPTY STATE
            ========================== */}
            {!isLoading && rows.length === 0 && (
              <div className="flex min-h-[180px] items-center justify-center text-xs text-slate-500">
                NA
              </div>
            )}

          </div>
        </div>


        {/* =========================
            PAGINATION FOOTER
        ========================== */}
        <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-slate-100 px-6 py-4">

          {/* RECORD COUNT */}
          <span className="text-xs text-slate-600">
            {totalItems > 0
              ? `${recordStart}-${recordEnd} of ${totalItems}`
              : 'NA-NA of NA'}
          </span>


          {/* PAGINATION */}
          <div className="flex items-center gap-2">

            {/* PREVIOUS */}
            <button
              type="button"
              disabled={
                isLoading || page <= 1
              }
              onClick={() =>
                setPage((currentPage) =>
                  Math.max(
                    1,
                    currentPage - 1
                  )
                )
              }
              className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>


            {/* PAGE NUMBERS */}
            {pageItems.map(
              (pageNumber, index) =>
                pageNumber === '...' ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="px-1 text-sm text-slate-400"
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={pageNumber}
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      setPage(pageNumber);
                    }}
                    className={
                      pageNumber === page
                        ? 'h-9 w-9 rounded-md border border-emerald-600 bg-emerald-600 text-sm font-semibold text-white'
                        : 'h-9 w-9 rounded-md border border-slate-200 bg-white text-sm text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50'
                    }
                  >
                    {pageNumber}
                  </button>
                )
            )}


            {/* NEXT */}
            <button
              type="button"
              disabled={
                isLoading ||
                page >= totalPages
              }
              onClick={() =>
                setPage((currentPage) =>
                  Math.min(
                    totalPages,
                    currentPage + 1
                  )
                )
              }
              className="flex h-9 items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-xs text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>

          </div>

        </footer>

      </section>
    </div>
  );
}

export default TrialBalancePage;
import { useEffect, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import useAuthStore from '../store/authStore';
import {
  extractLedgerPagination,
  extractStockItems,
  fetchCompanyStock,
} from '../services/companiesApi';

// Columns with all required fields
const columns = [
  { key: 'itemName', label: 'Item Name' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'rate', label: 'Rate' },
  { key: 'value', label: 'Value' },
  { key: 'godown', label: 'Godown' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
];

// Alias mappings for flexibility
const itemAliases = {
  itemName: ['itemName', 'name', 'stockName'],
  itemTallyExternalId: ['itemTallyExternalId', 'tallyExternalId', 'externalId'],
  quantity: ['quantity', 'qty', 'closingStock'],
  rate: ['rate', 'avgPurRate', 'purchaseRate'],
  value: ['value', 'amount', 'stockValue'],
  godown: ['godown', 'warehouse', 'location'],
  createdAt: ['createdAt', 'created_at', 'dateCreated'],
  updatedAt: ['updatedAt', 'updated_at', 'dateUpdated'],
};

// Helper: Convert UTC date string to IST (UTC+5:30) formatted string
function formatDateToIST(utcDate) {
  if (!utcDate) return 'NA';
  try {
    const date = new Date(utcDate);
    if (isNaN(date.getTime())) return 'NA';
    const istOffset = 5.5 * 60; // in minutes
    const localTime = date.getTime() + (date.getTimezoneOffset() * 60000);
    const istTime = new Date(localTime + (istOffset * 60000));
    return istTime.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  } catch {
    return 'NA';
  }
}

function getItemValue(item, key) {
  const matchingKey = itemAliases[key]?.find((alias) => item?.[alias] !== undefined);
  return matchingKey ? item[matchingKey] : 'NA';
}

function formatItemValue(value, key) {
  if (value === null || value === undefined || value === '' || value === '-') return 'NA';
  if (key === 'createdAt' || key === 'updatedAt') {
    return formatDateToIST(value);
  }
  if (typeof value === 'object') return Object.values(value).filter(Boolean).join(', ') || 'NA';
  return String(value);
}

function isCreatedAtInRange(item, startDate, endDate) {
  const createdAt = getItemValue(item, 'createdAt');
  if (createdAt === 'NA') return false;

  const createdDate = new Date(createdAt);
  if (Number.isNaN(createdDate.getTime())) return false;

  const rangeStart = new Date(`${startDate}T00:00:00`);
  const rangeEnd = new Date(`${endDate}T23:59:59.999`);

  return createdDate >= rangeStart && createdDate <= rangeEnd;
}

function ItemsPage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('2026-04-01');
  const [endDate, setEndDate] = useState('2027-03-31');
  const [stockItems, setStockItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!accessToken || !companyId) {
      setStockItems([]);
      setTotalItems(0);
      setTotalPages(1);
      setErrorMessage(accessToken ? 'No company is selected.' : 'Your session has expired. Please sign in again.');
      return undefined;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage('');

    // Include date range in the API request
    fetchCompanyStock(accessToken, companyId, {
      page: currentPage,
      limit: pageSize,
      q: query,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    })
      .then((response) => {
        if (!isMounted) return;

        const items = extractStockItems(response).filter((item) =>
          isCreatedAtInRange(item, startDate, endDate)
        );
        const pagination = extractLedgerPagination(response);
        const responseTotal = Number(pagination.total ?? pagination.totalItems ?? pagination.totalRecords ?? pagination.count);
        const responsePages = Number(pagination.totalPages ?? pagination.total_pages ?? pagination.pages ?? pagination.lastPage);
        const nextTotal = Number.isFinite(responseTotal) && responseTotal >= 0 ? responseTotal : items.length;
        const nextPages = Number.isFinite(responsePages) && responsePages > 0 ? responsePages : Math.max(1, Math.ceil(nextTotal / pageSize));

        setStockItems(items);
        setTotalItems(nextTotal);
        setTotalPages(nextPages);
      })
      .catch((error) => {
        if (isMounted) setErrorMessage(error.message || 'Unable to load stock items');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [accessToken, companyId, currentPage, pageSize, query, startDate, endDate]); // Added startDate & endDate dependencies

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const pageItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, index) => index + 1)
    : currentPage <= 4
      ? [1, 2, 3, 4, 5, '...', totalPages]
      : currentPage >= totalPages - 3
        ? [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];

  const handleAddNew = () => {
    window.history.pushState({}, '', '/items/add-new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="page-surface">
      <div className="page-toolbar">
        <button type="button" onClick={() => window.history.back()} className="text-2xl" aria-label="Go back">←</button>
        <h1 className="text-base font-semibold">Items</h1>
        <div className="page-tabs ml-auto">
          {['All Stocks', 'In Stock', 'More⌄', 'Summary', 'Group', 'Godown', 'Category'].map((item) => (
            <button key={item} type="button">{item}</button>
          ))}
        </div>
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(nextStart, nextEnd) => {
            setStartDate(nextStart || startDate);
            setEndDate(nextEnd || endDate);
            // Reset to page 1 when date range changes (optional)
            setCurrentPage(1);
          }}
          compact
        />
      </div>

      <section className="page-card p-5">
        <div className="mb-3 flex flex-wrap items-center gap-4">
          <input
            className="h-9 w-[min(100%,240px)] rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-green-500"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setCurrentPage(1); }}
            placeholder="Search items"
          />
          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(event) => { setPageSize(Number(event.target.value)); setCurrentPage(1); }}
              className="h-9 rounded-lg border border-slate-300 bg-white px-2"
              aria-label="Rows per page"
            >
              {[10, 20, 30, 50].map((limit) => (
                <option key={limit} value={limit}>{limit}</option>
              ))}
            </select>
            <span>records</span>
          </label>
          <button
            className="ml-auto rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            type="button"
            onClick={handleAddNew}
          >
            ⊕ Add New
          </button>
          <button className="rounded-lg border border-slate-300 px-4 py-2 text-xs" type="button">
            ▣ View PDF
          </button>
        </div>

        {errorMessage && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
              <tr>
                {columns.map((column) => (
                  <th key={column.key} className="whitespace-nowrap px-4 py-3">{column.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-slate-500">
                    Loading stock items...
                  </td>
                </tr>
              ) : stockItems.length > 0 ? (
                stockItems.map((item, index) => (
                  <tr key={item?._id || item?.id || index} className="text-xs text-slate-700 hover:bg-slate-50">
                    {columns.map((column) => {
                      const rawValue = getItemValue(item, column.key);
                      return (
                        <td key={column.key} className="px-4 py-3">
                          {formatItemValue(rawValue, column.key)}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-8 text-center text-xs text-slate-500">
                    No stock data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-4">
          {pageItems.map((page, index) =>
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-1 text-sm text-slate-400">...</span>
            ) : (
              <button
                key={page}
                type="button"
                disabled={isLoading}
                onClick={() => setCurrentPage(page)}
                className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium ${
                  currentPage === page
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-emerald-50'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {page}
              </button>
            )
          )}
        </footer>
        <div className="pt-3 text-center text-xs text-slate-500">
          {totalItems === 0
            ? '0 of 0'
            : `${((currentPage - 1) * pageSize) + 1}-${((currentPage - 1) * pageSize) + stockItems.length} of ${totalItems}`}
        </div>
      </section>
    </div>
  );
}

export default ItemsPage;
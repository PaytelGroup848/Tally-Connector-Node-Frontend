import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import useAuthStore from '../store/authStore';
import {
  extractVoucherPagination,
  extractVouchers,
  fetchCompanyVouchers,
} from '../services/companiesApi';

function formatCurrency(value) {
  if (value === null || value === undefined) return '₹0';
  return `₹${Number(value).toLocaleString('en-IN')}`;
}

function formatDate(dateString) {
  if (!dateString) return 'NA';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'NA';
    return date.toLocaleDateString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return 'NA';
  }
}

function formatFieldLabel(key) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatFieldValue(value) {
  if (value === null || value === undefined || value === '') return 'NA';
  return String(value);
}

function isStructuredValue(value) {
  return value !== null && typeof value === 'object';
}

function isViewableField(key, value) {
  const normalizedKey = String(key).toLowerCase();
  const isErrorField =
    normalizedKey.includes('error') ||
    normalizedKey.includes('message');

  const hasErrorValue =
    value !== null &&
    value !== undefined &&
    String(value).trim().toLowerCase() !== '' &&
    String(value).trim().toLowerCase() !== 'na';

  return isStructuredValue(value) || (isErrorField && hasErrorValue);
}

function getDetailEntries(value) {
  if (Array.isArray(value)) {
    return value.map((item, index) => [String(index + 1), item]);
  }

  return value && typeof value === 'object'
    ? Object.entries(value)
    : [];
}

// =====================================================================
// 3. MAIN COMPONENT
// =====================================================================

function VoucherPage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [vouchers, setVouchers] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detail, setDetail] = useState(null);

  const columns = vouchers.length > 0
    ? Object.keys(vouchers[0]).map((key) => ({ key, label: formatFieldLabel(key) }))
    : [];

  // Fetch vouchers when dependencies change
  useEffect(() => {
    if (!accessToken || !companyId) {
      setVouchers([]);
      setTotalItems(0);
      setTotalPages(1);
      setErrorMessage(accessToken ? 'No company selected.' : 'Session expired. Please sign in.');
      return undefined;
    }

    let isMounted = true;
    setIsLoading(true);
    setErrorMessage('');

    fetchCompanyVouchers(accessToken, companyId, {
      page: currentPage,
      limit: pageSize,
      q: query,
    })
      .then((response) => {
        if (!isMounted) return;
        const items = extractVouchers(response);
        const pagination = extractVoucherPagination(response);
        setVouchers(items);
        setTotalItems(pagination.total);
        setTotalPages(Number(pagination.totalPages || pagination.pages || 1));
      })
      .catch((error) => {
        if (isMounted) setErrorMessage(error.message || 'Unable to load vouchers');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => { isMounted = false; };
  }, [accessToken, companyId, currentPage, pageSize, query]);

  // Reset to page 1 when search or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [query, pageSize]);

  // Prevent page out of range
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages || 1);
    }
  }, [totalPages, currentPage]);

  // Pagination logic
  const pageItems = totalPages <= 7
    ? Array.from({ length: totalPages }, (_, i) => i + 1)
    : currentPage <= 4
      ? [1, 2, 3, 4, 5, '...', totalPages]
      : currentPage >= totalPages - 3
        ? [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
        : [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];

  const handleAddNew = () => {
    window.history.pushState({}, '', '/create-voucher/sales');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#f8fafc] text-[#17355f]">
      <div className="px-3 py-3 sm:px-5 sm:py-4">
        <section className="min-w-[1120px] border-t border-[#e5ebf2] bg-white">
          <div className="flex min-h-[70px] flex-wrap items-center gap-3 border-b border-[#e5ebf2] px-4 py-3 sm:px-8">
            <input
              className="h-9 w-[245px] rounded-lg border border-[#d9e2ed] px-3 text-xs outline-none focus:border-[#17355f]"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search vouchers..."
            />

            <label className="flex h-[38px] items-center gap-2 whitespace-nowrap text-[13px]">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(event) => setPageSize(Number(event.target.value))}
                className="h-[38px] rounded-lg border border-[#10b981] bg-white px-3 text-xs outline-none"
              >
                {[10, 20, 30, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>records</span>
            </label>

            <div className="hidden min-w-0 flex-1 lg:block" />

            <span className="text-xs">Page {currentPage} · {pageSize} per page</span>

            <button
              className="rounded-md bg-[#1d1f22] px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
              type="button"
              onClick={handleAddNew}
            >
              + Add New
            </button>
          </div>

          {errorMessage && (
            <div className="mx-8 mt-2 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          <div className="mx-8 overflow-x-auto rounded-lg border border-[#dfe7f0]">
            <table className="min-w-[1120px] table-fixed text-left">
              <thead className="bg-[#f4f7fb] text-[11px] font-semibold uppercase text-[#274b78]">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="w-[220px] min-w-[220px] max-w-[220px] border-l border-[#dfe7f0] px-4 py-3"
                    >
                      <span className="block whitespace-normal break-words">
                        {column.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs text-[#17355f]">
                {isLoading ? (
                  <tr>
                    <td colSpan={Math.max(columns.length, 1)} className="h-[120px] text-center text-slate-500">
                      Loading vouchers...
                    </td>
                  </tr>
                ) : vouchers.length > 0 ? (
                  vouchers.map((voucher, index) => (
                    <tr
                      key={voucher._id || voucher.guid || voucher.id || index}
                      className="border-b border-[#e5ebf2] odd:bg-white even:bg-[#fbfdff] hover:bg-slate-50"
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="w-[220px] min-w-[220px] max-w-[220px] border-l border-[#e5ebf2] px-4 py-3 align-top"
                        >
                          <div className="max-w-full whitespace-pre-wrap break-words leading-5">
                            {isViewableField(
                              column.key,
                              voucher[column.key],
                            ) ? (
                              <button
                                type="button"
                                onClick={() =>
                                  setDetail({
                                    title: column.label,
                                    value: voucher[column.key],
                                  })
                                }
                                className="inline-flex min-h-8 items-center rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700 transition hover:bg-sky-100"
                              >
                                View
                              </button>
                            ) : column.key.toLowerCase().includes('date')
                              ? formatDate(voucher[column.key])
                              : column.key.toLowerCase().includes('amount')
                                ? formatCurrency(voucher[column.key])
                                : formatFieldValue(voucher[column.key])}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Math.max(columns.length, 1)} className="h-[120px] text-center text-xs text-slate-500">
                      No vouchers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <footer className="flex flex-wrap items-center justify-center gap-6 border-t border-[#e5ebf2] px-8 py-4 text-xs">
            <span>
              {totalItems === 0
                ? '0-0 of 0'
                : `${(currentPage - 1) * pageSize + 1}-${Math.min((currentPage - 1) * pageSize + vouchers.length, totalItems)} of ${totalItems}`}
            </span>

            <div className="flex items-center gap-2">
              {pageItems.map((page, index) =>
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-1 text-[#71819a]">...</span>
                ) : (
                  <button
                    key={page}
                    type="button"
                    disabled={isLoading}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page
                      ? 'h-9 w-9 rounded-md border border-[#059669] bg-[#059669] font-semibold text-white'
                      : 'h-9 w-9 rounded-md border border-[#d9e2ed] bg-white text-[#17355f] transition hover:border-[#10a878] hover:text-[#10a878] disabled:opacity-50'}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>
          </footer>
        </section>
      </div>

      {detail && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-[200] flex items-center justify-center bg-slate-950/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-base font-semibold text-slate-900">
                {detail.title}
              </h2>
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-500 transition hover:bg-slate-100"
                aria-label="Close details"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-auto p-4">
              <div className="overflow-hidden rounded-lg border border-[#dfe7f0]">
                {getDetailEntries(detail.value).map(([key, value]) => (
                  <div
                    key={key}
                    className="grid grid-cols-[180px_1fr] items-start border-b border-[#e5ebf2] px-4 py-3 text-xs last:border-b-0 odd:bg-white even:bg-[#fbfdff]"
                  >
                    <strong className="pr-4 text-[#274b78]">
                      {Array.isArray(detail.value)
                        ? `Item ${key}`
                        : formatFieldLabel(key)}
                    </strong>
                    <span className="whitespace-pre-wrap break-words text-[#17355f]">
                      {isStructuredValue(value)
                        ? 'Nested details available'
                        : formatFieldValue(value)}
                    </span>
                  </div>
                ))}

                {getDetailEntries(detail.value).length === 0 && (
                  <div className="whitespace-pre-wrap break-words px-4 py-4 text-sm text-[#17355f]">
                    {formatFieldValue(detail.value)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 px-5 py-3">
              <button
                type="button"
                onClick={() => setDetail(null)}
                className="rounded-md border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VoucherPage;
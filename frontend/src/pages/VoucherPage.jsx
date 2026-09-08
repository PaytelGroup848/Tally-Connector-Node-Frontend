import { useEffect, useState } from 'react';
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
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

// =====================================================================
// 3. MAIN COMPONENT
// =====================================================================

function VoucherPage({ companyId }) {
  const accessToken = useAuthStore((state) => state.accessToken);

  const [vouchers, setVouchers] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

  // Navigate to create voucher (dummy – replace with your routing)
  const handleAddNew = () => {
    // Example: window.history.pushState({}, '', '/vouchers/create');
    // window.dispatchEvent(new PopStateEvent('popstate'));
    alert('Navigate to create voucher form');
  };

  return (
    <div className="min-h-[calc(100vh-60px)] overflow-x-auto bg-[#eaf0f5] text-slate-900">
      <div className="min-w-[1080px]">
        {/* Green Title Bar */}
        <div className="flex h-[40px] items-center bg-[#49bd3f] px-4">
          <h1 className="text-[16px] font-bold text-white">Vouchers</h1>
        </div>

        <div className="px-3 pb-[70px] pt-3">
          {/* Toolbar */}
          <div className="mb-3 flex flex-wrap items-center gap-4">
            <input
              className="h-9 w-[min(100%,240px)] rounded-lg border border-slate-300 px-3 text-xs outline-none focus:border-green-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search vouchers..."
            />
            <label className="flex items-center gap-2 text-xs text-slate-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(Number(e.target.value))}
                className="h-9 rounded-lg border border-slate-300 bg-white px-2"
              >
                {[10, 20, 30, 50].map((size) => (
                  <option key={size} value={size}>{size}</option>
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
          </div>

          {errorMessage && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {errorMessage}
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto border border-slate-300 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
                <tr>
                  {columns.map((col) => (
                    <th key={col.key} className="whitespace-nowrap px-4 py-3">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  <tr>
                    <td colSpan={Math.max(columns.length, 1)} className="px-4 py-8 text-center text-xs text-slate-500">
                      Loading vouchers...
                    </td>
                  </tr>
                ) : vouchers.length > 0 ? (
                  vouchers.map((voucher) => (
                    <tr key={voucher._id || voucher.guid || voucher.id} className="text-xs text-slate-700 hover:bg-slate-50">
                      {columns.map((column) => (
                        <td key={column.key} className="whitespace-nowrap px-4 py-3">
                          {column.key.toLowerCase().includes('date')
                            ? formatDate(voucher[column.key])
                            : column.key.toLowerCase().includes('amount')
                              ? formatCurrency(voucher[column.key])
                              : formatFieldValue(voucher[column.key])}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={Math.max(columns.length, 1)} className="px-4 py-8 text-center text-xs text-slate-500">
                      No vouchers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <footer className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {pageItems.map((page, idx) =>
              page === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-sm text-slate-400">…</span>
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
              : `${((currentPage - 1) * pageSize) + 1} - ${Math.min((currentPage - 1) * pageSize + vouchers.length, totalItems)} of ${totalItems}`}
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-end border-t border-slate-200 bg-white px-6 py-2">
          <button
            type="button"
            className="rounded-md bg-[#1d1f22] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_5px_15px_rgba(0,0,0,0.16)] hover:bg-black"
            onClick={handleAddNew}
          >
            + New Voucher
          </button>
        </div>
      </div>
    </div>
  );
}

export default VoucherPage;
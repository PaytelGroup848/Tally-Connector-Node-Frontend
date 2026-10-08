import { useEffect, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import useAuthStore from '../store/authStore';
import { Pencil, X } from 'lucide-react'
import {
  deleteCompanyCommand,
  extractCommands,
  extractLedgerPagination,
  extractStockItems,
  fetchCompanyCommands,
  fetchCompanyStock,
  postCompanyCommand,
} from '../services/companiesApi';




// Columns with all required fields
const columns = [
  { key: 'itemName', label: 'Item Name' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'rate', label: 'Rate' },
  { key: 'value', label: 'Value' },
  { key: 'hsnCode', label: 'HSNCode' },
  { key: 'godown', label: 'Godown' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'updatedAt', label: 'Updated At' },
  { key: 'action', label: 'Action' },
];

const stockCommandColumns = [
  { key: 'status', label: 'Status' },
  { key: 'payload', label: 'Details' },
  { key: 'result', label: 'Result' },
  { key: 'errorMessage', label: 'Error Message' },
  { key: 'createdAt', label: 'Created At' },
  { key: 'action', label: 'Action' },
];

// Alias mappings for flexibility
const itemAliases = {
  itemName: ['itemName', 'name', 'stockName'],
  itemTallyExternalId: [
    'itemTallyExternalId',
    'tallyExternalId',
    'externalId',
  ],
  quantity: ['quantity', 'qty', 'closingStock'],
  rate: ['rate', 'avgPurRate', 'purchaseRate'],
  value: ['value', 'amount', 'stockValue'],
  hsnCode: ['hsnCode', 'hsn', 'productHsn'],
  godown: ['godown', 'warehouse', 'location'],
  createdAt: ['createdAt', 'created_at', 'dateCreated'],
  updatedAt: ['updatedAt', 'updated_at', 'dateUpdated'],

};

// Helper: Convert a date value to an IST date string
function formatDateToIST(utcDate) {
  if (!utcDate) return 'NA';

  try {
    const date = new Date(utcDate);

    if (Number.isNaN(date.getTime())) {
      return 'NA';
    }

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

function getItemValue(item, key) {
  const matchingKey = itemAliases[key]?.find(
    (alias) => item?.[alias] !== undefined
  );

  return matchingKey ? item[matchingKey] : 'NA';
}

function formatItemValue(value, key) {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    value === '-'
  ) {
    return 'NA';
  }

  if (key === 'createdAt' || key === 'updatedAt') {
    return formatDateToIST(value);
  }

  if (typeof value === 'object') {
    return (
      Object.values(value)
        .filter(Boolean)
        .join(', ') || 'NA'
    );
  }

  return String(value);
}

function getStockCommandValue(command, key) {
  const aliases = {
    status: ['status', 'state', 'commandStatus', 'command_status'],
    payload: ['payload', 'data'],
    result: ['result', 'response'],
    errorMessage: ['errorMessage', 'error_message', 'error', 'message'],
    createdAt: ['createdAt', 'created_at', 'submittedAt', 'submitted_at'],
  };
  const matchingKey = aliases[key]?.find(
    (alias) => command?.[alias] !== undefined && command?.[alias] !== null,
  );

  return matchingKey ? command[matchingKey] : null;
}

function formatStockCommandValue(value) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function isCreatedAtInRange(item, startDate, endDate) {
  const createdAt = getItemValue(item, 'createdAt');

  if (createdAt === 'NA') return false;

  const createdDate = new Date(createdAt);

  if (Number.isNaN(createdDate.getTime())) {
    return false;
  }

  const rangeStart = new Date(`${startDate}T00:00:00`);
  const rangeEnd = new Date(`${endDate}T23:59:59.999`);

  return createdDate >= rangeStart && createdDate <= rangeEnd;
}

function ItemsPage({ companyId, myStockItems = false }) {
  const accessToken = useAuthStore((state) => state.accessToken);
  const visibleColumns = myStockItems
    ? stockCommandColumns
    : columns;

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    tallyExternalId: '',
    itemName: '',
    quantity: '',
    rate: '',
    value: '',
    unit: '',
    hsnCode: '',
    godown: '',
    batch: '',
  });

  const [query, setQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [stockItems, setStockItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [detailDialog, setDetailDialog] = useState(null);
  const [deletingCommandId, setDeletingCommandId] = useState('');

  useEffect(() => {
    if (!accessToken || !companyId) {
      setStockItems([]);
      setTotalItems(0);
      setTotalPages(1);

      setErrorMessage(
        accessToken
          ? 'No company is selected.'
          : 'Your session has expired. Please sign in again.'
      );

      return undefined;
    }

    let isMounted = true;

    setIsLoading(true);
    setErrorMessage('');

    const stockRequest = myStockItems
      ? Promise.resolve(null)
      : fetchCompanyStock(accessToken, companyId, {
        page: currentPage,
        limit: pageSize,
        q: query,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

    Promise.allSettled([
      stockRequest,
      fetchCompanyCommands(accessToken, companyId, {
        type: myStockItems ? 'CREATE_STOCK_ITEM' : '',
        page: currentPage,
        limit: pageSize,
        q: query,
      }),
    ])
      .then(([stockResult, commandResult]) => {
        if (!isMounted) return;

        if (
          (myStockItems && commandResult.status === 'rejected') ||
          (!myStockItems &&
            stockResult.status === 'rejected' &&
            commandResult.status === 'rejected')
        ) {
          throw commandResult.status === 'rejected'
            ? commandResult.reason
            : stockResult.reason;
        }

        const stockItemsFromApi = stockResult.status === 'fulfilled'
          ? extractStockItems(stockResult.value)
          : [];

        const commandItemsFromApi = commandResult.status === 'fulfilled'
          ? extractCommands(commandResult.value).map((command) => {
            if (myStockItems) return command;

            const payload = command?.payload || command?.data?.payload || command?.data || command || {};

            if (!payload || typeof payload !== 'object') return null;

            return {
              ...payload,
              _id: command?._id || command?.id || command?.commandId || payload?._id || payload?.id,
              createdAt: payload?.createdAt || command?.createdAt || command?.created_at,
              updatedAt: payload?.updatedAt || command?.updatedAt || command?.updated_at,
            };
          }).filter(Boolean)
          : [];

        const mergedItems = myStockItems
          ? commandItemsFromApi
          : [...stockItemsFromApi, ...commandItemsFromApi].filter((item, index, arr) => {
            const key = item?._id || item?.id || item?.tallyExternalId || item?.itemTallyExternalId || `${item?.itemName || ''}-${item?.godown || ''}-${item?.quantity || ''}`;
            return key && arr.findIndex((candidate) => {
              const candidateKey = candidate?._id || candidate?.id || candidate?.tallyExternalId || candidate?.itemTallyExternalId || `${candidate?.itemName || ''}-${candidate?.godown || ''}-${candidate?.quantity || ''}`;
              return candidateKey && candidateKey === key;
            }) === index;
          });

        const filteredItems = (!myStockItems && startDate && endDate)
          ? mergedItems.filter((item) => isCreatedAtInRange(item, startDate, endDate))
          : mergedItems;

        const stockPagination = stockResult.status === 'fulfilled'
          ? extractLedgerPagination(stockResult.value)
          : {};

        const commandPagination = commandResult.status === 'fulfilled'
          ? (commandResult.value?.pagination || commandResult.value?.data?.pagination || commandResult.value?.meta || commandResult.value?.data || commandResult.value)
          : {};

        const responseTotal = Number(
          stockPagination.total ??
          stockPagination.totalItems ??
          stockPagination.totalRecords ??
          stockPagination.count ??
          commandPagination.total ??
          commandPagination.totalItems ??
          commandPagination.totalRecords ??
          commandPagination.count ??
          filteredItems.length
        );

        const responsePages = Number(
          stockPagination.totalPages ??
          stockPagination.total_pages ??
          stockPagination.pages ??
          stockPagination.lastPage ??
          commandPagination.totalPages ??
          commandPagination.total_pages ??
          commandPagination.pages ??
          commandPagination.lastPage ??
          Math.ceil((Number.isFinite(responseTotal) ? responseTotal : filteredItems.length) / pageSize)
        );

        const nextTotal = Number.isFinite(responseTotal) && responseTotal >= 0 ? responseTotal : filteredItems.length;
        const nextPages = Number.isFinite(responsePages) && responsePages > 0 ? responsePages : Math.max(1, Math.ceil(nextTotal / pageSize));

        setStockItems(filteredItems);
        setTotalItems(nextTotal);
        setTotalPages(nextPages);
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(
            error?.message || 'Unable to load stock items'
          );
        }
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
    currentPage,
    pageSize,
    query,
    myStockItems,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const pageItems =
    totalPages <= 7
      ? Array.from(
        { length: totalPages },
        (_, index) => index + 1
      )
      : currentPage <= 4
        ? [1, 2, 3, 4, 5, '...', totalPages]
        : currentPage >= totalPages - 3
          ? [
            1,
            '...',
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
          ]
          : [
            1,
            '...',
            currentPage - 1,
            currentPage,
            currentPage + 1,
            '...',
            totalPages,
          ];

  const handleAddNew = () => {
    window.history.pushState({}, '', '/items/add-new');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
  const handleEdit = (item) => {
    setEditForm({
      tallyExternalId:
        item?.tallyExternalId ||
        item?.itemTallyExternalId ||
        item?.tallyExternalId ||
        item?.externalId ||
        '',

      itemName:
        item?.itemName ||
        item?.name ||
        item?.stockName ||
        '',

      quantity:
        item?.quantity ??
        item?.qty ??
        item?.closingStock ??
        '',

      rate:
        item?.rate ??
        item?.avgPurRate ??
        item?.purchaseRate ??
        '',

      value:
        item?.value ??
        item?.amount ??
        item?.stockValue ??
        '',

      unit: item?.unit || '',

      hsnCode:
        item?.hsnCode ||
        item?.hsn ||
        item?.productHsn ||
        '',

      godown:
        item?.godown ||
        item?.warehouse ||
        item?.location ||
        '',

      batch: item?.batch || '',
    });

    setIsEditOpen(true);
  };
  const handleDeleteCommand = async (command) => {
    const commandId =
      command?._id ||
      command?.commandId ||
      command?.command_id ||
      command?.id;

    if (!commandId || deletingCommandId) return;
    if (!window.confirm('Are you sure, you want to delete this?')) return;

    try {
      setDeletingCommandId(String(commandId));
      setErrorMessage('');
      await deleteCompanyCommand(accessToken, companyId, commandId);
      setStockItems((currentItems) =>
        currentItems.filter((item) => String(
          item?._id || item?.commandId || item?.command_id || item?.id,
        ) !== String(commandId)),
      );
      setTotalItems((currentTotal) => Math.max(0, currentTotal - 1));
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to delete command.');
    } finally {
      setDeletingCommandId('');
    }
  };

  const handleUpdateStockItem = async () => {
    if (!accessToken || !companyId) {
      setErrorMessage('Please select a company before updating the item.');
      return;
    }

    if (!editForm.tallyExternalId) {
      setErrorMessage('Tally External ID is missing for this item.');
      return;
    }

    const payload = {
      type: 'UPDATE_STOCK_ITEM',
      payload: {
        tallyExternalId: editForm.tallyExternalId,
        itemName: editForm.itemName,
        quantity: Number(editForm.quantity) || 0,
        rate: Number(editForm.rate) || 0,
        value: Number(editForm.value) || 0,
        unit: editForm.unit,
        hsnCode: editForm.hsnCode,
        godown: editForm.godown,
        batch: editForm.batch,
      },
    };

    try {
      setIsLoading(true);
      setErrorMessage('');

      const response = await postCompanyCommand(accessToken, companyId, payload);
      console.log('UPDATE_STOCK_ITEM response:', response);

      setStockItems((currentItems) =>
        currentItems.map((item) => {
          const itemTallyId = getItemValue(item, 'itemTallyExternalId');

          return itemTallyId === editForm.tallyExternalId
            ? {
              ...item,
              tallyExternalId: editForm.tallyExternalId,
              itemName: editForm.itemName,
              quantity: Number(editForm.quantity) || 0,
              rate: Number(editForm.rate) || 0,
              value: Number(editForm.value) || 0,
              unit: editForm.unit,
              hsnCode: editForm.hsnCode,
              godown: editForm.godown,
              batch: editForm.batch,
            }
            : item;
        })
      );

      setIsEditOpen(false);
    } catch (error) {
      console.error('UPDATE_STOCK_ITEM failed:', error);
      setErrorMessage(error?.message || 'Unable to update stock item.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-surface">
      {/* Top Header */}
      <div className="">


        {!myStockItems && (
          <DateRangePicker
            className="flex justify-end border-0"
            startDate={startDate}
            endDate={endDate}
            onChange={(nextStart, nextEnd) => {
              setStartDate(nextStart || startDate);
              setEndDate(nextEnd || endDate);
              setCurrentPage(1);
            }}
            compact
          />
        )}
      </div>
      <div className="p-10 mb-4 flex flex-wrap items-center gap-4 bg-white">
        <div className="relative">
          <input
            className="
                h-9
                w-[min(100%,240px)]
                rounded-lg
                border
                border-slate-300
                px-3
                text-xs
                outline-none
                transition
                focus:border-green-500
                focus:ring-2
                focus:ring-green-100
              "
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search item name"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-slate-600">
          <span>Show</span>

          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="
                h-9
                rounded-lg
                border
                border-slate-300
                bg-white
                px-2
                outline-none
                focus:border-green-500
              "
            aria-label="Rows per page"
          >
            {[10, 20, 30, 50].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>

          <span>records</span>
        </label>

        {!myStockItems && (
          <button
            className="
              ml-auto
              inline-flex
              items-center
              gap-1
              rounded-lg
              bg-emerald-600
              px-4
              py-2
              text-xs
              font-semibold
              text-white
              transition
              hover:bg-emerald-700
            "
            type="button"
            onClick={handleAddNew}
          >
            <span className="text-sm">+</span>
            Add New Item
          </button>
        )}
        {!myStockItems && (
          <button
            type="button"
            className="rounded-lg border border-slate-500 bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-700 hover:text-white"
            onClick={() => {
              window.history.pushState({}, "", "/my-stock-items");
              window.dispatchEvent(new PopStateEvent("popstate"));
            }}
          >
            View status

          </button>
        )}
        {/* <button
            className="
              inline-flex
              items-center
              gap-1
              rounded-lg
              border
              border-slate-300
              bg-white
              px-4
              py-2
              text-xs
              text-slate-700
              transition
              hover:bg-slate-50
            "
            type="button"
          >
           
            View PDF
          </button> */}
      </div>


      {/* Main Content */}
      <section className="page-card border border-slate-200 bg-white p-4">
        {/* Filters / Actions */}


        {/* Error */}
        {errorMessage && (
          <div
            className="
              mb-3
              rounded-md
              border
              border-red-200
              bg-red-50
              px-3
              py-2
              text-xs
              text-red-700
            "
          >
            {errorMessage}
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
              <tr>
                {visibleColumns.map((column) => (
                  <th
                    key={column.key}
                    className="whitespace-nowrap px-4 py-3"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={visibleColumns.length}
                    className="
                      px-4
                      py-8
                      text-center
                      text-xs
                      text-slate-500
                    "
                  >
                    Loading stock items...
                  </td>
                </tr>
              ) : stockItems.length > 0 ? (
                stockItems.map((item, index) => (
                  <tr
                    key={
                      item?._id ||
                      item?.id ||
                      index
                    }
                    className="
                      text-xs
                      text-slate-700
                      transition
                      hover:bg-slate-50
                    "
                  >
                    {visibleColumns.map((column) => {
                      if (myStockItems && column.key === 'action') {
                        const status = String(
                          getStockCommandValue(item, 'status') || '',
                        ).toLowerCase();
                        const commandId =
                          item?._id ||
                          item?.commandId ||
                          item?.command_id ||
                          item?.id;

                        return (
                          <td key={column.key} className="px-4 py-3">
                            {status === 'pending' && commandId ? (
                              <button
                                type="button"
                                disabled={deletingCommandId === String(commandId)}
                                onClick={() => handleDeleteCommand(item)}
                                className="rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {deletingCommandId === String(commandId)
                                  ? 'Deleting...'
                                  : 'Delete'}
                              </button>
                            ) : null}
                          </td>
                        );
                      }

                      if (myStockItems) {
                        const value = getStockCommandValue(item, column.key);
                        const isViewable =
                          value !== null &&
                          value !== undefined &&
                          value !== '' &&
                          (typeof value === 'object' ||
                            column.key === 'errorMessage');

                        return (
                          <td key={column.key} className="px-4 py-3">
                            {column.key === 'status' ? (
                              <span className={`font-semibold ${String(value || '').toLowerCase() === 'pending'
                                  ? 'text-amber-600'
                                  : String(value || '').toLowerCase() === 'failed'
                                    ? 'text-red-600'
                                    : String(value || '').toLowerCase() === 'done'
                                      ? 'text-emerald-600'
                                      : 'text-slate-600'
                                }`}>
                                {formatStockCommandValue(value)}
                              </span>
                            ) : column.key === 'createdAt' ? (
                              formatItemValue(value, 'createdAt')
                            ) : isViewable ? (
                              <button
                                type="button"
                                onClick={() => setDetailDialog({
                                  title: column.label,
                                  value,
                                })}
                                className="rounded-md border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-700"
                              >
                                {column.key === 'payload'
                                  ? 'View details'
                                  : column.key === 'errorMessage'
                                    ? 'View error'
                                    : 'View result'}
                              </button>
                            ) : (
                              <span className="whitespace-pre-wrap break-words">
                                {formatStockCommandValue(value)}
                              </span>
                            )}
                          </td>
                        );
                      }

                      if (column.key === 'action') {
                        return (
                          <td key={column.key} className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              title="Edit"
                              className="
            inline-flex
            h-8
            w-8
            items-center
            justify-center
            rounded-md
            border
            border-slate-200
            bg-white
            text-slate-500
            transition
            hover:border-emerald-200
            hover:bg-emerald-50
            hover:text-emerald-600
          "
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                          </td>
                        );
                      }

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
                  <td
                    colSpan={visibleColumns.length}
                    className="
                      px-4
                      py-12
                      text-center
                      text-xs
                      text-slate-500
                    "
                  >
                    {myStockItems
                      ? 'No stock item commands found.'
                      : 'No stock data available.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <footer className="
          flex
          flex-wrap
          items-center
          justify-center
          gap-2
          border-t
          border-slate-200
          pt-4
        ">
          {pageItems.map((page, index) =>
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="
                  px-1
                  text-sm
                  text-slate-400
                "
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                disabled={isLoading}
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`
                  h-9
                  min-w-9
                  rounded-lg
                  border
                  px-2
                  text-sm
                  font-medium
                  transition
                  ${currentPage === page
                    ? `
                        border-emerald-600
                        bg-emerald-600
                        text-white
                      `
                    : `
                        border-slate-200
                        text-slate-700
                        hover:bg-emerald-50
                      `
                  }
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `}
              >
                {page}
              </button>
            )
          )}
        </footer>

        {/* Record count */}
        <div className="pt-3 text-center text-xs text-slate-500">
          {totalItems === 0
            ? '0 of 0'
            : `${(currentPage - 1) * pageSize + 1}-${(currentPage - 1) * pageSize +
            stockItems.length
            } of ${totalItems}`}
        </div>
      </section>
      {detailDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-800">
                {detailDialog.title}
              </h2>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setDetailDialog(null)}
                className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              {detailDialog.value &&
                typeof detailDialog.value === 'object' &&
                !Array.isArray(detailDialog.value) ? (
                <table className="w-full border-collapse text-left text-xs">
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(detailDialog.value).map(([key, value]) => (
                      <tr key={key} className="hover:bg-slate-50">
                        <th className="w-1/3 bg-slate-50 px-4 py-3 font-semibold text-slate-600">
                          {key
                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                            .replace(/[_-]+/g, ' ')
                            .replace(/\b\w/g, (char) => char.toUpperCase())}
                        </th>

                        <td className="px-4 py-3 text-slate-700">
                          {value !== null && typeof value === 'object' ? (
                            <pre className="whitespace-pre-wrap break-words font-mono text-[11px]">
                              {JSON.stringify(value, null, 2)}
                            </pre>
                          ) : (
                            String(value ?? '—')
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : Array.isArray(detailDialog.value) ? (
                <table className="w-full border-collapse text-left text-xs">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-600">
                        #
                      </th>
                      <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-600">
                        Value
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {detailDialog.value.map((item, index) => (
                      <tr key={index} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 text-slate-700">
                          {typeof item === 'object' ? (
                            <pre className="whitespace-pre-wrap break-words font-mono text-[11px]">
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          ) : (
                            String(item ?? '—')
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full border-collapse text-left text-xs">
                  <tbody>
                    <tr>
                      <th className="w-1/3 bg-slate-50 px-4 py-3 font-semibold text-slate-600">
                        Value
                      </th>
                      <td className="px-4 py-3 whitespace-pre-wrap break-words text-slate-700">
                        {String(detailDialog.value ?? '—')}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-2xl">

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 mt-2">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Edit Stock Item
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Update stock item details
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">

              {/* Item Name */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editForm.itemName}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      itemName: e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Quantity
                </label>

                <input
                  type="number"
                  value={editForm.quantity}
                  onChange={(e) => {
                    const quantity = e.target.value;

                    setEditForm({
                      ...editForm,
                      quantity,
                      value:
                        Number(quantity || 0) *
                        Number(editForm.rate || 0),
                    });
                  }}
                  className="
      h-10
      w-full
      rounded-lg
      border
      border-slate-300
      px-3
      text-sm
      outline-none
      focus:border-emerald-500
      focus:ring-2
      focus:ring-emerald-100
    "
                />
              </div>

              {/* Rate */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Rate
                </label>

                <input
                  type="number"
                  value={editForm.rate}
                  onChange={(e) => {
                    const rate = e.target.value;

                    setEditForm({
                      ...editForm,
                      rate,
                      value:
                        Number(editForm.quantity || 0) *
                        Number(rate || 0),
                    });
                  }}
                  className="
      h-10
      w-full
      rounded-lg
      border
      border-slate-300
      px-3
      text-sm
      outline-none
      focus:border-emerald-500
      focus:ring-2
      focus:ring-emerald-100
    "
                />
              </div>

              {/* Value */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Value
                </label>

                <input
                  type="number"
                  value={editForm.value}
                  readOnly
                  className="
      h-10
      w-full
      cursor-not-allowed
      rounded-lg
      border
      border-slate-300
      bg-slate-50
      px-3
      text-sm
      text-slate-700
      outline-none
    "
                />
              </div>

              {/* Unit */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Unit
                </label>
                <input
                  type="text"
                  value={editForm.unit}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      unit: e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* HSN Code */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  HSN Code
                </label>
                <input
                  type="text"
                  value={editForm.hsnCode}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      hsnCode: e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Godown */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Godown
                </label>
                <input
                  type="text"
                  value={editForm.godown}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      godown: e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Batch */}
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Batch
                </label>
                <input
                  type="text"
                  value={editForm.batch}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      batch: e.target.value,
                    })
                  }
                  className="h-10 w-full rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={() => setIsEditOpen(false)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdateStockItem}
                className="rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Update Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemsPage;
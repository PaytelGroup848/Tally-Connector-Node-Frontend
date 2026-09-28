import { useEffect, useState } from 'react';
import DateRangePicker from '../components/DateRangePicker';
import useAuthStore from '../store/authStore';
import { Pencil, X } from 'lucide-react';

import {
  extractCommandId,
  extractCommandStatus,
  extractCommands,
  extractLedgerPagination,
  extractStockItems,
  fetchCommandStatus,
  fetchCompanyCommands,
  fetchCompanyStock,
  postCompanyCommand,
} from '../services/companiesApi';

// ============================================================
// TABLE COLUMNS
// ============================================================

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

// ============================================================
// FIELD ALIASES
// ============================================================

const itemAliases = {
  itemName: ['itemName', 'name', 'stockName'],

  itemTallyExternalId: [
    'itemTallyExternalId',
    'tallyExternalId',
    'externalId',
  ],

  quantity: [
    'quantity',
    'qty',
    'closingStock',
  ],

  rate: [
    'rate',
    'avgPurRate',
    'purchaseRate',
  ],

  value: [
    'value',
    'amount',
    'stockValue',
  ],

  unit: [
    'unit',
    'units',
  ],

  hsnCode: [
    'hsnCode',
    'hsn',
    'productHsn',
    'hsn_code',
  ],

  godown: [
    'godown',
    'warehouse',
    'location',
  ],

  batch: [
    'batch',
    'batchName',
  ],

  createdAt: [
    'createdAt',
    'created_at',
    'dateCreated',
  ],

  updatedAt: [
    'updatedAt',
    'updated_at',
    'dateUpdated',
  ],
};

// ============================================================
// DATE FORMATTER
// ============================================================

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

// ============================================================
// GET FIELD VALUE USING ALIASES
// ============================================================

function getItemValue(item, key) {
  const matchingKey = itemAliases[key]?.find(
    (alias) =>
      item?.[alias] !== undefined &&
      item?.[alias] !== null
  );

  return matchingKey
    ? item[matchingKey]
    : 'NA';
}

// ============================================================
// FORMAT TABLE VALUE
// ============================================================

function formatItemValue(value, key) {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    value === '-'
  ) {
    return 'NA';
  }

  if (
    key === 'createdAt' ||
    key === 'updatedAt'
  ) {
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

// ============================================================
// MERGE KEY
// ============================================================

function getItemMergeKey(item, fallbackIndex, prefix) {
  const tallyId =
    item?.tallyExternalId ||
    item?.itemTallyExternalId ||
    item?.externalId;

  if (tallyId) {
    return String(tallyId);
  }

  const itemId =
    item?.id ||
    item?._id;

  if (itemId) {
    return String(itemId);
  }

  return `${prefix}-${fallbackIndex}`;
}

// ============================================================
// COMPONENT
// ============================================================

function ItemsPage({ companyId }) {
  const accessToken = useAuthStore(
    (state) => state.accessToken
  );

  // ==========================================================
  // EDIT STATE
  // ==========================================================

  const [isEditOpen, setIsEditOpen] =
    useState(false);

  const [isUpdating, setIsUpdating] =
    useState(false);

  const [saveState, setSaveState] =
    useState('idle');

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

  // ==========================================================
  // FILTER STATE
  // ==========================================================

  const [query, setQuery] =
    useState('');

  const [startDate, setStartDate] =
    useState('');

  const [endDate, setEndDate] =
    useState('');

  // ==========================================================
  // TABLE STATE
  // ==========================================================

  const [stockItems, setStockItems] =
    useState([]);

  const [currentPage, setCurrentPage] =
    useState(1);

  const [pageSize, setPageSize] =
    useState(20);

  const [totalItems, setTotalItems] =
    useState(0);

  const [totalPages, setTotalPages] =
    useState(1);

  // ==========================================================
  // LOADING / ERROR
  // ==========================================================

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  // ==========================================================
  // FETCH BOTH APIS
  // ==========================================================

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

  const getArrayFromResponse = (response, possibleKeys = []) => {
    if (!response) return [];

    // Direct array
    if (Array.isArray(response)) {
      return response;
    }

    // Common response keys
    for (const key of possibleKeys) {
      if (Array.isArray(response?.[key])) {
        return response[key];
      }
    }

    // Nested data array
    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.data?.items)) {
      return response.data.items;
    }

    if (Array.isArray(response?.data?.commands)) {
      return response.data.commands;
    }

    if (Array.isArray(response?.data?.results)) {
      return response.data.results;
    }

    if (Array.isArray(response?.items)) {
      return response.items;
    }

    if (Array.isArray(response?.commands)) {
      return response.commands;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    return [];
  };

  const getCommandItem = (command) => {
    if (!command || typeof command !== 'object') {
      return null;
    }

    const payload =
      command?.payload ||
      command?.data?.payload ||
      command?.data ||
      command?.item ||
      command;

    if (!payload || typeof payload !== 'object') {
      return null;
    }

    return {
      ...payload,

      _id:
        command?._id ||
        command?.id ||
        command?.commandId ||
        payload?._id ||
        payload?.id ||
        '',

      _commandId:
        command?._id ||
        command?.id ||
        command?.commandId ||
        '',

      createdAt:
        payload?.createdAt ||
        command?.createdAt ||
        command?.created_at ||
        payload?.created_at ||
        '',

      updatedAt:
        payload?.updatedAt ||
        command?.updatedAt ||
        command?.updated_at ||
        payload?.updated_at ||
        '',
    };
  };

  const getTallyId = (item) => {
    return (
      item?.tallyExternalId ||
      item?.itemTallyExternalId ||
      item?.externalId ||
      item?.tally_external_id ||
      item?.item_tally_external_id ||
      ''
    );
  };

  const mergeItems = (oldItems, newItems) => {
    const result = [];
    const indexByTallyId = new Map();

    // ----------------------------------------
    // Add OLD API records
    // ----------------------------------------

    oldItems.forEach((item, index) => {
      if (!item || typeof item !== 'object') {
        return;
      }

      const tallyId = String(
        getTallyId(item) || ''
      ).trim();

      const mergedItem = {
        ...item,
      };

      result.push(mergedItem);

      if (tallyId) {
        indexByTallyId.set(
          tallyId,
          result.length - 1
        );
      }
    });

    // ----------------------------------------
    // Add / merge NEW API records
    // ----------------------------------------

    newItems.forEach((item) => {
      if (!item || typeof item !== 'object') {
        return;
      }

      const tallyId = String(
        getTallyId(item) || ''
      ).trim();

      // Same item -> merge
      if (
        tallyId &&
        indexByTallyId.has(tallyId)
      ) {
        const existingIndex =
          indexByTallyId.get(tallyId);

        result[existingIndex] = {
          ...result[existingIndex],
          ...item,
        };

        return;
      }

      // New item -> add
      result.push({
        ...item,
      });

      if (tallyId) {
        indexByTallyId.set(
          tallyId,
          result.length - 1
        );
      }
    });

    return result;
  };

  const loadItems = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');

      // ======================================================
      // CALL BOTH APIs
      // ======================================================

      const results =
        await Promise.allSettled([
          fetchCompanyStock(
            accessToken,
            companyId,
            {
              page: currentPage,
              limit: pageSize,
              q: query,
              startDate:
                startDate || undefined,
              endDate:
                endDate || undefined,
            }
          ),

          fetchCompanyCommands(
            accessToken,
            companyId,
            {
              type: 'UPDATE_STOCK_ITEM',
              page: currentPage,
              limit: pageSize,
              q: query,
            }
          ),
        ]);

      if (!isMounted) return;

      const stockResult = results[0];
      const commandResult = results[1];

      // ======================================================
      // OLD API
      // ======================================================

      let oldItems = [];

      if (
        stockResult.status ===
        'fulfilled'
      ) {
        const stockResponse =
          stockResult.value;

        console.log(
          '========== OLD STOCK API =========='
        );

        console.log(
          'OLD RESPONSE:',
          stockResponse
        );

        // First try your existing extractor
        try {
          oldItems =
            extractStockItems(
              stockResponse
            ) || [];
        } catch (error) {
          console.error(
            'extractStockItems failed:',
            error
          );
        }

        // Fallback
        if (oldItems.length === 0) {
          oldItems =
            getArrayFromResponse(
              stockResponse,
              [
                'stockItems',
                'stocks',
                'items',
                'results',
              ]
            );
        }

        console.log(
          'OLD ITEMS:',
          oldItems
        );
      } else {
        console.error(
          'OLD STOCK API ERROR:',
          stockResult.reason
        );
      }

      // ======================================================
      // NEW API
      // ======================================================

      let rawCommands = [];

      if (
        commandResult.status ===
        'fulfilled'
      ) {
        const commandResponse =
          commandResult.value;

        console.log(
          '========== NEW COMMAND API =========='
        );

        console.log(
          'NEW RESPONSE:',
          commandResponse
        );

        // First try existing extractor
        try {
          rawCommands =
            extractCommands(
              commandResponse
            ) || [];
        } catch (error) {
          console.error(
            'extractCommands failed:',
            error
          );
        }

        // Fallback
        if (
          rawCommands.length === 0
        ) {
          rawCommands =
            getArrayFromResponse(
              commandResponse,
              [
                'commands',
                'items',
                'results',
                'data',
              ]
            );
        }

        console.log(
          'RAW COMMANDS:',
          rawCommands
        );
      } else {
        console.error(
          'NEW COMMAND API ERROR:',
          commandResult.reason
        );
      }

      // ======================================================
      // CONVERT NEW COMMANDS TO ITEMS
      // ======================================================

      const newItems =
        rawCommands
          .map(
            getCommandItem
          )
          .filter(Boolean);

      console.log(
        'NEW ITEMS:',
        newItems
      );

      // ======================================================
      // MERGE BOTH API DATA
      // ======================================================

      const mergedItems =
        mergeItems(
          oldItems,
          newItems
        );

      console.log(
        '========== FINAL TABLE DATA =========='
      );

      console.log(
        'MERGED ITEMS:',
        mergedItems
      );

      console.log(
        'TOTAL MERGED:',
        mergedItems.length
      );

      // ======================================================
      // SET TABLE DATA
      // ======================================================

      setStockItems(
        mergedItems
      );

      // ======================================================
      // PAGINATION
      // ======================================================

      const stockResponse =
        stockResult.status ===
        'fulfilled'
          ? stockResult.value
          : null;

      const commandResponse =
        commandResult.status ===
        'fulfilled'
          ? commandResult.value
          : null;

      let oldPagination = {};

      if (stockResponse) {
        try {
          oldPagination =
            extractLedgerPagination(
              stockResponse
            ) || {};
        } catch {
          oldPagination = {};
        }
      }

      const newPagination =
        commandResponse?.pagination ||
        commandResponse?.data?.pagination ||
        commandResponse?.meta ||
        {};

      const oldTotal = Number(
        oldPagination?.total ??
          oldPagination?.totalItems ??
          oldPagination?.totalRecords ??
          0
      );

      const newTotal = Number(
        newPagination?.total ??
          newPagination?.totalItems ??
          newPagination?.totalRecords ??
          0
      );

      const apiTotal =
        Math.max(
          Number.isFinite(oldTotal)
            ? oldTotal
            : 0,
          Number.isFinite(newTotal)
            ? newTotal
            : 0
        );

      const finalTotal =
        apiTotal > 0
          ? apiTotal
          : mergedItems.length;

      const oldPages = Number(
        oldPagination?.totalPages ??
          oldPagination?.total_pages ??
          0
      );

      const newPages = Number(
        newPagination?.totalPages ??
          newPagination?.total_pages ??
          0
      );

      const apiPages =
        Math.max(
          Number.isFinite(oldPages)
            ? oldPages
            : 0,
          Number.isFinite(newPages)
            ? newPages
            : 0
        );

      const finalPages =
        apiPages > 0
          ? apiPages
          : Math.max(
              1,
              Math.ceil(
                finalTotal /
                  pageSize
              )
            );

      setTotalItems(
        finalTotal
      );

      setTotalPages(
        finalPages
      );

      // ======================================================
      // ERROR INFORMATION
      // ======================================================

      if (
        stockResult.status ===
          'rejected' &&
        commandResult.status ===
          'fulfilled'
      ) {
        setErrorMessage(
          'Previous stock API failed. Showing UPDATE_STOCK_ITEM data.'
        );
      }

      if (
        stockResult.status ===
          'fulfilled' &&
        commandResult.status ===
          'rejected'
      ) {
        setErrorMessage(
          'UPDATE_STOCK_ITEM API failed. Showing previous stock data.'
        );
      }

      if (
        stockResult.status ===
          'rejected' &&
        commandResult.status ===
          'rejected'
      ) {
        setErrorMessage(
          'Both stock APIs failed to load.'
        );
        setStockItems([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    } catch (error) {
      if (!isMounted) return;

      console.error(
        'LOAD ITEMS ERROR:',
        error
      );

      setErrorMessage(
        error?.message ||
          'Unable to load stock items.'
      );

      setStockItems([]);
      setTotalItems(0);
      setTotalPages(1);
    } finally {
      if (isMounted) {
        setIsLoading(false);
      }
    }
  };

  loadItems();

  return () => {
    isMounted = false;
  };
}, [
  accessToken,
  companyId,
  currentPage,
  pageSize,
  query,
  startDate,
  endDate,
]);
  // ==========================================================
  // KEEP CURRENT PAGE VALID
  // ==========================================================

  useEffect(() => {
    setCurrentPage((page) =>
      Math.min(
        page,
        Math.max(1, totalPages)
      )
    );
  }, [totalPages]);

  // ==========================================================
  // PAGINATION BUTTONS
  // ==========================================================

  const pageItems =
    totalPages <= 7
      ? Array.from(
          {
            length: totalPages,
          },
          (_, index) =>
            index + 1
        )
      : currentPage <= 4
        ? [
            1,
            2,
            3,
            4,
            5,
            '...',
            totalPages,
          ]
        : currentPage >=
            totalPages - 3
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

  // ==========================================================
  // ADD NEW
  // ==========================================================

  const handleAddNew = () => {
    window.history.pushState(
      {},
      '',
      '/items/add-new'
    );

    window.dispatchEvent(
      new PopStateEvent(
        'popstate'
      )
    );
  };

  // ==========================================================
  // EDIT ITEM
  // ==========================================================

  const handleEdit = (item) => {
    setErrorMessage('');
    setSaveState('idle');

    setEditForm({
      tallyExternalId:
        item?.tallyExternalId ||
        item?.itemTallyExternalId ||
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

      unit:
        item?.unit ||
        item?.units ||
        '',

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

      batch:
        item?.batch ||
        item?.batchName ||
        '',
    });

    setIsEditOpen(true);
  };

  // ==========================================================
  // UPDATE STOCK ITEM
  // ==========================================================

  const handleUpdateStockItem =
    async () => {
      if (
        !accessToken ||
        !companyId
      ) {
        setErrorMessage(
          'Please select a company before updating the item.'
        );

        return;
      }

      if (
        !editForm.tallyExternalId
      ) {
        setErrorMessage(
          'Tally External ID is missing for this item.'
        );

        return;
      }

      const quantity =
        Number(
          editForm.quantity
        ) || 0;

      const rate =
        Number(editForm.rate) ||
        0;

      const value =
        quantity * rate;

      const payload = {
        type: 'UPDATE_STOCK_ITEM',

        payload: {
          tallyExternalId:
            editForm.tallyExternalId,

          itemName:
            editForm.itemName,

          quantity,

          rate,

          value,

          unit:
            editForm.unit,

          hsnCode:
            editForm.hsnCode,

          godown:
            editForm.godown,

          batch:
            editForm.batch,
        },
      };

      try {
        setIsUpdating(true);
        setSaveState('saving');
        setErrorMessage('');

        console.log(
          'UPDATE_STOCK_ITEM PAYLOAD:',
          payload
        );

        const response =
          await postCompanyCommand(
            accessToken,
            companyId,
            payload
          );

        console.log(
          'UPDATE_STOCK_ITEM POST RESPONSE:',
          response
        );

        let latestStatus = '';
        let latestStatusResponse =
          null;

        const commandId =
          extractCommandId(
            response
          );

        // =====================================================
        // POLL COMMAND STATUS
        // =====================================================

        if (commandId) {
          for (
            let attempt = 0;
            attempt < 10;
            attempt += 1
          ) {
            if (attempt > 0) {
              await new Promise(
                (resolve) =>
                  window.setTimeout(
                    resolve,
                    1000
                  )
              );
            }

            const statusResponse =
              await fetchCommandStatus(
                accessToken,
                commandId
              );

            latestStatusResponse =
              statusResponse;

            latestStatus =
              extractCommandStatus(
                statusResponse
              ) || '';

            console.log(
              `Command status attempt ${
                attempt + 1
              }:`,
              latestStatus
            );

            const normalizedStatus =
              latestStatus
                .toLowerCase()
                .trim();

            if (
              [
                'completed',
                'complete',
                'success',
                'succeeded',
                'failed',
                'failure',
                'error',
                'cancelled',
              ].includes(
                normalizedStatus
              )
            ) {
              break;
            }
          }
        }

        const normalizedLatestStatus =
          latestStatus
            .toLowerCase()
            .trim();

        // =====================================================
        // UPDATE FAILED
        // =====================================================

        if (
          [
            'failed',
            'failure',
            'error',
            'cancelled',
          ].includes(
            normalizedLatestStatus
          )
        ) {
          const failureMessage =
            latestStatusResponse
              ?.message ||
            latestStatusResponse
              ?.error ||
            latestStatusResponse
              ?.data?.message ||
            'The item update was rejected by Tally.';

          setSaveState(
            'failed'
          );

          setErrorMessage(
            failureMessage
          );

          return;
        }

        // =====================================================
        // UPDATE LOCAL TABLE
        // =====================================================

        setStockItems(
          (currentItems) =>
            currentItems.map(
              (item) => {
                const itemTallyId =
                  getItemValue(
                    item,
                    'itemTallyExternalId'
                  );

                return String(
                  itemTallyId
                ) ===
                  String(
                    editForm.tallyExternalId
                  )
                  ? {
                      ...item,

                      tallyExternalId:
                        editForm.tallyExternalId,

                      itemTallyExternalId:
                        editForm.tallyExternalId,

                      itemName:
                        editForm.itemName,

                      quantity,

                      rate,

                      value,

                      unit:
                        editForm.unit,

                      hsnCode:
                        editForm.hsnCode,

                      godown:
                        editForm.godown,

                      batch:
                        editForm.batch,

                      updatedAt:
                        new Date().toISOString(),
                    }
                  : item;
              }
            )
        );

        setSaveState(
          'success'
        );

        // Close modal after success
        window.setTimeout(
          () => {
            setIsEditOpen(false);
            setSaveState('idle');
          },
          1200
        );
      } catch (error) {
        console.error(
          'UPDATE_STOCK_ITEM failed:',
          error
        );

        const failureMessage =
          error?.message ||
          'The item update was rejected by Tally.';

        setSaveState(
          'failed'
        );

        setErrorMessage(
          failureMessage
        );
      } finally {
        setIsUpdating(false);
      }
    };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="page-surface">
      {/* ====================================================
          TOP HEADER
      ==================================================== */}

      <div className="page-toolbar">
        <DateRangePicker
          className="ml-auto"
          startDate={startDate}
          endDate={endDate}
          onChange={(
            nextStart,
            nextEnd
          ) => {
            setStartDate(
              nextStart || ''
            );

            setEndDate(
              nextEnd || ''
            );

            setCurrentPage(1);
          }}
          compact
        />
      </div>

      {/* ====================================================
          NAVIGATION BAR
      ==================================================== */}

      <div className="w-full border-b border-slate-200 bg-white" />

      {/* ====================================================
          MAIN CONTENT
      ==================================================== */}

      <section className="page-card p-5">
        {/* ==================================================
            FILTERS / ACTIONS
        ================================================== */}

        <div className="mb-4 flex flex-wrap items-center gap-4">
          {/* Search */}

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
              onChange={(
                event
              ) => {
                setQuery(
                  event.target.value
                );

                setCurrentPage(1);
              }}
              placeholder="Search item name"
            />
          </div>

          {/* Page Size */}

          <label className="flex items-center gap-2 text-xs text-slate-600">
            <span>
              Show
            </span>

            <select
              value={pageSize}
              onChange={(
                event
              ) => {
                setPageSize(
                  Number(
                    event.target.value
                  )
                );

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
              {[10, 20, 30, 50].map(
                (limit) => (
                  <option
                    key={limit}
                    value={limit}
                  >
                    {limit}
                  </option>
                )
              )}
            </select>

            <span>
              records
            </span>
          </label>

          {/* Add New */}

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
            onClick={
              handleAddNew
            }
          >
            <span className="text-sm">
              +
            </span>

            Add New Item
          </button>
        </div>

        {/* ==================================================
            ERROR MESSAGE
        ================================================== */}

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

        {/* ==================================================
            TABLE
        ================================================== */}

        <div className="overflow-x-auto">
          <table className="min-w-[900px] w-full text-left text-sm">
            <thead className="bg-slate-100 text-xs font-semibold text-slate-700">
              <tr>
                {columns.map(
                  (column) => (
                    <th
                      key={
                        column.key
                      }
                      className="whitespace-nowrap px-4 py-3"
                    >
                      {
                        column.label
                      }
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={
                      columns.length
                    }
                    className="
                      px-4
                      py-8
                      text-center
                      text-xs
                      text-slate-500
                    "
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-600" />

                      Loading stock items...
                    </div>
                  </td>
                </tr>
              ) : stockItems.length >
                0 ? (
                stockItems.map(
                  (
                    item,
                    index
                  ) => (
                    <tr
                      key={
                        item?._id ||
                        item?.id ||
                        item?.tallyExternalId ||
                        index
                      }
                      className="
                        text-xs
                        text-slate-700
                        transition
                        hover:bg-slate-50
                      "
                    >
                      {columns.map(
                        (
                          column
                        ) => {
                          // --------------------------------
                          // ACTION COLUMN
                          // --------------------------------

                          if (
                            column.key ===
                            'action'
                          ) {
                            return (
                              <td
                                key={
                                  column.key
                                }
                                className="px-4 py-3"
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEdit(
                                      item
                                    )
                                  }
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

                          const rawValue =
                            getItemValue(
                              item,
                              column.key
                            );

                          return (
                            <td
                              key={
                                column.key
                              }
                              className="px-4 py-3"
                            >
                              {formatItemValue(
                                rawValue,
                                column.key
                              )}
                            </td>
                          );
                        }
                      )}
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length
                    }
                    className="
                      px-4
                      py-12
                      text-center
                      text-xs
                      text-slate-500
                    "
                  >
                    No stock data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ==================================================
            PAGINATION
        ================================================== */}

        <footer
          className="
            flex
            flex-wrap
            items-center
            justify-center
            gap-2
            border-t
            border-slate-200
            pt-4
          "
        >
          {pageItems.map(
            (page, index) =>
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
                  disabled={
                    isLoading
                  }
                  onClick={() =>
                    setCurrentPage(
                      page
                    )
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

                    ${
                      currentPage ===
                      page
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

        {/* ==================================================
            RECORD COUNT
        ================================================== */}

        <div className="pt-3 text-center text-xs text-slate-500">
          {totalItems ===
          0
            ? '0 of 0'
            : `${(currentPage - 1) * pageSize + 1}-${Math.min(
                (currentPage - 1) *
                  pageSize +
                  stockItems.length,
                totalItems
              )} of ${totalItems}`}
        </div>
      </section>

      {/* ====================================================
          EDIT MODAL
      ==================================================== */}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
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
                onClick={() => {
                  setIsEditOpen(
                    false
                  );
                  setSaveState(
                    'idle'
                  );
                  setErrorMessage(
                    ''
                  );
                }}
                className="
                  rounded-md
                  p-2
                  text-slate-400
                  hover:bg-slate-100
                  hover:text-slate-600
                "
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2">
              {/* Item Name */}

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Item Name
                </label>

                <input
                  type="text"
                  value={
                    editForm.itemName
                  }
                  onChange={(
                    e
                  ) =>
                    setEditForm(
                      (
                        current
                      ) => ({
                        ...current,
                        itemName:
                          e.target
                            .value,
                      })
                    )
                  }
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

              {/* Quantity */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Quantity
                </label>

                <input
                  type="number"
                  value={
                    editForm.quantity
                  }
                  onChange={(
                    e
                  ) => {
                    const quantity =
                      e.target
                        .value;

                    setEditForm(
                      (
                        current
                      ) => ({
                        ...current,
                        quantity,
                        value:
                          Number(
                            quantity ||
                              0
                          ) *
                          Number(
                            current.rate ||
                              0
                          ),
                      })
                    );
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
                  value={
                    editForm.rate
                  }
                  onChange={(
                    e
                  ) => {
                    const rate =
                      e.target
                        .value;

                    setEditForm(
                      (
                        current
                      ) => ({
                        ...current,
                        rate,
                        value:
                          Number(
                            current.quantity ||
                              0
                          ) *
                          Number(
                            rate ||
                              0
                          ),
                      })
                    );
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
                  value={
                    editForm.value
                  }
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
                  value={
                    editForm.unit
                  }
                  onChange={(
                    e
                  ) =>
                    setEditForm(
                      (
                        current
                      ) => ({
                        ...current,
                        unit:
                          e.target
                            .value,
                      })
                    )
                  }
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

              {/* HSN Code */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  HSN Code
                </label>

                <input
                  type="text"
                  value={
                    editForm.hsnCode
                  }
                  onChange={(
                    e
                  ) =>
                    setEditForm(
                      (
                        current
                      ) => ({
                        ...current,
                        hsnCode:
                          e.target
                            .value,
                      })
                    )
                  }
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

              {/* Godown */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Godown
                </label>

                <input
                  type="text"
                  value={
                    editForm.godown
                  }
                  onChange={(
                    e
                  ) =>
                    setEditForm(
                      (
                        current
                      ) => ({
                        ...current,
                        godown:
                          e.target
                            .value,
                      })
                    )
                  }
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

              {/* Batch */}

              <div>
                <label className="mb-1 block text-xs font-medium text-slate-600">
                  Batch
                </label>

                <input
                  type="text"
                  value={
                    editForm.batch
                  }
                  onChange={(
                    e
                  ) =>
                    setEditForm(
                      (
                        current
                      ) => ({
                        ...current,
                        batch:
                          e.target
                            .value,
                      })
                    )
                  }
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
            </div>

            {/* =================================================
                FOOTER
            ================================================= */}

            <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4">
              {/* SUCCESS */}

              {saveState ===
                'success' && (
                <div className="flex items-center justify-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white">
                    ✓
                  </span>

                  Item updated
                  successfully
                </div>
              )}

              {/* FAILED */}

              {saveState ===
                'failed' && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-red-600">
                      !
                    </div>

                    <div className="flex-1">
                      <div className="text-sm font-semibold text-red-700">
                        Update failed
                      </div>

                      <div className="mt-1 text-xs leading-5 text-slate-600">
                        {errorMessage ||
                          'The item update was rejected by Tally.'}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSaveState(
                          'idle'
                        );
                        setErrorMessage(
                          ''
                        );
                      }}
                      className="
                        text-slate-400
                        hover:text-slate-600
                      "
                      aria-label="Close failed message"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* BUTTONS */}

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditOpen(
                      false
                    );
                    setSaveState(
                      'idle'
                    );
                    setErrorMessage(
                      ''
                    );
                  }}
                  className="
                    rounded-lg
                    border
                    border-slate-300
                    bg-white
                    px-4
                    py-2
                    text-sm
                    font-medium
                    text-slate-700
                    hover:bg-slate-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    handleUpdateStockItem
                  }
                  disabled={
                    isUpdating ||
                    saveState ===
                      'success'
                  }
                  className={`
                    rounded-lg
                    px-5
                    py-2
                    text-sm
                    font-semibold
                    transition-all
                    duration-300

                    ${
                      saveState ===
                      'success'
                        ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                        : saveState ===
                            'failed'
                          ? 'bg-red-600 text-white shadow-lg shadow-red-200 hover:bg-red-700'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }

                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  `}
                >
                  {saveState ===
                  'saving' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                      Saving...
                    </span>
                  ) : saveState ===
                    'success' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                        ✓
                      </span>

                      Updated
                    </span>
                  ) : saveState ===
                    'failed' ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">
                        !
                      </span>

                      Failed
                    </span>
                  ) : (
                    'Update Item'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ItemsPage;
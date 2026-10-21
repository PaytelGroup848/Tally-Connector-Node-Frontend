import { useState } from 'react'
import useAuthStore from '../store/authStore'
import {
  deleteCompanyCommand,
  postCompanyCommand,
} from '../services/companiesApi'
import EditStockItemModal from './items/EditStockItemModal'
import ItemsTable from './items/ItemsTable'
import ItemsToolbar from './items/ItemsToolbar'
import StockItemDialogs from './items/StockItemDialogs'
import useHsnLookup from './items/useHsnLookup'
import useItemsData from './items/useItemsData'
import { columns, getItemValue, stockCommandColumns } from './items/utils'

const emptyEditForm = {
  tallyExternalId: '',
  itemName: '',
  quantity: '',
  rate: '',
  value: '',
  unit: '',
  hsnCode: '',
  godown: '',
  batch: '',
}

function navigate(path) {
  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

function ItemsPage({ companyId, myStockItems = false }) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const visibleColumns = myStockItems ? stockCommandColumns : columns

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const [editForm, setEditForm] = useState(emptyEditForm)
  const [query, setQuery] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [detailDialog, setDetailDialog] = useState(null)
  const [deletingCommandId, setDeletingCommandId] = useState('')
  const [isHsnDropdownOpen, setIsHsnDropdownOpen] = useState(false)

  const {
    stockItems,
    setStockItems,
    totalItems,
    setTotalItems,
    totalPages,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
  } = useItemsData({
    accessToken,
    companyId,
    myStockItems,
    currentPage,
    setCurrentPage,
    pageSize,
    query,
    startDate,
    endDate,
  })
  const {
    hsnOptions,
    setHsnOptions,
    isHsnLoading,
    hsnLookupError,
    setHsnLookupError,
  } = useHsnLookup({
    isEditOpen,
    hsnCode: editForm.hsnCode,
    isDropdownOpen: isHsnDropdownOpen,
  })

  const pageItems =
    totalPages <= 7
      ? Array.from({ length: totalPages }, (_, index) => index + 1)
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
            ]

  const handleEdit = (item) => {
    setEditForm({
      tallyExternalId:
        item?.tallyExternalId ||
        item?.itemTallyExternalId ||
        item?.externalId ||
        '',
      itemName: item?.itemName || item?.name || item?.stockName || '',
      quantity: item?.quantity ?? item?.qty ?? item?.closingStock ?? '',
      rate: item?.rate ?? item?.avgPurRate ?? item?.purchaseRate ?? '',
      value: item?.value ?? item?.amount ?? item?.stockValue ?? '',
      unit: item?.unit || '',
      hsnCode: item?.hsnCode || item?.hsn || item?.productHsn || '',
      godown: item?.godown || item?.warehouse || item?.location || '',
      batch: item?.batch || '',
    })
    setIsEditOpen(true)
  }

  const handleDeleteCommand = async (command) => {
    const commandId =
      command?._id || command?.commandId || command?.command_id || command?.id

    if (!commandId || deletingCommandId) return
    if (!window.confirm('Are you sure, you want to delete this?')) return

    try {
      setDeletingCommandId(String(commandId))
      setErrorMessage('')
      await deleteCompanyCommand(accessToken, companyId, commandId)
      setStockItems((currentItems) =>
        currentItems.filter(
          (item) =>
            String(
              item?._id || item?.commandId || item?.command_id || item?.id,
            ) !== String(commandId),
        ),
      )
      setTotalItems((currentTotal) => Math.max(0, currentTotal - 1))
    } catch (error) {
      setErrorMessage(error?.message || 'Unable to delete command.')
    } finally {
      setDeletingCommandId('')
    }
  }

  const handleUpdateStockItem = async () => {
    if (!accessToken || !companyId) {
      setErrorMessage('Please select a company before updating the item.')
      return
    }

    if (!editForm.tallyExternalId) {
      setErrorMessage('Tally External ID is missing for this item.')
      return
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
    }

    try {
      setIsLoading(true)
      setErrorMessage('')
      const response = await postCompanyCommand(
        accessToken,
        companyId,
        payload,
      )
      console.log('UPDATE_STOCK_ITEM response:', response)

      setStockItems((currentItems) =>
        currentItems.map((item) => {
          const itemTallyId = getItemValue(item, 'itemTallyExternalId')
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
            : item
        }),
      )
      setIsEditOpen(false)
      setShowSuccessDialog(true)
    } catch (error) {
      console.error('UPDATE_STOCK_ITEM failed:', error)
      setErrorMessage(error?.message || 'Unable to update stock item.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page-surface">
      <ItemsToolbar
        query={query}
        setQuery={setQuery}
        pageSize={pageSize}
        setPageSize={setPageSize}
        myStockItems={myStockItems}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        setCurrentPage={setCurrentPage}
      />

      <section className="page-card border border-slate-200 bg-white p-4">
        {errorMessage && (
          <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
            {errorMessage}
          </div>
        )}

        <ItemsTable
          columns={visibleColumns}
          myStockItems={myStockItems}
          isLoading={isLoading}
          stockItems={stockItems}
          deletingCommandId={deletingCommandId}
          onDeleteCommand={handleDeleteCommand}
          onEdit={handleEdit}
          onViewDetails={setDetailDialog}
        />

        <footer className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-4">
          {pageItems.map((pageNumber, index) =>
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
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-9 min-w-9 rounded-lg border px-2 text-sm font-medium transition ${
                  currentPage === pageNumber
                    ? 'border-emerald-600 bg-emerald-600 text-white'
                    : 'border-slate-200 text-slate-700 hover:bg-emerald-50'
                } disabled:cursor-not-allowed disabled:opacity-50`}
              >
                {pageNumber}
              </button>
            ),
          )}
        </footer>

        <div className="pt-3 text-center text-xs text-slate-500">
          {totalItems === 0
            ? '0 of 0'
            : `${(currentPage - 1) * pageSize + 1}-${
                (currentPage - 1) * pageSize + stockItems.length
              } of ${totalItems}`}
        </div>
      </section>

      <StockItemDialogs
        detailDialog={detailDialog}
        onCloseDetails={() => setDetailDialog(null)}
        showSuccessDialog={showSuccessDialog}
        onCloseSuccess={() => setShowSuccessDialog(false)}
        onViewStatus={() => {
          setShowSuccessDialog(false)
          navigate('/my-stock-items')
        }}
      />

      {isEditOpen && (
        <EditStockItemModal
          editForm={editForm}
          setEditForm={setEditForm}
          onClose={() => setIsEditOpen(false)}
          onSubmit={handleUpdateStockItem}
          hsnOptions={hsnOptions}
          isHsnLoading={isHsnLoading}
          isHsnDropdownOpen={isHsnDropdownOpen}
          setIsHsnDropdownOpen={setIsHsnDropdownOpen}
          hsnLookupError={hsnLookupError}
          setHsnOptions={setHsnOptions}
          setHsnLookupError={setHsnLookupError}
        />
      )}
    </div>
  )
}

export default ItemsPage

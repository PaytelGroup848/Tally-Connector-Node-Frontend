import { useEffect, useState } from 'react'
import {
  extractCommands,
  extractLedgerPagination,
  extractStockItems,
  fetchCompanyCommands,
  fetchCompanyStock,
} from '../../services/companiesApi'
import { isCreatedAtInRange } from './utils'

export default function useItemsData({
  accessToken,
  companyId,
  myStockItems,
  currentPage,
  setCurrentPage,
  pageSize,
  query,
  startDate,
  endDate,
}) {
  const [stockItems, setStockItems] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!accessToken || !companyId) {
      setStockItems([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage(
        accessToken
          ? 'No company is selected.'
          : 'Your session has expired. Please sign in again.',
      )
      return undefined
    }

    let isMounted = true
    setIsLoading(true)
    setErrorMessage('')

    const stockRequest = myStockItems
      ? Promise.resolve(null)
      : fetchCompanyStock(accessToken, companyId, {
          page: currentPage,
          limit: pageSize,
          q: query,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        })

    const commandRequest = myStockItems
      ? Promise.all([
          fetchCompanyCommands(accessToken, companyId, {
            type: 'CREATE_STOCK_ITEM',
            page: 1,
            limit: currentPage * pageSize,
            q: query,
          }),
          fetchCompanyCommands(accessToken, companyId, {
            type: 'UPDATE_STOCK_ITEM',
            page: 1,
            limit: currentPage * pageSize,
            q: query,
          }),
        ]).then(([createResponse, updateResponse]) => {
          const getTotal = (response) => {
            const pagination =
              response?.pagination ||
              response?.data?.pagination ||
              response?.meta ||
              response?.data ||
              response
            const total = Number(
              pagination?.total ??
                pagination?.totalItems ??
                pagination?.totalRecords ??
                pagination?.count,
            )
            return Number.isFinite(total) && total >= 0
              ? total
              : extractCommands(response).length
          }

          const getTime = (item) => {
            const date =
              item?.createdAt ||
              item?.created_at ||
              item?.submittedAt ||
              item?.submitted_at
            const time = date ? new Date(date).getTime() : 0
            return Number.isNaN(time) ? 0 : time
          }

          const commands = [
            ...extractCommands(createResponse),
            ...extractCommands(updateResponse),
          ].sort((a, b) => getTime(b) - getTime(a))
          const total = getTotal(createResponse) + getTotal(updateResponse)

          return {
            __mergedCommands: commands,
            pagination: {
              total,
              totalItems: total,
              totalPages: Math.max(1, Math.ceil(total / pageSize)),
            },
          }
        })
      : Promise.resolve(null)

    Promise.allSettled([stockRequest, commandRequest])
      .then(([stockResult, commandResult]) => {
        if (!isMounted) return

        if (myStockItems && commandResult.status === 'rejected') {
          throw commandResult.reason
        }
        if (!myStockItems && stockResult.status === 'rejected') {
          throw stockResult.reason
        }

        const stockItemsFromApi =
          stockResult.status === 'fulfilled' && stockResult.value
            ? extractStockItems(stockResult.value)
            : []
        const commandItemsFromApi =
          commandResult.status === 'fulfilled' && commandResult.value
            ? myStockItems
              ? (commandResult.value?.__mergedCommands || []).slice(
                  (currentPage - 1) * pageSize,
                  currentPage * pageSize,
                )
              : []
            : []
        const mergedItems = myStockItems
          ? commandItemsFromApi
          : stockItemsFromApi

        const uniqueItems = mergedItems.filter((item, index, arr) => {
          const key =
            item?._id ||
            item?.id ||
            item?.tallyExternalId ||
            item?.itemTallyExternalId
          return (
            key &&
            arr.findIndex((candidate) => {
              const candidateKey =
                candidate?._id ||
                candidate?.id ||
                candidate?.tallyExternalId ||
                candidate?.itemTallyExternalId
              return candidateKey && candidateKey === key
            }) === index
          )
        })
        const filteredItems =
          !myStockItems && startDate && endDate
            ? uniqueItems.filter((item) =>
                isCreatedAtInRange(item, startDate, endDate),
              )
            : uniqueItems
        const stockPagination =
          stockResult.status === 'fulfilled' && stockResult.value
            ? extractLedgerPagination(stockResult.value)
            : {}
        const commandPagination =
          commandResult.status === 'fulfilled' && commandResult.value
            ? commandResult.value?.pagination || {}
            : {}
        const responseTotal = Number(
          stockPagination.total ??
            stockPagination.totalItems ??
            stockPagination.totalRecords ??
            stockPagination.count ??
            commandPagination.total ??
            commandPagination.totalItems ??
            commandPagination.totalRecords ??
            commandPagination.count ??
            filteredItems.length,
        )
        const responsePages = Number(
          stockPagination.totalPages ??
            stockPagination.total_pages ??
            stockPagination.pages ??
            stockPagination.lastPage ??
            commandPagination.totalPages ??
            commandPagination.total_pages ??
            commandPagination.pages ??
            commandPagination.lastPage ??
            Math.ceil(
              (Number.isFinite(responseTotal)
                ? responseTotal
                : filteredItems.length) / pageSize,
            ),
        )
        const nextTotal =
          Number.isFinite(responseTotal) && responseTotal >= 0
            ? responseTotal
            : filteredItems.length
        const nextPages =
          Number.isFinite(responsePages) && responsePages > 0
            ? responsePages
            : Math.max(1, Math.ceil(nextTotal / pageSize))

        setStockItems(filteredItems)
        setTotalItems(nextTotal)
        setTotalPages(nextPages)
      })
      .catch((error) => {
        if (isMounted) {
          setErrorMessage(error?.message || 'Unable to load stock items')
        }
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [
    accessToken,
    companyId,
    currentPage,
    pageSize,
    query,
    myStockItems,
    startDate,
    endDate,
  ])

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [setCurrentPage, totalPages])

  return {
    stockItems,
    setStockItems,
    totalItems,
    setTotalItems,
    totalPages,
    setTotalPages,
    isLoading,
    setIsLoading,
    errorMessage,
    setErrorMessage,
  }
}

import { useEffect, useMemo, useState } from 'react'
import useAuthStore from '../../store/authStore'
import {
  extractDayBookPagination,
  extractDayBookRows,
  fetchDayBook,
} from '../../services/companiesApi'
import { isHiddenField } from './utils'

export default function useDayBookData(companyId) {
  const accessToken = useAuthStore((state) => state.accessToken)
  const [rows, setRows] = useState([])
  const [query, setQuery] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setPage(1)
  }, [companyId, fromDate, toDate, pageSize, query])

  useEffect(() => {
    if (!accessToken) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage('Session expired. Please sign in.')
      return undefined
    }

    if (!companyId) {
      setRows([])
      setTotalItems(0)
      setTotalPages(1)
      setErrorMessage('No company selected.')
      return undefined
    }

    let isMounted = true

    async function loadDayBook() {
      try {
        setIsLoading(true)
        setErrorMessage('')

        const response = await fetchDayBook(accessToken, companyId, {
          from: fromDate,
          to: toDate,
          page,
          limit: pageSize,
          q: query,
        })

        if (!isMounted) return

        console.log('DAY BOOK API RESPONSE:', response)

        const nextRows = extractDayBookRows(response)
        const pagination = extractDayBookPagination(response)

        console.log('DAY BOOK ROWS:', nextRows)
        console.log('DAY BOOK PAGINATION:', pagination)
        const totalCandidates = [
          pagination?.total,
          pagination?.totalItems,
          pagination?.totalRecords,
          pagination?.count,
        ]
        const totalFromApi = totalCandidates.find(
          (value) =>
            value !== undefined &&
            value !== null &&
            Number.isFinite(Number(value)),
        )
        const safeTotal =
          totalFromApi !== undefined
            ? Number(totalFromApi)
            : nextRows.length

        const apiLimit = Number(
          pagination?.limit ?? pagination?.pageSize ?? pageSize,
        )
        const safeLimit =
          Number.isFinite(apiLimit) && apiLimit > 0
            ? apiLimit
            : pageSize
        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(safeTotal / safeLimit),
        )
        const apiTotalPages = Number(
          pagination?.totalPages ??
            pagination?.pages ??
            calculatedTotalPages,
        )
        const safeTotalPages =
          Number.isFinite(apiTotalPages) && apiTotalPages > 0
            ? apiTotalPages
            : calculatedTotalPages

        setRows(nextRows)
        setTotalItems(safeTotal)
        setTotalPages(safeTotalPages)
      } catch (error) {
        if (!isMounted) return

        console.error('DAY BOOK API ERROR:', error)
        setRows([])
        setTotalItems(0)
        setTotalPages(1)
        setErrorMessage(error?.message || 'Unable to load day book')
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDayBook()
    return () => {
      isMounted = false
    }
  }, [accessToken, companyId, fromDate, toDate, page, pageSize, query])

  const fields = useMemo(() => {
    const keys = new Set()

    rows.forEach((row) => {
      if (!row || typeof row !== 'object') return

      Object.keys(row).forEach((key) => {
        if (!isHiddenField(key)) keys.add(key)
      })
    })

    return Array.from(keys)
  }, [rows])

  const pageItems = useMemo(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, index) => index + 1)
    }

    if (page <= 4) {
      return [1, 2, 3, 4, 5, '...', totalPages]
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
      ]
    }

    return [1, '...', page - 1, page, page + 1, '...', totalPages]
  }, [page, totalPages])

  const recordStart = totalItems > 0 ? (page - 1) * pageSize + 1 : 0
  const recordEnd =
    totalItems > 0 ? Math.min(page * pageSize, totalItems) : 0

  return {
    rows,
    query,
    setQuery,
    fromDate,
    setFromDate,
    toDate,
    setToDate,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalItems,
    totalPages,
    isLoading,
    errorMessage,
    fields,
    pageItems,
    recordStart,
    recordEnd,
  }
}

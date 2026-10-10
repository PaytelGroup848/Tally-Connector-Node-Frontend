// frontend/src/hooks/useInfiniteLedgers.js
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  fetchCompanyLedgers,
  extractLedgers,
  extractLedgerPagination,
} from '../services/companiesApi'

const LIMIT = 20

export function useInfiniteLedgers(accessToken, companyId, search = '') {
  return useInfiniteQuery({
    queryKey: ['ledgers', companyId, search],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await fetchCompanyLedgers(accessToken, companyId, {
        page: pageParam,
        limit: LIMIT,
        q: search,
      })

      const items = extractLedgers(response)
      const pagination = extractLedgerPagination(response)

      return {
        items,
        pagination,
        nextPage: pageParam + 1,
        // Stop when we get fewer items than LIMIT
        hasMore: items.length >= LIMIT,
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.nextPage : undefined,
    enabled: !!accessToken && !!companyId,
  })
}
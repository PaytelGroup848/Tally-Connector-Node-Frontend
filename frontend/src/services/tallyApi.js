import { apiRequest } from './api'

export function getTallyStatus() {
  return apiRequest('/api/tally/status')
}

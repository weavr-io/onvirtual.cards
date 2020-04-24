import { Schemas as CommonSchemas } from '~/api/Schemas'

export interface StatementRequest {
  paging?: CommonSchemas.PagingRequest
  orderByTimestamp?: CommonSchemas.OrderType
  fromTimestamp?: number
  toTimestamp?: number
  showFundMovementsOnly?: boolean
}

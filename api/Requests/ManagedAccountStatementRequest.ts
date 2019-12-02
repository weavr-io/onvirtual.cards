import { Schemas } from '~/api/Schemas'
import { OrderType } from '~/api/Enums/OrderType'
import PagingRequest = Schemas.PagingRequest

export interface ManagedAccountStatementRequest {
  paging?: PagingRequest
  orderByTimestamp?: OrderType
  fromTimestamp?: bigint
  toTimestamp?: bigint
  showFundMovementsOnly?: boolean
}

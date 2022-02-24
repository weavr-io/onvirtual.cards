import { OrderTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/enums/OrderTypeEnum'

export interface GetManagedCardStatementRequest {
  offset?: number
  limit?: number
  orderByTimestamp?: OrderTypeEnum
  fromTimestamp?: number
  toTimestamp?: number
}

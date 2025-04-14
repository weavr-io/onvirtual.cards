import { OrderTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/enums/OrderTypeEnum'
import type { PagingModel } from '~/plugins/weavr-multi/api/models/common/models/PagingModel'

export interface GetManagedAccountStatementRequest extends PagingModel {
    orderByTimestamp?: OrderTypeEnum
    fromTimestamp?: number
    toTimestamp?: number
    showFundMovementsOnly?: boolean
}

import { OrderTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/enums/OrderTypeEnum'
import { PagingModel } from '~/plugins/weavr-multi/api/models/common/PagingModel'

export interface GetManagedAccountStatementRequest extends PagingModel {
    orderByTimestamp?: OrderTypeEnum
    fromTimestamp?: number
    toTimestamp?: number
    showFundMovementsOnly?: boolean
}

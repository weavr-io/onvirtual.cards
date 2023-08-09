import { PagingModel } from '~/plugins/weavr-multi/api/models/common/PagingModel'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'

export interface ManagedAccountsStatementsFilterRequest {
    paging?: PagingModel
    orderByTimestamp?: OrderEnum
    fromTimestamp?: string
    toTimestamp?: string
    showFundMovementsOnly?: boolean
}

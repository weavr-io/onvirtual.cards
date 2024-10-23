import type { PagingModel } from '~/plugins/weavr-multi/api/models/common/models/PagingModel'
import { OrderEnum } from '~/plugins/weavr-multi/api/models/common/enums/OrderEnum'

export interface StatementFiltersRequest extends PagingModel {
    orderByTimestamp?: OrderEnum
    fromTimestamp?: string
    toTimestamp?: string
}

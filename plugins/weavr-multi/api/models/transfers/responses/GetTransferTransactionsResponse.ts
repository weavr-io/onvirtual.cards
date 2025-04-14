import type { TransferModel } from '~/plugins/weavr-multi/api/models/transfers/models/TransferModel'
import type { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'

export interface GetTransferTransactionsResponse extends PaginatedResponse {
    transfer: TransferModel[]
}

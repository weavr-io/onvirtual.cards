import { TransferModel } from '~/plugins/weavr-multi/api/models/transfers/models/TransferModel'
import { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'

export interface GetTransferTransactionsResponse extends PaginatedResponse {
    transfer: TransferModel[]
}

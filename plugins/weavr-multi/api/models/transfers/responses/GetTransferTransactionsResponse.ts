import { TransferModel } from '~/plugins/weavr-multi/api/models/transfers/models/TransferModel'

export interface GetTransferTransactionsResponse {
  transfer: TransferModel
  count: number
  responseCount: number
}

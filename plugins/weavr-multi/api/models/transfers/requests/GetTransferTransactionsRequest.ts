import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/InstrumentIdModel'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'

export interface getTransferTransactionsRequest {
  offset?: number
  limit?: number
  profileId?: string
  instrumentId?: InstrumentIdModel
  state?: TransactionStateTypeEnum
  createdFrom?: number
  createdTo?: number
  tag?: string
}

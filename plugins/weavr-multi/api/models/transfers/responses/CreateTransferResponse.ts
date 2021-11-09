import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/InstrumentIdModel'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'
import { CurrencyAmountModel } from '~/plugins/weavr-multi/api/models/common/CurrencyAmountModel'

export interface createTransferResponse {
  id: string
  profileId: string
  tag?: string
  source: InstrumentIdModel
  destination: InstrumentIdModel
  destinationAmount: CurrencyAmountModel
  state: TransactionStateTypeEnum
  creationTimestamp: number
}

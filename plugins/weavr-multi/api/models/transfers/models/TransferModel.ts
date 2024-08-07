import { InstrumentID } from '~/plugins/weavr-multi/api/models/common/models/InstrumentIdModel'
import { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export interface TransferModel {
    id: string
    profileId: IDModel
    tag?: string
    source: InstrumentID
    destination: InstrumentID
    destinationAmount: CurrencyAmount
    state: TransactionStateTypeEnum
    creationTimestamp: string | bigint
}

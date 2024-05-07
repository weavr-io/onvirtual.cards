import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/models/InstrumentIdModel'
import { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export interface CreateTransferRequest {
    profileId: IDModel
    tag?: string
    source: InstrumentIdModel
    destination: InstrumentIdModel
    destinationAmount: CurrencyAmount
}

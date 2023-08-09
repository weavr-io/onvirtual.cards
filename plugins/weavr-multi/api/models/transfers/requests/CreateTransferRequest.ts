import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/InstrumentIdModel'
import { CurrencyAmountModel } from '~/plugins/weavr-multi/api/models/common/CurrencyAmountModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'

export interface CreateTransferRequest {
    profileId: IDModel
    tag?: string
    source: InstrumentIdModel
    destination: InstrumentIdModel
    destinationAmount: CurrencyAmountModel
}

import type { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { InstrumentID } from '~/plugins/weavr-multi/api/models/common/models/InstrumentIdModel'

export interface CreateTransferRequest {
    profileId: IDModel
    tag?: string
    source: InstrumentID
    destination: InstrumentID
    destinationAmount: CurrencyAmount
}

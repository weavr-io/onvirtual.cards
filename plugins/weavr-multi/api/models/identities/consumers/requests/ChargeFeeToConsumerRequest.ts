import type { InstrumentID } from '~/plugins/weavr-multi/api/models/common/models/InstrumentIdModel'

export interface ChargeFeeToConsumerRequest {
    feeType: string
    source: InstrumentID
}

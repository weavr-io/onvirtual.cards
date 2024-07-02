import { InstrumentID } from '~/plugins/weavr-multi/api/models/common/models/InstrumentIdModel'

export interface ChargeFeeToCorporateRequest {
    feeType: string
    source: InstrumentID
}

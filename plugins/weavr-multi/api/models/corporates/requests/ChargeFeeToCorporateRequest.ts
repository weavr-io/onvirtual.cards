import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/InstrumentIdModel'

export interface ChargeFeeToCorporateRequest {
  feeType: string
  source: InstrumentIdModel
}

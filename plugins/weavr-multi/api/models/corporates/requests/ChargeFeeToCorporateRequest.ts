import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/InstrumentIdModel'

export interface ChargeFeeToCorporate {
  feeType: string
  source: InstrumentIdModel
}

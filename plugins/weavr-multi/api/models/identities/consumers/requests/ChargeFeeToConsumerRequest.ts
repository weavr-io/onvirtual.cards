import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/InstrumentIdModel'

export interface ChargeFeeToConsumerRequest {
  feeType: string
  source: InstrumentIdModel
}

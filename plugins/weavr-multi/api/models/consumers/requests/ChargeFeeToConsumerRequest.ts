import { InstrumentIdModel } from '~/plugins/weavr-multi/api/models/common/InstrumentIdModel'

export interface ChargeFeeToConsumer {
  feeType: string
  source: InstrumentIdModel
}

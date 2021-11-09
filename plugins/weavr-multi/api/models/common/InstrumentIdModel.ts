import { InstrumentEnum } from '~/plugins/weavr-multi/api/models/common/enums/InstrumentEnum'

export interface InstrumentIdModel {
  type?: InstrumentEnum
  id?: string
}

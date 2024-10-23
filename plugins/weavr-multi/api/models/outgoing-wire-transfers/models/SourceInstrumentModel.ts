import { ManagedInstrumentTypeEnum } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/enums/ManagedInstrumentTypeEnum'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export interface SourceInstrumentModel {
    type?: ManagedInstrumentTypeEnum
    id?: IDModel
}

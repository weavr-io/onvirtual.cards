import { ManagedInstrumentTypeEnum } from '~/plugins/weavr-multi/api/models/outgoing-wire-transfers/enums/ManagedInstrumentTypeEnum'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'

export interface SourceInstrumentModel {
    type?: ManagedInstrumentTypeEnum
    id?: IDModel
}

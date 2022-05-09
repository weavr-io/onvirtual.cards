import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { ManagedInstrumentBlockedReasonEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentBlockedReasonEnum'
import { ManagedInstrumentDestroyedReasonEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentDestroyedReasonEnum'

export interface ManagedInstrumentStateModel {
  state: ManagedInstrumentStateEnum
  blockedReason?: ManagedInstrumentBlockedReasonEnum
  destroyedReason?: ManagedInstrumentDestroyedReasonEnum
}

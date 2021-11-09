import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedCardTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardTypeEnum'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'
import { ManufacturingStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManufacturingStateEnum'

export interface GetManagedCardsRequest {
  offset?: number
  limit?: number
  profileId?: string
  friendlyName?: string
  state?: ManagedInstrumentStateEnum
  // state.blockedReason
  // state.destroyedReason
  currency?: CurrencyEnum
  type?: ManagedCardTypeEnum
  externalHandle?: string
  cardNumberFirstSix?: string
  cardNumberLastFour?: string
  createdFrom?: number
  createdTo?: number
  mode?: ManagedCardModeEnum
  tag?: string
  parentManagedAccountId?: string
  manufacturingState: ManufacturingStateEnum
}

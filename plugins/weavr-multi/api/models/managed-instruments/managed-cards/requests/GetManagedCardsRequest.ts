import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedCardTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardTypeEnum'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'
import { ManufacturingStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManufacturingStateEnum'
import type { PagingModel } from '~/plugins/weavr-multi/api/models/common/models/PagingModel'
import { ManagedInstrumentBlockedReasonEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentBlockedReasonEnum'
import { ManagedInstrumentDestroyedReasonEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentDestroyedReasonEnum'

export interface GetManagedCardsRequest extends PagingModel {
    profileId?: string
    friendlyName?: string
    state?: string
    ['state.blockedReason']?: ManagedInstrumentBlockedReasonEnum
    ['state.destroyedReason']?: ManagedInstrumentDestroyedReasonEnum
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
    manufacturingState?: ManufacturingStateEnum
}

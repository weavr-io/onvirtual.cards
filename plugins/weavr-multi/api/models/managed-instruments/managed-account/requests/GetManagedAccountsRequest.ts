import { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { PagingModel } from '~/plugins/weavr-multi/api/models/common/models/PagingModel'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'
import { ManagedInstrumentBlockedReasonEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentBlockedReasonEnum'
import { ManagedInstrumentDestroyedReasonEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentDestroyedReasonEnum'

export interface GetManagedAccountsRequest extends PagingModel {
    profileId?: IDModel
    friendlyName?: string
    state: ManagedInstrumentStateEnum
    ['state.blockedReason']?: ManagedInstrumentBlockedReasonEnum
    ['state.destroyedReason']?: ManagedInstrumentDestroyedReasonEnum
    currency?: CurrencyEnum
    createdFrom?: number
    createdTo?: number
    tag?: string
}

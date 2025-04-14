import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { ManagedInstrumentBalanceModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentBalanceModel'
import type { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import type { CreationTimestamp } from '~/plugins/weavr-multi/api/models/common/models/Timestamp'

export interface ManagedAccountModel extends CreationTimestamp {
    id: IDModel
    profileId: IDModel
    tag?: string
    friendlyName: string
    currency: CurrencyEnum
    balances: ManagedInstrumentBalanceModel
    state: ManagedInstrumentStateModel
}

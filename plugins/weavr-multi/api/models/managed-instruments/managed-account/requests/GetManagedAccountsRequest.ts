import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'

export interface GetManagedAccountsRequest {
  offset?: number
  limit?: number
  profileId?: IDModel
  friendlyName?: string
  state?: ManagedInstrumentStateModel
  currency?: CurrencyEnum
  createdFrom?: number
  createdTo?: number
  tag?: string
}

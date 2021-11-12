import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'
import { PagingModel } from '~/plugins/weavr-multi/api/models/common/PagingModel'

export interface GetManagedAccountsRequest extends PagingModel {
  profileId?: IDModel
  friendlyName?: string
  state?: ManagedInstrumentStateModel
  currency?: CurrencyEnum
  createdFrom?: number
  createdTo?: number
  tag?: string
}

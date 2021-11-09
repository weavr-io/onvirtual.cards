import { IDModel } from '../../../common/IDModel'
import { ManagedInstrumentBalanceModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentBalanceModel'
import { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'
import { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'

export interface ManagedAccountModel extends CreateManagedAccountRequest {
  id: IDModel
  profileId: IDModel
  tag?: string
  friendlyName: string
  currency: string
  balances: ManagedInstrumentBalanceModel
  state: ManagedInstrumentStateModel
  creationTimestamp: IDModel
}

import { IDModel } from '../../../common/IDModel'
import { ManagedInstrumentBalanceModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentBalanceModel'
import { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'
import { IdentityIdModel } from '~/plugins/weavr-multi/api/models/common/IdentityIdModel'

export interface ManagedAccountModel {
  id: IdentityIdModel
  profileId: IDModel
  tag?: string
  friendlyName: string
  currency: string
  balances: ManagedInstrumentBalanceModel
  state: ManagedInstrumentStateModel
  creationTimestamp: number
}

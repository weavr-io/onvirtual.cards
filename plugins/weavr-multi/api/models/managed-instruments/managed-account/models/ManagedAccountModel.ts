import { IDModel } from '../../../common/IDModel'
import { ManagedInstrumentBalanceModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentBalanceModel'
import { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'

export interface ManagedAccountModel {
  id: IDModel
  profileId: IDModel
  tag?: string
  friendlyName: string
  currency: string
  balances: ManagedInstrumentBalanceModel
  state: ManagedInstrumentStateModel
  creationTimestamp: number
}

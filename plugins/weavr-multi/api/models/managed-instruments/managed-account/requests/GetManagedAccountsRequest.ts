import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

export interface GetManagedAccountsRequest {
  offset?: number
  limit?: number
  profileId?: string
  friendlyName?: string
  state?: ManagedInstrumentStateEnum
  // state.blockedReason
  // state.destroyedReason
  currency: string
  createdFrom: number
  createdTo: number
  tag: string
}

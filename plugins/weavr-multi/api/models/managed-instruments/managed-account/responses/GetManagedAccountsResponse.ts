import { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'

export interface getManagedAccountsResponse {
  accounts: ManagedAccountModel
  count: number
  responseCount: number
}

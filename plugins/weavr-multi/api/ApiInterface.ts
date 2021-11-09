import { AuthenticationApi } from '~/plugins/weavr-multi/api/AuthenticationApi'
import { ManagedAccountsApi } from '~/plugins/weavr-multi/api/ManagedAccountsApi'
import { ManagedCardsApi } from '~/plugins/weavr-multi/api/ManagedCardsApi'
import { CorporatesApi } from '~/plugins/weavr-multi/api/CorporatesApi'
import { PasswordsApi } from '~/plugins/weavr-multi/api/PasswordsApi'
import { IpifyApi } from '~/plugins/weavr-multi/api/IpifyApi'
import { TransfersApi } from '~/plugins/weavr-multi/api/TransfersApi'
import { OutgoingWireTransferApi } from '~/plugins/weavr-multi/api/OutgoingWireTransferApi'
import { UsersApi } from '~/plugins/weavr-multi/api/UsersApi'
import { ConsumersApi } from '~/plugins/weavr-multi/api/ConsumersApi'

export interface ApiInterface {
  authentication: AuthenticationApi
  managedAccounts: ManagedAccountsApi
  managedCards: ManagedCardsApi
  corporates: CorporatesApi
  consumers: ConsumersApi
  passwords: PasswordsApi
  transfers: TransfersApi
  outgoingWireTransfers: OutgoingWireTransferApi
  ipify: IpifyApi
  users: UsersApi
}

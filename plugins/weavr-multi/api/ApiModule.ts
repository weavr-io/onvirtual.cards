import { ApiInterface } from '~/plugins/weavr-multi/api/ApiInterface'
import { AuthenticationApi } from '~/plugins/weavr-multi/api/AuthenticationApi'
import { ManagedAccountsApi } from '~/plugins/weavr-multi/api/ManagedAccountsApi'
import { ManagedCardsApi } from '~/plugins/weavr-multi/api/ManagedCardsApi'
import { CorporatesApi } from '~/plugins/weavr-multi/api/CorporatesApi'
import { PasswordsApi } from '~/plugins/weavr-multi/api/PasswordsApi'
import { IpifyApi } from '~/plugins/weavr-multi/api/IpifyApi'
import { TransfersApi } from '~/plugins/weavr-multi/api/TransfersApi'
import { OutgoingWireTransferApi } from '~/plugins/weavr-multi/api/OutgoingWireTransferApi'
import { UsersApi } from '~/plugins/weavr-multi/api/UsersApi'

export class ApiModule implements ApiInterface {
  authentication: AuthenticationApi
  managedAccounts: ManagedAccountsApi
  managedCards: ManagedCardsApi
  corporates: CorporatesApi
  passwords: PasswordsApi
  transfers: TransfersApi
  outgoingWireTransfers: OutgoingWireTransferApi
  ipify: IpifyApi
  users: UsersApi

  constructor() {
    this.authentication = new AuthenticationApi()
    this.managedAccounts = new ManagedAccountsApi()
    this.managedCards = new ManagedCardsApi()
    this.corporates = new CorporatesApi()
    this.passwords = new PasswordsApi()
    this.transfers = new TransfersApi()
    this.outgoingWireTransfers = new OutgoingWireTransferApi()
    this.ipify = new IpifyApi()
    this.users = new UsersApi()
  }
}

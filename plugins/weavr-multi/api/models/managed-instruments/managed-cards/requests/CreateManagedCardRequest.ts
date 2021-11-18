import { IDModel } from '../../../common/IDModel'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'

export interface CreateManagedCardRequest {
  profileId: IDModel
  tag?: string
  friendlyName: string
  nameOnCard: string
  cardholderMobileNumber: string
  billingAddress: AddressModel
  mode: ManagedCardModeEnum
  currency: CurrencyEnum
}

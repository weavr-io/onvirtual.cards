import { IDModel } from '../../../common/IDModel'
import { ManagedInstrumentBalanceModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentBalanceModel'
import { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'
import { SensitiveCardNumberModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/SensitiveCardNumberModel'
import { SensitiveCvvModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/SensitiveCvvModel'
import { IdentityTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/IdentityTypeEnum'
import { RenewalTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/RenewalTypeEnum'
import { PhysicalCardDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/PhysicalCardDetailsModel'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { ManagedCardTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardTypeEnum'
import { ManagedCardBrandEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardBrandEnum'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'
import { CreationTimestamp } from '~/plugins/weavr-multi/api/models/common/models/Timestamp'

export interface ManagedCardModel extends CreationTimestamp {
  id: IDModel
  profileId: IDModel
  externalHandle: string
  tag?: string
  friendlyName: string
  currency: string
  balances?: ManagedInstrumentBalanceModel
  state: ManagedInstrumentStateModel
  type: ManagedCardTypeEnum
  cardBrand: ManagedCardBrandEnum
  cardNumber?: SensitiveCardNumberModel
  cvv?: SensitiveCvvModel
  cardNumberFirstSix?: string
  cardNumberLastFour?: string
  nameOnCard: string
  startMmyy?: string
  expiryMmyy?: string
  cardLevelClassification: IdentityTypeEnum
  expiryPeriodMonths: number
  renewalType: RenewalTypeEnum
  cardholderMobileNumber: string
  billingAddress?: AddressModel
  physicalCardDetails?: PhysicalCardDetailsModel
  mode: ManagedCardModeEnum
}

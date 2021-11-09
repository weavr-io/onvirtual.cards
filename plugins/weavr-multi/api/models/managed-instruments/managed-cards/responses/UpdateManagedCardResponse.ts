import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedInstrumentStateModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentStateModel'
import { ManagedCardTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardTypeEnum'
import { ManagedCardBrandEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardBrandEnum'
import { SensitiveCardNumberModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/SensitiveCardNumberModel'
import { SensitiveCvvModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/SensitiveCvvModel'
import { RenewalTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/RenewalTypeEnum'
import { PhysicalCardDetailsModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/models/PhysicalCardDetailsModel'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'
import { ManagedInstrumentBalanceModel } from '~/plugins/weavr-multi/api/models/managed-instruments/models/ManagedInstrumentBalanceModel'

export interface UpdateManagedCardResponse {
  id: string
  profileId: string
  externalHandle: string
  tag?: string
  friendlyName: string
  currency: CurrencyEnum
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
  cardLevelClassification: string
  expiryPeriodMonths: number
  renewalType: RenewalTypeEnum
  creationTimestamp: number
  cardholderMobileNumber: string
  billingAddress?: AddressModel
  physicalCardDetails?: PhysicalCardDetailsModel
  mode: ManagedCardModeEnum
  balances: ManagedInstrumentBalanceModel
}

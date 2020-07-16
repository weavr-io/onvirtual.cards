import { Currencies } from '~/api/Constants/CurrencyOptions'
import { CardBrand, CardType } from '~/api/Constants/Card'
import { Address } from '~/api/Models/Common/Address'

export module ManagedCardsSchemas {
  export interface ManagedInstrumentBalances {
    availableBalance?: string
    actualBalance?: number
  }

  export interface ManagedCard {
    id: {
      type: string
      id: number
    }
    profileId: string
    tag: string
    owner: {
      type: string
      id: string
    }
    friendlyName: string
    active: boolean
    currency: Currencies
    balances: ManagedInstrumentBalances
    state: {
      blockTypes: object
      destroyType: string
    }
    fiProvider: string
    channelProvider: string
    type: CardType
    cardBrand: CardBrand
    cardNumber: string
    cvv: string
    cardNumberFirstSix: string
    cardNumberLastFour: string
    nameOnCard: string
    startMmyy: string
    expiryMmyy: string
    cardLevelClassification: string
    expiryPeriodMonths: number
    renewalType: string
    creationTimestamp: string
    action: any[]
    cardholderMobileNumber: string
    billingAddress?: Nullable<Address>
  }

  export interface CreateManagedCardRequest {
    profileId: any
    tag?: string
    friendlyName: string
    currency: string
    nameOnCard: string
    cardholderMobileNumber?: string
    billingAddress?: Nullable<Address>
  }

  export interface DestroyRequest {
    id: string
    body: {
      destroyType: string
    }
  }
}

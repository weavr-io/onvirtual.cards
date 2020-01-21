import { Currencies } from '~/api/Constants/CurrencyOptions'
import { CardBrand, CardType } from '~/api/Constants/Card'
import { Schemas as CommonSchemas, Schemas } from '~/api/Schemas'

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
    ownerId: {
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
  }

  export interface ManagedCardStatementRequest {
    paging?: CommonSchemas.PagingRequest
    orderByTimestamp?: CommonSchemas.OrderType
    fromTimestamp?: number
    toTimestamp?: number
    showFundMovementsOnly?: boolean
  }

  export interface GetManagedCardStatementRequest {
    request: ManagedCardStatementRequest
    id: number
  }

  export interface ManagedCardStatement {
    entry: ManagedCardStatementEntry[]
    count?: number
    responseCount?: number
  }

  export interface ManagedCardStatementEntry {
    txId: {
      type: string
      id: number
    }
    originalAmount?: Schemas.CurrencyAmount
    forexRate?: Schemas.ScaledAmount
    currency: string
    adjustment?: number
    balanceAfter?: number
    fee?: {
      [k: string]: number
    }
    block?: boolean | null
    destroy?: boolean
    processedTimestamp?: number
  }

  export interface CreateManagedCardRequest {
    profileId: any
    tag?: string
    owner: {
      type: string
      id: number
    }
    friendlyName: string
    currency: string
    fiProvider: string
    channelProvider: string
    nameOnCard?: string
    createNow?: boolean
  }

  export interface DestroyRequest {
    id: string
    body: {
      destroyType: string
    }
  }
}

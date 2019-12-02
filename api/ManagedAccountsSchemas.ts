import { Schemas } from './Schemas'

export module ManagedAccountsSchemas {
  export interface CreateManagedAccountRequest {
    profileId: any
    tag?: string
    owner: {
      type: string
      id: number
    }
    friendlyName: string
    currency: string
    fiProvider: string
    createNow?: boolean
    channelProvider: string
  }

  export interface ManagedAccounts {
    account: ManagedAccount[]
    count: number
    action: []
  }

  export interface ManagedAccount {
    id: {
      type: string
      id: string
    }
    profileId: number
    tag?: string
    ownerId: {
      type: string
      id: number
    }
    friendlyName: string
    active?: boolean
    currency: string
    balances: InstrumentBalances
    state: InstrumentState
    fiProvider: string
    creationTimestamp: string
    action: ManagedAccountAction
  }

  export interface InstrumentState {
    [k: string]: number
  }

  export interface InstrumentBalances {
    availableBalance?: string
    reservedBalance?: string
    deltaBalance?: string
    pendingBalance?: string
    limitBalance?: string
  }

  export enum ManagedAccountAction {
    UPDATE = 'UPDATE',
    BLOCK = 'BLOCK',
    UNBLOCK = 'UNBLOCK',
    DESTROY = 'DESTROY'
  }

  export interface ManagedAccountStatement {
    count: number
    entry: ManagedAccountStatementEntry[]
  }

  export interface ManagedAccountStatementEntry {
    txId: {
      type: string
      id: number
    }
    originalAmount?: Schemas.CurrencyAmount
    forexRate?: Schemas.ScaledAmount

    currency: string
    adjustment: number
    balanceAfter: number
    fee: {
      [k: string]: number
    }
    block: null | boolean
    destroy: boolean
    processedTimestamp: number
  }
}

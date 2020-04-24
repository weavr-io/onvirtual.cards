import { Schemas } from '~/api/Schemas'

export interface StatementEntry {
  txId: {
    type: string
    id: number
  }
  originalAmount?: Schemas.CurrencyAmount
  forexRate?: Schemas.ScaledAmount
  transactionAmount: Schemas.CurrencyAmount
  balanceAfter?: Schemas.CurrencyAmount
  cardholderFee?: Schemas.CurrencyAmount
  processedTimestamp?: string
  sourceAmount?: Schemas.CurrencyAmount
  additionalFields?: {
    [k: string]: string
  }
}

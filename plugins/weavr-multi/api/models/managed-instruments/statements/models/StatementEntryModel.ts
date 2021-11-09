import { TransactionIdModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/TransactionIdModel'
import { CurrencyAmountModel } from '~/plugins/weavr-multi/api/models/common/CurrencyAmountModel'
import { ScaledAmountModel } from '~/plugins/weavr-multi/api/models/common/ScaledAmountModel'

export interface StatementEntryModel {
  transactionId: TransactionIdModel
  originalAmount?: CurrencyAmountModel
  forexRate?: ScaledAmountModel
  transactionAmount: CurrencyAmountModel
  balanceAfter?: CurrencyAmountModel
  cardholderFee?: CurrencyAmountModel
  processedTimestamp: bigint | string
  sourceAmount: CurrencyAmountModel
  additionalFields: {
    [k: string]: string
  }
}

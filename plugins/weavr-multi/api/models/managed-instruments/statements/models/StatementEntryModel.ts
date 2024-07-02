import { TransactionIdModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/TransactionIdModel'
import { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import { ScaledAmountModel } from '~/plugins/weavr-multi/api/models/common/models/ScaledAmountModel'

export interface StatementEntryModel {
    transactionId: TransactionIdModel
    originalAmount?: CurrencyAmount
    forexRate?: ScaledAmountModel
    transactionAmount: CurrencyAmount
    balanceAfter?: CurrencyAmount
    cardholderFee?: CurrencyAmount
    processedTimestamp: string
    sourceAmount: CurrencyAmount
    additionalFields: {
        [k: string]: string
    }
}

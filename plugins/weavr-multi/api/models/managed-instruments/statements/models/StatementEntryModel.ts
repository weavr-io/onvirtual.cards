import { TransactionIdModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/TransactionIdModel'
import { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'
import { ScaledAmountModel } from '~/plugins/weavr-multi/api/models/common/models/ScaledAmountModel'
import type { StatementEntryStateEnum } from '~/plugins/weavr-multi/api/models/instruments/common/enums/StatementEntryStateEnum'
import type { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'
import { TypeIdModel } from '~/plugins/weavr-multi/api/models/common/models/TypeIdModel'

export interface StatementEntryModel {
    transactionId: TransactionIdModel
    originalAmount?: CurrencyAmount
    forexRate?: ScaledAmountModel
    transactionAmount: CurrencyAmount
    balanceAfter?: CurrencyAmount
    cardholderFee?: CurrencyAmount
    processedTimestamp: string
    sourceAmount: CurrencyAmount
    actualBalanceAdjustment?: CurrencyAmount
    actualBalanceAfter?: CurrencyAmount
    availableBalanceAdjustment?: CurrencyAmount
    availableBalanceAfter?: CurrencyAmount
    entryState?: StatementEntryStateEnum
    statementEntryState?: StatementEntryStateEnum | string
    transactionState?: TransactionStateTypeEnum | string
    txId: TypeIdModel
    additionalFields: {
        [k: string]: string
    }
}

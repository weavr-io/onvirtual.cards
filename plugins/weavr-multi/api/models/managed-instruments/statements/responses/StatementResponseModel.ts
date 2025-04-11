import type { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import type { CurrencyAmount } from '~/plugins/weavr-multi/api/models/common'

export interface StatementResponseModel extends PaginatedResponse {
    startBalance?: CurrencyAmount
    endBalance?: CurrencyAmount
    footer?: string
    entry?: StatementEntryModel[]
}

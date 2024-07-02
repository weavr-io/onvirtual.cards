import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'

export interface PaginatedManagedAccountStatementResponse extends PaginatedResponse {
    entry: StatementEntryModel[]
}

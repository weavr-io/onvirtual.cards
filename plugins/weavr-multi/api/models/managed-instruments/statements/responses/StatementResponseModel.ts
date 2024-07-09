import type { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

export interface StatementResponseModel extends PaginatedResponse {
    entry?: StatementEntryModel[]
}

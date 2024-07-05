import { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/models/PaginatedResponse'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

export interface StatementResponseModel extends PaginatedResponse {
    entry?: StatementEntryModel[]
}

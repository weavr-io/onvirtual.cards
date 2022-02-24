import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { PaginatedResponse } from '~/plugins/weavr-multi/api/models/common/PaginatedResponse'

export interface PaginatedManagedCardStatementResponse extends PaginatedResponse {
  entry?: StatementEntryModel
}

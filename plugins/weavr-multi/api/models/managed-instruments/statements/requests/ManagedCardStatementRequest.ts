import type { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'

export type ManagedCardStatementRequest = {
    id: IDModel
    request: StatementFiltersRequest
}

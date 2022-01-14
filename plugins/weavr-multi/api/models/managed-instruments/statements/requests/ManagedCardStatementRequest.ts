import { StatementFiltersRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/requests/StatementFiltersRequest'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'

export type ManagedCardStatementRequest = {
  id: IDModel
  request: StatementFiltersRequest
}

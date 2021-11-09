import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

export interface GetManagedCardStatementResponse {
  entry?: StatementEntryModel
  count?: number
  responseCount?: number
}

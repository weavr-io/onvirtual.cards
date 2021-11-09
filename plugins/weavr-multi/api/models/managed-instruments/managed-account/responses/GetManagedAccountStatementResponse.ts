import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

export interface GetManagedAccountStatementResponse {
  entry: StatementEntryModel
  count: number
  responseCount: number
}

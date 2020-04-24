import { StatementRequest } from '~/api/Requests/Statements/StatementRequest'

export interface ManagedCardStatementRequest {
  id: number
  request: StatementRequest
}

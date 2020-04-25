import { StatementRequest } from '~/api/Requests/Statements/StatementRequest'

export interface ManagedAccountStatementRequest {
  id: number
  request: StatementRequest
}

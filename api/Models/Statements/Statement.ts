import { StatementEntry } from '~/api/Models/Statements/StatementEntry'

export interface Statement {
  entry: StatementEntry[]
  count?: number
  responseCount?: number
}

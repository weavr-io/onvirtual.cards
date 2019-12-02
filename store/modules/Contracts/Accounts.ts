import { ActionTree, ActionContext } from 'vuex'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import { ManagedAccountStatementRequest } from '~/api/Requests/ManagedAccountStatementRequest'

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_STATEMENT: 'SET_STATEMENT'
}

export interface State {
  isLoading: boolean
  accounts: ManagedAccountsSchemas.ManagedAccounts | null
  account: ManagedAccountsSchemas.ManagedAccount | null
  statement: ManagedAccountsSchemas.ManagedAccountStatement | null
}

export interface Actions<S, R> extends ActionTree<S, R> {
  index(context: ActionContext<S, R>): Promise<R>
  add(
    context: ActionContext<S, R>,
    request: ManagedAccountsSchemas.CreateManagedAccountRequest
  ): Promise<R>
  get(context: ActionContext<S, R>, id: number): Promise<R>
  getStatement(
    context: ActionContext<S, R>,
    request: _Requests.ManagedAccountStatementFullRequest
  )
}

export module _Requests {
  export interface ManagedAccountStatementFullRequest {
    id: bigint
    body: ManagedAccountStatementRequest
  }
}

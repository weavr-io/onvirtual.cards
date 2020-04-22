import { ActionTree, ActionContext, Store } from 'vuex'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import { ManagedAccountStatementRequest } from '~/api/Requests/ManagedAccountStatementRequest'
import { AxiosPromise } from '~/node_modules/axios'
import { StoreHelpers } from '~/helpers/StoreHelpers'

export const name = 'accounts'

export const namespaced = true

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_ACCOUNTS: 'SET_ACCOUNTS',
  SET_ACCOUNT: 'SET_ACCOUNT',
  SET_STATEMENT: 'SET_STATEMENT'
}

export enum _Actions {
  index = 'index',
  add = 'add',
  get = 'get',
  getStatement = 'getStatement'
}

export interface State {
  isLoading: boolean
  accounts: ManagedAccountsSchemas.ManagedAccounts | null
  account: ManagedAccountsSchemas.ManagedAccount | null
  statement: ManagedAccountsSchemas.ManagedAccountStatement | null
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.index](context: ActionContext<S, R>): AxiosPromise<ManagedAccountsSchemas.ManagedAccounts>

  [_Actions.add](
    context: ActionContext<S, R>,
    request: ManagedAccountsSchemas.CreateManagedAccountRequest
  ): AxiosPromise<ManagedAccountsSchemas.ManagedAccount>

  [_Actions.get](context: ActionContext<S, R>, id: number): AxiosPromise<ManagedAccountsSchemas.ManagedAccount>

  [_Actions.getStatement](
    context: ActionContext<S, R>,
    request: _Requests.ManagedAccountStatementFullRequest
  ): AxiosPromise<ManagedAccountsSchemas.ManagedAccountStatement>
}

export module _Requests {
  export interface ManagedAccountStatementFullRequest {
    id: string
    body: ManagedAccountStatementRequest
  }
}

export module Helpers {
  export const index = (store: Store<any>): AxiosPromise<ManagedAccountsSchemas.ManagedAccounts> => {
    return StoreHelpers.dispatch(store, name, _Actions.index)
  }
  export const add = (
    store: Store<any>,
    request: ManagedAccountsSchemas.CreateManagedAccountRequest
  ): AxiosPromise<ManagedAccountsSchemas.ManagedAccount> => {
    return StoreHelpers.dispatch(store, name, _Actions.add, request)
  }
  export const get = (store: Store<any>, id: string): AxiosPromise<ManagedAccountsSchemas.ManagedAccount> => {
    return StoreHelpers.dispatch(store, name, _Actions.get, id)
  }
  export const getStatement = (
    store: Store<any>,
    request: _Requests.ManagedAccountStatementFullRequest
  ): AxiosPromise<ManagedAccountsSchemas.ManagedAccountStatement> => {
    return StoreHelpers.dispatch(store, name, _Actions.getStatement, request)
  }
}

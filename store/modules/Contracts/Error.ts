import { ActionTree, ActionContext } from 'vuex'
import { Store } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'
import { ValidatePasswordConflict } from '~/api/Conflicts/Responses/Password/ValidatePasswordConflict'
import { ConflictResponse } from '~/api/Conflicts/Responses/ConflictResponse'

export const name = 'error'

export const namespaced = true

export const types = {
  RESET_ERRORS: 'RESET_ERRORS',
  SET_ERROR: 'SET_ERROR',
  SET_CONFLICT: 'SET_CONFLICT'
}

export interface State {
  errors: any
  conflict: null | ValidatePasswordConflict | ConflictResponse
}

export enum _Actions {
  setError = 'setError',
  resetErrors = 'resetErrors',
  setConflict = 'setConflict'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.setError](context: ActionContext<S, R>, errors: any)

  [_Actions.resetErrors](context: ActionContext<S, R>): void

  [_Actions.setConflict](context: ActionContext<S, R>, conflict: any): void
}

export module Helpers {
  export const setError = (store: Store<any>, errors: any) => {
    return StoreHelpers.dispatch(store, name, _Actions.setError, errors)
  }
  export const resetErrors = (store: Store<any>) => {
    return StoreHelpers.dispatch(store, name, _Actions.resetErrors)
  }
  export const setConflict = (store: Store<any>, conflict: any) => {
    return StoreHelpers.dispatch(store, name, _Actions.setConflict, conflict)
  }
}

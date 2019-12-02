import { ActionTree, ActionContext } from 'vuex'

export const types = {
  RESET_ERRORS: 'RESET_ERRORS',
  SET_ERROR: 'SET_ERROR'
}

export interface State {
  errors: any
}

export interface Actions<S, R> extends ActionTree<S, R> {
  setError(context: ActionContext<S, R>, errors: any)

  resetErrors(context: ActionContext<S, R>): void
}

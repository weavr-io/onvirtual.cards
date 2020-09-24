import { ActionTree, ActionContext } from 'vuex'

export interface State {
  isLoading: boolean
}

export interface Actions<S, R> extends ActionTree<S, R> {
  stop(context: ActionContext<S, R>): void
  start(context: ActionContext<S, R>): void
}

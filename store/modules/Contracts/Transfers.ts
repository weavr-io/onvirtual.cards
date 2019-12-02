import { ActionTree, ActionContext } from 'vuex'
import { TransfersSchemas } from '~/api/TransfersSchemas'

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING'
}

export interface State {
  isLoading: boolean
}

export interface Actions<S, R> extends ActionTree<S, R> {
  execute(
    context: ActionContext<S, R>,
    request: TransfersSchemas.CreateTransferRequest
  )
}

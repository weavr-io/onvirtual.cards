import { ActionTree, ActionContext } from 'vuex'
import { Schemas } from '~/api/Schemas'

export const types = {
  AUTHENTICATE: 'AUTHENTICATE',
  LOGOUT: 'LOGOUT',
  SET_IS_LOADING: 'SET_IS_LOADING'
}

export interface State {
  auth: {
    token?: string | null
    identity?: { type: string; id: number }
  }
  isLoading: boolean
}

export interface Actions<S, R> extends ActionTree<S, R> {
  authenticate(context: ActionContext<S, R>, loginRequest: Schemas.LoginRequest)

  invalidateToken(context: ActionContext<S, R>)

  logout(context: ActionContext<S, R>)

  verifyEmail(context: ActionContext<S, R>, request: Schemas.verifyEmailRequest)
}

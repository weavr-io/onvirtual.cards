import { ActionTree, ActionContext } from 'vuex'
import { Schemas } from '~/api/Schemas'
import { LostPasswordStartRequest } from '~/api/Requests/Auth/LostPasswordStartRequest'
import { LostPasswordValidateRequest } from '~/api/Requests/Auth/LostPasswordValidateRequest'
import { LostPasswordContinueRequest } from '~/api/Requests/Auth/LostPasswordContinueRequest'
import { AxiosPromise } from '~/node_modules/axios'
import LoginResult = Schemas.LoginResult

export const types = {
  AUTHENTICATE: 'AUTHENTICATE',
  LOGOUT: 'LOGOUT',
  SET_IS_LOADING: 'SET_IS_LOADING'
}

export interface State {
  auth: LoginResult
  isLoading: boolean
}

export interface Actions<S, R> extends ActionTree<S, R> {
  authenticate(context: ActionContext<S, R>, loginRequest: Schemas.LoginRequest): AxiosPromise<LoginResult>

  invalidateToken(context: ActionContext<S, R>)

  logout(context: ActionContext<S, R>)

  verifyEmail(context: ActionContext<S, R>, request: Schemas.verifyEmailRequest)

  lostPasswordStart(context: ActionContext<S, R>, request: LostPasswordStartRequest)

  lostPasswordValidate(context: ActionContext<S, R>, request: LostPasswordValidateRequest)

  lostPasswordResume(context: ActionContext<S, R>, request: LostPasswordContinueRequest)
}

export module _Functions {
  export interface lostPasswordStart {
    (request: LostPasswordStartRequest)
  }

  export interface lostPasswordValidate {
    (request: LostPasswordValidateRequest)
  }

  export interface lostPasswordResume {
    (request: LostPasswordContinueRequest)
  }
}

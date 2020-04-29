import { MutationTree, GetterTree } from 'vuex'
import { RootState } from 'store'
import { AxiosError } from 'axios'
import { Actions, State, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Error'
import { ValidatePasswordConflictErrorCode } from '~/api/Conflicts/Codes/Password/ValidatePasswordConflictErrorCode'
import { VerifyEmailRequestConflictErrorCode } from '~/api/Conflicts/Codes/Corporates/Emails/VerifyEmailRequestConflictErrorCode'
import { ConflictResponse } from '~/api/Conflicts/Responses/ConflictResponse'
import { LoginWithPasswordConflict } from '~/api/Conflicts/Responses/Password/LoginWithPasswordConflict'
import { SendMobileRequestConflictErrorCode } from '~/api/Conflicts/Codes/Mobile/SendMobileRequestConflictErrorCode'

export { name, namespaced, Helpers }

export const state = (): State => ({
  errors: null,
  conflict: null
})

export const getters: GetterTree<State, RootState> = {
  errors: (state) => {
    return state.errors
  },
  conflict: (state) => {
    if (state.conflict) {
      return state.conflict
    } else {
      return null
    }
  },
  conflictMessage: (state) => {
    if (state.conflict) {
      const _errCode = (state.conflict as ConflictResponse).errorCode
        ? (state.conflict as ConflictResponse).errorCode
        : (state.conflict as LoginWithPasswordConflict).code

      switch (_errCode) {
        case 'ROOT_EMAIL_NOT_UNIQUE':
        case 'EMAIL_NOT_UNIQUE':
          return 'This email address already exists in the system.'
        case 'USERNAME_NOT_UNIQUE':
          return 'This username already exists in the system.'
        case 'INVALID_CREDENTIALS':
          return 'Invalid Credentials'
        case 'ROOT_USERNAME_NOT_UNIQUE':
          return 'Username already exists in the system. Please try a different username.'
        case 'INVALID_NONCE_OR_MOBILE':
          return 'There is something wrong with your verification code.'
        case 'PASSWORD_INCORRECT':
          return 'Password is incorrect.'
        case 'FAILED_LOGIN':
          return 'Incorrect email and password combination. If you do not have an account please click on Register.'
        case ValidatePasswordConflictErrorCode.PASSWORD_PROFILE_NOT_CONFIGURED_FOR_CREDENTIAL_TYPE:
          return 'PASSWORD_PROFILE_NOT_CONFIGURED_FOR_CREDENTIAL_TYPE'
        case ValidatePasswordConflictErrorCode.PASSWORD_TOO_LONG:
          return 'Password is too long.'
        case ValidatePasswordConflictErrorCode.PASSWORD_TOO_SHORT:
          return 'Password is too short.'
        case ValidatePasswordConflictErrorCode.PASSWORD_TOO_SIMPLE:
          return 'Password is too simple.'
        case ValidatePasswordConflictErrorCode.UNRESOLVED_IDENTITY:
          return 'UNRESOLVED_IDENTITY'
        case VerifyEmailRequestConflictErrorCode.INVALID_NONCE_OR_EMAIL:
          return 'The verification code entered is invalid.'
        case SendMobileRequestConflictErrorCode.RETRIES_EXCEEDED:
          return 'You have exceeded the maximum number of attempts.  Please contact support@onvirtual.cards for assistance.'
        default:
          console.log(state.conflict)
          return 'An error occurred. Please try again.'
      }
    } else {
      return null
    }
  }
}

export const actions: Actions<State, RootState> = {
  setError({ commit }, errors): void {
    commit(types.SET_ERROR, errors)
  },
  resetErrors({ commit }): void {
    return commit(types.RESET_ERRORS)
  },
  setConflict({ commit }, conflict): void {
    commit(types.SET_CONFLICT, conflict)
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_CONFLICT](state, _conflict: AxiosError) {
    if (_conflict.response) {
      state.conflict = _conflict.response.data
    }
  },
  [types.SET_ERROR](state, errors: any) {
    state.errors = errors
  },
  [types.RESET_ERRORS](state) {
    state.errors = null
    state.conflict = null
  }
}

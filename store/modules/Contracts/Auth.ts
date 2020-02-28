import { ActionTree, ActionContext } from 'vuex'
import { Schemas } from '~/api/Schemas'
import { LostPasswordStartRequest } from '~/api/Requests/Auth/LostPasswordStartRequest'
import { LostPasswordValidateRequest } from '~/api/Requests/Auth/LostPasswordValidateRequest'
import { LostPasswordContinueRequest } from '~/api/Requests/Auth/LostPasswordContinueRequest'
import { AxiosPromise } from '~/node_modules/axios'
import { GetterTree, Store } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'
import LoginResult = Schemas.LoginResult

export const name = 'auth'

export const namespaced = true

export const types = {
  AUTHENTICATE: 'AUTHENTICATE',
  LOGOUT: 'LOGOUT',
  SET_IS_LOADING: 'SET_IS_LOADING'
}

export interface State {
  auth: LoginResult
  isLoading: boolean
}

export enum _Getters {
  isLoggedIn = 'isLoggedIn',
  isConsumer = 'isConsumer',
  isCorporate = 'isCorporate',
  identityId = 'identityId'
}

export enum _Actions {
  authenticate = 'authenticate',
  invalidateToken = 'invalidateToken',
  logout = 'logout',
  verifyEmail = 'verifyEmail',
  lostPasswordStart = 'lostPasswordStart',
  lostPasswordValidate = 'lostPasswordValidate',
  lostPasswordResume = 'lostPasswordResume',
  createPasswordIdentity = 'createPasswordIdentity',
  createPassword = 'createPassword'
}

export module _Requests {
  export interface CreatePasswordIdentity {
    id: number
    request: {
      profileId: string
    }
  }

  export interface CreatePassword {
    id: number
    request: {
      credentialType: string
      identityId: number
      password: {
        value: string
      }
    }
  }
}

export interface Getters<S, R> extends GetterTree<S, R> {
  [_Getters.isLoggedIn](sate: S): boolean

  [_Getters.isConsumer](sate: S): boolean

  [_Getters.isCorporate](sate: S): boolean

  [_Getters.identityId](sate: S): number | null
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.authenticate](context: ActionContext<S, R>, loginRequest: Schemas.LoginRequest): AxiosPromise<LoginResult>

  [_Actions.invalidateToken](context: ActionContext<S, R>)

  [_Actions.logout](context: ActionContext<S, R>)

  [_Actions.verifyEmail](context: ActionContext<S, R>, request: Schemas.verifyEmailRequest)

  [_Actions.lostPasswordStart](context: ActionContext<S, R>, request: LostPasswordStartRequest)

  [_Actions.lostPasswordValidate](context: ActionContext<S, R>, request: LostPasswordValidateRequest)

  [_Actions.lostPasswordResume](context: ActionContext<S, R>, request: LostPasswordContinueRequest)

  [_Actions.createPasswordIdentity](
    context: ActionContext<S, R>,
    request: _Requests.CreatePasswordIdentity
  ): AxiosPromise

  [_Actions.createPassword](context: ActionContext<S, R>, request: _Requests.CreatePassword): AxiosPromise
}

export module Helpers {
  export const authenticate = (store: Store<any>, loginRequest: Schemas.LoginRequest): AxiosPromise<LoginResult> => {
    return StoreHelpers.dispatch(store, name, _Actions.authenticate, loginRequest)
  }
  export const invalidateToken = (store: Store<any>): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.invalidateToken)
  }
  export const logout = (store: Store<any>): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.logout)
  }
  export const verifyEmail = (store: Store<any>, request: Schemas.verifyEmailRequest): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.verifyEmail, request)
  }
  export const lostPasswordStart = (store: Store<any>, request: LostPasswordStartRequest): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.lostPasswordStart, request)
  }
  export const lostPasswordValidate = (store: Store<any>, request: LostPasswordValidateRequest): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.lostPasswordValidate, request)
  }
  export const lostPasswordResume = (store: Store<any>, request: LostPasswordContinueRequest): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.lostPasswordResume, request)
  }
  export const createPasswordIdentity = (
    store: Store<any>,
    request: _Requests.CreatePasswordIdentity
  ): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.createPasswordIdentity, request)
  }
  export const createPassword = (store: Store<any>, request: _Requests.CreatePassword): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.createPassword, request)
  }
  export const isConsumer = (store: Store<any>): boolean => {
    return StoreHelpers.get(store, name, _Getters.isConsumer)
  }
  export const isCorporate = (store: Store<any>): boolean => {
    return StoreHelpers.get(store, name, _Getters.isCorporate)
  }
  export const identityId = (store: Store<any>): number | null => {
    return StoreHelpers.get(store, name, _Getters.identityId)
  }
}

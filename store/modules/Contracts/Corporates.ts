import { ActionTree, ActionContext } from 'vuex'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import { SendEmailRequest } from '~/api/Requests/SendEmailRequest'
import { Store } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'

export const name = 'corporates'

export const namespaced = true

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_CORPORATE: 'SET_CORPORATE',
  SET_USERS: 'SET_USERS'
}

export interface State {
  isLoading: boolean
  corporate: CorporatesSchemas.Corporate | null
  users: any
}

export enum _Actions {
  register = 'register',
  getCorporateDetails = 'getCorporateDetails',
  getUsers = 'getUsers',
  addUser = 'addUser',
  checkKYB = 'checkKYB',
  sendVerificationCodeEmail = 'sendVerificationCodeEmail'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.register](context: ActionContext<S, R>, request: CorporatesSchemas.CreateCorporateRequest)

  [_Actions.getCorporateDetails](context: ActionContext<S, R>, corporateId: number)

  [_Actions.getUsers](context: ActionContext<S, R>, corporateId: number)

  [_Actions.addUser](context: ActionContext<S, R>, request: CorporatesSchemas.CreateCorporateUserFullRequest)

  [_Actions.checkKYB](context: ActionContext<S, R>)

  [_Actions.sendVerificationCodeEmail](context: ActionContext<S, R>, request: _Requests.sendVerificationEmailFull)
}

export module _Functions {
  export interface sendVerificationCodeEmail {
    (request: _Requests.sendVerificationEmailFull)
  }

  export interface addUser {
    (request: CorporatesSchemas.CreateCorporateUserFullRequest)
  }
}

export module _Requests {
  export interface sendVerificationEmailFull {
    body: SendEmailRequest
    corporateId: string
  }
}

export module Helpers {
  export const register = (store: Store<any>, request: CorporatesSchemas.CreateCorporateRequest) => {
    return StoreHelpers.dispatch(store, name, _Actions.register, request)
  }
  export const getCorporateDetails = (store: Store<any>, id: number) => {
    return StoreHelpers.dispatch(store, name, _Actions.getCorporateDetails, id)
  }
  export const getUsers = (store: Store<any>, id: number) => {
    return StoreHelpers.dispatch(store, name, _Actions.getUsers, id)
  }
  export const addUser = (store: Store<any>, request: CorporatesSchemas.CreateCorporateUserFullRequest) => {
    return StoreHelpers.dispatch(store, name, _Actions.addUser, request)
  }
  export const checkKYB = (store: Store<any>) => {
    return StoreHelpers.dispatch(store, name, _Actions.checkKYB)
  }
  export const sendVerificationCodeEmail = (store: Store<any>, request: _Requests.sendVerificationEmailFull) => {
    return StoreHelpers.dispatch(store, name, _Actions.sendVerificationCodeEmail, request)
  }
}

import { ActionTree, ActionContext } from 'vuex'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import { Store } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'
import { SendVerificationEmailRequest } from '~/api/Requests/Corporates/SendVerificationEmailRequest'
import { ValidateCorporateUserInviteRequest } from '~/api/Requests/Corporates/ValidateCorporateUserInviteRequest'
import { ConsumeCorporateUserInviteRequest } from '~/api/Requests/Corporates/ConsumeCorporateUserInviteRequest'
import { AxiosPromise } from '~/node_modules/axios'

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
  sendVerificationCodeEmail = 'sendVerificationCodeEmail',
  validateInvite = 'validateInvite',
  consumeInvite = 'consumeInvite',
  startKYB = 'startKYB'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.register](context: ActionContext<S, R>, request: CorporatesSchemas.CreateCorporateRequest)

  [_Actions.getCorporateDetails](context: ActionContext<S, R>, corporateId: number)

  [_Actions.getUsers](context: ActionContext<S, R>, corporateId: number)

  [_Actions.addUser](context: ActionContext<S, R>, request: CorporatesSchemas.CreateCorporateUserFullRequest)

  [_Actions.checkKYB](context: ActionContext<S, R>)

  [_Actions.sendVerificationCodeEmail](context: ActionContext<S, R>, request: SendVerificationEmailRequest)

  [_Actions.validateInvite](context: ActionContext<S, R>, request: ValidateCorporateUserInviteRequest)

  [_Actions.consumeInvite](context: ActionContext<S, R>, request: ConsumeCorporateUserInviteRequest)

  [_Actions.startKYB](context: ActionContext<S, R>, corporateId): AxiosPromise
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
  export const sendVerificationCodeEmail = (store: Store<any>, request: SendVerificationEmailRequest) => {
    return StoreHelpers.dispatch(store, name, _Actions.sendVerificationCodeEmail, request)
  }
  export const validateInvite = (store: Store<any>, request: ValidateCorporateUserInviteRequest) => {
    return StoreHelpers.dispatch(store, name, _Actions.validateInvite, request)
  }
  export const consumeInvite = (store: Store<any>, request: ConsumeCorporateUserInviteRequest) => {
    return StoreHelpers.dispatch(store, name, _Actions.consumeInvite, request)
  }
  export const startKYB = (store: Store<any>, corporateId): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.startKYB, corporateId)
  }
}

import { ActionTree, ActionContext } from 'vuex'
import { Store } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'
import { SendVerificationEmailRequest } from '~/api/Requests/Corporates/SendVerificationEmailRequest'
import { ValidateCorporateUserInviteRequest } from '~/api/Requests/Corporates/ValidateCorporateUserInviteRequest'
import { ConsumeCorporateUserInviteRequest } from '~/api/Requests/Corporates/ConsumeCorporateUserInviteRequest'
import { AxiosPromise } from '~/node_modules/axios'
import { SendVerificationMobile } from '~/api/Requests/Corporates/SendVerificationMobile'
import { VerifyMobileRequest } from '~/api/Requests/Corporates/VerifyMobileRequest'
import { CorporateUser } from '~/api/Models/Corporates/CorporateUser'
import { CorporateUsers } from '~/api/Responses/Corporates/CorporateUsers'
import { Corporate } from '~/api/Models/Corporates/Corporate'
import { CreateCorporateRequest } from '~/api/Requests/Corporates/CreateCorporateRequest'
import { CreateCorporateUserFullRequest } from '~/api/Requests/Corporates/CreateCorporateUserFullRequest'
import { UpdateCorporateUserFullRequest } from '~/api/Requests/Corporates/UpdateCorporateUserFullRequest'

export const name = 'corporates'

export const namespaced = true

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_IS_LOADING_REGISTRATION: 'SET_IS_LOADING_REGISTRATION',
  SET_CORPORATE: 'SET_CORPORATE',
  SET_USERS: 'SET_USERS'
}

export interface State {
  isLoading: boolean
  isLoadingRegistration: boolean
  corporate: Corporate | null
  users: any
}

export enum _Actions {
  register = 'register',
  getCorporateDetails = 'getCorporateDetails',
  getUsers = 'getUsers',
  getUser = 'getUser',
  addUser = 'addUser',
  updateUser = 'updateUser',
  checkKYB = 'checkKYB',
  sendVerificationCodeEmail = 'sendVerificationCodeEmail',
  validateInvite = 'validateInvite',
  consumeInvite = 'consumeInvite',
  startKYB = 'startKYB',
  sendVerificationCodeMobile = 'sendVerificationCodeMobile',
  verifyMobile = 'verifyMobile'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.register](context: ActionContext<S, R>, request: CreateCorporateRequest)

  [_Actions.getCorporateDetails](context: ActionContext<S, R>, corporateId: number): AxiosPromise

  [_Actions.getUsers](context: ActionContext<S, R>, corporateId: number): AxiosPromise<CorporateUsers>

  [_Actions.getUser](
    context: ActionContext<S, R>,
    params: { corporateId: number; userId: number }
  ): AxiosPromise<CorporateUser>

  [_Actions.updateUser](
    context: ActionContext<S, R>,
    params: UpdateCorporateUserFullRequest
  ): AxiosPromise<CorporateUser>

  [_Actions.addUser](context: ActionContext<S, R>, request: CreateCorporateUserFullRequest)

  [_Actions.checkKYB](context: ActionContext<S, R>)

  [_Actions.sendVerificationCodeEmail](context: ActionContext<S, R>, request: SendVerificationEmailRequest)

  [_Actions.validateInvite](context: ActionContext<S, R>, request: ValidateCorporateUserInviteRequest)

  [_Actions.consumeInvite](context: ActionContext<S, R>, request: ConsumeCorporateUserInviteRequest)

  [_Actions.startKYB](context: ActionContext<S, R>, corporateId): AxiosPromise

  [_Actions.sendVerificationCodeMobile](context: ActionContext<S, R>, request: SendVerificationMobile): AxiosPromise

  [_Actions.verifyMobile](context: ActionContext<S, R>, request: VerifyMobileRequest): AxiosPromise
}

export module Helpers {
  export const corporate = (store: Store<any>): Corporate | null => {
    return StoreHelpers.get(store, name, 'corporate')
  }
  export const register = (store: Store<any>, request: CreateCorporateRequest) => {
    return StoreHelpers.dispatch(store, name, _Actions.register, request)
  }
  export const getCorporateDetails = (store: Store<any>, id: number) => {
    return StoreHelpers.dispatch(store, name, _Actions.getCorporateDetails, id)
  }
  export const getUsers = (store: Store<any>, id: number): AxiosPromise<CorporateUsers> => {
    return StoreHelpers.dispatch(store, name, _Actions.getUsers, id)
  }
  export const getUser = (
    store: Store<any>,
    params: { corporateId: number; userId: number }
  ): AxiosPromise<CorporateUser> => {
    return StoreHelpers.dispatch(store, name, _Actions.getUser, params)
  }
  export const updateUser = (
    store: Store<any>,
    params: UpdateCorporateUserFullRequest
  ): AxiosPromise<CorporateUser> => {
    return StoreHelpers.dispatch(store, name, _Actions.updateUser, params)
  }
  export const addUser = (store: Store<any>, request: CreateCorporateUserFullRequest) => {
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
  export const setIsLoadingRegistration = (store: Store<any>, isLoading: boolean) => {
    return StoreHelpers.commit(store, name, types.SET_IS_LOADING_REGISTRATION, isLoading)
  }
  export const sendVerificationCodeMobile = (store: Store<any>, request: SendVerificationMobile): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.sendVerificationCodeMobile, request)
  }
  export const verifyMobile = (store: Store<any>, request: VerifyMobileRequest): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.verifyMobile, request)
  }
}

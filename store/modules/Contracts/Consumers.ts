import { Consumer } from '~/api/Models/Consumers/Consumer'
import { ActionContext, ActionTree, Store } from '~/node_modules/vuex'
import { AxiosPromise } from '~/node_modules/axios'
import { CreateConsumerRequest } from '~/api/Requests/Consumers/CreateConsumerRequest'
import { StoreHelpers } from '~/helpers/StoreHelpers'
import { SendVerificationEmail } from '~/api/Requests/Consumers/SendVerificationEmail'
import { SendVerificationMobile } from '~/api/Requests/Consumers/SendVerificationMobile'
import { VerifyMobileRequest } from '~/api/Requests/Consumers/VerifyMobileRequest'
import { InitFullKycProcessResponse } from '~/api/Responses/Consumers/InitFullKycProcessResponse'

export const name = 'consumers'

export const namespaced = true

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_CONSUMER: 'SET_CONSUMER'
}

export interface State {
  isLoading: boolean
  consumer: Consumer | null
}

export enum _Actions {
  create = 'create',
  get = 'get',
  sendVerificationCodeEmail = 'sendVerificationCodeEmail',
  sendVerificationCodeMobile = 'sendVerificationCodeMobile',
  verifyMobile = 'verifyMobile',
  checkKYC = 'checkKYC',
  startKYC = 'startKYC'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.create](context: ActionContext<S, R>, request: CreateConsumerRequest): AxiosPromise<Consumer>
  [_Actions.get](context: ActionContext<S, R>, id: number): AxiosPromise<Consumer>
  [_Actions.sendVerificationCodeEmail](context: ActionContext<S, R>, request: SendVerificationEmail): AxiosPromise
  [_Actions.sendVerificationCodeMobile](context: ActionContext<S, R>, request: SendVerificationMobile): AxiosPromise
  [_Actions.verifyMobile](context: ActionContext<S, R>, request: VerifyMobileRequest): AxiosPromise
  [_Actions.checkKYC](context: ActionContext<S, R>): Promise<any>
  [_Actions.startKYC](context: ActionContext<S, R>, consumerId): AxiosPromise<InitFullKycProcessResponse>
}

export module Helpers {
  export const create = (store: Store<any>, request: CreateConsumerRequest): AxiosPromise<Consumer> => {
    return StoreHelpers.dispatch(store, name, _Actions.create, request)
  }
  export const get = (store: Store<any>, id: number): AxiosPromise<Consumer> => {
    return StoreHelpers.dispatch(store, name, _Actions.get, id)
  }
  export const sendVerificationCodeEmail = (store: Store<any>, request: SendVerificationEmail): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.sendVerificationCodeEmail, request)
  }
  export const sendVerificationCodeMobile = (store: Store<any>, request: SendVerificationMobile): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.sendVerificationCodeMobile, request)
  }
  export const verifyMobile = (store: Store<any>, request: VerifyMobileRequest): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.verifyMobile, request)
  }
  export const checkKYC = (store: Store<any>): Promise<any> => {
    return StoreHelpers.dispatch(store, name, _Actions.checkKYC)
  }
  export const startKYC = (store: Store<any>, consumerId): AxiosPromise<InitFullKycProcessResponse> => {
    return StoreHelpers.dispatch(store, name, _Actions.startKYC, consumerId)
  }
}

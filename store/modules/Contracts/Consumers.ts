import { Consumer } from '~/api/Models/Consumers/Consumer'
import { ActionContext, ActionTree, Store } from '~/node_modules/vuex'
import { AxiosPromise } from '~/node_modules/axios'
import { CreateConsumerRequest } from '~/api/Requests/Consumers/CreateConsumerRequest'
import { StoreHelpers } from '~/helpers/StoreHelpers'

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
  createPasswordIdentity = 'createPasswordIdentity',
  sendVerificationCodeEmail = 'sendVerificationCodeEmail'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.create](context: ActionContext<S, R>, request: CreateConsumerRequest): AxiosPromise<Consumer>

  [_Actions.createPasswordIdentity](
    context: ActionContext<S, R>,
    request: _Requests.CreatePasswordIdentity
  ): AxiosPromise

  [_Actions.sendVerificationCodeEmail](
    context: ActionContext<S, R>,
    request: _Requests.SendVerificationEmail
  ): AxiosPromise
}

export module _Requests {
  export interface CreatePasswordIdentity {
    consumerId: number
    request: {
      profileId: string
    }
  }

  export interface SendVerificationEmail {
    consumerId: number
    request: {
      emailAddress: string
    }
  }
}

export module Helpers {
  export const create = (store: Store<any>, request: CreateConsumerRequest): AxiosPromise<Consumer> => {
    return StoreHelpers.dispatch(store, name, _Actions.create, request)
  }
  export const createPasswordIdentity = (
    store: Store<any>,
    request: _Requests.CreatePasswordIdentity
  ): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.createPasswordIdentity, request)
  }
  export const sendVerificationCodeEmail = (
    store: Store<any>,
    request: _Requests.SendVerificationEmail
  ): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.sendVerificationCodeEmail, request)
  }
}

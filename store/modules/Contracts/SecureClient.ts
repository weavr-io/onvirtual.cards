import { ActionContext, ActionTree, GetterTree, Store, MutationTree } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'
import { SecureForm } from '~/plugins/weavr/components/api'

export const name = 'secure_client'

export const namespaced = true

enum _Getters {
  form = 'form'
}

export enum _Mutations {
  SET_FORM = 'SET_FORM'
}

enum _Actions {
  form = 'form',
  tokenize = 'tokenize'
}

export interface State {
  form: SecureForm | null
}

export interface Getters<S, R> extends GetterTree<S, R> {
  [_Getters.form](state: S): SecureForm | null
}

export interface Mutations<S> extends MutationTree<S> {
  [_Mutations.SET_FORM](state: S, form: SecureForm): any
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.form](context: ActionContext<S, R>, form: SecureForm)

  [_Actions.tokenize](context: ActionContext<S, R>): Promise<any>
}

export module Helpers {
  export const form = (store: Store<any>, form: SecureForm) => {
    return StoreHelpers.dispatch(store, name, _Actions.form, form)
  }
  export const tokenize = (store: Store<any>): Promise<any> => {
    return StoreHelpers.dispatch(store, name, _Actions.tokenize)
  }
  export const getForm = (store: Store<any>): SecureForm | null => {
    return StoreHelpers.get(store, name, _Getters.form)
  }
}

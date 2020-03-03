import { ActionTree, ActionContext } from 'vuex'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import { AxiosPromise } from '~/node_modules/axios'
import { Store } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'

export const name = 'cards'

export const namespaced = true

export const types = {
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_CARDS: 'SET_CARDS',
  SET_MANAGED_CARD: 'SET_MANAGED_CARD',
  SET_STATEMENT: 'SET_STATEMENT'
}

export interface State {
  isLoading: boolean
  cards: ManagedCardsSchemas.ManagedCard[]
  managedCard: ManagedCardsSchemas.ManagedCard | null
  statement: ManagedCardsSchemas.ManagedCardStatement | null
}

export enum _Actions {
  freeze = 'freeze',
  unfreeze = 'unfreeze',
  getCards = 'getCards'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.getCards](context: ActionContext<S, R>)

  addCard(context: ActionContext<S, R>, request: ManagedCardsSchemas.CreateManagedCardRequest)

  getManagedCard(context: ActionContext<S, R>, id: number): AxiosPromise<R>

  destroyManagedCard(context: ActionContext<S, R>, request: ManagedCardsSchemas.DestroyRequest): AxiosPromise<R>

  getCardStatement(
    context: ActionContext<S, R>,
    request: ManagedCardsSchemas.GetManagedCardStatementRequest
  ): AxiosPromise<R>

  [_Actions.freeze](context: ActionContext<S, R>, id): AxiosPromise<R>

  [_Actions.unfreeze](context: ActionContext<S, R>, id): AxiosPromise<R>
}

export module Helpers {
  export const freeze = (store: Store<any>, id): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.freeze, id)
  }
  export const unfreeze = (store: Store<any>, id): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.unfreeze, id)
  }
  export const getCards = (store: Store<any>): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.getCards)
  }
}

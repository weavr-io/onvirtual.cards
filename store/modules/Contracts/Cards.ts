import { ActionTree, ActionContext } from 'vuex'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import { AxiosPromise } from '~/node_modules/axios'
import { Store } from '~/node_modules/vuex'
import { StoreHelpers } from '~/helpers/StoreHelpers'
import { UpdateManagedCardRequest } from '~/api/Requests/ManagedCards/UpdateManagedCardRequest'
import { ManagedCardStatementRequest } from '~/api/Requests/Statements/ManagedCardStatementRequest'
import { Statement } from '~/api/Models/Statements/Statement'

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
  statement: Statement | null
}

export enum _Actions {
  freeze = 'freeze',
  unfreeze = 'unfreeze',
  getCards = 'getCards',
  getManagedCard = 'getManagedCard',
  update = 'update'
}

export interface Actions<S, R> extends ActionTree<S, R> {
  [_Actions.getCards](context: ActionContext<S, R>)

  addCard(context: ActionContext<S, R>, request: ManagedCardsSchemas.CreateManagedCardRequest)

  [_Actions.getManagedCard](context: ActionContext<S, R>, id: number): AxiosPromise<ManagedCardsSchemas.ManagedCard>

  getCardStatement(
    context: ActionContext<S, R>,
    request: ManagedCardStatementRequest
  ): AxiosPromise<R>

  [_Actions.freeze](context: ActionContext<S, R>, id): AxiosPromise<R>

  [_Actions.unfreeze](context: ActionContext<S, R>, id): AxiosPromise<R>

  [_Actions.update](context: ActionContext<S, R>, request: UpdateManagedCardRequest): AxiosPromise<R>
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
  export const getManagedCard = (store: Store<any>, id: number): AxiosPromise<ManagedCardsSchemas.ManagedCard> => {
    return StoreHelpers.dispatch(store, name, _Actions.getManagedCard, id)
  }
  export const update = (store: Store<any>, request: UpdateManagedCardRequest): AxiosPromise => {
    return StoreHelpers.dispatch(store, name, _Actions.update, request)
  }
}

// import { ActionTree, ActionContext } from 'vuex'
// import { TransfersSchemas } from '~/api/TransfersSchemas'
// import { Store } from '~/node_modules/vuex'
// import { StoreHelpers } from '~/helpers/StoreHelpers'
//
// export const name = 'transfers'
//
// export const namespaced = true
//
// enum _Getters {}
//
// export enum _Mutations {
//   SET_IS_LOADING = 'SET_IS_LOADING'
// }
//
// enum _Actions {
//   execute = 'execute'
// }
//
// export interface State {
//   isLoading: boolean
// }
//
// export interface Actions<S, R> extends ActionTree<S, R> {
//   [_Actions.execute](context: ActionContext<S, R>, request: TransfersSchemas.CreateTransferRequest)
// }
//
// export module Helpers {
//   export const execute = (store: Store<any>, request: TransfersSchemas.CreateTransferRequest) => {
//     return StoreHelpers.dispatch(store, name, _Actions.execute, request)
//   }
// }

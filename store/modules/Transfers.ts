// import { GetterTree, MutationTree } from 'vuex'
// import { Actions, State, _Mutations, name, namespaced, Helpers } from '~/store/modules/Contracts/Transfers'
// import { RootState } from '~/store'
// import { TransfersSchemas } from '~/api/TransfersSchemas'
// import { $api } from '~/utils/api'
// import Loader from '~/store/loader'
//
// export { name, namespaced, Helpers }
//
// export const state = (): State => ({
//   isLoading: false
// })
//
// export const getters: GetterTree<State, RootState> = {
//   isLoading: (state) => {
//     return state.isLoading
//   }
// }
//
// export const actions: Actions<State, RootState> = {
//   execute({ commit, dispatch }, request: TransfersSchemas.CreateTransferRequest) {
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/transfers/_/execute', request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(_Mutations.SET_IS_LOADING, false)
//     })
//
//     return req
//   }
// }
//
// export const mutations: MutationTree<State> = {
//   [_Mutations.SET_IS_LOADING](state, isLoading: boolean) {
//     state.isLoading = isLoading
//   }
// }

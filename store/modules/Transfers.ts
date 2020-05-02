import { GetterTree, MutationTree } from 'vuex'
import { Actions, State, _Mutations, name, namespaced, Helpers } from '~/store/modules/Contracts/Transfers'
import { RootState } from '~/store'
import * as Loader from '~/store/modules/Loader'
import { api } from '~/api/Axios'
import { TransfersSchemas } from '~/api/TransfersSchemas'

export { name, namespaced, Helpers }

export const state = (): State => ({
  isLoading: false
})

export const getters: GetterTree<State, RootState> = {
  isLoading: (state) => {
    return state.isLoading
  }
}

export const actions: Actions<State, RootState> = {
  execute({ commit }, request: TransfersSchemas.CreateTransferRequest) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/transfers/_/execute', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(_Mutations.SET_IS_LOADING, false)
    })

    return req
  }
}

export const mutations: MutationTree<State> = {
  [_Mutations.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading
  }
}

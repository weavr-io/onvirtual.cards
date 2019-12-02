import { Actions, State, types } from "~/store/modules/Contracts/Transfers"
import { RootState } from "~/store"
import { GetterTree, MutationTree } from 'vuex'
import * as Loader from "~/store/modules/Loader"
import { api } from "~/api/Axios"
import { TransfersSchemas } from "~/api/TransfersSchemas"
import { ManagedCardsSchemas } from "~/api/ManagedCardsSchemas"

export const name = 'transfers'

export const namespaced = true

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
      commit(types.SET_IS_LOADING, false)
    })

    return req
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading
  }
}

import { MutationTree, GetterTree } from 'vuex'
import { RootState } from 'store'
import { Actions, State } from '~/store/modules/Contracts/Loader'

export const name = 'loader'

export const namespaced = true

export const types = {
  STOP: 'STOP',
  START: 'START'
}

export const state = (): State => ({
  isLoading: false
})

export const getters: GetterTree<State, RootState> = {
  isLoading: (state) => {
    return state.isLoading
  }
}

export const actions: Actions<State, RootState> = {
  start({ commit }): void {
    commit(types.START)
  },
  stop({ commit }): void {
    commit(types.STOP)
  }
}

export const mutations: MutationTree<State> = {
  [types.START](state) {
    state.isLoading = true
  },
  [types.STOP](state) {
    state.isLoading = false
  }
}

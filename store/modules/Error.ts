import { MutationTree, GetterTree } from 'vuex'
import { RootState } from 'store'
import { Actions, State, types } from '~/store/modules/Contracts/Error'

export const name = 'error'

export const namespaced = true

export const state = (): State => ({
  errors: null
})

export const getters: GetterTree<State, RootState> = {
  errors: state => {
    return state.errors
  }
}

export const actions: Actions<State, RootState> = {
  setError({ commit }, errors): void {
    commit(types.SET_ERROR, errors)
  },
  resetErrors({ commit }): void {
    commit(types.RESET_ERRORS)
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_ERROR](state, errors: any) {
    state.errors = errors
  },
  [types.RESET_ERRORS](state) {
    state.errors = null
  }
}

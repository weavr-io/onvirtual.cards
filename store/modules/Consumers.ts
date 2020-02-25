import { State, Actions, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Consumers'
import { GetterTree, MutationTree } from '~/node_modules/vuex'
import { RootState } from '~/store'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import * as Loader from '~/store/modules/Loader'
import { api } from '~/api/Axios'

export { name, namespaced, Helpers }

export const state = (): State => ({
  isLoading: false,
  consumer: null
})

export const getters: GetterTree<State, RootState> = {
  isLoading: (state) => {
    return state.isLoading
  },
  consumer: (state) => {
    return state.consumer
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_IS_LOADING](state, isLoading) {
    state.isLoading = isLoading
  },
  [types.SET_CONSUMER](state, consumer: Consumer) {
    state.consumer = consumer
  }
}

export const actions: Actions<State, RootState> = {
  create({ commit }, request) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/consumers/_/create', request)

    req.then((_res) => {
      commit(types.SET_CONSUMER, _res.data)
    })

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  sendVerificationCodeEmail({}, request) {
    return api.post('/app/api/consumers/' + request.consumerId + '/email/send_verification_code', request.request)
  }
}

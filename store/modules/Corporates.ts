import { Actions, State, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Corporates'
import { GetterTree, MutationTree } from '~/node_modules/vuex'
import { RootState } from '~/store'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import * as Loader from '~/store/modules/Loader'
import { api } from '~/api/Axios'
import { KYBState } from '~/api/Enums/KYBState'

export { name, namespaced, Helpers }

export const state = (): State => ({
  corporate: null,
  isLoading: false,
  isLoadingRegistration: false,
  users: null
})

export const getters: GetterTree<State, RootState> = {
  corporate: (state) => {
    return state.corporate
  },
  users: (state) => {
    return state.users
  },
  isLoading: (state) => {
    return state.isLoading
  },
  isLoadingRegistration: (state) => {
    return state.isLoadingRegistration
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading
  },
  [types.SET_CORPORATE](state, corporate: CorporatesSchemas.Corporate) {
    state.corporate = corporate
  },
  [types.SET_USERS](state, users) {
    state.users = users
  },
  [types.SET_IS_LOADING_REGISTRATION](state, isLoading) {
    state.isLoadingRegistration = isLoading
  }
}

export const actions: Actions<State, RootState> = {
  register({ commit }, request: CorporatesSchemas.CreateCorporateRequest) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/corporates/_/create', request)

    req.then((res) => {
      commit(types.SET_CORPORATE, res.data)
      commit(types.SET_IS_LOADING, false)
    })
    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  getCorporateDetails({ commit }, corporateId) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/corporates/' + corporateId + '/get', {})

    req.then((res) => {
      commit(types.SET_CORPORATE, res.data)
    })
    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  getUsers({ commit }, corporateId) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/corporates/' + corporateId + '/users/get', {})

    req.then((res) => {
      commit(types.SET_USERS, res.data)
    })
    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  addUser({ commit }, request: CorporatesSchemas.CreateCorporateUserFullRequest) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/corporates/' + request.corporateId + '/users/_/create', request.request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  sendVerificationCodeEmail(ctxt, request) {
    return api.post('/app/api/corporates/' + request.corporateId + '/users/email/send_verification_code', request.body)
  },
  async checkKYB({ dispatch, getters, rootGetters }) {
    if (getters.corporate === null) {
      const _corpId = rootGetters['auth/auth'].identity.id
      await dispatch('getCorporateDetails', _corpId)
    }

    const _res = getters.corporate.kyb.fullCompanyChecksVerified === KYBState.APPROVED

    if (!_res) {
      return Promise.reject(new Error('KYB not approved'))
    } else {
      return Promise.resolve()
    }
  },
  validateInvite(ctxt, request) {
    return api.post('/app/api/corporates/' + request.id + '/invites/validate', request.body)
  },
  consumeInvite(ctxt, request) {
    return api.post('/app/api/corporates/' + request.id + '/invites/consume', request.body)
  },
  startKYB({}, corporateId) {
    return api.post('/app/api/corporates/' + corporateId + '/kyb/start', {})
  },
  sendVerificationCodeMobile({}, request) {
    return api.post(
      '/app/api/corporates/' + request.corporateId + '/users/mobile/send_verification_code',
      request.request
    )
  },
  verifyMobile({}, request) {
    return api.post('/app/api/corporates/' + request.corporateId + '/users/mobile/verify', request.request)
  }
}

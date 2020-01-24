import { GetterTree, MutationTree } from 'vuex'
import { RootState } from 'store'
import * as Loader from './Loader'
import { api } from '~/api/Axios'
import { Actions, State, types } from '~/store/modules/Contracts/Auth'
import { Schemas } from '~/api/Schemas'

const Cookie = process.client ? require('js-cookie') : undefined

export const name = 'auth'

export const namespaced = true

export const state = (): State => ({
  auth: {
    token: null
  },
  isLoading: false
})

export const getters: GetterTree<State, RootState> = {
  isLoggedIn: (state) => {
    return state.auth != null && state.auth.token != null
  },
  token: (state) => {
    return state.auth.token
  },
  corporateId: (state) => {
    return state.auth.identity ? state.auth.identity.id : null
  },
  isLoading: (state) => {
    return state.isLoading
  }
}

export const actions: Actions<State, RootState> = {
  invalidateToken({ commit }) {
    commit(types.LOGOUT)
  },
  authenticate({ commit }, loginRequest: Schemas.LoginRequest) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/auth/login_with_password', loginRequest)

    req.then((res) => {
      commit(types.AUTHENTICATE, res.data)
      commit(types.SET_IS_LOADING, false)
    })
    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  logout({ commit }) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })
    commit(types.LOGOUT)
  },
  verifyEmail({ commit }, request: Schemas.verifyEmailRequest) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/corporates/' + request.corporateId + '/users/email/verify', request.request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  lostPasswordStart({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/auth/lost_password/start', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  lostPasswordValidate({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/auth/lost_password/validate', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  lostPasswordResume({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/auth/lost_password/resume', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  }
}

export const mutations: MutationTree<State> = {
  [types.AUTHENTICATE](state, { token, identity }) {
    state.auth = {
      token: token,
      identity: identity
    }
    Cookie.set('auth-onvirtual', state.auth)
    api.defaults.headers.Authorization = 'X-TOKEN ' + state.auth.token
  },
  [types.LOGOUT](state) {
    state.auth.token = null

    Cookie.remove('auth-onvirtual')

    delete api.defaults.headers.Authorization
    delete api.defaults.headers['X-Tenant']

    // @ts-ignore
    this.$weavrSecurityAssociate(null)
  },
  [types.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading
  }
}

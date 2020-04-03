import { MutationTree } from 'vuex'
import { RootState } from 'store'
import * as Loader from './Loader'
import { api } from '~/api/Axios'
import { Getters, Actions, State, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Auth'
import { Schemas } from '~/api/Schemas'
import LoginResult = Schemas.LoginResult

const Cookie = process.client ? require('js-cookie') : undefined

export { name, namespaced, Helpers }

export const state = (): State => ({
  auth: {},
  isLoading: false
})

export const getters: Getters<State, RootState> = {
  isLoggedIn: (state) => {
    return state.auth != null && state.auth.token != null
  },
  token: (state) => {
    return state.auth.token
  },
  auth: (state) => {
    return state.auth
  },
  identityId: (state) => {
    return state.auth.identity ? state.auth.identity.id : null
  },
  isConsumer: (state) => {
    return state.auth.identity ? state.auth.identity.type === 'consumers' : false
  },
  isCorporate: (state) => {
    return state.auth.identity ? state.auth.identity.type === 'corporates' : false
  },
  identity: (state) => {
    return state.auth.identity
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

    const req = api.post<LoginResult>('/app/api/auth/login_with_password', loginRequest)

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

    let req

    if (request.consumerId) {
      req = api.post('/app/api/consumers/' + request.consumerId + '/email/verify', request.request)
    } else {
      req = api.post('/app/api/corporates/' + request.corporateId + '/users/email/verify', request.request)
    }

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  lostPasswordStart({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/passwords/lost_password/start', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  lostPasswordValidate({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/passwords/lost_password/validate', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  lostPasswordResume({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/passwords/lost_password/resume', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  createPasswordIdentity({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/passwords/identities/' + request.id + '/create', request.request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  createPassword({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/passwords/' + request.id + '/create', request.request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  updatePassword({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/passwords/' + request.id + '/update', request.request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  validatePassword({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/passwords/validate', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  }
}

export const mutations: MutationTree<State> = {
  [types.AUTHENTICATE](state, _res: LoginResult) {
    state.auth = _res
    Cookie.set('auth-onvirtual', state.auth)
    api.defaults.headers.Authorization = 'Bearer ' + state.auth.token
  },
  [types.LOGOUT](state) {
    state.auth = {}

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

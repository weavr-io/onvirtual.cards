// import { MutationTree } from 'vuex'
// import { RootState } from 'store'
// import { Getters, Actions, State, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Auth'
// import { Schemas } from '~/api/Schemas'
// import LoginResult = Schemas.LoginResult
// import { $api } from '~/utils/api'
// import Loader from '~/store/loader'
//
// const Cookie = process.client ? require('js-cookie') : undefined
//
// export { name, namespaced, Helpers }
//
// export const state = (): State => ({
//   auth: {},
//   isLoading: false
// })
//
// export const getters: Getters<State, RootState> = {
//   isLoggedIn: (state) => {
//     return state.auth != null && state.auth.token != null
//   },
//   token: (state) => {
//     return state.auth.token
//   },
//   auth: (state) => {
//     return state.auth
//   },
//   identityId: (state) => {
//     return state.auth.identity ? state.auth.identity.id : null
//   },
//   isConsumer: (state) => {
//     return state.auth.identity ? state.auth.identity.type === 'consumers' : false
//   },
//   isCorporate: (state) => {
//     return state.auth.identity ? state.auth.identity.type === 'corporates' : false
//   },
//   identity: (state) => {
//     return state.auth.identity
//   },
//   isLoading: (state) => {
//     return state.isLoading
//   }
// }
//
// export const actions: Actions<State, RootState> = {
//   invalidateToken({ commit }) {
//     commit(types.LOGOUT)
//   },
//   authenticate({ commit, dispatch, getters }, loginRequest: Schemas.LoginRequest) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch('loaderModule/start')
//
//     debugger
//
//     console.log(getters['loaderModule/isLoading'])
//
//     const req = $api.post<LoginResult>('/app/api/auth/login_with_password', loginRequest)
//
//     req.then((res) => {
//       commit(types.AUTHENTICATE, res.data)
//       commit(types.SET_IS_LOADING, false)
//     })
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   logout({ commit, dispatch }) {
//     debugger
//     dispatch('loaderModule/start', undefined, { root: true })
//     commit(types.LOGOUT)
//   },
//   verifyEmail({ commit, dispatch }, request: Schemas.verifyEmailRequest) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     let req
//
//     if (request.consumerId) {
//       req = $api.post('/app/api/consumers/' + request.consumerId + '/email/verify', request.request)
//     } else {
//       req = $api.post('/app/api/corporates/' + request.corporateId + '/users/email/verify', request.request)
//     }
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   lostPasswordStart({ commit, dispatch }, request) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/passwords/lost_password/start', request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   lostPasswordValidate({ commit, dispatch }, request) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/passwords/lost_password/validate', request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   lostPasswordResume({ commit, dispatch }, request) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/passwords/lost_password/resume', request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   createPasswordIdentity({ commit, dispatch }, request) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/passwords/identities/' + request.id + '/create', request.request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   createPassword({ commit, dispatch }, request) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/passwords/' + request.id + '/create', request.request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   updatePassword({ commit, dispatch }, request) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/passwords/' + request.id + '/update', request.request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   validatePassword({ commit, dispatch }, request) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/passwords/validate', request)
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   }
// }
//
// export const mutations: MutationTree<State> = {
//   [types.AUTHENTICATE](state, _res: LoginResult) {
//     state.auth = _res
//     Cookie.set('auth-onvirtual', state.auth)
//     $api.defaults.headers.Authorization = 'Bearer ' + state.auth.token
//
//     // @ts-ignore
//     this.$weavrSetUserToken('Bearer ' + state.auth.token)
//   },
//   [types.LOGOUT](state) {
//     state.auth = {}
//
//     Cookie.remove('auth-onvirtual')
//
//     delete $api.defaults.headers.Authorization
//     delete $api.defaults.headers['X-Tenant']
//
//     // @ts-ignore
//     this.$weavrSetUserToken(null)
//   },
//   [types.SET_IS_LOADING](state, isLoading: boolean) {
//     state.isLoading = isLoading
//   }
// }

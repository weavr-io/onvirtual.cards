// import { Actions, Helpers, name, namespaced, State, types } from '~/store/modules/Contracts/Consumers'
// import { GetterTree, MutationTree } from '~/node_modules/vuex'
// import { RootState } from '~/store'
// import { Consumer } from '~/api/Models/Consumers/Consumer'
// import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
// import { $api } from '~/utils/api'
// import Loader from '~/store/loader'
//
// export { name, namespaced, Helpers }
//
// export const state = (): State => ({
//   isLoading: false,
//   consumer: null
// })
//
// export const getters: GetterTree<State, RootState> = {
//   isLoading: (state) => {
//     return state.isLoading
//   },
//   consumer: (state) => {
//     return state.consumer
//   }
// }
//
// export const mutations: MutationTree<State> = {
//   [types.SET_IS_LOADING](state, isLoading) {
//     state.isLoading = isLoading
//   },
//   [types.SET_CONSUMER](state, consumer: Consumer) {
//     state.consumer = consumer
//   }
// }
//
// export const actions: Actions<State, RootState> = {
//   create({ commit, dispatch }, request) {
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/consumers/_/create', request)
//
//     req.then((_res) => {
//       commit(types.SET_CONSUMER, _res.data)
//     })
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   update({ commit, dispatch }, request) {
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/consumers/' + request.consumerId + '/update', request.request)
//
//     req.then((_res) => {
//       commit(types.SET_CONSUMER, _res.data)
//     })
//
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   get({ commit, dispatch }, id) {
//     commit(types.SET_IS_LOADING, true)
//     dispatch(Loader.name + '/start')
//
//     const req = $api.post('/app/api/consumers/' + id + '/get', {})
//
//     req.then((res) => {
//       commit(types.SET_CONSUMER, res.data)
//     })
//     req.finally(() => {
//       dispatch(Loader.name + '/stop')
//       commit(types.SET_IS_LOADING, false)
//     })
//
//     return req
//   },
//   sendVerificationCodeEmail({}, request) {
//     return $api.post('/app/api/consumers/' + request.consumerId + '/email/send_verification_code', request.request)
//   },
//   sendVerificationCodeMobile({}, request) {
//     return $api.post('/app/api/consumers/' + request.consumerId + '/mobile/send_verification_code', request.request)
//   },
//   verifyMobile({}, request) {
//     return $api.post('/app/api/consumers/' + request.consumerId + '/mobile/verify', request.request)
//   },
//   async checkKYC({ dispatch, getters, rootGetters }) {
//     if (getters.consumer === null) {
//       const _id = rootGetters['auth/auth'].identity.id
//       await dispatch('get', _id)
//     }
//
//     const _res = getters.consumer.kyc.fullDueDiligence === FullDueDiligence.APPROVED
//
//     if (!_res) {
//       return Promise.reject(new Error('KYC not approved'))
//     }
//   },
//   startKYC({}, consumerId) {
//     return $api.post('/app/api/consumers/' + consumerId + '/kyc/start', {})
//   }
// }

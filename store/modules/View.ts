// import { Actions, State, types, name, namespaced, Helpers } from '~/store/modules/Contracts/View'
// import { GetterTree, MutationTree } from '~/node_modules/vuex'
// import { RootState } from '~/store'
// import { KYBState } from '~/api/Enums/KYBState'
// import { FullDueDiligence } from '~/api/Enums/Consumers/FullDueDiligence'
//
// export { name, namespaced, Helpers }
//
// export const state = (): State => ({})
//
// export const getters: GetterTree<State, RootState> = {
//   showKybAlert: (state, getters, rootState, rootGetters) => {
//     const _isCorporate = rootGetters['auth/isCorporate']
//
//     if (!_isCorporate) {
//       return false
//     }
//
//     const _corporate = rootGetters['vuexModuleDecorators/corporatesModule'].corporate
//     if (_corporate && _corporate.kyb) {
//       return _corporate.kyb.fullCompanyChecksVerified !== KYBState.APPROVED
//     } else {
//       return false
//     }
//   },
//   showKycAlert: (state, getters, rootState, rootGetters) => {
//     const _isConsumer = rootGetters['auth/isConsumer']
//
//     if (!_isConsumer) {
//       return false
//     }
//
//     const _consumer = rootGetters['consumers/consumer']
//     if (getters.showVerifyMobileAlert) {
//       return false
//     } else if (_consumer && _consumer.kyc) {
//       return _consumer.kyc.fullDueDiligence ? _consumer.kyc.fullDueDiligence !== FullDueDiligence.APPROVED : true
//     } else {
//       return false
//     }
//   },
//   showVerifyMobileAlert: (state, getters, rootState, rootGetters) => {
//     const _consumer = rootGetters['consumers/consumer']
//     const _corporate = rootGetters['vuexModuleDecorators/corporatesModule'].corporate
//
//     if (_consumer && _consumer.kyc) {
//       return _consumer.kyc.mobileVerified ? !_consumer.kyc.mobileVerified : true
//     } else if (_corporate && _corporate.kyb) {
//       return _corporate.kyb.rootMobileVerified ? !_corporate.kyb.rootMobileVerified : true
//     } else {
//       return false
//     }
//   },
//   showVerifyEmailAlert: (state, getters, rootState, rootGetters) => {
//     const _consumer = rootGetters['consumers/consumer']
//     const _corporate = rootGetters['vuexModuleDecorators/corporatesModule'].corporate
//
//     if (_consumer && _consumer.kyc) {
//       return _consumer.kyc.emailVerified ? !_consumer.kyc.emailVerified : true
//     } else if (_corporate && _corporate.kyb) {
//       return _corporate.kyb.rootEmailVerified ? !_corporate.kyb.rootEmailVerified : true
//     } else {
//       return false
//     }
//   },
//   hasAlert: (state, getters) => {
//     return getters.showKybAlert || getters.showKycAlert
//   }
// }
//
// export const actions: Actions<State, RootState> = {}
//
// export const mutations: MutationTree<State> = {}

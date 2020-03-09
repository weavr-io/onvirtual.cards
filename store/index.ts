import Vuex from 'vuex'
import * as root from './root'
import * as Auth from './modules/Auth'
import * as Error from './modules/Error'
import * as Loader from './modules/Loader'
import * as Cards from './modules/Cards'
import * as Corporates from './modules/Corporates'
import * as Accounts from './modules/Accounts'
import * as Transfers from './modules/Transfers'
import * as Consumers from './modules/Consumers'
import createInterceptors from '~/plugins/AxiosInterceptors'

// More info about store: https://vuex.vuejs.org/en/core-concepts.html
// See https://nuxtjs.org/guide/vuex-store#classic-mode
// structure of the store:
// types: Types that represent the keys of the mutations to commit
// state: The information of our app, we can get or update it.
// getters: Get complex information from state
// action: Sync or async operations that commit mutations
// mutations: Modify the state

export type RootState = root.State

const interceptors = createInterceptors()

const createStore = () => {
  return new Vuex.Store({
    plugins: [interceptors],
    state: root.state(),
    getters: root.getters,
    mutations: root.mutations,
    actions: root.actions,
    modules: {
      [Auth.name]: Auth,
      [Error.name]: Error,
      [Loader.name]: Loader,
      [Cards.name]: Cards,
      [Corporates.name]: Corporates,
      [Accounts.name]: Accounts,
      [Transfers.name]: Transfers,
      [Consumers.name]: Consumers
    }
  })
}

export default createStore

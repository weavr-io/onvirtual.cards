import { Store } from 'vuex'
import * as root from './root'
import * as Auth from './modules/Auth'
import * as Error from './modules/Error'
import * as Loader from './modules/Loader'
import * as Corporates from './modules/Corporates'
import * as Transfers from './modules/Transfers'
import * as Consumers from './modules/Consumers'
import * as View from './modules/View'
import * as SecureClient from './modules/SecureClient'
import createInterceptors from '~/plugins/AxiosInterceptors'
import Cards from '~/store/cards'
import Accounts from '~/store/accounts'
import { initialiseStores } from '~/utils/store-accessor'

// More info about store: https://vuex.vuejs.org/en/core-concepts.html
// See https://nuxtjs.org/guide/vuex-store#classic-mode
// structure of the store:
// types: Types that represent the keys of the mutations to commit
// state: The information of our app, we can get or update it.
// getters: Get complex information from state
// action: Sync or async operations that commit mutations
// mutations: Modify the state

export type RootState = root.State

const initializer = (store: Store<any>) => initialiseStores(store)
const interceptors = createInterceptors()

const createStore = () => {
  return new Store({
    plugins: [interceptors, initializer],
    state: root.state(),
    getters: root.getters,
    mutations: root.mutations,
    actions: root.actions,
    modules: {
      [Auth.name]: Auth,
      [Error.name]: Error,
      [Loader.name]: Loader,
      [Corporates.name]: Corporates,
      [Transfers.name]: Transfers,
      [Consumers.name]: Consumers,
      [View.name]: View,
      [SecureClient.name]: SecureClient,
      cardsV2: Cards,
      accountsV2: Accounts
    }
  })
}

export default createStore

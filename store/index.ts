import { Store } from 'vuex'
import * as root from './root'
import * as Auth from './modules/Auth'
import * as Error from './modules/Error'
import * as Transfers from './modules/Transfers'
import * as Consumers from './modules/Consumers'
import * as View from './modules/View'
import * as SecureClient from './modules/SecureClient'
import Cards from '~/store/cards'
import Accounts from '~/store/accounts'
import Corporates from '~/store/corporates'
import { initialiseStores } from '~/utils/store-accessor'
import Loader from '~/store/loader'

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

const createStore = () => {
  return new Store({
    plugins: [initializer],
    state: root.state(),
    getters: root.getters,
    mutations: root.mutations,
    actions: root.actions,
    modules: {
      [Auth.name]: Auth,
      [Error.name]: Error,
      [Transfers.name]: Transfers,
      [Consumers.name]: Consumers,
      [View.name]: View,
      [SecureClient.name]: SecureClient,
      cardsModule: Cards,
      accountsModule: Accounts,
      corporatesModule: Corporates,
      loaderModule: Loader
    }
  })
}

export default createStore

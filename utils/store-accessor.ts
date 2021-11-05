import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Cards from '~/store/cards'
import Accounts from '~/store/accounts'
import Corporates from '~/store/corporates'
import Loader from '~/store/loader'
import Auth from '~/store/auth'

export interface Stores {
  cards: Cards
  accounts: Accounts
  corporates: Corporates
  loader: Loader
  auth: Auth
}

function initialiseStores(store: Store<any>): Stores {
  return {
    cards: cardsStore(store),
    accounts: accountsStore(store),
    corporates: corporatesStore(store),
    loader: loaderStore(store),
    auth: authStore(store)
  }
}

function cardsStore(store: Store<any>) {
  return getModule(Cards, store)
}

function authStore(store: Store<any>) {
  return getModule(Auth, store)
}

function accountsStore(store: Store<any>) {
  return getModule(Accounts, store)
}

function corporatesStore(store: Store<any>) {
  return getModule(Corporates, store)
}

function loaderStore(store: Store<any>) {
  return getModule(Loader, store)
}

export { initialiseStores, cardsStore, accountsStore, corporatesStore, loaderStore, authStore }

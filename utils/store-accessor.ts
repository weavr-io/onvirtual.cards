import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Cards from '~/store/cards'
import Accounts from '~/store/accounts'
import Corporates from '~/store/corporates'
import Loader from '~/store/loader'
import Auth from '~/store/auth'
import Consumers from '~/store/consumers'
import Transfers from '~/store/transfers'
import Errors from '~/store/errors'
import View from '~/store/view'
import Users from '~/store/users'

export interface Stores {
  cards: Cards
  accounts: Accounts
  corporates: Corporates
  loader: Loader
  auth: Auth
  consumers: Consumers
  transfers: Transfers
  errors: Errors
  view: View
  users: Users
}

function initialiseStores(store: Store<any>): Stores {
  return {
    cards: cardsStore(store),
    accounts: accountsStore(store),
    corporates: corporatesStore(store),
    loader: loaderStore(store),
    auth: authStore(store),
    consumers: consumersStore(store),
    transfers: transfersStore(store),
    errors: errorsStore(store),
    view: viewStore(store),
    users: usersStore(store)
  }
}

function transfersStore(store: Store<any>) {
  return getModule(Transfers, store)
}

function usersStore(store: Store<any>) {
  return getModule(Users, store)
}

function consumersStore(store: Store<any>) {
  return getModule(Consumers, store)
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

function errorsStore(store: Store<any>) {
  return getModule(Errors, store)
}

function viewStore(store: Store<any>) {
  return getModule(View, store)
}

export {
  initialiseStores,
  cardsStore,
  accountsStore,
  corporatesStore,
  loaderStore,
  authStore,
  consumersStore,
  transfersStore,
  errorsStore,
  viewStore,
  usersStore
}

import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Cards from '~/store/cards'
import Accounts from '~/store/accounts'

export interface Stores {
  cards: Cards
  accounts: Accounts
}

function initialiseStores(store: Store<any>): Stores {
  return {
    cards: cardsStore(store),
    accounts: accountsStore(store)
  }
}

function cardsStore(store: Store<any>) {
  return getModule(Cards, store)
}

function accountsStore(store: Store<any>) {
  return getModule(Accounts, store)
}

export { initialiseStores, cardsStore, accountsStore }

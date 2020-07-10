import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Cards from '~/store/cards'

export interface Stores {
  cards: Cards
}

function initialiseStores(store: Store<any>): Stores {
  return {
    cards: cardsStore(store)
  }
}

function cardsStore(store: Store<any>) {
  return getModule(Cards, store)
}

export { initialiseStores, cardsStore }

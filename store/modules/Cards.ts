import { GetterTree, MutationTree } from 'vuex'
import { RootState } from 'store'
import * as Loader from './Loader'
import { api } from '~/api/Axios'
import { Actions, State, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Cards'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import { Statement } from '~/api/Models/Statements/Statement'

export { name, namespaced, Helpers }

export const state = (): State => ({
  isLoading: false,
  cards: [],
  statement: null,
  managedCard: null
})

export const getters: GetterTree<State, RootState> = {
  cards: (state) => {
    return state.cards
  },
  currency: (state) => {
    if (state.cards == null) {
      return null
    } else if (state.cards.length > 0) {
      return state.cards[0].currency
    } else {
      return null
    }
  },
  totalAvailableBalance: (state) => {
    if (state.cards == null) {
      return 0
    }

    let total = 0

    state.cards.forEach((card: ManagedCardsSchemas.ManagedCard) => {
      if (card.balances.availableBalance) {
        total += parseInt(card.balances.availableBalance)
      }
    })

    return total
  },
  isLoading: (state) => {
    return state.isLoading
  },
  statement: (state) => {
    return state.statement
  },
  filteredStatement: (state) => {
    if (state.statement == null) {
      return []
    }

    const _entries = state.statement.entry.filter((transaction) => {
      const _shouldDisplay = !['AUTHORISATION_REVERSAL', 'AUTHORISATION_EXPIRY', 'AUTHORISATION_DECLINE'].includes(
        transaction.txId.type
      )

      if (!_shouldDisplay) {
        return false
      }

      if (transaction.txId.type === 'AUTHORISATION') {
        if (transaction.additionalFields?.authorisationState === 'COMPLETED') {
          return false
        }
      }

      return true
    })

    const _out = {}

    _entries.forEach((_entry) => {
      if (_entry.processedTimestamp) {
        const _processedTimestamp = parseInt(_entry.processedTimestamp)
        // @ts-ignore
        const _date = window.$nuxt.$moment(_processedTimestamp).startOf('day')

        if (!_out[_date]) {
          _out[_date] = []
        }

        _out[_date].push(_entry)
      }
    })

    return _out
  },
  managedCard: (state) => {
    return state.managedCard
  }
}

export const actions: Actions<State, RootState> = {
  getCards({ commit }) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const body = {
      paging: {
        count: true,
        offset: 0,
        limit: 0
      }
    }

    const req = api.post('/app/api/managed_cards/get', body)

    req.then((res) => {
      commit(types.SET_CARDS, res.data.card)
    })
    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
    })

    return req
  },
  addCard({ commit }, request: ManagedCardsSchemas.CreateManagedCardRequest) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/managed_cards/_/create', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  update({ commit }, request) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/managed_cards/' + request.id + '/update', request.body)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  getCardStatement({ commit }, request) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/managed_cards/' + request.id + '/statement/get', request)

    req.then((res) => {
      commit(types.SET_STATEMENT, res.data)
    })

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  getManagedCard({ commit }, id) {
    const req = api.post('/app/api/managed_cards/' + id + '/get', {})

    req.then((res) => {
      commit(types.SET_MANAGED_CARD, res.data)
    })

    return req
  },
  freeze({ commit }, id) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/managed_cards/' + id + '/freeze', {})

    req.then((res) => {
      commit(types.SET_MANAGED_CARD, res.data)
    })

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  unfreeze({ commit }, id) {
    commit(types.SET_IS_LOADING, true)
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/managed_cards/' + id + '/unfreeze', {})

    req.then((res) => {
      commit(types.SET_MANAGED_CARD, res.data)
    })

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_CARDS](state, cards) {
    state.cards = cards
  },
  [types.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading
  },
  [types.SET_STATEMENT](state, r: Statement) {
    state.statement = r
  },
  [types.SET_MANAGED_CARD](state, r: ManagedCardsSchemas.ManagedCard) {
    state.managedCard = r
  }
}

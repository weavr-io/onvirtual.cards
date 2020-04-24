import { State, Actions, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Accounts'
import { GetterTree, MutationTree } from '~/node_modules/vuex'
import { RootState } from '~/store'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import * as Loader from '~/store/modules/Loader'
import { api } from '~/api/Axios'
import { Statement } from '~/api/Models/Statements/Statement'

export { name, namespaced, Helpers }

export const state = (): State => ({
  isLoading: false,
  accounts: null,
  account: null,
  statement: null
})

export const getters: GetterTree<State, RootState> = {
  accounts: (state) => {
    return state.accounts
  },
  account: (state) => {
    return state.account
  },
  statement: (state) => {
    return state.statement
  },
  totalAvailableBalance: (state) => {
    if (state.accounts == null) {
      return 0
    }

    let total = 0

    state.accounts.account.forEach((account: ManagedAccountsSchemas.ManagedAccount) => {
      if (account.balances.availableBalance) {
        total += parseInt(account.balances.availableBalance)
      }
    })

    return total
  },
  filteredStatement: (state) => {
    if (state.statement == null) {
      return []
    }

    const _entries = state.statement.entry

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
  isLoading: (state) => {
    return state.isLoading
  }
}

export const mutations: MutationTree<State> = {
  [types.SET_ACCOUNTS](state, accounts: ManagedAccountsSchemas.ManagedAccounts) {
    state.accounts = accounts
  },
  [types.SET_ACCOUNT](state, account: ManagedAccountsSchemas.ManagedAccount) {
    state.account = account
  },
  [types.SET_STATEMENT](state, statement: Statement) {
    state.statement = statement
  },
  [types.SET_IS_LOADING](state, isLoading: boolean) {
    state.isLoading = isLoading
  }
}

export const actions: Actions<State, RootState> = {
  index({ commit }) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const body = {
      active: true,
      paging: {
        count: true,
        offset: 0,
        limit: 0
      }
    }

    const req = api.post('/app/api/managed_accounts/get', body)

    req.then((res) => {
      commit(types.SET_ACCOUNTS, res.data)
    })
    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
    })

    return req
  },
  add({ commit }, request: ManagedAccountsSchemas.CreateManagedAccountRequest) {
    commit(Loader.name + '/' + Loader.types.START, null, { root: true })

    const req = api.post('/app/api/managed_accounts/_/create', request)

    req.finally(() => {
      commit(Loader.name + '/' + Loader.types.STOP, null, { root: true })
      commit(types.SET_IS_LOADING, false)
    })

    return req
  },
  get({ commit }, id: number) {
    const req = api.post('/app/api/managed_accounts/' + id + '/get', {})

    req.then((res) => {
      commit(types.SET_ACCOUNT, res.data)
    })

    return req
  },
  getStatement({ commit }, request) {
    const req = api.post('/app/api/managed_accounts/' + request.id + '/statement/get', request.body)

    req.then((res) => {
      commit(types.SET_STATEMENT, res.data)
    })

    return req
  }
}

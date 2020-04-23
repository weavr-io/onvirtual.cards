import { State, Actions, types, name, namespaced, Helpers } from '~/store/modules/Contracts/Accounts'
import { GetterTree, MutationTree } from '~/node_modules/vuex'
import { RootState } from '~/store'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import * as Loader from '~/store/modules/Loader'
import { api } from '~/api/Axios'

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

    // const _entries = state.statement.entry

    const _entries = [
      {
        "txId": {
          "type": "SEND",
          "id": "104047038481629193"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-2500"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "12426"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587631817055",
        "additionalFields": {
          "destinationIdentityType": "corporates",
          "destinationIdentityId": "104046721298989065",
          "destinationIdentityName": "corp1587626976"
        }
      },
      {
        "txId": {
          "type": "SEND",
          "id": "104047035374829577"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "2500"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "14926"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587631769842",
        "additionalFields": {
          "sourceIdentityType": "corporates",
          "sourceIdentityId": "104046721298989065",
          "sourceIdentityName": "corp1587626976"
        }
      },
      {
        "txId": {
          "type": "TRANSFER",
          "id": "104046773751447561"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-300"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "12426"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "100"
        },
        "processedTimestamp": "1587627777754",
        "additionalFields": {
          "destinationInstrumentType": "managed_accounts",
          "destinationInstrumentId": "104046721385234441",
          "destinationInstrumentFriendlyName": "eur_account"
        }
      },
      {
        "txId": {
          "type": "MANUAL_TRANSACTION",
          "id": "104046766777630729"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "0"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "12726"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627671077",
        "additionalFields": {}
      },
      {
        "txId": {
          "type": "MANUAL_TRANSACTION",
          "id": "104046765734494217"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "5000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "12726"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627655427",
        "additionalFields": {}
      },
      {
        "txId": {
          "type": "MANUAL_TRANSACTION",
          "id": "104046762835181577"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-1000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "7726"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627610996",
        "additionalFields": {}
      },
      {
        "txId": {
          "type": "MANUAL_TRANSACTION",
          "id": "104046761986031625"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "2000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "8726"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627598027",
        "additionalFields": {}
      },
      {
        "txId": {
          "type": "MERCHANT_REFUND",
          "id": "-5240708042780184424"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "50"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "6726"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627461235",
        "additionalFields": {
          "merchantName": "Refundable.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "settlementRelatedId": "2256184824323841833"
        }
      },
      {
        "txId": {
          "type": "SETTLEMENT",
          "id": "2256184824323841833"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-50"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "6676"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627456235",
        "additionalFields": {
          "merchantName": "Refundable.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "authorisationRelatedId": "-4522559522312472557"
        }
      },
      {
        "txId": {
          "type": "AUTHORISATION",
          "id": "-4522559522312472557"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-50"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "6676"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627451217",
        "additionalFields": {
          "merchantName": "Refundable.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "forexPaddingCurrency": "EUR",
          "forexPaddingAmount": "0",
          "authorisationState": "COMPLETED"
        }
      },
      {
        "txId": {
          "type": "SETTLEMENT",
          "id": "4786416889718836284"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-2274"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "6726"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627351235",
        "sourceAmount": {
          "currency": "GBP",
          "amount": "-2000"
        },
        "additionalFields": {
          "exchangeRate": "0.8795",
          "merchantName": "Ebay UK",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "authorisationRelatedId": "-2554267974998840714"
        }
      },
      {
        "txId": {
          "type": "AUTHORISATION",
          "id": "-2554267974998840714"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-2274"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "6726"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627346232",
        "sourceAmount": {
          "currency": "GBP",
          "amount": "-2000"
        },
        "additionalFields": {
          "exchangeRate": "0.8795",
          "merchantName": "Ebay UK",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "forexPaddingCurrency": "EUR",
          "forexPaddingAmount": "0",
          "authorisationState": "COMPLETED"
        }
      },
      {
        "txId": {
          "type": "SETTLEMENT",
          "id": "-1942299123005360510"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-1000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "9000"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627301245",
        "additionalFields": {
          "merchantName": "Amazon IT",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "authorisationRelatedId": "-4890568368608202801"
        }
      },
      {
        "txId": {
          "type": "AUTHORISATION",
          "id": "-4890568368608202801"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-1000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "9000"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627296239",
        "additionalFields": {
          "merchantName": "Amazon IT",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "forexPaddingCurrency": "EUR",
          "forexPaddingAmount": "0",
          "authorisationState": "COMPLETED"
        }
      },
      {
        "txId": {
          "type": "AUTHORISATION_REVERSAL",
          "id": "-8958270056348256916"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "500"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "10000"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627236331",
        "additionalFields": {
          "merchantName": "Reversible.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "forexPaddingCurrency": "EUR",
          "forexPaddingAmount": "0",
          "authorisationRelatedId": "3285988530918352186"
        }
      },
      {
        "txId": {
          "type": "AUTHORISATION",
          "id": "3285988530918352186"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-500"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "9500"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627231235",
        "additionalFields": {
          "merchantName": "Reversible.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "forexPaddingCurrency": "EUR",
          "forexPaddingAmount": "0",
          "authorisationState": "COMPLETED"
        }
      },
      {
        "txId": {
          "type": "MERCHANT_REFUND",
          "id": "2878560988046347300"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "3000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "10000"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627181256",
        "additionalFields": {
          "merchantName": "Refundable.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "settlementRelatedId": "-5607887284888863762"
        }
      },
      {
        "txId": {
          "type": "SETTLEMENT",
          "id": "-5607887284888863762"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-3000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "7000"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627176382",
        "additionalFields": {
          "merchantName": "Refundable.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "authorisationRelatedId": "-7604249406473828655"
        }
      },
      {
        "txId": {
          "type": "AUTHORISATION",
          "id": "-7604249406473828655"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "-3000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "7000"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627171240",
        "additionalFields": {
          "merchantName": "Refundable.com",
          "merchantCategoryCode": "5399",
          "merchantTerminalCountry": "MT",
          "forexPaddingCurrency": "EUR",
          "forexPaddingAmount": "0",
          "authorisationState": "COMPLETED"
        }
      },
      {
        "txId": {
          "type": "TRANSFER",
          "id": "104046726349979657"
        },
        "transactionAmount": {
          "currency": "EUR",
          "amount": "10000"
        },
        "balanceAfter": {
          "currency": "EUR",
          "amount": "10000"
        },
        "cardholderFee": {
          "currency": "EUR",
          "amount": "0"
        },
        "processedTimestamp": "1587627054638",
        "additionalFields": {
          "sourceInstrumentType": "managed_accounts",
          "sourceInstrumentId": "104046721385234441",
          "sourceInstrumentFriendlyName": "eur_account"
        }
      }
    ]

    const _out = {}

    _entries.forEach((_entry) => {
      const _processedTimestamp = parseInt(_entry.processedTimestamp)
      // @ts-ignore
      const _date = window.$nuxt.$moment(_processedTimestamp).startOf('day')

      if (!_out[_date]) {
        _out[_date] = []
      }

      _out[_date].push(_entry)
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
  [types.SET_STATEMENT](state, statement: ManagedAccountsSchemas.ManagedAccountStatement) {
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

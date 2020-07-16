import { Module, Action, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import { Statement } from '~/api/Models/Statements/Statement'
import { api } from '~/api/Axios'
import { ManagedAccountStatementRequest } from '~/api/Requests/ManagedAccountStatementRequest'
import { ManagedCardStatementRequest } from '~/api/Requests/Statements/ManagedCardStatementRequest'

@Module({
  name: 'accountsV2',
  stateFactory: true,
  namespaced: true
})
export default class Accounts extends StoreModule {
  isLoading: boolean = false
  accounts: ManagedAccountsSchemas.ManagedAccounts | null = null
  account: ManagedAccountsSchemas.ManagedAccount | null = null
  statement: Statement | null = null

  get totalAvailableBalance() {
    if (this.accounts == null) {
      return 0
    }

    let total = 0

    this.accounts.account.forEach((account: ManagedAccountsSchemas.ManagedAccount) => {
      if (account.balances.availableBalance) {
        total += parseInt(account.balances.availableBalance)
      }
    })

    return total
  }

  get filteredStatement() {
    if (this.statement == null) {
      return []
    }

    let _entries = this.statement.entry

    _entries = _entries.filter((transaction) => {
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
  }

  @Mutation
  SET_ACCOUNTS(accounts: ManagedAccountsSchemas.ManagedAccounts) {
    this.accounts = accounts
  }

  @Mutation
  SET_ACCOUNT(account: ManagedAccountsSchemas.ManagedAccount) {
    this.account = account
  }

  @Mutation
  SET_STATEMENT(statement: Statement) {
    this.statement = statement
  }

  @Mutation
  APPEND_STATEMENT(_statement: Statement) {
    if (this.statement === null) {
      this.statement = _statement
    } else {
      _statement.entry.forEach((_statementEntry) => {
        this.statement?.entry.push(_statementEntry)
      })
    }
  }

  @Mutation
  SET_IS_LOADING(isLoading: boolean) {
    this.isLoading = isLoading
  }

  @Action({ rawError: true })
  index() {
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
      this.SET_ACCOUNTS(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  add(request: ManagedAccountsSchemas.CreateManagedAccountRequest) {
    const req = api.post('/app/api/managed_accounts/_/create', request)

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  get(id: number) {
    const req = api.post('/app/api/managed_accounts/' + id + '/get', {})

    req.then((res) => {
      this.SET_ACCOUNT(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  getStatement(request: { id: string; body: ManagedAccountStatementRequest }) {
    console.log(request)
    const req = api.post('/app/api/managed_accounts/' + request.id + '/statement/get', request.body)

    req.then((res) => {
      this.SET_STATEMENT(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  getCardStatementPage(request: { id: string; body: ManagedAccountStatementRequest }) {
    const req = api.post('/app/api/managed_accounts/' + request.id + '/statement/get', request.body)

    req.then((res) => {
      this.APPEND_STATEMENT(res.data)
    })

    return req
  }
}

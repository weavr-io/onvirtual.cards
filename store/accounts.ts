import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { $api } from '~/utils/api'
import { GetManagedAccountsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountsRequest'
import { PaginatedManagedAccountsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/responses/PaginatedManagedAccountsResponse'
import { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import { ManagedAccountStatementRequest } from '~/api/Requests/Statements/ManagedAccountStatementRequest'

@Module({
  name: 'accountsModule',
  stateFactory: true,
  namespaced: true
})
export default class Accounts extends StoreModule {
  isLoading: boolean = false
  accounts: PaginatedManagedAccountsResponse | null = null
  account: ManagedAccountModel | null = null
  statement: StatementResponseModel | null = null

  get totalAvailableBalance() {
    if (this.accounts == null) {
      return 0
    }

    let total = 0

    this.accounts.accounts.forEach((account) => {
      if (account.balances.availableBalance) {
        total += account.balances.availableBalance
      }
    })

    return total
  }

  get filteredStatement() {
    if (this.statement == null) {
      return []
    }

    let _entries = this.statement.entry

    _entries = _entries!.filter((transaction) => {
      const DO_NOT_DISPLAY = ['AUTHORISATION_REVERSAL', 'AUTHORISATION_EXPIRY', 'AUTHORISATION_DECLINE']

      if (DO_NOT_DISPLAY.includes(transaction.transactionId.type)) {
        return false
      }

      if (transaction.transactionId.type === 'AUTHORISATION') {
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
  SET_ACCOUNTS(accounts: PaginatedManagedAccountsResponse) {
    this.accounts = accounts
  }

  @Mutation
  SET_ACCOUNT(account: ManagedAccountModel) {
    this.account = account
  }

  @Mutation
  SET_STATEMENT(statement: StatementResponseModel) {
    this.statement = statement
  }

  @Mutation
  RESET_STATEMENT() {
    this.statement = null
  }

  @Mutation
  APPEND_STATEMENT(_statement: StatementResponseModel) {
    if (this.statement === null) {
      this.statement = _statement
    } else {
      _statement.entry!.forEach((_statementEntry) => {
        this.statement?.entry!.push(_statementEntry)
      })
    }
  }

  @Mutation
  SET_IS_LOADING(isLoading: boolean) {
    this.isLoading = isLoading
  }

  @Action({ rawError: true })
  index(filters: GetManagedAccountsRequest) {
    // const body = {
    //   active: NullableBoolean.TRUE,
    //   paging: {
    //     count: true,
    //     offset: 0,
    //     limit: 0
    //   }
    // }

    // const req = $api.post('/app/api/managed_accounts/get', body)
    const req = this.store.$apiMulti.managedAccounts.index(filters)

    req.then((res) => {
      this.SET_ACCOUNTS(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  create(request: CreateManagedAccountRequest) {
    // const req = $api.post('/app/api/managed_accounts/_/create', request)

    const req = this.store.$apiMulti.managedAccounts.store(request)

    req.finally(() => {
      this.SET_IS_LOADING(false)
    })

    return req
  }

  @Action({ rawError: true })
  get(id: string) {
    // const req = $api.post('/app/api/managed_accounts/' + id + '/get', {})

    const req = this.store.$apiMulti.managedAccounts.show(id)

    req.then((res) => {
      this.SET_ACCOUNT(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  getStatement(request: { id: string; filters: GetManagedAccountStatementRequest }) {
    // const req = $api.post('/app/api/managed_accounts/' + request.id + '/statement/get', request.body)

    const req = this.store.$apiMulti.managedAccounts.statement(request)

    req.then((res) => {
      this.SET_STATEMENT(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  getCardStatementPage(request: { id: string; body: ManagedAccountStatementRequest }) {
    const req = $api.post('/app/api/managed_accounts/' + request.id + '/statement/get', request.body)

    req.then((res) => {
      this.APPEND_STATEMENT(res.data)
    })

    return req
  }
}

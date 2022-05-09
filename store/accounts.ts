import { Action, Module, Mutation } from 'vuex-module-decorators'
import { StoreModule } from '~/store/storeModule'
import { GetManagedAccountsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountsRequest'
import { PaginatedManagedAccountsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/responses/PaginatedManagedAccountsResponse'
import { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'

const defaultState = {
  accounts: null,
  account: null,
  statements: null,
  ibanDetails: null
}

@Module({
  name: 'accountsModule',
  stateFactory: true,
  namespaced: true
})
export default class Accounts extends StoreModule {
  accounts: PaginatedManagedAccountsResponse | null = defaultState.accounts
  account: ManagedAccountModel | null = defaultState.account
  statements: StatementResponseModel | null = defaultState.statements
  ibanDetails: ManagedAccountIBANModel | null = defaultState.ibanDetails

  get totalAvailableBalance() {
    if (this.accounts == null) {
      return 0
    }

    let total = 0

    this.accounts.accounts?.forEach((account) => {
      if (account.balances.availableBalance) {
        total += account.balances.availableBalance
      }
    })

    return total
  }

  get filteredStatement() {
    if (this.statements?.entry === undefined) {
      return []
    }

    let _entries: StatementEntryModel[] = this.statements.entry

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
  RESET_STATEMENTS() {
    this.statements = null
  }

  @Mutation
  SET_STATEMENTS(statements: StatementResponseModel | null) {
    if (!statements) {
      this.statements = statements
    } else if (!this.statements?.entry) {
      this.statements = statements
    } else if (statements.entry) {
      this.statements.entry.push(...statements.entry)
    }
  }

  @Mutation
  RESET_STATE() {
    Object.keys(defaultState).forEach((key) => {
      this[key] = defaultState[key]
    })
  }

  @Mutation
  SET_IBAN(_res: ManagedAccountIBANModel) {
    this.ibanDetails = _res
  }

  @Action({ rawError: true })
  index(filters: GetManagedAccountsRequest) {
    const req = this.store.$apiMulti.managedAccounts.index(filters)

    req.then((res) => {
      this.SET_ACCOUNTS(res.data)
      if (res.data.count && res.data.accounts) {
        this.SET_ACCOUNT(res.data.accounts[0])
      }
    })

    return req
  }

  @Action({ rawError: true })
  create(request: CreateManagedAccountRequest) {
    const req = this.store.$apiMulti.managedAccounts.store(request)

    return req
  }

  @Action({ rawError: true })
  get(id: string) {
    const req = this.store.$apiMulti.managedAccounts.show(id)

    req.then((res) => {
      this.SET_ACCOUNT(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  getStatements(request: { id: string; filters: GetManagedAccountStatementRequest }) {
    const req = this.store.$apiMulti.managedAccounts.statement(request)

    req.then((res) => {
      this.SET_STATEMENTS(res.data)
    })

    return req
  }

  @Action({ rawError: true })
  getIBANDetails(id: IDModel) {
    const req = this.store.$apiMulti.managedAccounts.retrieveIban(id)
    req.then((res) => {
      this.SET_IBAN(res.data)
    })
    return req
  }

  @Action({ rawError: true })
  upgradeIban(id: IDModel) {
    const req = this.store.$apiMulti.managedAccounts.assignIban(id)
    req.then((res) => {
      this.SET_IBAN(res.data)
    })

    return req
  }
}

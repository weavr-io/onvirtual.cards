import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type { Accounts as AccountState } from '~/local/models/store/accounts'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'
import { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { GetManagedAccountsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountsRequest'
import { PaginatedManagedAccountsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/responses/PaginatedManagedAccountsResponse'
import { TransactionTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/enums/TransactionTypeEnum'
import { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'
import { useAuthStore } from '~/store/auth'

const initState = (): AccountState => {
    return {
        accounts: null,
        account: null,
        statements: null,
        ibanDetails: null,
    }
}

export const useAccountsStore = defineStore('accounts', () => {
    const store = useAuthStore()
    const accountState: AccountState = reactive(initState())

    const totalAvailableBalance = computed(() => {
        let total = 0
        if (!accountState.accounts) return total

        accountState.accounts.accounts?.forEach((account: ManagedAccountModel) => {
            if (account.balances.availableBalance) {
                total += account.balances.availableBalance
            }
        })

        return total
    })

    const filteredStatement = computed(() => {
        if (!accountState.statements?.entry) return []

        let _entries: StatementEntryModel[] = accountState.statements.entry

        _entries = _entries!.filter((transaction) => {
            const DO_NOT_DISPLAY = [
                TransactionTypeEnum.AUTHORISATION_REVERSAL,
                TransactionTypeEnum.AUTHORISATION_EXPIRY,
                TransactionTypeEnum.AUTHORISATION_DECLINE,
            ]

            if (DO_NOT_DISPLAY.includes(transaction.transactionId.type)) return false

            if (transaction.transactionId.type === TransactionTypeEnum.AUTHORISATION) {
                if (
                    transaction.additionalFields?.authorisationState ===
                    TransactionStateTypeEnum.COMPLETED
                ) {
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
                const _date = DateTime.fromJSDate(_processedTimestamp).startOf('day').toMillis()

                if (!_out[_date]) {
                    _out[_date] = []
                }

                _out[_date].push(_entry)
            }
        })

        return _out
    })

    const setAccounts = (accounts: PaginatedManagedAccountsResponse) => {
        accountState.accounts = accounts
    }

    const setAccount = (account: ManagedAccountModel) => {
        accountState.account = account
    }

    const resetStatements = () => {
        accountState.statements = null
    }

    const setStatements = (statements: StatementResponseModel | null) => {
        if (statements?.entry) {
            accountState.statements?.entry?.push(...statements.entry)
        }

        accountState.statements = statements
    }

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            accountState[key] = data[key]
        })
    }

    const setIban = (_res: ManagedAccountIBANModel) => {
        accountState.ibanDetails = _res
    }

    const index = (filters: GetManagedAccountsRequest) => {
        const req = store.$nuxt.$apiMulti.managedAccounts.index(filters)

        req.then((res) => {
            setAccounts(res.data)
            if (res.data.count && res.data.accounts) {
                setAccount(res.data.accounts[0])
            }
        })

        return req
    }

    const create = (request: CreateManagedAccountRequest) => {
        const req = store.$nuxt.$apiMulti.managedAccounts.store(request)

        return req
    }

    const get = (id: string) => {
        const req = store.$nuxt.$apiMulti.managedAccounts.show(id)

        req.then((res) => {
            setAccount(res.data)
        })

        return req
    }

    const getStatements = (request: { id: string; filters: GetManagedAccountStatementRequest }) => {
        const req = store.$nuxt.$apiMulti.managedAccounts.statement(request)

        req.then((res) => {
            setStatements(res.data)
        })

        return req
    }

    const getIBANDetails = (id: IDModel) => {
        const req = store.$nuxt.$apiMulti.managedAccounts.retrieveIban(id)

        req.then((res) => {
            setIban(res.data)
        })

        return req
    }

    const upgradeIban = (id: IDModel) => {
        const req = store.$nuxt.$apiMulti.managedAccounts.assignIban(id)

        req.then((res) => {
            setIban(res.data)
        })

        return req
    }

    return {
        accountState,
        totalAvailableBalance,
        filteredStatement,
        setAccounts,
        setAccount,
        resetStatements,
        setStatements,
        resetState,
        setIban,
        index,
        create,
        get,
        getStatements,
        getIBANDetails,
        upgradeIban,
    }
})

export type useAccountsStore = ReturnType<typeof useAccountsStore>

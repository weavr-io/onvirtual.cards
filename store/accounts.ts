import { DateTime } from 'luxon'
import { defineStore } from 'pinia'
import { TransactionTypeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/enums/TransactionTypeEnum'
import type { Accounts as AccountState } from '~/local/models/store/accounts'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common/models/IDModel'
import type { ManagedAccountIBANModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountIBANModel'
import type { ManagedAccountModel } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/models/ManagedAccountModel'
import type { CreateManagedAccountRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/CreateManagedAccountRequest'
import type { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import type { GetManagedAccountsRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountsRequest'
import type { PaginatedManagedAccountsResponse } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/responses/PaginatedManagedAccountsResponse'
import type { StatementEntryModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/models/StatementEntryModel'
import type { StatementResponseModel } from '~/plugins/weavr-multi/api/models/managed-instruments/statements/responses/StatementResponseModel'
import { TransactionStateTypeEnum } from '~/plugins/weavr-multi/api/models/transfers/enums/TransactionStateTypeEnum'

const initState = (): AccountState => {
    return {
        accounts: null,
        account: null,
        statements: null,
        ibanDetails: null,
    }
}

export const useAccountsStore = defineStore('accounts', () => {
    const { $apiMulti } = useNuxtApp()
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
        const req = $apiMulti.managedAccounts.index(filters)

        req.then((res) => {
            setAccounts(res.data)
            if (res.data.count && res.data.accounts) {
                setAccount(res.data.accounts[0])
            }
        })

        return req
    }

    const create = (request: CreateManagedAccountRequest) => {
        const req = $apiMulti.managedAccounts.store(request)

        return req
    }

    const get = (id: string) => {
        const req = $apiMulti.managedAccounts.show(id)

        req.then((res) => {
            setAccount(res.data)
        })

        return req
    }

    const getStatements = (request: { id: string; filters: GetManagedAccountStatementRequest }) => {
        const req = $apiMulti.managedAccounts.statement(request)

        req.then((res) => {
            setStatements(res.data)
        })

        return req
    }

    const getIBANDetails = (id: IDModel) => {
        const req = $apiMulti.managedAccounts.retrieveIban(id)

        req.then((res) => {
            setIban(res.data)
        })

        return req
    }

    const upgradeIban = (id: IDModel) => {
        const req = $apiMulti.managedAccounts.assignIban(id)

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

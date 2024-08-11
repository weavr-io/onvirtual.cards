import { useCsv } from '~/composables/useCsv'
import { ManagedAccountsApi } from '~/plugins/weavr-multi/api/ManagedAccountsApi'
import { useAccountsStore } from '~/store/accounts'
import type { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import type { IDModel } from '~/plugins/weavr-multi/api/models/common'

export const useAccounts = () => {
    const route = useRoute()
    const router = useRouter()
    const accountsStore = useAccountsStore()
    const { downloadBlobToCsv } = useCsv()
    const { downloadStatement } = new ManagedAccountsApi()

    const isManagedAccounts = computed(() => {
        if (route.matched[0].name) {
            return ['managed-accounts', 'managed-accounts-id'].includes(
                route.matched[0].name as string,
            )
        }
        return false
    })

    const accountBalance = computed(() => {
        return accountsStore.totalAvailableBalance
    })

    const account = computed(() => {
        return accountsStore.accountState.account
    })

    const accounts = computed(() => {
        return accountsStore.accountState.accounts
    })

    const hasAccount = computed(() => {
        return accountsStore.accountState.accounts?.accounts
            ? accountsStore.accountState.accounts.accounts.length
            : false
    })

    const accountId = computed(() => {
        if (hasAccount.value) return account.value?.id
        return undefined
    })

    const goToManagedAccountIndex = () => {
        return router.push('/managed-accounts')
    }

    const downloadAsCSV = async (params: {
        id: IDModel
        filters: GetManagedAccountStatementRequest
    }) => {
        const response = await downloadStatement(params)
        downloadBlobToCsv(response)
    }

    return {
        isManagedAccounts,
        accountBalance,
        account,
        accounts,
        hasAccount,
        accountId,
        goToManagedAccountIndex,
        downloadAsCSV,
    }
}

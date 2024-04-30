import { computed, useRoute, useRouter } from '@nuxtjs/composition-api'
import { useCsv } from '~/composables/useCsv'
import { ManagedAccountsApi } from '~/plugins/weavr-multi/api/ManagedAccountsApi'
import { useAccountsStore } from '~/store/accounts'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'

export const useAccounts = () => {
    const route = useRoute()
    const router = useRouter()
    const accountsStore = useAccountsStore()
    const { downloadBlobToCsv } = useCsv()
    const { downloadStatement } = new ManagedAccountsApi()

    const isManagedAccounts = computed(() => {
        if (route.value.matched[0].name) {
            return ['managed-accounts', 'managed-accounts-id'].includes(route.value.matched[0].name)
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
        return accountsStore.accountState.accounts?.accounts !== undefined
            ? accountsStore.accountState.accounts.accounts.length > 0
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

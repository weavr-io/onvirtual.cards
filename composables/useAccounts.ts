import { computed } from 'vue'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { useCsv } from '~/composables/useCsv'
import { useBase } from '~/composables/useBase'

export function useAccounts() {
  const { downloadBlobToCsv } = useCsv()
  const { stores, router } = useBase()

  const accountsBalance = computed<boolean>(() => {
    if (router.matched[0].name) {
      return ['managed-accounts', 'managed-accounts-id'].includes(router.matched[0].name)
    } else {
      return false
    }
  })

  const account = computed(() => {
    return stores.value.accounts.account
  })

  const hasAccount = computed(() => {
    return stores.value.accounts.accounts?.accounts !== undefined
      ? stores.value.accounts.accounts.accounts.length > 0
      : false
  })

  const accountId = computed<IDModel | undefined>(() => {
    if (hasAccount.value) {
      return account.value?.id!
    } else return undefined
  })

  function goToManagedAccountIndex() {
    return router.push('/managed-accounts')
  }

  function downloadAsCSV(params: { id: IDModel; filters: GetManagedAccountStatementRequest }) {
    const req = this.$apiMulti.managedAccounts.downloadStatement(params)

    req.then((res) => {
      downloadBlobToCsv(res.data)
    })
  }

  return { account, accountsBalance, accountId, hasAccount, goToManagedAccountIndex, downloadAsCSV }
}

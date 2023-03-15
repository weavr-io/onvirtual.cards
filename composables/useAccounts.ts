import { computed, reactive } from 'vue'
import { IDModel } from '~/plugins/weavr-multi/api/models/common/IDModel'
import { GetManagedAccountStatementRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-account/requests/GetManagedAccountStatementRequest'
import { useCsv } from '~/composables/useCsv'
import { useBase } from '~/composables/useBase'

export function useAccounts(root) {
  const { downloadBlobToCsv } = useCsv()
  const { stores } = useBase(root)

  const isManagedAccounts = computed<boolean>(() => {
    if (root.$route.matched[0].name) {
      return ['managed-accounts', 'managed-accounts-id'].includes(root.$route.matched[0].name)
    } else {
      return false
    }
  })

  const account = computed(() => {
    return stores.accounts.account
  })

  const hasAccount = computed(() => {
    return stores.accounts.accounts?.accounts !== undefined ? stores.accounts.accounts.accounts.length > 0 : false
  })

  const accountId = computed<IDModel | undefined>(() => {
    if (hasAccount.value) {
      return account.value?.id!
    } else return undefined
  })

  function goToManagedAccountIndex() {
    return root.$router.push('/managed-accounts')
  }

  function downloadAsCSV(params: { id: IDModel; filters: GetManagedAccountStatementRequest }) {
    const req = root.$apiMulti.managedAccounts.downloadStatement(params)

    req.then((res) => {
      downloadBlobToCsv(res.data)
    })
  }

  const unRefs = reactive({ isManagedAccounts, account, hasAccount, accountId })

  return { isManagedAccounts, account, accountId, hasAccount, goToManagedAccountIndex, downloadAsCSV, unRefs }
}

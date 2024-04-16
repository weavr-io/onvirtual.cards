import { useAccessCodesStore } from '~/store/accessCodes'
import { useAccountsStore } from '~/store/accounts'
import type { useUsersStore } from '~/store/users'

export interface StoreType {
    users: useUsersStore
    accessCodes: useAccessCodesStore
    accounts: useAccountsStore
}

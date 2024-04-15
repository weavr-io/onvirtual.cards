import { useAccountsStore } from '~/store/accounts'
import type { useUsersStore } from '~/store/users'

export interface StoreType {
    users: useUsersStore
    accounts: useAccountsStore
}

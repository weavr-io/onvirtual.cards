import { useAccessCodesStore } from '~/store/accessCodes'
import { useAccountsStore } from '~/store/accounts'
import { useLoaderStore } from '~/store/loader'
import type { useUsersStore } from '~/store/users'

export interface StoreType {
    users: useUsersStore
    accessCodes: useAccessCodesStore
    accounts: useAccountsStore
    loader: useLoaderStore
}

import { useAccessCodesStore } from '~/store/accessCodes'
import type { useUsersStore } from '~/store/users'

export interface StoreType {
    users: useUsersStore
    accessCodes: useAccessCodesStore
}

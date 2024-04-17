import { useAccessCodesStore } from '~/store/accessCodes'
import { useAccountsStore } from '~/store/accounts'
import { useLoaderStore } from '~/store/loader'
import type { useUsersStore } from '~/store/users'
import { useCardsStore } from '~/store/cards'

export interface StoreType {
    users: useUsersStore
    accessCodes: useAccessCodesStore
    accounts: useAccountsStore
    cards: useCardsStore
    loader: useLoaderStore
}

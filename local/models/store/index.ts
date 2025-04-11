import type { StoreDefinition } from 'pinia'
import type { useCardsStore } from '~/store/cards'
import type { useAccountsStore } from '~/store/accounts'
import type { useAccessCodesStore } from '~/store/accessCodes'
import type { useAuthStore } from '~/store/auth'
import type { useCorporatesStore } from '~/store/corporates'
import type { useConsumersStore } from '~/store/consumers'
import type { useErrorsStore } from '~/store/errors'
import type { useIdentityStore } from '~/store/identity'
import type { useSecureClientStore } from '~/store/secureClient'
import type { useLoaderStore } from '~/store/loader'
import type { useTransfersStore } from '~/store/transfers'
import type { useUsersStore } from '~/store/users'

export interface StoreType {
    cards: useCardsStore
    accounts: useAccountsStore
    auth: useAuthStore
    accessCodes: useAccessCodesStore
    consumers: useConsumersStore
    corporates: useCorporatesStore
    errors: useErrorsStore
    identity: useIdentityStore
    loader: useLoaderStore
    secureClient: useSecureClientStore
    transfers: useTransfersStore
    users: useUsersStore
}

export type StoreModule = {
    [exportName: string]: () => StoreDefinition
}

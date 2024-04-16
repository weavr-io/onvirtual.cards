import type { useUsersStore } from '~/store/users'
import { useCardsStore } from '~/store/piniaCards'

export interface StoreType {
    users: useUsersStore
    cards: useCardsStore
}

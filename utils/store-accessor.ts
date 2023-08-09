import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Cards from '~/store/cards'
import Accounts from '~/store/accounts'
import Corporates from '~/store/corporates'
import Loader from '~/store/loader'
import Auth from '~/store/auth'
import Consumers from '~/store/consumers'
import Identities from '~/store/identity'
import Transfers from '~/store/transfers'
import Errors from '~/store/errors'
import Users from '~/store/users'
import AccessCodes from '~/store/accessCodes'

export interface Stores {
    cards: Cards
    accounts: Accounts
    corporates: Corporates
    loader: Loader
    auth: Auth
    consumers: Consumers
    identities: Identities
    transfers: Transfers
    errors: Errors
    users: Users
    accessCodes: AccessCodes
}

function initialiseStores(store: Store<any>): Stores {
    return {
        cards: cardsStore(store),
        accounts: accountsStore(store),
        corporates: corporatesStore(store),
        loader: loaderStore(store),
        auth: authStore(store),
        consumers: consumersStore(store),
        transfers: transfersStore(store),
        errors: errorsStore(store),
        users: usersStore(store),
        identities: identitiesStore(store),
        accessCodes: accessCodesStore(store),
    }
}

function transfersStore(store: Store<any>) {
    return getModule(Transfers, store)
}

function usersStore(store: Store<any>) {
    return getModule(Users, store)
}

function consumersStore(store: Store<any>) {
    return getModule(Consumers, store)
}

function cardsStore(store: Store<any>) {
    return getModule(Cards, store)
}

function authStore(store: Store<any>) {
    return getModule(Auth, store)
}

function accountsStore(store: Store<any>) {
    return getModule(Accounts, store)
}

function corporatesStore(store: Store<any>) {
    return getModule(Corporates, store)
}

function identitiesStore(store: Store<any>) {
    return getModule(Identities, store)
}

function loaderStore(store: Store<any>) {
    return getModule(Loader, store)
}

function errorsStore(store: Store<any>) {
    return getModule(Errors, store)
}

function accessCodesStore(store: Store<any>) {
    return getModule(AccessCodes, store)
}

export {
    initialiseStores,
    cardsStore,
    accountsStore,
    corporatesStore,
    loaderStore,
    authStore,
    consumersStore,
    transfersStore,
    errorsStore,
    usersStore,
    identitiesStore,
    accessCodesStore,
}

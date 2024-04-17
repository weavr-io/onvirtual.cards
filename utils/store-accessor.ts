import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Corporates from '~/store/corporates'
import Auth from '~/store/auth'
import Consumers from '~/store/consumers'
import Identities from '~/store/identity'
import Transfers from '~/store/transfers'
import Errors from '~/store/errors'

export interface Stores {
    corporates: Corporates
    auth: Auth
    consumers: Consumers
    identities: Identities
    transfers: Transfers
    errors: Errors
}

function initialiseStores(store: Store<any>): Stores {
    return {
        corporates: corporatesStore(store),
        auth: authStore(store),
        consumers: consumersStore(store),
        transfers: transfersStore(store),
        errors: errorsStore(store),
        identities: identitiesStore(store),
    }
}

function transfersStore(store: Store<any>) {
    return getModule(Transfers, store)
}

function consumersStore(store: Store<any>) {
    return getModule(Consumers, store)
}

function authStore(store: Store<any>) {
    return getModule(Auth, store)
}

function corporatesStore(store: Store<any>) {
    return getModule(Corporates, store)
}

function identitiesStore(store: Store<any>) {
    return getModule(Identities, store)
}

function errorsStore(store: Store<any>) {
    return getModule(Errors, store)
}

export {
    initialiseStores,
    corporatesStore,
    authStore,
    consumersStore,
    transfersStore,
    errorsStore,
    identitiesStore,
}

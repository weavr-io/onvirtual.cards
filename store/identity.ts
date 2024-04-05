import { defineStore } from 'pinia'
import { reactive } from 'vue'
import { useCorporatesStore } from '~/store/corporates'
import { useConsumersStore } from '~/store/consumers'
import { useAuthStore } from '~/store/auth'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import type { Identity as IdentityState } from '~/local/models/store/identity'

const initState = (): IdentityState => {
    return {
        identity: null,
        emailVerified: false,
        mobileNumberVerified: false,
    }
}

export const useIdentityStore = defineStore('identity', () => {
    const identityState: IdentityState = reactive(initState())
    const corporates = useCorporatesStore()
    const consumers = useConsumersStore()
    const auth = useAuthStore()

    const setIdentity = (identity: ConsumerModel | CorporateModel | null) => {
        identityState.identity = identity
        identityState.emailVerified = identity?.rootUser?.emailVerified ?? false
        identityState.mobileNumberVerified = identity?.rootUser?.mobileNumberVerified ?? false
    }

    const setEmailVerified = (verified: boolean) => {
        identityState.emailVerified = verified
    }

    const setMobileVerified = (verified: boolean) => {
        identityState.mobileNumberVerified = verified
    }

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            identityState[key] = data[key]
        })
    }

    const getIdentity = () => {
        if (auth.isConsumer) {
            return consumers.get()
        } else if (auth.isCorporate) {
            return corporates.get()
        }
    }

    return {
        setIdentity,
        setEmailVerified,
        setMobileVerified,
        resetState,
        getIdentity,
    }
})

export type useIdentityStore = ReturnType<typeof useIdentityStore>

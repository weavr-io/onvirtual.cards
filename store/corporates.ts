import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import type { Corporates as CorporateState } from '~/local/models/store/corporates'
import type { CorporateModel } from '~/plugins/weavr-multi/api/models/identities/corporates/models/CorporateModel'
import type { GetCorporateKYBResponse } from '~/plugins/weavr-multi/api/models/identities/corporates/responses/GetCorporateKYBResponse'
import type { CreateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/CreateCorporateRequest'
import type { UpdateCorporateRequest } from '~/plugins/weavr-multi/api/models/identities/corporates/requests/UpdateCorporateRequest'
import type { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import type { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'
import { KYBStatusEnum } from '~/plugins/weavr-multi/api/models/identities/corporates/enums/KYBStatusEnum'
import { PUK_COUNTRY_CODES } from '~/utils/jurisdiction'
import { useIdentityStore } from '~/store/identity'
import { useAuthStore } from '~/store/auth'

const initState = (): CorporateState => {
    return {
        isLoading: false,
        isLoadingRegistration: false,
        corporate: null,
        kyb: null,
    }
}

export const useCorporatesStore = defineStore('corporates', () => {
    const store = useAuthStore()

    const identity = useIdentityStore()
    const corporateState: CorporateState = reactive(initState())

    const regCountry = computed(() => corporateState.corporate?.company.countryOfRegistration ?? '')
    const isUk = computed(() => PUK_COUNTRY_CODES.includes(regCountry.value))

    const setIsLoading = (_isLoading: boolean) => {
        corporateState.isLoading = _isLoading
    }

    const setIsLoadingRegistration = (_isLoadingRegistration: boolean) => {
        corporateState.isLoadingRegistration = _isLoadingRegistration
    }

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            corporateState[key] = data[key]
        })
    }

    const setCorporate = (corporate: CorporateModel) => {
        corporateState.corporate = corporate
    }

    const setKyb = (kyb: GetCorporateKYBResponse) => {
        corporateState.kyb = kyb
    }

    const create = (request: CreateCorporateRequest) => {
        setIsLoading(true)

        const req = store.$nuxt.$apiMulti.corporates.store(request)

        req.then((res) => {
            identity.setIdentity(res.data)
            setCorporate(res.data)
            setIsLoading(false)
        })
        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const update = (request: UpdateCorporateRequest) => {
        const req = store.$nuxt.$apiMulti.corporates.update(request)
        req.then((_res) => {
            setCorporate(_res.data)
            identity.setIdentity(_res.data)
        })

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const get = () => {
        setIsLoading(true)
        const req = store.$nuxt.$apiMulti.corporates.show()

        req.then((res) => {
            setCorporate(res.data)
            identity.setIdentity(res.data)
        })
        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const getKyb = () => {
        const req = store.$nuxt.$apiMulti.corporates.getCorporateKYB()
        req.then((res) => {
            setKyb(res.data)
        })

        return req
    }

    const verifyEmail = (request: VerifyEmailRequest) => {
        return store.$nuxt.$apiMulti.corporates.verifyEmail(request)
    }

    const sendVerificationCodeEmail = (request: SendVerificationCodeRequest) => {
        return store.$nuxt.$apiMulti.corporates.sendVerificationCode(request)
    }

    const checkKYB = async () => {
        if (!corporateState.corporate) {
            await get()
        }

        if (!corporateState.kyb) {
            await getKyb()
        }

        if (corporateState.kyb?.kybStatus !== KYBStatusEnum.APPROVED) {
            return Promise.reject(new Error('KYB not approved'))
        }

        return Promise.resolve()
    }

    const startKYB = () => {
        return store.$nuxt.$apiMulti.corporates.startKYB()
    }

    return {
        corporateState,
        regCountry,
        isUk,
        setIsLoading,
        setIsLoadingRegistration,
        resetState,
        setCorporate,
        setKyb,
        create,
        update,
        get,
        getKyb,
        verifyEmail,
        sendVerificationCodeEmail,
        checkKYB,
        startKYB,
    }
})

export type useCorporatesStore = ReturnType<typeof useCorporatesStore>

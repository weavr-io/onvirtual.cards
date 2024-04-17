import { defineStore } from 'pinia'
import { computed, getCurrentInstance, reactive } from 'vue'
import type { Consumers as ConsumerState } from '~/local/models/store/consumers'
import type { SendVerificationCodeRequest } from '~/plugins/weavr-multi/api/models/common/models/SendVerificationCodeRequest'
import type { VerifyEmailRequest } from '~/plugins/weavr-multi/api/models/common/models/VerifyEmailRequest'
import { KYCStatusEnum } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/KYCStatusEnum'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import type { CreateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/CreateConsumerRequest'
import type { UpdateConsumerRequest } from '~/plugins/weavr-multi/api/models/identities/consumers/requests/UpdateConsumerRequest'
import type { GetConsumerKYCResponse } from '~/plugins/weavr-multi/api/models/identities/consumers/responses/GetConsumerKYCResponse'
import { useIdentityStore } from '~/store/identity'
import { useLoaderStore } from '~/store/loader'
import { PUK_COUNTRY_CODES } from '~/utils/jurisdiction'

const initState = (): ConsumerState => {
    return {
        isLoading: false,
        isLoadingRegistration: false,
        consumer: null,
        kyc: null,
    }
}

export const useConsumersStore = defineStore('consumers', () => {
    const { proxy: root } = getCurrentInstance() || {}
    const loader = useLoaderStore()
    const identity = useIdentityStore()
    const consumerState: ConsumerState = reactive(initState())

    const regCountry = computed(() => consumerState.consumer?.rootUser.address?.country ?? '')
    const isUk = computed(() => PUK_COUNTRY_CODES.includes(regCountry.value))

    const setIsLoading = (isLoading: boolean) => {
        consumerState.isLoading = isLoading
    }

    const setIsLoadingRegistration = (isLoadingRegistration: boolean) => {
        consumerState.isLoadingRegistration = isLoadingRegistration
    }

    const setConsumer = (consumer: ConsumerModel) => {
        consumerState.consumer = consumer
    }

    const setKyc = (_kyc: GetConsumerKYCResponse) => {
        consumerState.kyc = _kyc
    }

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            consumerState[key] = data[key]
        })
    }

    const create = (request: CreateConsumerRequest) => {
        loader.start()

        const req = root!.$apiMulti.consumers.store(request)

        req.then((_res) => {
            setConsumer(_res.data)
            identity.setIdentity(_res.data)
        })

        req.finally(() => {
            loader.stop()
            setIsLoading(false)
        })

        return req
    }

    const update = (request: UpdateConsumerRequest) => {
        const req = root!.$apiMulti.consumers.update(request)
        req.then((_res) => {
            setConsumer(_res.data)
            identity.setIdentity(_res.data)
        })

        req.finally(() => {
            setIsLoading(false)
        })

        return req
    }

    const get = () => {
        loader.start()
        setIsLoading(true)

        const req = root!.$apiMulti.consumers.show()

        req.then((_res) => {
            setConsumer(_res.data)
            identity.setIdentity(_res.data)
        }).finally(() => {
            loader.stop()
            setIsLoading(false)
        })

        return req
    }

    const getKYC = () => {
        const req = root!.$apiMulti.consumers.showKYC()
        req.then((res) => {
            setKyc(res.data)
        })

        return req
    }

    const checkKYC = async () => {
        if (!consumerState.consumer) {
            await get()
        }

        if (!consumerState.kyc) {
            await getKYC()
        }

        if (consumerState.kyc?.fullDueDiligence !== KYCStatusEnum.APPROVED) {
            return Promise.reject(new Error('KYC not approved'))
        }

        return Promise.resolve()
    }

    const verifyEmail = (request: VerifyEmailRequest) => {
        return root!.$apiMulti.consumers.verifyEmail(request)
    }

    const sendVerificationCodeEmail = (request: SendVerificationCodeRequest) => {
        return root!.$apiMulti.consumers.sendVerificationCode(request)
    }

    const startKYC = () => {
        const _res = root!.$apiMulti.consumers.startKYC()

        return _res
    }

    return {
        consumerState,
        regCountry,
        isUk,
        setIsLoading,
        setIsLoadingRegistration,
        setConsumer,
        setKyc,
        resetState,
        create,
        update,
        get,
        getKYC,
        checkKYC,
        verifyEmail,
        sendVerificationCodeEmail,
        startKYC,
    }
})

export type useConsumersStore = ReturnType<typeof useConsumersStore>

<template>
    <b-col lg="6" md="9">
        <div class="mb-5">
            <LogoOvc classes="mb-5" />
            <b-card class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-3 py-5 p-sm-card">
                    <div class="form-screens">
                        <transition mode="out-in" name="fade">
                            <div v-if="screen === 0" key="1" class="form-screen">
                                <RegisterForm @submit-form="form1Submit" />
                            </div>
                            <div v-else key="2" class="form-screen">
                                <PersonalDetailsForm
                                    :base-form="registrationRequest"
                                    @submit="form2Submit"
                                    @strength-check="strengthCheck"
                                    @go-back="goBack"
                                />
                            </div>
                        </transition>
                    </div>
                </b-card-body>
            </b-card>
        </div>
    </b-col>
</template>

<script lang="ts" setup>
import type { AxiosResponse } from 'axios'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import type {
    CreatePasswordRequestModel,
    LoginWithPassword,
} from '~/plugins/weavr-multi/api/models/authentication'
import { CurrencyEnum, type IDModel } from '~/plugins/weavr-multi/api/models/common'
import type { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import {
    type CreateCorporateRequest,
    INITIAL_CREATE_CORPORATE_REQUEST,
} from '~/plugins/weavr-multi/api/models/identities/corporates'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import PersonalDetailsForm from '~/components/organisms/registration/PersonalDetails.vue'
import RegisterForm from '~/components/organisms/registration/RegisterForm.vue'

definePageMeta({
    layout: 'auth',
    middleware: 'access-code-verified',
})

const router = useRouter()
const { $apiMulti } = useNuxtApp()
const { setSCAStorage, showErrorToast } = useBase()
const { accessCodes, auth, corporates } = useStores(['accessCodes', 'auth', 'corporates'])

const screen = ref(0)
const passwordStrength = ref(0)
let registrationRequest: CreateCorporateRequest & {
    password?: string
} = reactive({
    ...INITIAL_CREATE_CORPORATE_REQUEST(),
    profileId: useRuntimeConfig().public.profileId.corporates,
    acceptedTerms: false,
    baseCurrency: CurrencyEnum.EUR,
    password: undefined,
})

const strengthCheck = (val) => {
    passwordStrength.value = val.id
}

const goBack = () => {
    screen.value--
}

useAsyncData(async () => {
    const isLoggedIn = auth?.isLoggedIn
    if (isLoggedIn) {
        await router.replace('/dashboard')
    }
})

useAsyncData(async () => {
    await $apiMulti.ipify.get().then((ip) => {
        registrationRequest.ipAddress = ip.data.ip
    })
})

const form1Submit = (_data: { email: string; password: string; acceptedTerms: boolean }) => {
    registrationRequest.rootUser.email = _data.email
    registrationRequest.password = _data.password
    registrationRequest.acceptedTerms = _data.acceptedTerms
    screen.value = 1
    stopRegistrationLoading()
}

const form2Submit = (_data) => {
    registrationRequest = { ..._data }
    doRegister()
}

const doRegister = () => {
    corporates?.setIsLoadingRegistration(true)
    corporates?.create(registrationRequest).then(onCorporateCreated).catch(registrationFailed)
}

const stopRegistrationLoading = () => {
    corporates?.setIsLoadingRegistration(false)
}

const onCorporateCreated = (res: AxiosResponse<ConsumerModel>) => {
    createPassword(res.data.rootUser.id.id!)
}

const createPassword = (rootUserId: IDModel) => {
    const passwordRequest: CreatePasswordRequestModel = {
        password: {
            value: registrationRequest.password as string,
        },
    }
    $apiMulti.passwords
        .store({
            userId: rootUserId,
            data: passwordRequest,
        })
        .then(onRegisteredSuccessfully.bind(this))
        .catch(stopRegistrationLoading)
}

const onRegisteredSuccessfully = () => {
    accessCodes?.deleteAccessCode()
    if (!registrationRequest.rootUser) {
        return
    }
    const loginRequest: LoginWithPassword = {
        email: registrationRequest.rootUser.email as string,
        password: {
            value: registrationRequest.password as string,
        },
    }
    const _req = auth?.loginWithPassword(loginRequest)
    _req?.then(() => {
        setSCAStorage()
        stopRegistrationLoading()
        router.push({ path: '/profile/address' })
    })
}

const registrationFailed = (err) => {
    stopRegistrationLoading()
    const _errCode = err.response.data.errorCode
    if (_errCode === 'ROOT_USERNAME_NOT_UNIQUE' || _errCode === 'ROOT_EMAIL_NOT_UNIQUE') {
        screen.value = 0
    } else {
        showErrorToast(_errCode)
    }
}
</script>

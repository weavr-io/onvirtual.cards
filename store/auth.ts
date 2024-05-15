import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
import { $axiosMulti } from '~/utils/api'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import type { Auth as AuthState } from '~/local/models/store/auth'
import type { LoginWithPasswordResponse } from '~/plugins/weavr-multi/api/models/authentication/access/responses/LoginWithPasswordResponse'
import type { LoginWithPassword } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPassword'
import type { UpdatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/UpdatePasswordRequestModel'
import type { CreatePasswordResponseModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/responses/CreatePasswordResponseModel'
import type { GetAuthenticationFactorsResponse } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/responses/GetAuthenticationFactorsResponse'
import type { AuthVerifyEnrol } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/requests/AuthVerifyEnrolRequest'
import type { InitiateLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/InitiateLostPasswordRequestModel'
import type { ResumeLostPassword } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ResumeLostPassword'
import type { ValidatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ValidatePasswordRequestModel'
import { SCAOtpChannelEnum } from '~/plugins/weavr-multi/api/models/authentication/additional-factors/enums/SCAOtpChannelEnum'
import { IdentityTypeEnum } from '~/plugins/weavr-multi/api/models/common/enums/IdentityTypeEnum'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

const initState = (): AuthState => {
    return {
        auth: null,
        authFactors: null,
        isLoading: false,
    }
}

export const useAuthStore = defineStore('auth', () => {
    const store = useAuthStore()

    const authState: AuthState = reactive(initState())

    const isLoggedIn = computed(() => authState.auth && authState.auth.token)
    const token = computed(() => authState.auth?.token)
    const hasAuthToken = computed(() => !!authState.auth && !!authState.auth.token)
    const identityId = computed(() =>
        authState.auth?.identity ? authState.auth.identity.id : null,
    )

    const isConsumer = computed(() => authState.auth?.identity.type === IdentityTypeEnum.CONSUMER)
    const isCorporate = computed(() => authState.auth?.identity.type === IdentityTypeEnum.CORPORATE)
    const identity = computed(() => authState.auth?.identity)

    const setAuth = async (auth: LoginWithPasswordResponse | null) => {
        authState.auth = auth
        await Cookie.set(config.ONV_COOKIE_NAME, JSON.stringify(authState.auth))
        $axiosMulti.defaults.headers.Authorization = 'Bearer ' + authState.auth?.token
    }

    const setToken = (res: CreatePasswordResponseModel) => {
        authState.auth!.token = res.token!
        Cookie.set(config.ONV_COOKIE_NAME, JSON.stringify(authState.auth))
        $axiosMulti.defaults.headers.Authorization = 'Bearer ' + authState.auth?.token
    }

    const setAuthFactors = (res: GetAuthenticationFactorsResponse) => {
        authState.authFactors = res
    }

    const removeAuth = (auth: null) => {
        authState.auth = auth
        Cookie.remove(config.ONV_COOKIE_NAME)
        delete $axiosMulti.defaults.headers.Authorization
    }

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            authState[key] = data[key]
        })
    }

    const loginWithPassword = (request: LoginWithPassword) => {
        const _req = store.$nuxt.$apiMulti.authentication.loginWithPassword(request)

        _req.then((res) => {
            store.$nuxt.$weavrSetUserToken('Bearer ' + res.data.token)
            setAuth(res.data)
        })

        return _req
    }

    const resetTokenAndStates = () => {
        store.$nuxt.$weavrSetUserToken(null)
        removeAuth(null)
        resetState()
        // TODO: refactor this if list gets too long
        initialiseStores(
            ['corporates', 'consumers', 'accounts', 'cards', 'identity', 'transfers', 'users'],
            true,
        )
    }

    const logout = () => {
        const _req = store.$nuxt.$apiMulti.authentication.logout()

        _req.finally(() => {
            resetTokenAndStates()
        })

        return _req
    }

    const updatePassword = (request: UpdatePasswordRequestModel) => {
        const _req = store.$nuxt.$apiMulti.passwords.update(request)

        _req.then((res) => {
            setToken(res.data)
        })

        return _req
    }

    const indexAuthFactors = () => {
        const _req = store.$nuxt.$apiMulti.additionalFactors.index()

        _req.then((res) => {
            setAuthFactors(res.data)
        })

        return _req
    }

    const enrollAuthFactors = (channel: SCAOtpChannelEnum) => {
        const _req = store.$nuxt.$apiMulti.additionalFactors.enroll(channel)

        return _req
    }

    const enrollStepUp = (channel: SCAOtpChannelEnum) => {
        const _req = store.$nuxt.$apiMulti.stepUp.enroll(channel)

        return _req
    }

    const verifyAuthFactors = (request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrol }) => {
        const _req = store.$nuxt.$apiMulti.additionalFactors.verify(request)

        return _req
    }

    const verifyStepUp = (request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrol }) => {
        const _req = store.$nuxt.$apiMulti.stepUp.verify(request)

        return _req
    }

    const lostPasswordInitiate = (request: InitiateLostPasswordRequestModel) => {
        const _req = store.$nuxt.$apiMulti.passwords.initiate(request)

        return _req
    }

    const lostPasswordResume = (request: ResumeLostPassword) => {
        const _req = store.$nuxt.$apiMulti.passwords.resume(request)

        return _req
    }

    const validatePassword = (request: ValidatePasswordRequestModel) => {
        const _req = store.$nuxt.$apiMulti.passwords.validate(request)

        return _req
    }

    return {
        authState,
        isLoggedIn,
        token,
        hasAuthToken,
        identityId,
        isConsumer,
        isCorporate,
        identity,
        setAuth,
        setToken,
        setAuthFactors,
        removeAuth,
        resetState,
        loginWithPassword,
        resetTokenAndStates,
        logout,
        updatePassword,
        indexAuthFactors,
        enrollAuthFactors,
        enrollStepUp,
        verifyAuthFactors,
        verifyStepUp,
        lostPasswordInitiate,
        lostPasswordResume,
        validatePassword,
    }
})

export type useAuthStore = ReturnType<typeof useAuthStore>

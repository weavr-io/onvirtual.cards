import { defineStore } from 'pinia'
import { $axiosMulti } from '~/utils/api'
import { useStores } from '~/composables/useStores'
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

const initState = (): AuthState => {
    return {
        auth: null,
        authFactors: null,
        isLoading: false,
    }
}

export const useAuthStore = defineStore('auth', () => {
    const nuxtApp = computed(() => useNuxtApp())
    const apiMulti = computed(() => nuxtApp.value.$apiMulti)
    const weavrSetUserToken = computed(() => nuxtApp.value.$weavrSetUserToken)

    const authState: AuthState = reactive(initState())
    const onvCookie = useCookie(config.ONV_COOKIE_NAME)
    const isLoggedIn = computed(() => authState.auth && authState.auth.token)
    const token = computed(() => authState.auth?.token)
    const hasAuthToken = computed(() => !!authState.auth && !!authState.auth.token)
    const identityId = computed(() =>
        authState.auth?.identity ? authState.auth.identity.id : null,
    )

    const isConsumer = computed(() => authState.auth?.identity.type === IdentityTypeEnum.CONSUMER)
    const isCorporate = computed(() => authState.auth?.identity.type === IdentityTypeEnum.CORPORATE)
    const identity = computed(() => authState.auth?.identity)

    const setAuth = (auth: LoginWithPasswordResponse | null) => {
        authState.auth = auth
        onvCookie.value = JSON.stringify(authState.auth)
        $axiosMulti.defaults.headers.Authorization = 'Bearer ' + authState.auth?.token
    }

    const setToken = (res: CreatePasswordResponseModel) => {
        authState.auth!.token = res.token!
        onvCookie.value = JSON.stringify(authState.auth)
        $axiosMulti.defaults.headers.Authorization = 'Bearer ' + authState.auth?.token
    }

    const setAuthFactors = (res: GetAuthenticationFactorsResponse) => {
        authState.authFactors = res
    }

    const removeAuth = (auth: null) => {
        authState.auth = auth
        onvCookie.value = undefined
        delete $axiosMulti.defaults.headers.Authorization
    }

    const resetState = () => {
        const data = initState()
        Object.keys(data).forEach((key) => {
            authState[key] = data[key]
        })
    }

    const loginWithPassword = (request: LoginWithPassword) => {
        const _req = apiMulti.value.authentication.loginWithPassword(request)

        _req.then((res) => {
            weavrSetUserToken.value('Bearer ' + res.data.token)
            setAuth(res.data)
        })

        return _req
    }

    const resetTokenAndStates = () => {
        weavrSetUserToken.value(null)
        removeAuth(null)
        resetState()
        useStores(
            ['corporates', 'consumers', 'accounts', 'cards', 'identity', 'transfers', 'users'],
            true,
        )
    }

    const logout = () => {
        const _req = apiMulti.value.authentication.logout()

        _req.finally(() => {
            resetTokenAndStates()
        })

        return _req
    }

    const updatePassword = (request: UpdatePasswordRequestModel) => {
        const _req = apiMulti.value.passwords.update(request)

        _req.then((res) => {
            setToken(res.data)
        })

        return _req
    }

    const indexAuthFactors = () => {
        const _req = apiMulti.value.additionalFactors.index()

        _req.then((res) => {
            setAuthFactors(res.data)
        })

        return _req
    }

    const enrollAuthFactors = (channel: SCAOtpChannelEnum) => {
        const _req = apiMulti.value.additionalFactors.enroll(channel)

        return _req
    }

    const enrollStepUp = (channel: SCAOtpChannelEnum) => {
        const _req = apiMulti.value.stepUp.enroll(channel)

        return _req
    }

    const verifyAuthFactors = (request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrol }) => {
        const _req = apiMulti.value.additionalFactors.verify(request)

        return _req
    }

    const verifyStepUp = (request: { channel: SCAOtpChannelEnum; body: AuthVerifyEnrol }) => {
        const _req = apiMulti.value.stepUp.verify(request)

        return _req
    }

    const lostPasswordInitiate = (request: InitiateLostPasswordRequestModel) => {
        const _req = apiMulti.value.passwords.initiate(request)

        return _req
    }

    const lostPasswordResume = (request: ResumeLostPassword) => {
        const _req = apiMulti.value.passwords.resume(request)

        return _req
    }

    const validatePassword = (request: ValidatePasswordRequestModel) => {
        const _req = apiMulti.value.passwords.validate(request)

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

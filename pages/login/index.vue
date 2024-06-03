<template>
    <b-col lg="6" md="9">
        <LogoOvc classes="mb-5" />
        <div class="mb-3">
            <b-card body-class="px-4 mx-2 py-5 p-md-card">
                <h3 class="text-center font-weight-light mb-5">Login</h3>

                <form id="contact-form" class="mt-5" @submit.prevent="login">
                    <error-alert
                        message="Incorrect email and password combination. If you do not have an account please click on Register."
                    />
                    <b-form-group
                        id="login-email"
                        :invalid-feedback="validation.getInvalidFeedback('email')"
                        :state="validation.getState('email')"
                        label="Email"
                        label-for="form-email"
                    >
                        <b-form-input
                            id="from-email"
                            v-model="loginRequest.email"
                            class="form-control"
                            name="Email"
                            placeholder="Email"
                        />
                    </b-form-group>
                    <b-form-group
                        id="login-password"
                        :invalid-feedback="validation.getInvalidFeedback('password,value')"
                        :state="validation.getState('password,value')"
                        label="Password"
                        label-for="password"
                    >
                        <client-only placeholder="Loading...">
                            <weavr-password-input
                                ref="passwordField"
                                :base-style="passwordBaseStyle"
                                :class-name="[
                                    'sign-in-password form-control p-0',
                                    { 'is-invalid': isInvalidPassword },
                                ]"
                                :options="{ placeholder: 'Password' }"
                                aria-invalid="true"
                                name="password"
                                @onChange="passwordInteraction"
                                @onKeyUp="checkOnKeyUp"
                            />
                        </client-only>
                    </b-form-group>
                    <div class="mt-2">
                        <b-link
                            class="small text-decoration-underline text-grey"
                            to="/password/reset"
                        >
                            Forgot password?
                        </b-link>
                    </div>
                    <LoaderButton
                        :is-loading="isLoading"
                        class="text-center mt-4"
                        show-arrow
                        text="Sign In"
                    />
                    <div class="mt-4 text-center">
                        <small class="text-grey">
                            Not yet registered? Register
                            <b-link class="text-decoration-underline text-grey" to="/register"
                                >here
                            </b-link>
                            .
                        </small>
                    </div>
                </form>
            </b-card>
        </div>
    </b-col>
</template>

<script lang="ts">
import {
    computed,
    ComputedRef,
    defineComponent,
    Ref,
    ref,
    useAsync,
    useRouter,
} from '@nuxtjs/composition-api'
import { reactive } from 'vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import {
    INITIAL_LOGIN_WITH_PASSWORD_REQUEST,
    LoginWithPassword,
    LoginWithPasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication'
import useZodValidation from '~/composables/useZodValidation'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import { useStores } from '~/composables/useStores'
import { useBase } from '~/composables/useBase'

export default defineComponent({
    components: {
        LoaderButton,
        LogoOvc,
        ErrorAlert,
        WeavrPasswordInput,
    },
    layout: 'auth',
    setup() {
        const router = useRouter()
        const { showErrorToast } = useBase()
        const { auth, consumers, errors } = useStores(['auth', 'consumers', 'errors'])

        const isLoading = ref(false)
        const passwordField: Ref<typeof WeavrPasswordInput | null> = ref(null)

        const loginRequest: LoginWithPassword = reactive(INITIAL_LOGIN_WITH_PASSWORD_REQUEST())

        const validation = computed(() => {
            return useZodValidation(LoginWithPasswordSchema, loginRequest)
        })

        const passwordBaseStyle: ComputedRef<SecureElementStyleWithPseudoClasses> = computed(() => {
            return {
                color: '#495057',
                fontSize: '16px',
                fontSmoothing: 'antialiased',
                fontFamily: "'Be Vietnam', sans-serif",
                fontWeight: '400',
                lineHeight: '24px',
                margin: '0',
                padding: '6px 12px',
                textIndent: '0px',
                '::placeholder': {
                    color: '#B6B9C7',
                    fontWeight: '400',
                },
            }
        })

        const isInvalidPassword = computed(() => {
            return validation.value.getState('password,value') === false && validation.value.dirty
        })

        const passwordInteraction = (val: { empty?: boolean; valid?: boolean }) => {
            !val?.empty
                ? (loginRequest.password.value = '******')
                : (loginRequest.password.value = '')
        }

        useAsync(() => {
            const isLoggedIn = auth?.isLoggedIn

            if (isLoggedIn) {
                router.push('/')
            }
        })

        const login = async () => {
            isLoading.value = true

            await validation.value.validate()

            if (validation.value.isInvalid.value) {
                isLoading.value = false
                return
            }

            console.log('password', passwordField.value?.createToken())

            try {
                errors?.setError(null)
                passwordField.value?.createToken().then(
                    (tokens) => {
                        loginRequest.password.value = tokens.tokens.password
                        auth
                            ?.loginWithPassword(loginRequest)
                            .then(() => {
                                localStorage.setItem('stepUp', 'FALSE')
                                localStorage.setItem('scaSmsSent', 'FALSE')
                                goToDashboard()
                            })
                            .catch((err) => {
                                isLoading.value = false
                                errors?.setError(err)
                            })
                    },
                    (e) => {
                        isLoading.value = false
                        showErrorToast(e, 'Tokenization Error')
                    },
                )
            } catch (error: any) {
                isLoading.value = false
                showErrorToast(error, 'Login Error')
            }
        }

        const goToDashboard = async () => {
            if (auth?.isConsumer) {
                await consumers?.get()
            }

            await auth?.indexAuthFactors()

            await router.push({
                path: '/login/sca',
                query: {
                    send: 'true',
                },
            })
            isLoading.value = false
        }

        const checkOnKeyUp = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                login()
            }
        }

        return {
            login,
            validation,
            loginRequest,
            passwordBaseStyle,
            isInvalidPassword,
            passwordInteraction,
            checkOnKeyUp,
            isLoading,
            passwordField,
        }
    },
})
</script>

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
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { reactive } from 'vue'
import BaseMixin from '~/mixins/BaseMixin'

import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import {
    INITIAL_LOGIN_WITH_PASSWORD_REQUEST,
    LoginWithPassword,
    LoginWithPasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication/access'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    layout: 'auth',
    components: {
        LoaderButton,
        LogoOvc,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        WeavrPasswordInput,
    },
})
export default class LoginPage extends mixins(BaseMixin) {
    isLoading = false
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    loginRequest: LoginWithPassword = reactive(INITIAL_LOGIN_WITH_PASSWORD_REQUEST())

    get validation() {
        return useZodValidation(LoginWithPasswordSchema, this.loginRequest)
    }

    get passwordBaseStyle(): SecureElementStyleWithPseudoClasses {
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
    }

    get isInvalidPassword() {
        return this.validation.getState('password,value') === false && this.validation.dirty
    }

    passwordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty
            ? (this.loginRequest.password.value = '******')
            : (this.loginRequest.password.value = '')
    }

    async login() {
        this.isLoading = true

        await this.validation.validate()

        if (this.validation.isInvalid.value) {
            this.isLoading = false
            return
        }

        try {
            this.errorsStore.setError(null)
            this.passwordField.createToken().then(
                (tokens) => {
                    this.loginRequest.password.value = tokens.tokens.password
                    this.authStore
                        .loginWithPassword(this.loginRequest)
                        .then(() => {
                            localStorage.setItem('stepUp', 'FALSE')
                            localStorage.setItem('scaSmsSent', 'FALSE')
                            this.goToDashboard()
                        })
                        .catch((err) => {
                            this.isLoading = false
                            this.errorsStore.setError(err)
                        })
                },
                (e) => {
                    this.isLoading = false
                    this.showErrorToast(e, 'Tokenization Error')
                },
            )
        } catch (error: any) {
            this.isLoading = false
            this.showErrorToast(error, 'Login Error')
        }
    }

    async goToDashboard() {
        if (this.authStore.isConsumer) {
            await this.consumersStore.get()
        }

        await this.authStore.indexAuthFactors()

        await this.$router.push({
            path: '/login/sca',
            query: {
                send: 'true',
            },
        })
        this.isLoading = false
    }

    asyncData({ redirect }) {
        const { auth } = initialiseStores(['auth'])
        const isLoggedIn = auth?.isLoggedIn

        if (isLoggedIn) {
            redirect('/')
        }
    }

    checkOnKeyUp(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.login()
        }
    }
}
</script>

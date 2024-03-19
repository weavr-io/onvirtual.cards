<template>
    <b-col lg="6" md="9">
        <logo base-class="mb-5" />
        <div class="mb-3">
            <b-card body-class="px-4 mx-2 py-5 p-md-card">
                <h3 class="text-center font-weight-light mb-5">Login</h3>

                <form id="contact-form" class="mt-5" @submit.prevent="login">
                    <error-alert
                        message="Incorrect email and password combination. If you do not have an account please click on Register."
                    />
                    <b-form-group
                        id="login-email"
                        :invalid-feedback="invalidFeedback($v.loginRequest.email, 'email')"
                        :state="isInvalid($v.loginRequest.email)"
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
                    <client-only placeholder="Loading...">
                        <label class="d-block">PASSWORD</label>
                        <weavr-password-input
                            ref="passwordField"
                            :base-style="passwordBaseStyle"
                            :class-name="['sign-in-password', { 'is-invalid': isInvalidPassword }]"
                            :options="{ placeholder: 'Password' }"
                            aria-invalid="true"
                            name="password"
                            @onChange="passwordInteraction"
                            @onKeyUp="checkOnKeyUp"
                        />
                        <b-form-invalid-feedback v-if="isInvalidPassword">
                            Please enter your password
                        </b-form-invalid-feedback>
                    </client-only>

                    <div class="mt-2">
                        <b-link
                            class="small text-decoration-underline text-grey"
                            to="/password/reset"
                        >
                            Forgot password?
                        </b-link>
                    </div>

                    <b-form-group class="mt-5 text-center">
                        <b-overlay
                            :show="isLoading"
                            class="d-inline-block"
                            rounded="pill"
                            spinner-small
                        >
                            <b-button type="submit" variant="secondary">
                                sign in
                                <span class="pl-5">-></span>
                            </b-button>
                        </b-overlay>
                    </b-form-group>
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
import { email, required } from 'vuelidate/lib/validators'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { authStore } from '~/utils/store-accessor'
import { LoginWithPasswordRequest } from '~/plugins/weavr-multi/api/models/authentication/access/requests/LoginWithPasswordRequest'
import ValidationMixin from '~/mixins/ValidationMixin'
import Logo from '~/components/Logo.vue'

@Component({
    layout: 'auth',
    components: {
        Logo,
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        LoaderButton: () => import('~/components/LoaderButton.vue'),
        WeavrPasswordInput,
    },
    validations: {
        loginRequest: {
            email: {
                required,
                email,
            },
            password: {
                value: {
                    required,
                },
            },
        },
    },
})
export default class LoginPage extends mixins(BaseMixin, ValidationMixin) {
    isLoading = false
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    private loginRequest: LoginWithPasswordRequest = {
        email: '',
        password: {
            value: '',
        },
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
        return this.$v.loginRequest?.password?.value.$anyError
    }

    passwordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty
            ? (this.loginRequest.password.value = '******')
            : (this.loginRequest.password.value = '')
    }

    login() {
        this.$v.$touch()
        if (!this.$v.$invalid) {
            try {
                this.isLoading = true
                this.stores.errors.SET_ERROR(null)
                this.passwordField.createToken().then(
                    (tokens) => {
                        this.loginRequest.password.value = tokens.tokens.password
                        this.stores.auth
                            .loginWithPassword(this.loginRequest)
                            .then(() => {
                                localStorage.setItem('stepUp', 'FALSE')
                                localStorage.setItem('scaSmsSent', 'FALSE')
                                this.goToDashboard()
                            })
                            .catch((err) => {
                                this.isLoading = false
                                this.stores.errors.SET_ERROR(err)
                            })
                    },
                    (e) => {
                        this.showErrorToast(e, 'Tokenization Error')
                    },
                )
            } catch (error: any) {
                this.showErrorToast(error, 'Login Error')
            }
        }
    }

    async goToDashboard() {
        if (this.stores.auth.isConsumer) {
            await this.stores.consumers.get()
        }

        await this.stores.auth.indexAuthFactors()

        await this.$router.push({
            path: '/login/sca',
            query: {
                send: 'true',
            },
        })
        this.isLoading = false
    }

    asyncData({ store, redirect }) {
        const isLoggedIn = authStore(store).isLoggedIn

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

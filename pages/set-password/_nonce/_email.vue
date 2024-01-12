<template>
    <b-col lg="6" md="9">
        <logo class="pb-5" />
        <b-card class="overflow-hidden" no-body>
            <b-card-body class="px-4 mx-3 py-5 p-md-card">
                <div class="text-center">
                    <h2 class="font-weight-lighter">Set password</h2>
                </div>
                <error-alert
                    message="The reset password link is invalid or has expired.  Please restart the password reset process."
                />
                <b-form
                    v-if="noErrors"
                    id="contact-form"
                    class="mt-5"
                    @submit.prevent="setPassword"
                >
                    <b-form-group
                        id="ig-email"
                        :invalid-feedback="invalidFeedback($v.form.email, 'email')"
                        :state="isInvalid($v.form.email)"
                        label="Email"
                        label-for="setEmail"
                    >
                        <b-form-input
                            id="setEmail"
                            v-model="form.email"
                            :state="isInvalid($v.form.email)"
                            autocomplete="email"
                            class="form-control"
                            name="setEmail"
                            placeholder="Email"
                            type="text"
                        />
                    </b-form-group>
                    <client-only placeholder="Loading...">
                        <div :class="{ 'is-dirty': $v.form.$dirty }">
                            <label class="d-block">PASSWORD:</label>
                            <weavr-password-input
                                ref="passwordField"
                                :base-style="passwordBaseStyle"
                                :options="{
                                    placeholder: '****',
                                    classNames: { empty: 'is-invalid' },
                                }"
                                class-name="sign-in-password"
                                name="password"
                                required="true"
                                @onKeyUp.prevent="checkOnKeyUp"
                            />
                        </div>
                        <small class="form-text text-muted"
                            >Minimum 8, Maximum 50 characters.</small
                        >
                    </client-only>
                    <div class="text-center">
                        <loader-button
                            :is-loading="isLoading"
                            button-text="Set password"
                            class="mt-5"
                        />
                    </div>
                </b-form>
            </b-card-body>
        </b-card>
    </b-col>
</template>

<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { email, required } from 'vuelidate/lib/validators'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/LoaderButton.vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { ResumeLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ResumeLostPasswordRequestModel'
import { ValidatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ValidatePasswordRequestModel'
import ValidationMixin from '~/mixins/ValidationMixin'
import Logo from '~/components/Logo.vue'

@Component({
    layout: 'auth',
    components: {
        Logo,
        ErrorAlert,
        LoaderButton,
        WeavrPasswordInput,
    },
    validations: {
        form: {
            email: {
                required,
                email,
            },
        },
    },
})
export default class PasswordSentPage extends mixins(BaseMixin, ValidationMixin) {
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    isLoading = false
    protected form: ResumeLostPasswordRequestModel = {
        nonce: '',
        email: '',
        newPassword: {
            value: '',
        },
    }

    get noErrors() {
        return !this.stores.errors.errors
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

    fetch() {
        try {
            this.form.nonce = this.$route.params.nonce.toString()
            this.form.email = this.$route.params.email.toString()
        } catch (e) {
            this.stores.errors.SET_ERROR(e)
        }
    }

    setPassword() {
        this.$v.$touch()
        if (this.$v.$invalid) return

        this.passwordField.createToken().then(
            (tokens) => {
                if (tokens.tokens.password !== '') {
                    this.validatePassword(tokens.tokens.password)
                } else {
                    return null
                }
            },
            () => {
                return null
            },
        )
    }

    validatePassword(password: string) {
        this.form.newPassword.value = password
        const _request: ValidatePasswordRequestModel = {
            password: {
                value: password,
            },
        }

        this.stores.auth.validatePassword(_request).then(this.submitForm)
    }

    submitForm() {
        this.stores.auth
            .lostPasswordResume(this.form)
            .then(() => {
                this.$router.push('/login')
            })
            .catch((err) => {
                this.stores.errors.SET_ERROR(err)
            })
    }

    checkOnKeyUp(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.setPassword()
        }
    }
}
</script>

<template>
    <b-col lg="6" md="9">
        <LogoOvc classes="mb-5" />
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
                        :state="validation.getState('email')"
                        :invalid-feedback="validation.getInvalidFeedback('email')"
                        label="Email"
                        label-for="setEmail"
                    >
                        <b-form-input
                            id="setEmail"
                            v-model="form.email"
                            :state="validation.getState('email')"
                            class="form-control"
                            name="setEmail"
                            placeholder="Email"
                            type="text"
                            autocomplete="on"
                        />
                    </b-form-group>
                    <client-only placeholder="Loading...">
                        <div :class="{ 'is-dirty': isDirty }" @click="isDirty = !isDirty">
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
                        <LoaderButton :is-loading="isLoading" class="mt-5" text="Set password" />
                    </div>
                </b-form>
            </b-card-body>
        </b-card>
    </b-col>
</template>

<script lang="ts">
import { reactive } from 'vue'
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import { ResumeLostPasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ResumeLostPasswordRequestModel'
import { ValidatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ValidatePasswordRequestModel'
import {
    type PasswordRequest,
    PasswordRequestSchema,
    INITIAL_PASSWORD_REQUEST,
} from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/ResumeLostPasswordRequestModel'
import BaseMixin from '~/mixins/BaseMixin'
import ValidationMixin from '~/mixins/ValidationMixin'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    layout: 'auth',
    components: {
        LogoOvc,
        ErrorAlert,
        LoaderButton,
        WeavrPasswordInput,
    },
})
export default class PasswordSentPage extends mixins(BaseMixin, ValidationMixin) {
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    isDirty = false
    isLoading = false
    form: PasswordRequest = reactive(INITIAL_PASSWORD_REQUEST)

    get validation() {
        return useZodValidation(PasswordRequestSchema, this.form)
    }

    get noErrors() {
        return !this.errorsStore.errors
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
            this.errorsStore.setError(e)
        }
    }

    async setPassword() {
        await this.validation.validate()

        if (this.validation.isInvalid.value) return

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

        this.authStore.validatePassword(_request).then(this.submitForm)
    }

    submitForm() {
        this.authStore
            .lostPasswordResume(this.form as ResumeLostPasswordRequestModel)
            .then(() => {
                this.$router.push('/login')
            })
            .catch((err) => {
                this.errorsStore.setError(err)
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

<template>
    <b-form @submit.prevent="tryToSubmitForm">
        <h3 class="text-center font-weight-light mb-5">Register</h3>
        <error-alert />
        <b-form-group
            :invalid-feedback="validation.getInvalidFeedback('email')"
            :state="validation.getState('email')"
            label="Email*"
            label-for="form-email"
        >
            <b-form-input
                id="from-email"
                v-model="form.email"
                class="form-control"
                lazy
                placeholder="name@email.com"
            />
        </b-form-group>
        <b-form-group
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
                        { 'is-invalid': !isPasswordValidAndDirty },
                    ]"
                    :options="{ placeholder: '****' }"
                    name="password"
                    required="true"
                    @onChange="passwordInteraction"
                    @onKeyUp="checkOnKeyUp"
                    @onStrength="strengthCheck"
                />
                <small
                    :class="!isPasswordValidAndDirty ? 'text-danger' : 'text-muted'"
                    class="form-text mb-3"
                    >- min 8 characters <br />- uppercase letter <br />- digit and a special
                    character</small
                >
            </client-only>
        </b-form-group>
        <b-form-row class="small mt-3 text-muted">
            <b-col>
                <b-form-group
                    :invalid-feedback="validation.getInvalidFeedback('acceptedTerms')"
                    :state="validation.getState('acceptedTerms')"
                >
                    <b-form-checkbox
                        v-model="form.acceptedTerms"
                        :state="validation.getState('acceptedTerms')"
                    >
                        I accept the
                        <a
                            class="text-decoration-underline text-muted"
                            href="https://www.onvirtual.cards/terms/business"
                            target="_blank"
                            >terms of use</a
                        >
                        and
                        <a
                            class="text-decoration-underline text-muted"
                            href="https://www.onvirtual.cards/policy/"
                            target="_blank"
                            >privacy policy</a
                        >*
                    </b-form-checkbox>
                </b-form-group>
            </b-col>
        </b-form-row>
        <div v-if="isRecaptchaEnabled" class="mt-2 d-flex justify-content-center">
            <recaptcha />
        </div>
        <b-form-row class="mt-5">
            <b-col class="text-center">
                <LoaderButton
                    :is-loading="isLoadingRegistration"
                    class="text-center"
                    text="continue"
                />
            </b-col>
        </b-form-row>
    </b-form>
</template>
<script lang="ts">
import { Component, Emit, mixins, Ref } from 'nuxt-property-decorator'
import { reactive } from 'vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import ValidationMixin from '~/mixins/ValidationMixin'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import {
    INITIAL_LOGIN_WITH_PASSWORD_REQUEST,
    LoginWithPassword,
    LoginWithPasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication'
import useZodValidation from '~/composables/useZodValidation'
import { CreateCorporateRequestSchema } from '~/plugins/weavr-multi/api/models/identities/corporates'

@Component({
    components: {
        ErrorAlert: () => import('~/components/ErrorAlert.vue'),
        WeavrPasswordInput,
        LoaderButton,
    },
})
export default class RegisterForm extends mixins(BaseMixin, ValidationMixin) {
    @Ref('passwordField')
    passwordField!: WeavrPasswordInput

    form: LoginWithPassword & {
        acceptedTerms?: boolean
    } = reactive({ ...INITIAL_LOGIN_WITH_PASSWORD_REQUEST() })

    validation = useZodValidation(
        LoginWithPasswordSchema.merge(CreateCorporateRequestSchema.pick({ acceptedTerms: true })),
        this.form,
    )

    passwordStrength = 0
    private $recaptcha: any

    get isPasswordValidAndDirty(): boolean {
        return !this.validation.dirty ? true : this.isPasswordValid
    }

    get isPasswordValid(): boolean {
        return this.passwordStrength >= 2
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

    get isRecaptchaEnabled(): boolean {
        return typeof process.env.RECAPTCHA !== 'undefined'
    }

    get isLoadingRegistration() {
        return this.corporatesStore.corporateState.isLoadingRegistration
    }

    async tryToSubmitForm() {
        this.errorsStore.resetState()
        try {
            this.validation.touch() && (await this.validation.validate())
            if (this.validation.isInvalid || !this.isPasswordValid) {
                return
            }

            this.startRegistrationLoading()
            this.passwordField.createToken().then(
                (tokens) => {
                    if (tokens.tokens.password !== '') {
                        this.form.password = tokens.tokens.password
                        this.submitForm()
                    } else {
                        return null
                    }
                },
                (e) => {
                    this.showErrorToast(e, 'Tokenization Error')
                },
            )
        } catch (error: any) {
            this.showErrorToast(error, 'Registration Error')
        }
    }

    checkOnKeyUp(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.tryToSubmitForm()
        }
    }

    passwordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty ? (this.form.password.value = '******') : (this.form.password.value = '')
    }

    startRegistrationLoading() {
        this.corporatesStore.setIsLoadingRegistration(true)
    }

    @Emit()
    submitForm() {
        this.errorsStore.resetState()
        return this.form
    }

    @Emit()
    strengthCheck(val) {
        this.passwordStrength = val.id
    }
}
</script>

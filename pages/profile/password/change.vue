<template>
    <section class="register-section">
        <b-container>
            <b-row align-h="center">
                <b-col class="my-2 my-lg-5 text-center" lg="6" md="9">
                    <div class="text-md d-inline-block text-center mb-5 mb-lg-6">
                        <h1 class="font-weight-light">Change Password</h1>
                    </div>
                    <div class="mx-md-3 px-md-5">
                        <b-form id="contact-form" @submit.prevent="submitChangePassword">
                            <client-only placeholder="Loading...">
                                <div :class="{ 'is-dirty': validation.dirty }">
                                    <label class="d-block text-left">OLD PASSWORD:</label>
                                    <weavr-password-input
                                        ref="oldPassword"
                                        :base-style="passwordBaseStyle"
                                        :options="{
                                            placeholder: '****',
                                            classNames: { invalid: 'is-invalid' },
                                        }"
                                        class-name="sign-in-password"
                                        name="old-password"
                                        required="true"
                                        @onChange="oldPasswordInteraction"
                                        @onKeyUp.prevent="checkOnKeyUp"
                                    />
                                    <label class="d-block text-left mt-3">NEW PASSWORD:</label>
                                    <weavr-password-input
                                        ref="newPassword"
                                        :base-style="passwordBaseStyle"
                                        :options="{
                                            placeholder: '****',
                                            classNames: { invalid: 'is-invalid' },
                                        }"
                                        class-name="sign-in-password"
                                        name="new-password"
                                        required="true"
                                        @onChange="passwordInteraction"
                                        @onStrength="strengthCheck"
                                        @onKeyUp.prevent="checkOnKeyUp"
                                    />
                                    <small
                                        :class="
                                            !isPasswordValidAndDirty ? 'text-danger' : 'text-muted'
                                        "
                                        class="form-text mb-3 text-left"
                                        >- min 8 characters <br />- uppercase letter <br />- digit
                                        and a special character</small
                                    >
                                </div>
                            </client-only>

                            <div class="text-center">
                                <LoaderButton
                                    :is-loading="isLoading"
                                    class="mt-5"
                                    text="Change Password"
                                />
                            </div>
                        </b-form>
                    </div>
                </b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { reactive } from 'vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'
import BaseMixin from '~/mixins/BaseMixin'
import {
    INITIAL_UPDATE_PASSWORD_REQUEST,
    UpdatePasswordRequestModel,
    UpdatePasswordRequestSchema,
} from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/UpdatePasswordRequestModel'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

@Component({
    components: {
        LoaderButton,
        ErrorAlert: () => import('~/components/molecules/ErrorAlert.vue'),
        WeavrPasswordInput,
    },
})
export default class BundlesPage extends mixins(BaseMixin) {
    @Ref('oldPassword')
    oldPassword!: WeavrPasswordInput

    @Ref('newPassword')
    newPassword!: WeavrPasswordInput

    isLoading = false

    passwordStrength = 0

    changePasswordRequest: UpdatePasswordRequestModel = reactive(INITIAL_UPDATE_PASSWORD_REQUEST())

    get validation() {
        return useZodValidation(UpdatePasswordRequestSchema, this.changePasswordRequest)
    }

    get isPasswordValid(): boolean {
        return this.passwordStrength >= 2
    }

    get isPasswordValidAndDirty(): boolean {
        return !this.validation.dirty.value ? true : this.isPasswordValid
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

    oldPasswordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty
            ? (this.changePasswordRequest.oldPassword.value = '******')
            : (this.changePasswordRequest.oldPassword.value = '')
    }

    passwordInteraction(val: { empty: boolean; valid: boolean }) {
        !val.empty
            ? (this.changePasswordRequest.newPassword.value = '******')
            : (this.changePasswordRequest.newPassword.value = '')
    }

    strengthCheck(val) {
        this.passwordStrength = val.id
    }

    checkOnKeyUp(e) {
        if (e.key === 'Enter') {
            e.preventDefault()
            this.submitChangePassword()
        }
    }

    async submitChangePassword() {
        let tokenizedOld = ''
        let tokenizedNew = ''

        this.validation.touch() && (await this.validation.validate())

        if (this.validation.isInvalid.value || !this.isPasswordValid) {
            return null
        }

        this.isLoading = true

        await this.oldPassword.createToken().then((res) => {
            tokenizedOld = res.tokens['old-password']
        })
        await this.newPassword.createToken().then((res) => {
            tokenizedNew = res.tokens['new-password']
        })

        if (tokenizedOld && tokenizedNew) {
            this.changePasswordRequest.oldPassword.value = tokenizedOld
            this.changePasswordRequest.newPassword.value = tokenizedNew
            this.authStore
                .validatePassword({ password: this.changePasswordRequest.newPassword })
                .then(() => {
                    this.authStore
                        .updatePassword(this.changePasswordRequest)
                        .then(() => {
                            this.showSuccessToast('Password changed successfully')
                            this.$router.push('/profile')
                        })
                        .catch((err) => {
                            const data = err.response.data
                            const error = data.message ? data.message : data.errorCode

                            this.showErrorToast(error)
                        })
                        .finally(() => {
                            this.isLoading = false
                        })
                })
        }
    }
}
</script>

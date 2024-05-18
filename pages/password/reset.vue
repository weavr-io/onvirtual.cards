<template>
    <b-col lg="6" md="9">
        <LogoOvc classes="pb-5" />
        <b-card no-body>
            <b-card-body v-if="!passwordSent" class="px-4 mx-2 py-5 p-md-card">
                <div class="text-center">
                    <h2 class="font-weight-lighter">Reset Password</h2>
                    <h5 class="font-weight-lighter mt-4">
                        Insert the email you created the account with and we’ll send instructions to
                        reset your password.
                    </h5>
                </div>
                <error-alert />
                <b-form id="contact-form" class="mt-5" novalidate @submit.prevent="resetPassword">
                    <b-form-group
                        id="ig-email"
                        :invalid-feedback="validation.getInvalidFeedback('email')"
                        :state="validation.getState('email')"
                        label="Email:"
                        label-for="from-email"
                    >
                        <b-form-input
                            id="from-email"
                            v-model="form.email"
                            :state="validation.getState('email')"
                            class="form-control"
                            name="setEmail"
                            placeholder="name@email.com"
                            type="email"
                        />
                    </b-form-group>
                    <div class="form-group mt-5 pt-1">
                        <LoaderButton
                            :is-loading="isLoading"
                            class="text-center"
                            text="reset password"
                        />
                    </div>
                </b-form>
            </b-card-body>
            <b-card v-else class="overflow-hidden" no-body>
                <b-card-body class="px-4 mx-2 py-5 p-md-card">
                    <div class="text-center">
                        <h2 class="font-weight-lighter">Email sent</h2>
                        <h5 class="font-weight-lighter mt-4">
                            Check your email for a reset link. If you don’t receive this within 5
                            minutes, click the link below to resend.
                        </h5>
                    </div>
                    <div class="mt-5 text-center">
                        <div>
                            <img alt="" src="/img/success.svg" style="max-width: 100px" />
                        </div>
                        <div>
                            <b-form id="contact-form" class="mt-5" @submit.prevent="resetPassword">
                                <LoaderButton
                                    :is-loading="isLoading"
                                    class="text-center"
                                    text="resend"
                                />
                            </b-form>
                        </div>
                    </div>
                </b-card-body>
            </b-card>
        </b-card>
    </b-col>
</template>
<script lang="ts">
import { reactive } from 'vue'
import { Component, mixins } from 'nuxt-property-decorator'
import {
    INITIAL_RESET_REQUEST,
    InitiateLostPasswordRequestModel,
    type ResetRequest,
    ResetSchema,
} from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/InitiateLostPasswordRequestModel'
import BaseMixin from '~/mixins/BaseMixin'

import LogoOvc from '~/components/molecules/LogoOvc.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import useZodValidation from '~/composables/useZodValidation'

@Component({
    layout: 'auth',
    components: {
        LoaderButton,
        LogoOvc,
        ErrorAlert: () => import('~/components/molecules/ErrorAlert.vue'),
    },
})
export default class ResetPasswordPage extends mixins(BaseMixin) {
    isLoading = false

    passwordSent = false

    form: ResetRequest = reactive(INITIAL_RESET_REQUEST())

    get validation() {
        return useZodValidation(ResetSchema, this.form)
    }

    async resetPassword() {
        await this.validation.validate()

        if (this.validation.isInvalid.value) return

        this.isLoading = true
        this.errorsStore.setError(null)
        this.authStore
            .lostPasswordInitiate(this.form as InitiateLostPasswordRequestModel)
            .then(() => {
                this.passwordSent = true
            })
            .catch((err) => {
                this.errorsStore.setError(err)
            })
            .finally(() => {
                this.isLoading = false
            })
    }
}
</script>

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
import { computed, defineComponent, reactive, ref } from '@nuxtjs/composition-api'
import ErrorAlert from '~/components/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import { useStores } from '~/composables/useStores'
import useZodValidation from '~/composables/useZodValidation'
import {
    INITIAL_RESET_REQUEST,
    InitiateLostPasswordRequestModel,
    ResetRequest,
    ResetSchema,
} from '~/plugins/weavr-multi/api/models/authentication'

export default defineComponent({
    components: {
        LoaderButton,
        LogoOvc,
        ErrorAlert,
    },
    layout: 'auth',
    setup() {
        const { auth, errors } = useStores(['auth', 'errors'])

        const isLoading = ref(false)
        const passwordSent = ref(false)
        const form: ResetRequest = reactive(INITIAL_RESET_REQUEST())

        const validation = computed(() => {
            return useZodValidation(ResetSchema, form)
        })

        const resetPassword = async () => {
            await validation.value.validate()

            if (validation.value.isInvalid.value) return

            isLoading.value = true
            errors?.setError(null)
            auth
                ?.lostPasswordInitiate(form as InitiateLostPasswordRequestModel)
                .then(() => {
                    passwordSent.value = true
                })
                .catch((err) => {
                    errors?.setError(err)
                })
                .finally(() => {
                    isLoading.value = false
                })
        }

        return {
            passwordSent,
            resetPassword,
            validation,
            form,
            isLoading,
        }
    },
})
</script>

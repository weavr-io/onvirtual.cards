<template>
    <b-col lg="6" md="9">
        <b-row class="my-5">
            <b-card body-class="p-6">
                <b-form @submit.prevent="tryToSubmitAccessCode">
                    <h3 class="text-center font-weight-light mb-6">
                        Enter the access code for registration
                    </h3>
                    <template v-if="inviteCodeError.showMsg">
                        <b-alert class="mb-4" show variant="danger">
                            {{ inviteCodeError.errorMsg }}
                        </b-alert>
                    </template>
                    <div class="small text-center mb-6">
                        If you need an access code please send us an email at
                        <a href="mailto: sales@weavr.io">sales@weavr.io</a>
                    </div>
                    <b-form-group
                        :invalid-feedback="validation.getInvalidFeedback('code')"
                        :state="validation.getState('code')"
                    >
                        <b-form-input
                            v-model="form.code"
                            number
                            placeholder="Enter your access code"
                        />
                    </b-form-group>
                    <b-form-row class="mt-5">
                        <b-col class="text-center">
                            <LoaderButton :is-loading="isLoading" text="submit" />
                        </b-col>
                    </b-form-row>
                </b-form>
            </b-card>
        </b-row>
    </b-col>
</template>

<script lang="ts" setup>
import { computed, ref, reactive } from '@nuxtjs/composition-api'
import { AxiosError } from 'axios'
import { useStores } from '~/composables/useStores'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import {
    AccessCode,
    AccessCodeSchema,
    INITIAL_ACCESS_CODE_REQUEST,
} from '~/plugins/weavr-multi/api/models/access-codes'
import useZodValidation from '~/composables/useZodValidation'

interface IInviteCodeError {
    errorMsg: string
    showMsg: boolean
}

const form = reactive<AccessCode>(INITIAL_ACCESS_CODE_REQUEST())
const { accessCodes } = useStores(['accessCodes'])

const isLoading = ref<boolean>(false)
const inviteCodeError = ref<IInviteCodeError>({
    errorMsg: '',
    showMsg: false,
})

const validation = computed(() => useZodValidation(AccessCodeSchema, form))

const tryToSubmitAccessCode = async () => {
    isLoading.value = true
    await validation.value.validate()

    if (validation.value.isInvalid.value) {
        isLoading.value = false
        return
    }

    if (form.code) {
        form.code = +form.code

        return accessCodes
            ?.verifyAccessCode(form)
            .catch((err: AxiosError) => {
                const is403: boolean = err.response?.status === 403

                inviteCodeError.value = {
                    errorMsg: is403
                        ? 'Invite code is invalid.'
                        : 'An error occurred. Please try again.',
                    showMsg: true,
                }
            })
            .finally(() => {
                isLoading.value = false
                validation.value.clearErrors()
            })
    }
}
</script>

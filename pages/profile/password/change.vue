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

<script lang="ts" setup>
import { computed, ComputedRef, reactive, ref, useRouter } from '@nuxtjs/composition-api'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import useZodValidation from '~/composables/useZodValidation'
import {
    INITIAL_UPDATE_PASSWORD_REQUEST,
    UpdatePasswordRequestModel,
    UpdatePasswordRequestSchema,
} from '~/plugins/weavr-multi/api/models/authentication'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

const router = useRouter()
const { showSuccessToast, showErrorToast } = useBase()
const { auth } = useStores(['auth'])

const oldPassword = ref<WeavrPasswordInput | null>(null)
const newPassword = ref<WeavrPasswordInput | null>(null)
const isLoading = ref(false)
const passwordStrength = ref(0)
const changePasswordRequest: UpdatePasswordRequestModel = reactive(
    INITIAL_UPDATE_PASSWORD_REQUEST(),
)

const validation = computed(() => {
    return useZodValidation(UpdatePasswordRequestSchema, changePasswordRequest)
})

const isPasswordValid = computed(() => {
    return passwordStrength.value >= 2
})

const isPasswordValidAndDirty = computed(() => {
    return !validation.value.dirty.value ? true : isPasswordValid.value
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

const oldPasswordInteraction = (val: { empty: boolean; valid: boolean }) => {
    !val.empty
        ? (changePasswordRequest.oldPassword.value = '******')
        : (changePasswordRequest.oldPassword.value = '')
}

const passwordInteraction = (val: { empty: boolean; valid: boolean }) => {
    !val.empty
        ? (changePasswordRequest.newPassword.value = '******')
        : (changePasswordRequest.newPassword.value = '')
}

const strengthCheck = (val) => {
    passwordStrength.value = val.id
}

const checkOnKeyUp = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        submitChangePassword()
    }
}

const submitChangePassword = async () => {
    let tokenizedOld = ''
    let tokenizedNew = ''

    validation.value.touch() && (await validation.value.validate())

    if (validation.value.isInvalid.value || !isPasswordValid.value) {
        return null
    }

    isLoading.value = true

    await oldPassword.value?.createToken().then((res) => {
        tokenizedOld = res.tokens['old-password']
    })
    await newPassword.value?.createToken().then((res) => {
        tokenizedNew = res.tokens['new-password']
    })

    if (tokenizedOld && tokenizedNew) {
        changePasswordRequest.oldPassword.value = tokenizedOld
        changePasswordRequest.newPassword.value = tokenizedNew
        auth?.validatePassword({ password: changePasswordRequest.newPassword }).then(() => {
            auth
                ?.updatePassword(changePasswordRequest)
                .then(() => {
                    showSuccessToast('Password changed successfully')
                    router.push('/profile')
                })
                .catch((err) => {
                    const data = err.response.data
                    const error = data.message ? data.message : data.errorCode

                    showErrorToast(error)
                })
                .finally(() => {
                    isLoading.value = false
                })
        })
    }
}
</script>

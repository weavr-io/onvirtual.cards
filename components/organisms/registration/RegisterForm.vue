<template>
    <b-form @submit.prevent="tryToSubmitForm">
        <h3 class="text-center fw-light mb-5">Register</h3>
        <ErrorAlert />
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
                        !isPasswordValidAndDirty ? 'is-invalid' : '',
                    ]"
                    :options="{ placeholder: '****' }"
                    name="password"
                    required="true"
                    @on-change="passwordInteraction"
                    @on-key-up="checkOnKeyUp"
                    @on-strength="strengthCheck"
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
                    class="pb-2"
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
            <recaptcha-form
                @error-callback="handleErrorCallback"
                @expired-callback="handleExpiredCallback"
                @load-callback="handleLoadCallback"
            />
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

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'
import { useBase } from '~/composables/useBase'
import type { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import {
    INITIAL_LOGIN_WITH_PASSWORD_REQUEST,
    type LoginWithPassword,
    LoginWithPasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication'
import { CreateCorporateRequestSchema } from '~/plugins/weavr-multi/api/models/identities/corporates'
import useZodValidation from '~/composables/useZodValidation'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'

const emit = defineEmits(['submit-form'])
const { corporates, errors } = useStores(['corporates', 'errors'])
const { showErrorToast } = useBase()

const form = reactive<
    LoginWithPassword & {
        acceptedTerms?: boolean
    }
>({ ...INITIAL_LOGIN_WITH_PASSWORD_REQUEST() })

const passwordField: Ref<typeof WeavrPasswordInput | null> = ref(null)
const passwordStrength = ref<number>(0)
const isCaptchaVerified = ref(false)

const validation = computed(() => {
    return useZodValidation(
        LoginWithPasswordSchema.merge(CreateCorporateRequestSchema.pick({ acceptedTerms: true })),
        form,
    )
})

const isPasswordValidAndDirty: ComputedRef<boolean> = computed(() =>
    !validation.value.dirty.value ? true : isPasswordValid.value,
)

const isPasswordValid: ComputedRef<boolean> = computed(() => passwordStrength.value >= 2)

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

const isRecaptchaEnabled: ComputedRef<boolean> = computed(
    () => typeof useRuntimeConfig().public.recaptcha.siteKey !== 'undefined',
)

const isLoadingRegistration = computed(() => corporates?.corporateState.isLoadingRegistration)

const handleErrorCallback = () => {
    isCaptchaVerified.value = false
}

const handleExpiredCallback = () => {
    isCaptchaVerified.value = false
}

const handleLoadCallback = (res: unknown) => {
    if (res) {
        isCaptchaVerified.value = true
    }
}

const tryToSubmitForm = async () => {
    try {
        if (!isCaptchaVerified.value) return

        errors?.resetState()
        validation.value.touch() && (await validation.value.validate())
        if (validation.value.isInvalid.value || !isPasswordValid.value) {
            return
        }

        startRegistrationLoading()
        passwordField.value?.createToken().then(
            (tokens) => {
                if (tokens.tokens.password !== '') {
                    form.password = tokens.tokens.password
                    submitForm()
                } else {
                    return null
                }
            },
            (e) => {
                showErrorToast(e, 'Tokenization Error')
            },
        )
    } catch (error: any) {
        showErrorToast(error, 'Registration Error')
    }
}

const checkOnKeyUp = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        tryToSubmitForm()
    }
}

const passwordInteraction = (val: { empty: boolean; valid: boolean }) => {
    !val.empty ? (form.password.value = '******') : (form.password.value = '')
}

const startRegistrationLoading = () => {
    corporates?.setIsLoadingRegistration(true)
}

const submitForm = () => {
    errors?.resetState()
    emit('submit-form', form)
}

const strengthCheck = (val) => {
    passwordStrength.value = val.id
}
</script>

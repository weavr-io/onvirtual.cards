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
                        :invalid-feedback="validation.getInvalidFeedback('email')"
                        :state="validation.getState('email')"
                        label="Email"
                        label-for="setEmail"
                    >
                        <b-form-input
                            id="setEmail"
                            v-model="form.email"
                            :state="validation.getState('email')"
                            autocomplete="on"
                            class="form-control"
                            name="setEmail"
                            placeholder="Email"
                            type="text"
                        />
                    </b-form-group>
                    <b-form-group
                        :state="validation.getState('newPassword,value')"
                        label="Password"
                        label-for="password"
                    >
                        <client-only placeholder="Loading...">
                            <weavr-password-input
                                ref="passwordField"
                                :base-style="passwordBaseStyle"
                                :class-name="[
                                    'sign-in-password form-control p-0',
                                    { 'is-invalid': isPasswordInvalidAndDirty },
                                ]"
                                :options="{ placeholder: '****' }"
                                name="password"
                                required="true"
                                @onChange="passwordInteraction"
                                @onKeyUp="checkOnKeyUp"
                                @onStrength="strengthCheck"
                            />
                            <small
                                :class="isPasswordInvalidAndDirty ? 'text-danger' : 'text-muted'"
                                class="form-text mb-3"
                                >- min 8 characters <br />- uppercase letter <br />- digit and a
                                special character</small
                            >
                        </client-only>
                    </b-form-group>
                    <div class="text-center">
                        <LoaderButton :is-loading="isLoading" class="mt-5" text="Set password" />
                    </div>
                </b-form>
            </b-card-body>
        </b-card>
    </b-col>
</template>

<script lang="ts">
import {
    ComputedRef,
    computed,
    defineComponent,
    reactive,
    ref,
    useFetch,
    useRoute,
    useRouter,
} from '@nuxtjs/composition-api'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import LoaderButton from '~/components/atoms/LoaderButton.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import { useStores } from '~/composables/useStores'
import useZodValidation from '~/composables/useZodValidation'
import {
    INITIAL_RESUME_LOST_PASSWORD_REQUEST,
    ResumeLostPasswordSchema,
    ValidatePasswordRequestModel,
} from '~/plugins/weavr-multi/api/models/authentication'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'

export default defineComponent({
    components: {
        LogoOvc,
        ErrorAlert,
        LoaderButton,
        WeavrPasswordInput,
    },
    layout: 'auth',
    setup() {
        const route = useRoute()
        const router = useRouter()
        const { auth, errors } = useStores(['auth', 'errors'])

        const passwordField = ref<WeavrPasswordInput | null>(null)
        const isLoading = ref(false)
        const form = reactive(INITIAL_RESUME_LOST_PASSWORD_REQUEST())
        const passwordStrength = ref(0)

        const validation = computed(() => {
            return useZodValidation(ResumeLostPasswordSchema, form)
        })

        const noErrors = computed(() => {
            return !errors?.errors
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

        const isPasswordInvalidAndDirty = computed(() => {
            return !isPasswordValid.value && validation.value.dirty.value
        })

        const isPasswordValid = computed(() => {
            return passwordStrength.value >= 2
        })

        useFetch(() => {
            try {
                form.nonce = route.value.params.nonce.toString()
                form.email = route.value.params.email.toString()
            } catch (e) {
                errors?.setError(e)
            }
        })

        const setPassword = async () => {
            validation.value.touch() && (await validation.value.validate())

            if (validation.value.isInvalid.value) return

            await passwordField.value?.createToken().then(
                (tokens) => {
                    if (tokens.tokens.password !== '') {
                        validatePassword(tokens.tokens.password)
                    } else {
                        return null
                    }
                },
                () => {
                    return null
                },
            )
        }

        const validatePassword = (password: string) => {
            form.newPassword.value = password
            const _request: ValidatePasswordRequestModel = {
                password: {
                    value: password,
                },
            }

            auth?.validatePassword(_request).then(submitForm)
        }

        const submitForm = () => {
            auth
                ?.lostPasswordResume(form)
                .then(() => {
                    router.push('/login')
                })
                .catch((err) => {
                    errors?.setError(err)
                })
        }

        const checkOnKeyUp = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault()
                setPassword()
            }
        }

        const passwordInteraction = (val: { empty: boolean; valid: boolean }) => {
            !val.empty ? (form.newPassword.value = '******') : (form.newPassword.value = '')
        }

        const strengthCheck = (val) => {
            passwordStrength.value = val.id
        }

        return {
            noErrors,
            setPassword,
            validation,
            form,
            passwordField,
            passwordBaseStyle,
            isPasswordInvalidAndDirty,
            passwordInteraction,
            checkOnKeyUp,
            strengthCheck,
            isLoading,
        }
    },
})
</script>

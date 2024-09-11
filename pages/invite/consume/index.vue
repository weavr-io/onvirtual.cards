<template>
    <b-col lg="6" md="9">
        <LogoOvc classes="mb-5" />
        <b-card body-class="p-6">
            <template v-if="showErrorI">
                <b-alert show variant="danger">
                    Some information is missing. Please make sure you copy the whole URL.
                </b-alert>
            </template>
            <template v-else>
                <h3 class="text-center fw-light mb-6">Accept Invite</h3>
                <error-alert />
                <b-form @submit.prevent="tryToSubmitForm">
                    <client-only placeholder="Loading...">
                        <label class="d-block">PASSWORD:</label>
                        <weavr-password-input
                            ref="passwordField"
                            :base-style="passwordBaseStyle"
                            :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
                            class-name="sign-in-password"
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
                    <b-form-row class="mt-6">
                        <b-col class="text-center">
                            <!-- TODO: should be $fetchState.pending -->
                            <b-button
                                :disabled="pendingDataOrError"
                                type="submit"
                                variant="secondary"
                            >
                                submit
                                <span class="ps-5">-></span>
                            </b-button>
                        </b-col>
                    </b-form-row>
                </b-form>
            </template>
        </b-card>
    </b-col>
</template>

<script lang="ts" setup>
import {
    INITIAL_PASSWORD_REQUEST,
    PasswordSchema,
} from '~/plugins/weavr-multi/api/models/authentication'
import type { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import { type IDModel, INITIAL_ID_REQUEST } from '~/plugins/weavr-multi/api/models/common'
import {
    INITIAL_INVITE_CONSUME_REQUEST,
    type InviteConsumeRequestModel,
} from '~/plugins/weavr-multi/api/models/users/requests/InviteConsumeRequestModel'
import { useStores } from '~/composables/useStores'
import { useBase } from '~/composables/useBase'
import type { InviteValidateRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/InviteValidateRequestModel'
import useZodValidation from '~/composables/useZodValidation'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import ErrorAlert from '~/components/molecules/ErrorAlert.vue'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

definePageMeta({
    layout: 'auth',
})

const route = useRoute()
const router = useRouter()
const { pendingDataOrError } = useBase()
const { errors, users } = useStores(['errors', 'users'])

const showErrorI = ref<boolean>(false)
const passwordField: Ref<typeof WeavrPasswordInput | null> = ref(null)
const passwordStrength = ref(0)
const form: Ref<{
    id: IDModel
    data: InviteConsumeRequestModel
}> = ref({ id: INITIAL_ID_REQUEST, data: INITIAL_INVITE_CONSUME_REQUEST() })
const inviteForm = reactive(INITIAL_PASSWORD_REQUEST())

const validation = computed(() => {
    return useZodValidation(PasswordSchema, inviteForm)
})

const isPasswordValidAndDirty = computed(() => {
    return !inviteForm.password?.value ? true : isPasswordValid
})

const isPasswordValid = computed(() => {
    return passwordStrength.value >= 2
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

const updateInviteFormRequest = () => {
    try {
        const _consumeInviteRequest: { id: IDModel; data: InviteConsumeRequestModel } = {
            id: route.query.user_id!.toString(),
            data: {
                inviteCode: route.query.nonce!.toString(),
                password: {
                    value: '',
                },
            },
        }
        form.value = _consumeInviteRequest
        showErrorI.value = false
    } catch (_) {
        showErrorI.value = true
    }
}

const validateInviteFormRequest = () => {
    try {
        const _validateRequest: { id: IDModel; data: InviteValidateRequestModel } = {
            id: route.query.user_id!.toString(),
            data: {
                inviteCode: route.query.nonce!.toString(),
            },
        }

        users?.inviteValidate(_validateRequest).catch(handleError)
    } catch (_) {}
}

onBeforeMount(() => {
    updateInviteFormRequest()
    validateInviteFormRequest()
})

const strengthCheck = (val) => {
    passwordStrength.value = val.id
}

const passwordInteraction = (val: { empty: boolean; valid: boolean }) => {
    !val.empty ? (inviteForm.password.value = '******') : (inviteForm.password.value = '')
    validation.value.validate()
}

const handleError = (e) => {
    errors?.setError(e.response)
}

const tryToSubmitForm = () => {
    if (isPasswordValid.value && validation.value.isValid) {
        passwordField.value?.createToken().then(
            (tokens) => {
                if (tokens.tokens.password !== '') {
                    form.value.data.password!.value = tokens.tokens.password
                    users?.inviteConsume(form.value).then(() => {
                        router.push('/login')
                    })
                } else {
                    return null
                }
            },
            () => {
                return null
            },
        )
    }
}

const checkOnKeyUp = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        tryToSubmitForm()
    }
}
</script>

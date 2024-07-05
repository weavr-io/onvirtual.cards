<template>
    <div>
        <div v-if="hasConflict">
            <div :class="baseClass" class="error-alert" role="alert">
                <p>{{ conflictMessage }}</p>
                <button @click="onClose">
                    <img alt="close" src="/img/close.svg" width="16" />
                </button>
            </div>
        </div>
        <div v-else-if="hasError">
            <div :class="baseClass" class="error-alert" role="alert">
                <p>
                    {{ errorMessage }}
                    <b-link v-if="errorLink != null" :to="errorLink.link" class="error-alert-link">
                        {{ errorLink.text }}
                    </b-link>
                </p>
                <button @click="onClose">
                    <img alt="close" src="/img/close.svg" width="16" />
                </button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { computed, ComputedRef, PropType } from '@nuxtjs/composition-api'
import { useStores } from '~/composables/useStores'
import { ErrorLink } from '~/local/models/ErrorLink'
import {
    CreateIdentityConflictsEnum,
    AuthenticationConflictsEnum,
    VerificationConflictsEnum,
} from '~/plugins/weavr-multi/api/models/error/conflicts/identities/common'

const props = defineProps({
    baseClass: {
        type: String,
        default: 'my-5',
    },
    message: {
        type: String,
        default: '',
    },
    errorLink: {
        type: Object as PropType<ErrorLink>,
        default: null,
    },
})

const emit = defineEmits(['close'])
const { errors } = useStores(['errors'])

const _errors = computed(() => errors?.errors)
const conflict = computed(() => errors?.conflict)
const conflictMessage = computed(() => errors?.conflictMessage)
const hasError: ComputedRef<boolean> = computed(() => !!_errors.value)
const hasConflict: ComputedRef<boolean> = computed(() => !!conflict.value)

const getErrorMsgs: ComputedRef<string> = computed(() => {
    switch (_errors.value.data.errorCode) {
        case CreateIdentityConflictsEnum.ROOT_EMAIL_NOT_UNIQUE:
        case AuthenticationConflictsEnum.EMAIL_NOT_UNIQUE:
            return 'This email address already exists in the system. Do you want to log in instead?'
        case AuthenticationConflictsEnum.INVALID_CREDENTIALS:
            return 'Invalid Credentials'
        case CreateIdentityConflictsEnum.ROOT_USERNAME_NOT_UNIQUE:
            return 'Username already exists in the system. Please try a different username.'
        case VerificationConflictsEnum.INVALID_NONCE_OR_MOBILE:
            return 'There is something wrong with your verification code.'
        default:
            return 'An error occurred. Please try again.'
    }
})

const errorMessage: ComputedRef<string> = computed(() => {
    if (_errors.value == null) {
        return ''
    } else if (props.message) {
        return props.message
    } else if (_errors.value?.data && _errors.value.data.errorCode) {
        return getErrorMsgs.value
    } else {
        return 'An error occurred. Please try again.'
    }
})

const onClose = () => {
    errors?.resetState()
    emit('close')
}
</script>

<style lang="scss" scoped>
.error-alert-link {
    text-transform: initial;
    color: #fff;
    text-decoration: underline;
}
</style>

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
<script lang="ts">
import { Component, Emit, mixins, Prop } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'

export interface ErrorLink {
    text: string
    link: string
}

@Component
class ErrorAlert extends mixins(BaseMixin) {
    @Prop({
        type: String,
        default: 'my-5',
    })
    baseClass?: string

    @Prop({ default: '' }) readonly message!: string
    @Prop({ default: null }) readonly errorLink!: ErrorLink | null

    get errors() {
        return this.stores.errors.errors
    }

    get conflict() {
        return this.stores.errors.conflict
    }

    get conflictMessage() {
        return this.stores.errors.conflictMessage
    }

    get hasError(): boolean {
        return this.errors != null
    }

    get hasConflict(): boolean {
        return this.conflict != null
    }

    get errorMessage(): string {
        if (this.errors == null) {
            return ''
        } else if (this.message !== '') {
            return this.message
        } else if (this.errors && this.errors.data && this.errors.data.errorCode) {
            switch (this.errors.data.errorCode) {
                case 'ROOT_EMAIL_NOT_UNIQUE':
                case 'EMAIL_NOT_UNIQUE':
                    return 'This email address already exists in the system.  Do you want to log in instead?'
                case 'INVALID_CREDENTIALS':
                    return 'Invalid Credentials'
                case 'ROOT_USERNAME_NOT_UNIQUE':
                    return 'Username already exists in the system. Please try a different username.'
                case 'INVALID_NONCE_OR_MOBILE':
                    return 'There is something wrong with your verification code.'
                default:
                    return 'An error occurred. Please try again.'
            }
        } else {
            return 'An error occurred. Please try again.'
        }
    }

    @Emit('close') onClose() {
        this.stores.errors.RESET_ERROR()
    }
}

export default ErrorAlert
</script>

<style lang="scss" scoped>
.error-alert-link {
    text-transform: initial;
    color: #fff;
    text-decoration: underline;
}
</style>

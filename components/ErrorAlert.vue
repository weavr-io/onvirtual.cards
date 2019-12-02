<template>
  <div>
    <div v-if="hasError()">
      <div class="error-alert" role="alert">
        <p>
          {{ errorMessage }}
          <b-link
            v-if="errorLink != null"
            :to="errorLink.link"
            class="error-alert-link"
          >{{ errorLink.text }}</b-link>
        </p>
        <button @click="onClose">
          <img src="/img/close.svg" width="16" alt />
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import * as ErrorStore from '~/store/modules/Error'

const Error = namespace(ErrorStore.name)

export interface ErrorLink {
  text: string
  link: string
}

@Component
class ErrorAlert extends Vue {
  @Error.Getter errors

  @Error.Action resetErrors

  @Prop({ default: '' }) readonly message!: string

  @Prop({ default: null }) readonly errorLink!: ErrorLink | null

  @Emit('close') onClose() {
    this.resetErrors()
  }

  hasError(): boolean {
    return this.errors != null
  }

  get errorMessage(): string {
    if (this.errors == null) {
      return ''
    } else if (this.message !== '') {
      return this.message
    } else {
      console.log(this.errors.data)
      switch (this.errors.data.errorCode) {
        case 'ROOT_EMAIL_NOT_UNIQUE':
        case 'EMAIL_NOT_UNIQUE':
          return 'This email address already exists in the system.  Do you want to log in instead?'
        case 'INVALID_CREDENTIALS':
          return 'Invalid Credentials'
        default:
          return 'An error occurred. Please try again.'
      }
    }
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

<template>
  <section>
    <b-container>
      <b-row class="full-height-vh py-5" align-v="center">
        <b-col lg="6" offset-lg="3">
          <b-card no-body class="overflow-hidden">
            <b-card-body class="p-6">
              <div class="text-center">
                <h2 class="font-weight-lighter">
                  Reset Password
                </h2>
                <h5 class="font-weight-lighter mt-4">
                  Insert the email you created the account with and we’ll send you a reset link.
                </h5>
              </div>
              <error-alert />
              <b-form id="contact-form" @submit="resetPassword" class="mt-5">
                <b-form-group
                  id="ig-email"
                  :state="isInvalid($v.form.email)"
                  :invalid-feedback="invalidFeedback($v.form.email, 'email')"
                  label="Email:"
                  label-for="from-email"
                >
                  <b-form-input
                    id="from-email"
                    v-model="form.email"
                    :state="isInvalid($v.form.email)"
                    class="form-control"
                    type="email"
                    name="setEmail"
                  />
                </b-form-group>
                <div class="form-group mt-5 pt-1">
                  <loader-button :is-loading="isLoading" button-text="send reset link" class="text-center" />
                </div>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { required, email } from 'vuelidate/lib/validators'
import { BaseVue } from '~/base/classes/BaseVue'

import * as AuthStore from '~/store/modules/Auth'
import { LostPasswordStartRequest } from '~/api/Requests/Auth/LostPasswordStartRequest'

const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    form: {
      email: {
        required,
        email
      }
    }
  }
})
export default class ResetPasswordPage extends BaseVue {
  @Auth.Getter isLoading!: boolean

  protected form: LostPasswordStartRequest = {
    email: ''
  }

  resetPassword(evt) {
    evt.preventDefault()
    this.$v.$touch()
    if (!this.$v.$invalid) {
      AuthStore.Helpers.lostPasswordStart(this.$store, this.form).then(() => {
        this.$router.push('/password/sent')
      })
    }
  }

  mounted() {
    super.mounted()
  }
}
</script>

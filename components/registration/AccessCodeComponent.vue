<template>
  <b-col md="9" lg="6">
    <b-row class="my-5">
      <b-card body-class="p-6">
        <b-form @submit.prevent="tryToSubmitAccessCode">
          <h3 class="text-center font-weight-light mb-6">Enter the access code for registration</h3>
          <template v-if="inviteCodeError.showMsg">
            <b-alert show variant="danger" class="mb-4">
              {{ inviteCodeError.errorMsg }}
            </b-alert>
          </template>
          <div class="small text-center mb-6">
            If you need an access code please send us an email at <a href="mailto: sales@weavr.io">sales@weavr.io</a>
          </div>
          <b-form-group>
            <b-form-input
              v-model="$v.form.code.$model"
              :state="isInvalid($v.form.code)"
              placeholder="Enter your access code"
            />
            <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
          </b-form-group>
          <b-form-row class="mt-5">
            <b-col class="text-center">
              <b-overlay :show="isLoading" rounded="pill" class="d-inline-block" spinner-small>
                <b-button variant="secondary" type="submit">
                  submit
                  <span class="pl-5">-></span>
                </b-button>
              </b-overlay>
            </b-col>
          </b-form-row>
        </b-form>
      </b-card>
    </b-row>
  </b-col>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import { AxiosError } from 'axios'
import BaseMixin from '~/mixins/BaseMixin'
import { AccessCodeModel } from '~/plugins/weavr-multi/api/models/access-codes/models/AccessCodeModel'
import ValidationMixin from '~/mixins/ValidationMixin'

@Component({
  validations: {
    form: {
      code: { required },
    },
  },
})
export default class AccessCodeComponent extends mixins(BaseMixin, ValidationMixin) {
  form: AccessCodeModel = {
    code: null,
  }

  isLoading: boolean = false

  inviteCodeError: { errorMsg: string; showMsg: boolean } = {
    errorMsg: '',
    showMsg: false,
  }

  tryToSubmitAccessCode() {
    this.isLoading = true

    this.$v.$touch()
    if (this.$v.$invalid) {
      this.isLoading = false
      return
    }

    if (this.form.code) {
      this.form = {
        code: +this.form.code,
      }

      return this.stores.accessCodes
        .verifyAccessCode(this.form)
        .catch((err: AxiosError) => {
          const is403: boolean = err.response?.status === 403

          this.inviteCodeError = {
            errorMsg: is403 ? 'Invite code is invalid.' : 'An error occurred. Please try again.',
            showMsg: true,
          }

          this.form.code = null
        })
        .finally(() => {
          this.isLoading = false
          this.$v.$reset()
        })
    }
  }
}
</script>

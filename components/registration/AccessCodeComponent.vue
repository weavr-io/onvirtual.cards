<template>
  <b-col lg="6" offset-lg="3">
    <b-row class="my-5">
      <b-card body-class="p-6">
        <b-form @submit.prevent="tryToSubmitAccessCode">
          <h3 class="text-center font-weight-light mb-6">
            Enter the access code for registration
          </h3>
          <template v-if="showError">
            <b-alert show variant="danger" class="mb-4">
              An error occurred. Please try again.
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
import BaseMixin from '~/minixs/BaseMixin'
import { AccessCodeModel } from '~/plugins/weavr-multi/api/models/access-codes/models/AccessCodeModel'
import ValidationMixin from '~/minixs/ValidationMixin'

@Component({
  validations: {
    form: {
      code: { required }
    }
  }
})
export default class AccessCodeComponent extends mixins(BaseMixin, ValidationMixin) {
  form: AccessCodeModel = {
    code: null
  }

  isLoading: boolean = false

  showError: boolean = false

  tryToSubmitAccessCode() {
    this.isLoading = true

    this.$v.$touch()
    if (this.$v.$invalid) {
      this.isLoading = false
      return
    }

    if (this.form.code) {
      this.form = {
        code: +this.form.code
      }

      return this.stores.accessCodes
        .verifyAccessCode(this.form)
        .catch(() => {
          this.showError = true
          this.form.code = null
        })
        .finally(() => {
          this.isLoading = false
        })
    }
  }
}
</script>

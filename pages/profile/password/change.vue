<template>
  <section class="register-section">
    <div class="container">
      <div class="row mx-0">
        <div class="col-lg-6 offset-lg-3 my-5 text-center">
          <div class="p-relative">
            <div class="text-md d-inline-block text-center">
              <h1 class="font-weight-light">
                Change Password
              </h1>
            </div>
          </div>
        </div>
        <div class="col-lg-6 offset-lg-3 h-100 modal-div">
          <div class="mx-md-3 px-md-5">
            <error-alert />
            <b-form id="contact-form" @submit="submitChangePassword">
              <client-only placeholder="Loading...">
                <weavr-form ref="passwordForm" :class="{ 'is-dirty': $v.form.$dirty }">
                  <label class="d-block">OLD PASSWORD:</label>
                  <weavr-input
                    :options="{ placeholder: '****', classNames: { empty: 'is-invalid', invalid: 'is-invalid' } }"
                    :base-style="{
                      color: '#000',
                      fontSize: '13px',
                      fontSmoothing: 'antialiased',
                      fontFamily: '\'Be Vietnam\', sans-serif',
                      fontWeight: '300',
                      margin: '0',
                      padding: '0.375rem 0.75rem',
                      textIndent: '0px',
                      '::placeholder': {
                        color: '#bbc0c8',
                        fontWeight: '200'
                      }
                    }"
                    @onKeyUp="checkOnKeyUp"
                    class-name="sign-in-password"
                    name="old-password"
                    field="password"
                    required="true"
                  />
                  <label class="d-block mt-3">NEW PASSWORD:</label>
                  <weavr-input
                    :options="{ placeholder: '****', classNames: { empty: 'is-invalid', invalid: 'is-invalid' } }"
                    :base-style="{
                      color: '#000',
                      fontSize: '13px',
                      fontSmoothing: 'antialiased',
                      fontFamily: '\'Be Vietnam\', sans-serif',
                      fontWeight: '300',
                      margin: '0',
                      padding: '0.375rem 0.75rem',
                      textIndent: '0px',
                      '::placeholder': {
                        color: '#bbc0c8',
                        fontWeight: '200'
                      }
                    }"
                    @onKeyUp="checkOnKeyUp"
                    class-name="sign-in-password"
                    name="new-password"
                    field="password"
                    required="true"
                  />
                  <small class="form-text text-muted">Minimum 8, Maximum 50 characters.</small>
                </weavr-form>
              </client-only>

              <div class="text-center">
                <loader-button :is-loading="isLoading" button-text="Change Password" class="mt-5" />
              </div>
            </b-form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { required, maxLength, sameAs, minLength } from 'vuelidate/lib/validators'
import { BaseVue } from '~/base/classes/BaseVue'
import passwordComplexity from '~/plugins/customValidators/passwordComplexity'
import LoaderButton from '~/components/LoaderButton.vue'
import * as AuthStore from '~/store/modules/Auth'
import { UpdatePassword } from '~/api/Requests/Auth/UpdatePassword'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'

@Component({
  components: {
    LoaderButton,
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
  },
  validations: {
    form: {}
  }
})
export default class BundlesPage extends BaseVue {
  $refs!: {
    passwordForm: WeavrForm
  }

  public changePasswordRequest: UpdatePassword = {
    id: 0,
    request: {
      oldPassword: {
        value: ''
      },
      password: {
        value: ''
      }
    }
  }

  mounted() {
    const _id = AuthStore.Helpers.identityId(this.$store)
    if (_id) {
      this.changePasswordRequest.id = _id
    }
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.submitChangePassword(e)
    }
  }

  submitChangePassword(evt) {
    evt.preventDefault()

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    const form: WeavrForm = this.$refs.passwordForm as WeavrForm
    form.tokenize(
      (tokens) => {
        if (tokens['old-password'] !== '' && tokens['new-password']) {
          this.changePasswordRequest.request.oldPassword.value = tokens['old-password']
          this.changePasswordRequest.request.password.value = tokens['new-password']
          AuthStore.Helpers.updatePassword(this.$store, this.changePasswordRequest).then(() => {
            this.$router.push('/profile')
          })
        } else {
          return null
        }
      },
      (e) => {
        console.error(e)
        return null
      }
    )
  }
}
</script>

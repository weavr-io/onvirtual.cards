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
            <b-form id="contact-form" @submit="submitChangePassword">
              <b-form-group
                id="ig-current-password"
                :state="isInvalid($v.changePasswordRequest.request.oldPassword.value)"
                :invalid-feedback="invalidFeedback($v.changePasswordRequest.request.oldPassword.value, 'required')"
                label="Current Password"
                label-for="current-password"
              >
                <b-form-input
                  id="current-pass"
                  v-model="changePasswordRequest.request.oldPassword.value"
                  :state="isInvalid($v.changePasswordRequest.request.oldPassword.value)"
                  class="form-control"
                  type="password"
                  name="current-password"
                />
              </b-form-group>
              <b-form-group
                id="ig-new-password"
                :state="isInvalid($v.changePasswordRequest.request.password.value)"
                :invalid-feedback="invalidFeedback($v.changePasswordRequest.request.password.value, 'password')"
                label="New Password"
                label-for="new-password"
              >
                <b-form-input
                  id="new-pass"
                  v-model="changePasswordRequest.request.password.value"
                  :state="isInvalid($v.changePasswordRequest.request.password.value)"
                  class="form-control"
                  type="password"
                  name="new-pass"
                />
              </b-form-group>
              <b-form-group
                id="ig-conf-new-password"
                :state="isInvalid($v.changePasswordRequest.request.confirmPassword.value)"
                :invalid-feedback="
                  invalidFeedback($v.changePasswordRequest.request.confirmPassword.value, 'confirmPassword')
                "
                label="Confirm New Password"
                label-for="conf-new-pass"
              >
                <b-form-input
                  id="conf-new-pass"
                  v-model="changePasswordRequest.request.confirmPassword.value"
                  :state="isInvalid($v.changePasswordRequest.request.confirmPassword.value)"
                  class="form-control"
                  type="password"
                  name="conf-new-pass"
                />
              </b-form-group>
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

@Component({
  components: {
    LoaderButton,
  },
  validations: {
    changePasswordRequest: {
      request: {
        oldPassword: {
          value: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(30),
            passwordComplexity
          }
        },
        password: {
          value: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(30),
            passwordComplexity
          }
        },
        confirmPassword: {
          value: {
            required,
            minLength: minLength(8),
            maxLength: maxLength(30),
            passwordComplexity,
            sameAsPassword: sameAs(function() {
              // @ts-ignore
              return this.changePasswordRequest.request.password.value
            })
          }
        }
      }
    }
  }
})
export default class BundlesPage extends BaseVue {
  public changePasswordRequest: UpdatePassword = {
    id: 0,
    request: {
      oldPassword: {
        value: ''
      },
      password: {
        value: ''
      },
      confirmPassword: {
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

  submitChangePassword(evt) {
    evt.preventDefault()
    this.$v.$touch()
    if (!this.$v.$invalid) {
      AuthStore.Helpers.updatePassword(this.$store, this.changePasswordRequest).then(() => {
        this.$router.push('/profile')
      })
    }
  }
}
</script>

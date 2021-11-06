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
                <div :class="{ 'is-dirty': $v.form.$dirty }">
                  <label class="d-block">OLD PASSWORD:</label>
                  <weavr-password-input
                    ref="oldPassword"
                    :options="{ placeholder: '****', classNames: { empty: 'is-invalid', invalid: 'is-invalid' } }"
                    :base-style="passwordBaseStyle"
                    @onKeyUp="checkOnKeyUp"
                    class-name="sign-in-password"
                    name="old-password"
                    required="true"
                  />
                  <label class="d-block mt-3">NEW PASSWORD:</label>
                  <weavr-password-input
                    ref="newPassword"
                    :options="{ placeholder: '****', classNames: { empty: 'is-invalid', invalid: 'is-invalid' } }"
                    :base-style="passwordBaseStyle"
                    @onKeyUp="checkOnKeyUp"
                    class-name="sign-in-password"
                    name="new-password"
                    required="true"
                  />
                  <small class="form-text text-muted">Minimum 8, Maximum 50 characters.</small>
                </div>
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
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import LoaderButton from '~/components/LoaderButton.vue'
import { UpdatePassword } from '~/api/Requests/Auth/UpdatePassword'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/minixs/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

@Component({
  components: {
    LoaderButton,
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    WeavrPasswordInput
  },
  validations: {
    form: {}
  }
})
export default class BundlesPage extends mixins(BaseMixin) {
  @Ref('oldPassword')
  oldPassword!: WeavrPasswordInput

  @Ref('newPassword')
  newPassword!: WeavrPasswordInput

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
    const _id = this.stores.auth.identityId
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

    const promises: Promise<any>[] = []
    promises.push(this.oldPassword.createToken())
    promises.push(this.newPassword.createToken())

    Promise.all(promises).then((values) => {
      if (values[0].tokens['old-password'] !== '' && values[1].tokens['new-password']) {
        this.changePasswordRequest.request.oldPassword.value = values[0].tokens['old-password']
        this.changePasswordRequest.request.password.value = values[1].tokens['new-password']
        this.stores.auth.updatePassword(this.changePasswordRequest).then(() => {
          this.$router.push('/profile')
        })
      } else {
        return null
      }
    })
  }

  get passwordBaseStyle(): SecureElementStyleWithPseudoClasses {
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
        fontWeight: '400'
      }
    }
  }
}
</script>

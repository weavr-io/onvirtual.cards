<template>
  <section class="register-section">
    <b-container>
      <b-row align-h="center">
        <b-col md="9" lg="6" class="my-2 my-lg-5 text-center">
          <div class="text-md d-inline-block text-center mb-5 mb-lg-6">
            <h1 class="font-weight-light">Change Password</h1>
          </div>
          <div class="mx-md-3 px-md-5">
            <b-form id="contact-form" @submit.prevent="submitChangePassword">
              <client-only placeholder="Loading...">
                <div :class="{ 'is-dirty': $v.form.$dirty }">
                  <label class="d-block text-left">OLD PASSWORD:</label>
                  <weavr-password-input
                    ref="oldPassword"
                    :options="{ placeholder: '****', classNames: { invalid: 'is-invalid' } }"
                    :base-style="passwordBaseStyle"
                    class-name="sign-in-password"
                    name="old-password"
                    required="true"
                    @onKeyUp.prevent="checkOnKeyUp"
                    @onChange="oldPasswordInteraction"
                  />
                  <label class="d-block text-left mt-3">NEW PASSWORD:</label>
                  <weavr-password-input
                    ref="newPassword"
                    :options="{ placeholder: '****', classNames: { invalid: 'is-invalid' } }"
                    :base-style="passwordBaseStyle"
                    class-name="sign-in-password"
                    name="new-password"
                    required="true"
                    @onKeyUp.prevent="checkOnKeyUp"
                    @onChange="passwordInteraction"
                    @onStrength="strengthCheck"
                  />
                  <small
                    class="form-text mb-3 text-left"
                    :class="!isPasswordValidAndDirty ? 'text-danger' : 'text-muted'"
                    >- min 8 characters <br />- uppercase letter <br />- digit and a special character</small
                  >
                </div>
              </client-only>

              <div class="text-center">
                <loader-button :is-loading="isLoading" button-text="Change Password" class="mt-5" />
              </div>
            </b-form>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { required } from 'vuelidate/lib/validators'
import LoaderButton from '~/components/LoaderButton.vue'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/mixins/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import { UpdatePasswordRequestModel } from '~/plugins/weavr-multi/api/models/authentication/passwords/requests/UpdatePasswordRequestModel'

@Component({
  components: {
    LoaderButton,
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    WeavrPasswordInput,
  },
  validations: {
    form: {},
    changePasswordRequest: {
      oldPassword: {
        value: {
          required,
        },
      },
      newPassword: {
        value: {
          required,
        },
      },
    },
  },
})
export default class BundlesPage extends mixins(BaseMixin) {
  @Ref('oldPassword')
  oldPassword!: WeavrPasswordInput

  @Ref('newPassword')
  newPassword!: WeavrPasswordInput

  isLoading: boolean = false

  passwordStrength: number = 0

  changePasswordRequest: UpdatePasswordRequestModel = {
    oldPassword: {
      value: '',
    },
    newPassword: {
      value: '',
    },
  }

  get isPasswordValid(): boolean {
    return this.passwordStrength >= 2
  }

  get isPasswordValidAndDirty(): boolean {
    return !this.$v.changePasswordRequest.newPassword?.$dirty ? true : this.isPasswordValid
  }

  get isAnyPasswordEmpty(): boolean {
    return this.changePasswordRequest.oldPassword.value === '' || this.changePasswordRequest.newPassword.value === ''
  }

  oldPasswordInteraction(val: { empty: boolean; valid: boolean }) {
    !val.empty
      ? (this.changePasswordRequest.oldPassword.value = '******')
      : (this.changePasswordRequest.oldPassword.value = '')
    this.$v.changePasswordRequest.$touch()
  }

  passwordInteraction(val: { empty: boolean; valid: boolean }) {
    !val.empty
      ? (this.changePasswordRequest.newPassword.value = '******')
      : (this.changePasswordRequest.newPassword.value = '')
    this.$v.changePasswordRequest.$touch()
  }

  strengthCheck(val) {
    this.passwordStrength = val.id
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.submitChangePassword()
    }
  }

  async submitChangePassword() {
    let tokenizedOld = ''
    let tokenizedNew = ''

    this.$v.$touch()

    if (this.$v.$invalid) {
    }
    if (this.isPasswordValid && !this.isAnyPasswordEmpty) {
      this.isLoading = true

      await this.oldPassword.createToken().then((res) => {
        tokenizedOld = res.tokens['old-password']
      })
      await this.newPassword.createToken().then((res) => {
        tokenizedNew = res.tokens['new-password']
      })

      if (tokenizedOld && tokenizedNew) {
        this.changePasswordRequest.oldPassword.value = tokenizedOld
        this.changePasswordRequest.newPassword.value = tokenizedNew
        console.debug('ALL Settled', this.changePasswordRequest)
        this.stores.auth.validatePassword({ password: this.changePasswordRequest.newPassword }).then(() => {
          this.stores.auth
            .updatePassword(this.changePasswordRequest)
            .then(() => {
              this.showSuccessToast('Password changed successfully')
              this.$router.push('/profile')
            })
            .catch((err) => {
              const data = err.response.data
              const error = data.message ? data.message : data.errorCode

              this.showErrorToast(error)
            })
            .finally(() => {
              this.isLoading = false
            })
        })
      }
    }
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
        fontWeight: '400',
      },
    }
  }
}
</script>

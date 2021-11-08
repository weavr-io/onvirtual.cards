<template>
  <b-col lg="6" offset-lg="3">
    <div class="text-center pb-5">
      <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
    </div>
    <b-card body-class="p-6">
      <template v-if="showError">
        <b-alert show variant="danger">
          Some information is missing. Please make sure you copy the whole URL.
        </b-alert>
      </template>
      <template v-else>
        <h3 class="text-center font-weight-light mb-6">
          Accept Invite
        </h3>
        <error-alert />
        <b-form @submit="tryToSubmitForm">
          <client-only placeholder="Loading...">
            <label class="d-block">PASSWORD:</label>
            <weavr-password-input
              ref="passwordField"
              :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
              :base-style="passwordBaseStyle"
              class-name="sign-in-password"
              name="password"
              required="true"
              @onKeyUp="checkOnKeyUp"
            />
            <small class="form-text text-muted">Minimum 8, Maximum 50 characters.</small>
          </client-only>
          <b-form-row class="mt-6">
            <b-col class="text-center">
              <b-button variant="secondary" type="submit">
                submit
                <span class="pl-5">-></span>
              </b-button>
            </b-col>
          </b-form-row>
        </b-form>
      </template>
    </b-card>
  </b-col>
</template>
<script lang="ts">
import { Component, mixins, Ref } from 'nuxt-property-decorator'
import { ValidateCorporateUserInviteRequest } from '~/api/Requests/Corporates/ValidateCorporateUserInviteRequest'
import { ConsumeCorporateUserInviteRequest } from '~/api/Requests/Corporates/ConsumeCorporateUserInviteRequest'
import { SecureElementStyleWithPseudoClasses } from '~/plugins/weavr/components/api'
import BaseMixin from '~/minixs/BaseMixin'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'

@Component({
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    WeavrPasswordInput
  }
})
export default class IniteConsume extends mixins(BaseMixin) {
  protected form!: ConsumeCorporateUserInviteRequest

  showError: boolean = false

  @Ref('passwordField')
  passwordField!: WeavrPasswordInput

  // identity_type
  // identity_id
  // nonce
  // user_id
  // invite_id
  mounted() {
    try {
      const _validateRequest: ValidateCorporateUserInviteRequest = {
        id: this.$route.query.identity_id.toString(),
        inviteId: this.$route.query.invite_id.toString(),
        body: {
          nonce: this.$route.query.nonce.toString()
        }
      }

      this.stores.corporates.validateInvite(_validateRequest).catch(this.handleError.bind(this))
    } catch (e) {}
  }

  handleError(e) {
    this.stores.errors.SET_ERROR(e.response)
  }

  asyncData({ route }) {
    try {
      const _consumeInviteRequest: ConsumeCorporateUserInviteRequest = {
        id: route.query.identity_id.toString(),
        body: {
          nonce: route.query.nonce.toString(),
          identityId: {
            type: route.query.identity_type.toString(),
            id: route.query.identity_id.toString()
          },
          userId: route.query.user_id.toString(),
          password: {
            value: ''
          }
        }
      }

      return {
        form: _consumeInviteRequest,
        showError: false
      }
    } catch (e) {
      return {
        showError: true
      }
    }
  }

  tryToSubmitForm(e) {
    e.preventDefault()

    this.passwordField.createToken().then(
      (tokens) => {
        if (tokens.tokens.password !== '') {
          this.form.body.password.value = tokens.tokens.password
          this.stores.corporates.consumeInvite(this.form).then(() => {
            this.$router.push('/login')
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

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.tryToSubmitForm(e)
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
        fontWeight: '400'
      }
    }
  }
}
</script>

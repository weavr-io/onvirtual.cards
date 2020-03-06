<template>
  <b-form @submit="tryToSubmitForm">
    <h3 class="text-center font-weight-light mb-5">
      Register
    </h3>
    <b-form-group label="Username:">
      <b-form-input v-model="$v.form.rootUsername.$model" :state="isInvalid($v.form.rootUsername)" placeholder="Username" />
      <b-form-invalid-feedback>Only numbers and latin letters are accepted.</b-form-invalid-feedback>
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.rootEmail)" label="Email:">
      <b-form-input v-model="$v.form.rootEmail.$model" :state="isInvalid($v.form.rootEmail)" placeholder="name@email.com" />
      <b-form-invalid-feedback>An email address must contain a single @.</b-form-invalid-feedback>
    </b-form-group>
    <client-only placeholder="Loading...">
      <weavr-form ref="passwordForm" :class="{ 'is-dirty': $v.form.$dirty }">
        <label class="d-block">PASSWORD:</label>
        <weavr-input
          :options="{ placeholder: '****', classNames: { empty: 'is-invalid' } }"
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
          name="password"
          field="password"
          required="true"
        />
      </weavr-form>
    </client-only>
    <b-form-row class="mt-6">
      <b-col class="text-center">
        <b-button variant="secondary" type="submit">
          continue
          <span class="pl-5">-></span>
        </b-button>
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, Prop } from 'nuxt-property-decorator'
import { required, helpers, email, maxLength } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'

@Component({
  validations: {
    form: {
      rootUsername: {
        required,
        rootUsername: helpers.regex(
          'rootUsername',
          /^[a-zA-Z0-9_.*@-]*$|^[a-zA-Z0-9.!#$%&*+\/=?^_|~-]+@[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9_-]+)*$/
        ),
        maxLength: maxLength(20)
      },
      rootEmail: {
        required,
        email
      }
    }
  }
})
export default class RegisterForm1 extends VueWithRouter {
  @Prop() readonly request!: CorporatesSchemas.CreateCorporateRequest

  $refs!: {
    passwordForm: WeavrForm
  }

  public form = {
    rootUsername: '',
    rootEmail: '',
    password: ''
  }

  tryToSubmitForm(e) {
    e.preventDefault()

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    const form: WeavrForm = this.$refs.passwordForm as WeavrForm
    form.tokenize(
      (tokens) => {
        if (tokens.password !== '') {
          this.form.password = tokens.password

          this.submitForm(e)
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

  @Emit()
  submitForm(e) {
    return this.form
  }

  checkOnKeyUp(e) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this.tryToSubmitForm(e)
    }
  }
}
</script>

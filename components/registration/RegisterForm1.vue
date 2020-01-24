<template>
  <b-form novalidate @submit="submitForm">
    <h2 class="text-center font-weight-lighter mb-5">
      Register
    </h2>
    <b-form-group label="Username:" :state="isInvalid($v.form.rootUsername)">
      <b-form-input v-model="form.rootUsername" placeholder="Username" />
    </b-form-group>
    <b-form-group label="Email:" :state="isInvalid($v.form.rootEmail)">
      <b-form-input v-model="form.rootEmail" />
    </b-form-group>
    <b-form-group label="Password:" :state="isInvalid($v.form.password)">
      <b-form-input v-model="form.password" type="password" placeholder="****" />
    </b-form-group>
    <b-form-row class="mt-5">
      <b-col class="text-center">
        <b-button variant="primary" type="submit">
          Continue
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
      },
      password: {
        required
      }
    }
  }
})
export default class RegisterForm1 extends VueWithRouter {
  @Prop() readonly request!: CorporatesSchemas.CreateCorporateRequest

  mounted() {
    this.form.rootUsername = this.request.rootUsername
    this.form.rootEmail = this.request.rootEmail
  }

  public form = {
    rootUsername: '',
    rootEmail: '',
    password: ''
  }

  @Emit()
  submitForm(e) {
    e.preventDefault()

    if (this.$v.form) {
      this.$v.form.$touch()
      if (this.$v.form.$anyError) {
        return null
      }
    }

    return this.form
  }
}
</script>

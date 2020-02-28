<template>
  <b-form @submit="submitForm" novalidate>
    <h2 class="text-center font-weight-lighter mb-5">
      Personal Details
    </h2>
    <b-form-group :state="isInvalid($v.form.rootName)" label="First Name:">
      <b-form-input v-model="form.rootName" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.rootSurname)" label="Last Name:">
      <b-form-input v-model="form.rootSurname" />
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.rootMobileCountryCode)" label="Mobile Country Code:">
      <b-input-group prepend="+">
        <b-form-input v-model="form.rootMobileCountryCode" />
      </b-input-group>
    </b-form-group>
    <b-form-group :state="isInvalid($v.form.rootMobileNumber)" label="Mobile Number:">
      <b-form-input v-model="form.rootMobileNumber" />
    </b-form-group>
    <b-form-row class="mt-5">
      <b-col md="4">
        <b-button @click="goBack" variant="outline">
          <-
        </b-button>
      </b-col>
      <b-col class="text-right">
        <loader-button :is-loading="isLoading" button-text="Finish" class="text-right" />
      </b-col>
    </b-form-row>
  </b-form>
</template>
<script lang="ts">
import { Component, Emit, namespace } from 'nuxt-property-decorator'
import { required, maxLength } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { Prop } from '~/node_modules/nuxt-property-decorator'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import * as ConsumersStore from '~/store/modules/Consumers'

const Consumers = namespace(ConsumersStore.name)

@Component({
  validations: {
    form: {
      rootName: {
        required,
        maxLength: maxLength(100)
      },
      rootSurname: {
        required,
        maxLength: maxLength(100)
      },
      rootMobileCountryCode: {
        required
      },
      rootMobileNumber: {
        required
      }
    }
  },
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class PersonalDetailsForm extends VueWithRouter {
  $v

  @Prop() readonly request!: CorporatesSchemas.CreateCorporateRequest

  @Consumers.Getter isLoading!: boolean

  mounted() {
    this.form.rootName = this.request.rootName
    this.form.rootSurname = this.request.rootSurname
    this.form.rootTitle = this.request.rootTitle
    this.form.rootCompanyPosition = this.request.rootCompanyPosition
    this.form.rootMobileCountryCode = this.request.rootMobileCountryCode
    this.form.rootMobileNumber = this.request.rootMobileNumber
  }

  titleOptions = [
    { value: 'Mr', text: 'Mr' },
    { value: 'Mrs', text: 'Mrs' },
    { value: 'Ms', text: 'Ms' }
  ]

  public form = {
    rootName: '',
    rootSurname: '',
    rootTitle: '',
    rootCompanyPosition: '',
    rootMobileCountryCode: '',
    rootMobileNumber: ''
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

  @Emit()
  goBack(e) {
    e.preventDefault()
  }
}
</script>

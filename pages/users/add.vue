<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <h2 class="text-center font-weight-lighter mb-5">
            Invite User
          </h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" offset-md="3">
          <error-alert />
          <b-form @submit="doAdd">
            <b-form-row>
              <b-col>
                <b-form-group label="Name:">
                  <b-form-input v-model="$v.request.name.$model" :state="isInvalid($v.request.name)" />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Surname:">
                  <b-form-input v-model="$v.request.surname.$model" :state="isInvalid($v.request.surname)" />
                  <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Email:">
                  <b-form-input v-model="$v.request.email.$model" :state="isInvalid($v.request.email)" type="email" />
                  <b-form-invalid-feedback>This field is required and must be a valid email.</b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="MOBILE NUMBER:">
                  <vue-phone-number-input
                    :value="mobile.number"
                    :only-countries="mobileCountries"
                    :border-radius="0"
                    :error="numberIsValid === false"
                    color="#6C1C5C"
                    error-color="#F50E4C"
                    valid-color="#6D7490"
                    default-country-code="GB"
                    @update="phoneUpdate"
                  />
                  <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                    This field must be a valid mobile number.
                  </b-form-invalid-feedback>
                </b-form-group>
              </b-col>
            </b-form-row>
            <loader-button :is-loading="isLoading" button-text="send invite" class="mt-5 text-center" />
          </b-form>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { email, maxLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/mixins/BaseMixin'
import { CreateUserRequestModel } from '~/plugins/weavr-multi/api/models/users/requests/CreateUserRequestModel'
import { UserModel } from '~/plugins/weavr-multi/api/models/users/models/UserModel'
import { MobileModel } from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import ValidationMixin from '~/mixins/ValidationMixin'
import { Nullable } from '~/global'

const Countries = require('~/static/json/countries.json')

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    request: {
      name: {
        required,
        maxLength: maxLength(100)
      },
      surname: {
        required,
        maxLength: maxLength(100)
      },
      email: {
        required,
        email
      }
    }
  }
})
export default class AddCardPage extends mixins(BaseMixin, ValidationMixin) {
  isLoading: boolean = false

  mobile: Nullable<MobileModel> = {
    countryCode: null,
    number: null
  }

  numberIsValid: boolean | null = null

  request: Nullable<CreateUserRequestModel> = {
    name: null,
    surname: null,
    email: null,
    mobile: null,
    dateOfBirth: null
  }

  get mobileCountries(): string[] {
    return Countries.map((_c) => {
      return _c['alpha-2']
    })
  }

  async doAdd(evt) {
    evt.preventDefault()

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.request) {
      this.$v.request.$touch()
      if (this.$v.request.$anyError || !this.numberIsValid) {
        return null
      }
    }

    this.isLoading = true

    await this.stores.users
      .add(this.request as CreateUserRequestModel)
      .then((res) => {
        this.userAdded(res.data)
      })
      .catch((err) => {
        this.stores.errors.SET_ERROR(err)
        this.isLoading = false
      })
  }

  async userAdded(res: UserModel) {
    await this.stores.users.inviteSend(res.id)
    await this.$router.push('/users')
    this.isLoading = false
  }

  phoneUpdate(number) {
    this.mobile = {
      countryCode: '+' + number.countryCallingCode,
      number: number.phoneNumber
    }

    this.request.mobile = { ...this.mobile }
    this.numberIsValid = number.isValid
  }
}
</script>

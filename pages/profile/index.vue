<template>
  <section class="py-5">
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <template v-if="isConsumer">
            <b-form @submit="doUpdateConsumer" novalidate>
              <error-alert />
              <b-form-row>
                <b-col>
                  <b-form-group label="FIRST NAME">
                    <b-form-input v-model="consumer.name" class="form-control" placeholder="John" disabled />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="LAST NAME">
                    <b-form-input v-model="consumer.surname" class="form-control" placeholder="Doe" disabled />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="E-Mail">
                    <b-form-input
                      v-model="updateConsumer.request.email"
                      :state="isInvalid($v.updateConsumer.request.email)"
                      class="form-control"
                      placeholder="johndoe@email.com"
                    />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="MOBILE NUMBER">
                    <vue-phone-number-input
                      :value="mobile.mobileNumber"
                      @update="consumerPhoneUpdate"
                      :error="numberIsValid === false"
                      :border-radius="0"
                      :defaultCountryCode="mobile.mobileCountryCode"
                      color="#6C1C5C"
                      error-color="#F50E4C"
                      valid-color="#6D7490"
                    />
                    <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                      This field must be a valid mobile number.
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row class="my-4">
                <b-col class="text-center">
                  <b-link to="/profile/password/change" class="link">
                    Change password
                  </b-link>
                </b-col>
              </b-form-row>
              <b-row class="mt-5" align-v="center">
                <b-col class="text-center">
                  <loader-button :is-loading="isLoading" button-text="save" />
                </b-col>
              </b-row>
            </b-form>
          </template>
          <template v-if="isCorporate">
            <b-form @submit="doUpdateCorporate" novalidate>
              <error-alert />
              <b-form-row>
                <b-col>
                  <b-form-group label="FIRST NAME">
                    <b-form-input v-model="corporate.name" class="form-control" placeholder="John" disabled />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="LAST NAME">
                    <b-form-input v-model="corporate.surname" class="form-control" placeholder="Doe" disabled />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="E-Mail">
                    <b-form-input
                            v-model="updateCorporate.body.email"
                            :state="isInvalid($v.updateCorporate.body.email)"
                            class="form-control"
                            placeholder="johndoe@email.com"
                    />
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row>
                <b-col>
                  <b-form-group label="MOBILE NUMBER">
                    <vue-phone-number-input
                            :value="mobile.mobileNumber"
                            @update="corporatePhoneUpdate"
                            :error="numberIsValid === false"
                            :border-radius="0"
                            :defaultCountryCode="mobile.mobileCountryCode"
                            color="#6C1C5C"
                            error-color="#F50E4C"
                            valid-color="#6D7490"
                    />
                    <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                      This field must be a valid mobile number.
                    </b-form-invalid-feedback>
                  </b-form-group>
                </b-col>
              </b-form-row>
              <b-form-row class="my-4">
                <b-col class="text-center">
                  <b-link to="/profile/password/change" class="link">
                    Change password
                  </b-link>
                </b-col>
              </b-form-row>
              <b-row class="mt-5" align-v="center">
                <b-col class="text-center">
                  <loader-button :is-loading="isLoading" button-text="save" />
                </b-col>
              </b-row>
            </b-form>
          </template>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { email, required } from 'vuelidate/lib/validators'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { Corporate } from '~/api/Models/Corporates/Corporate'
import { UpdateConsumerRequest } from '~/api/Requests/Consumers/UpdateConsumerRequest'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { UpdateCorporateUserFullRequest } from '~/api/Requests/Corporates/UpdateCorporateUserFullRequest'

const Auth = namespace(AuthStore.name)
const Consumers = namespace(ConsumersStore.name)
const Corporates = namespace(CorporatesStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    updateConsumer: {
      request: {
        mobileNumber: {
          required
        },
        mobileCountryCode: { required },
        email: { required, email }
      }
    },
    updateCorporate: {
      body: {
        mobileNumber: {
          required
        },
        mobileCountryCode: { required },
        email: { required, email }
      }
    }
  }
})
export default class Profile extends VueWithRouter {
  @Auth.Action logout

  @Auth.Getter isConsumer!: boolean

  @Auth.Getter isCorporate!: boolean

  @Auth.Getter identityId!: number | null

  @Consumers.Getter consumer!: Consumer | null

  @Corporates.Getter corporate!: Corporate | null

  numberIsValid: boolean | null = null

  updateConsumer!: UpdateConsumerRequest
  updateCorporate!: UpdateCorporateUserFullRequest

  isLoading: boolean = false

  async asyncData({ store }) {
    const _id = AuthStore.Helpers.identityId(store)

    if (_id) {
      if (AuthStore.Helpers.isConsumer(store)) {
        const _consumer = await ConsumersStore.Helpers.get(store, _id)

        const _parsedNumber = parsePhoneNumberFromString(_consumer.data.mobileCountryCode + _consumer.data.mobileNumber)

        const _updateConsumerRequest: UpdateConsumerRequest = {
          consumerId: _id,
          request: {
            mobileCountryCode: _consumer.data.mobileCountryCode,
            mobileNumber: _consumer.data.mobileNumber,
            email: _consumer.data.email
          }
        }

        return {
          updateConsumer: _updateConsumerRequest,
          mobile: {
            mobileCountryCode: _parsedNumber?.country,
            mobileNumber: _consumer.data.mobileNumber
          }
        }
      } else if (AuthStore.Helpers.isCorporate(store)) {
        const _corporate = AuthStore.Helpers.auth(store)

        await CorporatesStore.Helpers.getCorporateDetails(store, _id)
        const _corporateUser = await CorporatesStore.Helpers.getUser(store, {
          corporateId: _id,
          userId: _corporate.credential!.id
        })

        const _parsedNumber = parsePhoneNumberFromString(
          _corporateUser.data.mobileCountryCode! + _corporateUser.data.mobileNumber!
        )

        const _updateCorporateRequest: UpdateCorporateUserFullRequest = {
          corporateId: _id,
          userId: _corporate.credential!.id,
          body: {
            mobileCountryCode: _corporateUser.data.mobileCountryCode,
            mobileNumber: _corporateUser.data.mobileNumber,
            email: _corporateUser.data.email
          }
        }

        return {
          updateCorporate: _updateCorporateRequest,
          mobile: {
            mobileCountryCode: _parsedNumber?.country,
            mobileNumber: _corporateUser.data.mobileNumber
          }
        }
      }
    }
  }

  mobile!: {
    mobileCountryCode: string
    mobileNumber: string
  }

  consumerPhoneUpdate(number) {
    this.$set(this.mobile, 'mobileNumber', number.formatNational ? number.formatNational : number.phoneNumber)
    this.updateConsumer.request.mobileNumber = number.phoneNumber
    this.numberIsValid = number.isValid
  }

  corporatePhoneUpdate(number) {
    this.$set(this.mobile, 'mobileNumber', number.formatNational ? number.formatNational : number.phoneNumber)
    this.updateCorporate.body.mobileNumber = number.phoneNumber
    this.numberIsValid = number.isValid
  }

  doUpdateConsumer(e) {
    e.preventDefault()

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.updateConsumer) {
      this.$v.updateConsumer.$touch()
      if (this.$v.updateConsumer.$anyError || !this.numberIsValid) {
        return null
      }
    }

    this.isLoading = true

    ConsumersStore.Helpers.update(this.$store, this.updateConsumer).then(() => {
      this.isLoading = false
    })
  }

  doUpdateCorporate(e) {
    e.preventDefault()

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.updateCorporate) {
      this.$v.updateCorporate.$touch()
      if (this.$v.updateCorporate.$anyError || !this.numberIsValid) {
        return null
      }
    }

    this.isLoading = true

    CorporatesStore.Helpers.updateUser(this.$store, this.updateCorporate).then(() => {
      this.isLoading = false
    })
  }
}
</script>

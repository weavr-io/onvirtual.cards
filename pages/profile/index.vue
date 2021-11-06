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
                    <b-form-input v-model="updateCorporate.body.name" class="form-control" placeholder="John" />
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="LAST NAME">
                    <b-form-input v-model="updateCorporate.body.surname" class="form-control" placeholder="Doe" />
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
import { Component, mixins } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import { parsePhoneNumberFromString } from 'libphonenumber-js'
import { email, required } from 'vuelidate/lib/validators'
import * as ConsumersStore from '~/store/modules/Consumers'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { UpdateConsumerRequest } from '~/api/Requests/Consumers/UpdateConsumerRequest'
import { UpdateCorporateUserFullRequest } from '~/api/Requests/Corporates/UpdateCorporateUserFullRequest'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, corporatesStore } from '~/utils/store-accessor'

const Consumers = namespace(ConsumersStore.name)

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
        email: {
          required,
          email
        }
      }
    },
    updateCorporate: {
      body: {
        mobileNumber: {
          required
        },
        mobileCountryCode: { required },
        email: {
          required,
          email
        }
      }
    }
  }
})
export default class Profile extends mixins(BaseMixin) {
  logout() {
    return this.stores.auth.logout()
  }

  get isConsumer() {
    return this.stores.auth.isConsumer
  }

  get isCorporate() {
    return this.stores.auth.isCorporate
  }

  get identityId() {
    return this.stores.auth.identityId
  }

  @Consumers.Getter consumer!: Consumer | null

  get corporate() {
    return this.stores.corporates.corporate
  }

  numberIsValid: boolean | null = null

  updateConsumer!: UpdateConsumerRequest
  updateCorporate!: UpdateCorporateUserFullRequest

  isLoading: boolean = false

  async asyncData({ store }) {
    const _id = authStore(store).identityId

    if (_id) {
      if (authStore(store).isConsumer) {
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
      } else if (authStore(store).isCorporate) {
        const _corporate = authStore(store).auth

        await corporatesStore(store).getCorporateDetails(_id)
        const _corporateUser = await corporatesStore(store).getUser({
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
            name: _corporateUser.data.name,
            surname: _corporateUser.data.surname,
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

    this.stores.corporates.updateUser(this.updateCorporate).then(() => {
      this.isLoading = false
    })
  }
}
</script>

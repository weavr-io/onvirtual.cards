<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <b-card class="border-0">
            <b-card-title class="mb-5 text-center font-weight-lighter">
              Update Card
            </b-card-title>
            <b-card-body>
              <b-form @submit.prevent="doUpdate">
                <b-form-row v-if="!isConsumer">
                  <b-col>
                    <b-form-group label="CARDHOLDER MOBILE NUMBER">
                      <vue-phone-number-input
                        :value="mobile.cardholderMobileNumber"
                        :error="numberIsValid === false"
                        :border-radius="0"
                        :default-country-code="mobile.countryCode"
                        color="#6C1C5C"
                        error-color="#F50E4C"
                        valid-color="#6D7490"
                        @update="phoneUpdate"
                      />
                      <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                        This field must be a valid mobile number.
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col>
                    <b-form-group label="CUSTOM CARD NAME">
                      <b-form-input
                        v-model="$v.updateManagedCardRequest.friendlyName.$model"
                        :state="isInvalid($v.updateManagedCardRequest.friendlyName)"
                        placeholder="eg. travel expenses"
                      />
                      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <loader-button :is-loading="isLoading" button-text="next" class="mt-5 text-center" />
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { helpers, maxLength, required, requiredIf } from 'vuelidate/lib/validators'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import BaseMixin from '~/minixs/BaseMixin'
import { UpdateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCardRequest'
import ValidationMixin from '~/minixs/ValidationMixin'

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    updateManagedCardRequest: {
      friendlyName: {
        required,
        maxLength: maxLength(50)
      },
      cardholderMobileNumber: {
        // eslint-disable-next-line
        requiredIf: requiredIf(function() {
          // @ts-ignore
          return !this.isConsumer
        }),
        cardholderMobileNumber: helpers.regex('cardholderMobileNumber', /^\+[0-9]+$/)
      },
      nameOnCard: {
        // eslint-disable-next-line
        requiredIf: requiredIf(function() {
          // @ts-ignore
          return !this.isConsumer
        }),
        maxLength: maxLength(30)
      }
    }
  }
})
export default class EditCardPage extends mixins(BaseMixin, ValidationMixin) {
  numberIsValid: boolean | null = null
  mobile = {
    countryCode: 'GB',
    cardholderMobileNumber: ''
  }

  isUpdating = false
  updateManagedCardRequest: UpdateManagedCardRequest = {}

  async fetch() {
    const card = await this.stores.cards.getManagedCard(this.cardId)
    const parsedNumber = parsePhoneNumberFromString(card.data.cardholderMobileNumber)

    this.updateManagedCardRequest = {
      friendlyName: card.data.friendlyName
    }
    this.mobile.countryCode = parsedNumber?.country || ''
    this.mobile.cardholderMobileNumber = parsedNumber?.nationalNumber.toString() || ''
  }

  get isLoading() {
    return this.stores.cards.isLoading || this.isUpdating || this.$fetchState.pending
  }

  get auth() {
    return this.stores.auth.auth
  }

  get cardId() {
    return this.$route.params.id
  }

  doUpdate() {
    if (this.isConsumer) {
      this.numberIsValid = true
    }

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.updateManagedCardRequest) {
      this.$v.updateManagedCardRequest.$touch()
      if (this.$v.updateManagedCardRequest.$anyError || !this.numberIsValid) {
        return
      }
    }
    this.isUpdating = true

    this.stores.cards
      .update({
        id: this.cardId,
        request: this.updateManagedCardRequest
      })
      .then(() => {
        try {
          this.$segment.track('Card Updated', this.updateManagedCardRequest)
        } catch (e) {}
        this.$router.push('/managed-cards')
      })
      .finally(() => {
        this.isUpdating = false
      })
  }

  phoneUpdate(number) {
    this.$set(this.mobile, 'cardholderMobileNumber', number.formatNational ? number.formatNational : number.phoneNumber)
    this.updateManagedCardRequest.cardholderMobileNumber = number.formattedNumber
    this.numberIsValid = number.isValid
  }
}
</script>

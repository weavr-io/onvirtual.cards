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
              <b-form @submit="doAdd">
                <b-form-row v-if="!isConsumer">
                  <b-col>
                    <b-form-group label="Name of Person using Card">
                      <b-form-input
                        v-model="$v.updateManagedCardRequest.body.nameOnCard.$model"
                        :state="isInvalid($v.updateManagedCardRequest.body.nameOnCard)"
                        placeholder="eg. Elon Musk"
                        disabled
                      />
                      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
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
                        v-model="$v.updateManagedCardRequest.body.friendlyName.$model"
                        :state="isInvalid($v.updateManagedCardRequest.body.friendlyName)"
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
import { cardsStore } from '~/utils/store-accessor'
import { UpdateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/UpdateManagedCardRequest'

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    updateManagedCardRequest: {
      body: {
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
  }
})
export default class AddCardPage extends mixins(BaseMixin) {
  get isLoading() {
    return this.stores.cards.isLoading
  }

  get auth() {
    return this.stores.auth.auth
  }

  numberIsValid: boolean | null = null
  mobile = {
    countryCode: 'GB',
    cardholderMobileNumber: ''
  }

  updateManagedCardRequest!: UpdateManagedCardRequest

  get cardId() {
    return this.$route.params.id
  }

  doAdd(evt) {
    evt.preventDefault()

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
  }

  async asyncData({ store, route }) {
    const _cardId = route.params.id

    const _card = await cardsStore(store).getManagedCard(_cardId)

    const _parsedNumber = parsePhoneNumberFromString(_card.data.cardholderMobileNumber)

    return {
      cardId: _cardId,
      mobile: {
        countryCode: _parsedNumber?.country,
        cardholderMobileNumber: _parsedNumber?.nationalNumber
      }
    }
  }

  phoneUpdate(number) {
    this.$set(this.mobile, 'cardholderMobileNumber', number.formatNational ? number.formatNational : number.phoneNumber)
    this.updateManagedCardRequest.cardholderMobileNumber = number.formattedNumber
    this.numberIsValid = number.isValid
  }
}
</script>

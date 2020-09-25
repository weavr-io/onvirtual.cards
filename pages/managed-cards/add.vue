<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <b-card class="border-0">
            <b-card-title class="mb-5 text-center font-weight-lighter">
              Create Card
            </b-card-title>
            <b-card-body>
              <b-alert :show="showError" variant="danger">
                Error creating new card. Contact support if problem persists.
              </b-alert>
              <b-form @submit="doAdd" v-if="!showError">
                <b-form-row v-if="showNameOnCardField">
                  <b-col>
                    <b-form-group label="Name of Person using Card">
                      <b-form-input
                        :state="isInvalid($v.createManagedCardRequest.nameOnCard)"
                        v-model="$v.createManagedCardRequest.nameOnCard.$model"
                        placeholder="eg. Elon Musk"
                      />
                      <b-form-invalid-feedback v-if="!$v.createManagedCardRequest.nameOnCard.required">
                        Name on Card is required.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback v-if="!$v.createManagedCardRequest.nameOnCard.maxLength">
                        Name on Card too long.
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row v-if="!isConsumer">
                  <b-col>
                    <b-form-group label="CARDHOLDER MOBILE NUMBER">
                      <vue-phone-number-input
                        v-model="createManagedCardRequest.formattedMobileNumber"
                        @update="phoneUpdate"
                        :error="numberIsValid === false"
                        :border-radius="0"
                        color="#6C1C5C"
                        error-color="#F50E4C"
                        valid-color="#6D7490"
                        default-country-code="GB"
                      />
                      <b-form-invalid-feedback v-if="numberIsValid === false" force-show>
                        This field must be a valid mobile number.
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col>
                    <b-form-group label="ADD A CUSTOM CARD NAME">
                      <b-form-input
                        :state="isInvalid($v.createManagedCardRequest.friendlyName)"
                        v-model="$v.createManagedCardRequest.friendlyName.$model"
                        placeholder="eg. travel expenses"
                      />
                      <b-form-invalid-feedback v-if="!$v.createManagedCardRequest.friendlyName.required">
                        Friendly Name is required.
                      </b-form-invalid-feedback>
                      <b-form-invalid-feedback v-if="!$v.createManagedCardRequest.friendlyName.maxLength">
                        Friendly Name too long.
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <loader-button :is-loading="isAdding" button-text="next" class="mt-5 text-center" />
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { namespace } from 'vuex-class'
import { Component, mixins } from 'nuxt-property-decorator'
import { helpers, maxLength, required, requiredIf } from 'vuelidate/lib/validators'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import config from '~/config'
import { Schemas } from '~/api/Schemas'
import BaseMixin from '~/minixs/BaseMixin'
import { accountsStore } from '~/utils/store-accessor'
import LoginResult = Schemas.LoginResult

const Auth = namespace(AuthStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    createManagedCardRequest: {
      friendlyName: {
        required,
        maxLength: maxLength(50)
      },
      cardholderMobileNumber: {
        cardholderMobileNumber: helpers.regex('cardholderMobileNumber', /^\+[0-9]+$/),
        requiredIf: requiredIf(function() {
          // @ts-ignore
          return !this.isConsumer
        })
      },
      nameOnCard: {
        required,
        maxLength: maxLength(27)
      }
    }
  }
})
export default class AddCardPage extends mixins(BaseMixin) {
  @Auth.Getter auth!: LoginResult

  @Auth.Getter isConsumer!: boolean

  showNameOnCardField: boolean = false

  showError: boolean = false

  isAdding: boolean = false

  currencyOptions = [
    { value: 'EUR', text: 'EUR' },
    { value: 'GBP', text: 'GBP' }
  ]

  numberIsValid: boolean | null = null
  cardholderMobileNumber = ''

  public createManagedCardRequest!: ManagedCardsSchemas.CreateManagedCardRequest

  doAdd(evt) {
    evt.preventDefault()

    if (this.isAdding) {
      return
    }

    if (this.isConsumer) {
      this.numberIsValid = true
    }

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    if (this.$v.createManagedCardRequest) {
      this.$v.createManagedCardRequest.$touch()
      if (this.$v.createManagedCardRequest.$anyError || !this.numberIsValid) {
        return
      }
    }

    this.isAdding = true
    this.stores.cards.addCard(this.createManagedCardRequest).then(
      () => {
        try {
          this.$segment.track('Card Added', this.createManagedCardRequest)
        } catch (e) {}
        this.$router.push('/managed-cards')
      },
      (err) => {
        this.isAdding = false
        if (err.response.status) {
          this.showError = true
        }
      }
    )
  }

  mounted() {
    this.createManagedCardRequest.profileId = AuthStore.Helpers.isConsumer(this.$store)
      ? config.profileId.managed_cards_consumers
      : config.profileId.managed_cards_corporates

    try {
      this.$segment.track('Initiated Add Card', {})
    } catch (e) {}
  }

  async asyncData({ store }) {
    const _accounts = await accountsStore(store).index()

    const createManagedCardRequest: ManagedCardsSchemas.CreateManagedCardRequest = {
      profileId: AuthStore.Helpers.isConsumer(store)
        ? config.profileId.managed_cards_consumers
        : config.profileId.managed_cards_corporates,
      friendlyName: '',
      currency: 'EUR',
      nameOnCard: '',
      cardholderMobileNumber: ''
    }

    if (_accounts.data.count >= 1) {
      createManagedCardRequest.currency = _accounts.data.account[0].currency
    }

    if (AuthStore.Helpers.isConsumer(store)) {
      const _consumer = await ConsumersStore.Helpers.get(store, AuthStore.Helpers.identity(store).id)
      createManagedCardRequest.nameOnCard = _consumer.data.name + ' ' + _consumer.data.surname
      createManagedCardRequest.cardholderMobileNumber = _consumer.data.mobileCountryCode + _consumer.data.mobileNumber
    }

    let _showNameOnCardField: boolean = false
    if (!AuthStore.Helpers.isConsumer(store)) {
      _showNameOnCardField = true
    } else if (createManagedCardRequest.nameOnCard && createManagedCardRequest.nameOnCard.length > 27) {
      _showNameOnCardField = true
    } else {
      _showNameOnCardField = false
    }

    return {
      createManagedCardRequest: createManagedCardRequest,
      showNameOnCardField: _showNameOnCardField
    }
  }

  phoneUpdate(number) {
    this.createManagedCardRequest.cardholderMobileNumber = '+' + number.countryCallingCode + number.nationalNumber
    this.numberIsValid = number.isValid
  }
}
</script>

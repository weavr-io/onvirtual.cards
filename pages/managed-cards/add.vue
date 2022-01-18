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
              <pre>
                {{ createManagedCardRequest }}
              </pre>
              <b-form v-if="!showError" @submit.prevent="doAdd">
                <b-form-row v-if="showNameOnCardField">
                  <b-col>
                    <b-form-group label="Name of Person using Card">
                      <b-form-input
                        v-model="$v.createManagedCardRequest.nameOnCard.$model"
                        :state="isInvalid($v.createManagedCardRequest.nameOnCard)"
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
                        :value="mobile.number"
                        :error="numberIsValid === false"
                        :border-radius="0"
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
                <b-form-row>
                  <b-col>
                    <b-form-group :state="isInvalid($v.createManagedCardRequest.currency)" label="Currency">
                      <b-form-select v-model="$v.createManagedCardRequest.currency.$model" :options="currencyOptions" />
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col>
                    <b-form-group label="ADD A CUSTOM CARD NAME">
                      <b-form-input
                        v-model="$v.createManagedCardRequest.friendlyName.$model"
                        :state="isInvalid($v.createManagedCardRequest.friendlyName)"
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
                <loader-button
                  :is-loading="isAdding"
                  :disabled="$v.$invalid || numberIsValid"
                  button-text="next"
                  class="mt-5 text-center"
                />
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
import { maxLength, required } from 'vuelidate/lib/validators'
import BaseMixin from '~/minixs/BaseMixin'
import { accountsStore, authStore, consumersStore } from '~/utils/store-accessor'
import { CreateManagedCardRequest } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/requests/CreateManagedCardRequest'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'
import { ConsumerModel } from '~/plugins/weavr-multi/api/models/identities/consumers/models/ConsumerModel'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/AddressModel'
import { ManagedInstrumentStateEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/enums/ManagedInstrumentStateEnum'

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
      currency: {
        required
      },
      // cardholderMobileNumber: {
      //   cardholderMobileNumber: helpers.regex('cardholderMobileNumber', /^\+[0-9]+$/),
      //   // eslint-disable-next-line
      //   requiredIf: requiredIf(function() {
      //     // @ts-ignore
      //     return !this.isConsumer
      //   })
      // },
      nameOnCard: {
        required,
        maxLength: maxLength(27)
      }
    }
  },
  middleware: ['kyVerified']
})
export default class AddCardPage extends mixins(BaseMixin) {
  showNameOnCardField: boolean = false

  showError: boolean = false

  isAdding: boolean = false

  mobile: {
    countryCode: string
    number: string
  } = {
    countryCode: '',
    number: ''
  }

  numberIsValid: boolean | null = null

  createManagedCardRequest!: CreateManagedCardRequest

  async asyncData({ store, $config }) {
    const accounts = await accountsStore(store).index({
      profileId: authStore(store).isConsumer
        ? $config.profileId.managed_accounts_consumers!
        : $config.profileId.managed_accounts_corporates!,
      state: ManagedInstrumentStateEnum.ACTIVE,
      offset: '0'
    })

    const createManagedCardRequest: Nullable<CreateManagedCardRequest> = {
      profileId: authStore(store).isConsumer
        ? $config.profileId.managed_cards_consumers!
        : $config.profileId.managed_cards_corporates!,
      friendlyName: null,
      currency: null,
      nameOnCard: null,
      cardholderMobileNumber: null,
      billingAddress: null,
      mode: ManagedCardModeEnum.PREPAID_MODE
    }

    if (+accounts.data.count! >= 1 && accounts.data.accounts) {
      createManagedCardRequest.currency = accounts.data.accounts[0].currency as CurrencyEnum
    }

    if (authStore(store).isConsumer) {
      const _consumer: ConsumerModel = consumersStore(store).consumer as ConsumerModel
      createManagedCardRequest.nameOnCard = _consumer.rootUser.name + ' ' + _consumer.rootUser.surname
      createManagedCardRequest.cardholderMobileNumber =
        _consumer.rootUser.mobile.countryCode + _consumer.rootUser.mobile.number
    }

    const _showNameOnCardField =
      !authStore(store).isConsumer ||
      (createManagedCardRequest.nameOnCard && createManagedCardRequest.nameOnCard.length > 27)

    return {
      createManagedCardRequest,
      showNameOnCardField: _showNameOnCardField
    }
  }

  get auth() {
    return this.stores.auth.auth
  }

  doAdd() {
    if (this.isAdding) {
      return
    }

    if (this.isConsumer) {
      this.numberIsValid = true
    }

    if (this.numberIsValid === null) {
      this.numberIsValid = false
    }

    this.$v.$touch()
    if (this.$v.$invalid || !this.numberIsValid) {
      return
    }

    this.isAdding = true

    this.createManagedCardRequest.billingAddress = {
      ...(this.isConsumer
        ? (this.stores.consumers.consumer?.rootUser.address as AddressModel)
        : (this.stores.corporates.corporate?.company.businessAddress as AddressModel))
    }

    this.stores.cards
      .addCard(this.createManagedCardRequest)
      .then(() => {
        try {
          this.$segment.track('Card Added', this.createManagedCardRequest)
        } catch (e) {}
        this.$router.push('/managed-cards')
      })
      .catch((err) => {
        this.isAdding = false
        if (err.response.status) {
          this.showError = true
        }
      })
  }

  currencyOptions = [
    {
      value: 'EUR',
      text: 'Euro - EUR'
    },
    {
      value: 'GBP',
      text: 'Great Britain Pound - GBP'
    },
    {
      value: 'USD',
      text: 'US Dollars - USD'
    }
  ]

  mounted() {
    try {
      this.$segment.track('Initiated Add Card', {})
    } catch (e) {}
  }

  phoneUpdate(number) {
    this.mobile.number = number.phoneNumber
    this.mobile.countryCode = number.countryCallingCode
    this.createManagedCardRequest.cardholderMobileNumber = '+' + number.countryCallingCode + number.phoneNumber
    this.numberIsValid = number.isValid
  }
}
</script>

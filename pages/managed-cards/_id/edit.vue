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
                <b-form-row>
                  <b-col>
                    <b-form-group label="Name of Person using Card:">
                      <b-form-input
                        :state="isInvalid($v.request.body.nameOnCard)"
                        v-model="$v.request.body.nameOnCard.$model"
                        placeholder="eg. Elon Musk"
                        disabled
                      />
                      <b-form-invalid-feedback>This field is required.</b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col>
                    <b-form-group label="CARDHOLDER MOBILE NUMBER:">
                      <vue-phone-number-input
                        v-model="$v.request.body.formattedMobileNumber.$model"
                        @update="phoneUpdate"
                        :error="mobileNumberState()"
                        :border-radius="0"
                        error-color="#F50E4C"
                        color="#6D7490"
                        valid-color="#6D7490"
                      />
                      <b-form-invalid-feedback v-if="mobileNumberState()" force-show>
                        This field must be a valid mobile number.
                      </b-form-invalid-feedback>
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col>
                    <b-form-group label="ADD A CUSTOM CARD NAME:">
                      <b-form-input
                        :state="isInvalid($v.request.body.friendlyName)"
                        v-model="$v.request.body.friendlyName.$model"
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
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { helpers, maxLength, required } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CardsStore from '~/store/modules/Cards'
import * as AuthStore from '~/store/modules/Auth'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import config from '~/config'
import { Schemas } from '~/api/Schemas'
import { UpdateManagedCardRequest } from '~/api/Requests/ManagedCards/UpdateManagedCardRequest'
import LoginResult = Schemas.LoginResult

const Cards = namespace(CardsStore.name)
const Auth = namespace(AuthStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    request: {
      body: {
        friendlyName: {
          required,
          maxLength: maxLength(50)
        },
        cardholderMobileNumber: {
          required,
          cardholderMobileNumber: helpers.regex('cardholderMobileNumber', /^\+[0-9]+$/)
        },
        nameOnCard: {
          required,
          maxLength: maxLength(30)
        },
        formattedMobileNumber: {
          required
        }
      }
    }
  }
})
export default class AddCardPage extends VueWithRouter {
  @Cards.Action addCard

  @Cards.Getter isLoading

  @Auth.Getter auth!: LoginResult

  numberIsValid: boolean = false
  cardholderMobileNumber = ''

  mobileNumberState(): boolean {
    // @ts-ignore
    return !this.isInvalid(this.$v.request.body.formattedMobileNumber) || !this.numberIsValid
  }

  public request!: UpdateManagedCardRequest

  doAdd(evt) {
    evt.preventDefault()

    if (this.$v.request) {
      this.$v.request.$touch()
      if (this.$v.request.$anyError || this.mobileNumberState()) {
        return
      }
    }

    CardsStore.Helpers.update(this.$store, this.request).then(() => {
      try {
        this.$segment.track('Card Updated', this.request)
      } catch (e) {}
      this.$router.push('/managed-cards')
    })
  }

  phoneUpdate(number) {
    this.request.body.cardholderMobileNumber = '+' + number.countryCallingCode + number.nationalNumber
    this.numberIsValid = number.isValid
  }

  async asyncData({ store, route }) {
    const _cardId = route.params.id

    const _card = await CardsStore.Helpers.getManagedCard(store, _cardId)

    const request: UpdateManagedCardRequest = {
      id: _cardId,
      body: {
        ..._card.data,
        formattedMobileNumber: ''
      }
    }

    return { cardId: _cardId, request: request }
  }
}
</script>

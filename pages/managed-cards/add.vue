<template>
  <section>
    <b-container>
      <b-row>
        <b-col md="6" offset-md="3">
          <b-card class="border-0">
            <b-card-title class="mb-5 text-center font-weight-lighter">
              Add Managed Card
            </b-card-title>
            <b-card-body>
              <b-form @submit="doAdd">
                <b-form-row>
                  <b-col>
                    <b-form-group :state="isInvalid($v.request.friendlyName)" label="Friendly Name:">
                      <b-form-input v-model="request.friendlyName" />
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col>
                    <b-form-group :state="isInvalid($v.request.currency)" label="Currency:">
                      <b-form-select v-model="request.currency" :options="currencyOptions" />
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <b-form-row>
                  <b-col>
                    <b-form-group :state="isInvalid($v.request.nameOnCard)" label="Name on Card:">
                      <b-form-input v-model="request.nameOnCard" />
                    </b-form-group>
                  </b-col>
                </b-form-row>
                <loader-button :is-loading="isLoading" button-text="Add" class="mt-5 text-center" />
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
import { maxLength, required } from 'vuelidate/lib/validators'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CardsStore from '~/store/modules/Cards'
import * as AuthStore from '~/store/modules/Auth'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import config from '~/config'

const Cards = namespace(CardsStore.name)
const Auth = namespace(AuthStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  },
  validations: {
    request: {
      friendlyName: {
        required,
        maxLength: maxLength(50)
      },
      currency: {
        required
      },
      nameOnCard: {
        required,
        maxLength: maxLength(30)
      }
    }
  }
})
export default class AddCardPage extends VueWithRouter {
  @Cards.Action addCard

  @Cards.Getter isLoading

  @Auth.Getter corporateId

  currencyOptions = [
    { value: 'EUR', text: 'EUR' },
    { value: 'GBP', text: 'GBP' }
  ]

  public request: ManagedCardsSchemas.CreateManagedCardRequest = {
    profileId: 0,
    owner: {
      type: 'corporates',
      id: 0
    },
    friendlyName: '',
    currency: 'EUR',
    fiProvider: 'paynetics',
    channelProvider: 'gps',
    nameOnCard: '',
    createNow: true
  }

  doAdd(evt) {
    evt.preventDefault()

    if (this.$v.request) {
      this.$v.request.$touch()
      if (this.$v.request.$anyError) {
        return
      }
    }

    this.addCard(this.request).then(() => {
      this.$segment.track('Card Added', this.request)
      this.$appcues().track('Card Added', this.request)
      this.$userpilot().track('Card Added', this.request)
      this.$router.push('/managed-cards')
    })
  }

  mounted() {
    super.mounted()
    this.request.owner.id = this.corporateId
    this.request.profileId = config.profileId.managed_cards

    this.$segment.track('Initiated Add Card', {})
    this.$appcues().track('Initiated Add Card', {})
    this.$userpilot().track('Initiated Add Card', {})
  }
}
</script>

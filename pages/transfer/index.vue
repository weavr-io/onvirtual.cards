<template>
  <b-container class="py-5">
    <b-row>
      <b-col md="6" offset-md="3">
        <div class="topup-screens">
          <div v-if="screen === 0" class="topup-screen">
            <account-selection @submit-form="accountSelected" />
          </div>
          <div v-if="screen === 1" class="topup-screen">
            <top-up :selected-account="createTransferRequest.source" @submit-form="topUpSelected" />
          </div>
          <div v-if="screen === 2" class="topup-screen">
            <top-up-success />
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CardsStore from '~/store/modules/Cards'
import * as AccountsStore from '~/store/modules/Accounts'
import * as TransfersStore from '~/store/modules/Transfers'
import { TransfersSchemas } from '~/api/TransfersSchemas'
import config from '~/config'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

const Accounts = namespace(AccountsStore.name)
const Cards = namespace(CardsStore.name)
const Transfers = namespace(TransfersStore.name)

@Component({
  components: {
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    AccountSelection: () => import('~/components/transfer/AccountSelection.vue'),
    TopUp: () => import('~/components/transfer/TopUp.vue'),
    TopUpSuccess: () => import('~/components/transfer/TopUpSuccess.vue')
  }
})
export default class CardsPage extends VueWithRouter {
  @Cards.Getter cards

  @Accounts.Getter accounts?: ManagedAccountsSchemas.ManagedAccounts

  @Transfers.Action execute

  screen: number = 1

  nextScreen() {
    this.screen++
  }

  accountSelected(_data) {
    if (_data != null) {
      this.createTransferRequest.source.type = _data.source.type
      this.createTransferRequest.source.id = _data.source.id
      this.nextScreen()
    }
  }

  topUpSelected(_data) {
    if (_data != null) {
      this.createTransferRequest.destinationAmount.amount = _data.amount * 100
      this.doTransfer()
    }
  }

  public createTransferRequest!: TransfersSchemas.CreateTransferRequest

  get formattedCards(): { value: string; text: string }[] {
    return this.cards.map((val) => {
      return {
        value: val.id.id,
        text: val.friendlyName
      }
    })
  }

  public accountTypes = [
    {
      value: 'managed_accounts',
      text: 'Managed Accounts'
    },
    {
      value: 'managed_cards',
      text: 'Managed Cards'
    }
  ]

  mounted() {
    try {
      this.$segment.track('Initiated Transfer', {})
    } catch (e) {}
  }

  async asyncData({ store, route }) {
    await store.dispatch('cards/getCards')
    const _accounts = await store.dispatch('accounts/index')

    const request: TransfersSchemas.CreateTransferRequest = {
      profileId: config.profileId.transfers,
      source: _accounts.data.account[0].id,
      destination: {
        type: 'managed_cards',
        id: route.query.destination
      },
      destinationAmount: {
        currency: _accounts.data.account[0].currency,
        amount: 0
      }
    }

    return {
      createTransferRequest: request
    }
  }

  doTransfer() {
    this.execute(this.createTransferRequest)
      .then(() => {
        this.createTransferRequest = {
          profileId: null,
          source: {
            type: 'managed_accounts',
            id: null
          },
          destination: {
            type: 'managed_cards',
            id: null
          },
          destinationAmount: {
            currency: 'EUR',
            amount: 0
          }
        }
        this.screen = 2

        try {
          this.$segment.track('Transfer Success', this.createTransferRequest)
        } catch (e) {}
      })
      .catch((err) => {
        this.screen = 1

        const data = err.response.data

        let error = data.message ? data.message : data.errorCode

        if (error === 'DENIED_BY_INSTRUMENT') {
          error = 'Amount is higher than available balance'
        }

        this.$weavrToastError(error)
      })
  }
}
</script>
<style lang="scss" scoped>
label > span {
  width: 100%;
}
</style>

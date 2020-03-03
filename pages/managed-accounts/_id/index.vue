import { KYBState } from '~/api/Enums/KYBState'
<template>
  <div>
    <section v-if="showKybAlert">
      <b-container>
        <b-row>
          <b-col class="py-5 text-center">
            <div v-if="corporate.kyb.fullCompanyChecksVerified === 'NOT_STARTED'">
              <h4 class="font-weight-light">
                Your account is currently restricted.
              </h4>
              <h5 class="font-weight-lighter">
                You can lift your restriction
                <b-link to="/managed-accounts/kyb" class="link">
                  here
                </b-link>.
              </h5>
            </div>
            <div v-if="corporate.kyb.fullCompanyChecksVerified === 'INITIATED'">
              <h4 class="font-weight-light">
                Your account is currently under review.
              </h4>
              <h5 class="font-weight-lighter">
                Contact us on <b-link href="mailto:kyb@weavr.io" class="link">kyb@weavr.io</b-link> for additional information.
              </h5>
            </div>
            <div v-if="corporate.kyb.fullCompanyChecksVerified === 'REJECTED'">
              <h4 class="font-weight-light">
                We're sorry but we are unable to offer you a service at this time
              </h4>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </section>
    <section v-if="!showKybAlert">
      <statement />
    </section>
    <b-alert id="account-limit" v-if="showKycAlert" show class="fixed-bottom m-4 p-4" variant="bg-colored">
      <template v-if="showKycAlert">
        Your account is currently restricted to {{ consumer.kyc.allowedLimit | weavr_currency }}. You can lift this
        restriction
        <b-link :to="restrictionLink" class="link">
          here
        </b-link>
        .
      </template>
    </b-alert>
  </div>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'

import * as AccountsStore from '~/store/modules/Accounts'
import { OrderType } from '~/api/Enums/OrderType'
import { _Requests } from '~/store/modules/Contracts/Accounts'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'
import * as CorporatesStore from '~/store/modules/Corporates'
import { Consumer } from '~/api/Models/Consumers/Consumer'
import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import { KYBState } from '~/api/Enums/KYBState'

const Accounts = namespace(AccountsStore.name)
const Consumers = namespace(ConsumersStore.name)
const Corporates = namespace(CorporatesStore.name)

@Component({
  layout: 'dashboard',
  components: {
    Statement: () => import('~/components/accounts/statement/statement.vue')
  }
})
export default class AccountPage extends VueWithRouter {
  @Accounts.Getter account!: ManagedAccountsSchemas.ManagedAccount | null

  @Accounts.Getter filteredStatement: ManagedAccountsSchemas.ManagedAccountStatementEntry[] | undefined

  @Consumers.Getter consumer!: Consumer | null

  @Corporates.Getter corporate!: CorporatesSchemas.Corporate | null

  accountId!: number

  async asyncData({ store, route }) {
    const _accountId = route.params.id

    await AccountsStore.Helpers.get(store, _accountId)

    const _req: _Requests.ManagedAccountStatementFullRequest = {
      id: _accountId,
      body: {
        showFundMovementsOnly: true,
        orderByTimestamp: OrderType.DESC
      }
    }

    await AccountsStore.Helpers.getStatement(store, _req)

    if (AuthStore.Helpers.isConsumer(store)) {
      const _consumerId = AuthStore.Helpers.identityId(store)
      if (_consumerId) {
        await ConsumersStore.Helpers.get(store, _consumerId)
      }
    } else {
      const _corporateId = AuthStore.Helpers.identityId(store)
      if (_corporateId) {
        await CorporatesStore.Helpers.getCorporateDetails(store, _corporateId)
      }
    }

    return { accountId: _accountId }
  }

  get showKybAlert(): boolean {
    if (this.corporate && this.corporate.kyb) {
      return this.corporate.kyb.fullCompanyChecksVerified !== KYBState.APPROVED
    } else {
      return false
    }
  }

  get showKycAlert(): boolean {
    if (this.consumer && this.consumer.kyc && this.consumer.kyc.allowedLimit) {
      return parseInt(this.consumer.kyc.allowedLimit.amount + '') === 0
    } else {
      return false
    }
  }

  get restrictionLink() {
    if (this.consumer && this.consumer.kyc && this.consumer.kyc.mobileVerified === true) {
      return '/managed-accounts/' + this.accountId + '/topup'
    } else {
      return '/verify/consumers/mobile'
    }
  }
}
</script>

<style lang="scss" scoped>
.account-balance {
  .account-balance-label {
    font-size: 0.8rem;
  }

  .account-balance-value {
    font-size: 1.5rem;
  }
}

.add-funds {
  border-radius: 100%;
  padding: 13px 10px 18px;
  line-height: 0;
  font-size: 20px;
}

.account {
  &-name {
    font-size: 1.2rem;
  }

  &-expiry {
    &-label {
      font-size: 0.8rem;
    }
  }
}

.account-view-details {
  background: #c3b5ff;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  display: block;
  font-size: 0.6rem;
}

#account-limit {
  max-width: 350px;
}
</style>

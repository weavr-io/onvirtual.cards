<template>
  <b-container>
    <b-row v-if="filteredStatement && filteredStatementLength > 0" class="mb-2" align-v="center">
      <b-col>
        <b-row>
          <b-col>
            <h6 class="font-weight-lighter">
              All Transactions
            </h6>
          </b-col>
          <b-col>
            <b-row v-for="(statementEntries, date) in filteredStatement" :key="date">
              <b-col>
                <b-row class="mt-4">
                  <b-col class="text-muted">
                    {{ date | moment_statement }}
                  </b-col>
                </b-row>
                <b-row v-for="(statement, key) in statementEntries" :key="key">
                  <b-col>
                    <statement-item :transaction="statement" />
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row v-else class="py-5">
      <b-col class="text-center">
        <p>Your transactions will appear here.</p>
        <b-button :to="'/managed-accounts/' + accountId + '/topup'" variant="border-primary">
          Start by topping up your account.
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import * as AccountsStore from '~/store/modules/Accounts'

const Accounts = namespace(AccountsStore.name)

@Component({
  components: {
    StatementItem: () => import('~/components/accounts/statement/item.vue')
  }
})
export default class AccountStatement extends VueWithRouter {
  @Accounts.Getter filteredStatement: ManagedAccountsSchemas.ManagedAccountStatementEntry[] | undefined

  accountId!: number

  asyncData({ route }) {
    const _accountId = route.params.id

    return { accountId: _accountId }
  }

  get filteredStatementLength(): number {
    if (this.filteredStatement) {
      return Object.keys(this.filteredStatement).length
    } else {
      return 0
    }
  }
}
</script>

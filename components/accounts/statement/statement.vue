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
        </b-row>
        <b-row>
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
        <h5 class="font-weight-light">
          Your transactions will appear here.
        </h5>
        <b-button :to="'/managed-accounts/' + account.id.id + '/topup'" variant="link">
          Start by topping up your account.
        </b-button>
      </b-col>
    </b-row>
  </b-container>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { ManagedAccountsSchemas } from '~/api/ManagedAccountsSchemas'
import * as AccountsStore from '~/store/modules/Accounts'
import { StatementEntry } from '~/api/Models/Statements/StatementEntry'
import BaseMixin from '~/minixs/BaseMixin'

const Accounts = namespace(AccountsStore.name)

@Component({
  components: {
    StatementItem: () => import('~/components/statement/item.vue')
  }
})
export default class AccountStatement extends mixins(BaseMixin) {
  @Accounts.Getter filteredStatement: StatementEntry[] | undefined

  @Accounts.Getter account!: ManagedAccountsSchemas.ManagedAccount | null

  get filteredStatementLength(): number {
    if (this.filteredStatement) {
      return Object.keys(this.filteredStatement).length
    } else {
      return 0
    }
  }
}
</script>

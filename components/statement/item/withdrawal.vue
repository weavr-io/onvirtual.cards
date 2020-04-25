<template>
  <b-row align-v="center" :class="{ 'text-muted': isPending }">
    <b-col cols="1">
      <div class="transaction-type-icon">
        <div class="transaction">
          <img src="~/assets/svg/statement/withdrawal.svg" alt="">
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="transaction-type">
        <div class="transaction">
          Withdrawal
        </div>
      </div>
      <div class="text-muted">
        <b-badge v-if="isPending" variant="grey-light" class="text-muted">Pending</b-badge>
      </div>
    </b-col>
    <b-col class="text-right">
      <amount :transaction="transaction" />
    </b-col>
  </b-row>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { StatementEntry } from '~/api/Models/Statements/StatementEntry'

@Component({
  components: {
    Amount: () => import('~/components/statement/item/common/amount.vue')
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: StatementEntry

  get isPending(): boolean {
    return this.transaction.additionalFields?.withdrawalState !== 'COMPLETED'
  }
}
</script>

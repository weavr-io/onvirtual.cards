<template>
  <b-row align-v="center">
    <b-col cols="1">
      <div class="transaction-type-icon">
        <div class="transaction">
          <img src="~/assets/svg/statement/deposit.svg" alt="">
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="transaction-type">
        <div class="transaction">
          Deposit
        </div>
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
}
</script>

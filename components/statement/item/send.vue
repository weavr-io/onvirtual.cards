<template>
  <b-row align-v="center">
    <b-col cols="1">
      <div class="transaction-type-icon">
        <div class="transaction increase">
          <template v-if="isOut">
            <send-icon />
          </template>
          <template v-if="isIn">
            <receive-icon />
          </template>
        </div>
      </div>
    </b-col>
    <b-col>
      <div class="transaction-type">
        <div class="transaction">
          <template v-if="isOut">To {{ destination }}</template>
          <template v-if="isIn">From {{ source }}</template>
        </div>
      </div>
      <div class="text-muted">Transfer</div>
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
    ReceiveIcon: () => import('~/assets/svg/statement/receive.svg?inline'),
    SendIcon: () => import('~/assets/svg/statement/send.svg?inline'),
    Amount: () => import('~/components/statement/item/common/amount.vue')
  }
})
export default class StatementItemAdditionalField extends Vue {
  @Prop()
  readonly transaction!: StatementEntry

  get source() {
    return this.transaction.additionalFields?.sourceIdentityName
  }

  get destination() {
    return this.transaction.additionalFields?.destinationIdentityName
  }

  get isOut() {
    return this.transaction.additionalFields?.destinationIdentityName !== undefined
  }

  get isIn() {
    return this.transaction.additionalFields?.sourceIdentityName !== undefined
  }
}
</script>

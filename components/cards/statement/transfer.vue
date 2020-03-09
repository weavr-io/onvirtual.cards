<template>
  <div>
    Transfer
    <template v-if="accountName !== ''">
      <template v-if="isIncrease">
        from
      </template>
      <template v-if="isDecrease">
        to
      </template>
      {{ accountName }}
    </template>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Prop } from 'nuxt-property-decorator'
import { ManagedCardsSchemas } from '~/api/ManagedCardsSchemas'
import { namespace } from '~/node_modules/nuxt-property-decorator'
import * as ManagedAccountsStore from '~/store/modules/Accounts'
import * as ManagedCardsStore from '~/store/modules/Cards'

const ManagedAccounts = namespace(ManagedAccountsStore.name)
const ManagedCards = namespace(ManagedCardsStore.name)

@Component({})
export default class StatementItemTransfer extends Vue {
  @ManagedAccounts.Action('get') getManagedAccount
  @ManagedCards.Action('getManagedCard') getManagedCard

  @Prop({ default: '' })
  readonly transaction!: ManagedCardsSchemas.ManagedCardStatementEntry

  accountName: string = ''

  mounted() {
    if (this.transaction.additionalFields) {
      if (this.transaction.additionalFields.sourceInstrumentType === 'managed_accounts') {
        this.getManagedAccount(this.transaction.additionalFields.sourceInstrumentId).then((res) => {
          this.accountName = res.data.friendlyName
        })
      } else if (this.transaction.additionalFields.sourceInstrumentType === 'managed_cards') {
        this.getManagedCard(this.transaction.additionalFields.sourceInstrumentId).then((res) => {
          this.accountName = res.data.friendlyName
        })
      } else if (this.transaction.additionalFields.destinationInstrumentType === 'managed_cards') {
        this.getManagedCard(this.transaction.additionalFields.destinationInstrumentId).then((res) => {
          this.accountName = res.data.friendlyName
        })
      } else if (this.transaction.additionalFields.destinationInstrumentType === 'managed_accounts') {
        this.getManagedAccount(this.transaction.additionalFields.destinationInstrumentId).then((res) => {
          this.accountName = res.data.friendlyName
        })
      }
    }
  }

  get isIncrease(): boolean {
    if (this.transaction.adjustment) {
      return this.transaction.adjustment > 0
    } else {
      return false
    }
  }

  get isDecrease(): boolean {
    if (this.transaction.adjustment) {
      return this.transaction.adjustment < 0
    } else {
      return false
    }
  }
}
</script>

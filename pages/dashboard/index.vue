§<template>
  <section></section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import * as AccountsStore from '~/store/modules/Accounts'
import BaseMixin from '~/minixs/BaseMixin'

@Component({
  layout: 'dashboard'
})
export default class DashboardPage extends mixins(BaseMixin) {
  async asyncData({ redirect, store }) {
    const _accounts = await AccountsStore.Helpers.index(store)

    if (_accounts.data.count === 1) {
      redirect('/managed-cards')
    } else {
      redirect('/managed-accounts/add')
    }
  }
}
</script>

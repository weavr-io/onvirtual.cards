§<template>
  <section></section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as AccountsStore from '~/store/modules/Accounts'

@Component({
  layout: 'dashboard'
})
export default class DashboardPage extends VueWithRouter {
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

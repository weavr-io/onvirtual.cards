§<template>
  <section></section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { accountsStore } from '~/utils/store-accessor'

@Component({
  layout: 'dashboard'
})
export default class DashboardPage extends mixins(BaseMixin) {
  async asyncData({ redirect, store }) {
    const _accounts = await accountsStore(store).index()

    if (_accounts.data.count >= 1) {
      redirect('/managed-cards')
    } else {
      redirect('/managed-accounts/add')
    }
  }
}
</script>

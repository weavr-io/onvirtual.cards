<template>
  <section></section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import * as AccountsStore from '~/store/modules/Accounts'
import BaseMixin from '~/minixs/BaseMixin'

@Component({
  layout: 'dashboard'
})
export default class CardsPage extends mixins(BaseMixin) {
  async asyncData({ store, redirect }) {
    let _accountId
    const _accounts = await AccountsStore.Helpers.index(store)

    if (_accounts.data.count === 1) {
      _accountId = _accounts.data.account[0].id.id

      redirect('/managed-accounts/' + _accountId)
    } else {
      redirect('/managed-accounts/add')
    }

    return { accountId: _accountId }
  }
}
</script>

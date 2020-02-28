<template>
  <section></section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

import * as AccountsStore from '~/store/modules/Accounts'

@Component({
  layout: 'dashboard'
})
export default class CardsPage extends VueWithRouter {
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

<template>
  <section />
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { accountsStore } from '~/utils/store-accessor'

@Component({
  layout: 'dashboard'
})
export default class CardsPage extends mixins(BaseMixin) {
  async asyncData({ store, redirect }) {
    let _accountId
    const _accounts = await accountsStore(store).index()

    if (_accounts.data.count >= 1) {
      _accountId = _accounts.data.account[0].id.id

      redirect('/managed-accounts/' + _accountId)
    } else {
      redirect('/managed-accounts/add')
    }

    return { accountId: _accountId }
  }
}
</script>

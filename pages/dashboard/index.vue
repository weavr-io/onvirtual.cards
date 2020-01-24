<template>
  <section></section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as AuthStore from '~/store/modules/Auth'

const Auth = namespace(AuthStore.name)
const Corporates = namespace(CorporatesStore.name)

@Component({
  layout: 'dashboard'
})
export default class DashboardPage extends VueWithRouter {
  async asyncData({ redirect, store }) {
    const _corpId = store.getters['auth/auth'].identity.id
    await store.dispatch('corporates/getCorporateDetails', _corpId)

    const _corp = store.getters['corporates/corporate']

    if (_corp.kyb.directorsVerified !== 'true') {

    } else {
      redirect('/managed-accounts')
    }
  }
}
</script>

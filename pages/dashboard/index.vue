<template>
  <section></section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

@Component({
  layout: 'dashboard'
})
export default class DashboardPage extends VueWithRouter {
  asyncData({ redirect }) {
    redirect('/managed-accounts')
  }
}
</script>

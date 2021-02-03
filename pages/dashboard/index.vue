<template>
  <section>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { accountsStore } from '~/utils/store-accessor'

@Component({
  layout: 'dashboard'
})
export default class DashboardPage extends mixins(BaseMixin) {
  asyncData({ redirect }) {
    redirect('/managed-cards')
  }
}
</script>

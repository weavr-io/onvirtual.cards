<template>
  <section>
    <pre>
      {{ $route.name }}
    </pre>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'

@Component({
  layout: 'dashboard'
})
export default class DashboardPage extends mixins(BaseMixin) {
  // asyncData({ redirect }) {
  //   redirect('/managed-cards')
  // }
}
</script>

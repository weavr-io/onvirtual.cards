<template>
  <b-container>
    <b-row>
      <b-col>
        {{ $route.name }}
      </b-col>
    </b-row>
  </b-container>
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

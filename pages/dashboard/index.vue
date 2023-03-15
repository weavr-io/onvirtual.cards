<template>
  <div></div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component({
  layout: 'dashboard',
})
export default class DashboardPage extends Vue {
  asyncData({ redirect }) {
    redirect('/managed-cards')
  }
}
</script>

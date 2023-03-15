<template>
  <div>
    <app-header />
    <Nuxt />
    <div v-if="isLoading" id="loader">
      <div class="loader-spinner">
        <b-spinner />
      </div>
    </div>
    <!-- <app-footer /> -->
    <cookie-policy />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { useBase } from '~/composables/useBase'

@Component({
  components: {
    AppFooter: () => import('~/components/Footer.vue'),
    AppHeader: () => import('~/components/Header.vue'),
    cookiePolicy: () => import('~/components/cookie.vue'),
  },
})
export default class DefaultLayout extends Vue {
  base = useBase(this)

  get isLoading() {
    return this.base.stores.loader.isLoading
  }
}
</script>

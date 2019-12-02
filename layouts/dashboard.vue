<template>
  <div>
    <app-header />
    <dashboard-header />
    <Nuxt />
    <div v-if="isLoading" id="loader">
      <div class="loader-spinner">
        <b-spinner />
      </div>
    </div>
    <!-- <app-footer /> -->
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { BaseVue } from '~/base/classes/BaseVue'

import * as LoaderStore from '~/store/modules/Loader'
const Loader = namespace(LoaderStore.name)

@Component({
  components: {
    AppFooter: () => import('~/components/Footer.vue'),
    AppHeader: () => import('~/components/Header.vue'),
    DashboardHeader: () => import('~/components/DashboardHeader.vue')
  }
})
export default class DefaultLayout extends BaseVue {
  @Loader.Getter isLoading
}
</script>

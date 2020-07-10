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
import { Component, mixins } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import * as LoaderStore from '~/store/modules/Loader'
import BaseMixin from '~/minixs/BaseMixin'
const Loader = namespace(LoaderStore.name)

@Component({
  components: {
    AppFooter: () => import('~/components/Footer.vue'),
    AppHeader: () => import('~/components/Header.vue'),
    cookiePolicy: () => import('~/components/cookie.vue')
  }
})
export default class DefaultLayout extends mixins(BaseMixin) {
  @Loader.Getter isLoading
}
</script>

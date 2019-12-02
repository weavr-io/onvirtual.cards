<template>
  <div class>
    <nuxt />
    <!-- <app-footer /> -->
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'

@Component({
  components: {
    AppFooter: () => import('~/components/Footer.vue')
  }
})
class AuthLayout extends VueWithRouter {
  get isLogin(): boolean {
    return this.$route.path === '/login'
  }
}

export default AuthLayout
</script>

<template>
  <div class>
    <div class="container-fluid" v-if="false">
      <b-navbar type="light" fixed="top" variant="bg-colored" class="">
        <b-container>
          <b-navbar-brand to="/">
            <img src="/img/logo.svg" width="160" class="d-inline-block align-center" alt="WEAVR" />
          </b-navbar-brand>
          <b-collapse id="nav_collapse" is-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-item to="/register">Register</b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-container>
      </b-navbar>
    </div>
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
  },
  head: {
    bodyAttrs: {
      class: 'bg-bg-colored'
    }
  }
})
class AuthLayout extends VueWithRouter {
  get isLogin(): boolean {
    return this.$route.path === '/login'
  }
}

export default AuthLayout
</script>

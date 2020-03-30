<template>
  <div id="main-header">
    <div v-if="showHeader" class="container-fluid">
      <b-navbar type="light" fixed="top" variant="bg-colored" class="">
        <b-container>
          <b-collapse id="nav_collapse" is-nav>
            <b-navbar-nav class="ml-auto" v-if="showLinks">
              <b-nav-item v-if="showRegister" to="/register">
                Register
              </b-nav-item>
              <b-nav-item v-if="showLogin" to="/login">
                Sign In
              </b-nav-item>
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
import config from '~/config'
import { namespace } from 'vuex-class'
import * as AuthStore from '~/store/modules/Auth'

const Auth = namespace(AuthStore.name)

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
  @Auth.Getter isLoggedIn!: boolean

  get isLogin(): boolean {
    return this.$route.path === '/login'
  }

  get showHeader(): boolean {
    return config.app.view_register
  }

  get showRegister(): boolean {
    return !this.showLogin
  }

  get showLinks(): boolean {
    return !this.isLoggedIn
  }

  get showLogin(): boolean {
    const _matchedName = this.$route.matched[0].name
    if (_matchedName) {
      const _registration = ['login']
      return !_registration.includes(_matchedName)
    } else {
      return false
    }
  }
}

export default AuthLayout
</script>

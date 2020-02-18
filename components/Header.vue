<template>
  <div class="container-fluid px-0 mb-5 pb-5">
    <b-navbar type="light" fixed="top" variant="white" class="navbar-padding-adjust">
      <b-container>
        <b-navbar-brand to="/">
          <img src="/img/logo.svg" width="160" class="d-inline-block align-center" alt="WEAVR" />
        </b-navbar-brand>
        <b-collapse id="nav_collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right toggle-class="border-bottom">
              <template slot="button-content">User</template>
              <b-dropdown-item to="/users">Users</b-dropdown-item>
              <b-dropdown-item @click="doLogout">Sign out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'

import * as AuthStore from '~/store/modules/Auth'
const Auth = namespace(AuthStore.name)

@Component
export default class Header extends Vue {
  @Auth.Action logout

  doLogout() {
    this.logout().then(this.redirectToLogin.bind(this))
  }

  redirectToLogin() {
    this.$segment.reset()
    this.$router.push('/login')
  }
}
</script>
<style lang="scss" scoped>
.dropdown-toggle {
  border-bottom: 2px solid;
}
</style>


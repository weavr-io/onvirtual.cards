<template>
  <div class="container-fluid px-0 mb-5 pb-5">
    <b-navbar type="light" fixed="top" variant="white" class="navbar-padding-adjust">
      <b-container>
        <b-navbar-brand to="/">
          <img src="/img/logo.svg" width="160" class="d-inline-block align-center" alt="WEAVR" />
        </b-navbar-brand>
        <b-collapse v-if="base.unRefs.isLoggedIn" id="nav_collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown right toggle-class="border-bottom">
              <template #button-content>
                {{ base.unRefs.rootFullName }}
              </template>
              <b-dropdown-item to="/profile"> Profile </b-dropdown-item>
              <b-dropdown-item v-if="base.unRefs.isCorporate" to="/users"> Users </b-dropdown-item>
              <b-dropdown-item @click="doLogout"> Sign out </b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import { useBase } from '~/composables/useBase'

const proxy = getCurrentInstance()?.proxy

const base = useBase(proxy)

function doLogout() {
  base.logout().then(redirectToLogin)
}

function redirectToLogin() {
  try {
    proxy?.$segment.reset()
  } catch (e) {}
  proxy?.$router.push('/login')
}

function fetch() {
  if (base.unRefs.consumer === null && base.unRefs.corporate === null) {
    if (base.unRefs.isConsumer) {
      base.stores.consumers.get()
    } else if (base.unRefs.isCorporate) {
      base.stores.corporates.get()
    }
  }
}

fetch()
</script>

<!--<script lang="ts">-->
<!--import { Component } from 'nuxt-property-decorator'-->
<!--import Vue from 'vue'-->
<!--import { useBase } from '~/composables/useBase'-->

<!--@Component-->
<!--export default class Header extends Vue {-->
<!--  base = useBase(this)-->

<!--  doLogout() {-->
<!--    this.base.logout().then(this.redirectToLogin)-->
<!--  }-->

<!--  redirectToLogin() {-->
<!--    try {-->
<!--      this.$segment.reset()-->
<!--    } catch (e) {}-->
<!--    this.$router.push('/login')-->
<!--  }-->

<!--  fetch() {-->
<!--    if (this.base.unRefs.consumer === null && this.base.unRefs.corporate === null) {-->
<!--      if (this.base.unRefs.isConsumer) {-->
<!--        this.base.stores.consumers.get()-->
<!--      } else if (this.base.unRefs.isCorporate) {-->
<!--        this.base.stores.corporates.get()-->
<!--      }-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<style lang="scss" scoped>
.dropdown-toggle {
  border-bottom: 2px solid;
}
</style>

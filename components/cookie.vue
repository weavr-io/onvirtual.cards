<template>
  <div>
    <b-alert id="cookie-alert" v-model="showCookieAlert" variant="primary" class="text-uppercase">
      <div class="d-flex justify-content-between align-items-center">
        <div class="flex-grow-1">
          This site uses cookies. If you continue we'll assume you're ok with that.
          <b-link href="https://onvirtual.cards/policy/" target="_blank" class="link">
            View privacy policy
          </b-link>
        </div>
        <div>
          <b-link @click="dismissCookie" class="ml-3">
            <img src="/img/close.svg" width="12px" >
          </b-link>
        </div>
      </div>
    </b-alert>
  </div>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { BaseVue } from '~/base/classes/BaseVue'

const Cookie = process.client ? require('js-cookie') : undefined

@Component({
  components: {}
})
export default class DefaultLayout extends BaseVue {
  cookieName: string = 'onvirtual-cookie'

  showCookieAlert: boolean = false

  mounted() {
    const _authCookie = Cookie.get(this.cookieName)
    this.showCookieAlert = !_authCookie
  }

  dismissCookie() {
    Cookie.set(this.cookieName, true)
    this.showCookieAlert = false
  }
}
</script>

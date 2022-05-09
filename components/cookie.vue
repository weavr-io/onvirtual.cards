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
          <b-link class="ml-3" @click="dismissCookie">
            <img src="/img/close.svg" width="12px" />
          </b-link>
        </div>
      </div>
    </b-alert>
  </div>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined

@Component
export default class Cookies extends mixins(BaseMixin) {
  showCookieAlert: boolean = false

  created() {
    const _authCookie = Cookie.get(config.ONV_COOKIE_NAME)
    this.showCookieAlert = !_authCookie
  }

  dismissCookie() {
    Cookie.set(config.ONV_COOKIE_NAME, true)
    this.showCookieAlert = false
  }
}
</script>

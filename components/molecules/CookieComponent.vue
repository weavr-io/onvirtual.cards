<template>
    <div>
        <b-alert
            id="cookie-alert"
            v-model="showCookieAlert"
            class="text-uppercase"
            variant="primary"
        >
            <div class="d-flex justify-content-between align-items-center">
                <div class="flex-grow-1">
                    This site uses cookies. If you continue we'll assume you're ok with that.
                    <b-link class="link" href="https://onvirtual.cards/policy/" target="_blank">
                        View privacy policy
                    </b-link>
                </div>
                <div>
                    <b-link class="ml-3" @click="dismissCookie">
                        <img src="/img/close.svg" width="12px" alt="close" />
                    </b-link>
                </div>
            </div>
        </b-alert>
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import config from '~/config'

const Cookie = process.client ? require('js-cookie') : undefined
const showCookieAlert = ref<string | boolean>(Cookie.get(config.ONV_COOKIE_NAME))

const dismissCookie = () => {
    Cookie.set(config.ONV_COOKIE_NAME, true)
    showCookieAlert.value = false
}
</script>

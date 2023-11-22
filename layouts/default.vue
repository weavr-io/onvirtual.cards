<template>
    <div>
        <app-header />
        <Nuxt />
        <div v-if="isLoading" id="loader">
            <div class="loader-spinner">
                <b-spinner />
            </div>
        </div>
        <cookie-policy />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useBase } from '@/composables/useBase'
import AppHeader from '~/components/Header.vue'
import CookiePolicy from '~/components/cookie.vue'

export default defineComponent({
    name: 'DefaultLayout',
    // TODO: Remove after full nuxt3 upgrade
    components: {
        AppHeader,
        CookiePolicy,
    },
    middleware: ['authRouteGuard'],
    setup() {
        const { stores } = useBase()
        const isLoading = computed(() => stores.loader.isLoading)

        return { isLoading }
    },
})
</script>

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

export default defineComponent({
    name: 'DefaultLayout',
    // TODO: update after full nuxt3 upgrade
    components: {
        AppHeader: () => import('~/components/Header.vue'),
        CookiePolicy: () => import('~/components/cookie.vue'),
    },
    middleware: ['authRouteGuard'],
    setup() {
        const { stores } = useBase()
        const isLoading = computed(() => stores.loader.isLoading)

        return { isLoading }
    },
})
</script>

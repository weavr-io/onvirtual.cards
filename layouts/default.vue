<template>
    <div>
        <AppHeader />
        <Nuxt />
        <LoadingSpinner id="loader" :is-loading="isLoading" />
        <Cookie />
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { useStores } from '~/composables/useStores'
import AppHeader from '~/components/molecules/Header.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import Cookie from '~/components/molecules/cookie.vue'

export default defineComponent({
    components: {
        Cookie,
        LoadingSpinner,
        AppHeader,
    },
    middleware: 'authRouteGuard',
    setup() {
        const { loader } = useStores(['loader'])

        const isLoading = computed(() => loader?.isLoading)

        return {
            isLoading,
        }
    },
})
</script>

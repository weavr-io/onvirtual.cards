<template>
    <div>
        <AppHeader />
        <Nuxt />
        <LoadingSpinner id="loader" :is-loading="isLoading" />
        <Cookie />
    </div>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import { computed } from 'vue'
import AppHeader from '~/components/Header.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import Cookie from '~/components/cookie.vue'
import { useStores } from '~/composables/useStores'

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

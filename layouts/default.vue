<template>
    <div>
        <AppHeader />
        <Nuxt />
        <LoadingSpinner id="loader" :is-loading="isLoading" />
        <Cookie />
    </div>
</template>

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'
import AppHeader from '~/components/molecules/HeaderComponent.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import Cookie from '~/components/molecules/CookieComponent.vue'

definePageMeta({
    middleware: 'authRouteGuard',
})

const { loader } = useStores(['loader'])

const isLoading = computed(() => loader?.isLoading)
</script>

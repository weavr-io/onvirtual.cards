<template>
    <div>
        <BModalOrchestrator />
        <AppHeader />
        <NuxtPage />
        <LoadingSpinner id="loader" :is-loading="isLoading" />
        <Cookie />
    </div>
</template>

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'
import AppHeader from '~/components/molecules/HeaderComponent.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import Cookie from '~/components/molecules/CookieComponent.vue'
import config from '~/config'

const route = useRoute()

onBeforeMount(() => {
    const authCookie = useCookie(config.ONV_COOKIE_NAME)

    if (!authCookie.value) {
        const queryParam = route.query

        if (queryParam.cons && queryParam.email) {
            navigateTo(`/login/verify?email=${queryParam.email}&cons=${queryParam.cons}`)
        } else {
            navigateTo('/login')
        }
    }
})

const { loader } = useStores(['loader'])

const isLoading = computed(() => loader?.isLoading)
</script>

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
    middleware: ['authRouteGuard'],
    setup() {
        const { loaderStore } = useBase()
        const isLoading = computed(() => loaderStore.isLoading)

        return { isLoading }
    },
})
</script>

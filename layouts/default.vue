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

<script lang="ts" setup>
import { computed } from 'vue'
import { useBase } from '@/composables/useBase'

definePageMeta({
    middleware: ['authRouteGuard'],
})

const { loaderStore } = useBase()
const isLoading = computed(() => loaderStore.isLoading)
</script>

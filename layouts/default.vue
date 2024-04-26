<template>
    <div>
        <app-header />
        <Nuxt />
        <LoadingSpinner id="loader" :is-loading="isLoading" />
        <cookie-policy />
    </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

@Component({
    components: {
        LoadingSpinner,
        AppHeader: () => import('~/components/Header.vue'),
        cookiePolicy: () => import('~/components/cookie.vue'),
    },
    middleware: ['authRouteGuard'],
})
export default class DefaultLayout extends mixins(BaseMixin) {
    get isLoading() {
        return this.loaderStore.isLoading
    }
}
</script>

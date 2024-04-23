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
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'

@Component({
    components: {
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

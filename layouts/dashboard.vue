<template>
    <div>
        <app-header />
        <dashboard-header />
        <Nuxt />
        <kyb-alert v-if="kyVerified.showKybAlert" />
        <kyc-alert v-if="kyVerified.showKycAlert" />
        <b-alert
            id="verify-mobile"
            :show="kyVerified.showVerifyMobileAlert && !kyVerified.showVerifyEmailAlert"
            class="fixed-bottom bottom-left-alert m-4 p-4"
            variant="bg-colored"
        >
            We need to verify your mobile number. Please click
            <b-link class="link" to="/login/verify/mobile"> here.</b-link>
        </b-alert>
        <b-alert
            id="verify-email"
            :show="kyVerified.showVerifyEmailAlert"
            class="fixed-bottom bottom-left-alert m-4 p-4"
            variant="bg-colored"
        >
            We need to verify your email address. Please click
            <b-button class="link mb-1" variant="transparent" @click="base.goToVerify"
                >here.
            </b-button>
        </b-alert>
        <div v-if="isLoading" id="loader">
            <div class="loader-spinner">
                <b-spinner />
            </div>
        </div>
        <cookie-policy />
    </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { useBase } from '~/composables/useBase'
import { useKyVerified } from '~/composables/useKyVerified'

@Component({
    components: {
        AppFooter: () => import('~/components/Footer.vue'),
        AppHeader: () => import('~/components/Header.vue'),
        DashboardHeader: () => import('~/components/DashboardHeader.vue'),
        KybAlert: () => import('~/components/corporates/KYBAlert.vue'),
        KycAlert: () => import('~/components/consumers/KYCAlert.vue'),
        cookiePolicy: () => import('~/components/cookie.vue'),
    },
})
export default class DefaultLayout extends Vue {
    base = useBase(this)
    kyVerified = useKyVerified(this)

    get isLoading() {
        return this.base.stores.loader.isLoading
    }

    get accounts() {
        return this.base.stores.accounts.accounts
    }
}
</script>
<style lang="scss" scoped>
.bottom-left-alert {
    max-width: 350px;
}

#account {
    &-limit,
    &-kyc {
        max-width: 350px;
    }
}
</style>

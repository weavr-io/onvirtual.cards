<template>
    <div>
        <app-header />
        <dashboard-header />
        <Nuxt />
        <kyb-alert v-if="showKybAlert" />
        <kyc-alert v-if="showKycAlert" />
        <b-alert
            id="verify-mobile"
            :show="showVerifyMobileAlert && !showVerifyEmailAlert"
            class="fixed-bottom bottom-left-alert m-4 p-4"
            variant="bg-colored"
        >
            We need to verify your mobile number. Please click
            <b-link class="link" to="/login/verify/mobile"> here.</b-link>
        </b-alert>
        <b-alert
            id="verify-email"
            :show="showVerifyEmailAlert"
            class="fixed-bottom bottom-left-alert m-4 p-4"
            variant="bg-colored"
        >
            We need to verify your email address. Please click
            <b-button class="link mb-1" variant="transparent" @click="goToVerify">here.</b-button>
        </b-alert>
        <LoadingSpinner id="loader" :is-loading="isLoading" />
        <cookie-policy />
    </div>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import KyVerified from '~/mixins/kyVerified'
import BaseMixin from '~/mixins/BaseMixin'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'

@Component({
    components: {
        LoadingSpinner,
        AppHeader: () => import('~/components/molecules/Header.vue'),
        DashboardHeader: () => import('~/components/organisms/DashboardHeader.vue'),
        KybAlert: () => import('~/components/molecules/corporates/KYBAlert.vue'),
        KycAlert: () => import('~/components/molecules/consumers/KYCAlert.vue'),
        cookiePolicy: () => import('~/components/molecules/cookie.vue'),
    },
})
export default class DefaultLayout extends mixins(KyVerified, BaseMixin) {
    get isLoading() {
        return this.loaderStore.isLoading
    }

    get accounts() {
        return this.accountsStore.accountState.accounts
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

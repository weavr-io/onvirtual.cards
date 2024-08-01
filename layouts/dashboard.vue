<template>
    <div>
        <AppHeader />
        <DashboardHeader />
        <NuxtPage />
        <KYBAlert v-if="showKybAlert" />
        <KYCAlert v-if="showKycAlert" />
        <BAlert
            id="verify-mobile"
            :show="showVerifyMobileAlert && !showVerifyEmailAlert"
            class="fixed-bottom bottom-left-alert m-4 p-4"
            variant="bg-colored"
        >
            We need to verify your mobile number. Please click
            <b-link class="link" to="/login/verify/mobile"> here.</b-link>
        </BAlert>
        <BAlert
            id="verify-email"
            :show="showVerifyEmailAlert"
            class="fixed-bottom bottom-left-alert m-4 p-4"
            variant="bg-colored"
        >
            We need to verify your email address. Please click
            <b-button class="link mb-1" variant="transparent" @click="goToVerify">here.</b-button>
        </BAlert>
        <LoadingSpinner id="loader" :is-loading="isLoading" />
        <Cookie />
    </div>
</template>

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'
import { useKyVerified } from '~/composables/useKyVerified'
import { useBase } from '~/composables/useBase'
import AppHeader from '~/components/molecules/HeaderComponent.vue'
import Cookie from '~/components/molecules/CookieComponent.vue'
import LoadingSpinner from '~/components/atoms/LoadingSpinner.vue'
import KYBAlert from '~/components/molecules/corporates/KYBAlert.vue'
import KYCAlert from '~/components/molecules/consumers/KYCAlert.vue'
import DashboardHeader from '~/components/organisms/DashboardHeader.vue'

const { loader } = useStores(['loader'])
const { showKybAlert, showKycAlert, showVerifyEmailAlert, showVerifyMobileAlert } = useKyVerified()
const { goToVerify } = useBase()

const isLoading = computed(() => loader?.isLoading)
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

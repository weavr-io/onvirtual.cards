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
            <b-link to="/login/verify/mobile" class="link"> here. </b-link>
        </b-alert>
        <b-alert
            id="verify-email"
            :show="showVerifyEmailAlert"
            class="fixed-bottom bottom-left-alert m-4 p-4"
            variant="bg-colored"
        >
            We need to verify your email address. Please click
            <b-button variant="transparent" class="link mb-1" @click="goToVerify">here.</b-button>
        </b-alert>
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
import { useKyVerified } from '@/composables/useKyVerified'

const { goToVerify, stores } = useBase()
const { showKybAlert, showKycAlert, showVerifyMobileAlert, showVerifyEmailAlert } = useKyVerified()

const isLoading = computed(() => stores.loader.isLoading)
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

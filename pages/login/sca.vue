<template>
    <b-col lg="6" md="9">
        <LogoOvc :link="false" classes="pb-5" />
        <MobileComponent :verify-phone="false">
            <template #title>Check your phone</template>
            <template #alert>The one-time password was resent by SMS.</template>
            <template #description
                >We’ve just sent you a one-time password by SMS. Enter the 6 digit code below to
                verify it's really you.
            </template>
        </MobileComponent>
    </b-col>
</template>

<script lang="ts" setup>
import MobileComponent from '~/components/molecules/MobileComponent.vue'
import LogoOvc from '~/components/molecules/LogoOvc.vue'

definePageMeta({
    layout: 'auth',
    middleware: 'auth-factors',
})
</script>

<template>
    <b-container>
        <div class="d-flex flex-column align-items-center">
            <LogoOvc />
            <access-code-component v-if="config.production && !isAccessCodeValid" />
            <business-or-personal-component v-else />
        </div>
    </b-container>
</template>

<script lang="ts" setup>
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import AccessCodeComponent from '~/components/organisms/registration/AccessCodeComponent.vue'
import BusinessOrPersonalComponent from '~/components/organisms/ProfileIdentitySelection.vue'
import { useStores } from '~/composables/useStores'

definePageMeta({
    layout: 'auth',
    middleware: 'accessCodeVerified',
})

const router = useRouter()
const config = useRuntimeConfig().public
const { accessCodes, auth } = useStores(['accessCodes', 'auth'])

const isAccessCodeValid = computed(() => {
    return accessCodes?.isValid
})

useAsyncData(async () => {
    const isLoggedIn = auth?.isLoggedIn

    if (isLoggedIn) {
        await router.replace('/dashboard')
    }
})
</script>

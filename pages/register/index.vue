<template>
    <b-container>
        <div class="d-flex flex-column align-items-center">
            <LogoOvc />
            <access-code-component v-if="$config.production && !isAccessCodeValid" />
            <business-or-personal-component v-else />
        </div>
    </b-container>
</template>
<script lang="ts">
import { computed, defineComponent, useAsync, useRouter } from '@nuxtjs/composition-api'
import LogoOvc from '~/components/molecules/LogoOvc.vue'
import AccessCodeComponent from '~/components/organisms/registration/AccessCodeComponent.vue'
import BusinessOrPersonalComponent from '~/components/organisms/ProfileIdentitySelection.vue'
import { useStores } from '~/composables/useStores'

export default defineComponent({
    components: {
        LogoOvc,
        AccessCodeComponent,
        BusinessOrPersonalComponent,
    },
    layout: 'auth',
    middleware: 'accessCodeVerified',
    setup() {
        const router = useRouter()
        const { accessCodes, auth } = useStores(['accessCodes', 'auth'])

        const isAccessCodeValid = computed(() => {
            return accessCodes?.isValid
        })

        useAsync(() => {
            const isLoggedIn = auth?.isLoggedIn

            if (isLoggedIn) {
                router.replace('/dashboard')
            }
        })

        return {
            isAccessCodeValid,
        }
    },
})
</script>

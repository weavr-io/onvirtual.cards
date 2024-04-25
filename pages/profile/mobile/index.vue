<template>
    <div></div>
</template>

<script>
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import { initialiseStores } from '@/utils/pinia-store-accessor'

export default defineComponent({
    setup() {
        const router = useRouter()

        const { auth, identity } = initialiseStores(['auth', 'identity'])

        if (identity?.identityState.mobileNumberVerified || !auth?.isLoggedIn) {
            return router.push('/dashboard')
        }
    },
})
</script>

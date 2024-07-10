<template>
    <div></div>
</template>

<script>
import { defineComponent, useRouter } from '@nuxtjs/composition-api'
import { useStores } from '~/composables/useStores'

export default defineComponent({
    middleware: 'kyVerified',
    setup() {
        const router = useRouter()

        const { auth, identity } = useStores(['auth', 'identity'])

        if (identity?.identityState.mobileNumberVerified || !auth?.isLoggedIn) {
            return router.push('/dashboard')
        }
    },
})
</script>

<template>
    <div></div>
</template>

<script>
import { defineComponent } from 'vue'
import { initialiseStores } from '~/utils/store-accessor'

export default defineComponent({
    name: 'Mobile',
    asyncData({ redirect }) {
        const { identity, auth } = initialiseStores(['identity', 'auth'])
        if (identity.identityState.mobileNumberVerified || !auth.isLoggedIn) {
            return redirect('/dashboard')
        }
    },
})
</script>

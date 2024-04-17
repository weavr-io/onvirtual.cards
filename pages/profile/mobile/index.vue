<template>
    <div></div>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import { initialiseStores } from '@/utils/pinia-store-accessor'

@Component({})
export default class Mobile extends Vue {
    asyncData({ redirect }) {
        const { auth, identity } = initialiseStores(['auth', 'identity'])
        if (identity?.identityState.mobileNumberVerified || !auth?.isLoggedIn) {
            return redirect('/dashboard')
        }
    }
}
</script>

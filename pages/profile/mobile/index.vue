<template>
    <div></div>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import { initialiseStores } from '~/utils/store-accessor'

@Component({})
export default class Mobile extends Vue {
    asyncData({ redirect }) {
        const { identity, auth } = initialiseStores(['identity', 'auth'])
        if (identity.identityState.mobileNumberVerified || !auth.isLoggedIn) {
            return redirect('/dashboard')
        }
    }
}
</script>

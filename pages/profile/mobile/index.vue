<template>
    <div></div>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import { authStore, identitiesStore } from '@/utils/store-accessor'

@Component({})
export default class Mobile extends Vue {
    asyncData({ redirect, store }) {
        if (identitiesStore(store).mobileNumberVerified || !authStore(store).isLoggedIn) {
            return redirect('/dashboard')
        }
    }
}
</script>

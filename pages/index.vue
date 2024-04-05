<template>
    <section>
        <b-container>
            <b-row>
                <b-col class="text-center"> Loading...</b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'

@Component({})
export default class IndexPage extends mixins(BaseMixin) {
    async asyncData({ redirect }) {
        const isLoggedIn = this.authStore.isLoggedIn

        if (!isLoggedIn) {
            redirect('/login')
        } else {
            const identities = this.identityStore

            if (!identities.identityState.identity) {
                await identities.getIdentity()
            }

            if (!identities.identityState.emailVerified) {
                const email = window.encodeURIComponent(
                    identities.identityState.identity!.rootUser?.email,
                )
                redirect(`/login/verify?send=true&email=${email}`)
            } else if (!identities.identityState.mobileNumberVerified) {
                redirect('/login/verify/mobile')
            } else if (
                identities.identityState.identity &&
                typeof identities.identityState.identity.rootUser === 'undefined'
            ) {
                redirect('/profile/address')
            } else {
                redirect('/dashboard')
            }
        }
    }
}
</script>

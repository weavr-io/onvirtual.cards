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
import { defineComponent } from 'vue'
import { initialiseStores } from '~/utils/store-accessor'

export default defineComponent({
    name: 'IndexPage',
    async asyncData({ redirect }) {
        const { identity, auth } = initialiseStores(['identity', 'auth'])
        const isLoggedIn = auth!.isLoggedIn

        if (!isLoggedIn) {
            redirect('/login')
        } else {
            const identities = identity!

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
    },
})
</script>

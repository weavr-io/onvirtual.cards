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
import { authStore, identitiesStore } from '~/utils/store-accessor'

@Component({})
export default class IndexPage extends mixins(BaseMixin) {
    async asyncData({ store, redirect }) {
        console.log('ha')
        const isLoggedIn = authStore(store).isLoggedIn

        if (!isLoggedIn) {
            redirect('/login')
        } else {
            const identities = identitiesStore(store)

            if (identities.identity === null) {
                await identities.getIdentity()
            }

            if (!identities.emailVerified) {
                const email = window.encodeURIComponent(identities.identity!.rootUser?.email)
                redirect(`/login/verify?send=true&email=${email}`)
            } else if (!identities.mobileNumberVerified) {
                redirect('/login/verify/mobile')
            } else if (identities.identity && typeof identities.identity.rootUser === 'undefined') {
                redirect('/profile/address')
            } else {
                redirect('/dashboard')
            }
        }
    }
}
</script>

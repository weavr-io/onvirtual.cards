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
import { initialiseStores } from '~/utils/pinia-store-accessor'

@Component({})
export default class IndexPage extends mixins(BaseMixin) {
    async asyncData({ redirect }) {
        const { auth } = initialiseStores(['auth'])
        const isLoggedIn = auth?.isLoggedIn

        if (!isLoggedIn) {
            redirect('/login')
        } else {
            if (this.identityStore.identityState.identity === null) {
                await this.identityStore.getIdentity()
            }

            if (!this.identityStore.identityState.emailVerified) {
                const email = window.encodeURIComponent(
                    this.identityStore.identityState.identity!.rootUser?.email,
                )
                redirect(`/login/verify?send=true&email=${email}`)
            } else if (!this.identityStore.identityState.mobileNumberVerified) {
                redirect('/login/verify/mobile')
            } else if (
                this.identityStore.identityState.identity &&
                typeof this.identityStore.identityState.identity.rootUser === 'undefined'
            ) {
                redirect('/profile/address')
            } else {
                redirect('/dashboard')
            }
        }
    }
}
</script>

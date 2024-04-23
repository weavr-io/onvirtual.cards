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
        const { auth, identity } = initialiseStores(['auth', 'identity'])
        const isLoggedIn = auth?.isLoggedIn

        if (!isLoggedIn) {
            redirect('/login')
        } else {
            if (identity!.identityState.identity === null) {
                await identity!.getIdentity()
            }

            if (!identity!.identityState.emailVerified) {
                const email = window.encodeURIComponent(
                    identity!.identityState.identity!.rootUser?.email,
                )
                redirect(`/login/verify?send=true&email=${email}`)
            } else if (!identity!.identityState.mobileNumberVerified) {
                redirect('/login/verify/mobile')
            } else if (
                identity!.identityState.identity &&
                typeof identity!.identityState.identity.rootUser === 'undefined'
            ) {
                redirect('/profile/address')
            } else {
                redirect('/dashboard')
            }
        }
    }
}
</script>

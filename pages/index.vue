<template>
    <section>
        <b-container>
            <b-row>
                <b-col class="text-center"> Loading...</b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts" setup>
import { useAsync, useRouter } from '@nuxtjs/composition-api'
import { useStores } from '~/composables/useStores'

const { replace } = useRouter()
const { auth, identity } = useStores(['auth', 'identity'])

useAsync(async () => {
    const isLoggedIn = auth?.isLoggedIn

    if (!isLoggedIn) {
        replace('/login')
    } else {
        if (identity!.identityState.identity === null) {
            await identity!.getIdentity()
        }

        if (!identity!.identityState.emailVerified) {
            const email = window.encodeURIComponent(
                identity!.identityState.identity!.rootUser?.email,
            )
            replace(`/login/verify?send=true&email=${email}`)
        } else if (!identity!.identityState.mobileNumberVerified) {
            replace('/login/verify/mobile')
        } else if (
            identity!.identityState.identity &&
            typeof identity!.identityState.identity.rootUser === 'undefined'
        ) {
            replace('/profile/address')
        } else {
            replace('/dashboard')
        }
    }
})
</script>

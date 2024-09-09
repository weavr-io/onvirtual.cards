<template>
    <section>
        <b-container>
            <b-row>
                <b-col class="text-center">Loading...</b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'

const router = useRouter()
const { auth, identity } = useStores(['auth', 'identity'])

useAsyncData(async () => {
    const isLoggedIn = auth?.isLoggedIn

    if (!isLoggedIn) {
        router.replace('/login')
    } else {
        if (identity?.identityState.identity === null) {
            await identity!.getIdentity()
        }

        if (!identity?.identityState.emailVerified) {
            const email = window.encodeURIComponent(
                identity!.identityState.identity!.rootUser?.email,
            )
            router.replace(`/login/verify?send=true&email=${email}`)
        } else if (!identity!.identityState.mobileNumberVerified) {
            router.replace('/login/verify/mobile')
        } else if (
            identity!.identityState.identity &&
            typeof identity!.identityState.identity.rootUser === 'undefined'
        ) {
            router.replace('/profile/address')
        } else {
            router.replace('/dashboard')
        }
    }
})
</script>

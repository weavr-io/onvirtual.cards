<template>
    <section>
        <b-container>
            <b-row>
                <b-col class="text-center"></b-col>
            </b-row>
        </b-container>
    </section>
</template>

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'

definePageMeta({
    middleware: async (_) => {
        const { auth, identity } = useStores(['auth', 'identity'])

        if (!auth?.isLoggedIn) {
            return navigateTo('/login')
        }

        if (identity?.identityState.identity === null) {
            await identity.getIdentity()
        }

        if (!identity?.identityState.emailVerified) {
            const email = encodeURIComponent(identity!.identityState.identity!.rootUser?.email)
            return navigateTo(`/login/verify?send=true&email=${email}`)
        }

        if (!identity?.identityState.mobileNumberVerified) {
            return navigateTo('/login/verify/mobile')
        }

        if (
            identity?.identityState.identity &&
            typeof identity.identityState.identity.rootUser === 'undefined'
        ) {
            return navigateTo('/profile/address')
        }

        return navigateTo('/dashboard')
    },
})
</script>

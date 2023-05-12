<template>
    <b-container>
        <div class="d-flex flex-column align-items-center">
            <logo />
            <access-code-component v-if="$config.production && !isAccessCodeValid" />
            <business-or-personal-component v-else />
        </div>
    </b-container>
</template>
<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import Vue from 'vue'
import { authStore } from '~/utils/store-accessor'
import BusinessOrPersonalComponent from '~/components/registration/BusinessOrPersonalComponent.vue'
import AccessCodeComponent from '~/components/registration/AccessCodeComponent.vue'
import Logo from '~/components/Logo.vue'
import { useBase } from '~/composables/useBase'

@Component({
    components: {
        Logo,
        AccessCodeComponent,
        BusinessOrPersonalComponent,
    },
    layout: 'auth',
    middleware: 'accessCodeVerified',
})
export default class RegistrationPage extends Vue {
    base = useBase(this)

    get isAccessCodeValid() {
        return this.base.stores.accessCodes.isValid
    }

    asyncData({ store, redirect }) {
        const isLoggedIn = authStore(store).isLoggedIn

        if (isLoggedIn) {
            redirect('/dashboard')
        }
    }
}
</script>

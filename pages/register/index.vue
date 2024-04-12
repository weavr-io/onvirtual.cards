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
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import { authStore } from '~/utils/store-accessor'
import BusinessOrPersonalComponent from '~/components/registration/BusinessOrPersonalComponent.vue'
import AccessCodeComponent from '~/components/registration/AccessCodeComponent.vue'
import Logo from '~/components/Logo.vue'
import { useAccessCodesStore } from '~/store/accessCodes'

@Component({
    components: {
        Logo,
        AccessCodeComponent,
        BusinessOrPersonalComponent,
    },
    layout: 'auth',
    middleware: 'accessCodeVerified',
})
export default class RegistrationPage extends mixins(BaseMixin) {
    accessCodesStore = useAccessCodesStore()
    get isAccessCodeValid() {
        return this.accessCodesStore.isValid
    }

    asyncData({ store, redirect }) {
        const isLoggedIn = authStore(store).isLoggedIn

        if (isLoggedIn) {
            redirect('/dashboard')
        }
    }
}
</script>

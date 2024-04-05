<template>
    <b-container>
        <div class="d-flex flex-column align-items-center">
            <logo />
            <access-code-component
                v-if="useRuntimeConfig().public.production && !isAccessCodeValid"
            />
            <business-or-personal-component v-else />
        </div>
    </b-container>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { initialiseStores } from '~/utils/store-accessor'
import BusinessOrPersonalComponent from '~/components/registration/BusinessOrPersonalComponent.vue'
import AccessCodeComponent from '~/components/registration/AccessCodeComponent.vue'
import BaseMixin from '~/mixins/BaseMixin'
import Logo from '~/components/Logo.vue'

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
    get isAccessCodeValid() {
        return this.accessCodes.isValid
    }

    asyncData({ redirect }) {
        const { auth } = initialiseStores(['auth'])
        const isLoggedIn = auth?.isLoggedIn

        if (isLoggedIn) {
            redirect('/dashboard')
        }
    }
}
</script>

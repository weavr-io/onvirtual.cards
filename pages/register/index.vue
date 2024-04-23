<template>
    <b-container>
        <div class="d-flex flex-column align-items-center">
            <LogoOvc />
            <access-code-component v-if="$config.production && !isAccessCodeValid" />
            <business-or-personal-component v-else />
        </div>
    </b-container>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import AccessCodeComponent from '~/components/registration/AccessCodeComponent.vue'
import BusinessOrPersonalComponent from '~/components/registration/BusinessOrPersonalComponent.vue'
import BaseMixin from '~/mixins/BaseMixin'
import { initialiseStores } from '~/utils/pinia-store-accessor'
import LogoOvc from '~/components/atoms/LogoOvc.vue'

@Component({
    components: {
        LogoOvc,
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

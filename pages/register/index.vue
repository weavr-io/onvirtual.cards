<template>
  <b-col>
    <b-row>
      <b-col>
        <div class="text-center">
          <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards" />
        </div>
      </b-col>
    </b-row>
    <access-code-component v-if="!isAccessCodeValid" />
    <business-or-personal-component v-else />
  </b-col>
</template>
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import { authStore } from '~/utils/store-accessor'
import BusinessOrPersonalComponent from '~/components/registration/BusinessOrPersonalComponent.vue'
import AccessCodeComponent from '~/components/registration/AccessCodeComponent.vue'

@Component({
  components: {
    AccessCodeComponent,
    BusinessOrPersonalComponent
  },
  layout: 'auth',
  middleware: 'accessCodeVerified'
})
export default class RegistrationPage extends mixins(BaseMixin) {
  get isAccessCodeValid() {
    return this.stores.accessCodes.isValid
  }

  asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (isLoggedIn) {
      redirect('/dashboard')
    }
  }
}
</script>

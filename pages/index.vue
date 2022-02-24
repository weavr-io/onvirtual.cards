<template>
  <section>
    <b-container>
      <b-row>
        <b-col class="text-center">
          Loading...
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, identitiesStore } from '~/utils/store-accessor'

@Component({})
export default class IndexPage extends mixins(BaseMixin) {
  async asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (!isLoggedIn) {
      redirect('/login')
    }

    const identities = identitiesStore(store)

    if (identities.identity === null) {
      await identities.getIdentity()
    }

    if (!identities.emailVerified) {
      const email = window.encodeURIComponent(identities.identity!.rootUser?.email)
      redirect(`/register/verify?send=true&email=${email}`)
    } else if (!identities.mobileNumberVerified) {
      redirect('/register/verify/mobile')
    } else if (identities.identity && typeof identities.identity.rootUser === 'undefined') {
      redirect('/profile/address')
    } else {
      redirect('/dashboard')
    }
  }
}
</script>

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
import { authStore, consumersStore, corporatesStore } from '~/utils/store-accessor'

@Component({})
export default class IndexPage extends mixins(BaseMixin) {
  async asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (isLoggedIn) {
      if (authStore(store).isConsumer) {
        let _consumer = consumersStore(store).consumer

        if (_consumer === null) {
          await consumersStore(store).get()
          _consumer = consumersStore(store).consumer
        }

        if (_consumer && _consumer.rootUser && !_consumer.rootUser.emailVerified) {
          const email = window.encodeURIComponent(_consumer.rootUser.email)
          redirect(`/register/verify?send=true&email=${email}`)
        } else if (_consumer && _consumer.rootUser && !_consumer.rootUser.mobileNumberVerified) {
          redirect('/register/verify/mobile')
        } else if (_consumer && typeof _consumer.rootUser === 'undefined') {
          redirect('/profile/address')
        } else {
          redirect('/dashboard')
        }
      } else {
        // treat as corporate
        let _corporate = corporatesStore(store).corporate

        if (_corporate === null) {
          await corporatesStore(store).get()
          _corporate = corporatesStore(store).corporate
        }

        if (_corporate && _corporate.rootUser && !_corporate.rootUser.emailVerified) {
          const email = window.encodeURIComponent(_corporate.rootUser.email)
          redirect(`/register/verify?send=true&email=${email}`)
        } else if (_corporate && _corporate.rootUser && !_corporate.rootUser.mobileNumberVerified) {
          redirect('/register/verify/mobile')
        } else if (_corporate && typeof _corporate.rootUser === 'undefined') {
          redirect('/profile/address')
        } else {
          redirect('/dashboard')
        }
      }
    } else {
      redirect('/login')
    }
  }
}
</script>

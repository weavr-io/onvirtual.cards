<template>
  <section>
    <b-container>
      <b-row>
        <b-col class="text-center">
          Loading
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as AuthStore from '~/store/modules/Auth'
import * as ConsumersStore from '~/store/modules/Consumers'

@Component({})
export default class IndexPage extends Vue {
  async asyncData({ store, redirect }) {
    const isLoggedIn = store.getters['auth/isLoggedIn']

    if (isLoggedIn) {
      if (AuthStore.Helpers.isConsumer(store)) {
        const _consumerId = AuthStore.Helpers.identityId(store)
        if (_consumerId) {
          const res = await ConsumersStore.Helpers.get(store, _consumerId)
          if (res.data.kyc && res.data.kyc.mobileVerified === false) {
            redirect('/verify/consumers/mobile')
          } else {
            redirect('/dashboard')
          }
        } else {
          redirect('/dashboard')
        }
      } else {
        redirect('/dashboard')
      }
    } else {
      redirect('/login')
    }
  }
}
</script>

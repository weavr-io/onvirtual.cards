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
import { Component, mixins } from 'nuxt-property-decorator'
import * as ConsumersStore from '~/store/modules/Consumers'
import BaseMixin from '~/minixs/BaseMixin'
import { authStore, corporatesStore } from '~/utils/store-accessor'

@Component({})
export default class IndexPage extends mixins(BaseMixin) {
  async asyncData({ store, redirect }) {
    const isLoggedIn = authStore(store).isLoggedIn

    if (isLoggedIn) {
      const _auth = authStore(store).auth
      if (authStore(store).isConsumer) {
        let _cons = ConsumersStore.Helpers.consumer(store)

        if (_cons === null) {
          await ConsumersStore.Helpers.get(store, _auth.identity!.id!)
          _cons = ConsumersStore.Helpers.consumer(store)
        }

        if (_cons && _cons.kyc && !_cons.kyc.emailVerified) {
          redirect('/register/verify?send=true')
        } else if (_cons && _cons.kyc && !_cons.kyc.mobileVerified) {
          redirect('/register/verify/mobile')
        } else if (_cons && typeof _cons.address === 'undefined') {
          redirect('/profile/address')
        } else {
          redirect('/dashboard')
        }
      } else if (authStore(store).isCorporate) {
        const res = await corporatesStore(store).getKyb(_auth.identity!.id!)

        if (res.data.rootEmailVerified && res.data.rootMobileVerified) {
          redirect('/dashboard')
        } else if (res.data.rootEmailVerified) {
          redirect('/register/verify?send=true')
        } else if (res.data && res.data.rootMobileVerified) {
          redirect('/register/verify/mobile')
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

<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col md="6" offset-md="3">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards">
          </div>
        </b-col>
      </b-row>
    </b-container>
  </section>
</template>
<script lang="ts">
import { namespace } from 'vuex-class'
import { Component } from 'nuxt-property-decorator'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as AuthStore from '~/store/modules/Auth'

import { CorporatesSchemas } from '~/api/CorporatesSchemas'
import config from '~/config'
import { _Functions } from '~/store/modules/Contracts/Corporates'

const Corporates = namespace(CorporatesStore.name)
const Auth = namespace(AuthStore.name)

@Component({
  layout: 'auth'
})
export default class RegistrationPage extends VueWithRouter {
  asyncData({ store, redirect }) {
    const isLoggedIn = store.getters['auth/isLoggedIn']

    if (isLoggedIn) {
      redirect('/dashboard')
    } else {
      redirect('/register/corporate')
    }
  }
}
</script>

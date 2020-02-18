<template>
  <section>
    <b-container>
      <b-row class="full-height-vh" align-v="center">
        <b-col md="6" offset-md="3">
          <div class="text-center pb-5">
            <img src="/img/logo.svg" width="200" class="d-inline-block align-top" alt="onvirtual.cards">
          </div>
          <b-card no-body class="overflow-hidden">
            <registration-nav />
            <b-card-body class="px-6 py-5">
              <div class="form-screens">
                <error-alert />
                dasdad
              </div>
            </b-card-body>
          </b-card>
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
  layout: 'auth',
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue'),
    RegisterForm: () => import('~/components/registration/RegisterForm1.vue'),
    PersonalDetailsForm: () => import('~/components/registration/PersonalDetails.vue'),
    CompanyDetailsForm: () => import('~/components/registration/CompanyDetails.vue'),
    RegistrationNav: () => import('~/components/registration/Nav.vue')
  }
})
export default class ConsumerRegistrationPage extends VueWithRouter {

}
</script>

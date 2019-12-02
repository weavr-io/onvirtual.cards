<template>
  <section>
    <b-container>
      <b-row>
        <b-col>
          <h2 class="text-center font-weight-lighter mb-5">Invite User</h2>
        </b-col>
      </b-row>
      <b-row>
        <b-col md="6" offset-md="3">
          <b-form @submit="doAdd">
            <b-form-row>
              <b-col>
                <b-form-group label="Type:">
                  <b-form-input v-model="request.request.type" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Username:">
                  <b-form-input v-model="request.request.username" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <!-- <b-form-row>
              <b-col>
                <b-form-group label="Title:">
                  <b-form-input v-model="request.request.title" />
                </b-form-group>
              </b-col>
            </b-form-row> -->
            <b-form-row>
              <b-col>
                <b-form-group label="Name:">
                  <b-form-input v-model="request.request.name" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Surname:">
                  <b-form-input v-model="request.request.surname" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Email:">
                  <b-form-input v-model="request.request.email" type="email" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Company Positions:">
                  <b-form-input v-model="request.request.companyPosition" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Mobile Country Code:">
                  <b-form-input v-model="request.request.mobileCountryCode" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-group label="Mobile Number:">
                  <b-form-input v-model="request.request.mobileNumber" />
                </b-form-group>
              </b-col>
            </b-form-row>
            <b-form-row>
              <b-col>
                <b-form-checkbox v-model="request.request.active">Active</b-form-checkbox>
              </b-col>
            </b-form-row>
            <loader-button
              :is-loading="isLoading"
              button-text="send invite"
              class="mt-5 text-center"
            />
          </b-form>
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

const Corporates = namespace(CorporatesStore.name)
const Auth = namespace(AuthStore.name)

@Component({
  components: {
    ErrorAlert: () => import('~/components/ErrorAlert.vue'),
    LoaderButton: () => import('~/components/LoaderButton.vue')
  }
})
export default class AddCardPage extends VueWithRouter {
  @Corporates.Action addUser

  @Corporates.Getter isLoading

  @Auth.Getter corporateId

  public request: CorporatesSchemas.CreateCorporateUserFullRequest = {
    corporateId: 0,
    request: {
      type: 'USER',
      username: '',
      title: '',
      name: '',
      surname: '',
      email: '',
      secretType: {
        firstSecretType: 'passwords'
      },
      active: true,
      companyPosition: '',
      mobileCountryCode: '',
      mobileNumber: ''
    }
  }

  doAdd(evt) {
    evt.preventDefault()
    this.addUser(this.request).then(() => {
      this.$router.push('/users')
    })
  }

  mounted() {
    super.mounted()
    this.request.corporateId = this.corporateId
  }
}
</script>

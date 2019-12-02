<template>
  <section>
    <b-container>
      <b-row class="border-bottom mb-3">
        <b-col>
          <h3 class="font-weight-light">Users</h3>
        </b-col>
      </b-row>
      <b-row class="mb-5">
        <b-col class="text-right">
          <b-button to="/users/add" variant="border-primary">+ invite user</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-if="users">
      <b-row v-for="(user, key) in users.user" :key="key" class="mt-3" align-v="center">
        <b-col cols="1">
          <b-img v-bind="mainProps" rounded :alt="user.name + ' ' + user.surname"></b-img>
        </b-col>
        <b-col>{{ user.name }} {{ user.surname }}</b-col>
        <b-col class="text-muted font-weight-light">{{user.email}}</b-col>
        <!-- <b-col class="text-muted font-weight-light">{{user.type}}</b-col> -->
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator'
import { namespace } from 'vuex-class'
import { VueWithRouter } from '~/base/classes/VueWithRouter'
import * as CorporatesStore from '~/store/modules/Corporates'
import * as AuthStore from '~/store/modules/Auth'
const Auth = namespace(AuthStore.name)
const Corporates = namespace(CorporatesStore.name)

@Component({})
export default class CardsPage extends VueWithRouter {
  mainProps = {
    blank: true,
    blankColor: '#EAEDF6',
    width: 45,
    height: 45
  }

  @Corporates.Getter users

  @Auth.Getter corporateId

  asyncData({ store }) {
    let _corporateId = store.getters['auth/corporateId']
    return store.dispatch('corporates/getUsers', _corporateId)
  }
}
</script>

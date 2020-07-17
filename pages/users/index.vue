<template>
  <section>
    <b-container>
      <b-row class="border-bottom mb-3">
        <b-col>
          <h3 class="font-weight-light">
            Users
          </h3>
        </b-col>
      </b-row>
      <b-row class="mb-5">
        <b-col class="text-right">
          <b-button to="/users/add" variant="border-primary">
            + invite user
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container v-if="users">
      <b-row v-for="(user, key) in users.user" :key="key" class="mt-3" align-v="center">
        <b-col cols="1">
          <b-img v-bind="mainProps" :alt="user.name + ' ' + user.surname" rounded />
        </b-col>
        <b-col>{{ user.name }} {{ user.surname }}</b-col>
        <b-col class="text-muted font-weight-light">
          {{ user.email }}
        </b-col>
        <!-- <b-col class="text-muted font-weight-light">{{user.type}}</b-col> -->
      </b-row>
    </b-container>
  </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/minixs/BaseMixin'
import { corporatesStore } from '~/utils/store-accessor'

@Component({})
export default class UsersPage extends mixins(BaseMixin) {
  mainProps = {
    blank: true,
    blankColor: '#EAEDF6',
    width: 45,
    height: 45
  }

  get users() {
    return this.stores.corporates.users
  }

  asyncData({ store }) {
    const _corporateId = store.getters['auth/identityId']
    return corporatesStore(store).getUsers(_corporateId)
  }
}
</script>

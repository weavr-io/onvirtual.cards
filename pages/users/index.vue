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
                    <b-button to="/users/add" variant="border-primary"> + invite user</b-button>
                </b-col>
            </b-row>

            <template v-if="users && !pendingDataOrError">
                <b-row v-for="(user, key) in users.users" :key="key" align-v="center" class="mt-3">
                    <b-col cols="2" md="1">
                        <b-img :alt="user.name + ' ' + user.surname" rounded v-bind="mainProps" />
                    </b-col>
                    <b-col>{{ user.name }} {{ user.surname }}</b-col>
                    <b-col class="text-muted font-weight-light">
                        {{ user.email }}
                    </b-col>
                </b-row>
            </template>
            <template v-else>
                <div class="d-flex justify-content-center">
                    <div class="loader-spinner">
                        <b-spinner />
                    </div>
                </div>
            </template>
        </b-container>
    </section>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'

@Component({ middleware: ['kyVerified'] })
export default class UsersPage extends mixins(BaseMixin) {
    mainProps = {
        blank: true,
        blankColor: '#EAEDF6',
        width: 45,
        height: 45,
    }

    get users() {
        return this.stores.users.users
    }

    fetch() {
        return this.stores.users.index()
    }
}
</script>

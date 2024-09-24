<template>
    <section>
        <b-container>
            <b-row class="border-bottom mb-3">
                <b-col>
                    <h3 class="fw-light">Users</h3>
                </b-col>
            </b-row>
            <b-row class="mb-5">
                <b-col class="text-end">
                    <b-button to="/users/add" class="btn-border-primary bg-transparent"
                        >+ invite user</b-button
                    >
                </b-col>
            </b-row>

            <template v-if="users">
                <b-row v-for="(user, key) in users.users" :key="key" align-v="center" class="mt-3">
                    <b-col cols="2" md="1">
                        <b-img v-bind="mainProps" :alt="user.name + ' ' + user.surname" rounded />
                    </b-col>
                    <b-col>{{ user.name }} {{ user.surname }}</b-col>
                    <b-col class="text-muted fw-light">
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

<script lang="ts" setup>
import { useStores } from '~/composables/useStores'

definePageMeta({
    middleware: 'ky-verified',
})

const { users: usersStores } = useStores(['users'])
usersStores?.index()

const mainProps = {
    blank: true,
    blankColor: '#EAEDF6',
    width: 45,
    height: 45,
}

const users = computed(() => {
    return usersStores?.userState.users
})
</script>

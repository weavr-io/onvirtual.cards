<template>
    <div id="main-header">
        <div v-if="showHeader" class="container-fluid">
            <b-navbar class="fixed-top auth-nav-bar" variant="card">
                <b-container>
                    <b-collapse id="nav_collapse" is-nav>
                        <b-navbar-nav class="ml-auto">
                            <b-nav-item v-if="showRegister && !isLoggedIn" to="/register"
                                >Register
                            </b-nav-item>
                            <b-nav-item v-if="showLogin && !isLoggedIn" to="/login"
                                >Sign In
                            </b-nav-item>
                            <b-nav-item v-if="isLoggedIn">
                                <b-button class="nav-item" @click="doLogout">Sign out</b-button>
                            </b-nav-item>
                        </b-navbar-nav>
                    </b-collapse>
                </b-container>
            </b-navbar>
        </div>
        <b-container>
            <b-row
                align-h="center"
                align-v="center"
                style="min-height: calc(100vh - var(--navbar-height))"
            >
                <NuxtPage
                    class="d-flex flex-column pt-2"
                    style="margin-top: var(--navbar-height)"
                />
            </b-row>
        </b-container>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useBase } from '~/composables/useBase'

const route = useRoute()
const { isLoggedIn, doLogout } = useBase()

const showHeader = computed(() => {
    return useRuntimeConfig().app.view_register
})

const showLogin = computed(() => {
    const _matchedName = route.matched[0].name as string
    if (_matchedName) {
        const _registration = ['login']
        return !_registration.includes(_matchedName)
    } else {
        return false
    }
})

const showRegister = computed(() => {
    return !showLogin.value
})
</script>

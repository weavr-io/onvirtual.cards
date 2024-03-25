<template>
    <div id="main-header">
        <div v-if="showHeader" class="container-fluid">
            <b-navbar variant="card" class="fixed-top auth-nav-bar">
                <b-container>
                    <b-collapse id="nav_collapse" is-nav>
                        <b-navbar-nav class="ml-auto">
                            <b-nav-item v-if="showRegister && !isLoggedIn" to="/register"
                                >Register</b-nav-item
                            >
                            <b-nav-item v-if="showLogin && !isLoggedIn" to="/login"
                                >Sign In</b-nav-item
                            >
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
                style="min-height: calc(100vh - var(--navbar-height))"
                align-v="center"
                align-h="center"
            >
                <nuxt class="d-flex flex-column pt-2" style="margin-top: var(--navbar-height)" />
            </b-row>
        </b-container>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useBase } from '@/composables/useBase'

export default defineComponent({
    name: 'AuthLayout',
    setup() {
        const { isLoggedIn, doLogout, root } = useBase()

        const showHeader = computed(() => root!.$config.app.view_register)
        const showRegister = computed(() => showLogin)

        const showLogin = computed(() => {
            const _matchedName = root!.$route.matched[0].name

            if (_matchedName) {
                const _registration = ['login']
                return !_registration.includes(_matchedName)
            }

            return false
        })

        return { isLoggedIn, doLogout, showHeader, showLogin, showRegister }
    },
    head() {
        return {
            bodyAttrs: {
                class: 'bg-bg-colored',
            },
        }
    },
})
</script>

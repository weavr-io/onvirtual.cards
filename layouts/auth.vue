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
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'

@Component({
    components: {
        AppFooter: () => import('~/components/Footer.vue'),
        cookiePolicy: () => import('~/components/cookie.vue'),
    },
    head: {
        bodyAttrs: {
            class: 'bg-bg-colored',
        },
    },
})
class AuthLayout extends mixins(BaseMixin) {
    get showHeader(): boolean {
        return this.$config.app.view_register
    }

    get showRegister(): boolean {
        return !this.showLogin
    }

    get showLogin(): boolean {
        const _matchedName = this.$route.matched[0].name
        if (_matchedName) {
            const _registration = ['login']
            return !_registration.includes(_matchedName)
        } else {
            return false
        }
    }
}

export default AuthLayout
</script>

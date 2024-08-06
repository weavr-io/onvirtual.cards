<template>
    <div class="container-fluid px-0 mb-5 pb-5">
        <b-navbar class="navbar-padding-adjust" fixed="top" type="light" variant="white">
            <b-container>
                <b-navbar-brand to="/">
                    <LogoImage class="align-center" size="md" />
                </b-navbar-brand>
                <b-collapse v-if="isLoggedIn" id="nav_collapse" is-nav>
                    <b-navbar-nav class="ms-auto">
                        <b-nav-item-dropdown right toggle-class="border-bottom">
                            <template #button-content>
                                {{ rootFullName }}
                            </template>
                            <b-dropdown-item to="/profile"> Profile</b-dropdown-item>
                            <b-dropdown-item v-if="isCorporate" to="/users"> Users</b-dropdown-item>
                            <b-dropdown-item @click="doLogout"> Sign out</b-dropdown-item>
                        </b-nav-item-dropdown>
                    </b-navbar-nav>
                </b-collapse>
            </b-container>
        </b-navbar>
    </div>
</template>

<script lang="ts" setup>
import { useBase } from '~/composables/useBase'
import { useStores } from '~/composables/useStores'
import LogoImage from '~/components/atoms/LogoImage.vue'

const { consumer, corporate, isConsumer, isCorporate, isLoggedIn, rootFullName, doLogout } =
    useBase()
const { consumers, corporates } = useStores(['consumers', 'corporates'])

useAsyncData(async () => {
    if (!consumer.value && !corporate.value) {
        if (isConsumer.value) {
            await consumers?.get()
        } else if (isCorporate.value) {
            await corporates?.get()
        }
    }
})
</script>

<style lang="scss" scoped>
.dropdown-toggle {
    border-bottom: 2px solid;
}
</style>

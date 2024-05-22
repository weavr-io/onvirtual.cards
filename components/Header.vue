<template>
    <div class="container-fluid px-0 mb-5 pb-5">
        <b-navbar class="navbar-padding-adjust" fixed="top" type="light" variant="white">
            <b-container>
                <b-navbar-brand to="/">
                    <LogoImage class="align-center" size="md" />
                </b-navbar-brand>
                <b-collapse v-if="isLoggedIn" id="nav_collapse" is-nav>
                    <b-navbar-nav class="ml-auto">
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
<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import BaseMixin from '~/mixins/BaseMixin'
import LogoImage from '~/components/atoms/LogoImage.vue'

@Component({
    components: { LogoImage },
})
export default class Header extends mixins(BaseMixin) {
    fetch() {
        if (this.consumer === null && this.corporate === null) {
            if (this.isConsumer) {
                this.consumersStore.get()
            } else if (this.isCorporate) {
                this.corporatesStore.get()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.dropdown-toggle {
    border-bottom: 2px solid;
}
</style>

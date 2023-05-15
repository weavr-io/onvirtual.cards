<template>
    <b-container class="container-full-height">
        <b-row align-h="center" align-v="center" class="min-vh-100">
            <b-col class="text-center" lg="6" md="9">
                <template v-if="is404">
                    <h1 class="font-weight-light">Page not found.</h1>
                    <b-img class="mt-5 mb-4" fluid src="/img/ohsnap.svg"></b-img>
                    <b-button to="/" variant="secondary"> go to dashboard</b-button>
                </template>
                <template v-else>
                    <h1 class="font-weight-light">Oh snap!</h1>
                    <h5 class="text-grey font-weight-normal">Something is not right.</h5>
                    <b-img class="mt-5 mb-4" fluid src="/img/ohsnap.svg"></b-img>
                    <b-button to="/" variant="secondary"> go to dashboard</b-button>
                </template>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { Component, Prop } from 'nuxt-property-decorator'
import Vue from 'vue'

@Component
export default class NuxtError extends Vue {
    @Prop(Object) error!: any

    get statusCode() {
        return (this.error && this.error.statusCode) || 500
    }

    get is404() {
        return this.statusCode === 404
    }

    head() {
        return {
            title: this.statusCode === 404 ? 'Page Not Found' : 'Oh snap!',
            meta: [
                {
                    name: 'viewport',
                    content:
                        'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no',
                },
            ],
        }
    }

    mounted() {
        switch (this.error.statusCode) {
            case 401:
                this.$router.replace('/login')
                break
            case 403:
                this.$router.replace('/forbidden')
                break
        }
    }
}
</script>
<style lang="scss" scoped>
.container-full-height {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}
</style>

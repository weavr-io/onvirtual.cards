<template>
    <b-container class="container-full-height">
        <b-row class="min-vh-100" align-h="center" align-v="center">
            <b-col class="text-center" md="9" lg="6">
                <template v-if="is404">
                    <h1 class="font-weight-light">Page not found.</h1>
                    <b-img src="/img/ohsnap.svg" fluid class="mt-5 mb-4"></b-img>
                    <b-button variant="secondary" to="/"> go to dashboard </b-button>
                </template>
                <template v-else>
                    <h1 class="font-weight-light">Oh snap!</h1>
                    <h5 class="text-grey font-weight-normal">Something is not right.</h5>
                    <b-img src="/img/ohsnap.svg" fluid class="mt-5 mb-4"></b-img>
                    <b-button variant="secondary" to="/"> go to dashboard </b-button>
                </template>
            </b-col>
        </b-row>
    </b-container>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, defineProps } from 'vue'
import { useBase } from '@/composables/useBase'

export default defineComponent({
    name: 'NuxtError',
    setup() {
        const props = defineProps({
            error: {
                type: Object,
                required: true,
            },
        })

        const { root } = useBase()

        onMounted(() => {
            switch (props.error.statusCode) {
                case 401:
                    root!.$router.replace('/login')
                    break
                case 403:
                    root!.$router.replace('/forbidden')
                    break
            }
        })

        const statusCode = computed(() => props.error?.statusCode || 500)
        const is404 = computed(() => statusCode.value === 404)

        return { statusCode, is404 }
    },
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
    },
})
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

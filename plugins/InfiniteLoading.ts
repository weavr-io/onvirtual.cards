import Vue from 'vue'
import { defineNuxtPlugin } from 'nuxt/app'
import InfiniteLoading from 'vue-infinite-loading'

export default defineNuxtPlugin((_) => {
    // TODO: Update to use nuxtApp context after full migration
    Vue.component('InfiniteLoading', InfiniteLoading)
})

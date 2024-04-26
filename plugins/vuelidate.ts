import Vue from 'vue'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import Vuelidate from 'vuelidate'

export default defineNuxtPlugin((_) => {
    // TODO: Update to use nuxtApp context after full migration
    Vue.use(Vuelidate)
})

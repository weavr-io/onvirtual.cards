import Vue from 'vue'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import VueFlatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default defineNuxtPlugin((_) => {
    // TODO: Update to use nuxtApp context after full migration
    Vue.use(VueFlatPickr)
})

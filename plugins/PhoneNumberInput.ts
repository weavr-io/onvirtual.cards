import Vue from 'vue'
import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import VuePhoneNumberInput from 'vue-phone-number-input'
import 'vue-phone-number-input/dist/vue-phone-number-input.css'

export default defineNuxtPlugin((_) => {
    // TODO: Update to use nuxtApp context after full migration
    Vue.component('VuePhoneNumberInput', VuePhoneNumberInput)
})

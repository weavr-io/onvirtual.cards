import BootstrapVue from 'bootstrap-vue'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(BootstrapVue, BootstrapVue)

    nuxtApp.$bvModal = nuxtApp.vueApp.config.globalProperties.$bvModal
    nuxtApp.$bvToast = nuxtApp.vueApp.config.globalProperties.$bvToast

    nuxtApp.vueApp.provide('bvModal', nuxtApp.$bvModal)
    nuxtApp.vueApp.provide('bvToast', nuxtApp.$bvToast)
})

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(BootstrapVue, {
        BTooltip: {
            variant: 'primary',
        },
        BModal: {
            footerClass: 'mb-5',
            headerClass: 'align-items-center',
            okVariant: 'primary rounded-pill',
            cancelVariant: 'outline-muted rounded-pill',
            centered: true,
        },
        BButton: {
            variant: 'primary',
            size: 'lg',
        },
        breakpoints: ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'],
    })

    nuxtApp.$bvModal = nuxtApp.vueApp.config.globalProperties.$bvModal
    nuxtApp.$bvToast = nuxtApp.vueApp.config.globalProperties.$bvToast

    nuxtApp.vueApp.provide('bvModal', nuxtApp.$bvModal)
    nuxtApp.vueApp.provide('bvToast', nuxtApp.$bvToast)
})

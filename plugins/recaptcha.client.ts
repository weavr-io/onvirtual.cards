import { install, RecaptchaV2, useRecaptcha } from 'vue3-recaptcha-v2'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.hook('app:mounted', () => {
        nuxtApp.vueApp.use(install, {
            sitekey: `${useRuntimeConfig().public.recaptcha.siteKey}`,
            cnDomains: false,
        })

        nuxtApp.provide('recaptcha', useRecaptcha)
        nuxtApp.vueApp.component('RecaptchaForm', RecaptchaV2)
    })
})

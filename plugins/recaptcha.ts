import { VueReCaptcha } from 'vue-recaptcha-v3'

export default defineNuxtPlugin(({ vueApp }) => {
    const config = useRuntimeConfig().public
    const siteKey = (config as any).public.recaptchaSiteKey

    if (siteKey) return

    vueApp.use(VueReCaptcha, {
        siteKey: (config as any).recaptcha.siteKey,
        loaderOptions: {},
    })

    vueApp.provide('recaptchaEnabled', !!siteKey)
})

import { VueReCaptcha } from 'vue-recaptcha-v3'
import RecaptchaForm from '~/plugins/recaptcha/RecaptchaForm.vue'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.use(VueReCaptcha, {
        siteKey: `${useRuntimeConfig().public.recaptcha.siteKey}`,
        loaderOptions: {
            autoHideBadge: false,
            explicitRenderParameters: {
                badge: 'bottomleft',
            },
            useRecaptchaNet: true,
        },
    })

    vueApp.component('RecaptchaForm', RecaptchaForm)
})

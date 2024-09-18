import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import WeavrCardNumberSpan from '~/plugins/weavr/components/WeavrCardNumberSpan.vue'
import WeavrCvvSpan from '~/plugins/weavr/components/WeavrCVVSpan.vue'
import WeavrKyb from '~/plugins/weavr/components/WeavrKyb.vue'
import WeavrKycBeneficiaries from '~/plugins/weavr/components/WeavrKycBeneficiaries.vue'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'

export default defineNuxtPlugin(({ vueApp }) => {
    vueApp.component('WeavrPasswordInput', WeavrPasswordInput)
    vueApp.component('WeavrCardNumberSpan', WeavrCardNumberSpan)
    vueApp.component('WeavrCvvSpan', WeavrCvvSpan)
    vueApp.component('WeavrKyb', WeavrKyb)
    vueApp.component('WeavrKycBeneficiaries', WeavrKycBeneficiaries)
    vueApp.component('WeavrKyc', WeavrKyc)

    // @ts-ignore
    const weavrComponents = window.weavr.init(useRuntimeConfig().public.multiApi.uiKey, {
        fonts: [
            {
                cssSrc: 'https://fonts.googleapis.com/css?family=Be+Vietnam:100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i',
            },
        ],
    })

    function asyncAssociate(token) {
        console.log('couple2')

        return new Promise((resolve, reject) => {
            weavrComponents.setUserToken(
                token,
                (res) => {
                    resolve(res)
                },
                (e) => {
                    reject(e)
                },
            )
        })
    }

    const weavrSetUserToken = (token) => {
        console.log('couple1')
        return asyncAssociate(token)
    }

    return {
        provide: {
            weavrComponents,
            weavrSetUserToken,
        },
    }
})

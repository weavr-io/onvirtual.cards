import Vue from 'vue'
import config from '~/config'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import WeavrCardNumberSpan from '~/plugins/weavr/components/WeavrCardNumberSpan.vue'
import WeavrCVVSpan from '~/plugins/weavr/components/WeavrCVVSpan.vue'

import WeavrKyb from '~/plugins/weavr/components/WeavrKyb.vue'
import WeavrKycBeneficiaries from '~/plugins/weavr/components/WeavrKycBeneficiaries.vue'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'

// @ts-ignore
const weavrComponents = window.weavr.init(config.api.uiKey, {
  fonts: [
    {
      cssSrc:
        'https://fonts.googleapis.com/css?family=Be+Vietnam:100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i'
    }
  ]
})

// @ts-ignore
Vue.prototype.$weavrComponents = weavrComponents

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) => {
  inject('weavrSetUserToken', (token) => {
    // @ts-ignore
    return asyncAssociate(token)
  })
}

function asyncAssociate(token) {
  return new Promise((resolve, reject) => {
    weavrComponents.setUserToken(
      token,
      (res) => {
        resolve(res)
      },
      (e) => {
        reject(e)
      }
    )
  })
}

Vue.component('weavr-password-input', WeavrPasswordInput)
Vue.component('weavr-card-number-span', WeavrCardNumberSpan)
Vue.component('weavr-cvv-span', WeavrCVVSpan)

Vue.component('weavr-kyb', WeavrKyb)
Vue.component('weavr-kyc-beneficiaries', WeavrKycBeneficiaries)
Vue.component('weavr-kyc', WeavrKyc)

declare module 'vue/types/vue' {
  interface Vue {
    $weavrComponents: any
    $weavrSetUserToken: (token) => {}
  }
}

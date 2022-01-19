import Vue from 'vue'
import WeavrPasswordInput from '~/plugins/weavr/components/WeavrPasswordInput.vue'
import WeavrCardNumberSpan from '~/plugins/weavr/components/WeavrCardNumberSpan.vue'
import WeavrCVVSpan from '~/plugins/weavr/components/WeavrCVVSpan.vue'

import WeavrKyb from '~/plugins/weavr/components/WeavrKyb.vue'
import WeavrKycBeneficiaries from '~/plugins/weavr/components/WeavrKycBeneficiaries.vue'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'
import { Plugin } from '~/node_modules/@nuxt/types'
import config from '~/config'


Vue.component('WeavrPasswordInput', WeavrPasswordInput)
Vue.component('WeavrCardNumberSpan', WeavrCardNumberSpan)
Vue.component('WeavrCvvSpan', WeavrCVVSpan)

Vue.component('WeavrKyb', WeavrKyb)
Vue.component('WeavrKycBeneficiaries', WeavrKycBeneficiaries)
Vue.component('WeavrKyc', WeavrKyc)


const weavrModules: Plugin = (context, inject) => {
  // @ts-ignore
  const weavrComponents = window.weavr.init(context.$config.multiApi.uiKey, {
    fonts: [
      {
        cssSrc:
          'https://fonts.googleapis.com/css?family=Be+Vietnam:100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i'
      }
    ]
  })


  function asyncAssociate(token) {
    return new Promise((resolve, reject) => {
      // debugger
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


  inject('weavrComponents', weavrComponents)
  inject('weavrSetUserToken', (token) => {
    return asyncAssociate(token)
  })
}

export default weavrModules

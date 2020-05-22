import Vue from 'vue'
import config from '~/config'
import WeavrForm from '~/plugins/weavr/components/WeavrForm.vue'
import WeavrInput from '~/plugins/weavr/components/WeavrInput.vue'
import WeavrSpan from '~/plugins/weavr/components/WeavrSpan.vue'
import { SecureClient } from '~/plugins/weavr/components/api'
import WeavrKyb from '~/plugins/weavr/components/WeavrKyb.vue'
import WeavrKyc from '~/plugins/weavr/components/WeavrKyc.vue'

// @ts-ignore
window.OpcUxSecureClient.init(config.api.sharedKey, {
  fonts: [
    {
      cssSrc:
        'https://fonts.googleapis.com/css?family=Be+Vietnam:100,100i,300,300i,400,400i,500,500i,600,600i,700,700i,800,800i'
    }
  ]
})

// @ts-ignore
Vue.prototype.$OpcUxSecureClient = window.OpcUxSecureClient

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default ({ app }, inject) => {
  inject('weavrSecurityAssociate', (token) => {
    // @ts-ignore
    return asyncAssociate(token)
  })
}

function asyncAssociate(token) {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    window.OpcUxSecureClient.associate(
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

Vue.component('weavr-form', WeavrForm)
Vue.component('weavr-input', WeavrInput)
Vue.component('weavr-span', WeavrSpan)
Vue.component('weavr-kyb', WeavrKyb)
Vue.component('weavr-kyc', WeavrKyc)

declare module 'vue/types/vue' {
  interface Vue {
    $OpcUxSecureClient: SecureClient
    $weavrSecurityAssociate: (token) => {}
  }
}

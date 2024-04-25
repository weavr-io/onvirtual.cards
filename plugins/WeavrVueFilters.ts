import Vue from 'vue'
import { BvToastOptions } from '~/node_modules/bootstrap-vue'

// eslint-disable-next-line no-empty-pattern
export default ({}, inject) => {
    inject('weavrToast', (message: string, options?: BvToastOptions) => {
        const vm = new Vue()

        const _options: BvToastOptions = {
            toaster: 'b-toaster-bottom-right',
            variant: 'success',
        }

        Object.assign(_options, options)

        vm.$bvToast.toast(message, _options)
    })
    inject('weavrToastError', (message: string, options?: BvToastOptions) => {
        const vm = new Vue()

        const _options: BvToastOptions = {
            toaster: 'b-toaster-bottom-right',
            variant: 'danger',
            title: 'An error occured!',
        }

        Object.assign(_options, options)

        vm.$bvToast.toast(message, _options)
    })
}

export interface WeavrToast {
    (message: string, options?: BvToastOptions): void
}

declare module 'vue/types/vue' {
    interface Vue {
        // Toast injection
        readonly $weavrToast: WeavrToast
        readonly $weavrToastError: WeavrToast
    }
}

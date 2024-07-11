import type { BvToastOptions, BvToast } from 'bootstrap-vue'

export default defineNuxtPlugin((nuxtApp) => {
    const bvToast = nuxtApp.$bvToast as BvToast

    const toast = (message: string, options?: BvToastOptions) => {
        const _options: BvToastOptions = {
            toaster: 'b-toaster-bottom-right',
            variant: 'success',
            ...options,
        }
        bvToast.toast(message, _options)
    }

    const toastError = (message: string, options?: BvToastOptions) => {
        const _options: BvToastOptions = {
            toaster: 'b-toaster-bottom-right',
            variant: 'danger',
            title: 'An error occurred!',
            ...options,
        }
        bvToast.toast(message, _options)
    }

    return {
        provide: {
            weavrToast: toast,
            weavrToastError: toastError,
        },
    }
})

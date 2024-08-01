export default defineNuxtPlugin((nuxtApp) => {
    const bvToast = nuxtApp.$bvToast as any // TODO: Revisit

    const toast = (message: string, options?: any) => {
        const _options: any = {
            toaster: 'b-toaster-bottom-right',
            variant: 'success',
            ...options,
        }
        bvToast.toast(message, _options)
    }

    const toastError = (message: string, options?: any) => {
        const _options: any = {
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

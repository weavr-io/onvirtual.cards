import { useToast, type ColorVariant } from 'bootstrap-vue-next'

interface AppToastOptions {
    title?: string
    variant?: ColorVariant
    solid?: boolean
    noCloseButton?: boolean
}

export default defineNuxtPlugin(() => {
    const { show } = useToast()

    const showToast = (message: string, options?: Partial<AppToastOptions>) => {
        show?.({
            props: {
                title: options?.title,
                body: message,
                variant: options?.variant || 'success',
                solid: options?.solid,
                noCloseButton: options?.noCloseButton,
            },
        })
    }

    const showToastError = (message: string, options?: Partial<AppToastOptions>) => {
        show?.({
            props: {
                title: options?.title || 'An error occurred!',
                body: message,
                variant: options?.variant || 'danger',
                solid: options?.solid,
                noCloseButton: options?.noCloseButton,
            },
        })
    }

    return {
        provide: {
            weavrToast: showToast,
            weavrToastError: showToastError,
        },
    }
})

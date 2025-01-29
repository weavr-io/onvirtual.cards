import { defineStore } from 'pinia'

export const useLoaderStore = defineStore('loader', () => {
    const isLoading = ref<boolean>(false)

    const setIsLoading = (val: boolean) => {
        isLoading.value = val
    }

    const start = () => {
        setIsLoading(true)
    }

    const stop = () => {
        setIsLoading(false)
    }

    return {
        isLoading,
        setIsLoading,
        start,
        stop,
    }
})

export type useLoaderStore = ReturnType<typeof useLoaderStore>

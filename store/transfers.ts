import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useBase } from '~/composables/useBase'
import { useLoaderStore } from '~/store/loader'
import type { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'

export const useTransfersStore = defineStore('transfers', () => {
    const isLoading = ref<boolean>(false)
    const { root } = useBase()
    const loader = useLoaderStore()

    const resetState = () => {
        isLoading.value = false
    }

    const setIsLoading = (loading: boolean) => {
        isLoading.value = loading
    }

    const execute = (request: CreateTransferRequest) => {
        loader.start()
        const req = root!.$apiMulti.transfers.store(request)

        req.finally(() => {
            loader.stop()
        })

        return req
    }

    return {
        resetState,
        setIsLoading,
        execute,
    }
})

export type useTransfersStore = ReturnType<typeof useTransfersStore>

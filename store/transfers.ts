import { defineStore } from 'pinia'
import { getCurrentInstance, ref } from 'vue'
import type { CreateTransferRequest } from '~/plugins/weavr-multi/api/models/transfers/requests/CreateTransferRequest'
import { useLoaderStore } from '~/store/loader'

export const useTransfersStore = defineStore('transfers', () => {
    const isLoading = ref<boolean>(false)
    const { proxy: root } = getCurrentInstance() || {}
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

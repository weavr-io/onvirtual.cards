import type { FetchError } from 'ofetch'

export const useGlobalFetch = async (url: string, options = {} as Record<string, unknown>) => {
    const error = ref<FetchError | null>(null)
    const isPending = ref(true)

    const { data, error: fetchError } = await useFetch(url, options)

    error.value = fetchError.value
    isPending.value = false

    const hasError = computed(() => error.value !== null)
    const pendingDataOrError = computed(() => isPending.value || hasError.value)

    return {
        data,
        pending: isPending,
        error: hasError,
        pendingDataOrError,
    }
}

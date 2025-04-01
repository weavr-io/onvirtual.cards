import { type ComputedRef, computed } from 'vue'

export const useApiStatus = (
    result: any,
): {
    pendingData: ComputedRef<boolean>
    fetchHasError: ComputedRef<boolean>
    pendingDataOrError: ComputedRef<boolean>
} => {
    const status = result?.status
    const error = result?.error

    if (!status || !error) {
        // eslint-disable-next-line no-console
        console.warn('result is missing status or error properties')
    }

    const pendingData = computed(() => {
        return status ? status.value === 'pending' : false
    })

    const fetchHasError = computed(() => {
        return error ? error.value !== null : false
    })

    const pendingDataOrError = computed(() => {
        return (
            (status ? status.value === 'pending' : false) || (error ? error.value !== null : false)
        )
    })

    return {
        pendingData,
        fetchHasError,
        pendingDataOrError,
    }
}

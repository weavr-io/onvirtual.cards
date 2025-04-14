import { defineStore } from 'pinia'
import type { AxiosError } from 'axios'
import type { ChangePasswordConflict } from '~/plugins/weavr-multi/api/models/error/models/ChangePasswordConflict'
import { CONFLICT_MESSAGE_CONST } from '~/plugins/weavr-multi/api/models/error/conflicts/generics/const/ConflictMessageConst'

export const useErrorsStore = defineStore('errors', () => {
    const errors = ref<any>(null)
    const conflict = ref<ChangePasswordConflict | null>(null)

    const conflictMessage = computed(() => {
        if (conflict.value) {
            const out =
                CONFLICT_MESSAGE_CONST[conflict.value.errorCode!] ?? conflict.value.errorCode
            return out ?? 'An error occurred. Please try again.'
        }

        return null
    })

    const setConflict = (_conflict: AxiosError<ChangePasswordConflict>) => {
        if (_conflict.response) {
            conflict.value = _conflict.response.data
        }
    }

    const setError = (err: unknown) => {
        errors.value = err
    }

    const resetState = () => {
        errors.value = null
        conflict.value = null
    }

    return {
        errors,
        conflict,
        conflictMessage,
        setConflict,
        setError,
        resetState,
    }
})

export type useErrorsStore = ReturnType<typeof useErrorsStore>

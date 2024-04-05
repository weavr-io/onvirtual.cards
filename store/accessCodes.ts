import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useBase } from '~/composables/useBase'
import type { AccessCodeModel } from '~/plugins/weavr-multi/api/models/access-codes/models/AccessCodeModel'

export const useAccessCodesStore = defineStore('accessCodes', () => {
    const { root } = useBase()
    const isValid = ref<boolean>(false)

    const setAccessCode = (code: string) => {
        localStorage.setItem('onv-access-code', code)
        isValid.value = true
    }

    const deleteAccessCode = () => {
        localStorage.removeItem('onv-access-code')
    }

    const verifyAccessCode = (request: AccessCodeModel) => {
        const req = root!.$apiMulti.accessCodes.verifyAccessCode(request)

        req.then(() => {
            if (request.code) {
                setAccessCode(request.code.toString())
            }
        }).catch(deleteAccessCode)

        return req
    }

    return {
        isValid,
        setAccessCode,
        deleteAccessCode,
        verifyAccessCode,
    }
})

export type useAccessCodesStore = ReturnType<typeof useAccessCodesStore>

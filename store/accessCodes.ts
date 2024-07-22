import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from '~/store/auth'
import { AccessCode } from '~/plugins/weavr-multi/api/models/access-codes'

export const useAccessCodesStore = defineStore('accessCodes', () => {
    const store = useAuthStore()
    const isValid = ref<boolean>(false)

    const setAccessCode = (code: string) => {
        localStorage.setItem('onv-access-code', code)
        isValid.value = true
    }

    const deleteAccessCode = () => {
        localStorage.removeItem('onv-access-code')
    }

    const verifyAccessCode = (request: AccessCode) => {
        const req = store.$nuxt.$apiMulti.accessCodes.verifyAccessCode(request)

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

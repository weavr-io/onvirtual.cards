import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AccessCode } from '~/plugins/weavr-multi/api/models/access-codes'

export const useAccessCodesStore = defineStore('accessCodes', () => {
    const nuxtApp = computed(() => useNuxtApp())
    const apiMulti = computed(() => nuxtApp.value.$apiMulti)

    const isValid = ref<boolean>(false)

    const setAccessCode = (code: string) => {
        localStorage.setItem('onv-access-code', code)
        isValid.value = true
    }

    const deleteAccessCode = () => {
        localStorage.removeItem('onv-access-code')
    }

    const verifyAccessCode = (request: AccessCode) => {
        const req = apiMulti.value.accessCodes.verifyAccessCode(request)

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

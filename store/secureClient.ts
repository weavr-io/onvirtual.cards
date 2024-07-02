import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SecureForm } from '~/plugins/weavr/components/api'

export const useSecureClientStore = defineStore('secureClient', () => {
    const form = ref<SecureForm | null>(null)

    const set = (f: SecureForm) => {
        form.value = f
    }

    const resetState = () => {
        form.value = null
    }

    const setForm = (form: SecureForm) => {
        set(form)
    }

    const tokenize = () => {
        return new Promise((resolve, reject) => {
            if (!form.value) reject(new Error('Form error'))

            form.value?.tokenize(
                (res) => {
                    resolve(res)
                },
                (e) => {
                    reject(e)
                },
            )
        })
    }

    return {
        set,
        resetState,
        setForm,
        tokenize,
    }
})

export type useSecureClientStore = ReturnType<typeof useSecureClientStore>

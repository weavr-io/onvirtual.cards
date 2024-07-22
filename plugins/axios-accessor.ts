import { defineNuxtPlugin } from '@nuxtjs/composition-api'
import { initializeAxios } from '~/utils/api'

export default defineNuxtPlugin((ctx) => {
    // @ts-ignore
    initializeAxios(ctx.$axiosMulti)
})

import { initializeAxios } from '~/utils/api'

export default defineNuxtPlugin((nuxtApp) => {
    // @ts-ignore
    initializeAxios(nuxtApp.$axiosMulti)
})

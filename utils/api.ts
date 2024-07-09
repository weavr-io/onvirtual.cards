import type { NuxtAxiosInstance } from '~/node_modules/@nuxtjs/axios'

// eslint-disable-next-line import/no-mutable-exports
let $axiosMulti: NuxtAxiosInstance

export function initializeAxios(axiosMulti: NuxtAxiosInstance) {
    $axiosMulti = axiosMulti
}

export { $axiosMulti }

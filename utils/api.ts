import { NuxtAxiosInstance } from '~/node_modules/@nuxtjs/axios'

// eslint-disable-next-line import/no-mutable-exports
let $api: NuxtAxiosInstance

// eslint-disable-next-line import/no-mutable-exports
let $axiosMulti: NuxtAxiosInstance

export function initializeAxios(api: NuxtAxiosInstance, axiosMulti: NuxtAxiosInstance) {
  $api = api
  $axiosMulti = axiosMulti
}

export { $api, $axiosMulti }

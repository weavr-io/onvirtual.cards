import { NuxtAxiosInstance } from '~/node_modules/@nuxtjs/axios'

let $api: NuxtAxiosInstance

export function initializeAxios(api: NuxtAxiosInstance) {
  $api = api
}

export { $api }

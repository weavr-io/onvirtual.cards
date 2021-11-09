import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const accessor: Plugin = ({ store }) => {
  // @ts-ignore
  initializeAxios(store.$api, store.$apiMulti)
}

export default accessor

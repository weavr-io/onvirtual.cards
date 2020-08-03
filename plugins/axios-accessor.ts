import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

// @ts-ignore
const accessor: Plugin = (ctxt) => {
  // @ts-ignore
  initializeAxios(ctxt.store.$api)
}

export default accessor

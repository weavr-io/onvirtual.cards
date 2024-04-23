import { Plugin } from '@nuxt/types'
import { initializeAxios } from '~/utils/api'

const accessor: Plugin = (ctx, _inject) => {
    // @ts-ignore
    initializeAxios(ctx.$axiosMulti)
}

export default accessor

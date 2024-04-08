import { createPinia } from 'pinia'
import type { Plugin } from '@nuxt/types'

const piniaPlugin: Plugin = ({ app }) => {
    app.use(createPinia())
}

export default piniaPlugin

import { defineNuxtMiddleware } from '@nuxtjs/composition-api'
import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtMiddleware((_) => {
    const { errors } = initialiseStores(['errors'])

    return errors?.resetState()
})

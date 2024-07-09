import { initialiseStores } from '~/utils/pinia-store-accessor'

export default defineNuxtRouteMiddleware(() => {
    const { errors } = initialiseStores(['errors'])

    return errors?.resetState()
})

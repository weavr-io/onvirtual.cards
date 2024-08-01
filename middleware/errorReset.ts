import { useStores } from '~/composables/useStores'

export default defineNuxtRouteMiddleware(() => {
    const { errors } = useStores(['errors'])

    return errors?.resetState()
})

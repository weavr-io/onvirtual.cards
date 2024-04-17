import { useBase } from '~/composables/useBase'

export default function () {
    const { errorsStore } = useBase()

    return errorsStore.resetState()
}

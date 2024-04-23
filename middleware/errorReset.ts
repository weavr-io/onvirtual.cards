import { initialiseStores } from '~/utils/pinia-store-accessor'

export default function () {
    const { errors } = initialiseStores(['errors'])

    return errors?.resetState()
}

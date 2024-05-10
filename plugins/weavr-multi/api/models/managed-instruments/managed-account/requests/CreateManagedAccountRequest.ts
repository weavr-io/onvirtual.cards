import { z } from 'zod'
import { IDModel } from '~/plugins/weavr-multi/api/models/common'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

const DEFAULT_FRIENDLY_NAME = 'Main Account'

export interface CreateManagedAccountRequest {
    profileId: IDModel
    friendlyName: string
    currency: CurrencyEnum
    tag?: string
}

const ManagedAccountSchema = z.object({
    profileId: preprocessEmptyAsUndefined(z.string()),
    friendlyName: preprocessEmptyAsUndefined(z.literal(DEFAULT_FRIENDLY_NAME)),
    currency: preprocessEmptyAsUndefined(z.nativeEnum(CurrencyEnum)),
})

type ManagedAccount = z.infer<typeof ManagedAccountSchema>

const INITIAL_MA_REQUEST = () => {
    return {
        profileId: '',
        friendlyName: DEFAULT_FRIENDLY_NAME,
        currency: CurrencyEnum.EUR,
    } as unknown as ManagedAccount
}

export { ManagedAccount, ManagedAccountSchema, INITIAL_MA_REQUEST }

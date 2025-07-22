import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'

const CreateManagedCardSchema = z.object({
    profileId: z.string(),
    friendlyName: preprocessEmptyAsUndefined(z.string().max(50)),
    nameOnCard: preprocessEmptyAsUndefined(z.string().max(27)),
    cardholderMobileNumber: preprocessEmptyAsUndefined(z.string().optional()),
    billingAddress: preprocessEmptyAsUndefined(z.string().optional()),
    mode: z.nativeEnum(ManagedCardModeEnum),
    currency: z.nativeEnum(CurrencyEnum).nullable(),
})

type CreateManagedCard = z.infer<typeof CreateManagedCardSchema>

const INITIAL_MANAGED_CARD_REQUEST = () => {
    return {
        profileId: undefined,
        friendlyName: undefined,
        nameOnCard: undefined,
        cardholderMobileNumber: undefined,
        billingAddress: undefined,
        mode: ManagedCardModeEnum.PREPAID_MODE,
        currency: undefined,
    } as unknown as CreateManagedCard
}

export { type CreateManagedCard, CreateManagedCardSchema, INITIAL_MANAGED_CARD_REQUEST }

import { z } from 'zod'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'
import { IDModel } from '~/plugins/weavr-multi/api/models/common'
import { AddressModel } from '~/plugins/weavr-multi/api/models/common/models/AddressModel'
import { CurrencyEnum } from '~/plugins/weavr-multi/api/models/common/enums/CurrencyEnum'
import { ManagedCardModeEnum } from '~/plugins/weavr-multi/api/models/managed-instruments/managed-cards/enums/ManagedCardModeEnum'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

export interface CreateManagedCardRequest {
    profileId: IDModel
    tag?: string
    friendlyName: string
    nameOnCard: string
    cardholderMobileNumber: string
    billingAddress: AddressModel
    mode: ManagedCardModeEnum
    currency: CurrencyEnum
}

const ManagedCardSchema = z.object({
    profileId: preprocessEmptyAsUndefined(z.string()),
    friendlyName: preprocessEmptyAsUndefined(
        z.string().min(1).max(50, { message: INVALID_FEEDBACK_CONST.maxLength50 }),
    ),
    nameOnCard: preprocessEmptyAsUndefined(
        z.string().min(1).max(27, { message: INVALID_FEEDBACK_CONST.maxLength27 }),
    ),
    cardholderMobileNumber: preprocessEmptyAsUndefined(z.string().optional()),
    billingAddress: preprocessEmptyAsUndefined(z.string().optional()),
    mode: z.nativeEnum(ManagedCardModeEnum),
    currency: preprocessEmptyAsUndefined(z.nativeEnum(CurrencyEnum)),
})

type ManagedCard = z.infer<typeof ManagedCardSchema>

const INITIAL_MANAGED_CARD_REQUEST = {
    profileId: undefined,
    friendlyName: undefined,
    nameOnCard: undefined,
    cardholderMobileNumber: undefined,
    billingAddress: undefined,
    mode: ManagedCardModeEnum.PREPAID_MODE,
    currency: undefined,
} as unknown as ManagedCard

export { ManagedCard, ManagedCardSchema, INITIAL_MANAGED_CARD_REQUEST }

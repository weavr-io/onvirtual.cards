import { z } from 'zod'
import {
    INITIAL_MOBILE_REQUEST,
    MobileSchema,
} from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import {
    DateSchema,
    INITIAL_DATE_REQUEST,
} from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { OccupationTypeEnumSchema } from '~/plugins/weavr-multi/api/models/identities/consumers/enums/OccupationTypeEnum'
import {
    AddressSchema,
    INITIAL_ADDRESS,
} from '~/plugins/weavr-multi/api/models/common/models/AddressModel'

const ConsumersRootUserRequestSchema = z.object({
    name: z.string(),
    surname: z.string(),
    email: z.string(),
    mobile: MobileSchema,
    dateOfBirth: DateSchema,
    occupation: OccupationTypeEnumSchema,
    address: AddressSchema.optional(),
})

type ConsumersRootUserRequest = z.infer<typeof ConsumersRootUserRequestSchema>

const INITIAL_CONSUMERS_ROOT_USER_REQUEST = () => {
    return {
        name: undefined,
        surname: undefined,
        email: undefined,
        mobile: { ...INITIAL_MOBILE_REQUEST() },
        dateOfBirth: { ...INITIAL_DATE_REQUEST() },
        occupation: undefined,
        address: { ...INITIAL_ADDRESS() },
    } as unknown as ConsumersRootUserRequest
}

export {
    ConsumersRootUserRequestSchema,
    ConsumersRootUserRequest,
    INITIAL_CONSUMERS_ROOT_USER_REQUEST,
}

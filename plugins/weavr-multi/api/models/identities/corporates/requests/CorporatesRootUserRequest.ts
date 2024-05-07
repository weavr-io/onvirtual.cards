import { z } from 'zod'
import {
    INITIAL_MOBILE_REQUEST,
    MobileModel,
    MobileSchema,
} from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import {
    CompanyPositionEnum,
    CompanyPositionEnumSchema,
} from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyPositionEnum'
import { DateModel, DateSchema } from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { INVALID_FEEDBACK_CONST } from '~/local/const/InvalidFeedbackConst'

export interface CorporatesRootUserRequest {
    name: string
    surname: string
    email: string
    mobile: MobileModel
    companyPosition: CompanyPositionEnum
    dateOfBirth?: DateModel
}

const CorporatesRootUserRequestSchema = z.object({
    name: z.string().max(20, { message: INVALID_FEEDBACK_CONST.maxLength20 }),
    surname: z.string().max(20, { message: INVALID_FEEDBACK_CONST.maxLength20 }),
    email: z.string().email(),
    mobile: MobileSchema,
    companyPosition: CompanyPositionEnumSchema,
    dateOfBirth: DateSchema.optional(),
})

type CorporatesRootUserRequestType = z.infer<typeof CorporatesRootUserRequestSchema>

const INITIAL_CORPORATES_ROOT_USER_REQUEST = {
    name: undefined,
    surname: undefined,
    email: undefined,
    mobile: INITIAL_MOBILE_REQUEST,
    companyPosition: undefined,
    dateOfBirth: undefined,
} as unknown as CorporatesRootUserRequestType

export {
    CorporatesRootUserRequestSchema,
    CorporatesRootUserRequestType,
    INITIAL_CORPORATES_ROOT_USER_REQUEST,
}

import { z } from 'zod'
import {
    INITIAL_MOBILE_REQUEST,
    type MobileModel,
    MobileSchema,
} from '~/plugins/weavr-multi/api/models/common/models/MobileModel'
import {
    CompanyPositionEnum,
    CompanyPositionEnumSchema,
} from '~/plugins/weavr-multi/api/models/identities/corporates/enums/CompanyPositionEnum'
import {
    type DateModel,
    DateSchema,
} from '~/plugins/weavr-multi/api/models/common/models/DateModel'
import { preprocessEmptyAsUndefined } from '~/utils/zodHelpers'

export interface CorporatesRootUserRequest {
    name: string
    surname: string
    email: string
    mobile: MobileModel
    companyPosition: CompanyPositionEnum
    dateOfBirth?: DateModel
}

const CorporatesRootUserRequestSchema = z.object({
    name: preprocessEmptyAsUndefined(z.string().max(20)),
    surname: preprocessEmptyAsUndefined(z.string().max(20)),
    email: preprocessEmptyAsUndefined(z.string().email()),
    mobile: MobileSchema,
    companyPosition: CompanyPositionEnumSchema,
    dateOfBirth: DateSchema.optional(),
})

const RootUserMobileSchema = CorporatesRootUserRequestSchema.pick({ mobile: true })

type CorporatesRootUserRequestType = z.infer<typeof CorporatesRootUserRequestSchema>

const INITIAL_CORPORATES_ROOT_USER_REQUEST = () => {
    return {
        name: undefined,
        surname: undefined,
        email: undefined,
        mobile: { ...INITIAL_MOBILE_REQUEST() },
        companyPosition: undefined,
        dateOfBirth: undefined,
    } as unknown as CorporatesRootUserRequestType
}

export {
    CorporatesRootUserRequestSchema,
    type CorporatesRootUserRequestType,
    RootUserMobileSchema,
    INITIAL_CORPORATES_ROOT_USER_REQUEST,
}
